import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobPostingDetailsComponent } from './job-posting-details.component';

describe('JobPostingDetailsComponent', () => {
  let fixture: ComponentFixture<JobPostingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostingDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPostingDetailsComponent);
    fixture.detectChanges();
  });

  it('renders the facts sidebar, hiring manager card, and all four body sections (AC-1)', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('£78,000 – £92,000');
    expect(text).toContain('Remote, UK');
    expect(text).toContain('Permanent, full time');
    expect(text).toContain('Platform, 9 people');
    expect(text).toContain('29 August 2026');
    expect(text).toContain('Dana Kowalski');
    expect(text).toContain('Hiring manager');
    expect(text).toContain("What you'll do");
    expect(text).toContain("What we're looking for");
    expect(text).toContain('How we hire');
    expect(fixture.nativeElement.querySelectorAll('.hf-description__section')).toHaveLength(4);
  });
});
