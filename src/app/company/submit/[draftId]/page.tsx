"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { suggestChairsForDraft, getUniversity } from "@/lib/data";

export default function SubmitDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = use(params);
  const { drafts, submissions, submitDraftToChairs } = useAppState();
  const draft = drafts.find((d) => d.id === draftId);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!draft) return notFound();

  const alreadySubmittedChairIds = submissions
    .filter((s) => s.draftId === draftId && s.status !== "rejected")
    .map((s) => s.chairId);
  const matches = suggestChairsForDraft(draft).filter(
    (m) => !alreadySubmittedChairIds.includes(m.chair.id)
  );

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Resubmitted</h1>
        <p className="mt-2 text-sm text-slate-500">
          &quot;{draft.title}&quot; was sent to {selected.length} more chair{selected.length > 1 ? "s" : ""}.
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/company" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to company hub
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        Submit &quot;{draft.title}&quot; to more chairs
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Chairs already submitted to (or already reviewing) are excluded from this list. Revise
        the pitch to fit their focus if needed, or pick a different university entirely.
      </p>

      <div className="mt-6 space-y-3">
        {matches.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No other chairs available — every relevant chair has already been submitted to.
          </p>
        )}
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
              </div>
            </label>
          );
        })}
      </div>

      {matches.length > 0 && (
        <button
          onClick={() => {
            submitDraftToChairs(draft.id, selected);
            setSubmitted(true);
          }}
          disabled={selected.length === 0}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit to {selected.length || 0} selected chair{selected.length === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}
