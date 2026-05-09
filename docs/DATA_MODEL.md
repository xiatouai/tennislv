# Data Model — TennisLV

## 设计原则

1. 为小程序和同城约球预留字段，当前 Phase 1 不全部实现
2. 所有表使用 UUID 作为主键
3. 时间字段统一用 ISO 8601 字符串
4. 软删除（deletedAt）用于用户相关数据

## Phase 1 实现状态

当前 Phase 1 使用内存 Map mock，表结构中标注了实现状态：
- ✅ 已在 types 中定义并 mock
- 📋 types 中已定义，API 未实现
- 🔮 仅预留设计，types 未定义

---

## 用户域

### User ✅ (部分)

```typescript
interface User {
  id: string;                    // UUID
  nickname: string;
  avatarUrl: string | null;
  openid: string | null;         // 🔮 微信 openid，Phase 2
  unionid: string | null;        // 🔮 微信 unionid
  phone: string | null;          // 🔮 手机号
  city: string | null;           // 🔮 Phase 3
  cityCode: string | null;       // 🔮 城市编码
  homeCourts: string[];          // 🔮 常打球场 ID 列表，Phase 3
  playFrequency: string | null;  // 🔮 打球频率，Phase 3
  bio: string | null;            // 🔮 个人简介
  quota: number;                 // 评级配额（默认 3 次/月）
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

---

## 评级域

### RatingQuestion ✅

```typescript
interface RatingQuestion {
  id: string;                    // q1-q8
  text: string;
  options: { value: string; label: string }[];
  multiSelect?: boolean;
  maxSelect?: number;
}
```

### RatingAnswer ✅

```typescript
interface RatingAnswer {
  questionId: string;
  value: string | string[];      // 单选 string，多选 string[]
}
```

### RatingResult ✅

```typescript
interface RatingResult {
  ratingType: RatingType;        // questionnaire_estimate | video_enhanced | peer_verified | coach_verified
  aiEstimatedLevel: string;      // "3.0"
  levelName: LevelName;          // "中级入门"
  suitableRange: string;         // "2.5-3.5"
  confidence: number;            // 0-100
  confidenceLabel: string;       // 低 / 中 / 较高 / 高
  styleTags: PlayStyleTag[];     // 底线型、进攻型 等
  dimensions: DimensionScore[];  // 维度评分
  nextLevelTarget: string;       // "3.5"
  nextLevelAdvice: string;
  persona: string;
  selfAssessmentComparison: string;
  generatedAt: string;
}
```

### Rating 📋 (完整记录，Phase 2 持久化)

```typescript
interface Rating {
  id: string;
  userId: string;                // Phase 2
  ratingType: RatingType;
  mode: RatingMode;
  answers: RatingAnswer[];
  result: RatingResult;
  videoId: string | null;        // 关联视频
  shareCode: string;             // 分享码
  viewCount: number;             // 分享查看次数
  createdAt: string;
}
```

### DimensionScore ✅

```typescript
interface DimensionScore {
  dimension: RatingDimension;    // videoPerformance | consistency | serve | matchExperience
  label: string;                 // "底线稳定性"
  score: number;                 // 0-100，展示格式 "75/100"
  comment: string;               // 维度评价
}
```

---

## 视频域

### Video ✅ (部分)

```typescript
interface Video {
  id: string;
  userId: string;                // Phase 2
  filename: string;
  fileUrl: string;
  strokeType: StrokeType;
  status: VideoStatus;           // uploading | uploaded | keyframes_extracted | qualified | rejected
  keyframePaths: string[];
  validationResult: VideoValidationResult | null;
  createdAt: string;
  updatedAt: string;
}
```

### VideoValidationResult ✅

```typescript
interface VideoValidationResult {
  passed: boolean;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  issues: string[];
  checkedAt: string;
}
```

---

## 认证域

### PeerVerification ✅

```typescript
interface PeerVerification {
  id: string;
  ratingId: string;
  voterNickname: string;         // Phase 2 改为 voterId
  voterId: string | null;        // 🔮 Phase 2
  vote: PeerVote;                // agree | overrated | underrated
  comment: string;
  hasPlayed: boolean;            // 是否和评级人打过球
  createdAt: string;
}
```

### CoachCertification 🔮 (Phase 5)

```typescript
interface CoachCertification {
  id: string;
  ratingId: string;
  coachId: string;
  certifiedLevel: string;        // 教练评定的等级
  comment: string;
  createdAt: string;
}
```

---

## 社交域（Phase 3-4）

### Friendship 🔮

```typescript
interface Friendship {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

### Court 🔮

```typescript
interface Court {
  id: string;
  name: string;                  // 球场名称
  city: string;
  cityCode: string;
  district: string;              // 区/县
  address: string;               // 详细地址
  latitude: number;
  longitude: number;
  courtCount: number;            // 场地数量
  hasLights: boolean;            // 是否有灯光
  hasRoof: boolean;              // 是否有顶棚
  surface: string;               // 场地类型：硬地/红土/草地
  createdAt: string;
}
```

---

## 约球域（Phase 4）

### Match 🔮

```typescript
interface Match {
  id: string;
  creatorId: string;
  courtId: string;
  title: string;                 // 约球标题
  date: string;                  // 日期 YYYY-MM-DD
  startTime: string;             // 开始时间 HH:mm
  endTime: string;               // 结束时间 HH:mm
  totalSpots: number;            // 总名额
  remainingSpots: number;        // 剩余名额
  minLevel: string;              // 最低等级要求 "2.5"
  maxLevel: string;              // 最高等级要求 "3.5"
  fee: number;                   // 人均费用（分）
  note: string;                  // 备注
  status: MatchStatus;           // open | full | cancelled | completed
  createdAt: string;
  updatedAt: string;
}

type MatchStatus = 'open' | 'full' | 'cancelled' | 'completed';
```

### MatchRegistration 🔮

```typescript
interface MatchRegistration {
  id: string;
  matchId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

### MatchReview 🔮

```typescript
interface MatchReview {
  id: string;
  matchId: string;
  reviewerId: string;
  targetId: string;              // 被评价用户
  rating: number;                // 水平评分 1-5
  sportsmanship: number;         // 球品评分 1-5
  comment: string;
  createdAt: string;
}
```

---

## 关系图

```
User ──< Rating ──< PeerVerification
  │         │
  │         └── Video
  │
  ├──< Friendship >── User
  │
  ├──< Match (creator) ──< MatchRegistration >── User
  │         │
  │         └── Court
  │
  └──< MatchReview (reviewer/target)
```

## 枚举类型汇总

```typescript
type RatingType = 'questionnaire_estimate' | 'video_enhanced' | 'peer_verified' | 'coach_verified';
type RatingMode = 'quick' | 'standard';
type RatingLevel = '1.0' | '1.5' | '2.0' | '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5' | '6.0' | '6.5' | '7.0';
type LevelName = '初学入门' | '基础练习' | '基础建立期' | '初级进阶级' | '中级入门' | '中级稳定' | '中高级' | '高级入门' | '高级' | '准专业级' | '专业级' | '专业高级' | '精英级';
type PlayStyleTag = '底线型' | '进攻型' | '防守型' | '全面型' | '上网型' | '发球上网型' | '磨王型' | '正手优先' | '反手稳定' | '发球优先' | '双打友好';
type PeerVote = 'agree' | 'overrated' | 'underrated';
type RatingDimension = 'videoPerformance' | 'consistency' | 'serve' | 'matchExperience';
```

## Phase 2 数据库迁移计划

当引入 PostgreSQL + Prisma 时：

1. 创建 `User` 表（增加 openid、unionid、phone）
2. 创建 `Rating` 表（关联 userId）
3. 创建 `PeerVerification` 表（关联 ratingId、voterId）
4. 创建 `Video` 表（关联 userId）
5. 暴露小程序 API 端点的迁移路径
6. H5 评级数据可通过 shareCode 迁移至数据库
