"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, roleLabels } from "@/lib/role-context";
import { useAppState } from "@/lib/app-state";
import {
  type Role,
  CURRENT_COMPANY_ID,
  CURRENT_CHAIR_ID,
  CURRENT_STUDENT_NAME,
} from "@/lib/data";

const roles: Role[] = ["student", "academic", "company"];

const navLinksByRole: Record<Role, { href: string; label: string }[]> = {
  student: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/topics", label: "Topics" },
    { href: "/profile", label: "Profile" },
    { href: "/registry", label: "Registry" },
    { href: "/showcase", label: "Showcase" },
  ],
  academic: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/chair", label: "Chair inbox" },
    { href: "/topics", label: "Topics" },
    { href: "/registry", label: "Registry" },
    { href: "/showcase", label: "Showcase" },
  ],
  company: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/company", label: "Company hub" },
    { href: "/topics", label: "Topics" },
    { href: "/registry", label: "Registry" },
    { href: "/showcase", label: "Showcase" },
  ],
};

const avatarInitial: Record<Role, string> = {
  student: "S",
  academic: "A",
  company: "C",
};

export function NavBar() {
  const { role, setRole } = useRole();
  const { notifications, markNotificationRead } = useAppState();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const identityRefId =
    role === "company" ? CURRENT_COMPANY_ID : role === "academic" ? CURRENT_CHAIR_ID : CURRENT_STUDENT_NAME;

  const myNotifications = notifications
    .filter((n) => n.audience === role && (!n.audienceRefId || n.audienceRefId === identityRefId))
    .sort((a, b) => b.date.localeCompare(a.date));
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-sm">
              C
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">CoLab</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinksByRole[role].map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Notifications
                </p>
                <div className="max-h-80 overflow-y-auto">
                  {myNotifications.length === 0 && (
                    <p className="px-2 py-4 text-center text-sm text-slate-400">Nothing yet.</p>
                  )}
                  {myNotifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link ?? "#"}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setOpen(false);
                      }}
                      className={`block rounded-lg px-2.5 py-2 text-sm transition hover:bg-slate-50 ${
                        n.read ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                        <p className="font-medium text-slate-800">{n.title}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.body}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {n.date}
                        {n.deadline ? ` · deadline ${n.deadline}` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  role === r
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    role === r ? "bg-blue-600 text-white" : "bg-slate-300 text-white"
                  }`}
                >
                  {avatarInitial[r]}
                </span>
                {roleLabels[r]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
