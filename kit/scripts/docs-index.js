#!/usr/bin/env node
'use strict';
// docs-index.js — scan a project's docs/ folder and describe it as one JSON index
// (documents, status headers, backlog summary, lint findings). Read-only: never writes
// into docs/. Zero dependencies.
// Usage: node scripts/docs-index.js [project-root] [--out file]   (default: print to stdout)
// Exit 0 on success; exit 1 when docs/ does not exist.
//
// The index is the only thing the docs viewer (view-docs.js) reads, so any other tool
// (for example a cross-project hub) can consume the same file.

const fs = require('fs');
const path = require('path');
const { lintDocs, parseHeader } = require('./lint-docs.js');

const SCHEMA = 1;

// Asset types the viewer may serve. JSON, dotfiles and anything else never leave docs/:
// docs/ can hold credentials (test accounts, env files).
const ASSET_KIND = {
  '.html': 'html', '.htm': 'html',
  '.png': 'image', '.jpg': 'image', '.jpeg': 'image', '.gif': 'image', '.svg': 'image', '.webp': 'image', '.ico': 'image',
  '.css': 'support', '.js': 'support', '.woff': 'support', '.woff2': 'support', '.pdf': 'pdf',
};

const GROUP_ORDER = ['Discovery', 'Design', 'Planning', 'Architecture', 'Governance', 'Specs', 'Testing', 'Session logs', 'Archive', 'Other'];

const TOP_LEVEL_GROUP = {
  'idea-brief.md': 'Discovery', 'market-notes.md': 'Discovery', 'phase-1-kickoff.md': 'Discovery',
  'DESIGN.md': 'Design',
  'roadmap.md': 'Planning',
  'architecture.md': 'Architecture', 'data-model.md': 'Architecture', 'flows.md': 'Architecture', 'api.md': 'Architecture',
  'constitution.md': 'Governance', 'MODELS.md': 'Governance', 'scaffold-checklist.md': 'Governance', 'known-issues.md': 'Governance',
  'E2E-TESTS.md': 'Testing',
  'handover.md': 'Session logs',
};

const DIR_GROUP = {
  prototype: 'Design', preview: 'Design', designs: 'Design', 'design-source': 'Design',
  diagrams: 'Architecture',
  requirements: 'Discovery',
  specs: 'Specs',
  'e2e-runs': 'Testing',
  archive: 'Archive',
};

function groupOf(rel) {
  const parts = rel.split('/');
  if (parts.length === 1) {
    if (TOP_LEVEL_GROUP[rel]) return TOP_LEVEL_GROUP[rel];
    if (/-session\.md$/.test(rel)) return 'Session logs';
    return 'Other';
  }
  return DIR_GROUP[parts[0]] || 'Other';
}

// Machine-written test-run output (Playwright reports, per-test artifacts). It stays
// reachable but is kept out of navigation and counts.
const GENERATED = /(^|\/)(playwright-report|test-results|[^/]*-report|[^/]*-artifacts)\//;
const isGenerated = (rel) => GENERATED.test(rel);

// A heading that is just a file name ("# architecture.md") says nothing; show the name instead.
const FILE_TITLE = /^[\w./-]+\.md$/i;

// "idea-brief" -> "Idea brief"; "DESIGN" -> "Design"; "E2E-TESTS" -> "E2E Tests".
function prettify(name) {
  const base = String(name).replace(/\.md$/i, '');
  const words = base.split(/[-_\s]+/).filter(Boolean);
  if (!words.length) return base;
  if (/^[A-Z0-9]+(?:[-_][A-Z0-9]+)*$/.test(base)) {
    return words.map((w) => (w.length <= 3 || /\d/.test(w) ? w : w[0] + w.slice(1).toLowerCase())).join(' ');
  }
  const s = words.join(' ');
  return s[0].toUpperCase() + s.slice(1);
}

// Documents named in backticks under "Based on": plain names and docs-relative paths ending
// in .md. Globs, placeholders and other file types are not tracked.
function basedOn(raw) {
  const names = [];
  for (const m of String(raw || '').matchAll(/`([^`]+)`/g)) {
    const name = m[1].trim().replace(/^docs\//, '');
    if (/[*<>\s]/.test(name) || !name.endsWith('.md')) continue;
    names.push(name);
  }
  return names;
}

// Every servable file under docs/, as POSIX-style paths relative to docs/. Skips dot
// entries and node_modules.
function walk(dir, base = dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else if (e.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

// What a docs file is to the viewer: 'markdown', an ASSET_KIND, or null (not served).
function kindOf(rel) {
  const ext = path.extname(rel).toLowerCase();
  if (ext === '.md') return 'markdown';
  return ASSET_KIND[ext] || null;
}

// Cheap change detector for the watch loop: path, size and mtime of every servable file
// plus backlog.json, which feeds the index without being served.
function signature(root) {
  const docsDir = path.join(root, 'docs');
  const parts = [];
  for (const rel of walk(docsDir)) {
    if (!kindOf(rel) && rel !== 'backlog.json') continue;
    try {
      const st = fs.statSync(path.join(docsDir, rel));
      parts.push(`${rel}:${st.size}:${Math.round(st.mtimeMs)}`);
    } catch { /* removed between walk and stat */ }
  }
  return parts.join('\n');
}

function readBacklog(docsDir) {
  const file = path.join(docsDir, 'backlog.json');
  if (!fs.existsSync(file)) return { backlog: null, backlogError: null };
  try {
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!doc || typeof doc !== 'object' || !Array.isArray(doc.features)) {
      return { backlog: null, backlogError: 'backlog.json has no features array' };
    }
    const releases = Array.isArray(doc.releases) ? doc.releases : [];
    const features = doc.features.map((f) => ({
      id: String(f.id ?? ''),
      name: String(f.name ?? ''),
      priority: f.priority ?? null,
      size: f.size ?? null,
      status: f.status ?? null,
      release: f.release ?? null,
      depends_on: Array.isArray(f.depends_on) ? f.depends_on.map(String) : [],
      shipped_at: lastEventAt(f, 'shipped'),
    }));
    return {
      backlog: {
        project: typeof doc.project === 'string' ? doc.project : '',
        phase2_scope: doc.phase2_scope || null,
        releases: releases.map((r) => ({ id: String(r.id ?? ''), name: String(r.name ?? ''), status: r.status ?? null })),
        features,
      },
      backlogError: null,
    };
  } catch (err) {
    // The orchestrator may be mid-write; report instead of crashing the viewer.
    return { backlog: null, backlogError: `backlog.json is not valid JSON: ${err.message}` };
  }
}

function lastEventAt(feature, type) {
  if (!Array.isArray(feature.events)) return null;
  const hit = feature.events.filter((e) => e && e.type === type && typeof e.at === 'string').pop();
  return hit ? hit.at.slice(0, 10) : null;
}

function readKitVersion(root) {
  const docsFile = path.join(root, 'docs', '.craft-kit.json');
  try {
    const v = JSON.parse(fs.readFileSync(docsFile, 'utf8')).kit_version;
    return typeof v === 'string' ? v : null;
  } catch {
    return null;
  }
}

function buildIndex(root) {
  const docsDir = path.join(root, 'docs');
  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    throw new Error(`docs folder not found: ${docsDir}`);
  }

  const docs = [];
  const artifacts = [];
  for (const rel of walk(docsDir)) {
    const kind = kindOf(rel);
    if (!kind) continue;
    if (kind !== 'markdown') {
      artifacts.push({ path: rel, kind, group: groupOf(rel) });
      continue;
    }
    let text = '';
    try { text = fs.readFileSync(path.join(docsDir, rel), 'utf8'); } catch { /* unreadable: still listed */ }
    const header = parseHeader(text);
    const heading = /^#\s+(.+?)\s*#*\s*$/m.exec(text);
    const headingText = heading ? heading[1].replace(/`/g, '') : '';
    docs.push({
      path: rel,
      title: headingText && !FILE_TITLE.test(headingText) ? headingText : prettify(path.basename(rel)),
      group: groupOf(rel),
      generated: isGenerated(rel),
      status: header ? header.status : null,
      updated: header ? header.updated : null,
      updated_label: header ? header.updatedLabel : null,
      based_on: header ? basedOn(header.basedOn) : [],
    });
  }
  docs.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.path.localeCompare(b.path));

  let lint = [];
  try { lint = lintDocs(root); } catch { /* lint is advisory */ }
  const { backlog, backlogError } = readBacklog(docsDir);

  return {
    schema: SCHEMA,
    project: { name: (backlog && backlog.project) || path.basename(root), root_name: path.basename(root) },
    kit_version: readKitVersion(root),
    groups: GROUP_ORDER.filter((g) => docs.some((d) => d.group === g && !d.generated) || artifacts.some((a) => a.group === g)),
    docs,
    artifacts,
    backlog,
    backlog_error: backlogError,
    lint,
  };
}

function main(argv) {
  const args = argv.slice(2);
  const outIdx = args.indexOf('--out');
  const out = outIdx >= 0 ? args[outIdx + 1] : null;
  const rest = args.filter((a, i) => a !== '--out' && (outIdx < 0 || i !== outIdx + 1));
  const root = path.resolve(rest[0] || '.');
  let index;
  try {
    index = buildIndex(root);
  } catch (err) {
    console.error(`docs-index: ${err.message}`);
    return 1;
  }
  const json = JSON.stringify(index, null, 2) + '\n';
  if (out) fs.writeFileSync(path.resolve(out), json, 'utf8');
  else process.stdout.write(json);
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { buildIndex, signature, walk, kindOf, groupOf, prettify, isGenerated, FILE_TITLE, GROUP_ORDER, SCHEMA };
