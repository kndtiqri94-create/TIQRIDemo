/**
 * Metadata describing a candidate's selected CV file.
 * The file's actual bytes are never read into this shape or persisted —
 * only descriptive information (per FR-FORM-3 / threat model Information Disclosure control).
 */
export interface CvAttachment {
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly fileType: string;
}
