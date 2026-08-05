import type { ProjectHealth, TopicStatus } from "@/lib/data";

const healthStyles: Record<ProjectHealth, string> = {
  on_track: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  attention: "bg-amber-50 text-amber-700 ring-amber-200",
  at_risk: "bg-orange-50 text-orange-700 ring-orange-200",
  blocked: "bg-red-50 text-red-700 ring-red-200",
};

const healthLabels: Record<ProjectHealth, string> = {
  on_track: "On track",
  attention: "Attention needed",
  at_risk: "At risk",
  blocked: "Blocked",
};

export function HealthBadge({ health }: { health: ProjectHealth }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${healthStyles[health]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {healthLabels[health]}
    </span>
  );
}

const topicStyles: Record<TopicStatus, string> = {
  under_review: "bg-slate-100 text-slate-600 ring-slate-200",
  published: "bg-blue-50 text-blue-700 ring-blue-200",
  matched: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  not_selected: "bg-slate-100 text-slate-500 ring-slate-200",
};

const topicLabels: Record<TopicStatus, string> = {
  under_review: "Under review",
  published: "Open for interest",
  matched: "Matched",
  not_selected: "Not selected",
};

export function TopicStatusBadge({ status }: { status: TopicStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${topicStyles[status]}`}
    >
      {topicLabels[status]}
    </span>
  );
}

export function DeliverableBadge({ status }: { status: "done" | "in_progress" | "planned" }) {
  const styles = {
    done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    in_progress: "bg-blue-50 text-blue-700 ring-blue-200",
    planned: "bg-slate-100 text-slate-500 ring-slate-200",
  } as const;
  const labels = { done: "Done", in_progress: "In progress", planned: "Planned" } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
