#!/usr/bin/env node
'use strict';

// Pre-commit gate for kit/CHANGELOG.md. Agents append long entries; this keeps
// each commit's addition short. Only staged additions are checked.
// Limits: CHANGELOG_MAX_ADDED_LINES (default 30), CHANGELOG_MAX_LINE_CHARS (default 300).

const { execFileSync } = require('node:child_process');

const FILE = 'kit/CHANGELOG.md';
const MAX_ADDED_LINES = Number(process.env.CHANGELOG_MAX_ADDED_LINES) || 30;
const MAX_LINE_CHARS = Number(process.env.CHANGELOG_MAX_LINE_CHARS) || 300;

const diff = execFileSync('git', ['diff', '--cached', '-U0', '--', FILE], { encoding: 'utf8' });

// Collect added content lines: skip the file header (everything before the first hunk).
const added = [];
let inHunk = false;
for (const raw of diff.split('\n')) {
  const line = raw.replace(/\r$/, '');
  if (line.startsWith('@@')) { inHunk = true; continue; }
  if (inHunk && line.startsWith('+')) added.push(line.slice(1));
}

if (added.length === 0) process.exit(0);

const problems = [];
if (added.length > MAX_ADDED_LINES) {
  problems.push(`adds ${added.length} lines (limit ${MAX_ADDED_LINES})`);
}
const long = added.filter((text) => text.length > MAX_LINE_CHARS);
if (long.length > 0) {
  problems.push(
    `${long.length} added line(s) over ${MAX_LINE_CHARS} characters, starting: "${long[0].slice(0, 80)}…"`,
  );
}

if (problems.length === 0) process.exit(0);

console.error(`\ncheck-changelog: ${FILE} change rejected:`);
for (const p of problems) console.error(`  - ${p}`);
console.error(
  '\nKeep the entry to a one-line summary per change: file names and the prompt, no step-by-step detail.',
);
console.error('Bypass once with: git commit --no-verify (only when the length is intentional).\n');
process.exit(1);
