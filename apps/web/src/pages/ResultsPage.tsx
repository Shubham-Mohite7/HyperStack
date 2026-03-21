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

      console.log('Starting PDF generation...');

      // Create a simple container for PDF
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        padding: 40px;
        background: white;
        font-family: 'Times New Roman', serif;
        line-height: 1.8;
        color: #1a1a1a;
      `;

      // Simple title page with logo
      tempContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #3b82f6;">
          <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
            <div style="color: white; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif;">HS</div>
          </div>
          <h1 style="margin: 0; color: #1f2937; font-size: 36px; font-weight: bold; font-family: 'Times New Roman', serif;">HyperStack</h1>
          <h2 style="margin: 10px 0 0 0; color: #6b7280; font-size: 24px; font-family: 'Times New Roman', serif;">Tech Stack Recommendation Report</h2>
          <p style="margin: 0; color: #374151; font-size: 16px; font-style: italic; font-family: 'Times New Roman', serif;">Generated: ${new Date(meta.timestamp).toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 40px;">
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; font-family: 'Times New Roman', serif;">Recommended Architecture</h2>
          <div style="background: #eff6ff; padding: 30px; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-size: 18px; color: #1e40af; font-weight: 600; font-family: 'Times New Roman', serif;">
              ${scored.architecture_pattern}
            </p>
            <p style="margin: 15px 0 0 0; color: #6b7280; font-family: 'Times New Roman', serif;">
              Overall Confidence: <strong>${scored.overall_confidence}%</strong>
            </p>
          </div>
        </div>
        
        <div style="margin-bottom: 40px;">
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; font-family: 'Times New Roman', serif;">Technology Recommendations</h2>
          ${scored.recommendations.map((rec, index) => `
            <div style="margin-bottom: 30px; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; font-family: 'Times New Roman', serif;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">
                  ${index + 1}. ${rec.primary_choice}
                </h3>
                <span style="background: ${rec.confidence >= 80 ? '#10b981' : rec.confidence >= 60 ? '#f59e0b' : '#ef4444'}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ${rec.confidence}%
                </span>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6; font-family: 'Times New Roman', serif;">
                ${rec.reason}
              </p>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-bottom: 40px;">
          <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; font-family: 'Times New Roman', serif;">Detailed Analysis</h2>
          <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border-left: 4px solid #3b82f6; font-family: 'Times New Roman', serif;">
            ${report.replace(/\n/g, '<br>')}
          </div>
        </div>
      `;

      document.body.appendChild(tempContainer);
      console.log('Container added to DOM');

      // Generate PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      console.log('Canvas generated, dimensions:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      console.log('PDF dimensions calculated:', pdfWidth, 'x', pdfHeight);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`hyperstack-report-${Date.now()}.pdf`);

      console.log('PDF saved successfully');

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
