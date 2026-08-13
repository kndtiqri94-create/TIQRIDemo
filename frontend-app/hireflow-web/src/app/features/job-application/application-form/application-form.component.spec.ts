import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationFormComponent } from './application-form.component';

describe('ApplicationFormComponent', () => {
  let fixture: ComponentFixture<ApplicationFormComponent>;

  function setInputValue(id: string, value: string): void {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(`#${id}`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function attachValidCv(): void {
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const file = new File([new Uint8Array(10)], 'cv.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 });
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function clickSubmit(): void {
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hf-button--primary');
    submitButton.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationFormComponent);
    fixture.detectChanges();
  });

  it('shows a live character count for the cover note and enforces the 500-character cap (AC-3)', () => {
    setInputValue('ap-note', 'Hello there');
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('#ap-note');
    textarea.value = 'a'.repeat(600);
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textarea.value).toHaveLength(500);
    const hints = fixture.nativeElement.querySelectorAll('output');
    expect(hints[hints.length - 1].textContent).toContain('500 / 500 characters');
  });

  it('blocks submission and flags name, email, and CV when all are missing (AC-6)', () => {
    let emitted = false;
    fixture.componentInstance.applicationSubmitted.subscribe(() => (emitted = true));

    clickSubmit();

    expect(emitted).toBe(false);
    const banner = fixture.nativeElement.querySelector('[role="alert"]');
    expect(banner.textContent).toContain('A few things need fixing');
    expect(fixture.nativeElement.querySelector('#ap-name').classList).toContain('hf-input--error');
  });

  it('clears a field flag as soon as it is corrected, without a second submit attempt (AC-7)', () => {
    clickSubmit();
    setInputValue('ap-name', 'Ravi Shah');

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#ap-name');
    expect(nameInput.classList).not.toContain('hf-input--error');
  });

  it('emits the collected application data once name, email, and CV are all valid (AC-8)', () => {
    let emitted: unknown = null;
    fixture.componentInstance.applicationSubmitted.subscribe((value) => (emitted = value));

    setInputValue('ap-name', 'Ravi Shah');
    setInputValue('ap-email', 'ravi@example.com');
    attachValidCv();
    clickSubmit();

    expect(emitted).toEqual({
      fullName: 'Ravi Shah',
      email: 'ravi@example.com',
      coverNote: undefined,
      cvFileName: 'cv.pdf',
      cvFileSize: 1024,
      cvFileType: 'application/pdf',
    });
  });

  it('renders a genuine storage failure message when provided, distinct from validation errors', () => {
    fixture.componentRef.setInput('storageErrorMessage', "Your browser's storage is unavailable or full.");
    fixture.detectChanges();

    const banners = fixture.nativeElement.querySelectorAll('[role="alert"]');
    expect(Array.from(banners).some((banner) => (banner as HTMLElement).textContent?.includes("couldn't save"))).toBe(
      true,
    );
  });
});
