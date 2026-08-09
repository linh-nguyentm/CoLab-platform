"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { getDraft, getCompany, getProjectByTopic, getUniversity, daysUntil, chairs, CURRENT_CHAIR_ID } from "@/lib/data";
import { TopicStatusBadge } from "@/components/Badge";

export default function ChairInboxPage() {
  const { submissions, topics, projects, respondToSubmission, matchStudent } = useAppState();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showCrossChair, setShowCrossChair] = useState(false);

  const chair = chairs.find((c) => c.id === CURRENT_CHAIR_ID);
  const pending = submissions.filter((s) => s.chairId === CURRENT_CHAIR_ID && s.status === "submitted");
  const decided = submissions.filter((s) => s.chairId === CURRENT_CHAIR_ID && s.status !== "submitted");
  const myTopics = topics.filter((t) => t.chairId === CURRENT_CHAIR_ID);
  const otherOpenTopics = topics.filter(
    (t) => t.chairId !== CURRENT_CHAIR_ID && (t.status === "published" || t.status === "matched")
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Chair inbox</h1>
      <p className="mt-1 text-sm text-slate-500">
        Signed in as <span className="font-medium text-slate-700">{chair?.contactName}</span> ·{" "}
        {chair?.name}
      </p>

      <h2 className="mt-10 text-base font-semibold text-slate-900">
        Pending submissions {pending.length > 0 && `(${pending.length})`}
      </h2>
      <div className="mt-4 space-y-4">
        {pending.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Nothing waiting on your review.
          </p>
        )}
        {pending.map((s) => {
          const draft = getDraft(s.draftId);
          const company = draft ? getCompany(draft.companyId) : undefined;
          const days = daysUntil(s.deadline);
          return (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-slate-900">{draft?.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {company?.name} · {draft?.domain} · submitted {s.submittedDate}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    days <= 3
                      ? "bg-amber-50 text-amber-700 ring-amber-200"
                      : "bg-slate-50 text-slate-500 ring-slate-200"
                  }`}
                >
                  {days >= 0 ? `Reply within ${days}d` : `${Math.abs(days)}d overdue`}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{draft?.problem}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {draft?.skills.map((sk) => (
                  <span key={sk} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {sk}
                  </span>
                ))}
              </div>

              {rejectingId === s.id ? (
                <div className="mt-4 space-y-2">
                  <textarea
                    autoFocus
                    placeholder="Reason for declining (shown to the company)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!reason.trim()) return;
                        respondToSubmission(s.id, "rejected", reason.trim());
                        setRejectingId(null);
                        setReason("");
                      }}
                      className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Confirm decline
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => respondToSubmission(s.id, "accepted", "")}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Accept & publish
                  </button>
                  <button
                    onClick={() => setRejectingId(s.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {decided.length > 0 && (
        <>
          <h2 className="mt-10 text-base font-semibold text-slate-900">Past decisions</h2>
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {decided.map((s) => {
              const draft = getDraft(s.draftId);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm text-slate-700">{draft?.title}</span>
                  <span
                    className={`text-xs font-medium ${
                      s.status === "accepted" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {s.status === "accepted" ? "Accepted" : "Declined"}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <h2 className="mt-10 text-base font-semibold text-slate-900">Your published topics & applicants</h2>
      <div className="mt-4 space-y-4">
        {myTopics.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No published topics yet.
          </p>
        )}
        {myTopics.map((topic) => (
          <div key={topic.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Link href={`/topics/${topic.id}`} className="font-medium text-slate-900 hover:underline">
                {topic.title}
              </Link>
              <TopicStatusBadge status={topic.status} />
            </div>
            <p className="mt-2 text-xs text-slate-400">{topic.applicants.length} student(s) interested</p>

            {topic.status === "matched" &&
              (() => {
                const project = getProjectByTopic(topic.id) ?? projects.find((p) => p.topicId === topic.id);
                return (
                  <div className="mt-3 rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-200">
                    <p className="text-sm text-emerald-800">
                      Working on this project: <span className="font-medium">{project?.studentTeam.join(", ") ?? "—"}</span>
                    </p>
                    {project && (
                      <Link
                        href={`/projects/${project.id}`}
                        className="mt-1 inline-block text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Open the project workspace →
                      </Link>
                    )}
                  </div>
                );
              })()}

            {topic.status === "published" && topic.applicants.length > 0 && (
              <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                {topic.applicants.map((a) => (
                  <li key={a.studentName} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-700">{a.studentName}</span>
                        {a.teamNote ? (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            Has a team preference
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            Looking for a team
                          </span>
                        )}
                      </div>
                      {a.teamNote && <p className="mt-0.5 text-xs text-slate-500">{a.teamNote}</p>}
                    </div>
                    <button
                      onClick={() => matchStudent(topic.id, a.studentName)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Match & open workspace
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Open topics at other chairs</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cross-chair visibility — useful for spotting overlap or pointing a student elsewhere.
          </p>
        </div>
        <button
          onClick={() => setShowCrossChair((v) => !v)}
          className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-blue-300"
        >
          {showCrossChair ? "Hide" : `Show (${otherOpenTopics.length})`}
        </button>
      </div>
      {showCrossChair && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {otherOpenTopics.length === 0 && (
            <p className="col-span-2 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
              No open topics at other chairs right now.
            </p>
          )}
          {otherOpenTopics.map((t) => {
            const university = t.universityId ? getUniversity(t.universityId) : undefined;
            return (
              <Link
                key={t.id}
                href={`/topics/${t.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-900">{t.title}</h3>
                  <TopicStatusBadge status={t.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {t.chair} · {university?.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.skills.map((s) => (
                    <span key={s} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
