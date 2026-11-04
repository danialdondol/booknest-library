import { DEMO_USERS } from '../data/users.js';

export const SESSION_KEY = 'booknest.session.v1';
export const SESSION_VERSION = 1;
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function safeStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function isSessionUser(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.username === 'string' &&
    typeof value.name === 'string' &&
    typeof value.role === 'string'
  );
}

export function authenticate(username, password, accounts = DEMO_USERS) {
  const normalizedUsername = String(username ?? '')
    .trim()
    .toLowerCase();

  const match = accounts.find(
    (account) =>
      account.username.toLowerCase() === normalizedUsername && account.password === password,
  );

  if (!match) return null;
  return Object.freeze({
    username: match.username,
    name: match.name,
    role: match.role,
  });
}

export function saveSession(user, storage = safeStorage(), now = Date.now()) {
  if (!storage || !isSessionUser(user)) {
    throw new Error('Cannot save an invalid session');
  }

  const session = {
    version: SESSION_VERSION,
    user: {
      username: user.username,
      name: user.name,
      role: user.role,
    },
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function readSession(storage = safeStorage(), now = Date.now()) {
  if (!storage) return null;

  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const valid =
      session !== null &&
      typeof session === 'object' &&
      session.version === SESSION_VERSION &&
      isSessionUser(session.user) &&
      typeof session.expiresAt === 'number';

    if (!valid || session.expiresAt <= now) {
      storage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    try {
      storage.removeItem(SESSION_KEY);
    } catch {
      // Storage can be unavailable in private or embedded contexts.
    }
    return null;
  }
}

export function clearSession(storage = safeStorage()) {
  if (!storage) return;
  try {
    storage.removeItem(SESSION_KEY);
  } catch {
    // Nothing else to do if the browser blocks storage.
  }
}

export function isAuthenticated(storage = safeStorage(), now = Date.now()) {
  return readSession(storage, now) !== null;
}
