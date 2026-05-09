# API 接口设计

Base URL: `/api/v1`

## 用户模块

### GET /users/me

获取当前用户信息及剩余 quota。

**Response:**
```json
{
  "user": {
    "id": "user-001",
    "nickname": "Test Player",
    "quota": 10
  }
}
```

## 视频模块

### POST /videos/upload

上传视频（返回预签名 URL，MVP 阶段直接 mock）。

**Request:**
```json
{ "strokeType": "forehand" }
```

**Response:**
```json
{
  "video": {
    "id": "v-xxx",
    "strokeType": "forehand",
    "status": "uploaded"
  },
  "uploadUrl": "https://cos.example.com/upload/v-xxx"
}
```

### POST /videos/:id/extract-keyframes

触发关键帧抽取（mock）。

### POST /videos/:id/validate

触发视频校验（mock）。

## 分析模块

### POST /analyses

开始分析。调用 AI 前完成全部 pre-check。

**Request:**
```json
{ "videoId": "v-xxx", "confirm": true }
```

**Pre-checks（按顺序）:**
1. video 是否存在
2. video 是否属于当前用户
3. 是否已有 completed analysis → 返回缓存
4. 是否正在 analyzing → 返回当前任务状态
5. 视频是否通过基础校验 → 未通过则 rejected
6. 是否已抽取关键帧
7. 用户是否有剩余 quota

**Response (202, 分析中):**
```json
{
  "cached": false,
  "analysis": {
    "id": "a-xxx",
    "status": "analyzing",
    "modelName": "mock-model-v1",
    "promptVersion": "1.0.0",
    "inputFrameCount": 6
  }
}
```

**Response (200, 已完成/缓存):**
```json
{
  "cached": true,
  "analysis": { "id": "a-xxx", "status": "completed", "result": {...} },
  "report": { "id": "r-xxx", "shareCode": "ABC123" },
  "templates": [...]
}
```

### GET /analyses/:id

获取分析状态和结果。

### GET /analyses

获取当前用户的所有分析。

## 报告模块

### GET /reports/:id

通过 report ID 获取报告（支持分享链接）。

### POST /reports/:analysisId

从已完成的分析生成报告。

## 训练模板模块

### GET /templates?strokeType=forehand

按动作类型获取训练建议模板。
