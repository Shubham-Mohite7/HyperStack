import { SectionLabel } from "@/components/ui";
import type { ScoredResult, PredictionMeta } from "@/types";

interface ArchitectureBannerProps {
  scored: ScoredResult;
  meta: PredictionMeta;
}

const PATTERN_DESCRIPTIONS: Record<string, string> = {
  Monolith:      "A single deployable unit — fast to build, easy to reason about at startup scale.",
  Monorepo:      "Multiple packages in one repository — shared code, coordinated deploys, clear boundaries.",
  Microservices: "Independently deployable services — maximum scalability, higher operational overhead.",
  Serverless:    "Function-based compute — zero infra management, event-driven, pay-per-invocation.",
  JAMstack:      "Pre-built markup + APIs — fast global delivery, decoupled frontend and backend.",
};

export function ArchitectureBanner({ scored, meta }: ArchitectureBannerProps) {
  const description = PATTERN_DESCRIPTIONS[scored.architecture_pattern] || "";
  const confidence  = scored.overall_confidence;

  const confidenceColor =
    confidence >= 85 ? "#10b981" :
    confidence >= 70 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-start justify-between gap-6">
        {/* Left: pattern info */}
        <div className="flex-1 min-w-0">
          <SectionLabel>Recommended architecture</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-2 leading-tight">
            {scored.architecture_pattern}
          </h2>
          <p className="text-[14px] text-ink-secondary leading-relaxed max-w-lg">
            {description}
          </p>
        </div>

        {/* Right: confidence gauge */}
        <div className="text-right shrink-0">
          <SectionLabel>Overall confidence</SectionLabel>
          <div
            className="font-display text-5xl font-bold leading-none"
            style={{ color: confidenceColor }}
          >
            {confidence}
            <span className="text-2xl font-semibold">%</span>
          </div>
          <p className="text-[12px] text-ink-muted mt-1">{meta.model}</p>
        </div>
      </div>

      {/* Critical warnings */}
      {scored.critical_warnings?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border-subtle">
          <SectionLabel>Critical warnings</SectionLabel>
          <ul className="space-y-2">
            {scored.critical_warnings.map((warning, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-amber-400/90"
              >
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta row */}
      <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-4 text-[11px] font-mono text-ink-muted">
        <span>{new Date(meta.timestamp).toLocaleString()}</span>
        <span className="ml-auto">{(meta.durationMs / 1000).toFixed(1)}s</span>
      </div>
    </div>
  );
}
