import { clearSession } from '../lib/auth.js';
import { initials } from '../lib/format.js';
import { installBfcacheGuard, pageUrl } from '../lib/guard.js';

export function revealApp() {
  const app = document.getElementById('app');
  if (app) app.hidden = false;
}

export function initChrome(session, activePage) {
  document.body.dataset.page = activePage;

  const user = session?.user;
  if (user) {
    for (const node of document.querySelectorAll('[data-user-name]')) {
      node.textContent = user.name;
    }
    for (const node of document.querySelectorAll('[data-user-initials]')) {
      node.textContent = initials(user.name);
    }
    const greeting = document.querySelector('[data-greeting-name]');
    if (greeting) greeting.textContent = user.name;
  }

  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === activePage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  const logout = document.querySelector('[data-logout]');
  if (logout) {
    logout.addEventListener('click', () => {
      clearSession();
      window.location.replace(pageUrl('index.html'));
    });
  }

  installBfcacheGuard();
}
