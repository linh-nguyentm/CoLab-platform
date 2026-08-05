"use client";

import { useState } from "react";
import { useAppState } from "@/lib/app-state";

export default function ShowcasePage() {
  const { projects } = useAppState();
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  const finished = projects.filter((p) => p.status === "completed" && p.isPublic);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Completed collaborations</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        A high-level look at finished project studies the company chose to make public — what was
        done and who worked on it. No internal process details or direct contact info are shown
        here; request an introduction and the company/team decides how to follow up.
      </p>

      <div className="mt-8 space-y-5">
        {finished.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
            No public completed projects yet.
          </p>
        )}
        {finished.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{p.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {p.company} · {p.chair}
                </p>
              </div>
              <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                Finished {p.finishedDate}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">{p.outcomeSummary}</p>

            <div className="mt-4">
              <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Team who worked on it
              </h3>
              <p className="mt-1 text-sm text-slate-700">{p.studentTeam.join(", ")}</p>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setRequested((r) => ({ ...r, [p.id]: true }))}
                disabled={requested[p.id]}
                className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-blue-300 disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700"
              >
                {requested[p.id] ? "Introduction requested ✓" : "Request an introduction"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
