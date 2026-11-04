import { describe, expect, it, vi } from 'vitest';
import { BOOKS } from '../../src/data/books.js';
import {
  applyBookView,
  buildBookQuery,
  DEFAULT_BOOK_STATE,
  filterBooks,
  getBookStats,
  getCategories,
  isDefaultBookState,
  parseBookQuery,
  sortBooks,
  updateBookUrl,
} from '../../src/lib/books.js';

const FIXTURE = Object.freeze([
  {
    id: 'B1',
    title: 'Café Society',
    author: 'Ada Lovelace',
    category: 'History',
    year: 2020,
    status: 'Available',
  },
  {
    id: 'B2',
    title: 'Beta',
    author: 'Zoe Adams',
    category: 'Technology',
    year: 1999,
    status: 'Borrowed',
  },
  {
    id: 'B3',
    title: 'Alpha',
    author: 'Ada Lovelace',
    category: 'History',
    year: 2010,
    status: 'Reserved',
  },
]);

describe('getCategories', () => {
  it('returns unique categories in alphabetical order', () => {
    expect(getCategories(BOOKS)).toEqual([
      'Business',
      'Design',
      'Fiction',
      'History',
      'Science',
      'Self-Help',
      'Technology',
    ]);
  });
});

describe('filterBooks', () => {
  it('searches title, author, category and id case-insensitively', () => {
    expect(filterBooks(FIXTURE, { query: 'CAFE' })).toHaveLength(1);
    expect(filterBooks(FIXTURE, { query: 'ada lovelace' })).toHaveLength(2);
    expect(filterBooks(FIXTURE, { query: 'technology' })).toHaveLength(1);
    expect(filterBooks(FIXTURE, { query: 'b3' })).toHaveLength(1);
  });

  it('combines category and status filters', () => {
    expect(filterBooks(FIXTURE, { category: 'History' })).toHaveLength(2);
    expect(filterBooks(FIXTURE, { category: 'History', status: 'Available' })).toHaveLength(1);
    expect(filterBooks(FIXTURE, { category: 'History', status: 'Borrowed' })).toHaveLength(0);
  });

  it('returns a copy, not the source array', () => {
    const result = filterBooks(FIXTURE, {});
    expect(result).not.toBe(FIXTURE);
    expect(result).toEqual([...FIXTURE]);
  });
});

describe('sortBooks', () => {
  it('sorts title and year without mutating the source', () => {
    const original = FIXTURE.map((book) => book.title);
    expect(sortBooks(FIXTURE, 'title', 'asc').map((book) => book.title)).toEqual([
      'Alpha',
      'Beta',
      'Café Society',
    ]);
    expect(sortBooks(FIXTURE, 'year', 'asc').map((book) => book.year)).toEqual([1999, 2010, 2020]);
    expect(FIXTURE.map((book) => book.title)).toEqual(original);
  });

  it('sorts descending and breaks ties by title', () => {
    const rows = sortBooks(FIXTURE, 'author', 'desc');
    expect(rows[0].author).toBe('Zoe Adams');
    expect(rows.slice(1).map((book) => book.title)).toEqual(['Alpha', 'Café Society']);
  });

  it('falls back to the title key for unknown fields', () => {
    expect(sortBooks(FIXTURE, 'unknown', 'asc')[0].title).toBe('Alpha');
  });
});

describe('applyBookView', () => {
  it('filters and sorts in one pass', () => {
    const rows = applyBookView(FIXTURE, {
      query: 'ada',
      category: 'History',
      status: 'all',
      sort: 'year',
      direction: 'desc',
    });
    expect(rows.map((book) => book.year)).toEqual([2020, 2010]);
  });

  it('uses defaults when no state is supplied', () => {
    expect(applyBookView(FIXTURE)[0].title).toBe('Alpha');
  });
});

describe('getBookStats', () => {
  it('counts statuses and availability', () => {
    const stats = getBookStats(BOOKS);
    expect(stats.total).toBe(16);
    expect(stats.available).toBe(9);
    expect(stats.borrowed).toBe(5);
    expect(stats.reserved).toBe(2);
    expect(stats.availabilityRate).toBe(56);
  });

  it('handles an empty collection', () => {
    expect(getBookStats([]).availabilityRate).toBe(0);
  });
});

describe('book query state', () => {
  const categories = ['History', 'Technology'];

  it('parses valid filters and sorting', () => {
    expect(
      parseBookQuery('?q=%20clean%20&category=Technology&status=Borrowed&sort=year&dir=desc', {
        categories,
      }),
    ).toEqual({
      query: 'clean',
      category: 'Technology',
      status: 'Borrowed',
      sort: 'year',
      direction: 'desc',
    });
  });

  it('falls back safely for unknown values and long queries', () => {
    const state = parseBookQuery(
      `?q=${'x'.repeat(120)}&category=Unknown&status=Lost&sort=price&dir=sideways`,
      { categories },
    );
    expect(state.query).toHaveLength(100);
    expect(state.category).toBe('all');
    expect(state.status).toBe('all');
    expect(state.sort).toBe('title');
    expect(state.direction).toBe('asc');
  });

  it('allows category values when no allowlist is supplied', () => {
    expect(parseBookQuery('?category=Poetry').category).toBe('Poetry');
    expect(parseBookQuery('').category).toBe('all');
  });

  it('serializes only non-default values', () => {
    expect(buildBookQuery(DEFAULT_BOOK_STATE)).toBe('');
    expect(
      buildBookQuery({
        query: ' old books ',
        category: 'History',
        status: 'Available',
        sort: 'year',
        direction: 'desc',
      }),
    ).toBe('q=old+books&category=History&status=Available&sort=year&dir=desc');
    expect(isDefaultBookState({ ...DEFAULT_BOOK_STATE })).toBe(true);
  });

  it('updates the URL without navigation', () => {
    const history = { replaceState: vi.fn() };
    const location = { href: 'https://example.com/booknest/books.html?old=1#main' };
    const state = {
      query: 'clean',
      category: 'all',
      status: 'all',
      sort: 'title',
      direction: 'asc',
    };

    updateBookUrl(state, { history, location });
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/booknest/books.html?q=clean#main',
    );

    updateBookUrl(DEFAULT_BOOK_STATE, { history, location });
    expect(history.replaceState).toHaveBeenLastCalledWith(null, '', '/booknest/books.html#main');
  });

  it('does nothing without a history or location object', () => {
    expect(() => updateBookUrl(DEFAULT_BOOK_STATE)).not.toThrow();
  });
});
