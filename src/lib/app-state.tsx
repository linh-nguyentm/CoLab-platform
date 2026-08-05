"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  topics as initialTopics,
  projects as initialProjects,
  projectDrafts as initialDrafts,
  projectSubmissions as initialSubmissions,
  notifications as initialNotifications,
  studentProfiles as initialStudentProfiles,
  chatMessages as initialChatMessages,
  defaultPreflightChecklist,
  getChair,
  getDraft,
  getUniversity,
  getCompany,
  CURRENT_COMPANY_ID,
  type Topic,
  type Project,
  type ProjectDraft,
  type ProjectSubmission,
  type AppNotification,
  type Checkpoint,
  type Deliverable,
  type Meeting,
  type StudentProfile,
  type ChatMessage,
  type Role,
} from "./data";

interface AppStateValue {
  topics: Topic[];
  projects: Project[];
  drafts: ProjectDraft[];
  submissions: ProjectSubmission[];
  notifications: AppNotification[];

  createDraft: (draft: Omit<ProjectDraft, "id" | "createdDate" | "companyId">) => ProjectDraft;
  submitDraftToChairs: (draftId: string, chairIds: string[]) => void;
  respondToSubmission: (
    submissionId: string,
    decision: "accepted" | "rejected",
    note: string
  ) => void;
  expressInterest: (topicId: string, studentName: string) => void;
  matchStudent: (topicId: string, studentName: string) => Project | undefined;
  submitCheckpoint: (
    projectId: string,
    checkpointId: string,
    note: string,
    attachmentName?: string
  ) => void;
  reviewCheckpoint: (projectId: string, checkpointId: string, feedback: string) => void;
  addMeeting: (projectId: string, meeting: Omit<Meeting, "id">) => void;
  addStatusUpdate: (
    projectId: string,
    update: { health: Project["health"]; note: string; author: string }
  ) => void;
  markNotificationRead: (id: string) => void;
  submissionsForDraft: (draftId: string) => ProjectSubmission[];

  studentProfiles: StudentProfile[];
  updateStudentProfile: (name: string, updates: Partial<StudentProfile>) => void;

  chatMessages: ChatMessage[];
  sendMessage: (projectId: string, authorRole: Role, authorName: string, body: string) => void;

  updateAgreement: (
    projectId: string,
    fields: Pick<Project, "scope" | "outOfScope" | "successPractical" | "successAcademic" | "cadence">,
    changedBy: string,
    changeNote: string
  ) => void;
  addDeliverable: (projectId: string, deliverable: Deliverable) => void;
  updateDeliverableStatus: (
    projectId: string,
    deliverableTitle: string,
    status: Deliverable["status"]
  ) => void;
  togglePreflightItem: (projectId: string, itemId: string) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

function toDateStr(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayStr() {
  return toDateStr(new Date());
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [drafts, setDrafts] = useState<ProjectDraft[]>(initialDrafts);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(initialSubmissions);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>(initialStudentProfiles);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  function pushNotification(n: Omit<AppNotification, "id" | "date" | "read">) {
    setNotifications((prev) => [
      { ...n, id: nextId("n"), date: todayStr(), read: false },
      ...prev,
    ]);
  }

  function createDraft(draft: Omit<ProjectDraft, "id" | "createdDate" | "companyId">) {
    const newDraft: ProjectDraft = {
      ...draft,
      id: nextId("d"),
      companyId: CURRENT_COMPANY_ID,
      createdDate: todayStr(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    return newDraft;
  }

  function submitDraftToChairs(draftId: string, chairIds: string[]) {
    const deadline = addDays(todayStr(), 14);
    const newSubs: ProjectSubmission[] = chairIds.map((chairId) => ({
      id: nextId("s"),
      draftId,
      chairId,
      status: "submitted",
      submittedDate: todayStr(),
      deadline,
    }));
    setSubmissions((prev) => [...newSubs, ...prev]);

    const draft = getDraft(draftId) ?? drafts.find((d) => d.id === draftId);
    chairIds.forEach((chairId) => {
      pushNotification({
        audience: "academic",
        audienceRefId: chairId,
        title: "New project submission awaiting review",
        body: `A company submitted "${draft?.title ?? "a project"}" for your review.`,
        deadline,
        link: "/chair",
      });
    });
  }

  function respondToSubmission(
    submissionId: string,
    decision: "accepted" | "rejected",
    note: string
  ) {
    let touchedDraft: ProjectDraft | undefined;
    let touchedChairId = "";
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== submissionId) return s;
        touchedDraft = drafts.find((d) => d.id === s.draftId);
        touchedChairId = s.chairId;
        return { ...s, status: decision, responseNote: note, responseDate: todayStr() };
      })
    );

    if (!touchedDraft) return;
    const chair = getChair(touchedChairId);
    if (!chair) return;
    const university = getUniversity(chair.universityId);
    const company = getCompany(touchedDraft.companyId);

    if (decision === "accepted") {
      const newTopic: Topic = {
        id: nextId("t"),
        title: touchedDraft.title,
        company: company?.name ?? "Company",
        companyId: touchedDraft.companyId,
        chair: chair.name,
        chairId: chair.id,
        university: university?.name ?? "",
        universityId: university?.id,
        domain: touchedDraft.domain,
        duration: touchedDraft.duration,
        skills: touchedDraft.skills,
        problem: touchedDraft.problem,
        outcome: touchedDraft.outcome,
        status: "published",
        places: touchedDraft.places,
        interested: 0,
        applicants: [],
      };
      setTopics((prev) => [newTopic, ...prev]);
    }

    pushNotification({
      audience: "company",
      audienceRefId: touchedDraft.companyId,
      title: `Chair response: ${touchedDraft.title}`,
      body:
        decision === "accepted"
          ? `${chair.name} (${university?.name}) accepted this submission. It is now published for students to apply.`
          : `${chair.name} (${university?.name}) declined this submission — ${note}. You can revise and resubmit to another chair.`,
      link: "/company",
    });
  }

  function expressInterest(topicId: string, studentName: string) {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId && !t.applicants.includes(studentName)
          ? { ...t, applicants: [...t.applicants, studentName], interested: t.interested + 1 }
          : t
      )
    );
  }

  function matchStudent(topicId: string, studentName: string) {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return undefined;
    const chair = topic.chairId ? getChair(topic.chairId) : undefined;

    const newProject: Project = {
      id: nextId("p"),
      topicId: topic.id,
      title: topic.title,
      company: topic.company,
      companyContact: getCompany(topic.companyId)?.contactName ?? topic.company,
      chair: `${topic.chair}, ${topic.university}`,
      supervisor: chair ? `${chair.contactName} (${chair.contactRole})` : "Supervisor",
      studentTeam: [studentName],
      health: "on_track",
      status: "active",
      isPublic: false,
      agreementVersion: "v1.0",
      scope: topic.problem,
      outOfScope: "To be agreed at kickoff.",
      deliverables: [],
      successPractical: topic.outcome,
      successAcademic: "To be agreed at kickoff.",
      cadence: "To be agreed at kickoff.",
      agreementHistory: [],
      preflight: defaultPreflightChecklist(),
      updates: [
        {
          date: todayStr(),
          author: "System",
          health: "on_track",
          note: "Project matched. Workspace created — schedule a kickoff meeting to set expectations.",
        },
      ],
      decisions: [],
      handover: [],
      checkpoints: [
        {
          id: nextId("cp"),
          title: "Kickoff & expectations agreed",
          dueDate: addDays(todayStr(), 7),
          status: "upcoming",
        },
      ],
      meetings: [],
    };

    setProjects((prev) => [newProject, ...prev]);
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, status: "matched" } : t)));

    pushNotification({
      audience: "student",
      audienceRefId: studentName,
      title: `You've been matched: ${topic.title}`,
      body: "A project workspace has been created. Check the kickoff checkpoint for next steps.",
      link: `/projects/${newProject.id}`,
    });
    pushNotification({
      audience: "company",
      audienceRefId: topic.companyId,
      title: `Student matched: ${topic.title}`,
      body: `${studentName} has been matched to this project. The shared workspace is now open.`,
      link: `/projects/${newProject.id}`,
    });

    return newProject;
  }

  function submitCheckpoint(
    projectId: string,
    checkpointId: string,
    note: string,
    attachmentName?: string
  ) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          checkpoints: p.checkpoints.map((cp) =>
            cp.id === checkpointId
              ? {
                  ...cp,
                  status: "submitted",
                  studentNote: note,
                  attachments: attachmentName
                    ? [...(cp.attachments ?? []), attachmentName]
                    : cp.attachments,
                }
              : cp
          ),
        };
      })
    );
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      pushNotification({
        audience: "company",
        title: `Task submitted: ${project.title}`,
        body: "The student team submitted a checkpoint task — your feedback is needed.",
        link: `/projects/${projectId}`,
      });
    }
  }

  function reviewCheckpoint(projectId: string, checkpointId: string, feedback: string) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          checkpoints: p.checkpoints.map((cp) =>
            cp.id === checkpointId ? { ...cp, status: "reviewed", companyFeedback: feedback } : cp
          ),
        };
      })
    );
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.studentTeam.forEach((studentName) => {
        pushNotification({
          audience: "student",
          audienceRefId: studentName,
          title: `Feedback received: ${project.title}`,
          body: feedback,
          link: `/projects/${projectId}`,
        });
      });
    }
  }

  function addMeeting(projectId: string, meeting: Omit<Meeting, "id">) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, meetings: [...p.meetings, { ...meeting, id: nextId("mt") }] }
          : p
      )
    );
  }

  function addStatusUpdate(
    projectId: string,
    update: { health: Project["health"]; note: string; author: string }
  ) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              health: update.health,
              updates: [{ date: todayStr(), ...update }, ...p.updates],
            }
          : p
      )
    );
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function submissionsForDraft(draftId: string) {
    return submissions.filter((s) => s.draftId === draftId);
  }

  function updateStudentProfile(name: string, updates: Partial<StudentProfile>) {
    setStudentProfiles((prev) =>
      prev.map((p) => (p.name === name ? { ...p, ...updates } : p))
    );
  }

  function sendMessage(projectId: string, authorRole: Role, authorName: string, body: string) {
    setChatMessages((prev) => [
      ...prev,
      { id: nextId("msg"), projectId, authorRole, authorName, body, date: todayStr() },
    ]);
  }

  function bumpVersion(version: string) {
    const match = version.match(/^v(\d+)\.(\d+)$/);
    if (!match) return `${version}.1`;
    const [, major, minor] = match;
    return `v${major}.${Number(minor) + 1}`;
  }

  function updateAgreement(
    projectId: string,
    fields: Pick<Project, "scope" | "outOfScope" | "successPractical" | "successAcademic" | "cadence">,
    changedBy: string,
    changeNote: string
  ) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const snapshot = {
          version: p.agreementVersion,
          date: todayStr(),
          changedBy,
          changeNote: changeNote || "No note provided.",
          scope: p.scope,
          outOfScope: p.outOfScope,
          successPractical: p.successPractical,
          successAcademic: p.successAcademic,
          cadence: p.cadence,
        };
        return {
          ...p,
          ...fields,
          agreementVersion: bumpVersion(p.agreementVersion),
          agreementHistory: [snapshot, ...p.agreementHistory],
        };
      })
    );
  }

  function togglePreflightItem(projectId: string, itemId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              preflight: p.preflight.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : p
      )
    );
  }

  function addDeliverable(projectId: string, deliverable: Deliverable) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, deliverables: [...p.deliverables, deliverable] } : p
      )
    );
  }

  function updateDeliverableStatus(
    projectId: string,
    deliverableTitle: string,
    status: Deliverable["status"]
  ) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              deliverables: p.deliverables.map((d) =>
                d.title === deliverableTitle ? { ...d, status } : d
              ),
            }
          : p
      )
    );
  }

  return (
    <AppStateContext.Provider
      value={{
        topics,
        projects,
        drafts,
        submissions,
        notifications,
        createDraft,
        submitDraftToChairs,
        respondToSubmission,
        expressInterest,
        matchStudent,
        submitCheckpoint,
        reviewCheckpoint,
        addMeeting,
        addStatusUpdate,
        markNotificationRead,
        submissionsForDraft,
        studentProfiles,
        updateStudentProfile,
        chatMessages,
        sendMessage,
        updateAgreement,
        addDeliverable,
        updateDeliverableStatus,
        togglePreflightItem,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within an AppStateProvider");
  return ctx;
}
