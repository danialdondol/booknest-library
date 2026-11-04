#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
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
  console.log('First run detected. Installing dependencies...');
  const install = spawnSync('npm', ['install'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

const child = spawn('npm', ['run', 'dev', '--', '--open'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => process.exit(code ?? 0));
