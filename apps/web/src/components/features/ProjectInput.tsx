import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { Spinner } from "@/components/ui";
import type { PipelineStage } from "@/types";

const EXAMPLES = [
  {
    label: "B2B SaaS",
    value:
      "A B2B SaaS platform for construction companies to manage projects, invoices, and inventory. Web dashboard for project managers and a mobile app for on-site workers. Real-time notifications, PDF invoice generation with GST, photo uploads, role-based access, and an AI assistant for project documents. Team: 2 developers. Budget: minimal, prefer free tiers. Launch in 2 months.",
  },
  {
    label: "Mobile app",
    value:
      "A real-time group chat mobile app for iOS and Android with end-to-end encryption, voice messages, file sharing, and push notifications. Also needs a web admin panel for moderation. Expected users: 50,000 in year 1. Solo developer with React experience.",
  },
  {
    label: "AI document tool",
    value:
      "An AI-powered tool for law firms to upload legal documents (PDF) and ask natural language questions about them. Needs semantic search, citation tracking, user accounts with firm-level billing, and a clean read-focused UI. Small team of 3.",
  },
  {
    label: "Analytics platform",
    value:
      "A data analytics platform processing 5 million IoT sensor readings per day from manufacturing machines, detecting anomalies in real time, storing 2 years of history, and providing live dashboards. Enterprise customers only.",
  },
  {
    label: "Marketplace",
    value:
      "A multi-vendor e-commerce marketplace for handmade crafts. Sellers upload products, buyers pay via Stripe, we take 5% commission. Needs search, filters, reviews, messaging, and a mobile app. Self-funded startup.",
  },
];

interface ProjectInputProps {
  onSubmit: (description: string) => void;
  stage: PipelineStage;
  onReset: () => void;
}

const STAGE_MESSAGES: Partial<Record<PipelineStage, string>> = {
  extracting: "Extracting project requirements...",
  scoring:    "Scoring tech stacks against requirements...",
  reporting:  "Generating recommendation report...",
};

export function ProjectInput({ onSubmit, stage, onReset }: ProjectInputProps) {
  const [value, setValue] = useState("");
  const isLoading = ["extracting", "scoring", "reporting"].includes(stage);
  const isError = stage === "error";

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length < 20 || isLoading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter or Ctrl+Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your project — what it does, who uses it, what scale you expect, team size, and any hard constraints..."
          disabled={isLoading}
          rows={6}
          className={clsx(
            "w-full resize-none rounded-xl px-5 py-4 text-[15px] leading-relaxed",
            "bg-surface-1 border text-ink-primary placeholder:text-ink-muted",
            "outline-none transition-all duration-200 font-sans",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isError
              ? "border-red-500/50 focus:border-red-500"
              : "border-border-subtle focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20"
          )}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={clsx(
              "font-mono text-[11px] transition-colors",
              value.length > 1800 ? "text-amber-400" : "text-ink-muted"
            )}
          >
            {value.length}/2000
          </span>
        </div>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="label-xs shrink-0">Try an example:</span>
        {EXAMPLES.map(({ label, value: example }) => (
          <button
            key={label}
            onClick={() => setValue(example)}
            disabled={isLoading}
            className="px-3 py-1 rounded-lg border border-border-subtle text-ink-secondary text-[12px] font-medium
                       hover:border-border-default hover:text-ink-primary transition-all duration-150 disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading || value.trim().length < 20}
          className={clsx(
            "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-[14px] transition-all duration-200",
            "bg-accent-blue text-white",
            "hover:bg-blue-500 active:scale-[0.98]",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent-blue"
          )}
        >
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4" />
              <span>{STAGE_MESSAGES[stage] || "Processing..."}</span>
            </>
          ) : (
            <>
              <span>Predict Stack</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {(isLoading || isError) && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle
                       text-ink-secondary text-[14px] hover:border-border-default hover:text-ink-primary
                       transition-all duration-150"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        {!isLoading && value.trim().length >= 20 && (
          <span className="text-ink-muted text-[12px] ml-1">
            Press <kbd className="font-mono bg-surface-2 px-1.5 py-0.5 rounded text-[11px] border border-border-subtle">Cmd+Enter</kbd>
          </span>
        )}
      </div>
    </div>
  );
}
