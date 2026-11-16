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

    await page.locator('#typeFilter').selectOption('Staff');
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

test.describe('adding a member', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/members.html');
  });

  test('saves a new member and keeps it after reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Add a member' }).click();
    const dialog = page.getByRole('dialog', { name: 'Add a member' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Name').fill('Maya Rahman');
    await dialog.getByLabel('Email').fill('maya.rahman@example.edu');
    await dialog.getByLabel('Membership', { exact: true }).selectOption('Student');
    await dialog.getByLabel('Joined').fill('2026-11-16');
    await dialog.getByLabel('Loans').fill('0');
    await dialog.getByRole('button', { name: 'Add member', exact: true }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('#memberCount')).toContainText('13 members in the register');
    await expect(page.locator('#memberNotice')).toContainText('was added to the register');

    await page.reload();
    await expect(page.locator('#memberCount')).toContainText('13 members in the register');
    await expect(page.locator('#memberGrid')).toContainText('Maya Rahman');

    await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
    await expect(page.locator('[data-stat="members"]')).toHaveText('13');
  });
});
