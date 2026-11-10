'use strict'

// Project wiring for `craft-kit --lite`: the workflow block in CLAUDE.md / AGENTS.md,
// the Claude Code audit hooks in .claude/settings.json, and the .gitignore entry.
// Every function is idempotent and only touches its own marked block or entries.

const fs   = require('fs')
const path = require('path')

const BLOCK_START = '<!-- craft-kit-lite:start -->'
const BLOCK_END   = '<!-- craft-kit-lite:end -->'
const RECORDER    = 'audit/record.js'
const HOOKS       = [['UserPromptSubmit', 'prompt'], ['Stop', 'stop'], ['SessionEnd', 'end']]

const posix = p => p.split(path.sep).join('/')

function workflowBlock (rel, audit) {
  const lines = [
    BLOCK_START,
    '## Workflow (craft-kit-lite)',
    `When the user asks to build, add or fix something, first read \`${rel}/START.md\` and follow it.`,
    'Write no code before Step 1 of that file is approved.',
  ]
  if (audit) {
    lines.push(
      'End every reply with one last line `[audit] step=<1-3> gate=<none|soft|hard> kind=<one word>` (for example `[audit] step=2 gate=none kind=implement`). A hook records it.'
    )
  }
  lines.push(BLOCK_END)
  return lines.join('\n')
}

// Replace the marked block in `file`, append it, or create the file. Content outside the markers is untouched.
function upsertBlock (file, block) {
  let text = null
  try { text = fs.readFileSync(file, 'utf8') } catch { /* missing */ }
  if (text === null) {
    fs.writeFileSync(file, block + '\n', 'utf8')
    return 'created'
  }
  const start = text.indexOf(BLOCK_START)
  const end   = text.indexOf(BLOCK_END)
  if (start !== -1 && end > start) {
    fs.writeFileSync(file, text.slice(0, start) + block + text.slice(end + BLOCK_END.length), 'utf8')
    return 'updated'
  }
  fs.writeFileSync(file, text.replace(/\s*$/, '') + '\n\n' + block + '\n', 'utf8')
  return 'added'
}

// CLAUDE.md always (created if neither file exists); AGENTS.md only if it already exists.
function writeWorkflowBlock (projectRoot, rel, audit) {
  const block = workflowBlock(rel, audit)
  const out = []
  const claude = path.join(projectRoot, 'CLAUDE.md')
  const agents = path.join(projectRoot, 'AGENTS.md')
  out.push(['CLAUDE.md', upsertBlock(claude, block)])
  if (fs.existsSync(agents)) out.push(['AGENTS.md', upsertBlock(agents, block)])
  return out
}

// Merge our three hooks into .claude/settings.json, replacing earlier lite entries and keeping everything else.
// Returns 'ok', or 'invalid' when the existing file is not valid JSON (it is then left untouched).
function wireAuditHooks (projectRoot, rel) {
  const file = path.join(projectRoot, '.claude', 'settings.json')
  let settings = {}
  if (fs.existsSync(file)) {
    try { settings = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return 'invalid' }
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return 'invalid'
  }
  if (!settings.hooks || typeof settings.hooks !== 'object' || Array.isArray(settings.hooks)) settings.hooks = {}

  for (const [event, mode] of HOOKS) {
    const groups = Array.isArray(settings.hooks[event]) ? settings.hooks[event] : []
    const kept = []
    for (const g of groups) {
      const inner = g && Array.isArray(g.hooks) ? g.hooks.filter(h => !(h && typeof h.command === 'string' && h.command.includes(RECORDER))) : null
      if (inner === null) kept.push(g)
      else if (inner.length) kept.push({ ...g, hooks: inner })
    }
    kept.push({ hooks: [{ type: 'command', command: `node "$CLAUDE_PROJECT_DIR/${posix(rel)}/${RECORDER}" ${mode}` }] })
    settings.hooks[event] = kept
  }

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n', 'utf8')
  return 'ok'
}

function ensureGitignore (projectRoot) {
  const file = path.join(projectRoot, '.gitignore')
  const entry = 'docs/audit/'
  let text = ''
  try { text = fs.readFileSync(file, 'utf8') } catch { /* missing */ }
  if (text.split(/\r?\n/).some(l => l.trim() === entry)) return false
  fs.writeFileSync(file, (text && !text.endsWith('\n') ? text + '\n' : text) + entry + '\n', 'utf8')
  return true
}

// True when CLAUDE.md or AGENTS.md also carries the full kit's workflow block (different kit, same project).
function hasFullKitBlock (projectRoot) {
  return ['CLAUDE.md', 'AGENTS.md'].some(f => {
    try { return /^## Workflow \(craft-kit\)\s*$/m.test(fs.readFileSync(path.join(projectRoot, f), 'utf8')) } catch { return false }
  })
}

// One project uses one kit. Returns the first sign that the OTHER kit ('full' | 'lite') is already in this
// project, or null. Only kit-specific signals count: an installed kit folder (by its manifest, any folder
// name), docs/.craft-kit.json (full kit's project record), the lite workflow block in CLAUDE.md / AGENTS.md.
function kindOfInstalledDir (dir) {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(dir, '.craft-kit-manifest.json'), 'utf8'))
    if (!Array.isArray(list)) return null
    if (list.includes('step-1-idea.md')) return 'lite'
    if (list.includes('phase-2.md')) return 'full'
  } catch { /* not an installed kit */ }
  return null
}

function findOtherKit (projectRoot, target, wanted) {
  const found = []
  const dirs = [target]
  try {
    for (const e of fs.readdirSync(projectRoot, { withFileTypes: true })) {
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) dirs.push(path.join(projectRoot, e.name))
    }
  } catch { /* unreadable root: nothing to find */ }
  for (const d of dirs) {
    const kind = kindOfInstalledDir(d)
    if (kind) found.push({ kind, where: (path.relative(projectRoot, d) || '.').split(path.sep).join('/') + '/' })
  }
  if (fs.existsSync(path.join(projectRoot, 'docs', '.craft-kit.json'))) found.push({ kind: 'full', where: 'docs/.craft-kit.json' })
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    try {
      if (fs.readFileSync(path.join(projectRoot, f), 'utf8').includes(BLOCK_START)) found.push({ kind: 'lite', where: f })
    } catch { /* missing */ }
  }
  return found.find(x => x.kind !== wanted) || null
}

module.exports = { workflowBlock, writeWorkflowBlock, wireAuditHooks, ensureGitignore, hasFullKitBlock, findOtherKit }
