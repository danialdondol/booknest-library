import { readSession } from './auth.js';

export function pageUrl(name, baseURI = globalThis.document?.baseURI) {
  if (!baseURI) throw new Error('A base URI is required to build a page URL');
  return new URL(name, baseURI).href;
}

export function guardPage(options = {}) {
  const {
    storage = globalThis.sessionStorage,
    location = globalThis.location,
    baseURI = globalThis.document?.baseURI,
    now = Date.now(),
    loginPage = 'index.html',
  } = options;

  const session = readSession(storage, now);
  if (session) return session;

  if (location?.replace && baseURI) {
    location.replace(pageUrl(loginPage, baseURI));
  }
  return null;
}

export function redirectIfSignedIn(options = {}) {
  const {
    storage = globalThis.sessionStorage,
    location = globalThis.location,
    baseURI = globalThis.document?.baseURI,
    now = Date.now(),
    dashboardPage = 'dashboard.html',
  } = options;

  const session = readSession(storage, now);
  if (session && location?.replace && baseURI) {
    location.replace(pageUrl(dashboardPage, baseURI));
    return session;
  }
  return null;
}

export function installBfcacheGuard(options = {}) {
  const {
    window = globalThis.window,
    storage = globalThis.sessionStorage,
    location = globalThis.location,
    baseURI = globalThis.document?.baseURI,
    now = () => Date.now(),
  } = options;

  if (!window?.addEventListener) return;

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    if (!readSession(storage, now()) && location?.replace && baseURI) {
      location.replace(pageUrl('index.html', baseURI));
    }
  });
}
