import { describe, expect, it, vi } from 'vitest';
import { saveSession } from '../../src/lib/auth.js';
import {
  guardPage,
  installBfcacheGuard,
  pageUrl,
  redirectIfSignedIn,
} from '../../src/lib/guard.js';
import { createLocation, createStorage } from './helpers.js';

const USER = { username: 'admin', name: 'Library Admin', role: 'Administrator' };
const BASE = 'https://example.com/booknest/books.html';

function signedInStorage() {
  const storage = createStorage();
  saveSession(USER, storage, 0);
  return storage;
}

describe('pageUrl', () => {
  it('resolves pages under the project base path', () => {
    expect(pageUrl('index.html', BASE)).toBe('https://example.com/booknest/index.html');
  });

  it('requires a base URI', () => {
    expect(() => pageUrl('index.html', '')).toThrow('base URI');
  });
});

describe('guardPage', () => {
  it('returns a valid session and does not redirect', () => {
    const location = createLocation(BASE);
    const session = guardPage({
      storage: signedInStorage(),
      location,
      baseURI: BASE,
      now: 1,
    });

    expect(session.user.username).toBe('admin');
    expect(location.replaced).toBeNull();
  });

  it('redirects unauthenticated visitors to the sign-in page', () => {
    const location = createLocation(BASE);
    const session = guardPage({
      storage: createStorage(),
      location,
      baseURI: BASE,
      now: 1,
    });

    expect(session).toBeNull();
    expect(location.replaced).toBe('https://example.com/booknest/index.html');
  });

  it('does nothing when no location is available', () => {
    const session = guardPage({ storage: createStorage(), location: null, baseURI: BASE });
    expect(session).toBeNull();
  });
});

describe('redirectIfSignedIn', () => {
  it('redirects signed-in users to the dashboard', () => {
    const location = createLocation(BASE);
    const session = redirectIfSignedIn({
      storage: signedInStorage(),
      location,
      baseURI: BASE,
      now: 1,
    });

    expect(session.user.name).toBe('Library Admin');
    expect(location.replaced).toBe('https://example.com/booknest/dashboard.html');
  });

  it('leaves signed-out visitors on the login page', () => {
    const location = createLocation(BASE);
    expect(redirectIfSignedIn({ storage: createStorage(), location, baseURI: BASE })).toBeNull();
    expect(location.replaced).toBeNull();
  });
});

describe('installBfcacheGuard', () => {
  it('rechecks auth only for persisted page-show events', () => {
    let handler;
    const window = {
      addEventListener: vi.fn((event, callback) => {
        expect(event).toBe('pageshow');
        handler = callback;
      }),
    };
    const location = createLocation(BASE);

    installBfcacheGuard({
      window,
      storage: createStorage(),
      location,
      baseURI: BASE,
      now: () => 1,
    });

    handler({ persisted: false });
    expect(location.replaced).toBeNull();

    handler({ persisted: true });
    expect(location.replaced).toBe('https://example.com/booknest/index.html');
  });

  it('does nothing when window is unavailable', () => {
    expect(() => installBfcacheGuard({ window: null })).not.toThrow();
  });
});
