import { authenticate, saveSession } from '../lib/auth.js';
import { pageUrl, redirectIfSignedIn } from '../lib/guard.js';

function showError(message, fields = {}) {
  const errorBox = document.getElementById('loginError');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  errorBox.textContent = message;
  errorBox.hidden = false;

  if (fields.username) {
    username.setAttribute('aria-invalid', 'true');
    username.setAttribute('aria-describedby', 'usernameHint loginError');
  }
  if (fields.password) {
    password.setAttribute('aria-invalid', 'true');
    password.setAttribute('aria-describedby', 'loginError');
  }
}

function clearError() {
  const errorBox = document.getElementById('loginError');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  errorBox.hidden = true;
  errorBox.textContent = '';
  username.removeAttribute('aria-invalid');
  username.setAttribute('aria-describedby', 'usernameHint');
  password.removeAttribute('aria-invalid');
  password.removeAttribute('aria-describedby');
}

function initLogin() {
  const form = document.getElementById('loginForm');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const toggle = document.querySelector('[data-toggle-password]');
  const toggleLabel = document.querySelector('[data-password-label]');
  const fill = document.querySelector('[data-fill-demo]');

  toggle.addEventListener('click', () => {
    const isHidden = password.type === 'password';
    password.type = isHidden ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(isHidden));
    toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    toggleLabel.textContent = isHidden ? 'Hide' : 'Show';
    password.focus();
  });

  fill.addEventListener('click', () => {
    username.value = 'admin';
    password.value = 'admin123';
    clearError();
    form.querySelector('button[type="submit"]').focus();
  });

  username.addEventListener('input', clearError);
  password.addEventListener('input', clearError);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();

    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    if (!usernameValue || !passwordValue) {
      showError('Please enter both your username and password.', {
        username: !usernameValue,
        password: !passwordValue,
      });
      (usernameValue ? password : username).focus();
      return;
    }

    const user = authenticate(usernameValue, passwordValue);
    if (!user) {
      showError('That username and password do not match. Try the demo credentials below.', {
        username: true,
        password: true,
      });
      password.value = '';
      password.focus();
      return;
    }

    try {
      saveSession(user);
      window.location.assign(pageUrl('dashboard.html'));
    } catch {
      showError('The browser blocked the demo session. Allow session storage and try again.');
    }
  });
}

if (!redirectIfSignedIn()) {
  initLogin();
}
