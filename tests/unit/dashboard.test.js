import { describe, expect, it } from 'vitest';
import { BOOKS } from '../../src/data/books.js';
import { MONTHLY_LOANS } from '../../src/data/dashboard.js';
import { MEMBERS } from '../../src/data/members.js';
import {
  getActivityIcon,
  getActivityText,
  getCategoryCounts,
  getCollectionPulse,
  getLibraryStats,
  getLoanPeak,
  getMemberBreakdown,
} from '../../src/lib/dashboard.js';

describe('getLibraryStats', () => {
  it('combines collection and member statistics', () => {
    const stats = getLibraryStats(BOOKS, MEMBERS);
    expect(stats.total).toBe(16);
    expect(stats.members).toBe(12);
    expect(stats.availabilityRate).toBe(56);
    expect(stats.utilizationRate).toBe(44);
  });

  it('handles an empty library', () => {
    expect(getLibraryStats([], []).utilizationRate).toBe(0);
  });
});

describe('getCollectionPulse', () => {
  it('returns percentage splits that add up to 100', () => {
    const pulse = getCollectionPulse(BOOKS);
    expect(pulse.map((entry) => entry.count)).toEqual([9, 5, 2]);
    expect(pulse.reduce((sum, entry) => sum + entry.percentage, 0)).toBe(100);
  });

  it('handles an empty collection', () => {
    expect(getCollectionPulse([]).every((entry) => entry.percentage === 0)).toBe(true);
  });
});

describe('getCategoryCounts', () => {
  it('groups and sorts categories by count then label', () => {
    const rows = getCategoryCounts(BOOKS);
    expect(rows[0]).toEqual({ category: 'Fiction', count: 3 });
    expect(rows[1]).toEqual({ category: 'Technology', count: 3 });
    expect(rows).toHaveLength(7);
  });
});

describe('getMemberBreakdown', () => {
  it('delegates to the member type aggregation', () => {
    expect(getMemberBreakdown(MEMBERS)[0]).toEqual({ type: 'Student', count: 8 });
  });
});

describe('activity helpers', () => {
  it('builds text for actions with an item', () => {
    expect(
      getActivityText({
        type: 'borrow',
        member: 'Nur Aisyah',
        item: 'Atomic Habits',
      }),
    ).toBe('Nur Aisyah borrowed “Atomic Habits”');
  });

  it('builds text for join events and unknown actions', () => {
    expect(getActivityText({ type: 'join', member: 'Alya Sofea', item: null })).toBe(
      'Alya Sofea joined the library',
    );
    expect(getActivityText({ type: 'mystery', member: 'Someone', item: null })).toBe(
      'Someone updated',
    );
  });

  it('maps activity types to fixed icon ids', () => {
    expect(getActivityIcon({ type: 'borrow' })).toBe('icon-logout');
    expect(getActivityIcon({ type: 'return' })).toBe('icon-check');
    expect(getActivityIcon({ type: 'reserve' })).toBe('icon-clock');
    expect(getActivityIcon({ type: 'join' })).toBe('icon-users');
    expect(getActivityIcon({ type: 'mystery' })).toBe('icon-info');
  });
});

describe('getLoanPeak', () => {
  it('finds the peak month', () => {
    expect(getLoanPeak(MONTHLY_LOANS)).toEqual({ label: 'Sep', value: 95 });
  });

  it('handles missing data', () => {
    expect(getLoanPeak(null)).toEqual({ label: '—', value: 0 });
    expect(getLoanPeak({ labels: [], values: [] })).toEqual({ label: '—', value: 0 });
  });
});
