import { expect, test } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('members', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/members.html');
    await expect(page.locator('#app')).toBeVisible();
  });

  test('lists every member and summary totals', async ({ page }) => {
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(12);
    await expect(page.locator('#memberCount')).toContainText('12 members in the register');
    await expect(page.locator('[data-member-loans]')).toHaveText('74');
    await expect(page.locator('[data-member-average]')).toHaveText('6.2');
  });

  test('searches and filters members, then clears the search', async ({ page }) => {
    const search = page.getByLabel('Search members');
    await search.fill('zainab');
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(1);
    await expect(page.locator('#memberGrid')).toContainText('Prof. Zainab Ali');

    await page.getByRole('button', { name: 'Clear member search' }).click();
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(12);

    await page.getByLabel('Membership', { exact: true }).selectOption('Staff');
    await expect(page.locator('#memberGrid .member-card')).toHaveCount(2);
    await expect(page.locator('#memberCount')).toContainText('2 of 12 members shown');
  });

  test('renders the membership chart with a data table', async ({ page }) => {
    await expect(page.locator('#memberTypeChart')).toBeVisible();
    await page.locator('details summary').click();
    await expect(page.locator('#memberTypeTableBody tr')).toHaveCount(3);
    await expect(page.locator('#memberTypeTableBody')).toContainText('Student');
  });
});
