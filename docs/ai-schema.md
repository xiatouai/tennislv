# AI 分析数据结构

## AI 输入

```typescript
interface AIInput {
  model: string;           // 模型名称
  promptVersion: string;   // Prompt 版本
  frames: FrameData[];     // 关键帧 (base64)
  strokeType: StrokeType;  // 动作类型
}

interface FrameData {
  index: number;     // 帧序号 (1-8)
  timestamp: number; // 视频时间戳 (秒)
  base64: string;    // 图片 base64
}
```

## AI 输出 (AnalysisResult)

```typescript
interface AnalysisResult {
  problems: AnalysisProblem[]; // 最多 3 个问题
  overallScore: number;        // 综合评分 0-100
  summary: string;             // 总体评价
}

interface AnalysisProblem {
  code: string;       // 问题编码 (P001-P009)
  severity: 'high' | 'medium' | 'low';
  description: string;
}
```

## 问题编码映射

| Code | 动作类型 | 问题描述 |
|------|---------|---------|
| P001 | forehand | 准备姿势重心偏高 |
| P002 | forehand | 挥拍轨迹偏移 |
| P003 | forehand | 随挥不完整 |
| P004 | backhand | 引拍幅度过大 |
| P005 | backhand | 转体不充分 |
| P006 | backhand | 击球点过近 |
| P007 | serve | 抛球不稳定 |
| P008 | serve | 发力链断裂 |
| P009 | serve | 落地脚位置不当 |

## Token 用量

```typescript
interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}
```

## 约束

- 每个 video_id 最多生成 1 次正式 analysis
- 同一 video_id 不可并发分析
- 不合格视频直接 rejected，不消耗 quota
- 已完成的 analysis 永久缓存，不重复调用 AI
