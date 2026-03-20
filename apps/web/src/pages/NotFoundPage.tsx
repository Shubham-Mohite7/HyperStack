import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center space-y-6">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">404</span>
      <h1 className="font-display text-3xl font-bold text-ink-primary">Page not found</h1>
      <p className="text-ink-secondary text-[15px] max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white
                   text-[14px] font-medium hover:bg-blue-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  );
}
