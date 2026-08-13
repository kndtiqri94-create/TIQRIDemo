import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobApplication } from '../../../core/models/domain/job-application.model';
import { ApplicationConfirmationComponent } from './application-confirmation.component';

describe('ApplicationConfirmationComponent', () => {
  let fixture: ComponentFixture<ApplicationConfirmationComponent>;

  const application: JobApplication = {
    fullName: 'Ravi Shah',
    email: 'ravi@example.com',
    cvFileName: 'cv.pdf',
    cvFileSize: 1024,
    cvFileType: 'application/pdf',
    submittedAt: '2026-08-13T09:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationConfirmationComponent);
    fixture.componentRef.setInput('application', application);
    fixture.detectChanges();
  });

  it('greets the candidate by first name and echoes their email (AC-8)', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Thanks Ravi');
    expect(text).toContain('ravi@example.com');
  });

  it('does not navigate when "Browse other roles" is selected (AC-2)', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const clickEvent = new MouseEvent('click', { cancelable: true });

    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('emits startAgain when "Start again" is selected (AC-9)', () => {
    let emitted = false;
    fixture.componentInstance.startAgain.subscribe(() => (emitted = true));

    const startAgainButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hf-button--secondary');
    startAgainButton.click();

    expect(emitted).toBe(true);
  });
});
