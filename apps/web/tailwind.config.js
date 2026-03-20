/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        surface: {
          0: "#080c14",
          1: "#0d1220",
          2: "#111827",
          3: "#1a2236",
        },
        ink: {
          primary: "#e8edf5",
          secondary: "#8899b0",
          muted: "#3d4f63",
        },
        accent: {
          blue:   "#3b82f6",
          purple: "#8b5cf6",
          teal:   "#14b8a6",
          amber:  "#f59e0b",
          green:  "#10b981",
          pink:   "#ec4899",
          cyan:   "#06b6d4",
          orange: "#f97316",
          lime:   "#84cc16",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          default: "rgba(255,255,255,0.1)",
          strong: "rgba(255,255,255,0.2)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "bar-fill": "barFill 1s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        barFill: {
          from: { width: "0%" },
          to:   { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};
