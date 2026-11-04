/**
 * Demo accounts only. These credentials ship in the browser bundle and are
 * intentionally public. Never treat this as real authentication.
 */
const users = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Library Admin',
    role: 'Administrator',
  },
  {
    username: 'librarian',
    password: 'lib2026',
    name: 'Siti Librarian',
    role: 'Librarian',
  },
];

export const DEMO_USERS = Object.freeze(users.map((user) => Object.freeze(user)));
