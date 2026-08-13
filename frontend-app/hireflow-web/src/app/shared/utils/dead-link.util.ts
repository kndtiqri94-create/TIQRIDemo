/**
 * Prevents navigation for the non-functional "All open roles" / "Browse other roles"
 * links that are present for visual completeness only in this single-posting demo (AC-2).
 */
export function preventDeadLinkNavigation(event: Event): void {
  event.preventDefault();
}
