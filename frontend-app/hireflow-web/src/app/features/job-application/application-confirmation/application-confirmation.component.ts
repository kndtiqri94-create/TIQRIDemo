import { Component, computed, input, output } from '@angular/core';
import { JobApplication } from '../../../core/models/domain/job-application.model';
import { extractFirstName } from '../../../core/utils/application-form-validators.util';
import { preventDeadLinkNavigation } from '../../../shared/utils/dead-link.util';

/**
 * "Application sent" confirmation greeting the candidate by first name and echoing
 * their email, with a "start again" reset trigger (S-1.1.4 → AC-8, AC-9).
 */
@Component({
  selector: 'app-application-confirmation',
  standalone: true,
  templateUrl: './application-confirmation.component.html',
  styleUrl: './application-confirmation.component.scss',
})
export class ApplicationConfirmationComponent {
  readonly application = input.required<JobApplication>();

  readonly startAgain = output<void>();

  protected readonly firstName = computed(() => extractFirstName(this.application().fullName));

  protected readonly preventDeadLinkNavigation = preventDeadLinkNavigation;

  protected requestStartAgain(): void {
    this.startAgain.emit();
  }
}
