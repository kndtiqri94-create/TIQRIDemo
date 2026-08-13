import { Component, inject, signal } from '@angular/core';
import { JobApplication } from '../../core/models/domain/job-application.model';
import { JobApplicationStorageService } from '../../core/services/job-application-storage.service';
import { StorageUnavailableError } from '../../core/models/shared/storage-unavailable.error';
import { preventDeadLinkNavigation } from '../../shared/utils/dead-link.util';
import { ApplicationConfirmationComponent } from './application-confirmation/application-confirmation.component';
import { ApplicationDraft, ApplicationFormComponent } from './application-form/application-form.component';
import { JobPostingDetailsComponent } from './job-posting-details/job-posting-details.component';

/**
 * Page shell: header/footer with the dead "All open roles"/"Privacy"/"Accessibility"
 * links, the fixed job heading, and the two-column layout hosting the job posting
 * content alongside the application form or its confirmation. Owns the localStorage
 * persistence call so a genuine failure (S-1.1.5) surfaces back into the form without
 * losing the candidate's entered data.
 */
@Component({
  selector: 'app-job-application-page',
  standalone: true,
  imports: [JobPostingDetailsComponent, ApplicationFormComponent, ApplicationConfirmationComponent],
  templateUrl: './job-application-page.component.html',
  styleUrl: './job-application-page.component.scss',
})
export class JobApplicationPageComponent {
  private readonly jobApplicationStorageService = inject(JobApplicationStorageService);

  protected readonly submittedApplication = signal<JobApplication | null>(null);
  protected readonly storageErrorMessage = signal<string | null>(null);

  protected readonly preventDeadLinkNavigation = preventDeadLinkNavigation;

  protected handleApplicationSubmitted(draft: ApplicationDraft): void {
    const application: JobApplication = { ...draft, submittedAt: new Date().toISOString() };

    try {
      this.jobApplicationStorageService.saveApplication(application);
      this.storageErrorMessage.set(null);
      this.submittedApplication.set(application);
    } catch (error) {
      this.storageErrorMessage.set(
        error instanceof StorageUnavailableError ? error.message : new StorageUnavailableError().message,
      );
    }
  }

  protected handleStartAgain(): void {
    this.submittedApplication.set(null);
    this.storageErrorMessage.set(null);
  }
}
