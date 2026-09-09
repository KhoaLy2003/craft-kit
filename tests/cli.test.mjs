/**
 * Tests for bin/cli.js
 *
 * Run:  node --test tests/cli.test.mjs
 *
 * Strategy: spawn the CLI as a subprocess via spawnSync.
 * Passing `input: ''` gives the child a piped (non-TTY) stdin, which triggers
 * the non-interactive code path — all instructions printed, no prompts.
 * Harness detection is controlled by overriding HOME / USERPROFILE to point
 * at a temporary directory we create for each test.
 *
 * No network calls are made by any test (the interactive TTY path that would
 * trigger npx / https downloads is never reached).
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtempSync, mkdirSync, writeFileSync,
  rmSync, existsSync, readdirSync,
} from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CLI  = join(ROOT, 'bin', 'cli.js')
const PKG  = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// Each tempDir() registers one process 'exit' handler for cleanup.
// We create more than 10 temp dirs across the suite, so raise the limit.
process.setMaxListeners(100)

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Run the CLI as a subprocess.
 *
 * @param {string[]} args      - argv passed to the script
 * @param {object}   opts
 * @param {string}   opts.cwd  - working directory for the child process
 * @param {string}   opts.home - value for HOME and USERPROFILE (harness detection)
 */
function run(args = [], opts = {}) {
  const fakeHome = opts.home ?? tmpdir()
  return spawnSync('node', [CLI, ...args], {
    cwd:      opts.cwd ?? tmpdir(),
    input:    '',           // piped stdin → isTTY === false → non-interactive path
    encoding: 'utf8',
    timeout:  15_000,
    env: {
      ...process.env,
      HOME:        fakeHome,  // Unix
      USERPROFILE: fakeHome,  // Windows
    },
  })
}

/** Create a fresh isolated temp directory; auto-cleaned at process exit. */
function tempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'pdk-test-'))
  process.on('exit', () => {
    try { rmSync(dir, { recursive: true, force: true }) } catch {}
  })
  return dir
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('--help flag', () => {
  test('exits with code 0', () => {
    const { status } = run(['--help'])
    assert.equal(status, 0)
  })

  test('prints "Usage" heading', () => {
    const { stdout } = run(['--help'])
    assert.match(stdout, /Usage/)
  })

  test('lists all four flags', () => {
    const { stdout } = run(['--help'])
    assert.match(stdout, /--force/)
    assert.match(stdout, /--skip-setup/)
    assert.match(stdout, /--version/)
    assert.match(stdout, /--help/)
  })

  test('short form -h works', () => {
    const { status } = run(['-h'])
    assert.equal(status, 0)
  })
})

describe('--version flag', () => {
  test('exits with code 0', () => {
    const { status } = run(['--version'])
    assert.equal(status, 0)
  })

  test('prints the version from package.json', () => {
    const { stdout } = run(['--version'])
    assert.equal(stdout.trim(), PKG.version)
  })

  test('short form -v works', () => {
    const { stdout } = run(['-v'])
    assert.equal(stdout.trim(), PKG.version)
  })
})

describe('kit copy — fresh install', () => {
  test('exits with code 0', () => {
    const target = tempDir()
    const { status } = run([target, '--skip-setup'])
    assert.equal(status, 0)
  })

  test('kit directory is created at the target path', () => {
    const target = join(tempDir(), 'my-kit')
    run([target, '--skip-setup'])
    assert.ok(existsSync(target), `Expected ${target} to exist`)
  })

  test('phase-1-bootstrap.md is present after install', () => {
    const target = join(tempDir(), 'kit')
    run([target, '--skip-setup'])
    assert.ok(existsSync(join(target, 'phase-1-bootstrap.md')))
  })

  test('phase-2-feature-dev.md is present after install', () => {
    const target = join(tempDir(), 'kit')
    run([target, '--skip-setup'])
    assert.ok(existsSync(join(target, 'phase-2-feature-dev.md')))
  })

  test('templates/ directory is present after install', () => {
    const target = join(tempDir(), 'kit')
    run([target, '--skip-setup'])
    assert.ok(existsSync(join(target, 'templates')))
  })

  test('defaults to ./kit when no target-dir arg given', () => {
    const cwd = tempDir()
    run(['--skip-setup'], { cwd })
    assert.ok(existsSync(join(cwd, 'kit', 'phase-1-bootstrap.md')))
  })
})

describe('kit copy — non-empty target', () => {
  test('exits with code 1 when target is non-empty and --force is absent', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    const { status } = run([target])
    assert.equal(status, 1)
  })

  test('stderr mentions --force when target is non-empty', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    const { stderr } = run([target])
    assert.match(stderr, /--force/)
  })

  test('exits with code 0 when --force is present on a non-empty target', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    const { status } = run([target, '--force', '--skip-setup'])
    assert.equal(status, 0)
  })

  test('overwrites files when --force is used', () => {
    const target = tempDir()
    writeFileSync(join(target, 'existing.txt'), 'content')
    run([target, '--force', '--skip-setup'])
    assert.ok(existsSync(join(target, 'phase-1-bootstrap.md')))
  })
})

describe('--skip-setup flag', () => {
  test('exits with code 0', () => {
    const target = tempDir()
    const { status } = run([target, '--skip-setup'])
    assert.equal(status, 0)
  })

  test('prints quick start section', () => {
    const target = tempDir()
    const { stdout } = run([target, '--skip-setup'])
    assert.match(stdout, /Quick start/)
  })

  test('does not print superpowers install instructions', () => {
    const target = tempDir()
    const { stdout } = run([target, '--skip-setup'])
    // "/plugin install superpowers" only appears in the full install instructions block,
    // not in the quick start footer which merely links to the repo for reference.
    assert.doesNotMatch(stdout, /\/plugin install superpowers/)
  })

  test('does not print taste-skill install command', () => {
    const target = tempDir()
    const { stdout } = run([target, '--skip-setup'])
    assert.doesNotMatch(stdout, /taste-skill/)
  })

  test('does not print agent install instructions', () => {
    const target = tempDir()
    const { stdout } = run([target, '--skip-setup'])
    assert.doesNotMatch(stdout, /VoltAgent/)
  })
})

describe('non-TTY output (piped stdin — prints all instructions)', () => {
  test('prints superpowers install instructions', () => {
    const target = tempDir()
    const { stdout } = run([target])
    assert.match(stdout, /obra\/superpowers/)
  })

  test('prints /plugin install for Claude Code', () => {
    const target = tempDir()
    const { stdout } = run([target])
    assert.match(stdout, /\/plugin install superpowers/)
  })

  test('prints taste-skill npx command', () => {
    const target = tempDir()
    const { stdout } = run([target])
    assert.match(stdout, /npx skills add/)
    assert.match(stdout, /Leonxlnx\/taste-skill/)
    assert.match(stdout, /design-taste-frontend/)
  })

  test('prints VoltAgent agent instructions', () => {
    const target = tempDir()
    const { stdout } = run([target])
    assert.match(stdout, /VoltAgent\/awesome-claude-code-subagents/)
  })

  test('lists all five required agents by name', () => {
    const target = tempDir()
    const { stdout } = run([target])
    for (const name of ['market-researcher', 'research-analyst', 'frontend-developer', 'code-reviewer', 'ui-ux-tester']) {
      assert.match(stdout, new RegExp(name), `Expected "${name}" in output`)
    }
  })

  test('prints quick start section', () => {
    const target = tempDir()
    const { stdout } = run([target])
    assert.match(stdout, /Quick start/)
  })

  test('exits with code 0', () => {
    const target = tempDir()
    const { status } = run([target])
    assert.equal(status, 0)
  })
})

describe('quick start path interpolation', () => {
  test('phase-1-bootstrap.md path uses the installed directory name', () => {
    const base   = tempDir()
    const target = join(base, 'my-kit')
    const cwd    = base
    const { stdout } = run([target, '--skip-setup'], { cwd })
    // Should be "my-kit/phase-1-bootstrap.md", NOT "kit/my-kit/..." or "kit/kit/..."
    assert.match(stdout, /my-kit\/phase-1-bootstrap\.md|my-kit\\phase-1-bootstrap\.md/)
    assert.doesNotMatch(stdout, /kit\/my-kit|kit\\my-kit/)
  })

  test('phase-2 paths use the installed directory, not a hardcoded "kit/" prefix', () => {
    const base   = tempDir()
    const target = join(base, 'custom-dir')
    const cwd    = base
    const { stdout } = run([target, '--skip-setup'], { cwd })
    assert.match(stdout, /custom-dir\/phase-2|custom-dir\\phase-2/)
    assert.doesNotMatch(stdout, /kit\/custom-dir|kit\\custom-dir/)
  })

  test('default install (no target-dir) uses "kit" as the relative path', () => {
    const cwd = tempDir()
    const { stdout } = run(['--skip-setup'], { cwd })
    assert.match(stdout, /kit[/\\]phase-1-bootstrap\.md/)
  })
})

describe('harness detection', () => {
  // These tests control the HOME / USERPROFILE env vars so detectHarness()
  // reads from a clean temp directory, not the real user home.
  // The "Detected harness:" prefix is emitted at the top of the non-TTY path
  // and is only present when a specific harness dir was actually found on disk.

  test('detects Claude Code when ~/.claude exists', () => {
    const fakeHome = tempDir()
    mkdirSync(join(fakeHome, '.claude'), { recursive: true })
    const target = join(tempDir(), 'kit')
    const { stdout } = run([target], { home: fakeHome })
    assert.match(stdout, /Detected harness: Claude Code/)
  })

  test('detects Cursor when ~/.cursor exists', () => {
    const fakeHome = tempDir()
    mkdirSync(join(fakeHome, '.cursor'), { recursive: true })
    const target = join(tempDir(), 'kit')
    const { stdout } = run([target], { home: fakeHome })
    assert.match(stdout, /Detected harness: Cursor/)
  })

  test('detects Gemini when ~/.gemini exists', () => {
    const fakeHome = tempDir()
    mkdirSync(join(fakeHome, '.gemini'), { recursive: true })
    const target = join(tempDir(), 'kit')
    const { stdout } = run([target], { home: fakeHome })
    assert.match(stdout, /Detected harness: Gemini CLI/)
  })

  test('prints "No harness detected" when no known directory exists', () => {
    const fakeHome = tempDir()  // empty — no .claude, .cursor, .gemini etc.
    const target = join(tempDir(), 'kit')
    const { stdout } = run([target], { home: fakeHome })
    assert.match(stdout, /No harness detected/)
  })

  test('does not print "Detected harness" when no known directory exists', () => {
    const fakeHome = tempDir()
    const target = join(tempDir(), 'kit')
    const { stdout } = run([target], { home: fakeHome })
    assert.doesNotMatch(stdout, /Detected harness:/)
  })
})
