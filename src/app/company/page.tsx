"use client";

import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { companies, getChair, getUniversity, CURRENT_COMPANY_ID } from "@/lib/data";

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

export default function CompanyHubPage() {
  const { drafts, submissions } = useAppState();
  const company = companies.find((c) => c.id === CURRENT_COMPANY_ID);
  const myDrafts = drafts.filter((d) => d.companyId === CURRENT_COMPANY_ID);

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
          return (
            <div key={draft.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-slate-900">{draft.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {draft.domain} · posted {draft.createdDate}
                  </p>
                </div>
                {!hasAccepted && (
                  <Link
                    href={`/company/submit/${draft.id}`}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    {draftSubmissions.length === 0 ? "Find chairs & submit" : "Submit to more chairs"}
                  </Link>
                )}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
