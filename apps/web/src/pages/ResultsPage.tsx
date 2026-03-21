import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { ArchitectureBanner } from "@/components/features/ArchitectureBanner";
import { RequirementsPanel } from "@/components/features/RequirementsPanel";
import { StackGrid } from "@/components/features/StackGrid";
import { ReportPanel } from "@/components/features/ReportPanel";
import { usePersistedResult } from "@/hooks/usePrediction";
import type { PredictionResult } from "@/types";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const handleDownload = async () => {
    try {
      // Show loading state
      const button = document.querySelector('button[class*="Download"]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="animate-pulse">Generating PDF...</span>';
      }

      // Create a temporary container with better styling for PDF
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        padding: 40px;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
      `;

      // Create header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
          <h1 style="margin: 0; color: #3b82f6; font-size: 28px; font-weight: bold;">HyperStack</h1>
          <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Tech Stack Recommendation Report</p>
          <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 12px;">Generated: ${new Date(meta.timestamp).toLocaleString()}</p>
        </div>
      `;

      // Create requirements section
      const requirementsSection = document.createElement('div');
      requirementsSection.style.cssText = 'margin-bottom: 30px;';
      const reqEntries = Object.entries(requirements);
      requirementsSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Project Requirements</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          ${reqEntries.map(([key, value]: [string, any]) => `
            <div style="margin-bottom: 8px;">
              <strong style="color: #374151;">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> 
              <span style="color: #6b7280;">${value}</span>
            </div>
          `).join('')}
        </div>
      `;

      // Create architecture section
      const architectureSection = document.createElement('div');
      architectureSection.style.cssText = 'margin-bottom: 30px;';
      architectureSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Recommended Architecture</h2>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 16px; color: #1e40af; font-weight: 600;">
            ${scored.architecture_pattern}
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280;">
            Overall Confidence: <strong>${scored.overall_confidence}%</strong>
          </p>
        </div>
      `;

      // Create tech stack section
      const techStackSection = document.createElement('div');
      techStackSection.style.cssText = 'margin-bottom: 30px;';
      techStackSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Recommended Tech Stack</h2>
        ${scored.recommendations.map(rec => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #1f2937; font-size: 16px;">${rec.primary_choice}</h3>
              <span style="background: ${rec.confidence >= 80 ? '#10b981' : rec.confidence >= 60 ? '#f59e0b' : '#ef4444'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                ${rec.confidence}%
              </span>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${rec.reason}</p>
          </div>
        `).join('')}
      `;

      // Create report section
      const reportSection = document.createElement('div');
      reportSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Detailed Analysis</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          ${report.replace(/\n/g, '<br>')}
        </div>
      `;

      // Add all sections to temp container
      tempContainer.appendChild(header);
      tempContainer.appendChild(requirementsSection);
      tempContainer.appendChild(architectureSection);
      tempContainer.appendChild(techStackSection);
      tempContainer.appendChild(reportSection);

      document.body.appendChild(tempContainer);

      // Generate PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`hyperstack-report-${Date.now()}.pdf`);

      // Cleanup
      document.body.removeChild(tempContainer);

      // Restore button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>Download Report';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
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
