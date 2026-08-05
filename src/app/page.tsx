import Link from "next/link";

const pillars = [
  {
    title: "Discovery & matching",
    body:
      "A shared topic catalogue, tagged by skill and interest, so a good topic never sits unseen in one course while a well-suited student never hears about it.",
  },
  {
    title: "Living expectations",
    body:
      "One agreed scope, deliverables and success criteria per project — revisited at fixed checkpoints, with full version history, so drift is visible instead of silent.",
  },
  {
    title: "Structured handover",
    body:
      "A defined handover checklist agreed from day one, so a usable result never becomes a lost one when the semester ends.",
  },
];

const stats = [
  { value: "3", label: "stakeholder groups, one shared record" },
  { value: "24", label: "quotes behind the visibility gap this closes" },
  { value: "1", label: "source of truth instead of six disconnected tools" },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
            Project study collaboration hub
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            One shared record for every project study — from matching to handover.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            CoLab connects companies, academic chairs and student teams through a single
            living project record — replacing scattered email, personal Gantt charts and
            institution-only tools with one shared source of truth.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Go to dashboard
            </Link>
            <Link
              href="/topics"
              className="rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              Browse open topics
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-3xl font-bold text-blue-600">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-semibold text-slate-900">
          Built around the three gaps the evidence supports most
        </h2>
        <p className="mt-2 max-w-2xl text-slate-500">
          Every feature below traces back to a specific, evidenced pattern — not a
          feature that sounded useful in the abstract.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-blue-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            See it as each side sees it
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500">
            Switch the role selector in the top-right corner to see the same project
            through the company&apos;s, the academic supervisor&apos;s, and the student
            team&apos;s eyes.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Try the dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
