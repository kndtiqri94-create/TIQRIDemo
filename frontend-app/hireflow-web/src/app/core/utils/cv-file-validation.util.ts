import { CvAttachment } from '../models/domain/cv-attachment.model';

/** Accepted CV file extensions, matched case-insensitively (defense-in-depth — never trust the `accept` attribute alone). */
export const ACCEPTED_CV_FILE_EXTENSIONS: readonly string[] = ['.pdf', '.doc', '.docx'];

export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export type CvFileValidationResult =
  | { readonly valid: true; readonly attachment: CvAttachment }
  | { readonly valid: false; readonly reason: string };

function hasAcceptedExtension(fileName: string): boolean {
  const lowerCaseFileName = fileName.toLowerCase();
  return ACCEPTED_CV_FILE_EXTENSIONS.some((extension) => lowerCaseFileName.endsWith(extension));
}

/**
 * Validates a candidate-selected CV file against the accepted type allow-list and
 * the 10MB size cap, before the file is ever accepted into component state
 * (threat model — Tampering / Denial of Service mitigations, S-1.1.3).
 */
export function validateCvFile(file: File): CvFileValidationResult {
  if (!hasAcceptedExtension(file.name)) {
    return { valid: false, reason: 'Only PDF, DOC or DOCX files are accepted.' };
  }

  if (file.size > MAX_CV_FILE_SIZE_BYTES) {
    return { valid: false, reason: 'That file is larger than the 10MB limit.' };
  }

  return {
    valid: true,
    attachment: {
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type,
    },
  };
}

/** Formats a byte count the same way as the approved design (e.g. "412 KB", "3.2 MB"). */
export function formatCvFileSize(fileSizeBytes: number): string {
  if (fileSizeBytes > 1024 * 1024) {
    return `${(fileSizeBytes / 1_048_576).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(fileSizeBytes / 1024))} KB`;
}
