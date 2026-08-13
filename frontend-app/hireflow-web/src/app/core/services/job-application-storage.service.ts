import { Injectable } from '@angular/core';
import { JobApplication } from '../models/domain/job-application.model';
import { StorageUnavailableError } from '../models/shared/storage-unavailable.error';

const JOB_APPLICATIONS_STORAGE_KEY = 'hireflow.jobApplications';

/**
 * Persists submitted job applications to browser `localStorage` only.
 * This story has no backend — nothing here ever performs a network call
 * (PRD Non-Goal NG1). A genuine `setItem`/`getItem` failure (quota exceeded,
 * storage disabled/unavailable such as private browsing) is surfaced as a
 * `StorageUnavailableError`; this is never triggered deliberately (S-1.1.5).
 */
@Injectable({ providedIn: 'root' })
export class JobApplicationStorageService {
  saveApplication(application: JobApplication): void {
    const existingApplications = this.readStoredApplications();
    const nextApplications = [...existingApplications, application];

    try {
      window.localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(nextApplications));
    } catch {
      throw new StorageUnavailableError();
    }
  }

  getApplications(): readonly JobApplication[] {
    return this.readStoredApplications();
  }

  private readStoredApplications(): readonly JobApplication[] {
    try {
      const rawValue = window.localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
      return rawValue ? (JSON.parse(rawValue) as readonly JobApplication[]) : [];
    } catch {
      throw new StorageUnavailableError();
    }
  }
}
