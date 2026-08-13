import { MAX_CV_FILE_SIZE_BYTES, formatCvFileSize, validateCvFile } from './cv-file-validation.util';

function buildFile(name: string, sizeBytes: number, type: string): File {
  const file = new File([new Uint8Array(Math.min(sizeBytes, 1024))], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

describe('validateCvFile', () => {
  it('accepts a PDF at exactly the 10MB boundary', () => {
    const file = buildFile('cv.pdf', MAX_CV_FILE_SIZE_BYTES, 'application/pdf');

    const result = validateCvFile(file);

    expect(result.valid).toBe(true);
  });

  it('accepts a DOC file and returns metadata-only attachment fields', () => {
    const file = buildFile('cv.doc', 1024, 'application/msword');

    const result = validateCvFile(file);

    expect(result).toEqual({
      valid: true,
      attachment: { fileName: 'cv.doc', fileSizeBytes: 1024, fileType: 'application/msword' },
    });
  });

  it('accepts a DOCX file regardless of extension case', () => {
    const file = buildFile('CV.DOCX', 2048, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    const result = validateCvFile(file);

    expect(result.valid).toBe(true);
  });

  it('rejects a file over the 10MB boundary', () => {
    const file = buildFile('cv.pdf', MAX_CV_FILE_SIZE_BYTES + 1, 'application/pdf');

    const result = validateCvFile(file);

    expect(result).toEqual({ valid: false, reason: 'That file is larger than the 10MB limit.' });
  });

  it('rejects a disallowed file type', () => {
    const file = buildFile('cv.png', 1024, 'image/png');

    const result = validateCvFile(file);

    expect(result).toEqual({ valid: false, reason: 'Only PDF, DOC or DOCX files are accepted.' });
  });
});

describe('formatCvFileSize', () => {
  it('formats sizes under 1MB in whole kilobytes', () => {
    expect(formatCvFileSize(2048)).toBe('2 KB');
  });

  it('rounds sub-kilobyte sizes up to a minimum of 1 KB', () => {
    expect(formatCvFileSize(10)).toBe('1 KB');
  });

  it('formats sizes over 1MB in megabytes to one decimal place', () => {
    expect(formatCvFileSize(3_355_443)).toBe('3.2 MB');
  });
});
