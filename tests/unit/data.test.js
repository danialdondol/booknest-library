import { describe, expect, it } from 'vitest';
import { BOOK_STATUS_VALUES, MEMBER_TYPE_VALUES } from '../../src/data/constants.js';
import { BOOKS } from '../../src/data/books.js';
import { MEMBERS } from '../../src/data/members.js';
import { DEMO_USERS } from '../../src/data/users.js';

describe('demo data integrity', () => {
  it('has unique book ids and valid fields', () => {
    expect(new Set(BOOKS.map((book) => book.id)).size).toBe(BOOKS.length);
    for (const book of BOOKS) {
      expect(book.title).toBeTruthy();
      expect(book.author).toBeTruthy();
      expect(Number.isInteger(book.year)).toBe(true);
      expect(BOOK_STATUS_VALUES).toContain(book.status);
      expect(book.copies).toBeGreaterThan(0);
      expect(book.shelf).toMatch(/^[A-Z]{3}-\d{2}$/);
    }
  });

  it('has unique member ids and reserved-domain emails', () => {
    expect(new Set(MEMBERS.map((member) => member.id)).size).toBe(MEMBERS.length);
    for (const member of MEMBERS) {
      expect(MEMBER_TYPE_VALUES).toContain(member.type);
      expect(member.email).toMatch(/@(student\.)?example\.edu$/);
      expect(member.loans).toBeGreaterThanOrEqual(0);
    }
  });

  it('keeps demo credential fixtures explicit', () => {
    expect(DEMO_USERS).toHaveLength(2);
    expect(DEMO_USERS.map((user) => user.username)).toEqual(['admin', 'librarian']);
    expect(DEMO_USERS.every((user) => user.password.length >= 6)).toBe(true);
  });
});
