"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { universities, getStudentProfile, matchScoreForStudent, CURRENT_STUDENT_NAME } from "@/lib/data";
import { TopicStatusBadge } from "@/components/Badge";
import { useRole } from "@/lib/role-context";

export default function TopicsPage() {
  const { topics } = useAppState();
  const { role } = useRole();
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState<string>("All");
  const [university, setUniversity] = useState<string>("All");

  const profile = getStudentProfile(CURRENT_STUDENT_NAME);

  const visibleTopics =
    role === "student" ? topics.filter((t) => t.status === "published") : topics;

  const allSkills = useMemo(() => {
    const s = new Set<string>();
    visibleTopics.forEach((t) => t.skills.forEach((sk) => s.add(sk)));
    return ["All", ...Array.from(s)];
  }, [visibleTopics]);

  const filtered = visibleTopics.filter((t) => {
    const matchesQuery =
      query.trim() === "" ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.domain.toLowerCase().includes(query.toLowerCase()) ||
      t.company.toLowerCase().includes(query.toLowerCase());
    const matchesSkill = skill === "All" || t.skills.includes(skill);
    const matchesUniversity = university === "All" || t.universityId === university;
    return matchesQuery && matchesSkill && matchesUniversity;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Topic catalogue</h1>
      <p className="mt-1 text-sm text-slate-500">
        {role === "student"
          ? "Topics currently open for interest, published by chairs across every participating university."
          : "Browse across every participating chair and university — not locked to the one course that happened to receive a topic."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topic, company, domain..."
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {allSkills.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All skills" : s}
            </option>
          ))}
        </select>
        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All universities</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} topics</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => {
          const match = role === "student" && profile ? matchScoreForStudent(t, profile) : undefined;
          return (
            <Link
              key={t.id}
              href={`/topics/${t.id}`}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium text-slate-900">{t.title}</h2>
                <div className="flex shrink-0 items-center gap-1.5">
                  {match && match.score >= 5 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                      Strong match
                    </span>
                  )}
                  <TopicStatusBadge status={t.status} />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                {t.company} · {t.chair} · {t.university}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{t.problem}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <span
                    key={s}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      match?.matchedSkills.includes(s)
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{t.duration}</span>
                {t.status === "published" && <span>{t.applicants.length} students interested</span>}
                {t.status === "not_selected" && <span>Reason: {t.statusReason}</span>}
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-slate-400">
            No topics match those filters.
          </p>
        )}
      </div>
    </div>
  );
}
