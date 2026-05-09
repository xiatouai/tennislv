import type { StrokeType, VideoStatus, AnalysisStatus, ProblemSeverity, RatingMode, RatingType, RatingLevel, LevelName, PlayStyleTag, PeerVote, RatingDimension } from './enums';
export type { StrokeType, VideoStatus, AnalysisStatus, ProblemSeverity, RatingMode, RatingType, RatingLevel, LevelName, PlayStyleTag, PeerVote, RatingDimension };

// ── User ──

export interface User {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  quota: number;
  createdAt: string;
  updatedAt: string;
}

// ── Video ──

export interface VideoValidationResult {
  passed: boolean;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  issues: string[];
  checkedAt: string;
}

export interface Video {
  id: string;
  userId: string;
  filename: string;
  fileUrl: string;
  strokeType: StrokeType;
  status: VideoStatus;
  keyframePaths: string[];
  validationResult: VideoValidationResult | null;
  createdAt: string;
  updatedAt: string;
}

// ── Analysis ──

export interface AnalysisProblem {
  code: string;
  severity: ProblemSeverity;
  title: string;
  description: string;
  observation: string;
  impact: string;
  correction: string;
  trainingTask: string;
}

export interface AnalysisResult {
  problems: AnalysisProblem[];
  overallScore: number;
  confidence: number;
  summary: string;
  priorityFix: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface Analysis {
  id: string;
  videoId: string;
  userId: string;
  status: AnalysisStatus;
  modelName: string | null;
  promptVersion: string | null;
  inputFrameCount: number;
  tokenUsage: TokenUsage | null;
  result: AnalysisResult | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Template ──

export interface TrainingTemplate {
  id: string;
  problemCode: string;
  strokeType: StrokeType;
  title: string;
  description: string;
  suggestions: string[];
  createdAt: string;
}

// ── Report ──

export interface Report {
  id: string;
  analysisId: string;
  userId: string;
  shareCode: string;
  generatedAt: string;
}

// ── Rating System ──

/** 评级问卷选项 */
export interface RatingOption {
  value: string;
  label: string;
  /** 选项详细描述，展示给用户 */
  description?: string;
  /** 后台评分数值，不在 UI 显示 */
  scoreValue?: number;
}

/** 评级问卷问题 */
export interface RatingQuestion {
  id: string;
  text: string;
  options: RatingOption[];
  multiSelect?: boolean;
  maxSelect?: number;
}

/** 评级问卷答案 */
export interface RatingAnswer {
  questionId: string;
  /** 单选为 string，多选为 string[] */
  value: string | string[];
}

/** 评级维度得分 */
export interface DimensionScore {
  dimension: RatingDimension;
  label: string;
  score: number;
  comment: string;
}

/** AI 评级结果 */
export interface RatingResult {
  /** 评级类型 */
  ratingType: RatingType;
  /** AI 预估等级，如 "3.0" */
  aiEstimatedLevel: string;
  /** NTRP 风格等级名称，如 "中级" */
  levelName: LevelName;
  /** 适合约球范围 */
  suitableRange: string;
  /** 评级置信度 0-100 */
  confidence: number;
  /** 置信度标签：低 / 中 / 较高 / 高 */
  confidenceLabel: string;
  /** 球员风格标签 */
  styleTags: PlayStyleTag[];
  /** 各维度评分 */
  dimensions: DimensionScore[];
  /** 下一等级目标 */
  nextLevelTarget: string;
  /** 下一等级建议 */
  nextLevelAdvice: string;
  /** 当前等级典型特征 */
  persona: string;
  /** 与自评对比 */
  selfAssessmentComparison: string;
  /** 等级称号，如 "业余中级球友" */
  nickname: string;
  /** 社交化短评 */
  socialComment: string;
  /** 你的优势 (2 条) */
  strengths: string[];
  /** 当前提升重点 (1 条) */
  focusArea: string;
  /** 生成时间 */
  generatedAt: string;
  /** 问卷预估等级（仅 video_enhanced 时填充） */
  questionnaireLevel?: string;
  /** 视频调整原因（仅 video_enhanced 时填充） */
  adjustmentReason?: string;
  /** 球场寄语（中文） */
  courtMessage: string;
  /** 球场寄语（英文） */
  courtMessageEn: string;
  /** 分享卡 CTA 文案 */
  ctaText: string;
}

/** 评级提交请求 */
export interface SubmitRatingRequest {
  mode: RatingMode;
  ratingType: RatingType;
  videoIds: string[];
  answers: RatingAnswer[];
}

/** 球友认证记录 */
export interface PeerVerification {
  id: string;
  ratingId: string;
  voterNickname: string;
  vote: PeerVote;
  comment: string;
  createdAt: string;
}

/** 评级卡分享数据 */
export interface RatingCard {
  id: string;
  userId: string;
  userNickname: string;
  mode: RatingMode;
  result: RatingResult;
  peerVotes: PeerVerification[];
  shareCode: string;
  disclaimer: string;
}

