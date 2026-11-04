import { expect, test } from '@playwright/test';
import { analyzePage, signIn } from './helpers.js';

test.describe('accessibility', () => {
  test('login page has no serious automated violations', async ({ page }) => {
    await page.goto('/');
    await analyzePage(page);
  });

  test('dashboard has no serious automated violations', async ({ page }) => {
    await signIn(page);
    await expect(page.locator('#categoryChart')).toBeVisible();
    await analyzePage(page);
  });

  test('books page and open dialog have no serious automated violations', async ({ page }) => {
    await signIn(page);
    await page.goto('/books.html');
    await expect(page.locator('#booksBody tr')).toHaveCount(16);
    await analyzePage(page);

    await page.getByRole('button', { name: 'View details for Clean Code' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await analyzePage(page);
  });

  test('members page has no serious automated violations', async ({ page }) => {
    await signIn(page);
    await page.goto('/members.html');
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(12);
    await analyzePage(page);
  });
});
