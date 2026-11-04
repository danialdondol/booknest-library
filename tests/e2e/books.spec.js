import { expect, test } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('book catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/books.html');
    await expect(page.locator('#app')).toBeVisible();
  });

  test('lists the whole collection with accessible sorting state', async ({ page }) => {
    await expect(page.locator('#booksBody tr')).toHaveCount(16);
    await expect(page.locator('#bookCount')).toContainText('16 books in the collection');
    await expect(page.getByRole('columnheader', { name: 'Title' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(page.locator('#booksBody tr').first().locator('.book-title')).toHaveText('1984');
  });

  test('filters by search, category, status, and resets', async ({ page }) => {
    const search = page.getByLabel('Search books');
    await search.fill('clean');
    await expect(page.locator('#booksBody tr')).toHaveCount(1);
    await expect(page).toHaveURL(/q=clean/);
    await expect(page.locator('#bookCount')).toContainText('1 of 16');

    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('#booksBody tr')).toHaveCount(16);

    await page.getByLabel('Category').selectOption('Fiction');
    await expect(page.locator('#booksBody tr')).toHaveCount(3);

    await page.getByLabel('Status').selectOption('Borrowed');
    await expect(page.locator('#booksBody tr')).toHaveCount(1);
    await expect(page.locator('#booksBody .book-title')).toHaveText('The Alchemist');

    await page.getByRole('button', { name: /^Reset$/ }).click();
    await expect(page.locator('#booksBody tr')).toHaveCount(16);
    await expect(page).toHaveURL(/books\.html$/);
  });

  test('sorts by year and exposes direction to assistive technology', async ({ page }) => {
    const year = page.getByRole('button', { name: 'Year' });
    await year.click();
    await expect(page.getByRole('columnheader', { name: 'Year' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(page.locator('#booksBody tr').first().locator('.book-title')).toHaveText('1984');

    await year.click();
    await expect(page.getByRole('columnheader', { name: 'Year' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    await expect(page.locator('#booksBody tr').first().locator('.book-title')).toHaveText(
      'Atomic Habits',
    );
  });

  test('restores a deep-linked filter view', async ({ page }) => {
    await page.goto('/books.html?q=cosmos&status=Reserved');
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.getByLabel('Search books')).toHaveValue('cosmos');
    await expect(page.getByLabel('Status')).toHaveValue('Reserved');
    await expect(page.locator('#booksBody tr')).toHaveCount(1);
    await expect(page.locator('#booksBody .book-title')).toHaveText('Cosmos');
  });

  test('opens and closes accessible book details', async ({ page }) => {
    await page.getByRole('button', { name: 'View details for Clean Code' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Clean Code' })).toBeVisible();
    await expect(dialog).toContainText('Available');
    await expect(dialog).toContainText('TEC-03');
    await expect(dialog).toContainText('3 copies');

    await dialog.getByRole('button', { name: 'Close book details' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'View details for Clean Code' })).toBeFocused();
  });
});
