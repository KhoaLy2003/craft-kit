/**
 * Tests for bin/cli.js
 *
 * Run:  node --test tests/cli.test.mjs
 *
 * Strategy: spawn the CLI as a subprocess via spawnSync. Passing `input: ''`
 * gives the child a piped (non-TTY) stdin, which selects the non-interactive
 * path — all instructions printed, no prompts, no network.
 *
 * The last block is a repo-wide link check over kit/ markdown, not a CLI test.
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync,
  rmSync, existsSync, readdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, basename, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CLI  = join(ROOT, 'bin', 'cli.js')
const KIT  = join(ROOT, 'kit')
const PKG  = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

const META_FILES = ['.craft-kit-version', '.craft-kit-manifest.json']

process.setMaxListeners(100) // one 'exit' cleanup handler per tempDir()

// ─── Helpers ──────────────────────────────────────────────────────────────────

function run(args = [], { cwd = tmpdir() } = {}) {
  return spawnSync('node', [CLI, ...args], {
    cwd,
    input: '',        // piped stdin → isTTY === false → non-interactive path
    encoding: 'utf8',
    timeout: 15_000,
  })
}

function tempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'pdk-test-'))
  process.on('exit', () => {
    try { rmSync(dir, { recursive: true, force: true }) } catch {}
  })
  return dir
}

/** Install into a fresh temp location and return the target path. */
function install(...flags) {
  const target = join(tempDir(), 'kit')
  const res = run([target, '--skip-setup', ...flags])
  assert.equal(res.status, 0, res.stderr)
  return target
}

/** All files under dir as sorted forward-slash relative paths. */
function walk(dir, base = dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(abs, base))
    else out.push(relative(base, abs).split(sep).join('/'))
  }
  return out.sort()
}

const readManifest = target => JSON.parse(readFileSync(join(target, '.craft-kit-manifest.json'), 'utf8'))
const writeManifest = (target, list) => writeFileSync(join(target, '.craft-kit-manifest.json'), JSON.stringify(list))

// ─── Flags ────────────────────────────────────────────────────────────────────

describe('flags', () => {
  test('--help and -h exit 0 and document every flag', () => {
    for (const flag of ['--help', '-h']) {
      const { status, stdout } = run([flag])
      assert.equal(status, 0)
      assert.match(stdout, /Usage/)
      for (const f of ['--force', '--skip-setup', '--version', '--help']) assert.match(stdout, new RegExp(f))
    }
  })

  test('--version and -v print the package.json version', () => {
    for (const flag of ['--version', '-v']) {
      const { status, stdout } = run([flag])
      assert.equal(status, 0)
      assert.equal(stdout.trim(), PKG.version)
    }
  })

  test('an unknown flag exits 1, names the flag, shows usage, and installs nothing', () => {
    const cwd = tempDir()
    const { status, stderr } = run(['--bogus', '--skip-setup'], { cwd })
    assert.equal(status, 1)
    assert.match(stderr, /--bogus/)
    assert.match(stderr, /Usage/)
    assert.ok(!existsSync(join(cwd, 'kit')))
  })
})

// ─── Fresh install ────────────────────────────────────────────────────────────

describe('fresh install', () => {
  test('installs the orchestration files, steps and templates', () => {
    const target = install()
    for (const f of ['phase-1-bootstrap.md', 'phase-2.md', 'phase-bug-fix.md', 'orchestrator-conventions.md']) {
      assert.ok(existsSync(join(target, f)), `missing ${f}`)
    }
    assert.ok(existsSync(join(target, 'templates')))
    assert.ok(existsSync(join(target, 'steps')))
  })

  test('defaults to ./kit when no target-dir is given', () => {
    const cwd = tempDir()
    assert.equal(run(['--skip-setup'], { cwd }).status, 0)
    assert.ok(existsSync(join(cwd, 'kit', 'phase-1-bootstrap.md')))
  })

  test('excludes resource/ and CHANGELOG.md; installed files match the kit source exactly', () => {
    const target = install()
    const expected = walk(KIT).filter(f => f !== 'CHANGELOG.md' && !f.startsWith('resource/'))
    assert.deepEqual(walk(target).filter(f => !META_FILES.includes(f)), expected)
    assert.ok(!existsSync(join(target, 'resource')))
    assert.ok(!existsSync(join(target, 'CHANGELOG.md')))
  })

  test('writes the version stamp and a sorted manifest of installed kit files', () => {
    const target = install()
    assert.equal(readFileSync(join(target, '.craft-kit-version'), 'utf8').trim(), PKG.version)
    const manifest = readManifest(target)
    assert.deepEqual(manifest, [...manifest].sort())
    assert.deepEqual(manifest, walk(target).filter(f => !META_FILES.includes(f)))
  })
})

// ─── Non-empty target / --force ──────────────────────────────────────────────

describe('non-empty target', () => {
  test('exits 1 and points at --force when the target is non-empty', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    const { status, stderr } = run([target])
    assert.equal(status, 1)
    assert.match(stderr, /--force/)
  })

  test('--force installs into a non-empty target and keeps unrelated files', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    assert.equal(run([target, '--force', '--skip-setup']).status, 0)
    assert.ok(existsSync(join(target, 'phase-1-bootstrap.md')))
    assert.ok(existsSync(join(target, 'existing.txt')))
  })

  test('--force removes stale kit files listed in the old manifest, prunes emptied dirs, keeps user files', () => {
    const target = install()
    // Simulate an older install that shipped files the current kit no longer has.
    mkdirSync(join(target, 'retired'), { recursive: true })
    writeFileSync(join(target, 'retired', 'old-step.md'), 'old')
    writeFileSync(join(target, 'old-phase.md'), 'old')
    writeManifest(target, [...readManifest(target), 'retired/old-step.md', 'old-phase.md'].sort())
    // User content that was never part of the kit.
    writeFileSync(join(target, 'my-notes.md'), 'mine')
    mkdirSync(join(target, 'retired2'), { recursive: true })
    writeFileSync(join(target, 'retired2', 'old-step.md'), 'old')
    writeFileSync(join(target, 'retired2', 'mine.md'), 'mine')
    writeManifest(target, [...readManifest(target), 'retired2/old-step.md'].sort())

    assert.equal(run([target, '--force', '--skip-setup']).status, 0)

    assert.ok(!existsSync(join(target, 'old-phase.md')))
    assert.ok(!existsSync(join(target, 'retired')), 'emptied directory is pruned')
    assert.ok(!existsSync(join(target, 'retired2', 'old-step.md')))
    assert.ok(existsSync(join(target, 'retired2', 'mine.md')), 'directory with user files survives')
    assert.ok(existsSync(join(target, 'my-notes.md')))
    const after = readManifest(target)
    for (const gone of ['old-phase.md', 'retired/old-step.md', 'retired2/old-step.md']) {
      assert.ok(!after.includes(gone), `${gone} should leave the manifest`)
    }
  })

  test('--force never deletes outside the target even if the manifest says so', () => {
    const base = tempDir()
    const target = join(base, 'kit')
    assert.equal(run([target, '--skip-setup']).status, 0)
    writeFileSync(join(base, 'outside.md'), 'precious')
    writeManifest(target, [...readManifest(target), '../outside.md'])
    assert.equal(run([target, '--force', '--skip-setup']).status, 0)
    assert.ok(existsSync(join(base, 'outside.md')))
  })

  test('--force without a previous manifest warns that renamed files may linger', () => {
    const target = install()
    rmSync(join(target, '.craft-kit-manifest.json'))
    const { status, stdout } = run([target, '--force', '--skip-setup'])
    assert.equal(status, 0)
    assert.match(stdout, /linger/)
    assert.ok(existsSync(join(target, '.craft-kit-manifest.json')), 'manifest is recreated')
  })

  test('a file as target fails cleanly: non-zero exit, clear message, no stack trace', () => {
    const file = join(tempDir(), 'not-a-dir')
    writeFileSync(file, 'i am a file')
    const { status, stderr } = run([file, '--skip-setup'])
    assert.notEqual(status, 0)
    assert.match(stderr, /file/i)
    assert.doesNotMatch(stderr, /node:internal|\n\s+at /)
  })
})

// ─── Post-install output ──────────────────────────────────────────────────────

describe('--skip-setup', () => {
  test('prints the quick start and none of the setup instructions', () => {
    const { status, stdout } = run([tempDir(), '--skip-setup'])
    assert.equal(status, 0)
    assert.match(stdout, /Quick start/)
    assert.doesNotMatch(stdout, /\/plugin install superpowers|taste-skill|VoltAgent/)
  })
})

describe('non-TTY output (piped stdin prints all setup instructions)', () => {
  test('prints Superpowers, design-taste-frontend and agent instructions, then the quick start', () => {
    const { status, stdout } = run([tempDir()])
    assert.equal(status, 0)
    assert.match(stdout, /obra\/superpowers/)
    assert.match(stdout, /\/plugin install superpowers/)
    assert.match(stdout, /npx skills add .*Leonxlnx\/taste-skill.*design-taste-frontend/)
    assert.match(stdout, /VoltAgent\/awesome-claude-code-subagents/)
    assert.match(stdout, /Quick start/)
  })

  test('requires exactly the six specialist agents', () => {
    const { stdout } = run([tempDir()])
    const required = stdout.match(/Required:\s*(.+)/)?.[1].split(',').map(s => s.trim())
    assert.deepEqual(required?.sort(), [
      'backend-developer', 'code-reviewer', 'frontend-developer',
      'market-researcher', 'research-analyst', 'ui-ux-tester',
    ])
  })
})

describe('quick start paths', () => {
  test('use the installed directory, not a hardcoded "kit/" prefix', () => {
    const base = tempDir()
    const { stdout } = run([join(base, 'my-kit'), '--skip-setup'], { cwd: base })
    for (const f of ['phase-1-bootstrap.md', 'phase-2.md', 'phase-bug-fix.md']) {
      assert.match(stdout, new RegExp(`my-kit[/\\\\]${f.replace('.', '\\.')}`))
    }
    assert.doesNotMatch(stdout, /kit[/\\]my-kit/)
  })

  test('default install reports "kit" as the relative path', () => {
    const { stdout } = run(['--skip-setup'], { cwd: tempDir() })
    assert.match(stdout, /kit[/\\]phase-1-bootstrap\.md/)
  })
})

// ─── Kit link integrity ──────────────────────────────────────────────────────
//
// Every kit file path an orchestrator tells an agent to read must exist. Only
// backticked spans and markdown-link targets ending in .md are checked, and
// only when they look like kit paths (kit/, steps/, templates/, guides/,
// resource/ prefixes, or bare phase-*.md / well-known kit root names).
// Skipped: paths with < > * or docs/ (project artifacts and placeholders),
// CHANGELOG.md (history names deleted files) and resource/ (dev-only).

describe('kit link integrity', () => {
  const KIT_REF = /^(?:\.{1,2}\/)*(?:kit\/)?(?:(?:steps|templates|guides|resource)\/[\w./-]+\.md|(?:phase-[\w-]+|orchestrator-conventions|session-logging|stack-catalog|task-agent-rubric)\.md)$/
  const PROJECT_ARTIFACT = /^phase-\d-session\.md$/

  const kitFiles = walk(KIT).filter(f => f.endsWith('.md'))
  const scanned = [
    ...kitFiles.filter(f => f !== 'CHANGELOG.md' && !f.startsWith('resource/')).map(f => join(KIT, f)),
    join(ROOT, 'README.md'),
  ]
  const basenames = new Set(kitFiles.map(f => basename(f)))

  function refsIn(text) {
    const refs = []
    text.split(/\r?\n/).forEach((line, i) => {
      const found = [
        ...[...line.matchAll(/`([^`\s]+)`/g)].map(m => m[1]),
        ...[...line.matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1].replace(/#.*$/, '')),
      ]
      for (const ref of found) {
        if (/[<>*]|docs\//.test(ref) || /^[a-z]+:/i.test(ref) || !KIT_REF.test(ref)) continue
        if (PROJECT_ARTIFACT.test(basename(ref))) continue
        refs.push({ ref, line: i + 1 })
      }
    })
    return refs
  }

  function resolves(ref, fromFile) {
    const clean = ref.replace(/^(?:\.\/)+/, '')
    if ([KIT, dirname(fromFile), ROOT].some(base => existsSync(join(base, clean)))) return true
    // A bare name (no directory) may name a file anywhere in the kit, e.g. phase-1-kickoff.md.
    return !clean.includes('/') && basenames.has(clean)
  }

  test('every referenced kit file exists', () => {
    const broken = []
    let checked = 0
    for (const file of scanned) {
      for (const { ref, line } of refsIn(readFileSync(file, 'utf8'))) {
        checked++
        if (!resolves(ref, file)) broken.push(`${relative(ROOT, file)}:${line} → ${ref}`)
      }
    }
    assert.ok(checked > 20, `scanner found only ${checked} references — the patterns are probably broken`)
    assert.deepEqual(broken, [], `Broken kit references:\n  ${broken.join('\n  ')}`)
  })
})
