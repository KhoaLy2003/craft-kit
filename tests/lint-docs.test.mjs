/**
 * Tests for kit/scripts/lint-docs.js, run against the real script on fixture projects
 * under tests/fixtures/lint-docs/<case>/docs/.
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

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

  test('a missing docs folder is an error', () => {
    const r = spawnSync(process.execPath, [SCRIPT, join(ROOT, 'tests', 'fixtures', 'lint-docs', 'valid', 'docs')], { encoding: 'utf8' })
    assert.equal(r.status, 1)
  })
})
