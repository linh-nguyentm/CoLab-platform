# CoLab

**CoLab** is a prototype web platform that connects **companies**, **university chairs (academic supervisors)**, and **student teams** around university–industry project studies — from the first topic pitch all the way to a finished, handed-over project.

It was built to close a specific set of gaps found in real interviews with companies, chairs, and students running project studies today: topics get lost between courses, expectations drift silently over a semester, and finished work disappears the moment the semester ends. CoLab makes the whole lifecycle — matching, agreeing expectations, tracking progress, and handing over results — live in one shared place instead of scattered emails and personal spreadsheets.

> **Status: interactive prototype.** All data is mock data held in memory on the client. There is no backend, no database, and no real authentication — refreshing the page resets everything back to the seeded demo state. This is intentional: the goal is to demonstrate the full product concept and interaction flow, not to be production-ready yet. See [Limitations](#limitations--whats-not-real-yet) below.

---

## Table of contents

- [The three roles](#the-three-roles)
- [Feature walkthrough](#feature-walkthrough)
  - [1. Landing page](#1-landing-page)
  - [2. Role switcher](#2-role-switcher--identity)
  - [3. Dashboard](#3-dashboard)
  - [4. Company side — posting & tracking a project](#4-company-side--posting--tracking-a-project)
  - [5. Academic side — the chair inbox](#5-academic-side--the-chair-inbox)
  - [6. Student side — discovering & applying to topics](#6-student-side--discovering--applying-to-topics)
  - [7. The shared project workspace](#7-the-shared-project-workspace)
  - [8. Registry — internal archive of finished projects](#8-registry--internal-archive-of-finished-projects)
  - [9. Showcase — public page for finished, public projects](#9-showcase--public-page-for-finished-public-projects)
  - [10. Notifications](#10-notifications)
- [How the matching score works](#how-the-matching-score-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Limitations / what's not real yet](#limitations--whats-not-real-yet)

---

## The three roles

CoLab has one shared codebase but three different "views," switched instantly with the role pill in the top-right of the navigation bar:

| Role | Represents | Mock identity in this demo |
|---|---|---|
| **Student** | A student browsing topics and working on a matched project | Mai Tran (TUM School of Management) |
| **Academic** | A chair's professor / PhD candidate / coordinator reviewing submissions and supervising projects | Lukas Herrmann, Chair of Digital Innovation |
| **Company** | The company posting project ideas and following their progress | BirdVision |

Switching roles does not log in as a different account — it's a demo convenience so one person can see how the same data looks from every side of the table.

---

## Feature walkthrough

### 1. Landing page

A marketing-style homepage (`/`) explaining what CoLab is, the three stakeholder groups it connects, and the three "pillars" the product is built around: discovery & matching, a living expectations record, and structured handover. Links straight into the dashboard or the topic catalogue.

### 2. Role switcher & identity

Top navigation bar (`NavBar`), present on every page:
- **CoLab logo** → back to landing page
- **Role-specific nav links** (see below)
- **Notification bell** with an unread-count badge, scoped to whichever role/identity is currently active
- **Role switcher pill** (Student / Academic / Company)

### 3. Dashboard

`/dashboard` — the home base after logging in, tailored per role:
- Quick stats: active projects, projects needing attention (health ≠ "on track"), topics matched this term
- **Active projects** list with health badge, agreement version, team size, deliverables progress
- **Topic catalogue preview** — open topics relevant to the role, with a link to the full catalogue
- A role-specific quick-action button (e.g. "Go to company hub", "Go to chair inbox")

### 4. Company side — posting & tracking a project

**Company hub** (`/company`)
- Company profile summary
- List of every project the company has posted, with the status of each submission (awaiting response / accepted / declined + reason) per chair it was sent to

**Post a new project** (`/company/new`)
1. Fill in title, domain, required skills, problem statement, expected outcome, duration, number of places
2. CoLab immediately computes a **ranked list of chairs** most likely to be a good fit (see [matching algorithm](#how-the-matching-score-works))
3. Select one or more chairs and submit — each gets a 14-day-deadline submission with an automatic notification

**Resubmit after rejection** (`/company/submit/[draftId]`)
- If a chair declines a submission (with a reason), the company can revise and resubmit the same project idea to a *different* set of chairs — already-submitted chairs are excluded from the suggestion list

**Company profile** (`/company/profile`)
- Edit company name, industry, description, and contact details shown to reviewing chairs

### 5. Academic side — the chair inbox

`/chair`
- **Pending submissions**, each showing a live "reply within Xd" / "Xd overdue" countdown
- **Accept & publish** — instantly turns the submission into a published topic open for student applications
- **Decline** — requires a short reason, which is sent back to the company so they know how to improve the pitch
- **Past decisions** — a log of everything this chair has accepted/declined
- **Your published topics & applicants** — see who has expressed interest in each open topic, and **Match & open workspace** to pair a specific student with the project (this is what creates the shared project workspace)
- **Cross-chair view** — a collapsible section showing open topics published by *other* chairs, so a chair can spot duplicate topics or point a student toward a better-fitting opportunity elsewhere

### 6. Student side — discovering & applying to topics

**Topic catalogue** (`/topics`)
- Search by title/company/domain, filter by skill and by university
- Students only ever see topics that are actually open (`published`) or already `matched` — topics still under internal review or that were rejected by a chair are hidden, since they're not actionable for a student
- Each topic card shows a **match score** ("Strong match" badge) computed against the student's own profile

**Topic detail** (`/topics/[id]`)
- Full problem statement, expected outcome, required skills, duration, and places
- A **match panel** explaining *why* it's a good/weak fit (shared skills, matching interest area)
- **Express interest** button (only actionable in the student role, and only while the topic is still open)

**Student profile** (`/profile`)
- Bio, skills, interests/domains, work experience, a short transcript summary
- Mock "upload" toggles for CV and transcript (no real file storage — this is a prototype, the toggle just simulates having a document on file)
- This profile is what powers the match-score calculation shown throughout the topic catalogue

### 7. The shared project workspace

Once a chair matches a student to a topic, CoLab creates a **shared workspace** at `/projects/[id]` — the single place company, chair, and student team all work from afterward. It has five tabs:

**Project roadmap** (shown above the tabs on every view)
A horizontal stepper — *Matched → Kickoff → Execution → Checkpoint review → Handover* — that updates itself automatically based on real progress (checkpoints submitted/reviewed, handover items completed). It is not manually editable; each stage links straight to the Activity tab.

**"Needs your attention" panel**
A role-aware callout that appears whenever there's something for the current viewer to actually do:
- Student sees: *"N checkpoint(s) waiting on your submission"*
- Company sees: *"N submission(s) waiting on your feedback"*
- Academic sees a flag if the project's health isn't "on track"

**Tab: Overview** — scope summary, deliverables snapshot, latest status update, team & role list, cadence, and handover progress.

**Tab: Living expectations record** — the project's "agreed contract," kept intentionally lightweight:
- Scope, out-of-scope, practical success criteria, academic success criteria, cadence — editable by the company or the chair
- Every edit requires a short **change note** and is saved as a real version in a **version history** (who changed what, when, and why — nothing is silently overwritten)
- **Pre-flight checklist** — confidentiality/NDA, data classification, technical access, tooling/licenses, IP ownership, and out-of-scope boundaries, confirmed by company/academic before or at kickoff
- **Deliverables** — add new deliverables and update their status (planned / in progress / done)

**Tab: Activity** — the operational heartbeat of the project:
- **Checkpoints**: each has a due date, a live "in Nd" / "Nd overdue" countdown, and a clear status (Upcoming → Due soon → Submitted, awaiting feedback → Reviewed). Students submit a progress note *and can attach a file* (the filename is recorded — no real file storage in this prototype); companies respond with feedback, closing the loop
- **Meeting plan**: scheduled meetings with attendees and notes; academic/company can add new ones
- **Status history**: click-to-expand log of health/status updates from the team
- **Decision log**: click-to-expand record of key decisions, their rationale, and their impact

**Tab: Handover** — the agreed handover checklist (final report, code/data, documentation, confidentiality classification, etc.), each marked done/pending, with a company-side "Confirm handover received" action.

**Tab: Team chat** — a lightweight shared chat between the company contact, academic supervisor, and student team, scoped to that one project.

### 8. Registry — internal archive of finished projects

`/registry` — a searchable internal knowledge base of **every finished project**, public or not, so the next cohort doesn't start from zero. Search by title/company/skill, filter by domain, and see outcome summaries, deliverables completed, and a link into the full record.

### 9. Showcase — public page for finished, public projects

`/showcase` — a deliberately minimal, external-facing page. It only lists projects the company explicitly agreed to make public, and only shows a high-level outcome summary plus **who worked on it** (the student team) — no internal process detail, no direct personal contact information. Interested visitors use a **"Request an introduction"** action instead of contacting anyone directly, keeping the actual introduction mediated.

### 10. Notifications

The bell icon in the nav bar shows role-and-identity-scoped notifications — e.g. a chair gets notified when a new submission arrives, a student gets notified when a checkpoint is due soon or feedback has been left, a company gets notified when a chair accepts/declines a submission or a student is matched. Clicking a notification marks it read and jumps straight to the relevant page.

---

## How the matching score works

CoLab uses a simple, transparent scoring heuristic (no ML) in two places:

**Company → chair matching** (`suggestChairsForDraft`)
Compares a posted project's domain and required skills against each chair's declared research focus tags. Skill overlaps score 2 points each; a domain match scores 3 points. Chairs are ranked highest score first, with the reasoning shown in plain language ("research focus overlaps with X; matches on Y, Z").

**Topic → student matching** (`matchScoreForStudent`)
Same idea, run against the *student's own profile* (skills + interests) instead of a chair's research focus, powering the "Strong match" badges students see in the topic catalogue.

Both are intentionally simple and fully visible in [`src/lib/data.ts`](src/lib/data.ts) — the point is to demonstrate *that* matching assistance is valuable, not to ship a production-grade recommender.

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) — note: this project pins a very recent Next.js version with API differences from most training data (e.g. `params` in dynamic routes is a `Promise`, unwrapped with `use()` in Client Components)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- All application state lives in a single React Context (`src/lib/app-state.tsx`) seeded from mock data in `src/lib/data.ts` — no backend, no database, no ORM

## Project structure

```
src/
  app/
    page.tsx                  Landing page
    dashboard/                Role-aware dashboard
    topics/                   Topic catalogue + topic detail
    profile/                  Student profile
    company/                  Company hub, post project, edit profile, resubmit
    chair/                    Chair inbox
    projects/[id]/            The shared project workspace
    registry/                 Internal archive of finished projects
    showcase/                 Public page for finished, public projects
  components/
    NavBar.tsx                Top navigation, role switcher, notifications
    Badge.tsx                 Status/health badge components
  lib/
    data.ts                   All types + seeded mock data + matching helpers
    app-state.tsx             React Context holding runtime-mutable state and every "action" (submit, accept, match, send message, etc.)
    role-context.tsx          Just the current role (student/academic/company)
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the role pill in the top-right to switch between Student, Academic, and Company views.

```bash
npm run build   # production build / type-check
```

## Limitations / what's not real yet

This is a prototype meant to demonstrate the product concept end-to-end, not a production system. Specifically:

- **No persistence** — all state lives in memory (React Context); refreshing the page resets everything to the seeded demo data.
- **No real authentication** — each role has one fixed mock identity; there's no login, no multi-user accounts, no permissions system.
- **No real file storage** — "file attachment" and "CV/transcript upload" only record a filename; nothing is actually uploaded or stored anywhere.
- **No real messaging/notifications** — team chat and the notification bell are local UI state only; nothing is sent over email, push, or any external channel.
- **No backend or database** — there is no API layer; everything runs client-side.

The natural next step to make this production-ready would be adding a real backend (e.g. Postgres + an API layer), real authentication (e.g. NextAuth/Clerk with university/company SSO), and real file storage (e.g. S3-compatible storage) behind the same UI and interaction model shown here.
