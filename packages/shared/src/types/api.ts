import type { Analysis, TrainingTemplate, Report, Video, StrokeType } from './entities';

// ── Request DTOs ──

export interface UploadVideoRequest {
  strokeType: StrokeType;
}

export interface StartAnalysisRequest {
  videoId: string;
  /** 必须显式确认，防止误触发 AI 调用 */
  confirm: boolean;
}

// ── Response DTOs ──

export interface UploadVideoResponse {
  video: Video;
  uploadUrl: string;
}

export interface StartAnalysisResponse {
  cached: boolean;
  analysis: Analysis;
  report?: Report;
  templates?: TrainingTemplate[];
}

export interface AnalysisDetailResponse {
  analysis: Analysis;
  report?: Report;
  templates: TrainingTemplate[];
}

export interface AnalysisListResponse {
  analyses: Analysis[];
}

export interface ReportDetailResponse {
  report: Report;
  analysis: Analysis;
  templates: TrainingTemplate[];
}

// ── Error ──

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
