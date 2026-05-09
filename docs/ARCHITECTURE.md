# Architecture — TennisLV 正式版视频上传与分析架构

## 核心决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 视频存储 | 对象存储直传（COS/OSS/S3） | 不经过后端，避免带宽瓶颈和内存压力 |
| 上传鉴权 | 后端签发预签名 URL | 前端无权限直接操作存储桶 |
| AI 调用 | 关键帧 + 多模态大模型 | 不传完整视频，控制 token 成本 |
| 分析策略 | 用户主动触发，非上传即分析 | 上传 ≠ 分析，用户需点击"开始视频增强评级" |
| 结果缓存 | video_id 级别 | 同一视频不重复分析 |
| 视频调整幅度 | 最多 ±0.5 档 | 视频分析只是问卷评级的校准，不是替代 |

---

## 1. 视频上传流程

```
┌──────────┐     (1) POST /videos     ┌──────────┐
│          │ ────────────────────────> │          │
│  前端    │     (2) { video, presignedUrl }    │  后端    │
│  (H5/    │ <──────────────────────── │  Server  │
│   小程序) │                           │          │
│          │     (3) PUT presignedUrl  │          │
│          │ ────────────────────────> │          │
│          │                           │          │
│          │     (4) 200 OK            │          │
│          │ <──────────────────────── │          │
│          │                           └──────────┘
│          │     (5) POST /videos/:id/complete
│          │ ────────────────────────> ┌──────────┐
│          │                           │  后端    │
│          │                           │  校验    │
│          │                           └──────────┘
└──────────┘

                              ┌──────────────┐
                              │  对象存储     │
                              │  COS/OSS/S3  │
                              └──────────────┘
                                     ▲
                                     │ (3) 直传
                                     │
                              ┌──────┴───────┐
                              │  前端        │
                              └──────────────┘
```

### 1.1 获取上传凭证

```
POST /api/v1/videos
Content-Type: application/json

Request:
{
  "filename": "my_forehand.mp4",
  "fileSize": 15728640,
  "contentType": "video/mp4"
}

Response (201):
{
  "video": {
    "id": "vid_7a3b2c",
    "status": "uploading",
    "createdAt": "2026-05-09T08:00:00Z"
  },
  "presignedUrl": "https://cos.ap-guangzhou.myqcloud.com/videos/vid_7a3b2c.mp4?...",
  "expiresAt": "2026-05-09T08:15:00Z"
}
```

**后端逻辑：**

1. 校验 `fileSize` 不超过 100MB
2. 校验 `contentType` 为 `video/mp4` 或 `video/quicktime`
3. 检查用户当前 `uploading` 状态的视频数（最多 3 个并发）
4. 生成 `video_id`，写入数据库，`status = 'uploading'`
5. 调用 COS SDK 生成预签名 PUT URL，有效期 15 分钟
6. 返回 `video` 对象和 `presignedUrl`

### 1.2 前端直传

前端拿到 `presignedUrl` 后，用 `PUT` 请求直接将视频文件上传到对象存储。

- 使用 `XMLHttpRequest` 或 `fetch`，监听 `onprogress` 展示进度条
- 设置 `Content-Type` 头为原始 MIME 类型
- 上传失败可重试（重试需重新获取预签名 URL）

### 1.3 通知完成

```
POST /api/v1/videos/:id/complete

Response (200):
{
  "video": {
    "id": "vid_7a3b2c",
    "status": "validating",
    "fileSize": 15728640
  }
}
```

### 1.4 后端异步校验

`complete` 触发异步校验任务：

1. **格式校验**：检查 COS 文件 MIME 类型，仅接受 `video/mp4` / `video/quicktime` (MOV)
2. **时长校验**：通过 ffprobe 或 COS 媒体信息 API 获取时长，5-30 秒
3. **大小校验**：检查 COS 文件实际大小，不超过 100MB
4. **分辨率校验**：宽 ≥ 480px，高 ≥ 360px；宽高比 0.5-2.0

校验结果写入 `videos.validation_result`，通过则 `status = 'ready_for_analysis'`，不通过则 `status = 'rejected'`。

---

## 2. 视频分析流程

### 2.1 触发分析

用户必须在结果页点击"开始视频增强评级"才会触发。上传完成 ≠ 自动分析。

```
POST /api/v1/analyses
Content-Type: application/json

Request:
{
  "videoId": "vid_7a3b2c",
  "ratingId": "rat_abc123",
  "confirm": true
}
```

**Pre-check 链（按顺序，短路返回）：**

| # | 检查项 | 失败响应 |
|---|--------|---------|
| 1 | video 是否存在 | 404 |
| 2 | video.userId 是否匹配当前用户 | 403 |
| 3 | video.status 是否为 `ready_for_analysis` | 422 "视频校验未通过" |
| 4 | 是否已有 `completed` 的 analysis_job | 200 cached |
| 5 | 是否有 `processing` 的 analysis_job | 202 "分析进行中" |
| 6 | 用户 quota 是否充足 | 429 "本月配额已用完" |

### 2.2 关键帧抽取

```
POST /api/v1/videos/:id/extract-keyframes (内部触发，不直接暴露)

处理逻辑：
1. 从 COS 下载视频到临时磁盘（或使用 COS 视频截帧 API）
2. 使用 ffmpeg 在时间轴上均匀抽取 6-10 帧：
   ffmpeg -i input.mp4 -vf "fps=1/(duration/8)" -s 1280x720 frame_%03d.jpg
3. 每帧压缩到 720p（1280x720）或 960p
4. 上传关键帧到 COS：keyframes/{video_id}/frame_001.jpg ...
5. 写入 video_frames 表
6. 更新 video.status = 'keyframes_extracted'
```

### 2.3 AI 分析

```
POST /api/v1/analyses/:id/run (内部，由消息队列消费)

Input:
- 6-10 张关键帧（base64 或 COS 临时签名 URL）
- 用户问卷答案（作为上下文，辅助 AI 判断）
- System prompt（定义输出 JSON schema）

Model: GPT-4o / Claude Opus / Qwen-VL-Max

Output (JSON):
{
  "problems": [
    {
      "code": "P001",
      "severity": "high",
      "title": "准备姿势重心偏高",
      "description": "...",
      "observation": "...关键帧 #3 显示...",
      "impact": "...",
      "correction": "...",
      "trainingTask": "..."
    }
  ],
  "overallScore": 72,
  "confidence": 85,
  "summary": "整体评估...",
  "priorityFix": "准备姿势重心偏高",
  "ntrpAdjustment": 0.0
}
```

**约束：**
- 必须输出结构化 JSON
- `ntrpAdjustment` 范围：-0.5 到 +0.5
- 必须引用具体关键帧编号来描述问题
- prompt 中注明：本系统定位是业余网球评级校准，不是专业教练诊断

### 2.4 评级融合

视频分析完成后，与问卷评级融合：

```
finalLevel = clamp(questionnaireLevel + ntrpAdjustment, 1.0, 7.0)
```

- 视频最多上调或下调 0.5 档
- 上调条件：视频中动作质量明显优于问卷回答
- 下调条件：视频中动作质量明显低于问卷回答
- `ratingType` 更新为 `video_enhanced`

### 2.5 结果缓存

`video_id` 级别的分析结果缓存：
- 完成一次分析后，`analysis_jobs.status = 'completed'`
- 再次对同一 `video_id` 发起分析请求 → 直接返回缓存结果
- 缓存不清除，除非用户删除视频

---

## 3. 删除设计

### 3.1 删除视频

```
DELETE /api/v1/videos/:id

流程：
1. 校验 video.userId 是否匹配当前用户
2. 如果有已完成的 analysis_jobs，标记为 orphaned
3. 如果有关联的 rating（通过 videoId），解除关联（rating.videoId = null）
4. 删除 COS 上的视频文件和所有关键帧
5. 删除 video_frames 记录
6. 软删除 video 记录（videos.deletedAt = now）
```

### 3.2 删除评级记录

```
DELETE /api/v1/ratings/:id

流程：
1. 校验 rating.userId 是否匹配当前用户
2. 如果有关联的 video，解除关联但不删除视频
3. 删除关联的 peer_verifications
4. 删除关联的 analysis_jobs（如果 analysis 未被其他 rating 引用）
5. 删除关联的 reports
6. 软删除 rating 记录（ratings.deletedAt = now）
```

### 3.3 级联规则

| 删除对象 | 关联的 Video | 关联的 Analysis | 关联的 PeerVerification | 关联的 Report |
|---------|-------------|----------------|------------------------|---------------|
| Video | — | orphaned | — | — |
| Rating | 解除关联 | 删除（如独占） | 删除 | 删除 |

---

## 4. 完整数据库模型

### 4.1 users

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openid        VARCHAR(64) UNIQUE,          -- 微信 openid
  unionid       VARCHAR(64),                 -- 微信 unionid
  nickname       VARCHAR(64) NOT NULL,
  avatar_url     VARCHAR(512),
  phone         VARCHAR(20),
  city          VARCHAR(64),
  city_code     VARCHAR(16),
  quota         INTEGER NOT NULL DEFAULT 3,   -- 月配额
  quota_reset_at TIMESTAMPTZ,                -- 配额重置时间
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);
```

### 4.2 ratings

```sql
CREATE TABLE ratings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  rating_type   VARCHAR(32) NOT NULL,         -- questionnaire_estimate/video_enhanced/peer_verified/coach_verified
  mode          VARCHAR(16) NOT NULL DEFAULT 'standard',
  answers       JSONB NOT NULL,               -- [{questionId, value}]
  result        JSONB NOT NULL,               -- RatingResult
  video_id      UUID REFERENCES videos(id),   -- 可选
  share_code    VARCHAR(8) UNIQUE NOT NULL,
  view_count    INTEGER NOT NULL DEFAULT 0,
  disclaimer    TEXT NOT NULL,                 -- 免责声明文本
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);

CREATE INDEX idx_ratings_user_id ON ratings(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ratings_share_code ON ratings(share_code);
```

### 4.3 videos

```sql
CREATE TABLE videos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  filename          VARCHAR(256) NOT NULL,
  object_key        VARCHAR(512) NOT NULL,     -- COS/S3 key
  file_size         INTEGER NOT NULL,          -- bytes
  duration_ms       INTEGER,                   -- 毫秒
  width             INTEGER,                   -- 分辨率宽
  height            INTEGER,                   -- 分辨率高
  fps               REAL,                      -- 帧率
  content_type      VARCHAR(64) NOT NULL,      -- video/mp4, video/quicktime
  status            VARCHAR(32) NOT NULL DEFAULT 'uploading',
  -- status 枚举: uploading | uploaded | validating | ready_for_analysis | keyframes_extracted | rejected
  keyframe_count    INTEGER NOT NULL DEFAULT 0,
  validation_result JSONB,                     -- VideoValidationResult | null
  cos_bucket        VARCHAR(128),
  cos_region        VARCHAR(64),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at         TIMESTAMPTZ
);

CREATE INDEX idx_videos_user_id ON videos(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_videos_status ON videos(status) WHERE deleted_at IS NULL;
```

### 4.4 video_frames

```sql
CREATE TABLE video_frames (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id      UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  frame_index   INTEGER NOT NULL,             -- 1-10
  object_key    VARCHAR(512) NOT NULL,         -- COS key
  width         INTEGER NOT NULL,
  height        INTEGER NOT NULL,
  file_size     INTEGER NOT NULL,
  extracted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(video_id, frame_index)
);

CREATE INDEX idx_video_frames_video_id ON video_frames(video_id);
```

### 4.5 analysis_jobs

```sql
CREATE TABLE analysis_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id        UUID NOT NULL REFERENCES videos(id),
  rating_id       UUID REFERENCES ratings(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(32) NOT NULL DEFAULT 'pending',
  -- status: pending | extracting_frames | analyzing | completed | failed | cached
  model_name      VARCHAR(64),                -- gpt-4o / claude-opus-4-7
  prompt_version  VARCHAR(16),                -- prompt 模板版本号
  input_frame_count INTEGER NOT NULL DEFAULT 0,
  token_usage     JSONB,                      -- {inputTokens, outputTokens, totalTokens}
  result          JSONB,                      -- AnalysisResult | null
  ntrp_adjustment REAL,                       -- -0.5 ~ +0.5
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analysis_jobs_video_id ON analysis_jobs(video_id);
CREATE INDEX idx_analysis_jobs_user_id ON analysis_jobs(user_id);
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);
```

### 4.6 ai_usage_logs

```sql
CREATE TABLE ai_usage_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  analysis_job_id UUID REFERENCES analysis_jobs(id),
  model_name      VARCHAR(64) NOT NULL,
  prompt_version  VARCHAR(16) NOT NULL,
  input_tokens    INTEGER NOT NULL,
  output_tokens   INTEGER NOT NULL,
  total_tokens    INTEGER NOT NULL,
  cost_cents      INTEGER NOT NULL,           -- 费用（分）
  latency_ms      INTEGER NOT NULL,           -- 响应耗时
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
```

### 4.7 peer_verifications

```sql
CREATE TABLE peer_verifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id     UUID NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
  voter_id      UUID REFERENCES users(id),       -- Phase 2 之后改为必填
  voter_nickname VARCHAR(64),                     -- Phase 1 mock
  vote          VARCHAR(16) NOT NULL,             -- agree / overrated / underrated
  has_played    BOOLEAN NOT NULL DEFAULT false,
  comment       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_peer_verifications_rating_id ON peer_verifications(rating_id);
```

### 4.8 reports

```sql
CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id   UUID NOT NULL REFERENCES analysis_jobs(id),
  user_id       UUID NOT NULL REFERENCES users(id),
  share_code    VARCHAR(8) UNIQUE NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. 状态机

### 5.1 视频状态流转

```
uploading ──> uploaded ──> validating ──> ready_for_analysis ──> keyframes_extracted
                                 │                                      │
                                 └──> rejected                          │
                                                                        │
                          ┌─────────────────────────────────────────────┘
                          │ (用户点击"开始视频增强评级")
                          │
                          └──> [analysis_jobs 创建，status = pending]
                                        │
                                        └──> extracting_frames ──> analyzing ──> completed
                                                                        │
                                                                        └──> failed
```

### 5.2 分析任务状态流转

```
pending ──> extracting_frames ──> analyzing ──> completed
                │                    │
                └──> failed          └──> failed
```

---

## 6. API 端点总览

| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/v1/videos` | 创建视频记录，返回预签名上传 URL |
| POST | `/api/v1/videos/:id/complete` | 通知上传完成，触发异步校验 |
| GET | `/api/v1/videos/:id` | 查询视频状态 |
| GET | `/api/v1/videos` | 用户视频列表 |
| DELETE | `/api/v1/videos/:id` | 删除视频及关联文件 |
| POST | `/api/v1/analyses` | 开始分析（需 confirm） |
| GET | `/api/v1/analyses/:id` | 查询分析状态/结果 |
| GET | `/api/v1/analyses` | 用户分析列表 |
| GET | `/api/v1/reports/:id` | 查询报告（支持分享） |
| POST | `/api/v1/ratings` | 创建评级记录 |
| GET | `/api/v1/ratings/:id` | 查询评级详情 |
| DELETE | `/api/v1/ratings/:id` | 删除评级记录 |
| POST | `/api/v1/ratings/:id/verify` | 球友认证 |
| GET | `/api/v1/users/me` | 当前用户信息 |
| GET | `/api/v1/users/me/quota` | 配额查询 |

---

## 7. Prompt 管理

### 7.1 版本控制

```typescript
interface PromptTemplate {
  version: string;            // "2.0.0"
  model: string;              // "claude-opus-4-7"
  systemPrompt: string;       // 系统提示词
  outputSchema: object;       // 预期的 JSON Schema
  maxFrames: number;          // 最大关键帧数
  frameResolution: string;    // "720p" | "960p"
  created_at: string;
  active: boolean;
}
```

### 7.2 视频分析 Prompt 核心指令

```
你是网球动作分析专家。

输入：
- 用户问卷答案：[{questionId, value}]
- 关键帧图像：6-10 张，按时间顺序排列

任务：
1. 基于关键帧分析用户的击球动作
2. 结合问卷答案校准评估
3. 输出结构化 JSON

输出约束：
- ntrpAdjustment 范围：-0.5 到 +0.5（只能在校准范围内调整）
- 每个问题必须引用具体关键帧编号
- 严重程度定义：high=影响击球效果的明显问题，medium=影响一致性的技术偏差，low=可优化的细节
- severity 必须分布在 3 个等级（不能全部 high）
- confidence 范围：0-100，低于 30 表示图像质量不足以分析

输出 JSON schema：
{
  "problems": [...],
  "overallScore": 0-100,
  "confidence": 0-100,
  "summary": "string",
  "priorityFix": "string",
  "ntrpAdjustment": -0.5 ~ 0.5
}
```

---

## 8. 安全与限流

| 措施 | 说明 |
|------|------|
| 上传并发限制 | 每用户最多 3 个 `uploading` 状态视频 |
| 分析频率限制 | 每用户每小时最多 2 次分析 |
| 月配额 | 每用户每月 3 次（可重置） |
| 预签名 URL 有效期 | 15 分钟 |
| 文件大小上限 | 100MB |
| 视频时长范围 | 5-30 秒 |
| 关键帧存储 | 与原视频同一 bucket，不同前缀 |
| AI 调用日志 | 完整记录每次调用的 token 和费用 |
| 软删除 | 用户数据不物理删除，保留 30 天后清理 |
