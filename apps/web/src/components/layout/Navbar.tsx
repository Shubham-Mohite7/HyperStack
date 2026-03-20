import { Link, useLocation } from "react-router-dom";
import { Layers } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-accent-blue" />
          </div>
          <span className="font-display text-[15px] font-700 tracking-tight text-ink-primary">
            HyperStack
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {[
            { href: "/", label: "Predict" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                pathname === href
                  ? "text-ink-primary bg-surface-2"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-surface-1"
              )}
            >
              {label}
            </Link>
          ))}

          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 rounded-lg text-[13px] font-medium border border-border-subtle text-ink-secondary hover:text-ink-primary hover:border-border-default transition-all"
          >
            Get API Key
          </a>
        </nav>
      </div>
    </header>
  );
}
