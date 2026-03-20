/*
 * UI primitives.
 *
 * Small, single-responsibility components used across the feature components.
 * Each primitive is intentionally kept thin — no business logic, only
 * presentational concerns.
 */

import clsx from "clsx";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color = "#3b82f6", className }: BadgeProps) {
  return (
    <span
      className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium", className)}
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// LayerDot
// ---------------------------------------------------------------------------

export function LayerDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: color }}
    />
  );
}

// ---------------------------------------------------------------------------
// ConfidenceBar
// ---------------------------------------------------------------------------

interface ConfidenceBarProps {
  value: number;   // 0 – 100
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceBar({
  value,
  color = "#3b82f6",
  showLabel = true,
  className,
}: ConfidenceBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div className="flex-1 h-1 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${clamped}%`,
            background: color,
          }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[12px] text-ink-secondary w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={clsx("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SectionLabel
// ---------------------------------------------------------------------------

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="label-xs mb-3">{children}</p>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

export function Divider({ className }: { className?: string }) {
  return <hr className={clsx("border-border-subtle", className)} />;
}
