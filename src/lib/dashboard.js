import { getBookStats } from './books.js';
import { getMemberTypeCounts } from './members.js';

export function getLibraryStats(books, members) {
  const bookStats = getBookStats(books);
  return {
    ...bookStats,
    members: members.length,
    utilizationRate:
      bookStats.total === 0
        ? 0
        : Math.round(((bookStats.borrowed + bookStats.reserved) / bookStats.total) * 100),
  };
}

export function getCollectionPulse(books) {
  const stats = getBookStats(books);
  const statuses = [
    { key: 'available', label: 'Available', count: stats.available, tone: 'available' },
    { key: 'borrowed', label: 'On loan', count: stats.borrowed, tone: 'borrowed' },
    { key: 'reserved', label: 'Reserved', count: stats.reserved, tone: 'reserved' },
  ];

  if (stats.total === 0) {
    return statuses.map((status) => ({ ...status, percentage: 0 }));
  }

  // Largest-remainder rounding keeps the displayed one-decimal percentages at 100%.
  const units = statuses.map((status) => (status.count / stats.total) * 1000);
  const rounded = units.map(Math.floor);
  let remainder = 1000 - rounded.reduce((sum, value) => sum + value, 0);
  const order = units
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (const entry of order) {
    if (remainder <= 0) break;
    rounded[entry.index] += 1;
    remainder -= 1;
  }

  return statuses.map((status, index) => ({
    ...status,
    percentage: rounded[index] / 10,
  }));
}

export function getCategoryCounts(books) {
  const counts = new Map();
  for (const book of books) {
    counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.category.localeCompare(b.category, 'en', { sensitivity: 'base' }),
    );
}

export function getMemberBreakdown(members) {
  return getMemberTypeCounts(members);
}

export function getActivityText(entry) {
  const verbs = {
    borrow: 'borrowed',
    return: 'returned',
    reserve: 'reserved',
    join: 'joined the library',
  };
  const verb = verbs[entry.type] ?? 'updated';
  return entry.item ? `${entry.member} ${verb} “${entry.item}”` : `${entry.member} ${verb}`;
}

export function getActivityIcon(entry) {
  const icons = {
    borrow: 'icon-logout',
    return: 'icon-check',
    reserve: 'icon-clock',
    join: 'icon-users',
  };
  return icons[entry.type] ?? 'icon-info';
}

export function getLoanPeak(monthlyLoans) {
  const values = monthlyLoans?.values ?? [];
  if (values.length === 0) return { label: '—', value: 0 };
  const peakValue = Math.max(...values);
  const index = values.indexOf(peakValue);
  return { label: monthlyLoans.labels[index] ?? '—', value: peakValue };
}
