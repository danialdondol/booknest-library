import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

export async function signIn(page, { username = 'admin', password = 'admin123' } = {}) {
  await page.goto('/');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /^Sign in$/ }).click();
  await expect(page).toHaveURL(/dashboard\.html$/);
  await expect(page.locator('#app')).toBeVisible();
}

export async function analyzePage(page) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const serious = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(
    serious,
    serious
      .map(
        (violation) =>
          `${violation.id}: ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(' ')} — ${node.failureSummary}`)
            .join('\n')}`,
      )
      .join('\n\n'),
  ).toEqual([]);
}
