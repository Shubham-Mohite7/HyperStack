/*
 * Shared type definitions used across both the web client and API server.
 * Any structural change here will surface type errors in both apps at compile time.
 */

export const LAYERS = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Auth",
  "AI/ML",
  "Queue",
  "Real-time",
  "Monitoring",
];

export const ARCHITECTURE_PATTERNS = [
  "Monolith",
  "Monorepo",
  "Microservices",
  "Serverless",
  "JAMstack",
];

/*
 * The structured requirements object produced by Stage 1 of the pipeline.
 * All fields are required — the LLM is prompted to always emit all keys.
 */
export const RequirementsSchema = {
  domain: "",
  app_type: "",
  team_size: "",
  scale: "",
  has_realtime: false,
  has_ai_ml: false,
  has_payments: false,
  has_auth: false,
  needs_mobile: false,
  needs_seo: false,
  data_heavy: false,
  budget_sensitive: false,
  needs_queue: false,
  key_constraints: [],
  primary_language_preference: "",
  confidence: 0,
};

export const LAYER_COLORS = {
  Frontend:   "#3b82f6",
  Backend:    "#8b5cf6",
  Database:   "#10b981",
  DevOps:     "#f59e0b",
  Auth:       "#ec4899",
  "AI/ML":    "#06b6d4",
  Queue:      "#f97316",
  "Real-time":"#fb923c",
  Monitoring: "#84cc16",
};
