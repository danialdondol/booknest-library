import { expect, test } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('small screens', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('dashboard has no horizontal overflow and keeps navigation usable', async ({ page }) => {
    await signIn(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.locator('.stat-card')).toHaveCount(4);
  });

  test('books render as readable cards without horizontal overflow', async ({ page }) => {
    await signIn(page);
    await page.goto('/books.html');
    await expect(page.locator('#booksBody tr')).toHaveCount(16);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole('button', { name: 'View details for 1984' })).toBeVisible();
  });
});
