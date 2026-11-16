/**
 * Local sign-in accounts. Credentials ship in the browser bundle and are
 * client-side only; they are not server-enforced access control.
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

export const USERS = Object.freeze(users.map((user) => Object.freeze(user)));
