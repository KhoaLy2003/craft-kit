/**
 * Consistency lint for the kit itself (dev only, not shipped).
 *
 * One fact about a workflow (a step's gate or model) is repeated in the step file's Overview, the
 * phase table, and the hard-gate list in AGENTS.md. These tests fail when the copies drift apart,
 * and when a step file or template is orphaned. The package.json / CHANGELOG version check lives
 * in cli.test.mjs.
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const KIT = join(ROOT, 'kit')
const read = p => readFileSync(p, 'utf8')
const norm = p => relative(ROOT, p).split('\\').join('/')

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const stepFiles = walk(join(KIT, 'steps')).filter(f => f.endsWith('.md')).sort()
const kitMarkdown = walk(KIT).filter(f => f.endsWith('.md') && !norm(f).startsWith('kit/resource/') && basename(f) !== 'CHANGELOG.md')

const headings = text => [...text.matchAll(/^## (.+?)\s*$/gm)].map(m => m[1].trim())
const firstWord = value => (value.replace(/`/g, '').trim().match(/^[A-Za-z-]+/) || [''])[0].toLowerCase()

/** `- **Gate**: ...` and `- **Model**: ...` bullets inside the step's ## Overview section. */
function overviewFacts(text) {
  const m = text.match(/^## Overview\s*\n([\s\S]*?)(?=^## )/m)
  if (!m) return {}
  const facts = {}
  for (const key of ['Gate', 'Model']) {
    const b = m[1].match(new RegExp(`^- \\*\\*${key}\\*\\*:\\s*(.+)$`, 'm'))
    if (b) facts[key.toLowerCase()] = firstWord(b[1])
  }
  return facts
}

/** Rows `| <n> | ... |` of the first table whose header has Gate and Model columns. */
function phaseTable(file) {
  const rows = new Map()
  const lines = read(file).split(/\r?\n/)
  const headIdx = lines.findIndex(l => /^\|.*\bGate\b.*\bModel\b.*\|/.test(l))
  assert.ok(headIdx >= 0, `${norm(file)}: no Steps table with Gate and Model columns`)
  const cols = lines[headIdx].split('|').slice(1, -1).map(c => c.trim())
  const gateCol = cols.indexOf('Gate')
  const modelCol = cols.indexOf('Model')
  for (const line of lines.slice(headIdx + 2)) {
    if (!line.startsWith('|')) break
    const cells = line.split('|').slice(1, -1).map(c => c.trim())
    const n = Number(cells[0])
    if (Number.isInteger(n)) rows.set(n, { gate: firstWord(cells[gateCol]), model: firstWord(cells[modelCol]) })
  }
  return rows
}

const PHASES = [
  { dir: 'phase-1', prefix: 'p1', file: join(KIT, 'phase-1-bootstrap.md') },
  { dir: 'phase-2', prefix: 'p2', file: join(KIT, 'phase-2.md') },
  { dir: 'phase-3', prefix: 'p3', file: join(KIT, 'phase-3-iterate.md') },
]

describe('step files', () => {
  test('there are step files to check', () => {
    assert.ok(stepFiles.length >= 15, `found only ${stepFiles.length} step files`)
  })

  test('every step file has Overview, Completion Criteria and Transitions sections', () => {
    const problems = []
    for (const f of stepFiles) {
      const names = headings(read(f))
      for (const need of ['Overview', 'Completion Criteria']) {
        if (!names.includes(need)) problems.push(`${norm(f)}: missing "## ${need}"`)
      }
      if (!names.some(n => /^Transitions?( Rules)?$/.test(n))) problems.push(`${norm(f)}: missing "## Transitions" (or "## Transition Rules")`)
    }
    assert.deepEqual(problems, [])
  })

  test('every step file declares Gate and Model bullets inside Overview', () => {
    const problems = []
    for (const f of stepFiles) {
      const facts = overviewFacts(read(f))
      if (!facts.gate) problems.push(`${norm(f)}: no "- **Gate**:" bullet in Overview`)
      if (!facts.model) problems.push(`${norm(f)}: no "- **Model**:" bullet in Overview`)
    }
    assert.deepEqual(problems, [])
  })

  for (const { dir, prefix, file } of PHASES) {
    test(`${dir}: Gate and Model in each step file match the table in ${basename(file)}`, () => {
      const table = phaseTable(file)
      const problems = []
      const steps = stepFiles.filter(f => norm(f).startsWith(`kit/steps/${dir}/`))
      for (const f of steps) {
        const n = Number(basename(f).match(new RegExp(`^${prefix}-(\\d+)-`))[1])
        const row = table.get(n)
        if (!row) { problems.push(`${norm(f)}: step ${n} has no row in ${basename(file)}`); continue }
        const facts = overviewFacts(read(f))
        if (facts.gate !== row.gate) problems.push(`${norm(f)}: Gate "${facts.gate}" but ${basename(file)} says "${row.gate}"`)
        if (facts.model !== row.model) problems.push(`${norm(f)}: Model "${facts.model}" but ${basename(file)} says "${row.model}"`)
      }
      for (const n of table.keys()) {
        if (!steps.some(f => Number(basename(f).match(/-(\d+)-/)[1]) === n)) problems.push(`${basename(file)}: row ${n} has no step file`)
      }
      assert.deepEqual(problems, [])
    })
  }

  test('every step file is referenced by a phase file', () => {
    const phaseText = kitMarkdown.filter(f => /phase-[\w-]+\.md$/.test(f)).map(read).join('\n')
    const orphans = stepFiles.filter(f => !phaseText.includes(`steps/${norm(f).replace('kit/steps/', '')}`)).map(norm)
    assert.deepEqual(orphans, [])
  })
})

describe('hard-gate list in AGENTS.md', () => {
  const agents = read(join(ROOT, 'AGENTS.md'))
  const line = agents.split(/\r?\n/).find(l => l.startsWith('Hard gates:'))

  test('the list exists', () => {
    assert.ok(line, 'AGENTS.md has no "Hard gates:" line')
  })

  for (const { dir, file } of PHASES) {
    if (dir === 'phase-3') continue // named in the list by step name, checked below
    const label = dir === 'phase-1' ? 'Phase 1' : 'Phase 2'
    test(`${label} steps match the steps declaring "Gate: hard"`, () => {
      const declared = [...phaseTable(file)].filter(([, r]) => r.gate === 'hard').map(([n]) => n)
      const listed = (line.match(new RegExp(`${label} Steps ([\\d, ]+?)(?:;|\\.|$)`)) || [, ''])[1].split(',').map(s => Number(s.trim())).filter(Boolean)
      assert.deepEqual(listed, declared)
    })
  }

  for (const [workflow, file] of [['Phase 3', 'phase-3-iterate.md'], ['Bug Fix', 'phase-bug-fix.md'], ['Admin', 'phase-admin.md']]) {
    test(`${workflow}: every step headed "Gate: hard" is named in the list`, () => {
      const text = read(join(KIT, file))
      const hard = workflow === 'Phase 3' // Phase 3 declares gates in its step table, not in headings
        ? [...text.matchAll(/^\| \d+ \| (\w+) \| hard \|/gm)].map(m => m[1])
        : [...text.matchAll(/^## Step \d+ — (.+?) \| Gate: hard/gm)].map(m => m[1])
      assert.ok(hard.length > 0, `${file}: no "Gate: hard" step headings found`)
      const missing = hard.filter(name => !line.toLowerCase().includes(name.toLowerCase().split(/[ &]/)[0]))
      assert.deepEqual(missing, [])
    })
  }
})

describe('templates', () => {
  const templates = readdirSync(join(KIT, 'templates')).sort()

  test('every template is referenced by a step, phase, or convention file', () => {
    const corpus = kitMarkdown.map(f => ({ f, text: read(f) }))
    const orphans = templates.filter(t => !corpus.some(({ f, text }) => basename(f) !== t && text.includes(t)))
    assert.deepEqual(orphans, [])
  })

  // Not markdown documents with a Metadata block, or deliberately without one.
  const NO_METADATA = new Set([
    'backlog.json', 'backlog.html', 'onboarding.html', 'craft-kit.json', 'test-accounts.json',
    'pr-description.md', // pasted into a PR body, not a docs/ artifact
    '03c-design-system.md', // a user-supplied DESIGN.md skeleton
    'phase-1-kickoff.md', // user-filled intake form
  ])

  test('markdown templates carry Status, a date, and Based on in their metadata block', () => {
    const problems = []
    for (const t of templates.filter(t => t.endsWith('.md') && !NO_METADATA.has(t))) {
      const head = read(join(KIT, 'templates', t)).split(/\r?\n/).slice(0, 40).join('\n')
      if (!/\*\*Status(?::\*\*|\*\*:)/.test(head)) problems.push(`${t}: no Status`)
      if (!/\*\*Last (?:updated|amended)(?::\*\*|\*\*:)/.test(head)) problems.push(`${t}: no Last updated / Last amended`)
      if (!/\*\*Based on(?::\*\*|\*\*:)/.test(head)) problems.push(`${t}: no Based on`)
    }
    assert.deepEqual(problems, [])
  })

  test('the metadata exception list names only templates that exist', () => {
    assert.deepEqual([...NO_METADATA].filter(t => !templates.includes(t)), [])
  })
})

describe('project workflow block', () => {
  const conventions = read(join(KIT, 'guides/conventions-detail.md'))
  const block = conventions.match(/^## Project workflow block\s*\n[\s\S]*?```markdown\r?\n([\s\S]*?)```/m)

  test('conventions define the block, and it routes feature work to Phase 2', () => {
    assert.ok(block, 'conventions-detail.md has no "Project workflow block" section with a markdown block')
    assert.match(block[1], /^## Workflow \(craft-kit\)/m)
    assert.match(block[1], /kit\/phase-2\.md/)
    assert.match(block[1], /kit\/START\.md/)
  })

  test('both steps that write the project AGENTS.md add the block', () => {
    for (const f of ['steps/phase-1/p1-08-scaffold.md', 'phase-adopt.md']) {
      const text = read(join(KIT, f))
      assert.match(text, /Project workflow block/, `${f} does not point at the workflow block`)
      assert.match(text, /## Workflow \(craft-kit\)/, `${f} does not require the section in its checklist`)
    }
  })

  test('Phase 1 and Phase 3 handoffs both say to open a new session and emit a Phase 2 prompt', () => {
    for (const f of ['steps/phase-1/p1-08-scaffold.md', 'steps/phase-3/p3-04-handoff.md']) {
      const text = read(join(KIT, f))
      assert.match(text, /close this session and open a new one for Phase 2/, `${f} lacks the new-session instruction`)
      assert.match(text, /Then run Phase 2 \(scope: /, `${f} lacks the Phase 2 prompt`)
    }
  })
})

describe('resume and handover coverage', () => {
  const WORKFLOWS = ['phase-1-bootstrap', 'phase-2', 'phase-3-iterate', 'phase-bug-fix', 'phase-admin', 'phase-adopt']
  const conventions = read(join(KIT, 'orchestrator-conventions.md'))

  test('conventions define resume on re-entry (rule 18) and session checkpoint (rule 19)', () => {
    assert.match(conventions, /^18\. \*\*Resume on re-entry\*\*/m)
    assert.match(conventions, /^19\. \*\*Session checkpoint\*\*/m)
  })

  for (const name of WORKFLOWS) {
    test(`${name}.md points to the resume rule and the handover guide`, () => {
      const text = read(join(KIT, `${name}.md`))
      assert.match(text, /rule 18/, 'missing the resume rule reference')
      assert.match(text, /session-handover\.md/, 'missing the handover guide reference')
    })
  }

  test('START.md resume row covers unfinished session logs', () => {
    const start = read(join(KIT, 'START.md'))
    assert.match(start, /\*\*Resume\.\*\*[\s\S]*docs\/\*-session\.md[\s\S]*rule 18/)
  })
})

// Size budgets for the files an agent re-reads on every step. They exist because the kit grew back
// 12% after the token-trim plans (docs/token-trim-plan*.md). Raising a limit is a deliberate act:
// say why in kit/CHANGELOG.md. `node tests/measure-reading-set.mjs` shows the effect per step.
describe('size budgets (agent reading cost)', () => {
  const size = f => read(f).length
  const BUDGET = {
    conventions: 12_000,
    phaseFile: 8_000,
    stepFile: 10_500,
    installedKit: 400_000,
  }
  // Whole-workflow files that predate the step-file layout; split before raising their limit.
  const MONOLITHS = new Set(['phase-admin.md', 'phase-adopt.md'])

  test('orchestrator-conventions.md stays within budget (re-read at every step)', () => {
    const n = size(join(KIT, 'orchestrator-conventions.md'))
    assert.ok(n <= BUDGET.conventions, `orchestrator-conventions.md is ${n} chars, budget ${BUDGET.conventions}; move detail into kit/guides/conventions-detail.md`)
  })

  test('phase files stay within budget', () => {
    const over = ['phase-1-bootstrap', 'phase-2', 'phase-3-iterate', 'phase-bug-fix', 'phase-onboarding', 'phase-upgrade']
      .map(n => [`${n}.md`, size(join(KIT, `${n}.md`))])
      .filter(([n, c]) => !MONOLITHS.has(n) && c > BUDGET.phaseFile)
    assert.deepEqual(over, [])
  })

  test('step files stay within budget', () => {
    const over = stepFiles.map(f => [norm(f), size(f)]).filter(([, c]) => c > BUDGET.stepFile)
    assert.deepEqual(over, [])
  })

  test('installed kit (excluding CHANGELOG and resource/) stays within budget', () => {
    const total = kitMarkdown.reduce((n, f) => n + size(f), 0)
      + walk(KIT).filter(f => !f.endsWith('.md') && !norm(f).startsWith('kit/resource/')).reduce((n, f) => n + statSync(f).size, 0)
    assert.ok(total <= BUDGET.installedKit, `installed kit is ${total} chars, budget ${BUDGET.installedKit}`)
  })
})
