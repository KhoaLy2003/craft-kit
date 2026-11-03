/**
 * Tests for kit/scripts/lint-docs.js, run against the real script on fixture projects
 * under tests/fixtures/lint-docs/<case>/docs/.
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtempSync, cpSync, writeFileSync, rmSync, readFileSync } from 'node:fs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SCRIPT = join(ROOT, 'kit', 'scripts', 'lint-docs.js')
const fixture = name => join(ROOT, 'tests', 'fixtures', 'lint-docs', name)

function lint(name) {
  const r = spawnSync(process.execPath, [SCRIPT, fixture(name)], { encoding: 'utf8' })
  return { status: r.status, out: r.stdout + r.stderr }
}

describe('lint-docs', () => {
  test('valid headers: exit 0, no findings; same-day edits and headerless files are not flagged', () => {
    const { status, out } = lint('valid')
    assert.equal(status, 0, out)
    assert.match(out, /no findings/)
  })

  test('a Status outside the valid set is an error naming the file; exit 1', () => {
    const { status, out } = lint('bad-status')
    assert.equal(status, 1, out)
    assert.match(out, /docs\/architecture\.md\s+\|\s+error\s+\|\s+invalid Status "final"/)
  })

  test('a malformed Last updated date is an error naming the file; exit 1', () => {
    const { status, out } = lint('bad-date')
    assert.equal(status, 1, out)
    assert.match(out, /docs\/architecture\.md\s+\|\s+error\s+\|\s+malformed Last updated "18\/10\/2026"/)
  })

  test('an approved file older than its Based on file is a stale warning; exit 0', () => {
    const { status, out } = lint('stale')
    assert.equal(status, 0, out)
    assert.match(out, /docs\/constitution\.md\s+\|\s+warning\s+\|\s+stale: docs\/architecture\.md was updated after docs\/constitution\.md/)
    assert.doesNotMatch(out, /\| error \|/)
  })

  test('a Reviewed against date at or after the source date clears the stale warning; an earlier one does not', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'lint-reviewed-'))
    try {
      cpSync(fixture('stale'), tmp, { recursive: true })
      const file = join(tmp, 'docs', 'constitution.md')
      const original = readFileSync(file, 'utf8')
      writeFileSync(file, original.replace('- **Based on**', '- **Reviewed against**: 2026-10-20\n- **Based on**'))
      const cleared = spawnSync(process.execPath, [SCRIPT, tmp], { encoding: 'utf8' })
      assert.equal(cleared.status, 0, cleared.stdout + cleared.stderr)
      assert.doesNotMatch(cleared.stdout + cleared.stderr, /stale/)
      writeFileSync(file, original.replace('- **Based on**', '- **Reviewed against**: 2026-10-19\n- **Based on**'))
      const still = spawnSync(process.execPath, [SCRIPT, tmp], { encoding: 'utf8' })
      assert.match(still.stdout + still.stderr, /stale: docs\/architecture\.md/)
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  })

  test('an acknowledged_version that is not a version is an error; exit 1', () => {
    const { status, out } = lint('bad-ack')
    assert.equal(status, 1, out)
    assert.match(out, /docs\/\.craft-kit\.json\s+\|\s+error\s+\|\s+acknowledged_version must be a version/)
  })

  test('growth: a shipped unit with notes is not collapsed and a unit over 5 notes is flagged; warnings only, exit 0', () => {
    const { status, out } = lint('growth')
    assert.equal(status, 0, out)
    assert.match(out, /docs\/phase-2-session\.md\s+\|\s+warning\s+\|\s+growth: shipped unit "shipped-feature" is not collapsed/)
    assert.match(out, /growth: unit "active-feature" has 6 notes/)
    assert.doesNotMatch(out, /\| error \|/)
  })

  test('growth: a collapsed shipped unit and an active unit within the cap give no findings', () => {
    const { status, out } = lint('collapsed')
    assert.equal(status, 0, out)
    assert.match(out, /no findings/)
  })

  test('growth: long lines, an oversized file and a long Run Log row warn; a long row outside the Run Log does not', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'lint-growth-'))
    try {
      cpSync(fixture('collapsed'), tmp, { recursive: true })
      const longRow = `| 2026-11-01 | cmd | F1 | ${'x'.repeat(320)} | docs/e2e-runs/a |`
      const e2e = [
        '# e2e-tests.md', '', '## 3. Test Coverage Map', '', longRow, '', '## 8. Run Log', '',
        '| Date | Command | Scope | Result | Evidence path |', '|---|---|---|---|---|',
        '| 2026-11-01 | cmd | F1 | 3 PASS | docs/e2e-runs/a |', longRow, '',
      ].join('\n')
      writeFileSync(join(tmp, 'docs', 'E2E-TESTS.md'), e2e)
      const log = join(tmp, 'docs', 'phase-2-session.md')
      writeFileSync(log, readFileSync(log, 'utf8') + `\n${'y'.repeat(450)}\n${'z'.repeat(21 * 1024)}\n`)
      const r = spawnSync(process.execPath, [SCRIPT, tmp], { encoding: 'utf8' })
      const out = r.stdout + r.stderr
      assert.equal(r.status, 0, out)
      assert.match(out, /docs\/E2E-TESTS\.md\s+\|\s+warning\s+\|\s+growth: 1 Run Log row\(s\) over 300/)
      assert.match(out, /docs\/phase-2-session\.md\s+\|\s+warning\s+\|\s+growth: \d+ line\(s\) over 400/)
      assert.match(out, /docs\/phase-2-session\.md\s+\|\s+warning\s+\|\s+growth: \d+ KB, over 20 KB/)
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  })

  test('a missing docs folder is an error', () => {
    const r = spawnSync(process.execPath, [SCRIPT, join(ROOT, 'tests', 'fixtures', 'lint-docs', 'valid', 'docs')], { encoding: 'utf8' })
    assert.equal(r.status, 1)
  })
})

describe('lint-docs in an ES-module project', () => {
  test('runs when the project package.json has "type": "module" (installed kit scripts stay CommonJS)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ck-esm-'))
    try {
      cpSync(join(ROOT, 'kit', 'scripts'), join(dir, 'kit', 'scripts'), { recursive: true })
      cpSync(join(fixture('valid'), 'docs'), join(dir, 'docs'), { recursive: true })
      writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
      const r = spawnSync(process.execPath, [join(dir, 'kit', 'scripts', 'lint-docs.js'), dir], { encoding: 'utf8' })
      assert.equal(r.status, 0, r.stdout + r.stderr)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
