import {
  ACTIVE_STATUS,
  BOOK_SORT_KEYS,
  BOOK_STATUS_VALUES,
  SORT_DIRECTIONS,
} from '../data/constants.js';
import { normalizeText } from './format.js';

export const DEFAULT_BOOK_STATE = Object.freeze({
  query: '',
  category: 'all',
  status: 'all',
  sort: 'title',
  direction: 'asc',
});

/** Unique categories in stable alphabetical order. */
export function getCategories(books) {
  return [...new Set(books.map((book) => book.category))].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' }),
  );
}

export function filterBooks(books, { query = '', category = 'all', status = 'all' } = {}) {
  const needle = normalizeText(query);
  return books.filter((book) => {
    const searchable = normalizeText(`${book.title} ${book.author} ${book.category} ${book.id}`);
    const matchesQuery = needle === '' || searchable.includes(needle);
    const matchesCategory = category === 'all' || book.category === category;
    const matchesStatus = status === 'all' || book.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });
}

export function sortBooks(books, key = 'title', direction = 'asc') {
  const safeKey = BOOK_SORT_KEYS.includes(key) ? key : 'title';
  const multiplier = direction === 'desc' ? -1 : 1;

  return [...books].sort((left, right) => {
    const a = left[safeKey];
    const b = right[safeKey];
    let result;

    if (safeKey === 'year') {
      result = Number(a) - Number(b);
    } else {
      result = normalizeText(a).localeCompare(normalizeText(b), 'en', {
        numeric: true,
        sensitivity: 'base',
      });
    }

    if (result === 0 && safeKey !== 'title') {
      return normalizeText(left.title).localeCompare(normalizeText(right.title), 'en');
    }

    return result * multiplier;
  });
}

export function applyBookView(books, state = DEFAULT_BOOK_STATE) {
  const filtered = filterBooks(books, state);
  return sortBooks(filtered, state.sort, state.direction);
}

export function getBookStats(books) {
  const available = books.filter((book) => book.status === ACTIVE_STATUS.AVAILABLE).length;
  const borrowed = books.filter((book) => book.status === ACTIVE_STATUS.BORROWED).length;
  const reserved = books.filter((book) => book.status === ACTIVE_STATUS.RESERVED).length;

  return {
    total: books.length,
    available,
    borrowed,
    reserved,
    availabilityRate: books.length === 0 ? 0 : Math.round((available / books.length) * 100),
  };
}

export function parseBookQuery(search, { categories = [] } = {}) {
  const params = new URLSearchParams(String(search ?? '').replace(/^\?/, ''));
  const rawCategory = params.get('category') ?? 'all';
  const category =
    rawCategory === 'all' || categories.length === 0 || categories.includes(rawCategory)
      ? rawCategory
      : 'all';
  const rawStatus = params.get('status') ?? 'all';
  const status = BOOK_STATUS_VALUES.includes(rawStatus) ? rawStatus : 'all';
  const rawSort = params.get('sort') ?? 'title';
  const sort = BOOK_SORT_KEYS.includes(rawSort) ? rawSort : 'title';
  const rawDirection = params.get('dir') ?? 'asc';
  const direction = SORT_DIRECTIONS.includes(rawDirection) ? rawDirection : 'asc';

  return {
    query: (params.get('q') ?? '').trim().slice(0, 100),
    category,
    status,
    sort,
    direction,
  };
}

export function buildBookQuery(state = DEFAULT_BOOK_STATE) {
  const params = new URLSearchParams();
  const query = String(state.query ?? '').trim();
  if (query) params.set('q', query);
  if (state.category && state.category !== 'all') params.set('category', state.category);
  if (state.status && state.status !== 'all') params.set('status', state.status);
  if (state.sort && state.sort !== 'title') params.set('sort', state.sort);
  if (state.direction === 'desc') params.set('dir', 'desc');
  return params.toString();
}

export function updateBookUrl(state, { history, location } = {}) {
  if (!history || !location) return;
  const url = new URL(location.href);
  const query = buildBookQuery(state);
  url.search = query ? `?${query}` : '';
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export function isDefaultBookState(state) {
  return buildBookQuery(state) === '';
}
