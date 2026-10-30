// Dev-only: characters an agent reads per step (conventions + phase file + step file + its templates).
// Usage: node tests/measure-reading-set.mjs   (not part of `npm test`, not shipped)
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const kit = join(import.meta.dirname, '..', 'kit')
const size = (rel) => (existsSync(join(kit, rel)) ? readFileSync(join(kit, rel), 'utf8').length : 0)
const base = ['orchestrator-conventions.md']
const phases = [
  ['Phase 1', 'phase-1-bootstrap.md', 'steps/phase-1'],
  ['Phase 2', 'phase-2.md', 'steps/phase-2'],
]

let grand = 0
for (const [name, phaseFile, dir] of phases) {
  console.log(`\n${name} (base ${[...base, phaseFile].map(size).reduce((a, b) => a + b)})`)
  let total = 0
  for (const f of readdirSync(join(kit, dir)).sort()) {
    const text = readFileSync(join(kit, dir, f), 'utf8')
    const tpl = [...new Set([...(text.match(/^- \*\*Template\*\*:.*$/m)?.[0] ?? '').matchAll(/templates\/[\w.-]+\.md/g)].map((m) => m[0]))]
    const n = [...base, phaseFile, `${dir}/${f}`, ...tpl].map(size).reduce((a, b) => a + b)
    total += n
    console.log(`  ${f.padEnd(34)} ${String(n).padStart(6)}`)
  }
  console.log(`  ${'sum of steps'.padEnd(34)} ${String(total).padStart(6)}`)
  grand += total
}
console.log(`\nTOTAL per-step reads, Phase 1 + 2: ${grand}`)
