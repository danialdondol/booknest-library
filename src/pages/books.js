import { initChrome, revealApp } from '../components/chrome.js';
import { createStatusBadge } from '../components/status.js';
import { BOOKS } from '../data/books.js';
import {
  applyBookView,
  DEFAULT_BOOK_STATE,
  getCategories,
  parseBookQuery,
  updateBookUrl,
} from '../lib/books.js';
import { pluralize } from '../lib/format.js';
import { guardPage } from '../lib/guard.js';

const categories = getCategories(BOOKS);
let state = parseBookQuery(window.location.search, { categories });
let lastDialogTrigger = null;

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = String(value);
}

function fillCategoryOptions() {
  const select = document.getElementById('categoryFilter');
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.append(option);
  }
}

function syncControls() {
  document.getElementById('bookSearch').value = state.query;
  document.getElementById('categoryFilter').value = state.category;
  document.getElementById('statusFilter').value = state.status;

  const clear = document.querySelector('[data-clear-search]');
  if (clear) clear.hidden = state.query.length === 0;
}

function updateSortHeaders() {
  for (const header of document.querySelectorAll('th[aria-sort]')) {
    const button = header.querySelector('[data-sort]');
    const mark = header.querySelector('[data-sort-mark]');
    if (!button || !mark) continue;

    if (button.dataset.sort === state.sort) {
      const ascending = state.direction === 'asc';
      header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
      mark.textContent = ascending ? '↑' : '↓';
    } else {
      header.setAttribute('aria-sort', 'none');
      mark.textContent = '↕';
    }
  }
}

function dataCell(label, content) {
  const cell = document.createElement('td');
  cell.dataset.label = label;
  if (content instanceof Node) cell.append(content);
  else cell.textContent = content;
  return cell;
}

function renderRows(rows) {
  const tbody = document.getElementById('booksBody');
  const fragment = document.createDocumentFragment();

  for (const book of rows) {
    const tr = document.createElement('tr');
    tr.dataset.bookId = book.id;

    const titleCell = document.createElement('td');
    titleCell.className = 'book-cell';
    titleCell.dataset.label = 'Title';

    const title = document.createElement('span');
    title.className = 'book-title';
    title.textContent = book.title;

    const id = document.createElement('span');
    id.className = 'book-id';
    id.textContent = book.id;

    titleCell.append(title, id);

    const status = createStatusBadge(book.status);
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'row-action';
    action.dataset.openBook = book.id;
    action.setAttribute('aria-haspopup', 'dialog');
    action.setAttribute('aria-label', `View details for ${book.title}`);
    action.textContent = 'Details';

    tr.append(
      titleCell,
      dataCell('Author', book.author),
      dataCell('Category', book.category),
      dataCell('Year', book.year),
      dataCell('Status', status),
      dataCell('Actions', action),
    );

    fragment.append(tr);
  }

  tbody.replaceChildren(fragment);
}

function render({ syncUrl = true } = {}) {
  const rows = applyBookView(BOOKS, state);
  const tableWrap = document.getElementById('booksTableWrap');
  const empty = document.getElementById('emptyBooks');
  const count = document.getElementById('bookCount');

  renderRows(rows);
  updateSortHeaders();

  const queryLabel =
    rows.length === BOOKS.length
      ? `${pluralize(rows.length, 'book')} in the collection`
      : `${rows.length} of ${BOOKS.length} books shown`;
  count.textContent = queryLabel;

  tableWrap.hidden = rows.length === 0;
  empty.hidden = rows.length > 0;
  document.querySelector('[data-clear-search]').hidden = state.query.length === 0;

  if (syncUrl) {
    updateBookUrl(state, { history: window.history, location: window.location });
  }
}

function resetFilters() {
  state = { ...DEFAULT_BOOK_STATE };
  syncControls();
  render();
  document.getElementById('bookSearch').focus();
}

function openBookDialog(book, trigger) {
  const dialog = document.getElementById('bookDialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  lastDialogTrigger = trigger;
  setText('[data-dialog-id]', book.id);
  setText('[data-dialog-title]', book.title);
  setText('[data-dialog-author]', `by ${book.author}`);
  setText('[data-dialog-summary]', book.summary);
  setText('[data-dialog-category]', book.category);
  setText('[data-dialog-year]', book.year);
  setText('[data-dialog-shelf]', book.shelf);
  setText('[data-dialog-copies]', pluralize(book.copies, 'copy', 'copies'));

  const status = document.querySelector('[data-dialog-status]');
  status.replaceChildren(createStatusBadge(book.status));

  dialog.showModal();
}

function wireEvents() {
  const search = document.getElementById('bookSearch');
  const clear = document.querySelector('[data-clear-search]');
  const category = document.getElementById('categoryFilter');
  const status = document.getElementById('statusFilter');
  const tbody = document.getElementById('booksBody');
  const dialog = document.getElementById('bookDialog');

  search.addEventListener('input', () => {
    state.query = search.value.slice(0, 100);
    render();
  });

  clear.addEventListener('click', () => {
    state.query = '';
    syncControls();
    search.focus();
    render();
  });

  category.addEventListener('change', () => {
    state.category = category.value;
    render();
  });

  status.addEventListener('change', () => {
    state.status = status.value;
    render();
  });

  for (const button of document.querySelectorAll('[data-sort]')) {
    button.addEventListener('click', () => {
      const key = button.dataset.sort;
      if (state.sort === key) {
        state.direction = state.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = key;
        state.direction = 'asc';
      }
      render();
    });
  }

  for (const reset of document.querySelectorAll('[data-reset-filters]')) {
    reset.addEventListener('click', resetFilters);
  }

  tbody.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-book]');
    if (!trigger) return;
    const book = BOOKS.find((entry) => entry.id === trigger.dataset.openBook);
    if (book) openBookDialog(book, trigger);
  });

  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    lastDialogTrigger?.focus();
    lastDialogTrigger = null;
  });

  window.addEventListener('popstate', () => {
    state = parseBookQuery(window.location.search, { categories });
    syncControls();
    render({ syncUrl: false });
  });
}

const session = guardPage();
if (session) {
  initChrome(session, 'books');
  fillCategoryOptions();
  syncControls();
  wireEvents();
  render({ syncUrl: false });
  revealApp();
}
