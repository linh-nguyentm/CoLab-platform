"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { getTopic } from "@/lib/data";

export default function RegistryPage() {
  const { projects } = useAppState();
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const completed = projects.filter((p) => p.status === "completed");

  const allDomains = useMemo(() => {
    const s = new Set<string>();
    completed.forEach((p) => {
      const topic = getTopic(p.topicId);
      if (topic) s.add(topic.domain);
    });
    return ["All", ...Array.from(s)];
  }, [completed]);

  const filtered = completed.filter((p) => {
    const topic = getTopic(p.topicId);
    const matchesQuery =
      query.trim() === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.company.toLowerCase().includes(query.toLowerCase()) ||
      (topic?.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) ?? false);
    const matchesDomain = domain === "All" || topic?.domain === domain;
    return matchesQuery && matchesDomain;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Project registry</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Every finished project study, kept as a reference so the next cohort doesn&apos;t start from
        zero — including internal-only projects, not just the public showcase.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, company, skill..."
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {allDomains.map((d) => (
            <option key={d} value={d}>
              {d === "All" ? "All domains" : d}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} results</span>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
            No finished projects match those filters yet.
          </p>
        )}
        {filtered.map((p) => {
          const topic = getTopic(p.topicId);
          const deliverablesDone = p.deliverables.filter((d) => d.status === "done").length;
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-slate-900">{p.title}</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {p.company} · {p.chair} · finished {p.finishedDate}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                    p.isPublic
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-50 text-slate-500 ring-slate-200"
                  }`}
                >
                  {p.isPublic ? "Public" : "Internal only"}
                </span>
              </div>
              {p.outcomeSummary && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.outcomeSummary}</p>
              )}
              {topic && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topic.skills.map((s) => (
                    <span key={s} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-slate-400">
                {deliverablesDone}/{p.deliverables.length} deliverables · {p.handover.length} handover items
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
