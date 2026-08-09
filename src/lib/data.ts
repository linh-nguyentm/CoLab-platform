export type Role = "company" | "academic" | "student";

export type TopicStatus =
  | "under_review"
  | "published"
  | "matched"
  | "not_selected";

export interface Topic {
  id: string;
  title: string;
  company: string;
  companyId: string;
  chair: string;
  chairId?: string;
  university: string;
  universityId?: string;
  domain: string;
  duration: string;
  skills: string[];
  problem: string;
  outcome: string;
  status: TopicStatus;
  statusReason?: string;
  places: number;
  interested: number;
  applicants: string[];
}

export type ProjectHealth = "on_track" | "attention" | "at_risk" | "blocked";

export interface Deliverable {
  title: string;
  owner: string;
  due: string;
  status: "done" | "in_progress" | "planned";
}

export interface StatusUpdate {
  date: string;
  author: string;
  health: ProjectHealth;
  note: string;
}

export interface Decision {
  date: string;
  title: string;
  owner: string;
  rationale: string;
  impact: string;
}

export interface HandoverItem {
  item: string;
  owner: string;
  status: "done" | "pending";
}

export type CheckpointStatus = "upcoming" | "due_soon" | "submitted" | "reviewed";

export interface Checkpoint {
  id: string;
  title: string;
  dueDate: string;
  status: CheckpointStatus;
  studentNote?: string;
  attachments?: string[];
  companyFeedback?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  notes?: string;
}

export interface Project {
  id: string;
  topicId: string;
  title: string;
  company: string;
  companyId: string;
  companyContact: string;
  chair: string;
  supervisor: string;
  studentTeam: string[];
  health: ProjectHealth;
  status: "active" | "completed";
  isPublic: boolean;
  finishedDate?: string;
  outcomeSummary?: string;
  agreementVersion: string;
  scope: string;
  outOfScope: string;
  deliverables: Deliverable[];
  successPractical: string;
  successAcademic: string;
  cadence: string;
  agreementHistory: AgreementVersionRecord[];
  preflight: PreflightItem[];
  updates: StatusUpdate[];
  decisions: Decision[];
  handover: HandoverItem[];
  checkpoints: Checkpoint[];
  meetings: Meeting[];
}

export interface AgreementVersionRecord {
  version: string;
  date: string;
  changedBy: string;
  changeNote: string;
  scope: string;
  outOfScope: string;
  successPractical: string;
  successAcademic: string;
  cadence: string;
}

export interface PreflightItem {
  id: string;
  label: string;
  category: "confidentiality" | "technical" | "scope";
  checked: boolean;
}

export function defaultPreflightChecklist(): PreflightItem[] {
  return [
    { id: "pf1", label: "Confidentiality / NDA requirements agreed", category: "confidentiality", checked: false },
    { id: "pf2", label: "Data classification decided (public / internal / confidential)", category: "confidentiality", checked: false },
    { id: "pf3", label: "Data access & technical environment confirmed", category: "technical", checked: false },
    { id: "pf4", label: "Tools, software licenses and compute access confirmed", category: "technical", checked: false },
    { id: "pf5", label: "IP ownership of the final output clarified", category: "scope", checked: false },
    { id: "pf6", label: "Out-of-scope boundaries explicitly agreed", category: "scope", checked: false },
  ];
}

export interface Experience {
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface StudentProfile {
  name: string;
  university: string;
  program: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: Experience[];
  transcriptSummary: string;
  cvUploaded: boolean;
  transcriptUploaded: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  authorRole: Role;
  authorName: string;
  body: string;
  date: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
}

export interface Chair {
  id: string;
  universityId: string;
  name: string;
  contactName: string;
  contactRole: "Professor" | "PhD Candidate" | "Coordinator";
  researchFocus: string[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  contactName: string;
  contactEmail: string;
}

export type SubmissionStatus =
  | "submitted"
  | "accepted"
  | "rejected";

export interface ProjectSubmission {
  id: string;
  draftId: string;
  chairId: string;
  status: SubmissionStatus;
  submittedDate: string;
  deadline: string;
  responseNote?: string;
  responseDate?: string;
}

export interface ProjectDraft {
  id: string;
  companyId: string;
  title: string;
  domain: string;
  skills: string[];
  problem: string;
  outcome: string;
  duration: string;
  places: number;
  createdDate: string;
}

export type NotificationAudience = "company" | "academic" | "student";

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  audienceRefId?: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  deadline?: string;
  link?: string;
}

export const universities: University[] = [
  { id: "u1", name: "TUM School of Management", shortName: "TUM" },
  { id: "u2", name: "LMU Munich", shortName: "LMU" },
  { id: "u3", name: "RWTH Aachen", shortName: "RWTH" },
];

export const chairs: Chair[] = [
  {
    id: "ch1",
    universityId: "u1",
    name: "Chair of Digital Innovation (Campus Heilbronn)",
    contactName: "Lukas Herrmann",
    contactRole: "PhD Candidate",
    researchFocus: ["AI", "Computer Vision", "Sustainability", "Data Analysis"],
  },
  {
    id: "ch2",
    universityId: "u1",
    name: "Chair of Digital Marketing",
    contactName: "Prof. Anna Weiss",
    contactRole: "Professor",
    researchFocus: ["Marketing Analytics", "Consumer Behavior", "Survey Design"],
  },
  {
    id: "ch3",
    universityId: "u1",
    name: "Chair of Entrepreneurship and Family Enterprise",
    contactName: "Dr. Felix Brandt",
    contactRole: "Coordinator",
    researchFocus: ["Venture Capital", "Startup Research", "Data Structuring"],
  },
  {
    id: "ch4",
    universityId: "u2",
    name: "Chair of Sustainable Energy Systems",
    contactName: "Prof. Katharina Voss",
    contactRole: "Professor",
    researchFocus: ["Renewable Energy", "Environmental Data", "Sustainability"],
  },
  {
    id: "ch5",
    universityId: "u3",
    name: "Chair of Applied Machine Learning",
    contactName: "Dr. Omar Said",
    contactRole: "PhD Candidate",
    researchFocus: ["Machine Learning", "Computer Vision", "AI"],
  },
  {
    id: "ch6",
    universityId: "u2",
    name: "Chair of Marketing & Consumer Insights",
    contactName: "Prof. Nina Falk",
    contactRole: "Professor",
    researchFocus: ["Consumer Behavior", "Marketing Analytics", "Experiment Design"],
  },
];

export const companies: CompanyProfile[] = [
  {
    id: "c1",
    name: "BirdVision",
    industry: "Wind energy & environmental tech",
    description:
      "BirdVision builds risk-screening tools for wind-energy site planning, helping developers avoid bird-collision hotspots before construction.",
    contactName: "Benjamin Braun",
    contactEmail: "benjamin.braun@birdvision.example",
  },
  {
    id: "c2",
    name: "Google",
    industry: "Technology",
    description: "Consumer research on search and AI-assistant behaviour.",
    contactName: "Business Manager, Istanbul office",
    contactEmail: "research@google.example",
  },
  {
    id: "c3",
    name: "Confidential — venture capital firm",
    industry: "Venture capital",
    description: "Early-stage AI investor, scouting signal research.",
    contactName: "Principal (name withheld)",
    contactEmail: "deals@vcfirm.example",
  },
];

export const topics: Topic[] = [
  {
    id: "t1",
    title: "Bird-collision risk scoring for new wind sites",
    company: "BirdVision",
    companyId: "c1",
    chair: "Chair of Digital Innovation (Campus Heilbronn)",
    chairId: "ch1",
    university: "TUM School of Management",
    universityId: "u1",
    domain: "AI & Sustainability",
    duration: "1 semester (~4 months)",
    skills: ["Python", "Computer vision", "Data analysis"],
    problem:
      "BirdVision wants a prototype that ranks candidate wind-turbine sites by bird-collision risk, using public environmental and migration data, to speed up early-stage site screening.",
    outcome:
      "A working scoring prototype plus a validation report the team can sanity-check against known sites.",
    status: "matched",
    places: 1,
    interested: 4,
    applicants: ["Mai Tran", "Julia Becker", "Samuel Osei"],
  },
  {
    id: "t2",
    title: "Consumer search behavior: search engine vs. LLM assistant",
    company: "Google",
    companyId: "c2",
    chair: "Chair of Digital Marketing",
    chairId: "ch2",
    university: "TUM School of Management",
    universityId: "u1",
    domain: "Consumer research",
    duration: "1 semester",
    skills: ["Survey design", "Experiment design", "Data analysis"],
    problem:
      "Compare how consumers behave when using a traditional search engine versus an LLM-based conversational assistant for everyday research tasks.",
    outcome:
      "A validated comparison of search behaviour patterns across the two interfaces.",
    status: "matched",
    places: 1,
    interested: 6,
    applicants: ["Yen Vu", "Rui Zhang"],
  },
  {
    id: "t3",
    title: "Early-stage AI startup scouting signals",
    company: "Confidential — venture capital firm",
    companyId: "c3",
    chair: "Chair of Entrepreneurship and Family Enterprise",
    chairId: "ch3",
    university: "TUM School of Management",
    universityId: "u1",
    domain: "Venture capital / AI",
    duration: "3–4 months",
    skills: ["Research", "Data structuring", "Excel / data tools"],
    problem:
      "Identify early signals that predict which AI startups are worth scouting before they appear in standard deal databases.",
    outcome:
      "A structured signal framework and dataset the firm can keep using after handover.",
    status: "matched",
    places: 2,
    interested: 5,
    applicants: [],
  },
  {
    id: "t4",
    title: "Customer-journey optimization for wind-energy B2B sales",
    company: "BirdVision",
    companyId: "c1",
    chair: "Chair of Digital Marketing",
    chairId: "ch2",
    university: "TUM School of Management",
    universityId: "u1",
    domain: "Marketing / B2B",
    duration: "1 semester",
    skills: ["Marketing analytics", "Interviewing"],
    problem: "Map and improve the B2B customer journey for wind-energy site operators.",
    outcome: "A revised customer-journey map with prioritized improvement points.",
    status: "not_selected",
    statusReason: "Duplicate topic already answered in a previous cohort",
    places: 0,
    interested: 0,
    applicants: [],
  },
  {
    id: "t5",
    title: "A shared platform for project-study collaboration",
    company: "BirdVision",
    companyId: "c1",
    chair: "Not yet assigned",
    university: "Submitted to 3 universities",
    domain: "Digital platforms",
    duration: "Open",
    skills: ["Product design", "Full-stack development"],
    problem:
      "Design a lightweight, shared platform connecting companies, academic chairs and student teams across the whole collaboration lifecycle.",
    outcome: "A working prototype covering matching, alignment and handover.",
    status: "under_review",
    places: 0,
    interested: 0,
    applicants: [],
  },
  {
    id: "t6",
    title: "Satellite-image vegetation classification for site screening",
    company: "BirdVision",
    companyId: "c1",
    chair: "Chair of Digital Innovation (Campus Heilbronn)",
    chairId: "ch1",
    university: "TUM School of Management",
    universityId: "u1",
    domain: "AI & Sustainability",
    duration: "1 semester (~4 months)",
    skills: ["Python", "Computer vision", "Data analysis"],
    problem:
      "BirdVision wants to classify vegetation and habitat type from public satellite imagery to enrich the site-screening pipeline used alongside the bird-collision risk score.",
    outcome:
      "A prototype classifier plus a short report comparing its output against known habitat maps for 3 sites.",
    status: "published",
    places: 1,
    interested: 0,
    applicants: [],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    topicId: "t1",
    title: "Bird-collision risk scoring for new wind sites",
    company: "BirdVision",
    companyId: "c1",
    companyContact: "Benjamin Braun",
    chair: "Chair of Digital Innovation, TUM Campus Heilbronn",
    supervisor: "Lukas Herrmann (PhD candidate)",
    studentTeam: ["Mai Tran", "Julia Becker", "Samuel Osei"],
    health: "attention",
    status: "active",
    isPublic: false,
    agreementVersion: "v1.2",
    scope:
      "Build a prototype scoring model that ranks candidate wind-turbine sites by bird-collision risk, using public environmental and migration data.",
    outOfScope:
      "Production deployment; integration with BirdVision's live sensor pipeline; work on existing installed sites.",
    deliverables: [
      { title: "Literature & data source review", owner: "Student team", due: "Week 3", status: "done" },
      { title: "Prototype scoring model", owner: "Student team", due: "Week 9", status: "in_progress" },
      { title: "Validation report (3 known sites)", owner: "Student team", due: "Week 12", status: "planned" },
      { title: "Final presentation", owner: "Student team", due: "Week 14", status: "planned" },
    ],
    successPractical:
      "Produces a ranked list the company can sanity-check against 3 known sites, with a clear README to run it.",
    successAcademic:
      "Sound methodology, documented data sources, reproducible code, honest discussion of limitations.",
    cadence: "Biweekly, Thursdays 15:00 — company + supervisor + team",
    agreementHistory: [
      {
        version: "v1.0",
        date: "2026-05-20",
        changedBy: "Lukas Herrmann (supervisor)",
        changeNote: "Initial agreement signed off at kickoff.",
        scope:
          "Build a prototype scoring model that ranks candidate wind-turbine sites by bird-collision risk, using public environmental and migration data.",
        outOfScope: "Production deployment; integration with BirdVision's live sensor pipeline.",
        successPractical: "Produces a ranked list the company can sanity-check against known sites.",
        successAcademic: "Sound methodology, documented data sources, reproducible code.",
        cadence: "Biweekly, Thursdays 15:00 — company + supervisor + team",
      },
      {
        version: "v1.1",
        date: "2026-06-15",
        changedBy: "Benjamin Braun (company)",
        changeNote: "Clarified out-of-scope boundary after a question about existing installed sites.",
        scope:
          "Build a prototype scoring model that ranks candidate wind-turbine sites by bird-collision risk, using public environmental and migration data.",
        outOfScope:
          "Production deployment; integration with BirdVision's live sensor pipeline; work on existing installed sites.",
        successPractical: "Produces a ranked list the company can sanity-check against known sites.",
        successAcademic: "Sound methodology, documented data sources, reproducible code.",
        cadence: "Biweekly, Thursdays 15:00 — company + supervisor + team",
      },
    ],
    preflight: [
      { id: "pf1", label: "Confidentiality / NDA requirements agreed", category: "confidentiality", checked: true },
      { id: "pf2", label: "Data classification decided (public / internal / confidential)", category: "confidentiality", checked: true },
      { id: "pf3", label: "Data access & technical environment confirmed", category: "technical", checked: true },
      { id: "pf4", label: "Tools, software licenses and compute access confirmed", category: "technical", checked: true },
      { id: "pf5", label: "IP ownership of the final output clarified", category: "scope", checked: false },
      { id: "pf6", label: "Out-of-scope boundaries explicitly agreed", category: "scope", checked: true },
    ],
    updates: [
      {
        date: "Week 6",
        author: "Student team",
        health: "attention",
        note:
          "Public data coverage is thinner than expected for 2 of 5 candidate sites. Proposing to narrow scope to the 3 well-covered sites so the validation report stays meaningful.",
      },
      {
        date: "Week 4",
        author: "Student team",
        health: "on_track",
        note: "Literature review complete. First data pipeline draft is working end to end on one site.",
      },
      {
        date: "Week 2",
        author: "Student team",
        health: "on_track",
        note: "Kickoff complete. Access to public migration and environmental datasets confirmed.",
      },
    ],
    decisions: [
      {
        date: "Week 6",
        title: "Narrow validation scope to 3 well-covered sites (from 5)",
        owner: "Lukas Herrmann (supervisor)",
        rationale: "2 of 5 candidate sites have insufficient public data coverage to produce a reliable score.",
        impact: "Scope — validation report now covers 3 sites instead of 5.",
      },
      {
        date: "Week 4",
        title: "Use open migration dataset (Movebank) instead of proprietary source",
        owner: "Student team, approved by Benjamin Braun",
        rationale: "Proprietary data access would have taken 3+ weeks to arrange; Movebank covers the same species.",
        impact: "None on deliverables; slightly broader geographic coverage than originally planned.",
      },
    ],
    handover: [
      { item: "Final report", owner: "Student team", status: "pending" },
      { item: "Prototype code repository (link)", owner: "Student team", status: "pending" },
      { item: "Data source documentation", owner: "Student team", status: "pending" },
      { item: "Model limitations write-up", owner: "Student team", status: "pending" },
      { item: "Confidentiality classification", owner: "Lukas Herrmann", status: "done" },
      { item: "Responsible company recipient confirmed", owner: "Benjamin Braun", status: "done" },
    ],
    checkpoints: [
      {
        id: "cp1-1",
        title: "Kickoff & data access confirmed",
        dueDate: "2026-06-01",
        status: "reviewed",
        studentNote: "Kickoff complete, dataset access confirmed with BirdVision.",
        companyFeedback: "Good start — thanks for the quick access setup.",
      },
      {
        id: "cp1-2",
        title: "Literature & data source review",
        dueDate: "2026-06-22",
        status: "reviewed",
        studentNote: "Review submitted, 5 candidate sites shortlisted.",
        companyFeedback: "Solid coverage. Flag the 2 low-data sites early if they stay thin.",
      },
      {
        id: "cp1-3",
        title: "Prototype v1 checkpoint",
        dueDate: "2026-08-07",
        status: "due_soon",
      },
      {
        id: "cp1-4",
        title: "Validation report checkpoint",
        dueDate: "2026-08-28",
        status: "upcoming",
      },
    ],
    meetings: [
      {
        id: "mt1-1",
        title: "Kickoff meeting",
        date: "2026-05-20",
        attendees: ["Benjamin Braun (BirdVision)", "Lukas Herrmann (supervisor)", "Student team"],
        notes: "Agreed scope, data access, and biweekly cadence.",
      },
      {
        id: "mt1-2",
        title: "Midpoint sync",
        date: "2026-07-01",
        attendees: ["Lukas Herrmann (supervisor)", "Student team"],
        notes: "Reviewed data coverage gap, agreed to narrow validation scope.",
      },
      {
        id: "mt1-3",
        title: "Prototype v1 checkpoint review",
        date: "2026-08-07",
        attendees: ["Benjamin Braun (BirdVision)", "Lukas Herrmann (supervisor)", "Student team"],
      },
    ],
  },
  {
    id: "p2",
    topicId: "t2",
    title: "Consumer search behavior: search engine vs. LLM assistant",
    company: "Google",
    companyId: "c2",
    companyContact: "Business Manager (Istanbul office)",
    chair: "Chair of Digital Marketing, TUM School of Management",
    supervisor: "Academic supervisor (PhD candidate)",
    studentTeam: ["Yen Vu", "Rui Zhang"],
    health: "on_track",
    status: "active",
    isPublic: false,
    agreementVersion: "v1.0",
    scope:
      "Design and run a comparative study of consumer search behaviour across a traditional search engine and an LLM-based conversational assistant.",
    outOfScope: "Building a production search or assistant interface.",
    deliverables: [
      { title: "Survey + experiment design", owner: "Student team", due: "Week 4", status: "done" },
      { title: "Data collection", owner: "Student team", due: "Week 8", status: "done" },
      { title: "Analysis & final report", owner: "Student team", due: "Week 12", status: "in_progress" },
    ],
    successPractical: "Clear, evaluable comparison the company can act on for product research.",
    successAcademic: "Rigorous experiment design, honest treatment of sample-size limitations.",
    cadence: "Monthly with company; weekly with supervisor",
    agreementHistory: [
      {
        version: "v1.0",
        date: "2026-05-15",
        changedBy: "Supervisor",
        changeNote: "Initial agreement signed off at kickoff.",
        scope:
          "Design and run a comparative study of consumer search behaviour across a traditional search engine and an LLM-based conversational assistant.",
        outOfScope: "Building a production search or assistant interface.",
        successPractical: "Clear, evaluable comparison the company can act on for product research.",
        successAcademic: "Rigorous experiment design, honest treatment of sample-size limitations.",
        cadence: "Monthly with company; weekly with supervisor",
      },
    ],
    preflight: [
      { id: "pf1", label: "Confidentiality / NDA requirements agreed", category: "confidentiality", checked: true },
      { id: "pf2", label: "Data classification decided (public / internal / confidential)", category: "confidentiality", checked: true },
      { id: "pf3", label: "Data access & technical environment confirmed", category: "technical", checked: true },
      { id: "pf4", label: "Tools, software licenses and compute access confirmed", category: "technical", checked: false },
      { id: "pf5", label: "IP ownership of the final output clarified", category: "scope", checked: true },
      { id: "pf6", label: "Out-of-scope boundaries explicitly agreed", category: "scope", checked: true },
    ],
    updates: [
      {
        date: "Week 9",
        author: "Student team",
        health: "on_track",
        note: "Data collection complete for 2 of 3 planned conditions. Analysis underway.",
      },
    ],
    decisions: [],
    handover: [
      { item: "Final report", owner: "Student team", status: "pending" },
      { item: "Survey instrument + anonymized data", owner: "Student team", status: "pending" },
      { item: "Confidentiality classification", owner: "Supervisor", status: "done" },
    ],
    checkpoints: [
      {
        id: "cp2-1",
        title: "Survey + experiment design checkpoint",
        dueDate: "2026-06-10",
        status: "reviewed",
        studentNote: "Design finalized and piloted with 5 participants.",
        companyFeedback: "Approved, please proceed to full data collection.",
      },
      {
        id: "cp2-2",
        title: "Data collection checkpoint",
        dueDate: "2026-07-20",
        status: "reviewed",
        studentNote: "2 of 3 conditions collected, third scheduled next week.",
        companyFeedback: "Good pace, keep us posted on the third condition.",
      },
      {
        id: "cp2-3",
        title: "Final analysis checkpoint",
        dueDate: "2026-08-25",
        status: "upcoming",
      },
    ],
    meetings: [
      {
        id: "mt2-1",
        title: "Kickoff meeting",
        date: "2026-05-15",
        attendees: ["Business Manager (Google)", "Supervisor", "Student team"],
      },
      {
        id: "mt2-2",
        title: "Monthly company sync",
        date: "2026-08-12",
        attendees: ["Business Manager (Google)", "Student team"],
      },
    ],
  },
  {
    id: "p3",
    topicId: "t3",
    title: "Early-stage AI startup scouting signals",
    company: "Confidential — venture capital firm",
    companyId: "c3",
    companyContact: "Principal (name withheld)",
    chair: "Chair of Entrepreneurship and Family Enterprise, TUM School of Management",
    supervisor: "Dr. Felix Brandt (Coordinator)",
    studentTeam: ["Noah Fischer", "Elena Marchetti"],
    health: "on_track",
    status: "completed",
    isPublic: true,
    finishedDate: "2026-03-20",
    outcomeSummary:
      "Delivered a structured signal framework (12 leading indicators) plus a scored dataset of 140 early-stage AI startups. The firm adopted the framework into its regular deal-sourcing process.",
    agreementVersion: "v1.1",
    scope:
      "Identify early signals that predict which AI startups are worth scouting before they appear in standard deal databases.",
    outOfScope: "Automated deal sourcing pipeline; integration with the firm's CRM.",
    deliverables: [
      { title: "Signal framework (literature + expert interviews)", owner: "Student team", due: "Week 5", status: "done" },
      { title: "Scored dataset (140 startups)", owner: "Student team", due: "Week 10", status: "done" },
      { title: "Final report & handover session", owner: "Student team", due: "Week 14", status: "done" },
    ],
    successPractical: "Framework adopted into the firm's regular deal-sourcing process.",
    successAcademic: "Rigorous signal validation against 3 years of historical deal outcomes.",
    cadence: "Biweekly with the firm; weekly with supervisor",
    agreementHistory: [
      {
        version: "v1.0",
        date: "2026-01-12",
        changedBy: "Dr. Felix Brandt (supervisor)",
        changeNote: "Initial agreement signed off at kickoff.",
        scope:
          "Identify early signals that predict which AI startups are worth scouting before they appear in standard deal databases.",
        outOfScope: "Automated deal sourcing pipeline; integration with the firm's CRM.",
        successPractical: "Framework usable by the firm's deal team without further development.",
        successAcademic: "Rigorous signal validation against historical deal outcomes.",
        cadence: "Biweekly with the firm; weekly with supervisor",
      },
      {
        version: "v1.1",
        date: "2026-02-02",
        changedBy: "Principal (VC firm)",
        changeNote: "Added explicit adoption success criterion after the signal framework checkpoint.",
        scope:
          "Identify early signals that predict which AI startups are worth scouting before they appear in standard deal databases.",
        outOfScope: "Automated deal sourcing pipeline; integration with the firm's CRM.",
        successPractical: "Framework adopted into the firm's regular deal-sourcing process.",
        successAcademic: "Rigorous signal validation against 3 years of historical deal outcomes.",
        cadence: "Biweekly with the firm; weekly with supervisor",
      },
    ],
    preflight: [
      { id: "pf1", label: "Confidentiality / NDA requirements agreed", category: "confidentiality", checked: true },
      { id: "pf2", label: "Data classification decided (public / internal / confidential)", category: "confidentiality", checked: true },
      { id: "pf3", label: "Data access & technical environment confirmed", category: "technical", checked: true },
      { id: "pf4", label: "Tools, software licenses and compute access confirmed", category: "technical", checked: true },
      { id: "pf5", label: "IP ownership of the final output clarified", category: "scope", checked: true },
      { id: "pf6", label: "Out-of-scope boundaries explicitly agreed", category: "scope", checked: true },
    ],
    updates: [
      {
        date: "Week 14",
        author: "Student team",
        health: "on_track",
        note: "Final report delivered and handover session completed. Firm confirmed adoption of the framework.",
      },
    ],
    decisions: [],
    handover: [
      { item: "Final report", owner: "Student team", status: "done" },
      { item: "Scored dataset (140 startups)", owner: "Student team", status: "done" },
      { item: "Signal framework documentation", owner: "Student team", status: "done" },
      { item: "Confidentiality classification", owner: "Dr. Felix Brandt", status: "done" },
    ],
    checkpoints: [
      { id: "cp3-1", title: "Signal framework checkpoint", dueDate: "2026-02-02", status: "reviewed", studentNote: "12 candidate signals identified from literature and 8 expert interviews.", companyFeedback: "Strong shortlist, proceed to scoring." },
      { id: "cp3-2", title: "Dataset scoring checkpoint", dueDate: "2026-02-27", status: "reviewed", studentNote: "140 startups scored against the 12 signals.", companyFeedback: "Great coverage — ready for validation." },
      { id: "cp3-3", title: "Final report checkpoint", dueDate: "2026-03-20", status: "reviewed", studentNote: "Final report and handover materials delivered.", companyFeedback: "Excellent work, adopting this into our process." },
    ],
    meetings: [
      { id: "mt3-1", title: "Kickoff meeting", date: "2026-01-12", attendees: ["Principal (VC firm)", "Dr. Felix Brandt (supervisor)", "Student team"] },
      { id: "mt3-2", title: "Handover session", date: "2026-03-20", attendees: ["Principal (VC firm)", "Dr. Felix Brandt (supervisor)", "Student team"], notes: "Walked through the framework and dataset; firm confirmed adoption." },
    ],
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    name: "Mai Tran",
    university: "TUM School of Management",
    program: "M.Sc. Management & Technology",
    bio: "Interested in applied AI for sustainability. Previously worked on a computer-vision side project for wildlife monitoring.",
    skills: ["Python", "Computer vision", "Data analysis", "Machine Learning"],
    interests: ["AI & Sustainability", "Venture capital / AI", "Digital platforms"],
    experience: [
      {
        title: "Working student, Data Analytics",
        organization: "GreenGrid Energy",
        period: "2025 – present",
        description: "Built dashboards for renewable-energy site performance tracking.",
      },
      {
        title: "Research assistant",
        organization: "TUM Chair of Digital Innovation",
        period: "2024 – 2025",
        description: "Supported a computer-vision research project on habitat monitoring.",
      },
    ],
    transcriptSummary: "GPA 1.6 (German scale) — strong in quantitative methods and machine learning courses.",
    cvUploaded: true,
    transcriptUploaded: true,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "msg1",
    projectId: "p1",
    authorRole: "academic",
    authorName: "Lukas Herrmann",
    body: "Welcome to the shared workspace — post updates and questions here instead of email so everyone stays in sync.",
    date: "2026-05-20",
  },
  {
    id: "msg2",
    projectId: "p1",
    authorRole: "student",
    authorName: "Mai Tran",
    body: "Thanks! We'll post our data access questions here as they come up.",
    date: "2026-05-20",
  },
  {
    id: "msg3",
    projectId: "p1",
    authorRole: "company",
    authorName: "Benjamin Braun",
    body: "Sounds good. Flag it here if you need access to any additional site data.",
    date: "2026-05-21",
  },
];

export const projectDrafts: ProjectDraft[] = [
  {
    id: "d1",
    companyId: "c1",
    title: "Customer-journey optimization for wind-energy B2B sales",
    domain: "Marketing / B2B",
    skills: ["Marketing analytics", "Interviewing"],
    problem: "Map and improve the B2B customer journey for wind-energy site operators.",
    outcome: "A revised customer-journey map with prioritized improvement points.",
    duration: "1 semester",
    places: 1,
    createdDate: "2026-05-02",
  },
  {
    id: "d2",
    companyId: "c1",
    title: "A shared platform for project-study collaboration",
    domain: "Digital platforms",
    skills: ["Product design", "Full-stack development"],
    problem:
      "Design a lightweight, shared platform connecting companies, academic chairs and student teams across the whole collaboration lifecycle.",
    outcome: "A working prototype covering matching, alignment and handover.",
    duration: "Open",
    places: 1,
    createdDate: "2026-07-10",
  },
];

export const projectSubmissions: ProjectSubmission[] = [
  {
    id: "s1",
    draftId: "d1",
    chairId: "ch2",
    status: "rejected",
    submittedDate: "2026-05-03",
    deadline: "2026-05-17",
    responseNote: "Duplicate topic already answered in a previous cohort.",
    responseDate: "2026-05-12",
  },
  {
    id: "s2",
    draftId: "d2",
    chairId: "ch1",
    status: "submitted",
    submittedDate: "2026-07-11",
    deadline: "2026-08-11",
  },
  {
    id: "s3",
    draftId: "d2",
    chairId: "ch3",
    status: "submitted",
    submittedDate: "2026-07-11",
    deadline: "2026-08-11",
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    audience: "company",
    audienceRefId: "c1",
    title: "Chair response: Customer-journey optimization",
    body: "Chair of Digital Marketing declined this submission — duplicate topic already answered in a previous cohort. You can revise and resubmit to another chair.",
    date: "2026-05-12",
    read: true,
    link: "/company",
  },
  {
    id: "n2",
    audience: "academic",
    audienceRefId: "ch1",
    title: "Checkpoint due soon: Prototype v1",
    body: "The BirdVision bird-collision risk project has a checkpoint due in a few days.",
    date: "2026-08-03",
    read: false,
    deadline: "2026-08-07",
    link: "/projects/p1",
  },
  {
    id: "n3",
    audience: "student",
    audienceRefId: "Mai Tran",
    title: "Checkpoint due soon: Prototype v1",
    body: "Your prototype v1 checkpoint for the BirdVision project is due soon — submit your progress note.",
    date: "2026-08-03",
    read: false,
    deadline: "2026-08-07",
    link: "/projects/p1",
  },
  {
    id: "n4",
    audience: "academic",
    audienceRefId: "ch1",
    title: "New project submission awaiting review",
    body: "BirdVision submitted \"A shared platform for project-study collaboration\" for your review.",
    date: "2026-07-11",
    read: false,
    deadline: "2026-08-11",
    link: "/chair",
  },
  {
    id: "n5",
    audience: "academic",
    audienceRefId: "ch3",
    title: "New project submission awaiting review",
    body: "BirdVision submitted \"A shared platform for project-study collaboration\" for your review.",
    date: "2026-07-11",
    read: false,
    deadline: "2026-08-11",
    link: "/chair",
  },
];

export const CURRENT_COMPANY_ID = "c1";
export const CURRENT_CHAIR_ID = "ch1";
export const CURRENT_STUDENT_NAME = "Mai Tran";

export function getTopic(id: string) {
  return topics.find((t) => t.id === id);
}

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function getProjectByTopic(topicId: string) {
  return projects.find((p) => p.topicId === topicId);
}

export function getChair(id: string) {
  return chairs.find((c) => c.id === id);
}

export function getUniversity(id: string) {
  return universities.find((u) => u.id === id);
}

export function getCompany(id: string) {
  return companies.find((c) => c.id === id);
}

export function getDraft(id: string) {
  return projectDrafts.find((d) => d.id === id);
}

export interface ChairMatch {
  chair: Chair;
  score: number;
  reason: string;
}

export function suggestChairsForDraft(draft: {
  domain: string;
  skills: string[];
}): ChairMatch[] {
  const norm = (s: string) => s.toLowerCase();
  return chairs
    .map((chair) => {
      const matchedSkills = draft.skills.filter((skill) =>
        chair.researchFocus.some(
          (focus) => norm(focus).includes(norm(skill)) || norm(skill).includes(norm(focus))
        )
      );
      const domainMatch = chair.researchFocus.some(
        (focus) => norm(focus).includes(norm(draft.domain)) || norm(draft.domain).includes(norm(focus))
      );
      const score = matchedSkills.length * 2 + (domainMatch ? 3 : 0);
      const reasonParts: string[] = [];
      if (domainMatch) reasonParts.push(`research focus overlaps with "${draft.domain}"`);
      if (matchedSkills.length > 0) reasonParts.push(`matches on ${matchedSkills.join(", ")}`);
      return {
        chair,
        score,
        reason: reasonParts.length > 0 ? reasonParts.join("; ") : "No strong overlap with this chair's research focus",
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function daysUntil(dateStr: string, today: Date = new Date()): number {
  const target = new Date(dateStr + "T00:00:00");
  const diffMs = target.getTime() - new Date(today.toDateString()).getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getStudentProfile(name: string) {
  return studentProfiles.find((p) => p.name === name);
}

export interface StudentMatch {
  score: number;
  matchedSkills: string[];
  domainMatch: boolean;
}

export function matchScoreForStudent(
  topic: { domain: string; skills: string[] },
  profile: StudentProfile
): StudentMatch {
  const norm = (s: string) => s.toLowerCase();
  const matchedSkills = topic.skills.filter((skill) =>
    profile.skills.some((s) => norm(s).includes(norm(skill)) || norm(skill).includes(norm(s)))
  );
  const domainMatch = profile.interests.some(
    (i) => norm(i).includes(norm(topic.domain)) || norm(topic.domain).includes(norm(i))
  );
  const score = matchedSkills.length * 2 + (domainMatch ? 3 : 0);
  return { score, matchedSkills, domainMatch };
}

export const roadmapStages = [
  "Matched",
  "Kickoff",
  "Execution",
  "Checkpoint review",
  "Handover",
] as const;

export function currentRoadmapStage(project: {
  checkpoints: Checkpoint[];
  handover: HandoverItem[];
  meetings: Meeting[];
}): number {
  if (project.handover.length > 0 && project.handover.every((h) => h.status === "done")) {
    return 4;
  }
  if (project.handover.some((h) => h.status === "done")) return 4;
  const hasSubmittedOrReviewed = project.checkpoints.some(
    (c) => c.status === "submitted" || c.status === "reviewed"
  );
  if (hasSubmittedOrReviewed) return 3;
  if (project.meetings.length > 0) return 2;
  if (project.checkpoints.length > 0) return 1;
  return 0;
}
