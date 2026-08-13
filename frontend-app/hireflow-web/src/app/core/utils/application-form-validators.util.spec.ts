import {
  extractFirstName,
  truncateCoverNote,
  validateEmail,
  validateFullName,
} from './application-form-validators.util';

describe('validateFullName', () => {
  it('flags a missing name', () => {
    expect(validateFullName('')).toBe('Enter your name.');
  });

  it('flags a whitespace-only name', () => {
    expect(validateFullName('   ')).toBe('Enter your name.');
  });

  it('accepts a valid name', () => {
    expect(validateFullName('Ravi Shah')).toBeNull();
  });
});

describe('validateEmail', () => {
  it('flags a missing email', () => {
    expect(validateEmail('')).toBe('Enter your email address.');
  });

  it('flags an email missing a domain', () => {
    expect(validateEmail('ravi@example')).toBe('Add a domain, like name@company.com.');
  });

  it('flags an email missing the @ symbol', () => {
    expect(validateEmail('ravi.example.com')).toBe('Add a domain, like name@company.com.');
  });

  it('accepts a valid email', () => {
    expect(validateEmail('ravi@example.com')).toBeNull();
  });
});

describe('extractFirstName', () => {
  it('returns the first word of a full name', () => {
    expect(extractFirstName('Ravi Shah')).toBe('Ravi');
  });

  it('falls back to "there" when the name is empty', () => {
    expect(extractFirstName('   ')).toBe('there');
  });
});

describe('truncateCoverNote', () => {
  it('leaves a short note unchanged', () => {
    expect(truncateCoverNote('Hello')).toBe('Hello');
  });

  it('truncates a note over 500 characters to the 500-character cap', () => {
    const longNote = 'a'.repeat(600);

    expect(truncateCoverNote(longNote)).toHaveLength(500);
  });
});
