import { expect, test } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('shows live statistics and the signed-in user', async ({ page }) => {
    await expect(page.locator('[data-stat="books"]')).toHaveText('16');
    await expect(page.locator('[data-stat="members"]')).toHaveText('12');
    await expect(page.locator('[data-stat="available"]')).toHaveText('9');
    await expect(page.locator('[data-stat="borrowed"]')).toHaveText('5');
    await expect(page.locator('[data-greeting-name]')).toHaveText('Library Admin');
    await expect(page.locator('[data-today]')).toContainText('November');
  });

  test('renders both charts and their accessible data tables', async ({ page }) => {
    await expect(page.locator('#categoryChart')).toBeVisible();
    await expect(page.locator('#loansChart')).toBeVisible();
    await expect(page.locator('#categoryChart')).toHaveAttribute('role', 'img');

    await page.locator('details summary').first().click();
    await expect(page.locator('#categoryTableBody tr')).toHaveCount(7);

    await page.locator('details summary').nth(1).click();
    await expect(page.locator('#loansTableBody tr')).toHaveCount(6);
  });

  test('shows collection pulse and recent activity', async ({ page }) => {
    await expect(page.locator('.pulse-segment')).toHaveCount(3);
    await expect(page.locator('[data-pulse-rate]')).toHaveText('56%');
    await expect(page.locator('#activityList .activity-item')).toHaveCount(5);
    await expect(page.getByText('Nur Aisyah borrowed “Atomic Habits”')).toBeVisible();
  });
});
