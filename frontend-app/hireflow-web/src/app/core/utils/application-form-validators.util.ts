const EMAIL_FORMAT_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const COVER_NOTE_MAX_LENGTH = 500;

/** Returns a validation message for the full name field, or `null` when valid. */
export function validateFullName(fullName: string): string | null {
  return fullName.trim() ? null : 'Enter your name.';
}

/** Returns a validation message for the email field, or `null` when valid. */
export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return 'Enter your email address.';
  }

  return EMAIL_FORMAT_PATTERN.test(trimmedEmail) ? null : 'Add a domain, like name@company.com.';
}

/** Extracts the candidate's first name for the confirmation greeting, falling back to "there". */
export function extractFirstName(fullName: string): string {
  const trimmedName = fullName.trim();
  return trimmedName ? trimmedName.split(/\s+/)[0] : 'there';
}

/** Truncates a cover note to the 500-character hard cap (defense-in-depth alongside the UI's live counter). */
export function truncateCoverNote(coverNote: string): string {
  return coverNote.slice(0, COVER_NOTE_MAX_LENGTH);
}
