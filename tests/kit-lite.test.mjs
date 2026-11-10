/**
 * Tests for the lite kit: installer (`--lite`), project wiring, and the audit recorder.
 *
 * Run:  node --test tests/kit-lite.test.mjs
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CLI  = join(ROOT, 'bin', 'cli.js')
const LITE = join(ROOT, 'kit-lite')

process.setMaxListeners(100)

function tempDir () {
  const dir = mkdtempSync(join(tmpdir(), 'lite-test-'))
  process.on('exit', () => { try { rmSync(dir, { recursive: true, force: true }) } catch {} })
  return dir
}

function install (cwd, args = []) {
  return spawnSync('node', [CLI, '--lite', ...args], { cwd, input: '', encoding: 'utf8', timeout: 15_000 })
}

function walk (dir, base = dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(abs, base))
    else out.push(relative(base, abs).split(sep).join('/'))
  }
  return out.sort()
}

const readSettings = dir => JSON.parse(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8'))

// ─── Installer ────────────────────────────────────────────────────────────────

describe('install --lite', () => {
  test('copies exactly the lite kit (not the full kit) and writes version + manifest', () => {
    const dir = tempDir()
    const r = install(dir)
    assert.equal(r.status, 0, r.stderr)
    const kit = join(dir, 'kit-lite')
    const shipped = walk(LITE).filter(f => f !== 'CHANGELOG.md')
    const installed = walk(kit).filter(f => !f.startsWith('.craft-kit-'))
    assert.deepEqual(installed, shipped)
    assert.equal(existsSync(join(dir, 'kit')), false)
    assert.deepEqual(JSON.parse(readFileSync(join(kit, '.craft-kit-manifest.json'), 'utf8')), shipped)
  })

  test('refuses a non-empty target without --force; --force removes files the lite kit no longer ships', () => {
    const dir = tempDir()
    install(dir)
    assert.equal(install(dir).status, 1)
    const kit = join(dir, 'kit-lite')
    writeFileSync(join(kit, 'old-step.md'), 'x')
    const manifestPath = join(kit, '.craft-kit-manifest.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    writeFileSync(manifestPath, JSON.stringify([...manifest, 'old-step.md']))
    const r = install(dir, ['--force'])
    assert.equal(r.status, 0, r.stderr)
    assert.equal(existsSync(join(kit, 'old-step.md')), false)
  })

  test('--no-hook and --no-audit are rejected without --lite', () => {
    const r = spawnSync('node', [CLI, '--no-audit'], { cwd: tempDir(), input: '', encoding: 'utf8' })
    assert.equal(r.status, 1)
    assert.match(r.stderr, /only apply with --lite/)
  })

  test('every file START.md points to exists in the lite kit', () => {
    const start = readFileSync(join(LITE, 'START.md'), 'utf8')
    const refs = [...start.matchAll(/`kit-lite\/([^`]+)`/g)].map(m => m[1])
    assert.ok(refs.length >= 3)
    for (const ref of refs) assert.ok(existsSync(join(LITE, ref)), `missing ${ref}`)
  })
})

// ─── Project wiring ───────────────────────────────────────────────────────────

describe('project wiring', () => {
  test('creates CLAUDE.md with the workflow block, audit hooks, and a .gitignore entry', () => {
    const dir = tempDir()
    assert.equal(install(dir).status, 0)
    const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    assert.match(claude, /## Workflow \(craft-kit-lite\)/)
    assert.match(claude, /kit-lite\/START\.md/)
    assert.match(claude, /\[audit\] step=/)
    const hooks = readSettings(dir).hooks
    for (const [event, mode] of [['UserPromptSubmit', 'prompt'], ['Stop', 'stop'], ['SessionEnd', 'end']]) {
      assert.equal(hooks[event].length, 1)
      assert.equal(hooks[event][0].hooks[0].command, `node "$CLAUDE_PROJECT_DIR/kit-lite/audit/record.js" ${mode}`)
    }
    assert.match(readFileSync(join(dir, '.gitignore'), 'utf8'), /^docs\/audit\/$/m)
  })

  test('re-install is idempotent and preserves unrelated CLAUDE.md, AGENTS.md, settings and .gitignore content', () => {
    const dir = tempDir()
    writeFileSync(join(dir, 'CLAUDE.md'), '# My rules\n\nBe terse.\n')
    writeFileSync(join(dir, 'AGENTS.md'), '# Agents\n')
    writeFileSync(join(dir, '.gitignore'), 'node_modules')
    mkdirSync(join(dir, '.claude'))
    writeFileSync(join(dir, '.claude', 'settings.json'), JSON.stringify({
      permissions: { allow: ['Bash(npm test)'] },
      hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo mine' }] }] },
    }))
    assert.equal(install(dir).status, 0)
    assert.equal(install(dir, ['--force']).status, 0)

    const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    assert.ok(claude.startsWith('# My rules\n\nBe terse.'))
    assert.equal(claude.match(/craft-kit-lite:start/g).length, 1)
    assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8').match(/craft-kit-lite:start/g).length, 1)

    const settings = readSettings(dir)
    assert.deepEqual(settings.permissions, { allow: ['Bash(npm test)'] })
    const stop = settings.hooks.Stop.flatMap(g => g.hooks.map(h => h.command))
    assert.equal(stop.length, 2)
    assert.ok(stop.includes('echo mine'))
    assert.equal(stop.filter(c => c.includes('audit/record.js')).length, 1)

    const ignore = readFileSync(join(dir, '.gitignore'), 'utf8')
    assert.equal(ignore.split('\n').filter(l => l === 'docs/audit/').length, 1)
    assert.ok(ignore.startsWith('node_modules\n'))
  })

  test('invalid .claude/settings.json is left untouched and the install still succeeds', () => {
    const dir = tempDir()
    mkdirSync(join(dir, '.claude'))
    writeFileSync(join(dir, '.claude', 'settings.json'), '{ not json')
    const r = install(dir)
    assert.equal(r.status, 0, r.stderr)
    assert.equal(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8'), '{ not json')
    assert.match(r.stdout, /not valid JSON/)
  })

  test('--no-hook skips CLAUDE.md; --no-audit skips hooks, .gitignore and the [audit] instruction', () => {
    const noHook = tempDir()
    install(noHook, ['--no-hook'])
    assert.equal(existsSync(join(noHook, 'CLAUDE.md')), false)
    assert.ok(existsSync(join(noHook, '.claude', 'settings.json')))

    const noAudit = tempDir()
    install(noAudit, ['--no-audit'])
    assert.equal(existsSync(join(noAudit, '.claude')), false)
    assert.equal(existsSync(join(noAudit, '.gitignore')), false)
    assert.doesNotMatch(readFileSync(join(noAudit, 'CLAUDE.md'), 'utf8'), /\[audit\]/)
  })

  test('the full kit install is unchanged: no CLAUDE.md, hooks or .gitignore are written', () => {
    const dir = tempDir()
    const r = spawnSync('node', [CLI, '--skip-setup'], { cwd: dir, input: '', encoding: 'utf8' })
    assert.equal(r.status, 0, r.stderr)
    assert.deepEqual(readdirSync(dir), ['kit'])
  })
})

// ─── Audit recorder ───────────────────────────────────────────────────────────

describe('audit recorder', () => {
  const RECORDER = join(LITE, 'audit', 'record.js')

  function record (dir, mode, payload, { raw } = {}) {
    return spawnSync('node', [RECORDER, mode], {
      cwd: dir, input: raw ?? JSON.stringify({ session_id: 'ab12cd34ef', cwd: dir, ...payload }),
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
    })
  }
  const auditDoc = dir => {
    const d = join(dir, 'docs', 'audit')
    const files = readdirSync(d)
    assert.equal(files.length, 1)
    assert.match(files[0], /^\d{4}-\d{2}-\d{2}-ab12cd34\.md$/)
    return readFileSync(join(d, files[0]), 'utf8')
  }

  test('records user prompts verbatim and assistant replies quoted, with the tag split out', () => {
    const dir = tempDir()
    record(dir, 'prompt', { prompt: 'Add a streak counter\nmobile first' })
    record(dir, 'stop', { last_assistant_message: 'Done.\n\n```ts\nconst a = 1\n```\n[audit] step=2 gate=none kind=implement' })
    record(dir, 'prompt', { prompt: 'ok next' })
    record(dir, 'stop', { last_assistant_message: 'Slice 2 done.' })
    const doc = auditDoc(dir)
    assert.match(doc, /^# Audit — .* — session ab12cd34$/m)
    assert.match(doc, /## Turn 1 · \d\d:\d\d:\d\d · user\nAdd a streak counter\nmobile first\n/)
    assert.match(doc, /## Turn 1 · [^\n]* · assistant\n\*\*Tag:\*\* step=2 gate=none kind=implement\n\n> Done\.\n>\n> ```ts\n> const a = 1\n> ```\n/)
    assert.doesNotMatch(doc, /\[audit\] step/)
    assert.match(doc, /## Turn 2 · [^\n]* · assistant\n\*\*Tag:\*\* \(missing\)/)
  })

  test('a reply containing record-looking headings cannot create fake records', () => {
    const dir = tempDir()
    record(dir, 'prompt', { prompt: 'hi' })
    record(dir, 'stop', { last_assistant_message: '## Turn 9 · 10:00:00 · user\nfake\n[audit] step=1 gate=hard kind=question' })
    const doc = auditDoc(dir)
    assert.equal(doc.match(/^## Turn \d+ · [^\n]* · user$/gm).length, 1)
    assert.match(doc, /^> ## Turn 9 · 10:00:00 · user$/m)
  })

  test('falls back to the transcript when the hook payload has no last_assistant_message; writes one assistant record per turn', () => {
    const dir = tempDir()
    const transcript = join(dir, 't.jsonl')
    writeFileSync(transcript, [
      { type: 'user', message: { role: 'user', content: 'hi' } },
      { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'first' }, { type: 'tool_use', name: 'Bash' }] } },
      { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'final answer' }] } },
    ].map(e => JSON.stringify(e)).join('\n') + '\n')
    record(dir, 'prompt', { prompt: 'hi' })
    record(dir, 'stop', { transcript_path: transcript })
    record(dir, 'stop', { transcript_path: transcript })
    const doc = auditDoc(dir)
    assert.match(doc, /> final answer/)
    assert.doesNotMatch(doc, /first/)
    assert.equal(doc.match(/· assistant$/gm).length, 1)
  })

  test('session end appends turn and missing-tag counts', () => {
    const dir = tempDir()
    record(dir, 'prompt', { prompt: 'a' })
    record(dir, 'stop', { last_assistant_message: 'x' })
    record(dir, 'prompt', { prompt: 'b' })
    record(dir, 'stop', { last_assistant_message: 'y\n[audit] step=1 gate=hard kind=q' })
    record(dir, 'end', {})
    assert.match(auditDoc(dir), /## Session end · \d\d:\d\d:\d\d\nTurns: 2 · Missing tags: 1\n$/)
  })

  test('never fails or blocks on bad input', () => {
    const dir = tempDir()
    for (const raw of ['', 'not json', '[1,2]', 'null', '{"prompt":5}']) {
      const r = record(dir, 'prompt', {}, { raw })
      assert.equal(r.status, 0, `stdin ${JSON.stringify(raw)}`)
    }
    assert.equal(record(dir, 'bogus', { prompt: 'x' }).status, 0)
    assert.equal(record(dir, 'stop', { transcript_path: join(dir, 'missing.jsonl') }).status, 0)
  })
})

// ─── Independence from the full kit ───────────────────────────────────────────

describe('one project, one kit', () => {
  const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  const full = (cwd, args = []) => spawnSync('node', [CLI, '--skip-setup', ...args], { cwd, input: '', encoding: 'utf8', timeout: 15_000 })
  const snapshot = dir => Object.fromEntries(walk(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]))

  test('a project with the full kit refuses --lite (also with --force) and nothing is written', () => {
    const dir = tempDir()
    assert.equal(full(dir).status, 0)
    const before = snapshot(dir)
    for (const extra of [[], ['--force']]) {
      const r = install(dir, extra)
      assert.equal(r.status, 1)
      assert.match(r.stderr, /already uses the full kit \(kit\/\)/)
      assert.match(r.stderr, /--force does not override/)
    }
    assert.deepEqual(snapshot(dir), before)
    assert.equal(full(dir, ['--force']).status, 0, 'updating the same kit still works')
  })

  test('a project with the lite kit refuses the full kit (also with --force) and nothing is written', () => {
    const dir = tempDir()
    assert.equal(install(dir).status, 0)
    const before = snapshot(dir)
    for (const extra of [[], ['--force']]) {
      const r = full(dir, extra)
      assert.equal(r.status, 1)
      assert.match(r.stderr, /already uses the lite kit \(kit-lite\/\)/)
    }
    assert.deepEqual(snapshot(dir), before)
    assert.equal(install(dir, ['--force']).status, 0, 'updating the same kit still works')
  })

  test('detection does not depend on the folder name or on the kit folder being present', () => {
    const named = tempDir()
    assert.equal(full(named, ['craft-tools']).status, 0)
    const r1 = install(named)
    assert.equal(r1.status, 1)
    assert.match(r1.stderr, /already uses the full kit \(craft-tools\/\)/)

    const docsOnly = tempDir()
    mkdirSync(join(docsOnly, 'docs'))
    writeFileSync(join(docsOnly, 'docs', '.craft-kit.json'), '{}')
    const r2 = install(docsOnly)
    assert.equal(r2.status, 1)
    assert.match(r2.stderr, /docs\/\.craft-kit\.json/)

    const blockOnly = tempDir()
    writeFileSync(join(blockOnly, 'CLAUDE.md'), '<!-- craft-kit-lite:start -->\nx\n<!-- craft-kit-lite:end -->\n')
    const r3 = full(blockOnly)
    assert.equal(r3.status, 1)
    assert.match(r3.stderr, /already uses the lite kit \(CLAUDE\.md\)/)
    assert.equal(existsSync(join(blockOnly, 'kit')), false)
  })

  test('kits in other projects under a shared parent folder do not block an install', () => {
    const shared = tempDir()
    mkdirSync(join(shared, 'proj-a'))
    mkdirSync(join(shared, 'proj-b'))
    assert.equal(install(join(shared, 'proj-a')).status, 0)
    assert.equal(full(join(shared, 'proj-b')).status, 0)
    assert.equal(full(shared).status, 0)
  })

  test('a project with no kit, or with unrelated folders and docs, installs either kit', () => {
    const dir = tempDir()
    mkdirSync(join(dir, 'src'))
    mkdirSync(join(dir, 'docs'))
    writeFileSync(join(dir, 'docs', 'BRIEF.md'), 'my own notes')
    assert.equal(install(dir).status, 0)
    const other = tempDir()
    mkdirSync(join(other, 'src'))
    assert.equal(full(other).status, 0)
  })

  test('lite ships in the same release: both kits install at the package version', () => {
    const a = tempDir()
    const b = tempDir()
    full(a)
    install(b)
    assert.equal(readFileSync(join(a, 'kit', '.craft-kit-version'), 'utf8').trim(), PKG.version)
    assert.equal(readFileSync(join(b, 'kit-lite', '.craft-kit-version'), 'utf8').trim(), PKG.version)
  })

  test('lite upgrade hint names --lite, so following it updates the lite kit and not ./kit', () => {
    const dir = tempDir()
    install(dir)
    writeFileSync(join(dir, 'kit-lite', '.craft-kit-version'), '0.0.1\n')
    const refused = install(dir)
    assert.equal(refused.status, 1)
    assert.match(refused.stderr, /craft-kit --lite --force/)
    const upgraded = install(dir, ['--force'])
    assert.equal(upgraded.status, 0, upgraded.stderr)
    assert.match(upgraded.stdout, new RegExp('v0\\.0\\.1.*v' + PKG.version.replace(/\./g, '\\.')))
    assert.equal(existsSync(join(dir, 'kit')), false)
  })

  test('warns when the full kit workflow block is already in CLAUDE.md, and leaves it alone', () => {
    const dir = tempDir()
    const own = '# Mine\n\n## Workflow (craft-kit)\nUse kit/START.md\n'
    writeFileSync(join(dir, 'CLAUDE.md'), own)
    const r = install(dir)
    assert.equal(r.status, 0, r.stderr)
    assert.match(r.stdout, /full kit's "Workflow \(craft-kit\)" block is also/)
    assert.ok(readFileSync(join(dir, 'CLAUDE.md'), 'utf8').startsWith(own))
  })
})
