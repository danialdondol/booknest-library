#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'docs/screenshots');
process.chdir(root);

console.log('Building production bundle...');
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

await mkdir(output, { recursive: true });

const server = await preview({
  root,
  logLevel: 'error',
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch();

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await desktop.newPage();

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, 'login.png') });

  await page.getByRole('button', { name: /use demo credentials/i }).click();
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard.html');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path: resolve(output, 'dashboard.png'), fullPage: true });

  await page.goto(`${base}/books.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, 'books.png') });

  await page.goto(`${base}/members.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, 'members.png') });
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${base}/`, { waitUntil: 'networkidle' });
  await mobilePage.getByRole('button', { name: /use demo credentials/i }).click();
  await mobilePage.getByRole('button', { name: /sign in/i }).click();
  await mobilePage.waitForURL('**/dashboard.html');
  await mobilePage.evaluate(() => document.fonts.ready);
  await mobilePage.waitForTimeout(900);
  await mobilePage.screenshot({
    path: resolve(output, 'dashboard-mobile.png'),
    fullPage: true,
  });
  await mobile.close();

  console.log(`Screenshots written to docs/screenshots/`);
} finally {
  await browser.close();
  await server.close();
}
