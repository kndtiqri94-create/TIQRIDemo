# Product Requirements Document — HireFlow Job Application Demo

> **Status:** Draft
> **Version:** v0.1
> **Last updated:** 2026-08-13
> **Owner:** Product Owner (agent: product-owner)

## 1. Vision
HireFlow is demonstrating a single job-application experience: a candidate lands on a fixed job posting page for "Senior .NET Engineer (Remote, UK)" at Northgate Labs, fills in a short application form, and receives an on-page confirmation. This is a demo, not a production ATS: the frontend behavior (form validation, submission, confirmation) and the backend (a standalone submit/validate/persist API) are built as two independent, non-integrated surfaces so each can be exercised on its own.

## 2. Goals & Non-Goals

### 2.1 Goals
- G1 — Let a candidate view a single, fixed job posting and submit an application (name, email, CV, optional cover note) that is validated client-side per the design's rules.
- G2 — Persist the submitted application client-side (localStorage) so the frontend flow (including the "Application sent" confirmation and "Start again") works end-to-end without any backend dependency.
- G3 — Provide a standalone backend API with one create/submit endpoint that accepts an application payload, applies server-side validation mirroring the frontend rules, and persists the validated record to a database — independent of the frontend, for demo/API purposes only.
- G4 — Match the visual design in `docs/design/Job Application Page.dc.html` pixel-for-pixel (desktop ≥900px two-column layout and mobile ≤420px, per the file's own embedded breakpoints), using `docs/design/HireFlow Style Sheet.dc.html` as the shared token reference (colour, type, spacing, radius, focus states).

### 2.2 Non-Goals (explicit)
- NG1 — Frontend and backend are **NOT integrated** in this demo. The frontend never calls the backend submit endpoint; it persists exclusively to localStorage. The backend is a separate, standalone API exercised independently (e.g. direct HTTP calls / Postman / automated tests).
- NG2 — No list/get/read endpoints for applications — the backend exposes only the create/submit endpoint.
- NG3 — No real file storage/upload pipeline. The CV field stores metadata only (file name, size, MIME type) in localStorage; actual file bytes are never persisted, to avoid exceeding the localStorage quota.
- NG4 — No dynamic job postings, job listing/search, or multi-role browsing. The job content (title, description, salary, location, contract, team, hiring manager, closing date) is fixed content matching the design 1:1.
- NG5 — The "All open roles" header link and the "Browse other roles" link on the confirmation screen are dead/static (`href="#"`) for this demo — no other-roles page exists.
- NG6 — No real data-retention/deletion policy. The design's confirmation copy ("we delete applications six months after the role closes") is presentational flavor text only; no retention/deletion job is implemented (see Open Questions, OQ3).
- NG7 — No authentication/authorization — both the page and the API are unauthenticated for this demo.
- NG8 — `Job Application Mobile.dc.html` and `Job Application Wireframes.dc.html` are reference-only; they are not separately implemented. `Job Application Page.dc.html` (with its own embedded mobile breakpoint rules) is the single source of truth.

## 3. Primary Users / Personas
- **Candidate (applicant)** — visits the job posting page, reads the role details, fills in and submits the application form. No login, no role distinction.
- **API caller (backend-only, no UI)** — any client integrating with the standalone submit endpoint for demo/test purposes.

## 4. Key Use Cases
- UC1 — View job posting: candidate lands on the page and reads the fixed job details (title, description, salary/location/contract/team/hiring-manager facts).
- UC2 — Submit application successfully: candidate fills in name, email, uploads a CV (PDF/DOC/DOCX ≤10MB), optionally adds a cover note (≤500 chars), and submits; on success, the form is replaced by the "Application sent" confirmation and the record is stored in localStorage.
- UC3 — Fix validation errors: candidate submits with missing/invalid required fields (name, email format, CV); inline field errors and a summary banner appear per the design; submission is blocked until resolved.
- UC4 — Start again: from the confirmation screen, candidate can reset the form (per the design's "Start again" button) to submit a new application in the same session.
- UC5 — Genuine storage failure: a localStorage write fails (quota exceeded or storage disabled/private-browsing) — an error state is shown; this is not a debug-toggle scenario, only real failures trigger it.
- UC6 (backend-only) — Submit via API: an API caller POSTs an application payload to the create endpoint; the server validates required name/email, email format, and required CV reference, then persists on success or returns a validation error otherwise.

## 5. Functional Requirements

### 5.1 Job Posting Content (Frontend)
- **FR-JOB-1** — The job posting content (title "Senior .NET Engineer (Remote, UK)", company/team line, summary, salary, location, contract, team, applications-close date, hiring manager card, and the four body sections "What you'll do" / "What we're looking for" / "How we hire") is fixed, hardcoded content matching `docs/design/Job Application Page.dc.html` 1:1. No CMS, no dynamic data source.
- **FR-JOB-2** — The header "All open roles" link and the confirmation screen's "Browse other roles" link render as static, non-functional links (`href="#"`) — no navigation target exists in this demo.

### 5.2 Application Form (Frontend)
- **FR-FORM-1** — Required fields: Full name (text), Email (text, must match a valid email pattern). CV (file) is also required. Cover note is optional (textarea, max 500 characters, live counter).
- **FR-FORM-2** — CV upload accepts `.pdf`, `.doc`, `.docx` up to 10MB (per the design's dropzone copy and `accept` attribute); accepts via click-to-browse or drag-and-drop.
- **FR-FORM-3** — On successful file selection, only file metadata (name, size, type) is retained in application/component state and persisted — the file's binary contents are never read into persisted storage.
- **FR-FORM-4** — Validation runs on submit attempt (and live once a submit attempt has been made) matching the design's rules: name required, email required + valid format, CV required. Field-level border/hint colour and an error summary banner appear per the design when validation fails; submission is blocked while any required field is invalid.
- **FR-FORM-5** — On successful submit, the form section is replaced with the "Application sent" confirmation section (candidate's first name, submitted email echoed back, and static next-steps copy), matching the design.
- **FR-FORM-6** — "Start again" resets all form fields, error state, and file selection, returning to the empty application form (matching the design's `reset` behavior). It does not delete previously persisted localStorage records from earlier submissions unless explicitly cleared (see Open Questions, OQ1).

### 5.3 Frontend Persistence (localStorage only)
- **FR-PERSIST-1** — On successful submit, the application record (name, email, note, CV metadata: name/size/type, submission timestamp) is written to browser localStorage. No backend call is made.
- **FR-PERSIST-2** — If the localStorage write throws (quota exceeded, storage disabled, or private-browsing restrictions), the UI surfaces a genuine error state to the candidate rather than silently failing or falling back to an alternate store. There is no manual/debug toggle to simulate this failure — it must be triggered only by a real storage exception.
- **FR-PERSIST-3** — The frontend never reads from or writes to any backend endpoint; frontend and backend are fully independent for this demo (see Non-Goal NG1).

### 5.4 Backend Submit API (standalone, not integrated with frontend)
- **FR-API-1** — Expose exactly one endpoint: create/submit a job application (e.g. `POST /applications`). No get/list/update/delete endpoints for applications in this demo.
- **FR-API-2** — Server-side validation mirrors the frontend's rules: name required (non-empty), email required and must match a valid email format, CV reference required (e.g. file name/metadata reference — no binary upload handling required since the frontend never sends file bytes). Cover note is optional, and if present should be capped consistently with the frontend's 500-character limit.
- **FR-API-3** — On successful validation, the endpoint persists the application record to a database (a `JobApplication` table via Prisma, per this project's backend standards) and returns a success response with the created identifier.
- **FR-API-4** — On validation failure, the endpoint returns an error response identifying which field(s) failed, mirroring the frontend's per-field error semantics (name/email/CV).
- **FR-API-5** — The endpoint operates against the single fixed job posting only — no `jobId`/job-selection concept is required for this demo (see Open Questions, OQ2).

## 6. Non-Functional Requirements
| Category | Requirement |
|---|---|
| Design fidelity | Must match `docs/design/Job Application Page.dc.html` visually (desktop two-column ≥900px, mobile stacked ≤420px per its own embedded breakpoints); use `docs/design/HireFlow Style Sheet.dc.html` as the shared token reference (colour, type scale, spacing, radius, focus rings) rather than re-deriving values. |
| Accessibility | WCAG 2.1 AA, consistent with the style sheet's stated contrast ratios (labels/hints, error text, focus-visible states). |
| Data handling | CV file bytes are never persisted anywhere (frontend or backend) in this demo — metadata only. |
| Reliability | Genuine localStorage failures (quota/disabled) must produce a visible, honest error state rather than a silent failure. |
| Security | Backend endpoint performs its own server-side validation and does not trust client-side validation alone (defense in depth), consistent with this project's backend standards. |
| Scale | Demo-scale only; no load/performance targets defined. |

## 7. Constraints & Assumptions
- Constraint — `docs/design/Job Application Page.dc.html` is the single source of truth for this screen; `Job Application Mobile.dc.html` and `Job Application Wireframes.dc.html` are reference-only and are not separately implemented.
- Constraint — `docs/design/HireFlow Style Sheet.dc.html` is the shared design-token reference for the Frontend Developer.
- Assumption — The job posting is a single, fixed role ("Senior .NET Engineer (Remote, UK)" at Northgate Labs) with no other postings or dynamic job data — confirmed with stakeholder.
- Assumption — Frontend and backend being non-integrated is intentional for this demo phase, not an oversight — flagged explicitly so it isn't "fixed" without a follow-up decision.
- Assumption — The backend does persist to a database (per stakeholder answer) even without a read endpoint, so the create endpoint's behavior can be verified via the database directly or a future admin/list capability.

## 8. Dependencies
- None — this is a self-contained demo feature; the frontend and backend workstreams have no build/runtime dependency on each other.

## 9. Open Questions
- **OQ1** — Should "Start again" or any other action ever clear previously stored localStorage application records, or does each submission simply accumulate independently? No behavior was specified beyond resetting the visible form — treated as accumulate-only until told otherwise.
- **OQ2** — The backend has no `jobId` concept since there is only one fixed posting. If this demo is ever extended to multiple postings, the API and schema will need a job/posting identifier — out of scope for now, flagged for future work.
- **OQ3** — The design's confirmation copy ("we delete applications six months after the role closes") is flavor text only — no retention/deletion policy is implemented in either the frontend or backend for this demo (per stakeholder confirmation).

## 10. Change Log
| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-08-13 | Shiham (PO) | Initial draft — HireFlow Job Application screen (frontend localStorage-only + standalone backend submit API) |
