#!/usr/bin/env node

'use strict'

const fs        = require('fs')
const path      = require('path')
const os        = require('os')
const https     = require('https')
const readline  = require('readline')
const { spawnSync } = require('child_process')

const PKG = require('../package.json')

// ─── ANSI helpers (stripped automatically when stdout is not a TTY) ───────────

const TTY = Boolean(process.stdout.isTTY)
const esc = TTY ? (c, s) => `\x1b[${c}m${s}\x1b[0m` : (_, s) => s

const bold   = s => esc('1',    s)
const dim    = s => esc('2',    s)
const green  = s => esc('32',   s)
const cyan   = s => esc('36',   s)
const yellow = s => esc('33',   s)
const red    = s => esc('31',   s)
const bCyan  = s => esc('1;36', s)
const bGreen = s => esc('1;32', s)
const bYellow = s => esc('1;33', s)

const SYM = {
  check : bGreen('✔'),
  cross : red('✖'),
  arrow : cyan('›'),
  down  : cyan('↓'),
  dot   : dim('·'),
}

const HR = dim('─'.repeat(52))

// ─── Dependency sources ───────────────────────────────────────────────────────
//
// Skills (8 of 9):  https://github.com/obra/superpowers
//   → installed as a plugin inside your AI harness; not a shell command.
//
// Skill (1 of 9):   https://github.com/Leonxlnx/taste-skill
//   → design-taste-frontend — installed via `npx skills add` (cross-harness).
//
// Agents (5):       https://github.com/VoltAgent/awesome-claude-code-subagents
//   → downloaded as .md files; installed to .claude/agents/ (project-scoped)
//     or ~./claude/agents/ for global access.

const TASTE_SKILL_REPO = 'https://github.com/Leonxlnx/taste-skill'
const TASTE_SKILL_NAME = 'design-taste-frontend'
const VOLTAGENT_RAW    = 'https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main'

const REQUIRED_AGENTS = [
  { name: 'market-researcher',  path: 'categories/10-research-analysis/market-researcher.md' },
  { name: 'research-analyst',   path: 'categories/10-research-analysis/research-analyst.md' },
  { name: 'frontend-developer', path: 'categories/01-core-development/frontend-developer.md' },
  { name: 'code-reviewer',      path: 'categories/04-quality-security/code-reviewer.md' },
  { name: 'ui-ux-tester',       path: 'categories/04-quality-security/ui-ux-tester.md' },
]

// ─── Harness detection ────────────────────────────────────────────────────────

function detectHarness () {
  const home = os.homedir()
  const cwd  = process.cwd()
  if (fs.existsSync(path.join(home, '.claude')))            return 'claude-code'
  if (fs.existsSync(path.join(home, '.cursor')))            return 'cursor'
  if (fs.existsSync(path.join(home, '.gemini')))            return 'gemini'
  if (fs.existsSync(path.join(home, '.config', 'hermes'))) return 'hermes'
  if (fs.existsSync(path.join(cwd,  '.github', 'copilot'))) return 'copilot'
  return null
}

const HARNESS_LABELS = {
  'claude-code': 'Claude Code',
  cursor:        'Cursor',
  gemini:        'Gemini CLI',
  hermes:        'Hermes',
  copilot:       'GitHub Copilot',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prompt (rl, question) {
  return new Promise(resolve => rl.question(question, resolve))
}

function httpsGet (url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'craft-kit-installer' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end',  () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function installTasteSkill () {
  // shell: true is required on Windows (npx resolves to npx.cmd).
  // On Unix it triggers DEP0190 because args are concatenated, not escaped.
  const result = spawnSync(
    'npx',
    ['skills', 'add', TASTE_SKILL_REPO, '--skill', TASTE_SKILL_NAME, '--yes'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  )
  return result.status === 0
}

async function installAgents (agentsDir) {
  fs.mkdirSync(agentsDir, { recursive: true })
  let ok = true
  for (const agent of REQUIRED_AGENTS) {
    const url  = `${VOLTAGENT_RAW}/${agent.path}`
    const dest = path.join(agentsDir, `${agent.name}.md`)
    process.stdout.write(`    ${SYM.down} ${agent.name.padEnd(22)}`)
    try {
      const content = await httpsGet(url)
      fs.writeFileSync(dest, content, 'utf8')
      console.log(SYM.check)
    } catch (err) {
      console.log(`${SYM.cross}  ${dim(err.message)}`)
      ok = false
    }
  }
  return ok
}

function printAgentManualInstructions () {
  const names = REQUIRED_AGENTS.map(a => a.name).join(', ')
  console.log(`
  ${bold('Agents')} — https://github.com/VoltAgent/awesome-claude-code-subagents

  Required: ${dim(names)}

  Option A — Claude Code (recommended):
    ${dim('claude plugin marketplace add VoltAgent/awesome-claude-code-subagents')}

  Option B — Interactive installer (no clone required):
    ${dim('curl -sO https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/install-agents.sh')}
    ${dim('chmod +x install-agents.sh && ./install-agents.sh')}

  Option C — Manual copy to ${dim('.agents/agents/')}:
    Copy the relevant .md files from the VoltAgent repo into your agents directory.
`)
}

function printBanner () {
  // Generated with: npx figlet-cli "CRAFT-KIT" (Standard font)
  const art = [
    '   ____ ____      _    _____ _____     _  _____ _____ ',
    '  / ___|  _ \\    / \\  |  ___|_   _|   | |/ /_ _|_   _|',
    ' | |   | |_) |  / _ \\ | |_    | |_____| \' / | |  | |  ',
    ' | |___|  _ <  / ___ \\|  _|   | |_____| . \\ | |  | |  ',
    '  \\____|_| \\_\\/_/   \\_\\_|     |_|     |_|\\_\\___| |_|  ',
  ]
  console.log()
  art.forEach(row => console.log(bCyan(bold(row))))
  console.log()
  console.log(`  ${dim('AI-agent workflow kit')}  ${dim('·')}  ${dim('v' + PKG.version)}`)
  console.log()
}

function printQuickStart (rel) {
  console.log(`
  ${HR}
  ${bCyan('Quick start')}
  ${HR}

  ${SYM.dot} ${bold('New project')}
    ${cyan('1.')} Fill in    ${yellow(rel + '/templates/phase-1-kickoff.md')}   with your idea
    ${cyan('2.')} Open your AI assistant with this folder as the working directory
    ${cyan('3.')} Say:  ${yellow('"Start Phase 1 using ' + rel + '/phase-1-bootstrap.md."')}

  ${SYM.dot} ${bold('Existing project')}  ${dim('(skip Phase 1)')}
    Share  ${yellow(rel + '/phase-2-feature-dev.md')}  or  ${yellow(rel + '/phase-2-single-pass.md')}
    and say:  ${yellow('"Pick the next pending feature and run the Phase 2 cycle."')}

  ${SYM.dot} ${bold('Docs')}  ${dim('https://khoaly2003.github.io/craft-kit')}
  ${HR}
`)
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const args      = process.argv.slice(2)
const force     = args.includes('--force')
const skipSetup = args.includes('--skip-setup')

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  ${bold('craft-kit')} v${PKG.version}

  ${bold('Usage')}
    npx github:KhoaLy2003/craft-kit [target-dir] [flags]

  ${bold('Arguments')}
    target-dir    Directory to install the kit into  (default: ./kit)

  ${bold('Flags')}
    --force         Overwrite an existing install
    --skip-setup    Copy kit files only; skip skill/agent setup
    --version       Print version and exit
    --help          Show this message

  ${bold('Examples')}
    npx github:KhoaLy2003/craft-kit                      install to ./kit/
    npx github:KhoaLy2003/craft-kit ./my-project/kit     install to a custom path
    npx github:KhoaLy2003/craft-kit --force              update an existing install
    npx github:KhoaLy2003/craft-kit --skip-setup         kit files only, no setup prompt
`)
  process.exit(0)
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(PKG.version)
  process.exit(0)
}

const targetArg = args.find(a => !a.startsWith('-'))
const target    = targetArg
  ? path.resolve(process.cwd(), targetArg)
  : path.join(process.cwd(), 'kit')

// ─── Source ───────────────────────────────────────────────────────────────────

const src = path.join(__dirname, '..', 'kit')

if (!fs.existsSync(src)) {
  console.error(`\n  ${SYM.cross}  Internal error: kit/ directory not found in this package.\n`)
  process.exit(1)
}

// ─── Preflight ────────────────────────────────────────────────────────────────

if (fs.existsSync(target)) {
  const entries = fs.readdirSync(target)
  if (entries.length > 0 && !force) {
    console.error(`
  ${SYM.cross}  Target directory already exists and is not empty:
     ${yellow(target)}

  To update an existing install:
     npx github:KhoaLy2003/craft-kit --force
`)
    process.exit(1)
  }
}

printBanner()

// ─── Copy ─────────────────────────────────────────────────────────────────────

try {
  fs.mkdirSync(target, { recursive: true })
  fs.cpSync(src, target, {
    recursive: true,
    force: true,
    filter: (srcPath) => {
      // Exclude resource/ — internal development files not needed by kit users
      // Exclude CHANGELOG.md — internal release history, not needed by kit users
      const rel = path.relative(src, srcPath)
      return !rel.startsWith('resource') && rel !== 'CHANGELOG.md'
    },
  })
} catch (err) {
  console.error(`\n  ${SYM.cross}  Copy failed: ${err.message}\n`)
  process.exit(1)
}

const rel = path.relative(process.cwd(), target) || '.'
console.log(`  ${SYM.check}  Kit installed  ${SYM.arrow}  ${bold(rel + '/')}\n`)

if (skipSetup) {
  printQuickStart(rel)
  process.exit(0)
}

// ─── Post-install: skills and agents ─────────────────────────────────────────

const harness = detectHarness()

// Non-interactive (CI / piped stdin): print everything, run nothing interactive.
if (!process.stdin.isTTY) {
  if (harness) {
    console.log(`  ${SYM.check}  Detected harness: ${HARNESS_LABELS[harness] || harness}\n`)
  } else {
    console.log(`  No harness detected — see instructions below.\n`)
  }

  console.log(`  ${HR}`)
  console.log(`  Step 1 of 3  ${SYM.dot}  Superpowers`)
  console.log(`  ${HR}\n`)
  console.log(`  Superpowers — https://github.com/obra/superpowers`)
  console.log(`  Install from INSIDE your AI coding session:\n`)
  console.log(`    Claude Code  →  /plugin install superpowers@claude-plugins-official`)
  console.log(`    Cursor       →  /add-plugin superpowers`)
  console.log(`    Codex CLI    →  /plugins  then search "superpowers"`)
  console.log(`    Kimi Code    →  /plugins  then Marketplace > Superpowers`)
  console.log(`    OpenCode     →  Ask your agent to fetch and follow:`)
  console.log(`                    https://raw.githubusercontent.com/obra/superpowers/main/.opencode/INSTALL.md`)
  console.log(`\n  Full guide: https://github.com/obra/superpowers#installation`)

  console.log(`\n  ${HR}`)
  console.log(`  Step 2 of 3  ${SYM.dot}  design-taste-frontend`)
  console.log(`  ${HR}\n`)
  console.log(`  Run in your terminal:`)
  console.log(`    npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes\n`)

  console.log(`  ${HR}`)
  console.log(`  Step 3 of 3  ${SYM.dot}  Specialist agents`)
  console.log(`  ${HR}`)
  printAgentManualInstructions()
  printQuickStart(rel)
  process.exit(0)
}

// ─── Interactive setup ────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

;(async () => {
  if (harness) {
    console.log(`  ${SYM.check}  Detected: ${bold(HARNESS_LABELS[harness] || harness)}`)
  } else {
    console.log(`  ${dim('No harness detected')} — instructions will be printed below.\n`)
  }
  console.log(`  ${dim('Three quick steps to unlock the full Phase 1–2 workflow.')}\n`)

  // ── Step 1: Superpowers ────────────────────────────────────────────────────
  console.log(`  ${HR}`)
  console.log(`  ${bold('Step 1 of 3')}  ${SYM.dot}  ${bCyan('Superpowers')}  ${dim('(installed inside your AI session)')}`)
  console.log(`  ${HR}\n`)
  console.log(`  Install command varies by harness:\n`)
  console.log(`    Claude Code  ${SYM.arrow}  ${cyan('/plugin install superpowers@claude-plugins-official')}`)
  console.log(`    Cursor       ${SYM.arrow}  ${cyan('/add-plugin superpowers')}`)
  console.log(`    Codex CLI    ${SYM.arrow}  ${cyan('/plugins')}  then search "superpowers"`)
  console.log(`    Kimi Code    ${SYM.arrow}  ${cyan('/plugins')}  then Marketplace > Superpowers`)
  console.log(`    OpenCode     ${SYM.arrow}  Ask your agent to fetch and follow:`)
  console.log(`                 ${dim('https://raw.githubusercontent.com/obra/superpowers/main/.opencode/INSTALL.md')}`)
  console.log(`\n  Full guide: ${dim('https://github.com/obra/superpowers#installation')}`)

  // ── Step 2: design-taste-frontend ─────────────────────────────────────────
  console.log(`\n  ${HR}`)
  console.log(`  ${bold('Step 2 of 3')}  ${SYM.dot}  ${bCyan('design-taste-frontend')}  ${dim('(installed via npx)')}`)
  console.log(`  ${HR}\n`)

  const ans2 = await prompt(rl, `  ${bYellow('?')}  Install design-taste-frontend now via npx? ${dim('[Y/n]')} `)
  if (ans2.trim().toLowerCase() !== 'n') {
    console.log('')
    const ok = installTasteSkill()
    if (ok) {
      console.log(`\n  ${SYM.check}  ${bGreen('design-taste-frontend')} installed.\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Install failed. Run manually:`)
      console.log(`     ${dim('npx skills add ' + TASTE_SKILL_REPO + ' --skill "' + TASTE_SKILL_NAME + '" --yes')}\n`)
    }
  } else {
    console.log(`\n  Skipped. Run when ready:`)
    console.log(`    ${dim('npx skills add ' + TASTE_SKILL_REPO + ' --skill "' + TASTE_SKILL_NAME + '" --yes')}\n`)
  }

  // ── Step 3: Agents ─────────────────────────────────────────────────────────
  console.log(`  ${HR}`)
  console.log(`  ${bold('Step 3 of 3')}  ${SYM.dot}  ${bCyan('Specialist agents')}`)
  console.log(`  ${HR}\n`)

  const agentsDir = path.join(process.cwd(), '.agents', 'agents')
  const agentsRel = path.relative(process.cwd(), agentsDir)

  const ans3 = await prompt(rl, `  ${bYellow('?')}  Download agents to ${bold(agentsRel + '/')}? ${dim('[Y/n]')} `)
  if (ans3.trim().toLowerCase() !== 'n') {
    console.log('')
    const ok = await installAgents(agentsDir)
    if (ok) {
      console.log(`\n  ${SYM.check}  All agents installed to ${bold(agentsRel + '/')}\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Some agents failed. Install the rest manually:\n`)
      printAgentManualInstructions()
    }
  } else {
    printAgentManualInstructions()
  }

  rl.close()
  printQuickStart(rel)
  process.exit(0)
})()
