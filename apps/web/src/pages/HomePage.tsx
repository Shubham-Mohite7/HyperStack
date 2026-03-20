import { usePrediction } from "@/hooks/usePrediction";
import { ProjectInput } from "@/components/features/ProjectInput";
import { PipelineStatus } from "@/components/features/PipelineStatus";

/*
 * Feature list shown below the input area.
 * Communicates the three-stage pipeline to users who want to understand
 * what happens under the hood before submitting.
 */
const PIPELINE_STEPS = [
  {
    number: "01",
    title:  "Requirement extraction",
    body:   "Your description is parsed into 15 structured signals — scale, team size, real-time needs, AI/ML requirements, budget constraints, and more.",
  },
  {
    number: "02",
    title:  "Stack scoring",
    body:   "A curated knowledge base of 35+ technologies is searched by relevance. The LLM then scores each candidate against your exact requirements.",
  },
  {
    number: "03",
    title:  "Report generation",
    body:   "A layer-by-layer report is produced with confidence scores, trade-off analysis, exact install commands, and a scalability roadmap.",
  },
];

export function HomePage() {
  const { state, run, reset } = usePrediction();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/5 text-accent-blue text-[12px] font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          Powered by Llama 3 70B via Groq
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            <span className="text-ink-primary">Predict the right</span>
            <br />
            <span className="text-accent-blue">tech stack.</span>
          </h1>

          <p className="text-ink-secondary text-lg leading-relaxed max-w-xl mx-auto">
            Describe your project in plain English. Get a precision-scored recommendation
            across every architectural layer — with reasoning, trade-offs, and
            bootstrap commands.
          </p>
        </div>

        {/* Stat row */}
        <div className="flex items-center justify-center gap-8 pt-2">
          {[
            { value: "35+",  label: "Technologies in KB" },
            { value: "70B",  label: "Parameter model"    },
            { value: "3",    label: "Pipeline stages"    },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl font-bold text-ink-primary">{value}</div>
              <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Input card */}
      <section className="card p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-display text-[15px] font-semibold text-ink-primary mb-1">
            Describe your project
          </h2>
          <p className="text-[13px] text-ink-muted">
            Include what it does, who uses it, expected scale, team size, and any hard constraints.
            The more detail, the more accurate the recommendation.
          </p>
        </div>

        <ProjectInput
          onSubmit={run}
          stage={state.stage}
          onReset={reset}
        />

        {/* Error state */}
        {state.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] text-red-400">
            {state.error}
          </div>
        )}

        {/* Pipeline progress */}
        {["extracting", "scoring", "reporting"].includes(state.stage) && (
          <PipelineStatus stage={state.stage} />
        )}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="label-xs mb-2">How it works</p>
          <h2 className="font-display text-2xl font-semibold text-ink-primary">
            Three-stage AI pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PIPELINE_STEPS.map(({ number, title, body }) => (
            <div key={number} className="card p-5 space-y-3">
              <span className="font-mono text-[11px] text-accent-blue font-medium">{number}</span>
              <h3 className="font-display text-[15px] font-semibold text-ink-primary">{title}</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
