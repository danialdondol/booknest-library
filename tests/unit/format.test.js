import { describe, expect, it } from 'vitest';
import {
  firstName,
  formatDate,
  formatLongDate,
  getGreeting,
  initials,
  normalizeText,
  pluralize,
} from '../../src/lib/format.js';

describe('normalizeText', () => {
  it('normalizes case, spacing and accents', () => {
    expect(normalizeText('  Café  Society ')).toBe('cafe society');
  });

  it('handles nullish values', () => {
    expect(normalizeText(null)).toBe('');
  });
});

describe('initials', () => {
  it('uses first and last name', () => {
    expect(initials('Wong Mei Ling')).toBe('WL');
  });

  it('strips academic and courtesy titles', () => {
    expect(initials('Dr. Hamzah Idris')).toBe('HI');
    expect(initials('Prof. Zainab Ali')).toBe('ZA');
    expect(initials('Puan Rohana')).toBe('R');
  });

  it('falls back for empty names', () => {
    expect(initials('')).toBe('?');
    expect(initials(undefined)).toBe('?');
  });
});

describe('firstName', () => {
  it('returns the first meaningful name', () => {
    expect(firstName('Dr. Hamzah Idris')).toBe('Hamzah');
    expect(firstName('Library Admin')).toBe('Library');
  });

  it('falls back for empty names', () => {
    expect(firstName('')).toBe('there');
  });
});

describe('date helpers', () => {
  it('formats ISO dates in UTC', () => {
    expect(formatDate('2024-03-12')).toBe('12 Mar 2024');
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('formats a long UTC date', () => {
    expect(formatLongDate(new Date('2026-11-04T12:00:00Z'))).toBe('Wednesday, 4 November 2026');
  });

  it('chooses a greeting by hour', () => {
    expect(getGreeting(8)).toBe('Good morning');
    expect(getGreeting(12)).toBe('Good afternoon');
    expect(getGreeting(18)).toBe('Good evening');
  });
});

describe('pluralize', () => {
  it('handles singular and plural forms', () => {
    expect(pluralize(1, 'book')).toBe('1 book');
    expect(pluralize(2, 'book')).toBe('2 books');
    expect(pluralize(2, 'copy', 'copies')).toBe('2 copies');
  });
});
