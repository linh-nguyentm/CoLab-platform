"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { suggestChairsForDraft, getUniversity, type ProjectDraft } from "@/lib/data";

const emptyForm = {
  title: "",
  domain: "",
  skills: "",
  problem: "",
  outcome: "",
  duration: "1 semester",
  places: 1,
};

export default function NewProjectPage() {
  const { createDraft, submitDraftToChairs } = useAppState();
  const [form, setForm] = useState(emptyForm);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const skillsArray = form.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const matches = draft ? suggestChairsForDraft(draft) : [];

  function handleCreateDraft(e: React.FormEvent) {
    e.preventDefault();
    const newDraft = createDraft({
      title: form.title,
      domain: form.domain,
      skills: skillsArray,
      problem: form.problem,
      outcome: form.outcome,
      duration: form.duration,
      places: form.places,
    });
    setDraft(newDraft);
    setSelected(
      suggestChairsForDraft(newDraft)
        .filter((m) => m.score > 0)
        .slice(0, 3)
        .map((m) => m.chair.id)
    );
  }

  function handleSubmit() {
    if (!draft || selected.length === 0) return;
    submitDraftToChairs(draft.id, selected);
    setSubmitted(true);
  }

  if (submitted && draft) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          &quot;{draft.title}&quot; submitted to {selected.length} chair{selected.length > 1 ? "s" : ""}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          They&apos;ll get a notification with a 14-day deadline to respond. You can track status
          from the company hub.
        </p>
        <Link
          href="/company"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to company hub
        </Link>
      </div>
    );
  }

  if (draft) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Suggested chairs for &quot;{draft.title}&quot;</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ranked by overlap between your project and each chair&apos;s research focus. Select who
          to submit to.
        </p>

        <div className="mt-6 space-y-3">
          {matches.map((m) => {
            const university = getUniversity(m.chair.universityId);
            const checked = selected.includes(m.chair.id);
            return (
              <label
                key={m.chair.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  checked ? "border-blue-400 bg-blue-50/60" : "border-slate-200 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked
                        ? [...prev, m.chair.id]
                        : prev.filter((id) => id !== m.chair.id)
                    )
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{m.chair.name}</p>
                    {m.score > 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        Match score {m.score}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-slate-200">
                        Low match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{university?.name}</p>
                  <p className="mt-1.5 text-sm text-slate-600">{m.reason}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.chair.researchFocus.map((f) => (
                      <span key={f} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Submit to {selected.length || 0} selected chair{selected.length === 1 ? "" : "s"}
          </button>
          <button
            onClick={() => setDraft(null)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Edit project details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/company" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to company hub
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Post a new project</h1>
      <p className="mt-1 text-sm text-slate-500">
        We&apos;ll suggest the chairs whose research focus best fits, based on domain and skills.
      </p>

      <form onSubmit={handleCreateDraft} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">Project title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Domain</label>
            <input
              required
              placeholder="e.g. AI & Sustainability"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Duration</label>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Skills needed <span className="font-normal text-slate-400">(comma separated)</span>
          </label>
          <input
            placeholder="e.g. Python, Computer vision, Data analysis"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Problem</label>
          <textarea
            required
            rows={3}
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Expected outcome</label>
          <textarea
            required
            rows={2}
            value={form.outcome}
            onChange={(e) => setForm({ ...form, outcome: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Places</label>
          <input
            type="number"
            min={1}
            value={form.places}
            onChange={(e) => setForm({ ...form, places: Number(e.target.value) })}
            className="mt-1.5 w-32 rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Find matching chairs →
        </button>
      </form>
    </div>
  );
}
