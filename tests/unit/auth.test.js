import { describe, expect, it } from 'vitest';
import {
  authenticate,
  clearSession,
  isAuthenticated,
  readSession,
  saveSession,
  SESSION_KEY,
  SESSION_TTL_MS,
} from '../../src/lib/auth.js';
import { createStorage } from './helpers.js';

const USER = Object.freeze({
  username: 'admin',
  name: 'Library Admin',
  role: 'Administrator',
});

describe('authenticate', () => {
  it('accepts valid credentials and omits the password', () => {
    const user = authenticate(' ADMIN ', 'admin123');
    expect(user).toEqual(USER);
    expect(user).not.toHaveProperty('password');
  });

  it('rejects wrong passwords and unknown users', () => {
    expect(authenticate('admin', 'wrong')).toBeNull();
    expect(authenticate('nobody', 'admin123')).toBeNull();
    expect(authenticate('', '')).toBeNull();
  });

  it('keeps passwords case-sensitive', () => {
    expect(authenticate('admin', 'ADMIN123')).toBeNull();
  });

  it('supports injected account lists', () => {
    expect(
      authenticate('reader', 'secret', [
        { username: 'reader', password: 'secret', name: 'R', role: 'Staff' },
      ]),
    ).toEqual({ username: 'reader', name: 'R', role: 'Staff' });
  });
});

describe('session lifecycle', () => {
  it('saves and reads a versioned session without credentials', () => {
    const storage = createStorage();
    const session = saveSession(USER, storage, 1_000);

    expect(session.version).toBe(1);
    expect(session.expiresAt).toBe(1_000 + SESSION_TTL_MS);
    expect(session.user).toEqual(USER);
    expect(JSON.parse(storage.getItem(SESSION_KEY))).not.toHaveProperty('password');

    expect(readSession(storage, 1_001)).toEqual(session);
    expect(isAuthenticated(storage, 1_001)).toBe(true);
  });

  it('expires and clears stale sessions', () => {
    const storage = createStorage();
    saveSession(USER, storage, 1_000);

    expect(readSession(storage, 1_000 + SESSION_TTL_MS)).toBeNull();
    expect(storage.getItem(SESSION_KEY)).toBeNull();
  });

  it('clears a session explicitly', () => {
    const storage = createStorage();
    saveSession(USER, storage);
    clearSession(storage);
    expect(storage.getItem(SESSION_KEY)).toBeNull();
  });

  it('rejects malformed JSON and invalid session shapes', () => {
    const storage = createStorage({ [SESSION_KEY]: '{broken' });
    expect(readSession(storage)).toBeNull();

    storage.setItem(SESSION_KEY, JSON.stringify({ version: 2, user: USER, expiresAt: 99 }));
    expect(readSession(storage, 0)).toBeNull();

    storage.setItem(
      SESSION_KEY,
      JSON.stringify({ version: 1, user: { username: 'admin' }, expiresAt: 99 }),
    );
    expect(readSession(storage, 0)).toBeNull();
  });

  it('rejects invalid users and missing storage', () => {
    const storage = createStorage();
    expect(() => saveSession({ username: 'admin' }, storage)).toThrow('invalid session');
    expect(readSession(null)).toBeNull();
    expect(isAuthenticated(null)).toBe(false);
    expect(saveSession(USER, storage).version).toBe(1);
  });

  it('survives storage failures', () => {
    const throwingStorage = {
      getItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
    };

    expect(readSession(throwingStorage)).toBeNull();
    expect(() => clearSession(throwingStorage)).not.toThrow();
    expect(() => saveSession(USER, throwingStorage)).toThrow('blocked');
  });
});
