import { BOOKS } from '../data/books.js';
import { BOOK_STATUS_VALUES, MEMBER_TYPE_VALUES } from '../data/constants.js';
import { MEMBERS } from '../data/members.js';

export const BOOK_STORAGE_KEY = 'booknest.books.v1';
export const MEMBER_STORAGE_KEY = 'booknest.members.v1';

function currentStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readCustomRecords(storage, key) {
  const target = currentStorage(storage);
  if (!target) return [];

  try {
    const raw = target.getItem(key);
    if (!raw) return [];
    const records = JSON.parse(raw);
    return Array.isArray(records)
      ? records.filter((record) => record !== null && typeof record === 'object')
      : [];
  } catch {
    return [];
  }
}

function writeCustomRecords(storage, key, records) {
  const target = currentStorage(storage);
  if (!target)
    throw new Error('Browser storage is unavailable. Enable local storage and try again.');
  target.setItem(key, JSON.stringify(records));
}

function nextCode(records, prefix, { padding = 3, separator = '-' } = {}) {
  const pattern = new RegExp(`^${prefix}${separator}(\\d+)$`);
  const highest = records.reduce((max, record) => {
    const match = String(record.id ?? '').match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}${separator}${String(highest + 1).padStart(padding, '0')}`;
}

function cleanText(value, maxLength) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function cleanSummary(value) {
  return String(value ?? '')
    .trim()
    .slice(0, 300);
}

export function getStoredBooks(storage) {
  return [...BOOKS, ...readCustomRecords(storage, BOOK_STORAGE_KEY)];
}

export function getStoredMembers(storage) {
  return [...MEMBERS, ...readCustomRecords(storage, MEMBER_STORAGE_KEY)];
}

export function createBookRecord(input, storage) {
  const title = cleanText(input?.title, 120);
  const author = cleanText(input?.author, 80);
  const category = cleanText(input?.category, 40) || 'General';
  const year = Number(input?.year);
  const status = input?.status;
  const shelf = cleanText(input?.shelf, 12).toUpperCase() || 'NEW-01';
  const copies = Number(input?.copies);
  const summary = cleanSummary(input?.summary) || 'No summary has been added for this title yet.';

  if (!title) throw new Error('Enter a book title.');
  if (!author) throw new Error('Enter the author.');
  if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear() + 1) {
    throw new Error('Enter a valid publication year.');
  }
  if (!BOOK_STATUS_VALUES.includes(status)) throw new Error('Choose a valid status.');
  if (!Number.isInteger(copies) || copies < 1 || copies > 99) {
    throw new Error('Copies must be a whole number between 1 and 99.');
  }

  const books = getStoredBooks(storage);
  const book = Object.freeze({
    id: nextCode(books, 'BK'),
    title,
    author,
    category,
    year,
    status,
    shelf,
    copies,
    summary,
  });

  writeCustomRecords(storage, BOOK_STORAGE_KEY, [
    ...readCustomRecords(storage, BOOK_STORAGE_KEY),
    book,
  ]);
  return book;
}

export function createMemberRecord(input, storage) {
  const name = cleanText(input?.name, 80);
  const email = cleanText(input?.email, 120).toLowerCase();
  const type = input?.type;
  const joined = cleanText(input?.joined, 10) || new Date().toISOString().slice(0, 10);
  const loans = Number(input?.loans ?? 0);

  if (!name) throw new Error('Enter the member name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if (!MEMBER_TYPE_VALUES.includes(type)) throw new Error('Choose a valid membership type.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(joined) || Number.isNaN(Date.parse(joined))) {
    throw new Error('Enter a valid joining date.');
  }
  if (!Number.isInteger(loans) || loans < 0 || loans > 999) {
    throw new Error('Loans must be a whole number between 0 and 999.');
  }
  if (getStoredMembers(storage).some((member) => member.email.toLowerCase() === email)) {
    throw new Error('A member with that email already exists.');
  }

  const members = getStoredMembers(storage);
  const member = Object.freeze({
    id: nextCode(members, 'M', { separator: '' }),
    name,
    email,
    type,
    joined,
    loans,
  });

  writeCustomRecords(storage, MEMBER_STORAGE_KEY, [
    ...readCustomRecords(storage, MEMBER_STORAGE_KEY),
    member,
  ]);
  return member;
}
