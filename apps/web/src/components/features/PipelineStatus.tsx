import clsx from "clsx";
import { Check, Circle } from "lucide-react";
import { Spinner } from "@/components/ui";
import type { PipelineStage } from "@/types";

const STAGES: { id: PipelineStage; label: string; description: string }[] = [
  {
    id:          "extracting",
    label:       "Requirement extraction",
    description: "Parsing project description into structured signals",
  },
  {
    id:          "scoring",
    label:       "Stack scoring",
    description: "Retrieving and ranking candidates from knowledge base",
  },
  {
    id:          "reporting",
    label:       "Report generation",
    description: "Synthesising layer-by-layer recommendations",
  },
];

const STAGE_ORDER: PipelineStage[] = ["extracting", "scoring", "reporting", "done"];

function getStageStatus(
  stageId: PipelineStage,
  currentStage: PipelineStage
): "pending" | "active" | "done" {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const stageIdx   = STAGE_ORDER.indexOf(stageId);

  if (currentIdx > stageIdx) return "done";
  if (currentIdx === stageIdx) return "active";
  return "pending";
}

interface PipelineStatusProps {
  stage: PipelineStage;
}

export function PipelineStatus({ stage }: PipelineStatusProps) {
  if (!["extracting", "scoring", "reporting"].includes(stage)) return null;

  return (
    <div className="card p-6 space-y-4">
      <p className="label-xs">Running pipeline</p>

      <div className="space-y-3">
        {STAGES.map(({ id, label, description }, index) => {
          const status = getStageStatus(id, stage);

          return (
            <div key={id} className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    status === "done"    && "bg-accent-green/20 border border-accent-green/40",
                    status === "active"  && "bg-accent-blue/20 border border-accent-blue/40",
                    status === "pending" && "bg-surface-2 border border-border-subtle"
                  )}
                >
                  {status === "done" && (
                    <Check className="w-3 h-3 text-accent-green" />
                  )}
                  {status === "active" && (
                    <Spinner className="w-3 h-3 text-accent-blue" />
                  )}
                  {status === "pending" && (
                    <Circle className="w-3 h-3 text-ink-muted" />
                  )}
                </div>

                {/* Connector line */}
                {index < STAGES.length - 1 && (
                  <div
                    className={clsx(
                      "w-px h-4 transition-colors duration-500",
                      status === "done" ? "bg-accent-green/30" : "bg-border-subtle"
                    )}
                  />
                )}
              </div>

              {/* Label + description */}
              <div className="pb-1">
                <p
                  className={clsx(
                    "text-[13px] font-medium transition-colors",
                    status === "active"  && "text-ink-primary",
                    status === "done"    && "text-ink-secondary",
                    status === "pending" && "text-ink-muted"
                  )}
                >
                  {label}
                </p>
                {status === "active" && (
                  <p className="text-[12px] text-ink-muted mt-0.5">{description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[12px] text-ink-muted pt-1">
        Powered by {" "}
        <span className="font-mono text-accent-cyan">llama3-70b-8192</span>
        {" "} via Groq
      </p>
    </div>
  );
}
