import { ConfidenceBar, Badge, LayerDot, SectionLabel } from "@/components/ui";
import { LAYER_COLORS, type Recommendation } from "@/types";

interface StackCardProps {
  rec: Recommendation;
  index: number;
}

function StackCard({ rec, index }: StackCardProps) {
  const color = LAYER_COLORS[rec.layer] || "#3b82f6";

  return (
    <div
      className="card p-5 flex flex-col gap-4 animate-slide-up hover:border-border-default transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Layer badge + top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-60"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between gap-3 relative">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <LayerDot color={color} />
            <span
              className="text-[10px] font-mono uppercase tracking-widest font-medium"
              style={{ color }}
            >
              {rec.layer}
            </span>
          </div>
          <h3 className="font-display text-[18px] font-semibold text-ink-primary leading-tight">
            {rec.primary_choice}
          </h3>
        </div>

        <span
          className="font-mono text-[22px] font-semibold shrink-0 leading-none"
          style={{ color }}
        >
          {rec.confidence}
        </span>
      </div>

      {/* Reason */}
      <p className="text-[13px] text-ink-secondary leading-relaxed">
        {rec.reason}
      </p>

      {/* Feature pills */}
      {rec.key_features_used?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {rec.key_features_used.map((feat) => (
            <Badge key={feat} color={color}>
              {feat}
            </Badge>
          ))}
        </div>
      )}

      {/* Confidence bar */}
      <ConfidenceBar value={rec.confidence} color={color} />

      {/* Alternative */}
      {rec.alternative?.name && (
        <div className="pt-3 border-t border-border-subtle">
          <SectionLabel>Alternative</SectionLabel>
          <p className="text-[12px] text-ink-secondary">
            <span className="font-medium text-ink-primary">{rec.alternative.name}</span>
            {" — "}
            {rec.alternative.trade_off}
          </p>
        </div>
      )}
    </div>
  );
}

interface StackGridProps {
  recommendations: Recommendation[];
}

export function StackGrid({ recommendations }: StackGridProps) {
  return (
    <div>
      <SectionLabel>Recommendations by layer</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {recommendations.map((rec, i) => (
          <div key={`${rec.layer}-${i}`} className="relative">
            <StackCard rec={rec} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
