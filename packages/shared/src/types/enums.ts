// ── Shared ──

/** 动作类型（保留） */
export type StrokeType = 'forehand' | 'backhand' | 'serve';

/** 视频状态（保留） */
export type VideoStatus =
  | 'uploading'
  | 'uploaded'
  | 'keyframes_extracted'
  | 'qualified'
  | 'rejected';

/** 分析状态（保留） */
export type AnalysisStatus =
  | 'pending'
  | 'analyzing'
  | 'completed'
  | 'failed'
  | 'rejected';

/** 问题严重程度（保留） */
export type ProblemSeverity = 'high' | 'medium' | 'low';

// ── Rating System ──

/** 评级模式 */
export type RatingMode = 'quick' | 'standard';

/** 评级类型（分层评级体系） */
export type RatingType = 'questionnaire_estimate' | 'video_enhanced' | 'peer_verified' | 'coach_verified';

/** AI 预估等级（NTRP 风格，1.0-7.0，每 0.5 一级） */
export type RatingLevel =
  | '1.0' | '1.5'
  | '2.0' | '2.5'
  | '3.0' | '3.5'
  | '4.0' | '4.5'
  | '5.0' | '5.5'
  | '6.0' | '6.5'
  | '7.0';

/** NTRP 风格等级名称 */
export type LevelName =
  | '初学入门'
  | '基础练习'
  | '基础建立期'
  | '初级进阶级'
  | '中级'
  | '中级稳定'
  | '中高级'
  | '高级入门'
  | '高级'
  | '准专业级'
  | '专业级'
  | '专业高级'
  | '精英级';

/** 球员风格标签 */
export type PlayStyleTag =
  | '底线型'
  | '进攻型'
  | '防守型'
  | '全面型'
  | '上网型'
  | '发球上网型'
  | '磨王型'
  | '正手优先'
  | '反手稳定'
  | '发球优先'
  | '双打友好';

/** 球友认证结果 */
export type PeerVote = 'agree' | 'overrated' | 'underrated';

/** 评级维度 */
export type RatingDimension = 'videoPerformance' | 'consistency' | 'serve' | 'matchExperience';
