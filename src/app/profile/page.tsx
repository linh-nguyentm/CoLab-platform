"use client";

import { useState } from "react";
import { useAppState } from "@/lib/app-state";
import { CURRENT_STUDENT_NAME } from "@/lib/data";

export default function StudentProfilePage() {
  const { studentProfiles, updateStudentProfile } = useAppState();
  const profile = studentProfiles.find((p) => p.name === CURRENT_STUDENT_NAME)!;
  const [form, setForm] = useState({
    bio: profile.bio,
    skills: profile.skills.join(", "),
    interests: profile.interests.join(", "),
    transcriptSummary: profile.transcriptSummary,
  });
  const [saved, setSaved] = useState(false);

  function save() {
    updateStudentProfile(profile.name, {
      bio: form.bio,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
      transcriptSummary: form.transcriptSummary,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Used to show a match score against topics — the more accurate your skills and interests,
        the better the suggestions.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">About you</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Skills <span className="font-normal text-slate-400">(comma separated)</span>
            </label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Interests / domains <span className="font-normal text-slate-400">(comma separated)</span>
            </label>
            <input
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Experience</label>
            <ul className="mt-2 space-y-2">
              {profile.experience.map((e, i) => (
                <li key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-medium text-slate-800">
                    {e.title} · {e.organization}
                  </p>
                  <p className="text-xs text-slate-400">{e.period}</p>
                  <p className="mt-1 text-sm text-slate-600">{e.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Transcript summary</label>
            <textarea
              value={form.transcriptSummary}
              onChange={(e) => setForm({ ...form, transcriptSummary: e.target.value })}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Save profile
            </button>
            {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Identity</h3>
            <p className="mt-2 text-sm font-medium text-slate-800">{profile.name}</p>
            <p className="text-xs text-slate-400">{profile.program}</p>
            <p className="text-xs text-slate-400">{profile.university}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Documents</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">CV</span>
                <button
                  onClick={() => updateStudentProfile(profile.name, { cvUploaded: !profile.cvUploaded })}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                    profile.cvUploaded
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-50 text-slate-400 ring-slate-200"
                  }`}
                >
                  {profile.cvUploaded ? "Uploaded ✓" : "Upload"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Transcript</span>
                <button
                  onClick={() =>
                    updateStudentProfile(profile.name, { transcriptUploaded: !profile.transcriptUploaded })
                  }
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                    profile.transcriptUploaded
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-50 text-slate-400 ring-slate-200"
                  }`}
                >
                  {profile.transcriptUploaded ? "Uploaded ✓" : "Upload"}
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Prototype only — file upload is simulated, no file is actually stored.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
