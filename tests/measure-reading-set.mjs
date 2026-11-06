// Dev-only: characters an agent reads per step (conventions + phase file + step file + its templates).
// Usage: node tests/measure-reading-set.mjs   (not part of `npm test`, not shipped)
// "worst case" = every step re-reads conventions + phase file; "read once" = each file counted once.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const kit = join(import.meta.dirname, '..', 'kit')
const size = (rel) => (existsSync(join(kit, rel)) ? readFileSync(join(kit, rel), 'utf8').length : 0)
const base = ['orchestrator-conventions.md', 'session-logging.md']
const phases = [
  ['Phase 1', 'phase-1-bootstrap.md', 'steps/phase-1'],
  ['Phase 2', 'phase-2.md', 'steps/phase-2'],
  ['Phase 3', 'phase-3-iterate.md', 'steps/phase-3'],
]

let grand = 0
let grandOnce = 0
for (const [name, phaseFile, dir] of phases) {
  if (!existsSync(join(kit, dir))) { console.log(`
${name}: single file ${size(phaseFile)}`); grandOnce += size(phaseFile) + base.map(size).reduce((a, b) => a + b); continue }
  const header = [...base, phaseFile]
  console.log(`\n${name} (base ${header.map(size).reduce((a, b) => a + b)})`)
  let total = 0
  const once = new Set(header)
  for (const f of readdirSync(join(kit, dir)).sort()) {
    const text = readFileSync(join(kit, dir, f), 'utf8')
    const tpl = [...new Set([...(text.match(/^- \*\*Template\*\*:.*$/m)?.[0] ?? '').matchAll(/templates\/[\w.-]+\.md/g)].map((m) => m[0]))]
    const files = [...header, `${dir}/${f}`, ...tpl]
    files.forEach((x) => once.add(x))
    const n = files.map(size).reduce((a, b) => a + b)
    total += n
    console.log(`  ${f.padEnd(34)} ${String(n).padStart(6)}`)
  }
  const onceTotal = [...once].map(size).reduce((a, b) => a + b)
  console.log(`  ${'worst case (sum of steps)'.padEnd(34)} ${String(total).padStart(6)}`)
  console.log(`  ${'read once'.padEnd(34)} ${String(onceTotal).padStart(6)}`)
  if (name !== 'Phase 3') grand += total
  grandOnce += onceTotal
}
console.log(`\nTOTAL worst case, Phase 1 + 2: ${grand}`)
console.log(`TOTAL read once, Phase 1 + 2 + 3 (shared files counted per phase): ${grandOnce}`)
