import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvUploadComponent } from './cv-upload.component';

describe('CvUploadComponent', () => {
  let fixture: ComponentFixture<CvUploadComponent>;
  let component: CvUploadComponent;

  function buildFile(name: string, sizeBytes: number, type: string): File {
    const file = new File([new Uint8Array(Math.min(sizeBytes, 1024))], name, { type });
    Object.defineProperty(file, 'size', { value: sizeBytes });
    return file;
  }

  function selectFile(file: File): void {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CvUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the default helper hint and no file selected initially', () => {
    const hint = fixture.nativeElement.querySelector('output');
    expect(hint.textContent).toContain('PDF, DOC or DOCX, up to 10MB.');
  });

  it('accepts a valid PDF and emits its metadata (AC-4)', () => {
    const emitted: unknown[] = [];
    component.attachmentChange.subscribe((value) => emitted.push(value));

    selectFile(buildFile('cv.pdf', 1024, 'application/pdf'));

    expect(emitted).toEqual([{ fileName: 'cv.pdf', fileSizeBytes: 1024, fileType: 'application/pdf' }]);
    expect(fixture.nativeElement.textContent).toContain('cv.pdf');
  });

  it('rejects an oversized file and shows the reason without attaching it (AC-5)', () => {
    selectFile(buildFile('cv.pdf', 11 * 1024 * 1024, 'application/pdf'));

    const hint = fixture.nativeElement.querySelector('output');
    expect(hint.textContent).toContain('larger than the 10MB limit');
    expect(fixture.nativeElement.querySelector('.hf-cv-file')).toBeNull();
  });

  it('rejects a disallowed file type and shows the reason (AC-5)', () => {
    selectFile(buildFile('cv.png', 1024, 'image/png'));

    const hint = fixture.nativeElement.querySelector('output');
    expect(hint.textContent).toContain('Only PDF, DOC or DOCX files are accepted.');
  });

  it('clears the selected file when Remove is selected', () => {
    const emitted: unknown[] = [];
    component.attachmentChange.subscribe((value) => emitted.push(value));
    selectFile(buildFile('cv.pdf', 1024, 'application/pdf'));

    const removeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hf-cv-file button');
    removeButton.click();
    fixture.detectChanges();

    expect(emitted.at(-1)).toBeNull();
    expect(fixture.nativeElement.querySelector('.hf-cv-dropzone')).not.toBeNull();
  });

  it('shows the required message once submitAttempted is true and no file is attached', () => {
    fixture.componentRef.setInput('submitAttempted', true);
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('output');
    expect(hint.textContent).toContain('Attach your CV to apply.');
  });
});
