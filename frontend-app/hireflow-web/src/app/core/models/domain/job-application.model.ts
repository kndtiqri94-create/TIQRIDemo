/**
 * A candidate's submitted job application, persisted only to browser localStorage
 * for this demo phase (PRD Non-Goal NG1 — no backend call from this frontend).
 */
export interface JobApplication {
  readonly fullName: string;
  readonly email: string;
  readonly coverNote?: string;
  readonly cvFileName: string;
  readonly cvFileSize: number;
  readonly cvFileType: string;
  readonly submittedAt: string;
}
