import { expect, test } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('narrow phones', () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test('all four pages avoid horizontal overflow at 320px', async ({ page }) => {
    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

    await page.goto('/');
    expect(await overflow()).toBeLessThanOrEqual(1);

    await signIn(page);
    expect(await overflow()).toBeLessThanOrEqual(1);

    await page.goto('/books.html');
    await expect(page.locator('#booksBody tr')).toHaveCount(16);
    expect(await overflow()).toBeLessThanOrEqual(1);

    await page.goto('/members.html');
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(12);
    expect(await overflow()).toBeLessThanOrEqual(1);
  });
});
