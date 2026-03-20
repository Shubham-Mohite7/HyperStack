import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { ArchitectureBanner } from "@/components/features/ArchitectureBanner";
import { RequirementsPanel } from "@/components/features/RequirementsPanel";
import { StackGrid } from "@/components/features/StackGrid";
import { ReportPanel } from "@/components/features/ReportPanel";
import { usePersistedResult } from "@/hooks/usePrediction";
import type { PredictionResult } from "@/types";

export function ResultsPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { saveResult, loadResult } = usePersistedResult();

  /*
   * The result is passed via React Router location state when navigating
   * from HomePage. On a hard refresh the state is lost, so we fall back
   * to sessionStorage if available.
   */
  const result: PredictionResult | null =
    location.state?.result ?? loadResult();

  useEffect(() => {
    if (result) {
      saveResult(result);
    } else {
      // No result available — redirect back to home
      navigate("/", { replace: true });
    }
  }, [result, saveResult, navigate]);

  if (!result) return null;

  const { requirements, scored, report, meta } = result;

  const handleDownload = () => {
    const content = [
      `# HyperStack — Tech Stack Recommendation`,
      `Generated: ${new Date(meta.timestamp).toLocaleString()}`,
      `Model: ${meta.model}`,
      "",
      `## Project`,
      "",
      `## Architecture: ${scored.architecture_pattern}`,
      `Overall confidence: ${scored.overall_confidence}%`,
      "",
      report,
    ].join("\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `stack-recommendation-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-[13px] text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New prediction
        </Link>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle
                     text-ink-secondary text-[13px] font-medium hover:border-border-default
                     hover:text-ink-primary transition-all duration-150"
        >
          <Download className="w-3.5 h-3.5" />
          Download report
        </button>
      </div>

      {/* Architecture summary */}
      <ArchitectureBanner scored={scored} meta={meta} />

      {/* Two-column: requirements + stack grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RequirementsPanel requirements={requirements} />
        </div>
        <div className="lg:col-span-2">
          <StackGrid recommendations={scored.recommendations} />
        </div>
      </div>

      {/* Full report */}
      <ReportPanel report={report} />
    </div>
  );
}
