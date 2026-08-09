"use client";

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { useAppState } from "@/lib/app-state";
import { HealthBadge, TopicStatusBadge } from "@/components/Badge";
import { CURRENT_COMPANY_ID } from "@/lib/data";

export default function DashboardPage() {
  const { role } = useRole();
  const { topics, projects } = useAppState();

  const openTopics =
    role === "student"
      ? topics.filter((t) => t.status === "published")
      : topics.filter((t) => t.status === "published" || t.status === "under_review");
  const matchedTopics =
    role === "company"
      ? topics.filter((t) => t.status === "matched" && t.companyId === CURRENT_COMPANY_ID)
      : topics.filter((t) => t.status === "matched");
  const activeProjects =
    role === "company"
      ? projects.filter((p) => p.status === "active" && p.companyId === CURRENT_COMPANY_ID)
      : projects.filter((p) => p.status === "active");
  const needsAttention = activeProjects.filter((p) => p.health !== "on_track");

  const intro: Record<typeof role, { title: string; body: string }> = {
    company: {
      title: "Company view",
      body: "Track your submitted topics, see project health at a glance, and know exactly what's needed for handover.",
    },
    academic: {
      title: "Academic view",
      body: "Everything you supervise in one place — which projects need attention, and what's pending your review.",
    },
    student: {
      title: "Student view",
      body: "Your active project, the next checkpoint, and what the company and supervisor are waiting on.",
    },
  };

  const quickLink: Record<typeof role, { href: string; label: string } | null> = {
    company: { href: "/company", label: "Go to company hub →" },
    academic: { href: "/chair", label: "Go to chair inbox →" },
    student: null,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{intro[role].title}</h1>
          <p className="mt-1 text-sm text-slate-500">{intro[role].body}</p>
        </div>
        {quickLink[role] && (
          <Link
            href={quickLink[role]!.href}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {quickLink[role]!.label}
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
            {activeProjects.length}
          </div>
          <div className="text-sm font-medium text-slate-600">Active projects</div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg font-bold text-amber-600">
            {needsAttention.length}
          </div>
          <div className="text-sm font-medium text-slate-600">Need attention</div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg font-bold text-emerald-600">
            {matchedTopics.length}
          </div>
          <div className="text-sm font-medium text-slate-600">Topics matched this term</div>
        </div>
      </div>

      <div className={`mt-10 grid gap-8 ${role === "company" ? "" : "lg:grid-cols-3"}`}>
        <div className={role === "company" ? "" : "lg:col-span-2"}>
          <h2 className="text-base font-semibold text-slate-900">Active projects</h2>
          <div className="mt-4 space-y-3">
            {activeProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-900">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {p.company} · {p.chair}
                    </p>
                  </div>
                  <HealthBadge health={p.health} />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                  <span>Agreement {p.agreementVersion}</span>
                  <span>{p.studentTeam.length} students</span>
                  <span>{p.deliverables.filter((d) => d.status === "done").length}/{p.deliverables.length} deliverables done</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {role !== "company" && (
        <div>
          <h2 className="text-base font-semibold text-slate-900">Topic catalogue</h2>
          <div className="mt-4 space-y-3">
            {openTopics.map((t) => (
              <Link
                key={t.id}
                href={`/topics/${t.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-900">{t.title}</h3>
                  <TopicStatusBadge status={t.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{t.company}</p>
              </Link>
            ))}
            <Link
              href="/topics"
              className="block rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              View full catalogue →
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
