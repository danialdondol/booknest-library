import { MEMBER_TYPE_VALUES } from '../data/constants.js';
import { normalizeText } from './format.js';

export function filterMembers(members, { query = '', type = 'all' } = {}) {
  const needle = normalizeText(query);
  return members.filter((member) => {
    const searchable = normalizeText(`${member.name} ${member.email} ${member.id} ${member.type}`);
    const matchesQuery = needle === '' || searchable.includes(needle);
    const matchesType = type === 'all' || member.type === type;
    return matchesQuery && matchesType;
  });
}

export function getMemberTypeCounts(members) {
  return MEMBER_TYPE_VALUES.map((type) => ({
    type,
    count: members.filter((member) => member.type === type).length,
  }));
}

export function getMemberStats(members) {
  const totalLoans = members.reduce((sum, member) => sum + member.loans, 0);
  const mostActive = members.reduce(
    (best, member) => (best === null || member.loans > best.loans ? member : best),
    null,
  );

  return {
    total: members.length,
    totalLoans,
    averageLoans: members.length === 0 ? 0 : Math.round((totalLoans / members.length) * 10) / 10,
    mostActive,
  };
}
