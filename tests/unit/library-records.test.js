import { describe, expect, it } from 'vitest';
import { BOOKS } from '../../src/data/books.js';
import { MEMBERS } from '../../src/data/members.js';
import {
  BOOK_STORAGE_KEY,
  createBookRecord,
  createMemberRecord,
  getStoredBooks,
  getStoredMembers,
  MEMBER_STORAGE_KEY,
} from '../../src/lib/library-records.js';
import { createStorage } from './helpers.js';

const BOOK_INPUT = {
  title: '  The Left Hand of Darkness ',
  author: ' Ursula K. Le Guin ',
  category: 'Fiction',
  year: 1969,
  status: 'Available',
  shelf: 'fic-09',
  copies: 2,
  summary: 'A novel about an envoy learning a world.',
};

const MEMBER_INPUT = {
  name: ' New Reader ',
  email: 'New.Reader@Example.edu',
  type: 'Student',
  joined: '2026-11-16',
  loans: 0,
};

describe('stored library records', () => {
  it('returns the hardcoded seed records when storage is empty', () => {
    const storage = createStorage();
    expect(getStoredBooks(storage)).toEqual(BOOKS);
    expect(getStoredMembers(storage)).toEqual(MEMBERS);
  });

  it('merges persisted additions with the seed records', () => {
    const storage = createStorage();
    const book = createBookRecord(BOOK_INPUT, storage);
    const member = createMemberRecord(MEMBER_INPUT, storage);

    expect(getStoredBooks(storage)).toHaveLength(BOOKS.length + 1);
    expect(getStoredMembers(storage)).toHaveLength(MEMBERS.length + 1);
    expect(book.id).toBe('BK-017');
    expect(member.id).toBe('M013');
    expect(book.title).toBe('The Left Hand of Darkness');
    expect(book.shelf).toBe('FIC-09');
    expect(member.email).toBe('new.reader@example.edu');
  });

  it('increments generated ids and keeps additions isolated per storage', () => {
    const storage = createStorage();
    createBookRecord(BOOK_INPUT, storage);
    const second = createBookRecord({ ...BOOK_INPUT, title: 'Another Book' }, storage);
    expect(second.id).toBe('BK-018');
    expect(getStoredBooks(createStorage())).toEqual(BOOKS);
  });

  it('rejects invalid book data before writing', () => {
    const storage = createStorage();
    expect(() => createBookRecord({ ...BOOK_INPUT, title: ' ' }, storage)).toThrow('title');
    expect(() => createBookRecord({ ...BOOK_INPUT, author: '' }, storage)).toThrow('author');
    expect(() => createBookRecord({ ...BOOK_INPUT, year: 900 }, storage)).toThrow('year');
    expect(() => createBookRecord({ ...BOOK_INPUT, status: 'Lost' }, storage)).toThrow('status');
    expect(() => createBookRecord({ ...BOOK_INPUT, copies: 0 }, storage)).toThrow('Copies');
    expect(storage.getItem(BOOK_STORAGE_KEY)).toBeNull();
  });

  it('rejects invalid and duplicate member data before writing', () => {
    const storage = createStorage();
    expect(() => createMemberRecord({ ...MEMBER_INPUT, name: '' }, storage)).toThrow('name');
    expect(() => createMemberRecord({ ...MEMBER_INPUT, email: 'bad' }, storage)).toThrow('email');
    expect(() => createMemberRecord({ ...MEMBER_INPUT, type: 'Guest' }, storage)).toThrow(
      'membership',
    );
    expect(() => createMemberRecord({ ...MEMBER_INPUT, joined: '16/11/2026' }, storage)).toThrow(
      'date',
    );
    expect(() => createMemberRecord({ ...MEMBER_INPUT, loans: -1 }, storage)).toThrow('Loans');
    expect(storage.getItem(MEMBER_STORAGE_KEY)).toBeNull();

    createMemberRecord(MEMBER_INPUT, storage);
    expect(() => createMemberRecord(MEMBER_INPUT, storage)).toThrow('already exists');
  });

  it('ignores corrupt stored data when reading', () => {
    const storage = createStorage({
      [BOOK_STORAGE_KEY]: '{not-json',
      [MEMBER_STORAGE_KEY]: JSON.stringify([null, 'bad']),
    });
    expect(getStoredBooks(storage)).toEqual(BOOKS);
    expect(getStoredMembers(storage)).toEqual(MEMBERS);
  });

  it('reports unavailable storage instead of silently losing additions', () => {
    expect(() => createBookRecord(BOOK_INPUT, null)).toThrow('Browser storage is unavailable');
    expect(() => createMemberRecord(MEMBER_INPUT, null)).toThrow('Browser storage is unavailable');
  });
});
