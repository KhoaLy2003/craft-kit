#!/usr/bin/env node
'use strict';
// lint-docs.js — read-only lint for a project's docs/ folder. Zero dependencies.
// Usage: node kit/scripts/lint-docs.js [project-root]   (default: current directory)
//
// Checks, per docs/*.md that has a metadata header (a Status line); files without one are ignored:
//   1. Status is valid for the file type, the date (Last updated, or Last amended) is YYYY-MM-DD.
//   2. stale (warning): a file listed under Based on has a later date than this file, and this
//      file is approved. Resolution is by day: same-day edits are not flagged.
// And once per project:
//   3. docs/.craft-kit.json exists and matches its schema (missing: warning; malformed: error).
// Output: a table of file | severity | message. Exit 1 on any error, 0 otherwise (warnings only).

const fs = require('fs');
const path = require('path');

const DEFAULT_STATUS = ['draft', 'approved'];
const STATUS_BY_FILE = {
  'scaffold-checklist.md': ['not-started', 'in-progress', 'complete'],
};
const RECORDED_BY = ['phase-1', 'adopt', 'upgrade'];
const HEADER_LINES = 40;
const FIELD = /^(?:[-*]\s+)?\*\*(Status|Last updated|Last amended|Based on)(?::\*\*|\*\*:)[ \t]*(.*)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;

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
  const header = { status: null, updated: null, updatedLabel: null, basedOn: '' };
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
    if (header.updated === null) {
      add(file, 'error', 'missing Last updated (or Last amended) date');
    } else if (!validDate(header.updated)) {
      add(file, 'error', `malformed ${header.updatedLabel} ${JSON.stringify(header.updated)}; expected a real YYYY-MM-DD date`);
    } else if (header.status === 'approved') {
      for (const dep of basedOnFiles(header.basedOn)) {
        const depHeader = headers.get(dep);
        if (!depHeader || dep === name || !validDate(depHeader.updated || '')) continue;
        if (depHeader.updated > header.updated) {
          add(file, 'warning', `stale: docs/${dep} was updated after ${file} (${depHeader.updated} > ${header.updated}); re-confirm`);
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
      }
    }
  }
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
