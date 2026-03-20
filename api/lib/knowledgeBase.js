/*
 * Tech stack knowledge base.
 *
 * Each entry represents one technology option across a specific architectural
 * layer. This corpus is passed to the LLM as retrieval context in Stage 2 of
 * the pipeline. Adding, removing, or editing entries here directly affects
 * the quality and scope of recommendations.
 *
 * Fields:
 *   id             - Unique identifier used for deduplication
 *   name           - Display name shown in the UI
 *   layer          - Architectural layer this technology belongs to
 *   description    - One-sentence summary of the technology
 *   best_for       - Use cases where this technology excels
 *   avoid_when     - Situations where this is a poor fit
 *   scale_ceiling  - Approximate maximum scale before hitting limits
 *   learning_curve - Relative effort for an experienced engineer to onboard
 *   cost           - Rough cost model
 *   maturity       - Production readiness signal
 *   tags           - Keywords used to improve semantic retrieval accuracy
 */

export const STACK_KB = [
  // ---------------------------------------------------------------------------
  // Frontend
  // ---------------------------------------------------------------------------
  {
    id: "next_js", name: "Next.js", layer: "Frontend",
    description: "React meta-framework with SSR, SSG, App Router, and edge functions.",
    best_for: ["SaaS dashboards", "e-commerce", "content sites", "full-stack apps", "startup MVPs"],
    avoid_when: ["pure static site with no interactivity", "team only knows Vue"],
    scale_ceiling: "millions of users", learning_curve: "medium",
    cost: "free or Vercel", maturity: "production",
    tags: ["react", "ssr", "ssg", "typescript", "fullstack", "vercel", "saas", "ecommerce"]
  },
  {
    id: "react_vite", name: "React + Vite", layer: "Frontend",
    description: "Lightweight React SPA setup with Vite build tool and fast HMR.",
    best_for: ["SPAs", "internal tools", "admin panels", "quick prototypes"],
    avoid_when: ["SEO matters", "need SSR", "content-heavy public sites"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["react", "spa", "vite", "typescript", "internal tool", "admin"]
  },
  {
    id: "vue_nuxt", name: "Vue 3 + Nuxt 3", layer: "Frontend",
    description: "Progressive Vue framework with full SSR and SSG support.",
    best_for: ["teams new to frameworks", "content sites", "CMSs"],
    avoid_when: ["React-heavy team", "large React library dependency"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["vue", "ssr", "ssg", "content", "cms", "fullstack"]
  },
  {
    id: "svelte_kit", name: "SvelteKit", layer: "Frontend",
    description: "Compiler-based framework with zero-overhead reactivity and tiny bundles.",
    best_for: ["performance-critical apps", "small teams", "embedded widgets"],
    avoid_when: ["large team needs React ecosystem"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["svelte", "performance", "small bundle", "embedded"]
  },
  {
    id: "react_native", name: "React Native + Expo", layer: "Frontend",
    description: "Cross-platform mobile framework for iOS and Android from a single codebase.",
    best_for: ["mobile apps", "cross-platform", "startup MVPs on mobile", "consumer apps"],
    avoid_when: ["heavy native GPU or AR features", "game development"],
    scale_ceiling: "millions", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["mobile", "ios", "android", "cross-platform", "consumer", "react"]
  },
  {
    id: "flutter", name: "Flutter", layer: "Frontend",
    description: "Google UI toolkit for mobile, web, and desktop from a single Dart codebase.",
    best_for: ["pixel-perfect mobile UIs", "cross-platform including desktop", "fintech"],
    avoid_when: ["team only knows JavaScript", "simple web apps"],
    scale_ceiling: "millions", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["mobile", "desktop", "dart", "fintech", "cross-platform"]
  },

  // ---------------------------------------------------------------------------
  // Backend
  // ---------------------------------------------------------------------------
  {
    id: "fastapi", name: "FastAPI", layer: "Backend",
    description: "Modern async Python API framework with auto-generated OpenAPI docs and ML integration.",
    best_for: ["ML/AI APIs", "data science backends", "microservices", "Python teams"],
    avoid_when: ["Node-only team", "pure frontend project"],
    scale_ceiling: "very large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["python", "api", "ml", "ai", "async", "microservice", "rest", "data"]
  },
  {
    id: "express", name: "Express.js", layer: "Backend",
    description: "Minimal Node.js web framework with a massive ecosystem.",
    best_for: ["REST APIs", "JavaScript full-stack", "real-time apps", "BFF layer"],
    avoid_when: ["CPU-intensive tasks", "ML-heavy backends"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["nodejs", "javascript", "api", "rest", "realtime", "socket"]
  },
  {
    id: "nestjs", name: "NestJS", layer: "Backend",
    description: "Opinionated TypeScript-first Node.js framework with dependency injection.",
    best_for: ["enterprise backends", "large teams", "complex business logic", "microservices"],
    avoid_when: ["small teams", "simple CRUD APIs", "rapid prototype"],
    scale_ceiling: "enterprise", learning_curve: "high",
    cost: "free", maturity: "production",
    tags: ["nodejs", "typescript", "enterprise", "microservice", "di"]
  },
  {
    id: "django", name: "Django + DRF", layer: "Backend",
    description: "Full-featured Python framework with ORM, admin panel, auth, and REST API support.",
    best_for: ["content platforms", "data-heavy apps", "rapid prototyping", "admin dashboards"],
    avoid_when: ["real-time heavy apps", "microservices", "Node-only team"],
    scale_ceiling: "large", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["python", "orm", "admin", "content", "ecommerce", "rapid"]
  },
  {
    id: "go_gin", name: "Go + Gin", layer: "Backend",
    description: "High-performance Go HTTP framework — fast, low memory, statically compiled.",
    best_for: ["high-throughput APIs", "financial systems", "infrastructure tools"],
    avoid_when: ["no Go experience", "ML integration needed", "rapid prototyping"],
    scale_ceiling: "massive", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["go", "performance", "high-throughput", "fintech", "low-latency"]
  },

  // ---------------------------------------------------------------------------
  // Database
  // ---------------------------------------------------------------------------
  {
    id: "postgresql", name: "PostgreSQL", layer: "Database",
    description: "Advanced open-source RDBMS with ACID compliance, JSON support, and full-text search.",
    best_for: ["general purpose", "financial data", "complex queries", "structured data"],
    avoid_when: ["need horizontal write sharding at extreme scale"],
    scale_ceiling: "very large", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["sql", "relational", "acid", "json", "financial", "general", "structured"]
  },
  {
    id: "mongodb", name: "MongoDB", layer: "Database",
    description: "Leading document database with flexible schema and horizontal scaling.",
    best_for: ["flexible schemas", "content management", "catalogs", "rapid prototyping"],
    avoid_when: ["complex relationships", "financial transactions", "strong consistency required"],
    scale_ceiling: "massive", learning_curve: "low",
    cost: "free or Atlas", maturity: "production",
    tags: ["nosql", "document", "flexible", "schema-less", "content", "catalog"]
  },
  {
    id: "supabase", name: "Supabase", layer: "Database",
    description: "Open-source Firebase alternative — Postgres plus Auth, Storage, Realtime, and Edge Functions.",
    best_for: ["startup MVPs", "full-stack apps", "teams wanting BaaS plus SQL", "realtime features"],
    avoid_when: ["need full database control", "extreme scale with custom sharding"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free tier", maturity: "production",
    tags: ["baas", "postgres", "realtime", "auth", "storage", "startup", "mvp"]
  },
  {
    id: "redis", name: "Redis", layer: "Database",
    description: "In-memory data store for caching, sessions, pub/sub, and rate limiting.",
    best_for: ["caching", "sessions", "leaderboards", "rate limiting", "pub/sub"],
    avoid_when: ["primary database", "data that must always persist without configuration"],
    scale_ceiling: "massive", learning_curve: "low",
    cost: "free or Upstash", maturity: "production",
    tags: ["cache", "session", "queue", "pubsub", "realtime", "rate-limit", "in-memory"]
  },
  {
    id: "pinecone", name: "Pinecone / pgvector", layer: "Database",
    description: "Vector database for similarity search — essential for RAG and semantic search.",
    best_for: ["AI apps", "RAG pipelines", "semantic search", "recommendation engines"],
    avoid_when: ["no AI or ML component in the project"],
    scale_ceiling: "large", learning_curve: "medium",
    cost: "free tier", maturity: "production",
    tags: ["vector", "ai", "rag", "semantic", "embeddings", "recommendation"]
  },
  {
    id: "clickhouse", name: "ClickHouse", layer: "Database",
    description: "Columnar OLAP database for analytical queries across billions of rows.",
    best_for: ["analytics", "time-series", "data warehouses", "log analytics", "BI dashboards"],
    avoid_when: ["OLTP workloads", "frequent row updates", "small datasets"],
    scale_ceiling: "petabyte", learning_curve: "medium",
    cost: "free or cloud", maturity: "production",
    tags: ["analytics", "olap", "columnar", "timeseries", "bi", "data-warehouse"]
  },
  {
    id: "firebase", name: "Firebase", layer: "Database",
    description: "Google BaaS with Firestore, Auth, Hosting, Cloud Functions, and Realtime DB.",
    best_for: ["mobile apps", "realtime collaboration", "fast MVPs", "Google ecosystem"],
    avoid_when: ["complex queries needed", "SQL required", "vendor lock-in is a concern"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free tier", maturity: "production",
    tags: ["baas", "realtime", "mobile", "nosql", "google", "mvp"]
  },

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------
  {
    id: "nextauth", name: "NextAuth.js", layer: "Auth",
    description: "Authentication library for Next.js with 50+ OAuth providers and JWT sessions.",
    best_for: ["Next.js apps", "social login", "B2C apps"],
    avoid_when: ["non-Next.js project"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["auth", "oauth", "nextjs", "jwt", "social-login", "b2c"]
  },
  {
    id: "clerk", name: "Clerk", layer: "Auth",
    description: "Drop-in authentication with pre-built UI, MFA, and org management.",
    best_for: ["SaaS products", "B2B with org management", "teams wanting zero auth code"],
    avoid_when: ["cost-sensitive at scale", "full auth customization required"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free tier then paid", maturity: "production",
    tags: ["auth", "saas", "b2b", "mfa", "organizations", "drop-in"]
  },
  {
    id: "auth0", name: "Auth0", layer: "Auth",
    description: "Enterprise identity platform with RBAC, SSO, and compliance certifications.",
    best_for: ["enterprise clients", "compliance-heavy industries", "SSO requirements"],
    avoid_when: ["cost-sensitive", "simple auth needs"],
    scale_ceiling: "enterprise", learning_curve: "medium",
    cost: "free tier then paid", maturity: "production",
    tags: ["auth", "enterprise", "sso", "rbac", "compliance", "identity"]
  },

  // ---------------------------------------------------------------------------
  // DevOps
  // ---------------------------------------------------------------------------
  {
    id: "vercel", name: "Vercel", layer: "DevOps",
    description: "Deployment platform optimised for Next.js with edge network and zero-config CI/CD.",
    best_for: ["Next.js", "frontend deployments", "startups", "JAMstack"],
    avoid_when: ["heavy backend", "cost-sensitive at scale", "self-hosted required"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free tier", maturity: "production",
    tags: ["deployment", "frontend", "nextjs", "cdn", "serverless", "edge", "cicd"]
  },
  {
    id: "aws", name: "AWS", layer: "DevOps",
    description: "Full cloud infrastructure with compute, storage, ML, and networking at any scale.",
    best_for: ["enterprise", "regulated industries", "complex infrastructure", "global scale"],
    avoid_when: ["solo developers", "MVP stage", "no DevOps experience"],
    scale_ceiling: "unlimited", learning_curve: "high",
    cost: "pay per use", maturity: "production",
    tags: ["cloud", "enterprise", "scale", "ec2", "lambda", "s3", "global"]
  },
  {
    id: "docker_k8s", name: "Docker + Kubernetes", layer: "DevOps",
    description: "Container orchestration for production microservices with horizontal scaling.",
    best_for: ["microservices", "multi-service apps", "high availability requirements"],
    avoid_when: ["single service", "no DevOps engineer", "MVP stage"],
    scale_ceiling: "unlimited", learning_curve: "high",
    cost: "infrastructure cost", maturity: "production",
    tags: ["containers", "microservices", "orchestration", "kubernetes", "ha"]
  },
  {
    id: "railway", name: "Railway / Render", layer: "DevOps",
    description: "Simple deployment platforms with free tiers for backends, databases, and workers.",
    best_for: ["MVPs", "side projects", "API backends", "small teams"],
    avoid_when: ["enterprise SLA needed", "very high traffic"],
    scale_ceiling: "medium", learning_curve: "low",
    cost: "free tier", maturity: "production",
    tags: ["deployment", "backend", "mvp", "simple", "free", "startup"]
  },

  // ---------------------------------------------------------------------------
  // AI / ML
  // ---------------------------------------------------------------------------
  {
    id: "openai_api", name: "OpenAI API", layer: "AI/ML",
    description: "State-of-the-art LLM API with GPT-4o for chat, vision, and function calling.",
    best_for: ["AI chat", "RAG", "function calling", "vision apps", "code generation"],
    avoid_when: ["cost-sensitive", "data privacy required", "offline requirement"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "pay per token", maturity: "production",
    tags: ["llm", "ai", "chat", "gpt", "vision", "function-calling", "rag", "nlp"]
  },
  {
    id: "langchain", name: "LangChain / LlamaIndex", layer: "AI/ML",
    description: "Frameworks for building LLM-powered apps with RAG, agents, and memory.",
    best_for: ["RAG pipelines", "AI agents", "document Q&A", "multi-step AI workflows"],
    avoid_when: ["simple single LLM call", "team new to LLMs"],
    scale_ceiling: "large", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["rag", "agents", "llm", "ai", "documents", "qa", "pipeline"]
  },
  {
    id: "huggingface", name: "HuggingFace Transformers", layer: "AI/ML",
    description: "Open-source ML models for NLP, vision, and audio — run locally or via API.",
    best_for: ["custom ML", "private data", "fine-tuning", "on-premise AI"],
    avoid_when: ["no ML expertise", "OpenAI quality needed immediately"],
    scale_ceiling: "large", learning_curve: "high",
    cost: "free or cloud GPU", maturity: "production",
    tags: ["ml", "nlp", "vision", "fine-tune", "private", "on-premise", "custom-model"]
  },

  // ---------------------------------------------------------------------------
  // Real-time
  // ---------------------------------------------------------------------------
  {
    id: "socketio", name: "Socket.IO", layer: "Real-time",
    description: "WebSocket library with automatic fallbacks, room-based messaging, and broadcasting.",
    best_for: ["chat apps", "live collaboration", "gaming", "notifications", "live dashboards"],
    avoid_when: ["simple REST is sufficient", "serverless architecture"],
    scale_ceiling: "large", learning_curve: "low",
    cost: "free", maturity: "production",
    tags: ["websocket", "realtime", "chat", "collaboration", "gaming", "notifications"]
  },

  // ---------------------------------------------------------------------------
  // Queue
  // ---------------------------------------------------------------------------
  {
    id: "bullmq", name: "BullMQ", layer: "Queue",
    description: "Production job queue for Node.js backed by Redis with priorities and retries.",
    best_for: ["email sending", "background jobs", "scheduled tasks", "video processing"],
    avoid_when: ["no Redis available", "Python backend — use Celery instead"],
    scale_ceiling: "large", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["queue", "jobs", "async", "worker", "email", "background", "scheduled"]
  },
  {
    id: "celery", name: "Celery", layer: "Queue",
    description: "Distributed task queue for Python with Redis or RabbitMQ as the broker.",
    best_for: ["Python backends", "long-running tasks", "scheduled jobs", "data processing"],
    avoid_when: ["Node.js backend — use BullMQ instead"],
    scale_ceiling: "large", learning_curve: "medium",
    cost: "free", maturity: "production",
    tags: ["queue", "python", "async", "worker", "scheduled", "distributed"]
  },

  // ---------------------------------------------------------------------------
  // Monitoring
  // ---------------------------------------------------------------------------
  {
    id: "sentry", name: "Sentry", layer: "Monitoring",
    description: "Error tracking and performance monitoring with real-time alerts and stack traces.",
    best_for: ["production apps", "error tracking", "performance profiling"],
    avoid_when: [],
    scale_ceiling: "unlimited", learning_curve: "low",
    cost: "free tier", maturity: "production",
    tags: ["monitoring", "error", "performance", "alerts", "debugging", "production"]
  },
  {
    id: "datadog", name: "Datadog", layer: "Monitoring",
    description: "Full-stack observability with APM, logs, metrics, dashboards, and alerts.",
    best_for: ["enterprise monitoring", "microservices", "cloud-native apps"],
    avoid_when: ["cost-sensitive", "small single-service apps"],
    scale_ceiling: "unlimited", learning_curve: "medium",
    cost: "paid", maturity: "production",
    tags: ["monitoring", "apm", "metrics", "enterprise", "observability", "logs"]
  },
];
