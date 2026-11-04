import { describe, expect, it } from 'vitest';
import { MEMBERS } from '../../src/data/members.js';
import { filterMembers, getMemberStats, getMemberTypeCounts } from '../../src/lib/members.js';

describe('filterMembers', () => {
  it('searches name, email, id and type', () => {
    expect(filterMembers(MEMBERS, { query: 'aiman' })).toHaveLength(1);
    expect(filterMembers(MEMBERS, { query: 'student.example.edu' })).toHaveLength(8);
    expect(filterMembers(MEMBERS, { query: 'm009' })[0].name).toBe('Prof. Zainab Ali');
    expect(filterMembers(MEMBERS, { query: 'lecturer' })).toHaveLength(2);
  });

  it('combines search with membership type', () => {
    expect(filterMembers(MEMBERS, { query: 'ali', type: 'Lecturer' })).toHaveLength(1);
    expect(filterMembers(MEMBERS, { query: 'ali', type: 'Student' })).toHaveLength(0);
  });

  it('returns all members for an empty query and all type', () => {
    expect(filterMembers(MEMBERS)).toHaveLength(12);
  });
});

describe('getMemberTypeCounts', () => {
  it('returns every membership type in stable order', () => {
    expect(getMemberTypeCounts(MEMBERS)).toEqual([
      { type: 'Student', count: 8 },
      { type: 'Lecturer', count: 2 },
      { type: 'Staff', count: 2 },
    ]);
  });
});

describe('getMemberStats', () => {
  it('calculates loans, average and most active member', () => {
    const stats = getMemberStats(MEMBERS);
    expect(stats.total).toBe(12);
    expect(stats.totalLoans).toBe(74);
    expect(stats.averageLoans).toBe(6.2);
    expect(stats.mostActive.name).toBe('Prof. Zainab Ali');
  });

  it('handles an empty member list', () => {
    expect(getMemberStats([])).toEqual({
      total: 0,
      totalLoans: 0,
      averageLoans: 0,
      mostActive: null,
    });
  });
});
