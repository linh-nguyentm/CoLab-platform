"use client";

import { useState } from "react";
import Link from "next/link";
import { companies, CURRENT_COMPANY_ID } from "@/lib/data";

export default function CompanyProfilePage() {
  const original = companies.find((c) => c.id === CURRENT_COMPANY_ID)!;
  const [form, setForm] = useState({ ...original });
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/company" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to company hub
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Company profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Shown to chairs reviewing your project submissions.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-slate-700">Company name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Industry</label>
          <input
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">About</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Contact name</label>
            <input
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Contact email</label>
            <input
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Save profile
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved for this session ✓</span>}
        </div>
      </form>
    </div>
  );
}
