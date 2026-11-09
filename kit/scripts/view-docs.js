#!/usr/bin/env node
'use strict';
// view-docs.js — browse a project's docs/ folder as a website (VitePress). Read-only:
// docs/ is mirrored into a per-project site folder under ~/.craft-kit/viewer/, never
// written to.
// Usage: node scripts/view-docs.js [project-root] [--port N] [--build] [--out DIR] [--base /path/] [--prepare]
//   (default)  dev server with live reload; Ctrl+C stops it
//   --build    static site (self-contained folder you can host or zip)
//   --prepare  mirror docs and generate pages only; no install, no server (used by tests)
// Env: CRAFT_KIT_HOME overrides ~/.craft-kit. First run installs VitePress into
// <home>/viewer (needs network once); later runs reuse it.
// Exit 0 on success; exit 1 on a missing docs/ folder, a failed install or a failed build.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { buildIndex, signature, walk, kindOf, prettify, FILE_TITLE } = require('./docs-index.js');

const DEPS = { vitepress: '^1.6.3', mermaid: '^11.4.0' };
const POLL_MS = 1000;
const TEMPLATE_DIR = path.join(__dirname, '..', 'viewer');

// ─── Markdown helpers ─────────────────────────────────────────────────────────

const cell = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/\{/g, '&#123;').replace(/\r?\n/g, ' ');
// Non-breaking hyphens keep a date such as 2026-11-04 on one line inside a narrow table cell.
const nb = (s) => cell(s).replace(/-/g, '\u2011');
const docLink = (rel) => `/${rel.replace(/\\/g, '/')}`;
const mdLink = (title, rel) => `[${cell(title)}](${docLink(rel)})`;
const routeOf = (rel) => `/${rel.replace(/\.md$/, '')}`.replace(/\/index$/, '/');
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const visibleDocs = (index) => index.docs.filter((d) => !d.generated);

// Feature folder names (specs/<slug>/, designs/<slug>/) back to "F01 Feature name".
function featureLabeler(index) {
  const bySlug = new Map();
  if (index.backlog) {
    for (const f of index.backlog.features) {
      const label = `${f.id} ${f.name}`.trim();
      bySlug.set(slugify(f.name), label);
      bySlug.set(`${slugify(f.name)}-${slugify(f.id)}`, label);
    }
  }
  return (slug) => bySlug.get(slug) || null;
}

// A doc named in `Based on`: exact docs-relative path, else the only document with that file name.
function resolveDoc(index, name) {
  const exact = index.docs.find((d) => d.path === name);
  if (exact) return exact;
  const same = index.docs.filter((d) => path.posix.basename(d.path) === path.posix.basename(name));
  return same.length === 1 ? same[0] : null;
}

// ─── Generated pages ──────────────────────────────────────────────────────────

const FEATURE_COLUMNS = [
  ['in-progress', 'In progress'],
  ['pending', 'Pending'],
  ['shipped', 'Shipped'],
  ['deferred', 'Deferred'],
  ['cancelled', 'Cancelled'],
];

function overviewPage(index) {
  const docs = visibleDocs(index);
  const hidden = index.docs.length - docs.length;
  const lines = [`# ${cell(index.project.name)}`, '', '> Browsable view of this project\'s craft-kit documents. Read-only: edit the files in `docs/`; this site follows them.', ''];
  const byStatus = new Map();
  for (const d of docs) {
    const k = d.status ? d.status.split(/\s*[—,(:]/)[0].trim().toLowerCase() || d.status : 'no status';
    byStatus.set(k, (byStatus.get(k) || 0) + 1);
  }
  lines.push('## At a glance', '');
  lines.push(`- **Documents:** ${docs.length} (${[...byStatus].map(([k, n]) => `${n} ${cell(k)}`).join(', ') || 'none'})${hidden ? `, plus ${hidden} generated test-run file(s) kept out of the lists` : ''}`);
  if (index.kit_version) lines.push(`- **Kit version that wrote these docs:** ${cell(index.kit_version)}`);
  if (index.backlog) {
    const c = new Map();
    for (const f of index.backlog.features) c.set(f.status, (c.get(f.status) || 0) + 1);
    lines.push(`- **Features:** ${index.backlog.features.length} (${[...c].map(([k, n]) => `${n} ${cell(k)}`).join(', ') || 'none'}) — [backlog](/craft-kit/backlog.md)`);
  } else {
    lines.push(`- **Features:** no \`docs/backlog.json\`${index.backlog_error ? ` (${cell(index.backlog_error)})` : ''}`);
  }
  const warns = index.lint.filter((f) => f.severity === 'warning').length;
  const errs = index.lint.filter((f) => f.severity === 'error').length;
  lines.push(`- **Lint:** ${errs} error(s), ${warns} warning(s) — [documents](/craft-kit/documents.md)`);
  if (index.artifacts.length) lines.push(`- **Artifacts:** ${index.artifacts.length} file(s) — [artifacts](/craft-kit/artifacts.md)`);
  lines.push('');
  for (const g of index.groups) {
    const inGroup = docs.filter((d) => d.group === g);
    if (!inGroup.length) continue;
    lines.push(`## ${g}`, '', '| Document | Status | Updated |', '|---|---|---|');
    for (const d of inGroup) lines.push(`| ${mdLink(d.title, d.path)} | ${cell(d.status ? statusWord(d.status) : '—')} | ${nb(d.updated || '—')} |`);
    lines.push('');
  }
  return lines.join('\n');
}

// "Complete — 84/84 acceptance criteria covered" -> "Complete".
const statusWord = (status) => status.split(/\s*[—,(:]/)[0].trim() || status;

function documentsPage(index) {
  const docs = visibleDocs(index);
  const lines = ['# Documents', '', 'Every markdown document with its header status and the documents it was based on.', ''];
  lines.push('| Document | Group | Status | Updated | Based on |', '|---|---|---|---|---|');
  for (const d of docs) {
    const based = d.based_on.map((b) => {
      const hit = resolveDoc(index, b);
      return hit ? mdLink(b, hit.path) : cell(b);
    }).join(', ') || '—';
    lines.push(`| ${mdLink(d.title, d.path)} | ${cell(d.group)} | ${cell(d.status ? statusWord(d.status) : '—')} | ${nb(d.updated || '—')} | ${based} |`);
  }
  lines.push('', '## Lint findings', '');
  if (!index.lint.length) lines.push('No findings.');
  else {
    lines.push('| File | Severity | Message |', '|---|---|---|');
    for (const f of index.lint) lines.push(`| ${cell(f.file)} | ${cell(f.severity)} | ${cell(f.message)} |`);
  }
  return lines.join('\n');
}

function backlogPage(index) {
  const lines = ['# Backlog', ''];
  if (index.backlog_error) lines.push(`> **Backlog unreadable:** ${cell(index.backlog_error)}. It may be mid-write; the page refreshes when the file is valid.`, '');
  const b = index.backlog;
  if (!b) {
    if (!index.backlog_error) lines.push('No `docs/backlog.json` yet. Phase 1 Step 4 creates it.');
    return lines.join('\n');
  }
  if (b.phase2_scope) lines.push(`Phase 2 scope: **${cell(b.phase2_scope)}**`, '');
  const groups = [...b.releases.map((r) => ({ id: r.id, title: `${r.id} ${r.name}${r.status ? ` (${r.status})` : ''}` })), { id: null, title: 'Unassigned' }];
  for (const g of groups) {
    const features = b.features.filter((f) => f.release === g.id);
    if (!features.length) continue;
    lines.push(`## ${cell(g.title)}`, '');
    for (const [status, label] of FEATURE_COLUMNS) {
      const inCol = features.filter((f) => f.status === status);
      if (!inCol.length) continue;
      lines.push(`### ${label} (${inCol.length})`, '', '| ID | Feature | Priority | Size | Depends on | Shipped |', '|---|---|---|---|---|---|');
      for (const f of inCol) {
        lines.push(`| ${cell(f.id)} | ${cell(f.name)} | ${cell(f.priority || '—')} | ${cell(f.size || '—')} | ${cell(f.depends_on.join(', ') || '—')} | ${nb(f.shipped_at || '—')} |`);
      }
      lines.push('');
    }
  }
  return lines.join('\n');
}

// "01-sign-in.en.html" -> "01 Sign in (en)".
function artifactLabel(rel) {
  const file = path.posix.basename(rel);
  const m = /^(\d+)?[-_]?(.*?)(?:\.([a-z]{2}))?\.[a-z0-9]+$/i.exec(file);
  if (!m) return file;
  const text = prettify(m[2] || file);
  return `${m[1] ? m[1] + ' ' : ''}${text}${m[3] ? ` (${m[3]})` : ''}`;
}

// Artifacts are grouped by folder (two levels) and collapsed: a real project can hold
// hundreds of rendered screens and test-run files. Links open inside the viewer
// (artifact.html), so the navigation stays on screen.
function artifactsPage(index, base = '/') {
  const lines = ['# Artifacts', '', 'HTML prototypes, rendered diagrams and design images. They open inside this viewer and may load fonts or scripts from a CDN.', ''];
  if (!index.artifacts.length) {
    lines.push('No artifacts yet.');
    return lines.join('\n');
  }
  const preview = index.artifacts.find((a) => a.path === 'preview/index.html');
  if (preview) lines.push('## Prototype preview', '', `<iframe src="${base}${encodeURI(preview.path)}" style="width:100%;height:640px;border:1px solid var(--vp-c-divider);border-radius:8px"></iframe>`, '');
  const folders = new Map();
  for (const a of index.artifacts) {
    const parts = a.path.split('/');
    const key = parts.length > 2 ? parts.slice(0, 2).join('/') : parts.length > 1 ? parts[0] : '(top level)';
    if (!folders.has(key)) folders.set(key, []);
    folders.get(key).push(a);
  }
  lines.push(`## All files (${index.artifacts.length})`, '');
  for (const [folder, items] of [...folders].sort((x, y) => x[0].localeCompare(y[0]))) {
    const rows = items.map((a) => `<li><a href="${base}craft-kit/artifact.html#/${encodeURI(a.path)}" target="_self" title="${cell(a.path)}">${cell(artifactLabel(a.path))}</a> <small>${a.kind}</small></li>`).join('');
    lines.push(`<details><summary>${cell(folder)} (${items.length})</summary><ul>${rows}</ul></details>`, '');
  }
  return lines.join('\n');
}

// Host page for one artifact: the theme's Layout renders the frame below this heading.
const ARTIFACT_PAGE = '---\nckArtifact: true\naside: false\noutline: false\nprev: false\nnext: false\n---\n\n# Artifact\n';

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const GROUP_LEAF = { spec: 'Spec', plan: 'Plan', intake: 'Intake' };

// Documents of one group as a tree following their folders. Folder names become feature
// names where the backlog knows them; screen briefs lose their "Screen:" prefix.
function nestedItems(docs, strip, label, dupTitles) {
  const root = { items: [], dirs: new Map() };
  for (const d of docs) {
    const segs = d.path.split('/');
    if (strip && segs.length > 1 && segs[0] === strip) segs.shift();
    let node = root;
    for (let i = 0; i < segs.length - 1; i++) {
      const key = segs[i];
      if (!node.dirs.has(key)) {
        const text = label(key) || (/^\d/.test(key) ? key : prettify(key).replace(/\be2e\b/i, 'E2E'));
        const child = { text, collapsed: true, items: [], dirs: new Map() };
        node.dirs.set(key, child);
        node.items.push(child);
      }
      node = node.dirs.get(key);
    }
    const base = segs[segs.length - 1].replace(/\.md$/i, '');
    const parent = segs.length > 1 ? segs[segs.length - 2] : '';
    let text = d.title;
    if (GROUP_LEAF[base]) text = GROUP_LEAF[base];
    else if (parent === 'screens') text = d.title.replace(/^Screen:\s*/i, '');
    else if (dupTitles.has(d.title)) text = label(base) || prettify(base);
    node.items.push({ text, link: routeOf(d.path) });
  }
  const finish = (n) => {
    const leaves = n.items.filter((i) => i.link);
    const dirs = n.items.filter((i) => !i.link).map((dir) => ({ text: dir.text, collapsed: dir.collapsed, items: finish(dir) }));
    return [...leaves, ...dirs];
  };
  return finish(root);
}

// Sidebar and nav for the generated config. Only markdown documents get entries.
function siteData(index) {
  const docs = visibleDocs(index);
  const label = featureLabeler(index);
  const counts = new Map();
  for (const d of docs) counts.set(d.title, (counts.get(d.title) || 0) + 1);
  const dupTitles = new Set([...counts].filter(([, n]) => n > 1).map(([t]) => t));

  const sidebar = [{ text: 'Project', items: [
    { text: 'Overview', link: '/' },
    { text: 'Documents', link: '/craft-kit/documents' },
    { text: 'Backlog', link: '/craft-kit/backlog' },
    { text: 'Artifacts', link: '/craft-kit/artifacts' },
  ] }];
  for (const g of index.groups) {
    const inGroup = docs.filter((d) => d.group === g);
    if (!inGroup.length) continue;
    const items = nestedItems(inGroup, { Specs: 'specs', Archive: 'archive' }[g] || '', label, dupTitles);
    sidebar.push({ text: g, collapsed: g === 'Specs' || g === 'Session logs' || g === 'Archive', items });
  }
  return {
    title: index.project.name,
    nav: [
      { text: 'Overview', link: '/' },
      { text: 'Documents', link: '/craft-kit/documents' },
      { text: 'Backlog', link: '/craft-kit/backlog' },
      { text: 'Artifacts', link: '/craft-kit/artifacts' },
    ],
    sidebar,
  };
}

// ─── Mirror docs/ into the site folder ────────────────────────────────────────

function writeIfChanged(file, text) {
  try {
    if (fs.readFileSync(file, 'utf8') === text) return false;
  } catch { /* new file */ }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
  return true;
}

// Edits applied to the mirrored copy only (docs/ is never touched):
//  - a first heading that is just a file name ("# architecture.md") becomes a readable title;
//  - the "## Metadata" section, which repeats the status badge, folds into a closed <details>.
function transformMarkdown(text) {
  let out = text;
  const h1 = /^#[ \t]+(.+?)[ \t]*$/m.exec(out);
  if (h1 && FILE_TITLE.test(h1[1])) {
    out = out.slice(0, h1.index) + `# ${prettify(path.posix.basename(h1[1]))}` + out.slice(h1.index + h1[0].length);
  }
  const lines = out.split('\n');
  const start = lines.findIndex((l) => /^##[ \t]+Metadata[ \t]*\r?$/.test(l));
  if (start >= 0) {
    let end = lines.findIndex((l, i) => i > start && /^#{1,2}[ \t]/.test(l));
    if (end < 0) end = lines.length;
    const blank = (l) => l === undefined || l.trim() === '';
    lines.splice(end, 0, ...(blank(lines[end - 1]) ? [] : ['']), '</details>', '');
    lines.splice(start, 1, '<details class="ck-metadata">', '<summary>Metadata</summary>', ...(blank(lines[start + 1]) ? [] : ['']));
    out = lines.join('\n');
  }
  return out;
}

// Markdown goes to content/, other servable files to content/public/. Files the viewer
// no longer sees (deleted, renamed, now excluded) are removed. Returns true if anything changed.
function mirrorDocs(docsDir, contentDir, generated) {
  const want = new Map();
  for (const rel of walk(docsDir)) {
    const kind = kindOf(rel);
    if (!kind) continue;
    want.set(kind === 'markdown' ? rel : `public/${rel}`, { src: path.join(docsDir, rel), markdown: kind === 'markdown' });
  }
  let changed = false;
  for (const [destRel, { src, markdown }] of want) {
    const dest = path.join(contentDir, ...destRel.split('/'));
    let st;
    try { st = fs.statSync(src); } catch { continue; }
    if (markdown) {
      let text;
      try { text = fs.readFileSync(src, 'utf8'); } catch { continue; }
      if (writeIfChanged(dest, transformMarkdown(text))) changed = true;
      continue;
    }
    let cur = null;
    try { cur = fs.statSync(dest); } catch { /* missing */ }
    if (cur && cur.size === st.size && Math.round(cur.mtimeMs) === Math.round(st.mtimeMs)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    fs.utimesSync(dest, st.atime, st.mtime);
    changed = true;
  }
  const keep = new Set([...want.keys(), ...generated]);
  for (const rel of walk(contentDir)) {
    if (keep.has(rel)) continue;
    fs.rmSync(path.join(contentDir, ...rel.split('/')), { force: true });
    changed = true;
  }
  pruneEmptyDirs(contentDir);
  return changed;
}

function pruneEmptyDirs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    pruneEmptyDirs(sub);
    if (fs.readdirSync(sub).length === 0) fs.rmdirSync(sub);
  }
}

// Rebuild index, pages and sidebar for the current docs/. Returns the index.
function refresh(root, site, base = '/') {
  const index = buildIndex(root);
  const contentDir = path.join(site, 'content');
  const pages = {
    'craft-kit/documents.md': documentsPage(index),
    'craft-kit/backlog.md': backlogPage(index),
    'craft-kit/artifacts.md': artifactsPage(index, base),
    'craft-kit/artifact.md': ARTIFACT_PAGE,
  };
  // A project's own docs/index.md wins over the generated overview.
  if (!index.docs.some((d) => d.path === 'index.md')) pages['index.md'] = overviewPage(index);
  mirrorDocs(path.join(root, 'docs'), contentDir, Object.keys(pages));
  for (const [rel, text] of Object.entries(pages)) writeIfChanged(path.join(contentDir, ...rel.split('/')), text.endsWith('\n') ? text : text + '\n');
  writeIfChanged(path.join(site, '.vitepress', 'generated.json'), JSON.stringify(siteData(index), null, 2) + '\n');
  writeIfChanged(path.join(site, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  return index;
}

// ─── Site folder and dependencies ─────────────────────────────────────────────

function viewerHome() {
  return path.join(process.env.CRAFT_KIT_HOME || path.join(os.homedir(), '.craft-kit'), 'viewer');
}

function siteDirFor(home, root) {
  const slug = path.basename(root).replace(/[^\w.-]+/g, '_') || 'project';
  const hash = crypto.createHash('sha1').update(root.toLowerCase()).digest('hex').slice(0, 8);
  return path.join(home, 'sites', `${slug}-${hash}`);
}

// The template is synced on every run, so a kit update reaches the viewer at once. Files are
// rewritten only when their content differs (a running dev server keeps its module graph),
// and files the kit no longer ships are removed.
function installTemplate(site) {
  const vp = path.join(site, '.vitepress');
  const files = ['config.mts', ...walk(path.join(TEMPLATE_DIR, 'theme')).map((f) => `theme/${f}`)];
  for (const rel of files) {
    writeIfChanged(path.join(vp, ...rel.split('/')), fs.readFileSync(path.join(TEMPLATE_DIR, ...rel.split('/')), 'utf8'));
  }
  const keep = new Set(files);
  for (const rel of walk(path.join(vp, 'theme'))) {
    if (!keep.has(`theme/${rel}`)) fs.rmSync(path.join(vp, 'theme', ...rel.split('/')), { force: true });
  }
}

const vitepressBin = (home) => path.join(home, 'node_modules', 'vitepress', 'bin', 'vitepress.js');

function ensureDeps(home) {
  const stampFile = path.join(home, '.deps-stamp');
  const stamp = JSON.stringify(DEPS);
  const bin = vitepressBin(home);
  let current = null;
  try { current = fs.readFileSync(stampFile, 'utf8'); } catch { /* first run */ }
  if (current === stamp && fs.existsSync(bin)) return;

  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, 'package.json'), JSON.stringify({ name: 'craft-kit-viewer', private: true, dependencies: DEPS }, null, 2) + '\n');
  console.log('Installing the docs viewer (VitePress) — first run only…');
  const r = spawnSync('npm install --no-audit --no-fund --loglevel=error', { cwd: home, stdio: 'inherit', shell: true });
  if (r.status !== 0 || !fs.existsSync(bin)) {
    throw new Error(`npm install failed in ${home}. Check your network, then run this command again.`);
  }
  fs.writeFileSync(stampFile, stamp);
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { root: '.', port: null, build: false, prepare: false, out: null, base: '/' };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--build') opts.build = true;
    else if (a === '--prepare') opts.prepare = true;
    else if (a === '--port') opts.port = args[++i];
    else if (a === '--out') opts.out = args[++i];
    else if (a === '--base') opts.base = args[++i];
    else if (a.startsWith('-')) throw new Error(`unknown flag ${a}`);
    else opts.root = a;
  }
  if (opts.port !== null && !/^\d+$/.test(String(opts.port))) throw new Error('--port needs a number');
  if (!/^\/(.*\/)?$/.test(opts.base)) throw new Error('--base must start and end with /');
  return opts;
}

function main(argv) {
  let opts;
  try { opts = parseArgs(argv); } catch (err) {
    console.error(`view-docs: ${err.message}\nUsage: node view-docs.js [project-root] [--port N] [--build] [--out DIR] [--base /path/] [--prepare]`);
    return 1;
  }
  const root = path.resolve(opts.root);
  const home = viewerHome();
  const site = siteDirFor(home, root);

  try {
    fs.mkdirSync(path.join(site, 'content'), { recursive: true });
    installTemplate(site);
    refresh(root, site, opts.base);
  } catch (err) {
    console.error(`view-docs: ${err.message}`);
    return 1;
  }
  if (opts.prepare) {
    console.log(site);
    return 0;
  }

  try { ensureDeps(home); } catch (err) {
    console.error(`view-docs: ${err.message}`);
    return 1;
  }

  const env = { ...process.env, CRAFT_KIT_VIEWER_BASE: opts.base };
  const cli = [vitepressBin(home)];

  if (opts.build) {
    const r = spawnSync(process.execPath, [...cli, 'build', site], { stdio: 'inherit', env });
    if (r.status !== 0) {
      console.error('view-docs: build failed');
      return 1;
    }
    const dist = path.join(site, '.vitepress', 'dist');
    const out = opts.out ? path.resolve(opts.out) : dist;
    if (opts.out) {
      fs.rmSync(out, { recursive: true, force: true });
      fs.cpSync(dist, out, { recursive: true });
    }
    console.log(`Static site: ${out}`);
    return 0;
  }

  const child = spawn(process.execPath, [...cli, 'dev', site, ...(opts.port ? ['--port', opts.port] : [])], { stdio: 'inherit', env });
  let sig = signature(root);
  const timer = setInterval(() => {
    try {
      const next = signature(root);
      if (next !== sig) {
        sig = next;
        refresh(root, site, opts.base);
      }
    } catch (err) {
      // docs/ briefly missing or half-written: keep serving the last good copy.
      console.error(`view-docs: refresh skipped (${err.message})`);
    }
  }, POLL_MS);
  const stop = () => { clearInterval(timer); child.kill(); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  child.on('exit', (code) => { clearInterval(timer); process.exitCode = code || 0; });
  return null;
}

if (require.main === module) {
  const code = main(process.argv);
  if (code !== null) process.exitCode = code;
}

module.exports = { refresh, mirrorDocs, transformMarkdown, siteDirFor, overviewPage, documentsPage, backlogPage, artifactsPage, siteData, parseArgs };
