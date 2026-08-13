/**
 * Raised when a genuine `localStorage` failure prevents saving an application
 * (quota exceeded, storage disabled, or unavailable such as in private browsing).
 * Never thrown deliberately for demo/test purposes — only on a real caught exception
 * from `localStorage.setItem`/`getItem` (S-1.1.5).
 */
export class StorageUnavailableError extends Error {
  constructor(message = "Your browser's storage is unavailable or full.") {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}
