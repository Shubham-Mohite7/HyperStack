/*
 * Prediction pipeline service.
 *
 * Orchestrates the three-stage AI recommendation process:
 *
 *   Stage 1 — Requirement extraction
 *     Parses the free-text project description into a structured requirements
 *     object using a strict JSON-mode prompt.
 *
 *   Stage 2 — Stack scoring
 *     Performs keyword-based retrieval against the knowledge base, then passes
 *     the top candidates to the LLM for confidence-scored selection per layer.
 *
 *   Stage 3 — Report generation
 *     Synthesises Stages 1 and 2 into a full markdown recommendation report
 *     with install commands, trade-off analysis, and a scalability roadmap.
 */

import { groq, DEFAULT_MODEL } from "../lib/groqClient.js";
import { STACK_KB } from "../lib/knowledgeBase.js";
import { extractJson } from "../lib/jsonParser.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Calls the Groq chat completion API with the given system and user prompts.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options
 * @returns {Promise<string>} Raw text content from the model
 */
async function callLLM(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.1, maxTokens = 4096 } = options;

  const completion = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0].message.content;
}

/**
 * Retrieves the top-N most relevant stack entries from the knowledge base
 * using keyword scoring against the project description and requirements.
 *
 * This is a lightweight TF-IDF-style approach that avoids the dependency on
 * a vector embedding library while still producing meaningfully ranked results.
 *
 * @param {string} query - Enriched search string built from the description + requirements
 * @param {number} topK  - Maximum number of entries to return
 * @returns {Array} Ranked stack entries
 */
function retrieveRelevantStacks(query, topK = 20) {
  const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);

  const scored = STACK_KB.map((entry) => {
    const corpus = [
      entry.name,
      entry.description,
      ...entry.best_for,
      ...entry.tags,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const term of terms) {
      // Weight exact tag matches more heavily than description matches
      if (entry.tags.some((t) => t.includes(term))) score += 2;
      else if (corpus.includes(term)) score += 1;
    }

    return { ...entry, _score: score };
  });

  return scored
    .filter((e) => e._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, topK);
}

// ---------------------------------------------------------------------------
// Stage prompts
// ---------------------------------------------------------------------------

const STAGE1_SYSTEM = [
  "You are a senior software architect.",
  "Extract structured requirements from a project description.",
  "Respond with valid JSON only — no markdown, no explanation, no backticks.",
  "All string fields must be single strings, not arrays.",
].join(" ");

const STAGE2_SYSTEM = [
  "You are a principal software architect with 15 years of industry experience.",
  "Score technology choices against project requirements with precision.",
  "Respond with valid JSON only — no markdown, no backticks.",
].join(" ");

const STAGE3_SYSTEM = [
  "You are a world-class software architect authoring a client-facing technical recommendation report.",
  "Be specific, opinionated, and actionable.",
  "Use concrete package names and CLI commands where relevant.",
].join(" ");

// ---------------------------------------------------------------------------
// Pipeline class
// ---------------------------------------------------------------------------

export class PredictionPipeline {
  /**
   * Runs all three pipeline stages and returns the combined result object.
   *
   * @param {string} description - Raw project description from the user
   * @returns {Promise<{ requirements, scored, report, meta }>}
   */
  async run(description) {
    const startedAt = Date.now();

    const requirements = await this._stage1(description);
    const scored = await this._stage2(description, requirements);
    const report = await this._stage3(description, requirements, scored);

    return {
      requirements,
      scored,
      report,
      meta: {
        model: DEFAULT_MODEL,
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // -----------------------------------------------------------------------

  async _stage1(description) {
    const prompt = [
      "Extract structured requirements from this project description:",
      "",
      `PROJECT: ${description}`,
      "",
      "Return a JSON object with exactly these keys.",
      "app_type must be a single string like 'web app' or 'web app + mobile app'.",
      "",
      JSON.stringify({
        domain: "e.g. SaaS, e-commerce, mobile app, AI tool, data platform",
        app_type: "web app | mobile app | API | desktop app | data pipeline",
        team_size: "solo | small (2-5) | medium (6-20) | large (20+)",
        scale: "prototype | startup | growth | enterprise",
        has_realtime: "true or false",
        has_ai_ml: "true or false",
        has_payments: "true or false",
        has_auth: "true or false",
        needs_mobile: "true or false",
        needs_seo: "true or false",
        data_heavy: "true or false",
        budget_sensitive: "true or false",
        needs_queue: "true or false",
        key_constraints: ["list of important constraints"],
        primary_language_preference: "python | javascript | java | go | any",
        confidence: "0.0 to 1.0",
      }, null, 2),
    ].join("\n");

    const raw = await callLLM(STAGE1_SYSTEM, prompt, { temperature: 0.05 });
    return extractJson(raw, "Stage1");
  }

  // -----------------------------------------------------------------------

  async _stage2(description, requirements) {
    const enrichedQuery = [
      description,
      requirements.domain || "",
      requirements.app_type || "",
      requirements.has_realtime ? "realtime websocket" : "",
      requirements.has_ai_ml ? "ai machine learning llm" : "",
      requirements.needs_mobile ? "mobile ios android" : "",
      requirements.has_payments ? "payments stripe billing" : "",
      requirements.scale || "",
    ].join(" ");

    const candidates = retrieveRelevantStacks(enrichedQuery, 20);

    const candidateSummary = candidates.map((s) => ({
      id: s.id,
      name: s.name,
      layer: s.layer,
      best_for: s.best_for.slice(0, 4),
      avoid_when: s.avoid_when.slice(0, 2),
      scale_ceiling: s.scale_ceiling,
      learning_curve: s.learning_curve,
      cost: s.cost,
      relevance_score: s._score,
    }));

    const prompt = [
      "PROJECT REQUIREMENTS:",
      JSON.stringify(requirements, null, 2),
      "",
      "CANDIDATE TECHNOLOGIES (ranked by relevance to the project):",
      JSON.stringify(candidateSummary, null, 2),
      "",
      "For each architectural layer (Frontend, Backend, Database, DevOps, Auth,",
      "and optionally AI/ML, Queue, Real-time, Monitoring based on requirements):",
      "  1. Select the best technology from the candidates or from your knowledge",
      "  2. Assign a confidence score from 0 to 100",
      "  3. Explain in 2-3 sentences why this fits this specific project",
      "  4. Suggest one alternative with a brief trade-off explanation",
      "",
      "Return this JSON structure:",
      JSON.stringify({
        recommendations: [
          {
            layer: "Frontend",
            primary_choice: "technology name",
            confidence: 85,
            reason: "why this is the right choice for this project",
            key_features_used: ["feature1", "feature2"],
            alternative: { name: "alternative name", trade_off: "trade-off explanation" },
          },
        ],
        architecture_pattern: "Monolith | Monorepo | Microservices | Serverless | JAMstack",
        overall_confidence: 85,
        critical_warnings: ["any significant risks or red flags"],
      }, null, 2),
    ].join("\n");

    const raw = await callLLM(STAGE2_SYSTEM, prompt, { temperature: 0.1 });
    return extractJson(raw, "Stage2");
  }

  // -----------------------------------------------------------------------

  async _stage3(description, requirements, scored) {
    const prompt = [
      "Write a comprehensive tech stack recommendation report for this project.",
      "",
      `PROJECT DESCRIPTION:\n${description}`,
      "",
      `EXTRACTED REQUIREMENTS:\n${JSON.stringify(requirements, null, 2)}`,
      "",
      `SCORED RECOMMENDATIONS:\n${JSON.stringify(scored, null, 2)}`,
      "",
      "Structure the report with the following sections using markdown headings:",
      "  ## Recommended Architecture",
      "  ## Stack at a Glance  (a markdown table: Layer | Technology | Confidence | Purpose)",
      "  ## Layer-by-Layer Breakdown",
      "    For each layer: chosen technology, why it fits this specific project,",
      "    the key npm or pip packages with the exact install command, and the alternative.",
      "  ## Critical Decisions and Trade-offs",
      "  ## Getting Started  (the exact 3-5 CLI commands to bootstrap this stack)",
      "  ## Scalability Roadmap  (how to evolve the stack as the project grows)",
      "  ## Confidence Summary",
      "",
      "Write for an experienced engineering audience.",
      "Be specific to this project — do not give generic advice that could apply to any codebase.",
    ].join("\n");

    return callLLM(STAGE3_SYSTEM, prompt, { temperature: 0.2, maxTokens: 4096 });
  }
}
