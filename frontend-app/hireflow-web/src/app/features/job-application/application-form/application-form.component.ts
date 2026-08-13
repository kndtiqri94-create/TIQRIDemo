import { Component, computed, input, output, signal } from '@angular/core';
import { CvAttachment } from '../../../core/models/domain/cv-attachment.model';
import { JobApplication } from '../../../core/models/domain/job-application.model';
import {
  COVER_NOTE_MAX_LENGTH,
  truncateCoverNote,
  validateEmail,
  validateFullName,
} from '../../../core/utils/application-form-validators.util';
import { CvUploadComponent } from '../cv-upload/cv-upload.component';

/** The candidate-entered fields this form collects; the page adds `submittedAt` on save. */
export type ApplicationDraft = Omit<JobApplication, 'submittedAt'>;

/**
 * Full name / email / cover note / CV application form with field-level and
 * summary-banner validation (S-1.1.2), delegating CV picking to `CvUploadComponent`.
 */
@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CvUploadComponent],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
})
export class ApplicationFormComponent {
  readonly storageErrorMessage = input<string | null>(null);

  readonly applicationSubmitted = output<ApplicationDraft>();

  protected readonly fullName = signal('');
  protected readonly email = signal('');
  protected readonly coverNote = signal('');
  protected readonly cvAttachment = signal<CvAttachment | null>(null);
  protected readonly tried = signal(false);

  protected readonly coverNoteMaxLength = COVER_NOTE_MAX_LENGTH;

  protected readonly nameError = computed(() => (this.tried() ? validateFullName(this.fullName()) : null));
  protected readonly emailError = computed(() => (this.tried() ? validateEmail(this.email()) : null));
  protected readonly cvMissing = computed(() => this.tried() && this.cvAttachment() === null);

  protected readonly hasErrors = computed(
    () => this.nameError() !== null || this.emailError() !== null || this.cvMissing(),
  );

  protected readonly errorSummary = computed(() => {
    const errorCount = [this.nameError(), this.emailError(), this.cvMissing() ? 'cv' : null].filter(
      (error) => error !== null,
    ).length;

    return errorCount === 1
      ? 'One thing needs fixing before you can send this.'
      : 'A few things need fixing before you can send this.';
  });

  protected readonly noteCount = computed(() => {
    const noteLength = this.coverNote().length;
    return noteLength === 0 ? `Up to ${this.coverNoteMaxLength} characters.` : `${noteLength} / ${this.coverNoteMaxLength} characters`;
  });

  protected onFullNameInput(event: Event): void {
    this.fullName.set((event.target as HTMLInputElement).value);
  }

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  protected onCoverNoteInput(event: Event): void {
    this.coverNote.set(truncateCoverNote((event.target as HTMLTextAreaElement).value));
  }

  protected onCvAttachmentChange(attachment: CvAttachment | null): void {
    this.cvAttachment.set(attachment);
  }

  protected submit(): void {
    this.tried.set(true);

    if (this.hasErrors()) {
      return;
    }

    const cvAttachment = this.cvAttachment();
    if (!cvAttachment) {
      return;
    }

    this.applicationSubmitted.emit({
      fullName: this.fullName().trim(),
      email: this.email().trim(),
      coverNote: this.coverNote().trim() || undefined,
      cvFileName: cvAttachment.fileName,
      cvFileSize: cvAttachment.fileSizeBytes,
      cvFileType: cvAttachment.fileType,
    });
  }
}
