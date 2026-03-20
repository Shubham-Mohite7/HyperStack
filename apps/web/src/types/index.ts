/*
 * Frontend type definitions.
 *
 * These mirror the shapes produced by the API pipeline service.
 * If the API response structure changes, update these types first
 * to surface type errors throughout the component tree.
 */

export interface Requirements {
  domain: string;
  app_type: string;
  team_size: string;
  scale: string;
  has_realtime: boolean;
  has_ai_ml: boolean;
  has_payments: boolean;
  has_auth: boolean;
  needs_mobile: boolean;
  needs_seo: boolean;
  data_heavy: boolean;
  budget_sensitive: boolean;
  needs_queue: boolean;
  key_constraints: string[];
  primary_language_preference: string;
  confidence: number;
}

export interface Alternative {
  name: string;
  trade_off: string;
}

export interface Recommendation {
  layer: string;
  primary_choice: string;
  confidence: number;
  reason: string;
  key_features_used: string[];
  alternative: Alternative;
}

export interface ScoredResult {
  recommendations: Recommendation[];
  architecture_pattern: string;
  overall_confidence: number;
  critical_warnings: string[];
}

export interface PredictionMeta {
  model: string;
  durationMs: number;
  timestamp: string;
}

export interface PredictionResult {
  requirements: Requirements;
  scored: ScoredResult;
  report: string;
  meta: PredictionMeta;
}

export interface ApiResponse {
  success: boolean;
  data: PredictionResult;
}

export type PipelineStage = "idle" | "extracting" | "scoring" | "reporting" | "done" | "error";

export interface PipelineState {
  stage: PipelineStage;
  result: PredictionResult | null;
  error: string | null;
}

/* Layer color map used consistently across all components */
export const LAYER_COLORS: Record<string, string> = {
  Frontend:    "#3b82f6",
  Backend:     "#8b5cf6",
  Database:    "#10b981",
  DevOps:      "#f59e0b",
  Auth:        "#ec4899",
  "AI/ML":     "#06b6d4",
  Queue:       "#f97316",
  "Real-time": "#fb923c",
  Monitoring:  "#84cc16",
};

export const STAGE_LABELS: Record<PipelineStage, string> = {
  idle:       "Ready",
  extracting: "Extracting requirements",
  scoring:    "Scoring tech stacks",
  reporting:  "Generating report",
  done:       "Complete",
  error:      "Error",
};
