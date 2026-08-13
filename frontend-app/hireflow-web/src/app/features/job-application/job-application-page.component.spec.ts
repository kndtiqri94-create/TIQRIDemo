import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobApplicationStorageService } from '../../core/services/job-application-storage.service';
import { StorageUnavailableError } from '../../core/models/shared/storage-unavailable.error';
import { JobApplicationPageComponent } from './job-application-page.component';

describe('JobApplicationPageComponent', () => {
  let fixture: ComponentFixture<JobApplicationPageComponent>;
  let storageService: JobApplicationStorageService;

  function submitValidApplication(): void {
    const setInputValue = (id: string, value: string) => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(`#${id}`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    setInputValue('ap-name', 'Ravi Shah');
    setInputValue('ap-email', 'ravi@example.com');

    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const file = new File([new Uint8Array(10)], 'cv.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 });
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hf-button--primary');
    submitButton.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobApplicationPageComponent);
    storageService = TestBed.inject(JobApplicationStorageService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not navigate when the header "All open roles" link is selected (AC-2)', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.hf-header__nav-link');
    const clickEvent = new MouseEvent('click', { cancelable: true });

    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('replaces the form with the confirmation screen on a successful submission (AC-8)', () => {
    submitValidApplication();

    expect(fixture.nativeElement.querySelector('app-application-confirmation')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-application-form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Thanks Ravi');
  });

  it('returns to a fresh, empty form when "start again" is selected (AC-9)', () => {
    submitValidApplication();

    const startAgainButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hf-button--secondary');
    startAgainButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-application-form')).not.toBeNull();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#ap-name');
    expect(nameInput.value).toBe('');
  });

  it('shows a genuine storage failure error and keeps the form (with entered data) visible (AC-10)', () => {
    vi.spyOn(storageService, 'saveApplication').mockImplementation(() => {
      throw new StorageUnavailableError();
    });

    submitValidApplication();

    expect(fixture.nativeElement.querySelector('app-application-form')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain("couldn't save");
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#ap-name');
    expect(nameInput.value).toBe('Ravi Shah');
  });
});
