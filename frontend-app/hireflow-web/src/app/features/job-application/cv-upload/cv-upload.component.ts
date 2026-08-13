import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CvAttachment } from '../../../core/models/domain/cv-attachment.model';
import { formatCvFileSize, validateCvFile } from '../../../core/utils/cv-file-validation.util';

/**
 * CV picker supporting click-to-browse and drag-and-drop, accepting only
 * .pdf/.doc/.docx files up to 10MB and retaining metadata only (S-1.1.3).
 */
@Component({
  selector: 'app-cv-upload',
  standalone: true,
  templateUrl: './cv-upload.component.html',
  styleUrl: './cv-upload.component.scss',
})
export class CvUploadComponent {
  readonly submitAttempted = input(false);

  readonly attachmentChange = output<CvAttachment | null>();

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly attachment = signal<CvAttachment | null>(null);
  protected readonly rejectionReason = signal<string | null>(null);
  protected readonly dragging = signal(false);

  protected readonly hasError = computed(
    () => this.rejectionReason() !== null || (this.submitAttempted() && this.attachment() === null),
  );

  protected readonly hint = computed(() => {
    if (this.rejectionReason()) {
      return this.rejectionReason();
    }

    if (this.submitAttempted() && !this.attachment()) {
      return 'Attach your CV to apply.';
    }

    return 'PDF, DOC or DOCX, up to 10MB.';
  });

  protected readonly formattedFileSize = computed(() => {
    const currentAttachment = this.attachment();
    return currentAttachment ? formatCvFileSize(currentAttachment.fileSizeBytes) : '';
  });

  protected browse(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onFileInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.acceptSelectedFile(inputElement.files?.[0]);
    inputElement.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(): void {
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.acceptSelectedFile(event.dataTransfer?.files?.[0]);
  }

  protected clearFile(): void {
    this.attachment.set(null);
    this.rejectionReason.set(null);
    this.attachmentChange.emit(null);
  }

  private acceptSelectedFile(file: File | undefined): void {
    if (!file) {
      return;
    }

    const validationResult = validateCvFile(file);

    if (!validationResult.valid) {
      this.rejectionReason.set(validationResult.reason);
      return;
    }

    this.rejectionReason.set(null);
    this.attachment.set(validationResult.attachment);
    this.attachmentChange.emit(validationResult.attachment);
  }
}
