"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { companies, getChair, getUniversity, CURRENT_COMPANY_ID, type ProjectDraft } from "@/lib/data";
import { HealthBadge } from "@/components/Badge";

const statusStyles: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700 ring-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<string, string> = {
  submitted: "Awaiting response",
  accepted: "Accepted",
  rejected: "Declined",
};

type EditForm = Omit<ProjectDraft, "id" | "createdDate" | "companyId" | "skills"> & { skills: string };

function toEditForm(draft: ProjectDraft): EditForm {
  return {
    title: draft.title,
    domain: draft.domain,
    skills: draft.skills.join(", "),
    problem: draft.problem,
    outcome: draft.outcome,
    duration: draft.duration,
    places: draft.places,
  };
}

export default function CompanyHubPage() {
  const { drafts, submissions, projects, updateDraft, deleteDraft } = useAppState();
  const company = companies.find((c) => c.id === CURRENT_COMPANY_ID);
  const myDrafts = drafts.filter((d) => d.companyId === CURRENT_COMPANY_ID);
  const myActiveProjects = projects.filter(
    (p) => p.companyId === CURRENT_COMPANY_ID && p.status === "active"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function startEdit(draft: ProjectDraft) {
    setEditingId(draft.id);
    setEditForm(toEditForm(draft));
  }

  function saveEdit(draftId: string) {
    if (!editForm) return;
    updateDraft(draftId, {
      ...editForm,
      skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setEditingId(null);
    setEditForm(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Company hub</h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{company?.name}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/company/profile"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300"
          >
            Edit profile
          </Link>
          <Link
            href="/company/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            + Post a new project
          </Link>
        </div>
      </div>

      <h2 className="mt-10 text-base font-semibold text-slate-900">
        Your active projects with universities
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Once a chair matches a student to one of your topics, it becomes a live project workspace
        here.
      </p>
      <div className="mt-5 space-y-3">
        {myActiveProjects.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No active projects yet — once a chair matches a student to one of your topics, it will
            show up here.
          </p>
        )}
        {myActiveProjects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.chair}</p>
              </div>
              <HealthBadge health={p.health} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
              <span>Agreement {p.agreementVersion}</span>
              <span>{p.studentTeam.length} student(s)</span>
              <span>
                {p.deliverables.filter((d) => d.status === "done").length}/{p.deliverables.length}{" "}
                deliverables done
              </span>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-base font-semibold text-slate-900">Your project submissions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Every project you post is matched to the most relevant chairs. Track their response and
        deadline here — if declined, you can revise and resubmit elsewhere.
      </p>

      <div className="mt-5 space-y-4">
        {myDrafts.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No projects posted yet.
          </p>
        )}
        {myDrafts.map((draft) => {
          const draftSubmissions = submissions.filter((s) => s.draftId === draft.id);
          const hasAccepted = draftSubmissions.some((s) => s.status === "accepted");
          const isEditing = editingId === draft.id;

          return (
            <div key={draft.id} className="rounded-xl border border-slate-200 bg-white p-5">
              {isEditing && editForm ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Title</label>
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Domain</label>
                      <input
                        value={editForm.domain}
                        onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Duration</label>
                      <input
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Skills (comma separated)
                    </label>
                    <input
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Problem</label>
                    <textarea
                      value={editForm.problem}
                      onChange={(e) => setEditForm({ ...editForm, problem: e.target.value })}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Expected outcome
                    </label>
                    <textarea
                      value={editForm.outcome}
                      onChange={(e) => setEditForm({ ...editForm, outcome: e.target.value })}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(draft.id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Save changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-slate-900">{draft.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {draft.domain} · posted {draft.createdDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!hasAccepted && (
                        <Link
                          href={`/company/submit/${draft.id}`}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          {draftSubmissions.length === 0 ? "Find chairs & submit" : "Submit to more chairs"}
                        </Link>
                      )}
                      {!hasAccepted && (
                        <button
                          onClick={() => startEdit(draft)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300"
                        >
                          Edit
                        </button>
                      )}
                      {!hasAccepted &&
                        (confirmDeleteId === draft.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                deleteDraft(draft.id);
                                setConfirmDeleteId(null);
                              }}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                            >
                              Confirm delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(draft.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        ))}
                      {hasAccepted && (
                        <span className="text-xs text-slate-400">
                          Already accepted — can&apos;t edit or delete
                        </span>
                      )}
                    </div>
                  </div>

                  {draftSubmissions.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">Not submitted to any chair yet.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                      {draftSubmissions.map((s) => {
                        const chair = getChair(s.chairId);
                        const university = chair ? getUniversity(chair.universityId) : undefined;
                        return (
                          <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{chair?.name}</p>
                              <p className="text-xs text-slate-400">
                                {university?.name} · deadline {s.deadline}
                              </p>
                              {s.status === "rejected" && s.responseNote && (
                                <p className="mt-1 text-xs text-red-600">Reason: {s.responseNote}</p>
                              )}
                            </div>
                            <span
                              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[s.status]}`}
                            >
                              {statusLabels[s.status]}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
