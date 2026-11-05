/**
 * Drift lint for the hand-written docs-site pages (dev only, not shipped).
 * The kit pages are the kit's own files; these checks cover the pages that restate kit facts.
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SITE = join(ROOT, 'docs-site')
const read = p => readFileSync(p, 'utf8')

const walk = dir => readdirSync(dir).flatMap(n => {
  if (n === 'node_modules' || n === '.vitepress' || n === 'public') return []
  const full = join(dir, n)
  return statSync(full).isDirectory() ? walk(full) : [full]
})
const handWritten = walk(SITE).filter(f => f.endsWith('.md'))

// Published paths, read from the page table in config.ts.
const config = read(join(SITE, '.vitepress', 'config.ts'))
const published = new Set([
  ...[...config.matchAll(/\b(?:kit|docs)\('[^']+',\s*'([^']+)'/g)].map(m => m[1]),
  ...[...config.matchAll(/\['(p[12]-[\w-]+)'/g)].map(m => `phases/steps/${m[1]}`),
])

describe('docs-site pages', () => {
  test('page table was parsed', () => assert.ok(published.size > 40, `only ${published.size} pages parsed`))

  test('every internal link in hand-written pages names a published page', () => {
    const broken = []
    for (const file of handWritten) {
      read(file).split(/\r?\n/).forEach((text, i) => {
        for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
          const path = m[1].split('#')[0].replace(/^\//, '')
          if (path && !published.has(path)) broken.push(`${relative(ROOT, file)}:${i + 1} → ${m[1]}`)
        }
      })
    }
    assert.deepEqual(broken, [], `Links to unpublished pages:\n  ${broken.join('\n  ')}`)
  })

  test('required-skills.md lists every skill the installer offers', () => {
    const cli = read(join(ROOT, 'bin', 'cli.js'))
    const names = ['design-taste-frontend', 'archify', 'code-review-and-quality', 'code-simplification',
      'security-and-hardening', 'performance-optimization']
    const page = read(join(SITE, 'reference', 'required-skills.md'))
    for (const n of names) {
      assert.ok(cli.includes(n), `${n} is not in bin/cli.js any more — update this test`)
      assert.ok(page.includes(`\`${n}\``), `required-skills.md does not list ${n}`)
    }
  })

  test('step counts stated in the docs match the step files', () => {
    const count = dir => readdirSync(join(ROOT, 'kit', 'steps', dir)).filter(f => f.endsWith('.md')).length
    assert.equal(count('phase-1'), 8, 'docs say Phase 1 has eight steps')
    assert.equal(count('phase-2'), 7, 'docs say Phase 2 has seven steps')
  })
})
