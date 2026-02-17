#!/usr/bin/env node
/**
 * Run once per user. Fetches Jira assignees for KAN-79..KAN-123, filters tickets assigned to this user,
 * then for each ticket creates branch EMPID_JIRAID_V01, adds related files, commits with message "JIRAID ...", pushes to GitHub.
 *
 * Requires: JIRA_* in .env; GITHUB_USER, GITHUB_PAT, EMPID (LHS of assignee email) as env or CLI.
 * Optional: GITHUB_REMOTE_NAME (default: github_push), REMOTE_URL (default: https://github.com/Sumble-Guys/ecommerce.git)
 */

const https = require('https');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getFilesForTicket } = require('./ticket-to-files.js');

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const EMPID_TO_ACCOUNT_ID = {
  'saiganesh.gupta': '712020:fcc7fd99-9db0-4107-981e-393c16043284',
  'hemanth.varma': '712020:e851d530-fc08-4174-acab-25945e3e87bb',
  'akhil.soma': '712020:2c81c99d-262e-4809-bd66-e9bee34e45be',
  'dineshkumar.gupta': '712020:cd1586de-d8a4-473b-81a9-31d387995fb2',
};

function getEnv(name, example) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}. Example: ${example}`);
    process.exit(1);
  }
  return v;
}

function jiraGet(issueKey) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    const options = {
      hostname: JIRA_DOMAIN,
      path: `/rest/api/3/issue/${issueKey}?fields=assignee`,
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        } else {
          reject(new Error(`${issueKey}: ${res.statusCode} ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchAssignees() {
  const assignees = {};
  for (let k = 79; k <= 123; k++) {
    const key = `KAN-${k}`;
    try {
      const res = await jiraGet(key);
      const accId = res.fields?.assignee?.accountId || null;
      assignees[key] = accId;
    } catch (err) {
      console.warn(`Jira ${key}: ${err.message}`);
      assignees[key] = null;
    }
  }
  return assignees;
}

function run(cmd, opts = {}) {
  const cwd = opts.cwd || path.join(__dirname, '..');
  execSync(cmd, { stdio: 'inherit', cwd, ...opts });
}

function main() {
  const empId = process.env.EMPID || process.argv[2];
  const githubUser = process.env.GITHUB_USER || process.env.GH_USER;
  const githubPat = process.env.GITHUB_PAT || process.env.GH_PAT;
  const remoteName = process.env.GITHUB_REMOTE_NAME || 'github_push';
  const remoteUrl = process.env.REMOTE_URL || 'https://github.com/Sumble-Guys/ecommerce.git';

  if (!empId) {
    console.error('Usage: EMPID=saiganesh.gupta GITHUB_USER=... GITHUB_PAT=... node push-tickets-by-user.js');
    console.error('   or: node push-tickets-by-user.js saiganesh.gupta');
    process.exit(1);
  }
  if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.error('Set JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN in .env');
    process.exit(1);
  }
  if (!githubUser || !githubPat) {
    console.error('Set GITHUB_USER and GITHUB_PAT (or GH_USER, GH_PAT) for push.');
    process.exit(1);
  }

  const accountId = EMPID_TO_ACCOUNT_ID[empId];
  if (!accountId) {
    console.error(`Unknown EMPID: ${empId}. Known: ${Object.keys(EMPID_TO_ACCOUNT_ID).join(', ')}`);
    process.exit(1);
  }

  const repoRoot = path.join(__dirname, '..');
  const pushUrl = remoteUrl.replace('https://', `https://${githubUser}:${githubPat}@`);
  const isFresh = process.env.FRESH_PUSH === '1' || process.env.FRESH_PUSH === 'true';
  const gitDir = path.join(repoRoot, '.git');

  (async () => {
    let didFreshInit = false;
    if (!fs.existsSync(gitDir)) {
      console.log('No .git found. Initializing fresh repo and initial commit...');
      execSync('git init', { cwd: repoRoot, stdio: 'inherit' });
      execSync('git add .', { cwd: repoRoot, stdio: 'inherit' });
      execSync('git commit -m "Initial commit - BharathBazaar"', { cwd: repoRoot, stdio: 'inherit' });
      didFreshInit = true;
      console.log('Done. main has one commit with full codebase.\n');
    }

    try {
      run(`git remote remove ${remoteName}`, { cwd: repoRoot, stdio: 'pipe' });
    } catch (_) {}
    run(`git remote add ${remoteName} ${pushUrl}`, { cwd: repoRoot });
    try {
      run('git fetch origin', { cwd: repoRoot, stdio: 'pipe' });
    } catch (_) {}

    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: repoRoot }).trim();
    const baseBranch = process.env.BASE_BRANCH || currentBranch || 'main';

    if (didFreshInit || isFresh) {
      console.log(`Pushing ${baseBranch} to ${remoteName}...`);
      run(`git push -u ${remoteName} ${baseBranch}`, { cwd: repoRoot });
    }

    console.log('Fetching Jira assignees for KAN-79..KAN-123...');
    const assignees = await fetchAssignees();
    const myTickets = Object.entries(assignees)
      .filter(([, acc]) => acc === accountId)
      .map(([key]) => key)
      .sort();

    if (myTickets.length === 0) {
      console.log(`No tickets assigned to ${empId} (${accountId}). Exiting.`);
      return;
    }
    console.log(`Tickets assigned to ${empId}: ${myTickets.join(', ')}\n`);

    const authorEmail = process.env.GIT_AUTHOR_EMAIL || `${empId}@pratishthanventures.com`;
    const authorName = process.env.GIT_AUTHOR_NAME || empId.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    for (const jiraKey of myTickets) {
      const branchName = `${empId}_${jiraKey}_V01`;
      const msg = `${jiraKey} - ${jiraKey} related files (${empId})`;

      console.log(`\n--- ${jiraKey} -> ${branchName} ---`);
      try {
        run(`git checkout -b ${branchName} ${baseBranch}`, { cwd: repoRoot });
      } catch (e) {
        run(`git checkout ${branchName}`, { cwd: repoRoot });
        run(`git reset --hard ${baseBranch}`, { cwd: repoRoot });
      }

      if (isFresh || didFreshInit) {
        execSync('git', ['commit', '--allow-empty', '--author', `${authorName} <${authorEmail}>`, '-m', msg], { cwd: repoRoot, stdio: 'inherit' });
        run(`git push -u ${remoteName} ${branchName}`, { cwd: repoRoot });
      } else {
        const files = getFilesForTicket(jiraKey);
        const existing = files.filter((f) => fs.existsSync(path.join(repoRoot, f)));
        if (existing.length === 0) {
          console.log(`  No files to add for ${jiraKey}, skipping.`);
          run(`git checkout ${baseBranch}`, { cwd: repoRoot });
          continue;
        }
        execSync('git', ['add', ...existing], { cwd: repoRoot, stdio: 'inherit' });
        let hadCommit = false;
        try {
          execSync('git', ['commit', '-m', msg], { cwd: repoRoot, stdio: 'inherit' });
          hadCommit = true;
        } catch (e) {
          console.log(`  (no changes or already committed)`);
        }
        if (hadCommit) {
          run(`git push -u ${remoteName} ${branchName}`, { cwd: repoRoot });
        } else {
          console.log(`  Skipping push for ${jiraKey} (no new commit).`);
        }
      }
      run(`git checkout ${baseBranch}`, { cwd: repoRoot });
    }

    console.log('\nDone.');
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
