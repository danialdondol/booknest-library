#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [major, minor] = process.versions.node.split('.').map(Number);

if (major < 20 || (major === 20 && minor < 19)) {
  console.error(
    `BookNest needs Node.js 20.19+ or 22.12+. You are running ${process.versions.node}.`,
  );
  process.exit(1);
}

if (!existsSync(resolve(root, 'node_modules'))) {
  console.log('Installing dependencies...');
  const result = spawnSync('npm', ['install'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nSetup complete. Start the app with:\n\n  npm run dev\n');
console.log('Demo login: admin / admin123\n');
