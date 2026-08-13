import { TestBed } from '@angular/core/testing';
import { JobApplication } from '../models/domain/job-application.model';
import { StorageUnavailableError } from '../models/shared/storage-unavailable.error';
import { JobApplicationStorageService } from './job-application-storage.service';

describe('JobApplicationStorageService', () => {
  let service: JobApplicationStorageService;

  const buildApplication = (): JobApplication => ({
    fullName: 'Ravi Shah',
    email: 'ravi@example.com',
    coverNote: 'Looking forward to this.',
    cvFileName: 'ravi-shah-cv.pdf',
    cvFileSize: 204_800,
    cvFileType: 'application/pdf',
    submittedAt: '2026-08-13T09:00:00.000Z',
  });

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobApplicationStorageService);
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('round-trips a successfully saved application through getApplications', () => {
    const application = buildApplication();

    service.saveApplication(application);

    expect(service.getApplications()).toEqual([application]);
  });

  it('accumulates multiple saved applications in order', () => {
    const first = buildApplication();
    const second = { ...buildApplication(), email: 'second@example.com' };

    service.saveApplication(first);
    service.saveApplication(second);

    expect(service.getApplications()).toEqual([first, second]);
  });

  it('throws StorageUnavailableError when localStorage.setItem throws (quota exceeded/private browsing)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    expect(() => service.saveApplication(buildApplication())).toThrow(StorageUnavailableError);
  });

  it('throws StorageUnavailableError when localStorage.getItem throws (storage disabled)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError');
    });

    expect(() => service.getApplications()).toThrow(StorageUnavailableError);
  });
});
