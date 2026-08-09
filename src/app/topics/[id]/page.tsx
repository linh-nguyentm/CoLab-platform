"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectByTopic, getStudentProfile, matchScoreForStudent, CURRENT_STUDENT_NAME } from "@/lib/data";
import { TopicStatusBadge } from "@/components/Badge";
import { useRole } from "@/lib/role-context";
import { useAppState } from "@/lib/app-state";

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { topics, expressInterest } = useAppState();
  const topic = topics.find((t) => t.id === id);
  const { role } = useRole();

  if (!topic) return notFound();

  if (role === "company") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Not available for companies</h1>
        <p className="mt-2 text-sm text-slate-500">
          Topic details for other companies&apos; submissions aren&apos;t shown to a company
          account. Track your own topics from the company hub instead.
        </p>
        <Link
          href="/company"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Go to company hub →
        </Link>
      </div>
    );
  }

  const project = getProjectByTopic(topic.id);
  const alreadyApplied = topic.applicants.includes(CURRENT_STUDENT_NAME);
  const profile = getStudentProfile(CURRENT_STUDENT_NAME);
  const match = profile ? matchScoreForStudent(topic, profile) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/topics" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to catalogue
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{topic.title}</h1>
        <TopicStatusBadge status={topic.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {topic.company} · {topic.chair} · {topic.university}
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Problem</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{topic.problem}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Expected outcome</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{topic.outcome}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Skills needed</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topic.skills.map((s) => (
                <span key={s} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {topic.status === "not_selected" && (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-200">
              <span className="font-medium text-slate-700">Not selected — </span>
              {topic.statusReason}
            </div>
          )}

          {project && (
            <div className="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <p className="text-sm text-emerald-800">
                This topic is matched and now has an active project workspace.
              </p>
              <Link
                href={`/projects/${project.id}`}
                className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:underline"
              >
                Open the project workspace →
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {role === "student" && match && (
            <div
              className={`rounded-xl border p-5 ${
                match.score >= 5
                  ? "border-emerald-200 bg-emerald-50"
                  : match.score > 0
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Match with your profile
              </h3>
              <p
                className={`mt-1.5 text-2xl font-bold ${
                  match.score >= 5 ? "text-emerald-700" : match.score > 0 ? "text-amber-700" : "text-slate-500"
                }`}
              >
                {match.score >= 5 ? "Strong match" : match.score > 0 ? "Partial match" : "Low match"}
              </p>
              {match.matchedSkills.length > 0 && (
                <p className="mt-1.5 text-xs text-slate-600">
                  Shared skills: {match.matchedSkills.join(", ")}
                </p>
              )}
              {match.domainMatch && (
                <p className="mt-1 text-xs text-slate-600">Matches one of your listed interests.</p>
              )}
              <Link href="/profile" className="mt-2 inline-block text-xs font-medium text-blue-700 hover:underline">
                Edit your profile →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Duration</dt>
                <dd className="font-medium text-slate-700">{topic.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Places</dt>
                <dd className="font-medium text-slate-700">{topic.places || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Domain</dt>
                <dd className="font-medium text-slate-700">{topic.domain}</dd>
              </div>
            </dl>
          </div>

          {role === "student" && topic.status === "published" && (
            <button
              onClick={() => expressInterest(topic.id, CURRENT_STUDENT_NAME)}
              disabled={alreadyApplied}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:bg-emerald-600"
            >
              {alreadyApplied ? "Interest sent ✓" : "Express interest"}
            </button>
          )}
          {role !== "student" && (
            <p className="text-center text-xs text-slate-400">
              Switch to the student view to express interest in this topic.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
