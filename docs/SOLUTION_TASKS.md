# Solution Tasks (Backlog) — HireFlow Job Application Demo

> **Status:** Draft
> **Version:** v0.1
> **Last updated:** 2026-08-13
> **Owner:** Product Owner (agent: product-owner)
> **Source PRD:** `docs/SOLUTION_PRD.md` (v0.1)

## How to read this document

- **Epics** are numbered `E-{n}`. Each epic groups one cohesive area of capability and maps to one or more PRD FR sections.
- **Features** are numbered `F-{epic}.{n}` and represent a meaningful slice of an epic.
- **Stories** are numbered `S-{epic}.{feature}.{n}`. Each story is independently shippable and traces back to one or more `FR-*` ids in the PRD.
- Every story is rendered as a Markdown checkbox (`- [ ]`). The Team Lead marks it complete by switching to `- [x]`.
- Each story line is formatted as: `- [ ] **S-id** [SURFACE] short title. — _Traces: FR-XXX-N_ — _Weight: N_`
- **Surface** tags for this project:
  - `WEB` — Angular frontend (the job application page, localStorage persistence).
  - `BE` — backend API (Azure Functions, per `docs/development-standards/BACKEND_STANDARDS.md`).
  - `DATA` — Prisma schema / migrations.
- **Weight** is a mandatory Fibonacci complexity estimate (1, 2, 3, 5, 8, 13 — see `.claude/agents/core-config.yaml` `taskWeight.meaning`) assigned by the Product Owner for every story. It drives the weighted completion % on `docs/SOLUTION_PROGRESS.html`. A story sized 13 is usually a signal it should be split into smaller stories.
- If the project has design references (mockups/Figma/style guides), tasks tie to one with a trailing `— _Design: docs/design/<FILE_NAME>_` reference.
- **IMPORTANT — non-integration note:** In E-1 below, `F-1.1` (frontend) and `F-1.2` (backend) are two independent, non-integrated workstreams for this demo. The frontend persists exclusively to localStorage and never calls the backend; the backend is a standalone API with no frontend caller. Do not add integration work between them unless the PRD is explicitly revised (see PRD Non-Goal NG1 and Open Question OQ1/OQ2).
- `docs/SOLUTION_PROGRESS.html` is a generated progress dashboard rebuilt automatically by the Product Owner or Team Lead every time this file changes — never edit it by hand.

---

## Epic Overview

| Epic | Title | Phase | PRD FR groups |
|---|---|---|---|
| E-1 | HireFlow Job Application Screen | 1 | FR-JOB-*, FR-FORM-*, FR-PERSIST-*, FR-API-* |

---

## E-1 — HireFlow Job Application Screen (Phase 1)

**Goal:** Deliver the fixed job posting + application form frontend (localStorage-only) and a standalone backend submit API, as two independent, non-integrated surfaces, matching `docs/design/Job Application Page.dc.html` 1:1.

### F-1.1 Frontend — Job Posting Page & Application Form (WEB, not integrated with backend)

- [ ] **S-1.1.1** [WEB] Build static job posting content (header nav, title/summary, facts sidebar, hiring manager card, and the four body sections) matching the design 1:1, with dead "All open roles" link. — _Traces: FR-JOB-1, FR-JOB-2_ — _Design: docs/design/Job Application Page.dc.html_ — _Weight: 3_
- [ ] **S-1.1.2** [WEB] Build application form (name, email, cover note with 500-char counter) with field-level and summary-banner validation matching the design's rules and states. — _Traces: FR-FORM-1, FR-FORM-4_ — _Design: docs/design/Job Application Page.dc.html_ — _Weight: 5_
- [ ] **S-1.1.3** [WEB] Implement CV upload (click-to-browse + drag-and-drop, `.pdf`/`.doc`/`.docx`, ≤10MB) storing metadata only (name, size, type) — never persisting file bytes. — _Traces: FR-FORM-2, FR-FORM-3_ — _Design: docs/design/Job Application Page.dc.html_ — _Weight: 5_
- [ ] **S-1.1.4** [WEB] Persist successful submission to localStorage (name, email, note, CV metadata, timestamp); render "Application sent" confirmation and implement "Start again" reset. — _Traces: FR-FORM-5, FR-FORM-6, FR-PERSIST-1, FR-PERSIST-3_ — _Design: docs/design/Job Application Page.dc.html_ — _Weight: 5_
- [ ] **S-1.1.5** [WEB] Handle genuine localStorage failures (quota exceeded, storage disabled/private browsing) with a visible error state; no debug/simulate-failure toggle. — _Traces: FR-PERSIST-2_ — _Design: docs/design/Job Application Page.dc.html_ — _Weight: 3_
- [ ] **S-1.1.6** [WEB] Apply HireFlow Style Sheet design tokens (colour, type, spacing, radius, focus-visible states) and implement the design's responsive breakpoints (desktop ≥900px two-column, mobile ≤420px). — _Traces: Non-functional — Design fidelity_ — _Design: docs/design/HireFlow Style Sheet.dc.html_ — _Weight: 3_

### F-1.2 Backend — Application Submit API (BE/DATA, standalone, no frontend caller)

- [ ] **S-1.2.1** [DATA] Add `JobApplication` schema/migration (name, email, note, cvFileName, cvFileSize, cvFileType, createdAt) via Prisma. — _Traces: FR-API-3_ — _Weight: 3_
- [ ] **S-1.2.2** [BE] Implement `POST /applications` create endpoint with server-side validation mirroring the frontend rules (name required, email required + valid format, CV reference required, note ≤500 chars if present). — _Traces: FR-API-1, FR-API-2_ — _Weight: 5_
- [ ] **S-1.2.3** [BE] Persist the validated application to the database and return a success response with the created id; return field-level validation errors on failure. — _Traces: FR-API-3, FR-API-4_ — _Weight: 3_

---

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-08-13 | Shiham (PO) | Initial draft — HireFlow Job Application screen: E-1 with F-1.1 (frontend, localStorage-only) and F-1.2 (backend, standalone submit API), explicitly not integrated |
