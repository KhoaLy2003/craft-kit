/**
 * Tests for the docs viewer: kit/scripts/docs-index.js and kit/scripts/view-docs.js.
 *
 * No network: every run uses --prepare (mirror and generate, no VitePress install).
 * The real build is covered by the opt-in test at the bottom
 * (CRAFT_KIT_VIEWER_BUILD=1; installs VitePress from npm).
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtempSync, writeFileSync, readFileSync, cpSync,
  rmSync, existsSync, readdirSync, statSync,
} from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const ROOT    = join(dirname(fileURLToPath(import.meta.url)), '..')
const CLI     = join(ROOT, 'bin', 'cli.js')
const FIXTURE = join(ROOT, 'tests', 'fixtures', 'viewer')
const PKG     = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

function tempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'ck-viewer-'))
  process.on('exit', () => { try { rmSync(dir, { recursive: true, force: true }) } catch {} })
  return dir
}

/** A project folder holding the fixture docs plus files that must never be served. */
function project() {
  const dir = tempDir()
  cpSync(join(FIXTURE, 'docs'), join(dir, 'docs'), { recursive: true })
  writeFileSync(join(dir, 'docs', '.env'), 'SECRET=1\n')
  return dir
}

function node(args, env = {}) {
  return spawnSync('node', args, { encoding: 'utf8', timeout: 30_000, env: { ...process.env, ...env } })
}

function indexOf(root) {
  const res = node([join(ROOT, 'kit', 'scripts', 'docs-index.js'), root])
  assert.equal(res.status, 0, res.stderr)
  return JSON.parse(res.stdout)
}

/** Run the viewer's --prepare step; returns the generated site folder. */
function prepare(scriptsDir, root, home) {
  const res = node([join(scriptsDir, 'view-docs.js'), root, '--prepare'], { CRAFT_KIT_HOME: home })
  assert.equal(res.status, 0, res.stderr)
  return res.stdout.trim().split(/\r?\n/).pop()
}

function listFiles(dir, base = dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) listFiles(full, base, out)
    else out.push(relative(base, full).split(/[\\/]/).join('/'))
  }
  return out.sort()
}

function treeHash(dir) {
  const h = createHash('sha1')
  for (const f of listFiles(dir)) h.update(f).update(readFileSync(join(dir, f)))
  return h.digest('hex')
}

describe('docs-index', () => {
  test('reads status headers in both formats, titles, groups and Based on', () => {
    const idx = indexOf(project())
    const by = (p) => idx.docs.find((d) => d.path === p)
    assert.equal(by('idea-brief.md').status, 'approved')
    assert.equal(by('idea-brief.md').title, 'Idea Brief — Todo App')
    assert.equal(by('roadmap.md').status, 'draft')          // "- **Status**: draft" form
    assert.deepEqual(by('roadmap.md').based_on, ['idea-brief.md', 'prototype/journey-map.md', 'missing-doc.md'])
    assert.equal(by('specs/login/spec.md').group, 'Specs')
    assert.equal(by('phase-1-session.md').status, null)      // old document without a header
    assert.equal(by('phase-1-session.md').group, 'Session logs')
    assert.equal(idx.schema, 1)
  })

  test('never lists credentials, dotfiles or JSON as servable content', () => {
    const idx = indexOf(project())
    const all = [...idx.docs.map((d) => d.path), ...idx.artifacts.map((a) => a.path)]
    assert.ok(!all.some((p) => /\.env|test-accounts|\.json$/.test(p)), all.join(', '))
    assert.deepEqual(idx.artifacts.map((a) => a.path).sort(), ['diagrams/architecture-system.html', 'preview/index.html'])
  })

  test('summarises backlog.json and survives a half-written one', () => {
    const root = project()
    assert.equal(indexOf(root).backlog.features.length, 2)
    assert.equal(indexOf(root).backlog.features[0].shipped_at, '2026-11-05')

    writeFileSync(join(root, 'docs', 'backlog.json'), '{ "features": [')
    const idx = indexOf(root)
    assert.equal(idx.backlog, null)
    assert.match(idx.backlog_error, /not valid JSON/)
  })

  test('exits 1 with a message when docs/ is missing', () => {
    const res = node([join(ROOT, 'kit', 'scripts', 'docs-index.js'), tempDir()])
    assert.equal(res.status, 1)
    assert.match(res.stderr, /docs folder not found/)
  })

  test('--out writes the index to a file and nothing to stdout', () => {
    const root = project()
    const out = join(tempDir(), 'index.json')
    const res = node([join(ROOT, 'kit', 'scripts', 'docs-index.js'), root, '--out', out])
    assert.equal(res.status, 0, res.stderr)
    assert.equal(res.stdout, '')
    assert.equal(JSON.parse(readFileSync(out, 'utf8')).docs.length, 11)
  })
})

describe('docs-index: titles, groups and generated files', () => {
  test('a heading that is only a file name falls back to a readable title', () => {
    const idx = indexOf(project())
    const by = (p) => idx.docs.find((d) => d.path === p)
    assert.equal(by('prototype/journey-map.md').title, 'Journey map')
  })

  test('machine-written test-run output is flagged, everything else is not', () => {
    const idx = indexOf(project())
    assert.deepEqual(idx.docs.filter((d) => d.generated).map((d) => d.path), ['e2e-runs/run-1/auth-report/data/abc123.md'])
  })

  test('archive and prototype documents get their own groups', () => {
    const idx = indexOf(project())
    assert.equal(idx.docs.find((d) => d.path === 'archive/phase-2-session/login.md').group, 'Archive')
    assert.equal(idx.docs.find((d) => d.path === 'prototype/journey-map.md').group, 'Design')
  })
})

describe('view-docs --prepare', () => {
  const scripts = join(ROOT, 'kit', 'scripts')

  test('mirrors markdown and static assets, withholds secrets and JSON', () => {
    const root = project()
    const site = prepare(scripts, root, tempDir())
    const files = listFiles(join(site, 'content'))
    assert.ok(files.includes('specs/login/spec.md'))
    assert.ok(files.includes('public/preview/index.html'))
    assert.ok(files.includes('public/diagrams/architecture-system.html'))
    assert.ok(!files.some((f) => /\.env|test-accounts|backlog\.json/.test(f)), files.join(', '))
  })

  test('never writes into the project', () => {
    const root = project()
    const before = treeHash(root)
    prepare(scripts, root, tempDir())
    assert.equal(treeHash(root), before)
  })

  test('generates overview, documents, backlog and artifacts pages', () => {
    const site = prepare(scripts, project(), tempDir())
    const page = (p) => readFileSync(join(site, 'content', p), 'utf8')
    assert.match(page('index.md'), /# Todo App/)
    assert.match(page('index.md'), /\| \[Roadmap\]\(\/roadmap\.md\) \| draft \| 2026‑11‑02 \|/)   // non-breaking hyphens in dates
    assert.match(page('index.md'), /plus 1 generated test-run file\(s\)/)
    assert.doesNotMatch(page('index.md'), /abc123/)                                           // generated output stays out of lists
    assert.doesNotMatch(page('craft-kit/documents.md'), /abc123/)
    assert.match(page('craft-kit/documents.md'), /missing-doc\.md/)                            // unknown Based on stays visible as text
    assert.match(page('craft-kit/documents.md'), /\[prototype\/journey-map\.md\]\(\/prototype\/journey-map\.md\)/) // Based on resolves subfolder docs
    assert.match(page('craft-kit/backlog.md'), /\| F2 \| Add \\\| todo \| Must \| S \| F1 \| — \|/) // pipe escaped
    assert.match(page('craft-kit/artifacts.md'), /href="\/craft-kit\/artifact\.html#\/preview\/index\.html" target="_self"/)
    assert.match(page('craft-kit/artifacts.md'), /<iframe src="\/preview\/index\.html"/)
    assert.match(page('craft-kit/artifact.md'), /ckArtifact: true/)
    const sidebar = JSON.parse(readFileSync(join(site, '.vitepress', 'generated.json'), 'utf8')).sidebar
    assert.deepEqual(sidebar.map((g) => g.text), ['Project', 'Discovery', 'Design', 'Planning', 'Architecture', 'Specs', 'Session logs', 'Archive'])
  })

  test('the sidebar nests Specs by feature, named from the backlog, with screens grouped', () => {
    const site = prepare(scripts, project(), tempDir())
    const sidebar = JSON.parse(readFileSync(join(site, '.vitepress', 'generated.json'), 'utf8')).sidebar
    const specs = sidebar.find((g) => g.text === 'Specs')
    assert.equal(specs.items.length, 1)
    const feature = specs.items[0]
    assert.equal(feature.text, 'F1 Login')
    assert.deepEqual(feature.items.filter((i) => i.link).map((i) => i.text), ['Plan', 'Spec'])
    const screens = feature.items.find((i) => i.items)
    assert.equal(screens.text, 'Screens')
    assert.deepEqual(screens.items.map((i) => [i.text, i.link]), [['Sign In', '/specs/login/screens/sign-in']])
  })

  test('sidebar titles do not repeat: same-title documents are named from their file', () => {
    const site = prepare(scripts, project(), tempDir())
    const sidebar = JSON.parse(readFileSync(join(site, '.vitepress', 'generated.json'), 'utf8')).sidebar
    const texts = (g) => sidebar.find((x) => x.text === g).items.flatMap((i) => (i.items ? i.items.map((c) => c.text) : [i.text]))
    assert.deepEqual(texts('Archive'), ['F1 Login'])   // folder level "Phase 2 session" holds the feature-named leaf
    assert.ok(texts('Session logs').includes('Phase 2 session'))
  })

  test('the mirrored copy gets a readable first heading and a folded Metadata section; docs/ stays as written', () => {
    const root = project()
    const site = prepare(scripts, root, tempDir())
    const copy = readFileSync(join(site, 'content', 'prototype', 'journey-map.md'), 'utf8')
    assert.match(copy, /^# Journey map$/m)
    assert.match(copy, /<details class="ck-metadata">\n<summary>Metadata<\/summary>\n\n- \*\*Status\*\*/)
    assert.match(copy, /\n<\/details>\n\n## 1\. Persona/)
    assert.match(readFileSync(join(root, 'docs', 'prototype', 'journey-map.md'), 'utf8'), /^# journey-map\.md$/m)
  })

  test('a second run follows docs/: new files appear, deleted and renamed ones go', () => {
    const root = project()
    const home = tempDir()
    const site = prepare(scripts, root, home)
    writeFileSync(join(root, 'docs', 'constitution.md'), '# Constitution\n\n**Status:** approved\n**Last updated:** 2026-11-06\n**Based on:** `idea-brief.md`\n')
    rmSync(join(root, 'docs', 'phase-1-session.md'))
    rmSync(join(root, 'docs', 'preview'), { recursive: true })
    assert.equal(prepare(scripts, root, home), site)

    const files = listFiles(join(site, 'content'))
    assert.ok(files.includes('constitution.md'))
    assert.ok(!files.includes('phase-1-session.md'))
    assert.ok(!files.includes('public/preview/index.html'))
    assert.ok(!existsSync(join(site, 'content', 'public', 'preview')), 'emptied directory is pruned')
    assert.match(readFileSync(join(site, 'content', 'index.md'), 'utf8'), /Constitution/)
  })

  test("the project's own docs/index.md wins over the generated overview", () => {
    const root = project()
    writeFileSync(join(root, 'docs', 'index.md'), '# My own home\n')
    const site = prepare(scripts, root, tempDir())
    assert.equal(readFileSync(join(site, 'content', 'index.md'), 'utf8'), '# My own home\n')
  })

  test('two projects with the same folder name get separate sites', () => {
    const home = tempDir()
    const a = prepare(scripts, project(), home)
    const b = prepare(scripts, project(), home)
    assert.notEqual(a, b)
  })

  test('fails with exit 1 and a message when docs/ is missing', () => {
    const res = node([join(scripts, 'view-docs.js'), tempDir(), '--prepare'], { CRAFT_KIT_HOME: tempDir() })
    assert.equal(res.status, 1)
    assert.match(res.stderr, /docs folder not found/)
  })

  test('rejects unknown flags and a malformed --base', () => {
    const bad = node([join(scripts, 'view-docs.js'), '--nope'])
    assert.equal(bad.status, 1)
    assert.match(bad.stderr, /unknown flag/)
    const base = node([join(scripts, 'view-docs.js'), '--base', 'no-slashes'])
    assert.equal(base.status, 1)
    assert.match(base.stderr, /--base/)
  })
})

describe('update path: install a newer kit over an older one, then use the viewer', () => {
  /** A project with an installed kit that looks like an older release. */
  function oldInstall() {
    const root = project()
    const kit = join(root, 'kit')
    const res = spawnSync('node', [CLI, kit, '--skip-setup'], { input: '', encoding: 'utf8', timeout: 15_000 })
    assert.equal(res.status, 0, res.stderr)

    const manifestFile = join(kit, '.craft-kit-manifest.json')
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
    const isViewer = (f) => f.startsWith('viewer/') || f === 'scripts/docs-index.js' || f === 'scripts/view-docs.js'
    for (const f of manifest.filter(isViewer)) rmSync(join(kit, ...f.split('/')), { force: true })
    rmSync(join(kit, 'viewer'), { recursive: true, force: true })
    writeFileSync(join(kit, 'scripts', 'retired.js'), '// shipped by the old kit only\n')
    writeFileSync(join(kit, 'my-notes.md'), 'user file\n')
    writeFileSync(manifestFile, JSON.stringify([...manifest.filter((f) => !isViewer(f)), 'scripts/retired.js'], null, 2))
    writeFileSync(join(kit, '.craft-kit-version'), '0.0.1\n')
    return { root, kit }
  }

  test('--force adds the viewer, drops retired files, keeps user files and records the new version', () => {
    const { kit } = oldInstall()
    assert.ok(!existsSync(join(kit, 'scripts', 'view-docs.js')))

    const res = spawnSync('node', [CLI, kit, '--skip-setup', '--force'], { input: '', encoding: 'utf8', timeout: 15_000 })
    assert.equal(res.status, 0, res.stderr)
    assert.match(res.stdout, /Kit upgraded/)
    assert.match(res.stdout, new RegExp(`v0\\.0\\.1.*v${PKG.version.replace(/\./g, '\\.')}`))
    assert.match(res.stdout, /Browse project docs/)

    for (const f of ['scripts/view-docs.js', 'scripts/docs-index.js', 'viewer/config.mts', 'viewer/theme/index.ts', 'viewer/theme/Layout.vue', 'viewer/theme/Mermaid.vue']) {
      assert.ok(existsSync(join(kit, ...f.split('/'))), `${f} installed`)
    }
    assert.ok(!existsSync(join(kit, 'scripts', 'retired.js')), 'retired file removed')
    assert.ok(existsSync(join(kit, 'my-notes.md')), 'user file kept')
    assert.equal(readFileSync(join(kit, '.craft-kit-version'), 'utf8').trim(), PKG.version)
    const manifest = JSON.parse(readFileSync(join(kit, '.craft-kit-manifest.json'), 'utf8'))
    assert.ok(manifest.includes('viewer/config.mts') && manifest.includes('scripts/view-docs.js'))
    assert.ok(!manifest.includes('scripts/retired.js'))
  })

  test('the viewer runs from the installed copy against pre-existing docs, without touching them', () => {
    const { root, kit } = oldInstall()
    spawnSync('node', [CLI, kit, '--skip-setup', '--force'], { input: '', encoding: 'utf8', timeout: 15_000 })

    const docsBefore = treeHash(join(root, 'docs'))
    const site = prepare(join(kit, 'scripts'), root, tempDir())
    assert.equal(treeHash(join(root, 'docs')), docsBefore)
    assert.ok(existsSync(join(site, '.vitepress', 'config.mts')))
    assert.ok(existsSync(join(site, '.vitepress', 'theme', 'Mermaid.vue')))
    assert.match(readFileSync(join(site, 'content', 'index.md'), 'utf8'), /Idea Brief/)
  })

  test('re-running after a kit update refreshes the theme in an existing site', () => {
    const { root, kit } = oldInstall()
    spawnSync('node', [CLI, kit, '--skip-setup', '--force'], { input: '', encoding: 'utf8', timeout: 15_000 })
    const home = tempDir()
    const site = prepare(join(kit, 'scripts'), root, home)

    // The previous kit left a stale theme file and an outdated config in the site folder.
    writeFileSync(join(site, '.vitepress', 'theme', 'Layout.vue'), '<template>old</template>')
    writeFileSync(join(site, '.vitepress', 'theme', 'removed-in-new-kit.vue'), 'old')
    writeFileSync(join(site, '.vitepress', 'config.mts'), '// old config')

    prepare(join(kit, 'scripts'), root, home)
    assert.equal(readFileSync(join(site, '.vitepress', 'theme', 'Layout.vue'), 'utf8'), readFileSync(join(ROOT, 'kit', 'viewer', 'theme', 'Layout.vue'), 'utf8'))
    assert.equal(readFileSync(join(site, '.vitepress', 'config.mts'), 'utf8'), readFileSync(join(ROOT, 'kit', 'viewer', 'config.mts'), 'utf8'))
    assert.ok(!existsSync(join(site, '.vitepress', 'theme', 'removed-in-new-kit.vue')))
  })
})

// Opt-in: installs VitePress and builds the site. Set CRAFT_KIT_VIEWER_BUILD=1.
describe('real build', { skip: process.env.CRAFT_KIT_VIEWER_BUILD !== '1' }, () => {
  test('builds the fixture project to static HTML with status badges and a Mermaid component', () => {
    const root = project()
    const out = join(tempDir(), 'site')
    const res = spawnSync('node', [join(ROOT, 'kit', 'scripts', 'view-docs.js'), root, '--build', '--out', out], {
      encoding: 'utf8', timeout: 600_000, env: { ...process.env, CRAFT_KIT_HOME: tempDir() },
    })
    assert.equal(res.status, 0, res.stdout + res.stderr)
    const html = (p) => readFileSync(join(out, p), 'utf8')
    assert.match(html('idea-brief.html'), /class="[^"]*\bck-badge\b[^"]*"[^>]*>approved</)
    assert.match(html('idea-brief.html'), /&lt;feature-slug&gt;/)
    assert.match(html('architecture.html'), /ck-mermaid/)
    assert.match(html('prototype/journey-map.html'), /<details class="ck-metadata">/)
    assert.match(html('prototype/journey-map.html'), /<h1[^>]*>Journey map/)
    assert.ok(statSync(join(out, 'preview', 'index.html')).isFile())
    assert.ok(!existsSync(join(out, 'test-accounts.json')))
  })
})
