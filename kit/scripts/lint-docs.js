#!/usr/bin/env node
'use strict';
// lint-docs.js — read-only lint for a project's docs/ folder. Zero dependencies.
// Usage: node kit/scripts/lint-docs.js [project-root]   (default: current directory)
//
// Checks, per docs/*.md that has a metadata header (a Status line); files without one are ignored:
//   1. Status is valid for the file type, the date (Last updated, or Last amended) is YYYY-MM-DD,
//      and the optional `Reviewed against` date is YYYY-MM-DD.
//   2. stale (warning): a file listed under Based on has a later date than this file, and this
//      file is approved. A `Reviewed against` date at or after that source date clears it.
//      Resolution is by day: same-day edits are not flagged.
// And once per project:
//   3. docs/.craft-kit.json exists and matches its schema (missing: warning; malformed: error).
//   4. growth (warnings only), checked by name in docs/phase-2-session.md and docs/E2E-TESTS.md:
//      file over 20 KB; lines over 400 characters; a unit with more than 5 notes; a shipped unit
//      (Step 7 `complete`) that still has notes (not collapsed); a Run Log row over 300 characters.
// Output: a table of file | severity | message. Exit 1 on any error, 0 otherwise (warnings only).

const fs = require('fs');
const path = require('path');

const DEFAULT_STATUS = ['draft', 'approved'];
const STATUS_BY_FILE = {
  'scaffold-checklist.md': ['not-started', 'in-progress', 'complete'],
};
const RECORDED_BY = ['phase-1', 'adopt', 'upgrade'];
const HEADER_LINES = 40;
const FIELD = /^(?:[-*]\s+)?\*\*(Status|Last updated|Last amended|Based on|Reviewed against)(?::\*\*|\*\*:)[ \t]*(.*)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const MAX_DOC_BYTES = 20 * 1024;
const MAX_LINE = 400;
const MAX_NOTES = 5;
const MAX_RUN_LOG_ROW = 300;

function cleanValue(raw) {
  return raw.replace(/<!--.*?-->/g, '').replace(/`/g, '').trim();
}

function validDate(s) {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// Returns null when the file has no header (no Status line in the first lines).
function parseHeader(text) {
  const header = { status: null, updated: null, updatedLabel: null, basedOn: '', reviewed: null };
  let found = false;
  const lines = text.split(/\r?\n/).slice(0, HEADER_LINES);
  for (const line of lines) {
    const m = FIELD.exec(line.trim());
    if (!m) continue;
    const [, key, raw] = m;
    if (key === 'Status' && header.status === null) { header.status = cleanValue(raw); found = true; }
    else if (key === 'Last updated' && header.updated === null) { header.updated = cleanValue(raw); header.updatedLabel = key; }
    else if (key === 'Last amended' && header.updated === null) { header.updated = cleanValue(raw); header.updatedLabel = key; }
    else if (key === 'Based on' && !header.basedOn) header.basedOn = raw;
    else if (key === 'Reviewed against' && header.reviewed === null) header.reviewed = cleanValue(raw);
  }
  return found ? header : null;
}

// Names of docs/*.md files listed in backticks under Based on. Directories, globs, and
// non-markdown entries are not tracked.
function basedOnFiles(raw) {
  const names = [];
  for (const m of raw.matchAll(/`([^`]+)`/g)) {
    let name = m[1].trim().replace(/^docs\//, '');
    if (/[*<>\s]/.test(name) || name.includes('/') || !name.endsWith('.md')) continue;
    names.push(name);
  }
  return names;
}

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/);
}

function checkSize(file, docPath, hint, add) {
  const bytes = fs.statSync(docPath).size;
  if (bytes > MAX_DOC_BYTES) add(file, 'warning', `growth: ${Math.round(bytes / 1024)} KB, over ${MAX_DOC_BYTES / 1024} KB; ${hint}`);
}

// Session log: one `## <unit>` section per feature. A shipped unit keeps its steps table and a one-line
// Outcome only, so any note bullet left in it means it was not collapsed.
function lintSessionLog(docsDir, add) {
  const file = 'docs/phase-2-session.md';
  const docPath = path.join(docsDir, 'phase-2-session.md');
  if (!fs.existsSync(docPath)) return;
  checkSize(file, docPath, 'collapse and archive shipped units (kit/session-logging.md)', add);
  const lines = readLines(docPath);
  const long = lines.map((l, i) => [l.length, i + 1]).filter(([len]) => len > MAX_LINE);
  if (long.length) add(file, 'warning', `growth: ${long.length} line(s) over ${MAX_LINE} characters (first at line ${long[0][1]}); keep Output cells to paths and notes to one line`);
  const sections = [];
  let nameCol = 2, statusCol = 4; // default layout: | Step | Name | Agent | Status | Output |
  for (const line of lines) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) sections.push({ title: h[1], notes: 0, shipped: false });
    else if (sections.length) {
      const s = sections[sections.length - 1];
      if (/^\s*[-*]\s/.test(line)) s.notes++;
      else if (line.trim().startsWith('|')) {
        const cells = line.split('|').map(c => c.trim());
        const lower = cells.map(c => c.toLowerCase());
        if (lower.includes('status') && lower.includes('name')) { nameCol = lower.indexOf('name'); statusCol = lower.indexOf('status'); continue; }
        if (/^ship/i.test(cells[nameCol] || '') && (cells[statusCol] || '').toLowerCase() === 'complete') s.shipped = true;
      }
    }
  }
  for (const s of sections) {
    if (s.shipped && s.notes > 0) add(file, 'warning', `growth: shipped unit "${s.title}" is not collapsed (${s.notes} note line(s)); archive it to docs/archive/phase-2-session/ and keep the steps table and an Outcome line`);
    else if (s.notes > MAX_NOTES) add(file, 'warning', `growth: unit "${s.title}" has ${s.notes} notes, over ${MAX_NOTES}`);
  }
}

// E2E doc: the Run Log (Section 8) is one short row per run; evidence lives in docs/e2e-runs/.
function lintE2eDoc(docsDir, add) {
  const file = 'docs/E2E-TESTS.md';
  const docPath = path.join(docsDir, 'E2E-TESTS.md');
  if (!fs.existsSync(docPath)) return;
  checkSize(file, docPath, 'archive shipped features\' blocks and their Run Log rows (kit/steps/phase-2/p2-05-e2e.md)', add);
  const lines = readLines(docPath);
  let inLog = false;
  const long = [];
  lines.forEach((line, i) => {
    if (/^##\s/.test(line)) inLog = /^##\s+8\.\s*Run Log/i.test(line);
    else if (inLog && line.trim().startsWith('|') && line.length > MAX_RUN_LOG_ROW) long.push(i + 1);
  });
  if (long.length) add(file, 'warning', `growth: ${long.length} Run Log row(s) over ${MAX_RUN_LOG_ROW} characters (first at line ${long[0]}); keep one line per run and put findings in docs/e2e-runs/ or docs/known-issues.md`);
}

function lintDocs(root) {
  const docsDir = path.join(root, 'docs');
  const findings = [];
  const add = (file, severity, message) => findings.push({ file, severity, message });

  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    add('docs/', 'error', 'docs folder not found');
    return findings;
  }

  const headers = new Map();
  for (const entry of fs.readdirSync(docsDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const header = parseHeader(fs.readFileSync(path.join(docsDir, entry.name), 'utf8'));
    if (header) headers.set(entry.name, header);
  }

  for (const [name, header] of headers) {
    const file = `docs/${name}`;
    const allowed = STATUS_BY_FILE[name] || DEFAULT_STATUS;
    if (!allowed.includes(header.status)) {
      add(file, 'error', `invalid Status ${JSON.stringify(header.status)}; expected one of: ${allowed.join(' | ')}`);
    }
    if (header.reviewed !== null && !validDate(header.reviewed)) {
      add(file, 'error', `malformed Reviewed against ${JSON.stringify(header.reviewed)}; expected a real YYYY-MM-DD date`);
    }
    if (header.updated === null) {
      add(file, 'error', 'missing Last updated (or Last amended) date');
    } else if (!validDate(header.updated)) {
      add(file, 'error', `malformed ${header.updatedLabel} ${JSON.stringify(header.updated)}; expected a real YYYY-MM-DD date`);
    } else if (header.status === 'approved') {
      const current = header.reviewed !== null && validDate(header.reviewed) && header.reviewed > header.updated ? header.reviewed : header.updated;
      for (const dep of basedOnFiles(header.basedOn)) {
        const depHeader = headers.get(dep);
        if (!depHeader || dep === name || !validDate(depHeader.updated || '')) continue;
        if (depHeader.updated > current) {
          add(file, 'warning', `stale: docs/${dep} was updated after ${file} (${depHeader.updated} > ${current}); re-confirm, then set **Reviewed against:** ${depHeader.updated}`);
        }
      }
    }
  }

  const recordPath = path.join(docsDir, '.craft-kit.json');
  const recordFile = 'docs/.craft-kit.json';
  if (!fs.existsSync(recordPath)) {
    add(recordFile, 'warning', 'missing: no kit version record; run kit/phase-upgrade.md to write it');
  } else {
    let rec;
    let parsed = false;
    try { rec = JSON.parse(fs.readFileSync(recordPath, 'utf8')); parsed = true; } catch (e) { add(recordFile, 'error', `not valid JSON: ${e.message}`); }
    if (parsed) {
      if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
        add(recordFile, 'error', 'must be a JSON object');
      } else {
        if (rec.schema !== 1) add(recordFile, 'error', 'schema must be 1');
        if (typeof rec.kit_version !== 'string' || !SEMVER.test(rec.kit_version)) add(recordFile, 'error', 'kit_version must be a version like 0.0.37');
        if (typeof rec.recorded_at !== 'string' || !validDate(rec.recorded_at)) add(recordFile, 'error', 'recorded_at must be a real YYYY-MM-DD date');
        if (!RECORDED_BY.includes(rec.recorded_by)) add(recordFile, 'error', `recorded_by must be one of: ${RECORDED_BY.join(' | ')}`);
        if (rec.acknowledged_version !== undefined && (typeof rec.acknowledged_version !== 'string' || !SEMVER.test(rec.acknowledged_version))) add(recordFile, 'error', 'acknowledged_version must be a version like 0.0.37');
      }
    }
  }
  lintSessionLog(docsDir, add);
  lintE2eDoc(docsDir, add);

  return findings;
}

function formatTable(findings) {
  const rows = [['file', 'severity', 'message'], ...findings.map(f => [f.file, f.severity, f.message])];
  const widths = [0, 1].map(i => Math.max(...rows.map(r => r[i].length)));
  const line = r => `${r[0].padEnd(widths[0])} | ${r[1].padEnd(widths[1])} | ${r[2]}`;
  return [line(rows[0]), `${'-'.repeat(widths[0])}-+-${'-'.repeat(widths[1])}-+-${'-'.repeat(7)}`, ...rows.slice(1).map(line)].join('\n');
}

function main(argv) {
  const root = path.resolve(argv[2] || '.');
  const findings = lintDocs(root);
  if (findings.length === 0) {
    console.log('lint-docs: no findings');
    return 0;
  }
  console.log(formatTable(findings));
  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.length - errors;
  console.log(`\nlint-docs: ${errors} error(s), ${warnings} warning(s)`);
  return errors > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { lintDocs, parseHeader, basedOnFiles };
