import { useState } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SectionLabel } from "@/components/ui";

interface ReportPanelProps {
  report: string;
}

export function ReportPanel({ report }: ReportPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <SectionLabel>Full recommendation report</SectionLabel>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle
                     text-ink-secondary text-[12px] font-medium hover:border-border-default
                     hover:text-ink-primary transition-all duration-150"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent-green" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Markdown content */}
      <div className="px-6 py-6 prose-report">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>
    </div>
  );
}
