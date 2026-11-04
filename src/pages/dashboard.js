import { initChrome, revealApp } from '../components/chrome.js';
import {
  mountChart,
  prefersReducedMotion,
  renderChartTable,
  setChartLabel,
} from '../components/charts.js';
import { BOOKS } from '../data/books.js';
import { ACTIVITY, MONTHLY_LOANS } from '../data/dashboard.js';
import { MEMBERS } from '../data/members.js';
import { categoryChartConfig, loansChartConfig } from '../lib/chart-configs.js';
import {
  getActivityIcon,
  getActivityText,
  getCategoryCounts,
  getCollectionPulse,
  getLibraryStats,
  getLoanPeak,
  getMemberBreakdown,
} from '../lib/dashboard.js';
import { formatLongDate, getGreeting, pluralize } from '../lib/format.js';
import { guardPage } from '../lib/guard.js';

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = String(value);
}

function renderStats() {
  const stats = getLibraryStats(BOOKS, MEMBERS);
  const categories = getCategoryCounts(BOOKS);
  const memberTypes = getMemberBreakdown(MEMBERS);
  const students = memberTypes.find((entry) => entry.type === 'Student')?.count ?? 0;
  const lecturers = memberTypes.find((entry) => entry.type === 'Lecturer')?.count ?? 0;

  setText('[data-stat="books"]', stats.total);
  setText('[data-stat="members"]', stats.members);
  setText('[data-stat="available"]', stats.available);
  setText('[data-stat="borrowed"]', stats.borrowed);

  setText(
    '[data-detail="books"]',
    `Across ${pluralize(categories.length, 'category', 'categories')}`,
  );
  setText('[data-detail="members"]', `${students} students · ${lecturers} lecturers`);
  setText('[data-detail="available"]', `${stats.availabilityRate}% of the collection`);
  setText('[data-detail="borrowed"]', `${stats.reserved} reserved at the desk`);
  setText('[data-category-meta]', pluralize(categories.length, 'category', 'categories'));

  const peak = getLoanPeak(MONTHLY_LOANS);
  setText('[data-loans-meta]', `Peak: ${peak.label} · ${peak.value}`);

  setText('[data-pulse-rate]', `${stats.availabilityRate}%`);
}

function renderPulse() {
  const bar = document.getElementById('pulseBar');
  const list = document.getElementById('pulseList');
  if (!bar || !list) return;

  const pulse = getCollectionPulse(BOOKS);
  bar.replaceChildren();
  list.replaceChildren();

  for (const segment of pulse) {
    const part = document.createElement('span');
    part.className = `pulse-segment pulse-segment--${segment.tone}`;
    part.style.width = `${segment.percentage}%`;
    part.setAttribute('aria-hidden', 'true');
    bar.append(part);

    const item = document.createElement('li');
    item.className = 'pulse-item';

    const dot = document.createElement('span');
    dot.className = `pulse-dot pulse-dot--${segment.tone}`;
    dot.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'pulse-item__label';
    label.textContent = segment.label;

    const value = document.createElement('span');
    value.className = 'pulse-item__value';
    value.textContent = `${segment.count} · ${segment.percentage}%`;

    item.append(dot, label, value);
    list.append(item);
  }

  bar.setAttribute(
    'aria-label',
    pulse.map((entry) => `${entry.count} ${entry.label.toLowerCase()}`).join(', '),
  );
}

function renderActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;

  list.replaceChildren();

  for (const entry of ACTIVITY) {
    const item = document.createElement('li');
    item.className = 'activity-item';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'activity-icon';
    iconWrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `./icons.svg#${getActivityIcon(entry)}`);
    svg.append(use);
    iconWrap.append(svg);

    const copy = document.createElement('div');
    copy.className = 'activity-copy';
    const text = document.createElement('p');
    text.textContent = getActivityText(entry);
    copy.append(text);

    const time = document.createElement('span');
    time.className = 'activity-time';
    time.textContent = entry.time;

    item.append(iconWrap, copy, time);
    list.append(item);
  }
}

function renderCharts() {
  const reducedMotion = prefersReducedMotion();
  const categories = getCategoryCounts(BOOKS);
  const categoryLabels = categories.map((entry) => entry.category);
  const categoryValues = categories.map((entry) => entry.count);

  const categoryCanvas = document.getElementById('categoryChart');
  setChartLabel(
    categoryCanvas,
    `Books by category: ${categories.map((entry) => `${entry.category} ${entry.count}`).join(', ')}`,
  );
  mountChart(
    categoryCanvas,
    categoryChartConfig(categoryLabels, categoryValues, { reducedMotion }),
  );
  renderChartTable(
    document.getElementById('categoryTableBody'),
    categories.map((entry) => ({ category: entry.category, count: entry.count })),
    [{ key: 'category', header: true }, { key: 'count' }],
  );

  const loansCanvas = document.getElementById('loansChart');
  setChartLabel(
    loansCanvas,
    `Monthly loans: ${MONTHLY_LOANS.labels
      .map((label, index) => `${label} ${MONTHLY_LOANS.values[index]}`)
      .join(', ')}`,
  );
  mountChart(
    loansCanvas,
    loansChartConfig(MONTHLY_LOANS.labels, MONTHLY_LOANS.values, { reducedMotion }),
  );
  renderChartTable(
    document.getElementById('loansTableBody'),
    MONTHLY_LOANS.labels.map((label, index) => ({
      month: label,
      loans: MONTHLY_LOANS.values[index],
    })),
    [{ key: 'month', header: true }, { key: 'loans' }],
  );
}

const session = guardPage();
if (session) {
  initChrome(session, 'dashboard');
  setText('[data-today]', formatLongDate());
  setText('[data-greeting]', getGreeting());
  renderStats();
  renderPulse();
  renderActivity();
  revealApp();
  renderCharts();
}
