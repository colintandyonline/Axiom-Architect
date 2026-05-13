export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-start justify-center px-6 py-20">
        <p className="mb-4 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300">
          AI-powered workflow architecture
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Turn messy business processes into structured operating systems.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Axiom Architect helps founders, operators, consultants, creators, and
          small teams map workflows, diagnose bottlenecks, identify automation
          opportunities, and create practical implementation blueprints.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Workflow Diagnostics</h2>
            <p className="mt-2 text-sm text-slate-300">
              Find friction, gaps, and manual bottlenecks across your business.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Automation Mapping</h2>
            <p className="mt-2 text-sm text-slate-300">
              Identify where AI, software, and better systems can remove busywork.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold">Implementation Blueprints</h2>
            <p className="mt-2 text-sm text-slate-300">
              Move from vague ideas to clear, practical operating plans.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
