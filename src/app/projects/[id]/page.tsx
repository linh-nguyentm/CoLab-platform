"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  daysUntil,
  roadmapStages,
  currentRoadmapStage,
  CURRENT_STUDENT_NAME,
  type ProjectHealth,
  type Deliverable,
} from "@/lib/data";
import { HealthBadge, DeliverableBadge } from "@/components/Badge";
import { useRole, roleLabels } from "@/lib/role-context";
import { useAppState } from "@/lib/app-state";

type Tab = "overview" | "agreement" | "activity" | "handover" | "chat";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "agreement", label: "Living expectations record" },
  { id: "activity", label: "Activity" },
  { id: "handover", label: "Handover" },
  { id: "chat", label: "Team chat" },
];

const checkpointStyles: Record<string, string> = {
  upcoming: "bg-slate-50 text-slate-500 ring-slate-200",
  due_soon: "bg-amber-50 text-amber-700 ring-amber-200",
  submitted: "bg-blue-50 text-blue-700 ring-blue-200",
  reviewed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const checkpointLabels: Record<string, string> = {
  upcoming: "Upcoming",
  due_soon: "Due soon",
  submitted: "Submitted — awaiting your feedback",
  reviewed: "Reviewed",
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    projects,
    submitCheckpoint,
    reviewCheckpoint,
    addMeeting,
    addStatusUpdate,
    updateAgreement,
    addDeliverable,
    updateDeliverableStatus,
    togglePreflightItem,
    chatMessages,
    sendMessage,
  } = useAppState();
  const project = projects.find((p) => p.id === id);
  const { role } = useRole();
  const [tab, setTab] = useState<Tab>("overview");
  const [checkpointDraft, setCheckpointDraft] = useState<Record<string, string>>({});
  const [checkpointFile, setCheckpointFile] = useState<Record<string, string>>({});
  const [meetingForm, setMeetingForm] = useState({ title: "", date: "" });
  const [updateForm, setUpdateForm] = useState<{ health: ProjectHealth; note: string }>({
    health: "on_track",
    note: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(false);
  const [agreementForm, setAgreementForm] = useState({
    scope: "",
    outOfScope: "",
    successPractical: "",
    successAcademic: "",
    cadence: "",
  });
  const [newDeliverable, setNewDeliverable] = useState({ title: "", owner: "", due: "" });
  const [chatDraft, setChatDraft] = useState("");
  const [expandedUpdate, setExpandedUpdate] = useState<number | null>(0);
  const [expandedDecision, setExpandedDecision] = useState<number | null>(null);
  const [changeNote, setChangeNote] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  if (!project) return notFound();

  const handoverDone = project.handover.filter((h) => h.status === "done").length;
  const sortedCheckpoints = [...project.checkpoints].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const sortedMeetings = [...project.meetings].sort((a, b) => a.date.localeCompare(b.date));
  const projectMessages = chatMessages
    .filter((m) => m.projectId === project.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const currentStageIndex = currentRoadmapStage(project);
  const chatAuthorName =
    role === "student" ? CURRENT_STUDENT_NAME : role === "company" ? project.companyContact : project.supervisor;

  const awaitingSubmission = project.checkpoints.filter(
    (c) => c.status === "upcoming" || c.status === "due_soon"
  );
  const awaitingFeedback = project.checkpoints.filter((c) => c.status === "submitted");
  const needsAttention: string[] = [];
  if (role === "student" && awaitingSubmission.length > 0) {
    needsAttention.push(
      `${awaitingSubmission.length} checkpoint${awaitingSubmission.length > 1 ? "s" : ""} waiting on your submission`
    );
  }
  if (role === "company" && awaitingFeedback.length > 0) {
    needsAttention.push(
      `${awaitingFeedback.length} submission${awaitingFeedback.length > 1 ? "s" : ""} waiting on your feedback`
    );
  }
  if (role === "academic" && project.health !== "on_track") {
    needsAttention.push(`Project health is "${project.health.replace("_", " ")}" — worth a check-in`);
  }

  function startEditingAgreement() {
    if (!project) return;
    setAgreementForm({
      scope: project.scope,
      outOfScope: project.outOfScope,
      successPractical: project.successPractical,
      successAcademic: project.successAcademic,
      cadence: project.cadence,
    });
    setEditingAgreement(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {project.company} · {project.chair}
          </p>
        </div>
        <HealthBadge health={project.health} />
      </div>

      <div className="mt-3 rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-700 ring-1 ring-blue-100 inline-block">
        Viewing as {roleLabels[role]}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Project roadmap</h3>
          <button
            onClick={() => setTab("activity")}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            View checkpoints →
          </button>
        </div>
        <div className="mt-4 flex items-center">
          {roadmapStages.map((stage, i) => {
            const isDone = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            return (
              <div key={stage} className="flex flex-1 items-center last:flex-none">
                <button
                  onClick={() => setTab("activity")}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                      isDone
                        ? "bg-blue-600 text-white"
                        : isCurrent
                          ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={`whitespace-nowrap text-xs font-medium ${
                      isCurrent ? "text-blue-700" : isDone ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {stage}
                  </span>
                </button>
                {i < roadmapStages.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${isDone ? "bg-blue-600" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Updates automatically as checkpoints in the Activity tab are submitted and reviewed — it
          isn&apos;t edited directly.
        </p>
      </div>

      {needsAttention.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
            Needs your attention
          </h3>
          <ul className="mt-2 space-y-1">
            {needsAttention.map((n) => (
              <li key={n} className="flex items-center justify-between gap-3 text-sm text-amber-800">
                <span>{n}</span>
                <button
                  onClick={() => setTab("activity")}
                  className="whitespace-nowrap text-xs font-semibold text-amber-700 hover:underline"
                >
                  Go to activity →
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 border-b border-slate-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-8">
        {tab === "overview" && (
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-6">
              <section>
                <h2 className="text-sm font-semibold text-slate-900">Scope</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{project.scope}</p>
              </section>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Deliverables</h2>
                  <button
                    onClick={() => setTab("agreement")}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Manage in living expectations record →
                  </button>
                </div>
                {project.deliverables.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-400">Not yet defined — agree these at kickoff.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                    {project.deliverables.map((d) => (
                      <li key={d.title} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{d.title}</p>
                          <p className="text-xs text-slate-400">
                            {d.owner} · due {d.due}
                          </p>
                        </div>
                        <DeliverableBadge status={d.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Latest status</h2>
                  <button
                    onClick={() => setTab("activity")}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Full history →
                  </button>
                </div>
                {project.updates[0] && (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <HealthBadge health={project.updates[0].health} />
                      <span className="text-xs text-slate-400">{project.updates[0].date}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{project.updates[0].note}</p>
                  </div>
                )}
              </section>
            </div>
            <aside className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Team</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                  {project.studentTeam.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Roles</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-400">Company contact</dt>
                    <dd className="font-medium text-slate-700">{project.companyContact}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Academic supervisor</dt>
                    <dd className="font-medium text-slate-700">{project.supervisor}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Cadence</h3>
                <p className="mt-2 text-sm text-slate-700">{project.cadence}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Handover progress</h3>
                {project.handover.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-400">Not yet defined</p>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-slate-700">
                      {handoverDone}/{project.handover.length} items complete
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: `${(handoverDone / project.handover.length) * 100}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        )}

        {tab === "agreement" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Agreement version {project.agreementVersion}
              </h2>
              <button
                onClick={() => setShowVersionHistory((v) => !v)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                {showVersionHistory ? "Hide" : "View"} version history ({project.agreementHistory.length})
              </button>
            </div>

            {showVersionHistory && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                {project.agreementHistory.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No prior versions yet — this is the first agreement, set at kickoff.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {project.agreementHistory.map((h, i) => (
                      <li key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-800">{h.version}</span>
                          <span className="text-xs text-slate-400">
                            {h.date} · {h.changedBy}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{h.changeNote}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {editingAgreement ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">In scope</label>
                    <textarea
                      value={agreementForm.scope}
                      onChange={(e) => setAgreementForm((f) => ({ ...f, scope: e.target.value }))}
                      rows={3}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Out of scope</label>
                    <textarea
                      value={agreementForm.outOfScope}
                      onChange={(e) => setAgreementForm((f) => ({ ...f, outOfScope: e.target.value }))}
                      rows={3}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Practical success criteria
                    </label>
                    <textarea
                      value={agreementForm.successPractical}
                      onChange={(e) => setAgreementForm((f) => ({ ...f, successPractical: e.target.value }))}
                      rows={3}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Academic success criteria
                    </label>
                    <textarea
                      value={agreementForm.successAcademic}
                      onChange={(e) => setAgreementForm((f) => ({ ...f, successAcademic: e.target.value }))}
                      rows={3}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Cadence</label>
                  <input
                    value={agreementForm.cadence}
                    onChange={(e) => setAgreementForm((f) => ({ ...f, cadence: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Why is this changing?
                  </label>
                  <input
                    value={changeNote}
                    onChange={(e) => setChangeNote(e.target.value)}
                    placeholder="e.g. Narrowed scope after data coverage issue at Week 6"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateAgreement(project.id, agreementForm, chatAuthorName, changeNote.trim());
                      setEditingAgreement(false);
                      setChangeNote("");
                      setShowVersionHistory(true);
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Save as new version
                  </button>
                  <button
                    onClick={() => {
                      setEditingAgreement(false);
                      setChangeNote("");
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">In scope</h3>
                    <p className="mt-2 text-sm text-slate-600">{project.scope}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Out of scope</h3>
                    <p className="mt-2 text-sm text-slate-600">{project.outOfScope}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Practical success criteria
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{project.successPractical}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Academic success criteria
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{project.successAcademic}</p>
                  </div>
                </div>
                {(role === "academic" || role === "company") && (
                  <button
                    onClick={startEditingAgreement}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit this agreement
                  </button>
                )}
              </>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Pre-flight checklist</h2>
                <span className="text-xs text-slate-400">
                  {project.preflight.filter((i) => i.checked).length}/{project.preflight.length} confirmed
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Confidentiality and technical boundaries to confirm before or right at kickoff.
              </p>
              <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {project.preflight.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={role === "student"}
                      onChange={() => togglePreflightItem(project.id, item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:opacity-50"
                    />
                    <span
                      className={`flex-1 text-sm ${item.checked ? "text-slate-500 line-through" : "text-slate-700"}`}
                    >
                      {item.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                      {item.category}
                    </span>
                  </li>
                ))}
              </ul>
              {role === "student" && (
                <p className="mt-1.5 text-xs text-slate-400">
                  Confirmed by the company and academic supervisor.
                </p>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">Deliverables</h2>
              {project.deliverables.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">Not yet defined.</p>
              ) : (
                <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                  {project.deliverables.map((d) => (
                    <li key={d.title} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.title}</p>
                        <p className="text-xs text-slate-400">
                          {d.owner} · due {d.due}
                        </p>
                      </div>
                      {role === "academic" || role === "company" || role === "student" ? (
                        <select
                          value={d.status}
                          onChange={(e) =>
                            updateDeliverableStatus(
                              project.id,
                              d.title,
                              e.target.value as Deliverable["status"]
                            )
                          }
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 outline-none"
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                        </select>
                      ) : (
                        <DeliverableBadge status={d.status} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {(role === "academic" || role === "company") && (
                <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-dashed border-slate-300 p-3">
                  <input
                    placeholder="Deliverable title"
                    value={newDeliverable.title}
                    onChange={(e) => setNewDeliverable((f) => ({ ...f, title: e.target.value }))}
                    className="min-w-[10rem] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    placeholder="Owner"
                    value={newDeliverable.owner}
                    onChange={(e) => setNewDeliverable((f) => ({ ...f, owner: e.target.value }))}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    placeholder="Due (e.g. Week 8)"
                    value={newDeliverable.due}
                    onChange={(e) => setNewDeliverable((f) => ({ ...f, due: e.target.value }))}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (!newDeliverable.title.trim()) return;
                      addDeliverable(project.id, { ...newDeliverable, status: "planned" });
                      setNewDeliverable({ title: "", owner: "", due: "" });
                    }}
                    className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    + Add deliverable
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h2 className="text-sm font-semibold text-slate-900">Checkpoints</h2>
              <p className="mt-1 text-xs text-slate-400">
                The roadmap and everyone&apos;s notifications are driven directly by these — submit,
                review and they update automatically.
              </p>
              <ul className="mt-3 space-y-3">
                {sortedCheckpoints.map((cp) => {
                  const days = daysUntil(cp.dueDate);
                  return (
                    <li key={cp.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">{cp.title}</p>
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${checkpointStyles[cp.status]}`}
                        >
                          {checkpointLabels[cp.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Due {cp.dueDate} ({days >= 0 ? `in ${days}d` : `${Math.abs(days)}d overdue`})
                      </p>

                      {cp.studentNote && (
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-medium text-slate-700">Student note: </span>
                          {cp.studentNote}
                        </p>
                      )}
                      {cp.attachments && cp.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {cp.attachments.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                            >
                              📎 {a}
                            </span>
                          ))}
                        </div>
                      )}
                      {cp.companyFeedback && (
                        <p className="mt-1.5 text-sm text-blue-700">
                          <span className="font-medium">Company feedback: </span>
                          {cp.companyFeedback}
                        </p>
                      )}

                      {role === "student" && (cp.status === "upcoming" || cp.status === "due_soon") && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            placeholder="Describe your progress for this checkpoint..."
                            value={checkpointDraft[cp.id] ?? ""}
                            onChange={(e) =>
                              setCheckpointDraft((prev) => ({ ...prev, [cp.id]: e.target.value }))
                            }
                            rows={2}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-300 hover:text-blue-700">
                              📎 {checkpointFile[cp.id] ?? "Attach a file"}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setCheckpointFile((prev) => ({
                                    ...prev,
                                    [cp.id]: e.target.files?.[0]?.name ?? "",
                                  }))
                                }
                              />
                            </label>
                            <button
                              onClick={() => {
                                const note = checkpointDraft[cp.id]?.trim();
                                if (!note) return;
                                submitCheckpoint(project.id, cp.id, note, checkpointFile[cp.id] || undefined);
                                setCheckpointFile((prev) => ({ ...prev, [cp.id]: "" }));
                              }}
                              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                            >
                              Submit task
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Prototype only — the file name is recorded, nothing is actually uploaded.
                          </p>
                        </div>
                      )}

                      {role === "company" && cp.status === "submitted" && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            placeholder="Give feedback on this submission..."
                            value={checkpointDraft[cp.id] ?? ""}
                            onChange={(e) =>
                              setCheckpointDraft((prev) => ({ ...prev, [cp.id]: e.target.value }))
                            }
                            rows={2}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              const feedback = checkpointDraft[cp.id]?.trim();
                              if (!feedback) return;
                              reviewCheckpoint(project.id, cp.id, feedback);
                            }}
                            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                          >
                            Send feedback
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Meeting plan</h2>
                {sortedMeetings.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">No meetings scheduled yet.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {sortedMeetings.map((m) => (
                      <li key={m.id} className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-800">{m.title}</p>
                          <span className="text-xs text-slate-400">{m.date}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{m.attendees.join(", ")}</p>
                        {m.notes && <p className="mt-1.5 text-sm text-slate-600">{m.notes}</p>}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 space-y-2 rounded-lg border border-dashed border-slate-300 p-3">
                    <input
                      placeholder="Meeting title"
                      value={meetingForm.title}
                      onChange={(e) => setMeetingForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (!meetingForm.title.trim() || !meetingForm.date) return;
                        addMeeting(project.id, {
                          title: meetingForm.title.trim(),
                          date: meetingForm.date,
                          attendees: [project.companyContact, project.supervisor, ...project.studentTeam],
                        });
                        setMeetingForm({ title: "", date: "" });
                      }}
                      className="w-full rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      + Add meeting
                    </button>
                  </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">Status history</h2>
                <p className="mt-1 text-xs text-slate-400">Click an entry to see the full note.</p>
                <ul className="mt-3 space-y-2">
                  {project.updates.map((u, i) => {
                    const open = expandedUpdate === i;
                    return (
                      <li key={i} className="rounded-lg border border-slate-200 bg-white">
                        <button
                          onClick={() => setExpandedUpdate(open ? null : i)}
                          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <HealthBadge health={u.health} />
                            <span className="text-xs text-slate-400">{u.date}</span>
                          </div>
                          <span className="text-slate-400">{open ? "−" : "+"}</span>
                        </button>
                        {open && (
                          <div className="px-4 pb-3">
                            <p className="text-sm text-slate-600">{u.note}</p>
                            <p className="mt-1 text-xs text-slate-400">— {u.author}</p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {role === "student" &&
                  (showUpdateForm ? (
                    <div className="mt-3 space-y-2 rounded-lg border border-slate-300 p-3">
                      <select
                        value={updateForm.health}
                        onChange={(e) =>
                          setUpdateForm((f) => ({ ...f, health: e.target.value as ProjectHealth }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="on_track">On track</option>
                        <option value="attention">Attention needed</option>
                        <option value="at_risk">At risk</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <textarea
                        placeholder="What's the update?"
                        value={updateForm.note}
                        onChange={(e) => setUpdateForm((f) => ({ ...f, note: e.target.value }))}
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          if (!updateForm.note.trim()) return;
                          addStatusUpdate(project.id, {
                            health: updateForm.health,
                            note: updateForm.note.trim(),
                            author: CURRENT_STUDENT_NAME,
                          });
                          setUpdateForm({ health: "on_track", note: "" });
                          setShowUpdateForm(false);
                          setExpandedUpdate(0);
                        }}
                        className="w-full rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                      >
                        Post update
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowUpdateForm(true)}
                      className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 hover:border-blue-300 hover:text-blue-700"
                    >
                      + Add a status update
                    </button>
                  ))}
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">Decision log</h2>
                {project.decisions.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">No decisions recorded yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {project.decisions.map((d, i) => {
                      const open = expandedDecision === i;
                      return (
                        <li key={i} className="rounded-lg border border-slate-200 bg-white">
                          <button
                            onClick={() => setExpandedDecision(open ? null : i)}
                            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">{d.title}</p>
                              <p className="text-xs text-slate-400">{d.date}</p>
                            </div>
                            <span className="text-slate-400">{open ? "−" : "+"}</span>
                          </button>
                          {open && (
                            <div className="px-4 pb-3">
                              <p className="text-xs text-slate-400">Owner: {d.owner}</p>
                              <p className="mt-2 text-sm text-slate-600">{d.rationale}</p>
                              <p className="mt-1 text-xs font-medium text-blue-700">Impact: {d.impact}</p>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "handover" && (
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Handover checklist</h2>
            <p className="mt-1 text-sm text-slate-500">
              Agreed at kickoff, tracked here, confirmed by the company on receipt.
            </p>
            {project.handover.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">Not yet defined — agree this at kickoff.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {project.handover.map((h) => (
                  <li key={h.item} className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          h.status === "done"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {h.status === "done" ? "✓" : ""}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{h.item}</p>
                        <p className="text-xs text-slate-400">{h.owner}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        h.status === "done" ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {h.status === "done" ? "Done" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {role === "company" && project.handover.length > 0 && (
              <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
                Confirm handover received
              </button>
            )}
          </div>
        )}

        {tab === "chat" && (
          <div className="mx-auto max-w-2xl">
            <h2 className="text-sm font-semibold text-slate-900">Team chat</h2>
            <p className="mt-1 text-xs text-slate-400">
              Shared between the company, academic supervisor and student team on this project.
            </p>
            <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              {projectMessages.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">No messages yet — say hello.</p>
              )}
              {projectMessages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                    m.authorRole === role
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <span className="font-semibold">{m.authorName}</span>
                    <span>· {roleLabels[m.authorRole]}</span>
                    <span>· {m.date}</span>
                  </div>
                  <p className="mt-1 text-sm">{m.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatDraft.trim()) {
                    sendMessage(project.id, role, chatAuthorName, chatDraft.trim());
                    setChatDraft("");
                  }
                }}
                placeholder="Write a message..."
                className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (!chatDraft.trim()) return;
                  sendMessage(project.id, role, chatAuthorName, chatDraft.trim());
                  setChatDraft("");
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
