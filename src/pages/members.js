import { initChrome, revealApp } from '../components/chrome.js';
import {
  mountChart,
  prefersReducedMotion,
  renderChartTable,
  setChartLabel,
} from '../components/charts.js';
import { createStatusBadge, statusTone } from '../components/status.js';
import { MEMBERS } from '../data/members.js';
import { memberTypeChartConfig } from '../lib/chart-configs.js';
import { formatDate, initials, pluralize } from '../lib/format.js';
import { guardPage } from '../lib/guard.js';
import { filterMembers, getMemberStats, getMemberTypeCounts } from '../lib/members.js';

const state = { query: '', type: 'all' };

function iconUse(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `./icons.svg#${name}`);
  svg.append(use);
  return svg;
}

function metaItem(label, value) {
  const wrapper = document.createElement('div');
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.textContent = String(value);
  wrapper.append(term, description);
  return wrapper;
}

function memberCard(member) {
  const article = document.createElement('article');
  article.className = `member-card member-card--${statusTone(member.type)}`;

  const top = document.createElement('div');
  top.className = 'member-card__top';

  const avatar = document.createElement('span');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = initials(member.name);

  top.append(avatar, createStatusBadge(member.type));

  const name = document.createElement('h3');
  name.textContent = member.name;

  const id = document.createElement('p');
  id.className = 'member-card__id';
  id.textContent = member.id;

  const email = document.createElement('p');
  email.className = 'member-card__email';
  email.append(iconUse('icon-mail'), document.createTextNode(member.email));

  const meta = document.createElement('dl');
  meta.className = 'member-meta';
  meta.append(
    metaItem('Joined', formatDate(member.joined)),
    metaItem('Loans', pluralize(member.loans, 'loan')),
  );

  article.append(top, name, id, email, meta);
  return article;
}

function renderMembers() {
  const grid = document.getElementById('memberGrid');
  const empty = document.getElementById('emptyMembers');
  const count = document.getElementById('memberCount');
  const rows = filterMembers(MEMBERS, state);

  grid.replaceChildren(...rows.map(memberCard));
  count.textContent =
    rows.length === MEMBERS.length
      ? `${pluralize(rows.length, 'member')} in the register`
      : `${rows.length} of ${MEMBERS.length} members shown`;
  empty.hidden = rows.length > 0;

  const clear = document.querySelector('[data-clear-member-search]');
  if (clear) clear.hidden = state.query.length === 0;
}

function renderSummary() {
  const stats = getMemberStats(MEMBERS);
  const total = document.querySelector('[data-member-loans]');
  const average = document.querySelector('[data-member-average]');
  if (total) total.textContent = String(stats.totalLoans);
  if (average) average.textContent = String(stats.averageLoans);
}

function renderChart() {
  const breakdown = getMemberTypeCounts(MEMBERS);
  const labels = breakdown.map((entry) => entry.type);
  const values = breakdown.map((entry) => entry.count);
  const canvas = document.getElementById('memberTypeChart');

  setChartLabel(
    canvas,
    `Members by type: ${breakdown.map((entry) => `${entry.type} ${entry.count}`).join(', ')}`,
  );
  mountChart(
    canvas,
    memberTypeChartConfig(labels, values, { reducedMotion: prefersReducedMotion() }),
  );

  renderChartTable(
    document.getElementById('memberTypeTableBody'),
    breakdown.map((entry) => ({ type: entry.type, count: entry.count })),
    [{ key: 'type', header: true }, { key: 'count' }],
  );
}

function wireEvents() {
  const search = document.getElementById('memberSearch');
  const clear = document.querySelector('[data-clear-member-search]');
  const type = document.getElementById('typeFilter');

  search.addEventListener('input', () => {
    state.query = search.value.slice(0, 100);
    renderMembers();
  });

  clear.addEventListener('click', () => {
    state.query = '';
    search.value = '';
    search.focus();
    renderMembers();
  });

  type.addEventListener('change', () => {
    state.type = type.value;
    renderMembers();
  });
}

const session = guardPage();
if (session) {
  initChrome(session, 'members');
  wireEvents();
  renderMembers();
  renderSummary();
  revealApp();
  renderChart();
}
