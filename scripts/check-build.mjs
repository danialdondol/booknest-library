#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const pages = ['index.html', 'dashboard.html', 'books.html', 'members.html', '404.html'];
const failures = [];

for (const page of pages) {
  const path = resolve(dist, page);
  if (!existsSync(path)) {
    failures.push(`Missing build output: dist/${page}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (html.includes('<!-- include:')) {
    failures.push(`Unresolved partial in dist/${page}`);
  }
  if (/\bhttps?:\/\//i.test(html.replace(/<meta[^>]+>/gi, ''))) {
    failures.push(`External URL found in dist/${page}`);
  }
  if (page !== '404.html' && !/<script[^>]+src="\.\/assets\/[^"]+\.js"/i.test(html)) {
    failures.push(`No relative module bundle found in dist/${page}`);
  }
}

const assets = existsSync(resolve(dist, 'assets')) ? readdirSync(resolve(dist, 'assets')) : [];
if (!assets.some((file) => file.endsWith('.css'))) {
  failures.push('No CSS bundle found in dist/assets');
}

if (failures.length > 0) {
  console.error('Build verification failed:\n');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log(`Build verification passed: ${pages.length} pages and ${assets.length} assets.`);
