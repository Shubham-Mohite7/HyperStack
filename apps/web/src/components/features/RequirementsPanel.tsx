import { Check, X } from "lucide-react";
import { SectionLabel, Badge } from "@/components/ui";
import type { Requirements } from "@/types";

interface RequirementsPanelProps {
  requirements: Requirements;
}

const BOOL_FIELDS: { key: keyof Requirements; label: string }[] = [
  { key: "has_realtime",     label: "Real-time" },
  { key: "has_ai_ml",        label: "AI / ML" },
  { key: "has_payments",     label: "Payments" },
  { key: "has_auth",         label: "Auth" },
  { key: "needs_mobile",     label: "Mobile" },
  { key: "needs_seo",        label: "SEO" },
  { key: "data_heavy",       label: "Data-heavy" },
  { key: "budget_sensitive", label: "Budget-first" },
  { key: "needs_queue",      label: "Background jobs" },
];

const SCALE_COLORS: Record<string, string> = {
  prototype:  "#84cc16",
  startup:    "#3b82f6",
  growth:     "#f59e0b",
  enterprise: "#8b5cf6",
};

export function RequirementsPanel({ requirements }: RequirementsPanelProps) {
  const scaleColor = SCALE_COLORS[requirements.scale?.toLowerCase()] || "#3b82f6";

  return (
    <div className="card p-6 space-y-5 animate-slide-up">
      <SectionLabel>Extracted requirements</SectionLabel>

      {/* Key metadata */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Domain",   value: requirements.domain },
          { label: "App type", value: requirements.app_type },
          { label: "Team",     value: requirements.team_size },
          { label: "Language", value: requirements.primary_language_preference },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-2 rounded-xl px-4 py-3">
            <p className="label-xs mb-1">{label}</p>
            <p className="text-[13px] font-medium text-ink-primary capitalize truncate">
              {value || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Scale badge */}
      <div className="flex items-center gap-3">
        <span className="label-xs">Scale</span>
        <Badge color={scaleColor}>
          {requirements.scale || "unknown"}
        </Badge>
        {requirements.confidence > 0 && (
          <span className="ml-auto font-mono text-[12px] text-ink-muted">
            {Math.round(requirements.confidence * 100)}% confident
          </span>
        )}
      </div>

      {/* Boolean feature flags */}
      <div>
        <SectionLabel>Feature signals</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {BOOL_FIELDS.map(({ key, label }) => {
            const active = Boolean(requirements[key]);
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-colors ${
                  active
                    ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                    : "border-border-subtle bg-surface-2 text-ink-muted"
                }`}
              >
                {active
                  ? <Check className="w-3 h-3" />
                  : <X className="w-3 h-3" />
                }
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Key constraints */}
      {requirements.key_constraints?.length > 0 && (
        <div>
          <SectionLabel>Constraints</SectionLabel>
          <ul className="space-y-1.5">
            {requirements.key_constraints.map((constraint, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-ink-secondary">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-ink-muted flex-shrink-0" />
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
