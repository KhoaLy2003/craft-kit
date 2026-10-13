#!/usr/bin/env node
'use strict';
// render-backlog.js — validate docs/backlog.json, then write docs/backlog.html and
// rewrite the feature table inside docs/roadmap.md. Zero dependencies.
// Usage: node scripts/render-backlog.js [project-root]   (default: current directory)
// Exit 0 on success (warnings go to stderr); exit 1 on any validation or marker error,
// writing nothing.

const fs = require('fs');
const path = require('path');

const SUPPORTED_SCHEMA = [1];
const SCOPES = ['all', 'feature'];
const ADMIN_SITE = ['yes', 'no', 'later'];
const RELEASE_STATUS = ['planned', 'in-progress', 'shipped'];
const PRIORITIES = ['Must', 'Should', 'Could', "Won't"];
const SIZES = ['S', 'M', 'L'];
const FEATURE_STATUS = ['pending', 'in-progress', 'shipped', 'deferred'];
const EVENT_TYPES = ['created', 'approved', 'started', 'shipped', 'deferred', 'note'];
const EVENT_SOURCES = ['live', 'backfill-confirmed', 'backfill-unverified', 'unknown'];
const EVENT_BY = ['orchestrator', 'user', 'migration'];
const STATUS_OF_EVENT = { created: 'pending', started: 'in-progress', shipped: 'shipped', deferred: 'deferred' };
const STATUS_EVENT_TYPES = Object.keys(STATUS_OF_EVENT);
const UNASSIGNED_RELEASE_ALLOWED = ['pending', 'deferred'];
const SHARED_TIMESTAMP_WARN = 3;
const BEGIN = '<!-- BEGIN FEATURES -->';
const END = '<!-- END FEATURES -->';

const SOURCE_LABEL = {
  'live': 'recorded',
  'backfill-confirmed': 'from git, confirmed',
  'backfill-unverified': 'from git, unverified',
  'unknown': 'date unknown',
};

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '';
}

function validate(doc) {
  const errors = [];
  const err = (msg) => errors.push(msg);

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return ['backlog.json must contain a JSON object'];
  }
  if (!SUPPORTED_SCHEMA.includes(doc.schema_version)) {
    err(`schema_version ${JSON.stringify(doc.schema_version)} is not supported (supported: ${SUPPORTED_SCHEMA.join(', ')})`);
  }
  if (!isNonEmptyString(doc.project)) err('project must be a non-empty string');
  if (!SCOPES.includes(doc.phase2_scope)) err(`phase2_scope must be one of: ${SCOPES.join(' | ')}`);
  if (!ADMIN_SITE.includes(doc.admin_site)) err(`admin_site must be one of: ${ADMIN_SITE.join(' | ')}`);
  if (!Array.isArray(doc.releases)) err('releases must be an array');
  if (!Array.isArray(doc.features)) err('features must be an array');
  if (errors.length) return errors;

  const releaseIds = new Set();
  for (const r of doc.releases) {
    if (!r || !isNonEmptyString(r.id)) { err('a release has no id'); continue; }
    if (releaseIds.has(r.id)) err(`duplicate release id ${r.id}`);
    releaseIds.add(r.id);
    if (!isNonEmptyString(r.name)) err(`${r.id}: name must be a non-empty string`);
    if (!RELEASE_STATUS.includes(r.status)) err(`${r.id}: status must be one of: ${RELEASE_STATUS.join(' | ')}`);
  }

  const featureIds = new Set();
  for (const f of doc.features) {
    if (!f || !isNonEmptyString(f.id)) { err('a feature has no id'); continue; }
    if (featureIds.has(f.id)) err(`duplicate feature id ${f.id}`);
    featureIds.add(f.id);
  }

  for (const f of doc.features) {
    if (!f || !isNonEmptyString(f.id)) continue;
    const id = f.id;
    if (!isNonEmptyString(f.name)) err(`${id}: name must be a non-empty string`);
    if (!PRIORITIES.includes(f.priority)) err(`${id}: priority must be one of: ${PRIORITIES.join(' | ')}`);
    if (!SIZES.includes(f.size)) err(`${id}: size must be one of: ${SIZES.join(' | ')}`);
    if (!FEATURE_STATUS.includes(f.status)) err(`${id}: status must be one of: ${FEATURE_STATUS.join(' | ')}`);

    if (!Array.isArray(f.depends_on)) {
      err(`${id}: depends_on must be an array`);
    } else {
      for (const dep of f.depends_on) {
        if (dep === id) err(`${id}: depends on itself`);
        else if (!featureIds.has(dep)) err(`${id}: depends on unknown feature ${JSON.stringify(dep)}`);
      }
    }

    if (f.release !== null && !releaseIds.has(f.release)) {
      err(`${id}: release must be null or an existing release id`);
    }
    if (f.release === null && !UNASSIGNED_RELEASE_ALLOWED.includes(f.status)) {
      err(`${id}: status ${f.status} requires a release (null is allowed only for: ${UNASSIGNED_RELEASE_ALLOWED.join(', ')})`);
    }

    validateEvents(f, err);
  }
  return errors;
}

function validateEvents(f, err) {
  const id = f.id;
  if (!Array.isArray(f.events) || f.events.length === 0) {
    err(`${id}: events must be a non-empty array`);
    return;
  }

  // Array order is the event sequence. Dated events must be non-decreasing among themselves;
  // undated events (source unknown) may appear anywhere, e.g. a known shipped date after an
  // unknown created date.
  let lastDatedMs = null;
  f.events.forEach((e, i) => {
    const where = `${id} event ${i + 1}`;
    if (!e || typeof e !== 'object') { err(`${where}: must be an object`); return; }
    if (!EVENT_TYPES.includes(e.type)) err(`${where}: type must be one of: ${EVENT_TYPES.join(' | ')}`);
    if (!EVENT_SOURCES.includes(e.source)) err(`${where}: source must be one of: ${EVENT_SOURCES.join(' | ')}`);
    if (!EVENT_BY.includes(e.by)) err(`${where}: by must be one of: ${EVENT_BY.join(' | ')}`);
    if (e.evidence !== undefined && e.evidence !== null && typeof e.evidence !== 'string') {
      err(`${where}: evidence must be a string or null`);
    }
    if (typeof e.note !== 'string') err(`${where}: note must be a string`);

    if (e.at === null) {
      if (e.source !== 'unknown') err(`${where}: at may be null only when source is unknown`);
      return;
    }
    if (typeof e.at !== 'string' || Number.isNaN(Date.parse(e.at))) {
      err(`${where}: at must be an ISO 8601 date-time or null`);
      return;
    }
    if (e.source === 'unknown') err(`${where}: source unknown requires at to be null`);
    const ms = Date.parse(e.at);
    if (lastDatedMs !== null && ms < lastDatedMs) err(`${where}: dated events are out of order`);
    lastDatedMs = ms;
  });

  if (!f.events.some((e) => e && e.type === 'created')) err(`${id}: must have a created event`);

  const statusEvents = f.events.filter((e) => e && STATUS_OF_EVENT[e.type]);
  const latest = statusEvents[statusEvents.length - 1];
  if (!latest) {
    err(`${id}: has no status-changing event`);
  } else if (STATUS_OF_EVENT[latest.type] !== f.status) {
    err(`${id}: status ${f.status} does not match latest status event ${latest.type} (implies ${STATUS_OF_EVENT[latest.type]})`);
  }
}

// Non-fatal findings. A batch of features sharing one dated timestamp usually means the
// dates came from a single commit, not from each feature's own history.
function warnings(doc) {
  const byKey = new Map();
  for (const f of doc.features) {
    for (const e of f.events) {
      if (e.at === null || !STATUS_EVENT_TYPES.includes(e.type)) continue;
      const key = `${e.type}|${e.at}`;
      if (!byKey.has(key)) byKey.set(key, { type: e.type, at: e.at, ids: [] });
      byKey.get(key).ids.push(f.id);
    }
  }
  const out = [];
  for (const { type, at, ids } of byKey.values()) {
    const unique = [...new Set(ids)];
    if (unique.length >= SHARED_TIMESTAMP_WARN) {
      out.push(`${unique.length} features share the same ${type} time ${at} (${unique.join(', ')}). ` +
        'These dates may come from one batch commit rather than each feature; check them.');
    }
  }
  return out;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

// One dated event per status type (the latest of that type), in chronological order.
function datedStatusEvents(f) {
  const latest = {};
  for (const e of f.events) {
    if (e.at !== null && STATUS_EVENT_TYPES.includes(e.type)) latest[e.type] = e;
  }
  return Object.values(latest).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

function dialogId(f) {
  return `dlg-${f.id}`;
}

// Card shows metadata only. Long titles are clamped in CSS; the dialog shows the full text.
function renderCard(f) {
  const dates = datedStatusEvents(f).map((e) => {
    const cls = e.source === 'backfill-unverified' ? ' class="unverified"' : '';
    return `<span${cls} title="${escapeHtml(SOURCE_LABEL[e.source])}">${escapeHtml(e.type)} ${escapeHtml(e.at.slice(0, 10))}</span>`;
  }).join(' → ');
  return (
    `<button type="button" class="card" data-open="${escapeHtml(dialogId(f))}" aria-haspopup="dialog">` +
    `<div class="id">${escapeHtml(f.id)} · ${escapeHtml(f.priority)} · ${escapeHtml(f.size)}</div>` +
    `<div class="name">${escapeHtml(f.name)}</div>` +
    (dates ? `<div class="meta">${dates}</div>` : '') +
    `</button>`
  );
}

function renderDialog(f, doc) {
  const release = f.release === null
    ? 'Unassigned'
    : escapeHtml((doc.releases.find((r) => r.id === f.release) || {}).name || f.release);
  const deps = f.depends_on.length ? escapeHtml(f.depends_on.join(', ')) : 'none';
  const events = f.events.map((e) => {
    const when = e.at === null ? '' : escapeHtml(e.at.slice(0, 10));
    const evidence = e.evidence ? ` · ${escapeHtml(e.evidence)}` : '';
    const note = e.note ? `<div class="note">${escapeHtml(e.note)}</div>` : '';
    return `<li><strong>${escapeHtml(e.type)}</strong> ${when} <span class="muted">(${escapeHtml(SOURCE_LABEL[e.source])})</span>${evidence}${note}</li>`;
  }).join('');
  const titleId = `${dialogId(f)}-title`;
  return (
    `<dialog class="detail" id="${escapeHtml(dialogId(f))}" aria-labelledby="${escapeHtml(titleId)}">` +
    `<div class="sheet">` +
    `<p class="muted">${escapeHtml(f.id)}</p>` +
    `<h2 id="${escapeHtml(titleId)}">${escapeHtml(f.name)}</h2>` +
    `<dl>` +
    `<dt>Priority</dt><dd>${escapeHtml(f.priority)}</dd>` +
    `<dt>Size</dt><dd>${escapeHtml(f.size)}</dd>` +
    `<dt>Status</dt><dd>${escapeHtml(f.status)}</dd>` +
    `<dt>Release</dt><dd>${release}</dd>` +
    `<dt>Depends on</dt><dd>${deps}</dd>` +
    `</dl>` +
    `<h3>History</h3>` +
    `<ol class="timeline">${events}</ol>` +
    `<form method="dialog"><button class="close">Close</button></form>` +
    `</div></dialog>`
  );
}

function renderDialogs(doc) {
  return doc.features.map((f) => renderDialog(f, doc)).join('\n');
}

const STATUS_COLUMNS = [
  ['pending', 'Pending'],
  ['in-progress', 'In progress'],
  ['shipped', 'Shipped'],
  ['deferred', 'Deferred'],
];

function renderBoard(doc) {
  const groups = doc.releases.map((r) => ({ id: r.id, name: r.name, status: r.status }));
  groups.push({ id: null, name: 'Unassigned', status: null });

  const sections = [];
  for (const g of groups) {
    const features = doc.features.filter((f) => f.release === g.id);
    if (g.id === null && features.length === 0) continue;

    const columns = STATUS_COLUMNS.map(([status, label]) => {
      const cards = features.filter((f) => f.status === status);
      const body = cards.length ? cards.map(renderCard).join('') : '<p class="empty">None</p>';
      return `<div class="col"><h3>${label}<span class="count">${cards.length}</span></h3>${body}</div>`;
    }).join('');

    const badge = g.status ? ` <span class="badge">${escapeHtml(g.status)}</span>` : '';
    sections.push(
      `<section class="release"><h2>${escapeHtml(g.name)}${badge}</h2>` +
      `<div class="board">${columns}</div></section>`
    );
  }
  return sections.join('\n');
}

function renderSummary(doc) {
  return STATUS_COLUMNS.map(([status, label]) => {
    const n = doc.features.filter((f) => f.status === status).length;
    return `<span>${label}: ${n}</span>`;
  }).join('') + `<span>Total: ${doc.features.length}</span>`;
}

function renderHtml(doc, template) {
  // Generated HTML always uses LF, whatever line endings the template file has on disk.
  // split/join replaces every occurrence; String.replace would only replace the first.
  return template.replace(/\r\n/g, '\n')
    .split('{{PROJECT}}').join(escapeHtml(doc.project))
    .split('{{SUMMARY}}').join(renderSummary(doc))
    .split('{{BOARD}}').join(renderBoard(doc))
    .split('{{DIALOGS}}').join(renderDialogs(doc));
}

function renderFeatureTable(doc) {
  const lines = [
    '| ID | Feature | Priority | Size | Depends on | Status |',
    '|---|---|---|---|---|---|',
  ];
  for (const f of doc.features) {
    lines.push(
      `| ${escapeCell(f.id)} | ${escapeCell(f.name)} | ${f.priority} | ${f.size} | ` +
      `${escapeCell(f.depends_on.join(', '))} | ${f.status} |`
    );
  }
  return lines.join('\n');
}

// Splice the generated table into roadmap.md, using the file's own line endings so the
// file never ends up with mixed CRLF and LF.
function replaceFeatureBlock(markdown, table) {
  const begin = markdown.indexOf(BEGIN);
  const end = markdown.indexOf(END);
  if (begin === -1 || end === -1 || end < begin) {
    throw new Error(`roadmap.md is missing the ${BEGIN} ... ${END} markers; run the backlog migration first`);
  }
  if (markdown.indexOf(BEGIN, begin + 1) !== -1 || markdown.indexOf(END, end + 1) !== -1) {
    throw new Error('roadmap.md has more than one feature block marker pair');
  }
  const eol = markdown.includes('\r\n') ? '\r\n' : '\n';
  const body = table.split('\n').join(eol);
  return markdown.slice(0, begin + BEGIN.length) + eol + body + eol + markdown.slice(end);
}

function main(argv) {
  const root = path.resolve(argv[2] || '.');
  const docsDir = path.join(root, 'docs');
  const jsonPath = path.join(docsDir, 'backlog.json');
  const roadmapPath = path.join(docsDir, 'roadmap.md');
  const htmlPath = path.join(docsDir, 'backlog.html');
  const templatePath = path.join(__dirname, '..', 'templates', 'backlog.html');

  let doc;
  let roadmap;
  let template;
  try {
    doc = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    console.error(e.code === 'ENOENT'
      ? `render-backlog: ${jsonPath} not found`
      : `render-backlog: cannot read ${jsonPath}: ${e.message}`);
    return 1;
  }
  const errors = validate(doc);
  if (errors.length) {
    console.error(`render-backlog: ${errors.length} validation error(s) in backlog.json:`);
    for (const msg of errors) console.error(`  - ${msg}`);
    return 1;
  }

  try {
    roadmap = fs.readFileSync(roadmapPath, 'utf8');
    template = fs.readFileSync(templatePath, 'utf8');
  } catch (e) {
    console.error(`render-backlog: cannot read input: ${e.message}`);
    return 1;
  }

  let updatedRoadmap;
  try {
    updatedRoadmap = replaceFeatureBlock(roadmap, renderFeatureTable(doc));
  } catch (e) {
    console.error(`render-backlog: ${e.message}`);
    return 1;
  }

  for (const w of warnings(doc)) console.error(`render-backlog: warning: ${w}`);

  fs.writeFileSync(htmlPath, renderHtml(doc, template));
  if (updatedRoadmap !== roadmap) fs.writeFileSync(roadmapPath, updatedRoadmap);
  console.log(`render-backlog: wrote docs/backlog.html; roadmap feature table has ${doc.features.length} row(s)`);
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { validate, warnings, renderHtml, renderFeatureTable, replaceFeatureBlock };
