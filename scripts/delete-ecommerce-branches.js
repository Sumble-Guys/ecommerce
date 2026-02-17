#!/usr/bin/env node
/**
 * Deletes all remote branches on Sumble-Guys/ecommerce except main.
 * Uses a temporary clone so the project directory is not modified.
 * Requires GITHUB_USER and GITHUB_PAT with push access to the repo.
 *
 * Usage:
 *   GITHUB_USER=... GITHUB_PAT=... node scripts/delete-ecommerce-branches.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const remoteUrl = process.env.REMOTE_URL || 'https://github.com/Sumble-Guys/ecommerce.git';
const githubUser = process.env.GITHUB_USER || process.env.GH_USER;
const githubPat = process.env.GITHUB_PAT || process.env.GH_PAT;

if (!githubUser || !githubPat) {
  console.error('Set GITHUB_USER and GITHUB_PAT (or GH_USER, GH_PAT).');
  process.exit(1);
}

const pushUrl = remoteUrl.replace('https://', `https://${githubUser}:${githubPat}@`);
const tmpDir = path.join(os.tmpdir(), `ecommerce-delete-${Date.now()}`);

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', cwd: opts.cwd || tmpDir, stdio: opts.inherit ? 'inherit' : 'pipe' });
}

try {
  console.log('Cloning ecommerce repo to temp dir...');
  execSync(`git clone ${pushUrl} "${tmpDir}"`, { stdio: 'inherit' });

  const out = run('git branch -r');
  const lines = out.trim().split('\n').map((s) => s.trim()).filter(Boolean);
  const toDelete = [];
  for (const line of lines) {
    if (!line.startsWith('origin/')) continue;
    // Skip symbolic refs (e.g. "origin/HEAD -> origin/main")
    const branch = line.replace(/\s*->.*$/, '').trim().slice(7);
    if (!branch || branch === 'main' || branch === 'HEAD') continue;
    toDelete.push(branch);
  }

  if (toDelete.length === 0) {
    console.log('No branches to delete (only main exists).');
  } else {
    console.log(`Deleting ${toDelete.length} remote branch(es): ${toDelete.join(', ')}`);
    for (const branch of toDelete) {
      try {
        run(`git push origin --delete ${branch}`, { inherit: true });
        console.log(`  Deleted ${branch}`);
      } catch (e) {
        console.warn(`  Failed to delete ${branch}:`, e.message);
      }
    }
  }
  console.log('Done.');
} finally {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true });
  }
}
