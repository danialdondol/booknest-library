import { expect, test } from '@playwright/test';
import { SESSION_KEY } from '../../src/lib/auth.js';
import { signIn } from './helpers.js';

test.describe('authentication', () => {
  test('protects every staff page', async ({ page }) => {
    for (const path of ['/dashboard.html', '/books.html', '/members.html']) {
      await page.goto(path);
      await expect(page).toHaveURL(/index\.html$/);
      await expect(page.getByRole('heading', { name: 'Sign in to the desk' })).toBeVisible();
    }
  });

  test('shows validation feedback for empty fields', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^Sign in$/ }).click();

    await expect(page.getByRole('alert')).toContainText('Please enter both');
    await expect(page.getByLabel('Username')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(page.getByLabel('Username')).toBeFocused();
  });

  test('rejects bad credentials and clears the password', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password', { exact: true }).fill('wrong');
    await page.getByRole('button', { name: /^Sign in$/ }).click();

    await expect(page.getByRole('alert')).toContainText('do not match');
    await expect(page.getByLabel('Password', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Password', { exact: true })).toBeFocused();
  });

  test('signs in with demo credentials and signs out', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /use demo credentials/i }).click();
    await expect(page.getByLabel('Username')).toHaveValue('admin');
    await expect(page.getByLabel('Password', { exact: true })).toHaveValue('admin123');

    await page.getByRole('button', { name: /^Sign in$/ }).click();
    await expect(page).toHaveURL(/dashboard\.html$/);
    await expect(page.getByText('Library Admin', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('toggles password visibility with state', async ({ page }) => {
    await page.goto('/');
    const password = page.getByLabel('Password', { exact: true });
    const toggle = page.locator('[data-toggle-password]');

    await expect(password).toHaveAttribute('type', 'password');
    await toggle.click();
    await expect(password).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Hide password' })).toBeVisible();
  });

  test('redirects an authenticated visitor away from the login page', async ({ page }) => {
    await signIn(page);
    await page.goto('/');
    await expect(page).toHaveURL(/dashboard\.html$/);
  });

  test('rejects an expired injected session', async ({ page }) => {
    await page.addInitScript(
      ({ key }) => {
        sessionStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            user: { username: 'admin', name: 'Library Admin', role: 'Administrator' },
            issuedAt: 0,
            expiresAt: 1,
          }),
        );
      },
      { key: SESSION_KEY },
    );

    await page.goto('/dashboard.html');
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('fails closed on protected pages without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/dashboard.html');

    await expect(page.locator('#app')).toBeHidden();
    await expect(page.getByText(/JavaScript is required to open the protected/)).toBeVisible();
    await context.close();
  });
});
