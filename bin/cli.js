#!/usr/bin/env node

'use strict'

const fs       = require('fs')
const path     = require('path')
const os       = require('os')
const https    = require('https')
const readline = require('readline')
const { spawnSync } = require('child_process')

const PKG = require('../package.json')

// ─── Dependency sources ───────────────────────────────────────────────────────
//
// Skills (8 of 9):  https://github.com/obra/superpowers
//   → installed as a plugin inside your AI harness; not a shell command.
//   → see SUPERPOWERS_INSTALL_INSTRUCTIONS below for per-harness commands.
//
// Skill (1 of 9):   https://github.com/Leonxlnx/taste-skill
//   → design-taste-frontend — installed via `npx skills add` (cross-harness).
//
// Agents (5):       https://github.com/VoltAgent/awesome-claude-code-subagents
//   → downloaded as .md files; installed to ~/.claude/agents/ (Claude Code)
//     or equivalent location for other harnesses.

const TASTE_SKILL_REPO = 'https://github.com/Leonxlnx/taste-skill'
const TASTE_SKILL_NAME = 'design-taste-frontend'

const VOLTAGENT_RAW = 'https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main'

// Verified paths inside the VoltAgent repo
const REQUIRED_AGENTS = [
  { name: 'market-researcher',  path: 'categories/10-research-analysis/market-researcher.md' },
  { name: 'research-analyst',   path: 'categories/10-research-analysis/research-analyst.md' },
  { name: 'frontend-developer', path: 'categories/01-core-development/frontend-developer.md' },
  { name: 'code-reviewer',      path: 'categories/04-quality-security/code-reviewer.md' },
  { name: 'ui-ux-tester',       path: 'categories/04-quality-security/ui-ux-tester.md' },
]

// Install command varies by harness — some are in-session slash commands,
// others are shell commands. See the full list below.
const SUPERPOWERS_INSTALL_INSTRUCTIONS = `
  Superpowers — https://github.com/obra/superpowers
  Install from INSIDE your AI coding session (command varies by harness):

    Claude Code  →  /plugin install superpowers@claude-plugins-official
    Cursor       →  /add-plugin superpowers
    Codex CLI    →  /plugins  then search "superpowers"
    Kimi Code    →  /plugins  then Marketplace > Superpowers
    OpenCode     →  Ask your agent to fetch and follow:
                    https://raw.githubusercontent.com/obra/superpowers/main/.opencode/INSTALL.md

  Some harnesses support a shell command instead:
    Gemini CLI   →  gemini extensions install https://github.com/obra/superpowers
    Hermes       →  hermes plugins install obra/superpowers --enable
    Pi           →  pi install git:github.com/obra/superpowers
    Antigravity  →  agy plugin install https://github.com/obra/superpowers
    Devin CLI    →  devin plugins install obra/superpowers
    Copilot CLI  →  copilot plugin marketplace add obra/superpowers-marketplace
                    copilot plugin install superpowers@superpowers-marketplace
    Grok         →  grok plugin install superpowers@xai-official --trust

  Full install guide: https://github.com/obra/superpowers#installation
`

// ─── Harness detection ────────────────────────────────────────────────────────

function detectHarness () {
  const home = os.homedir()
  const cwd  = process.cwd()
  if (fs.existsSync(path.join(home, '.claude')))                    return 'claude-code'
  if (fs.existsSync(path.join(home, '.cursor')))                    return 'cursor'
  if (fs.existsSync(path.join(home, '.gemini')))                    return 'gemini'
  if (fs.existsSync(path.join(home, '.config', 'hermes')))          return 'hermes'
  if (fs.existsSync(path.join(cwd,  '.github', 'copilot')))         return 'copilot'
  return null
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
  const result = spawnSync(
    'npx',
    ['skills', 'add', TASTE_SKILL_REPO, '--skill', TASTE_SKILL_NAME, '--yes'],
    { stdio: 'inherit', shell: true }
  )
  return result.status === 0
}

async function installAgentsForClaudeCode () {
  const agentsDir = path.join(os.homedir(), '.claude', 'agents')
  fs.mkdirSync(agentsDir, { recursive: true })

  let ok = true
  for (const agent of REQUIRED_AGENTS) {
    const url    = `${VOLTAGENT_RAW}/${agent.path}`
    const dest   = path.join(agentsDir, `${agent.name}.md`)
    process.stdout.write(`    ${agent.name} ... `)
    try {
      const content = await httpsGet(url)
      fs.writeFileSync(dest, content, 'utf8')
      console.log('installed')
    } catch (err) {
      console.log(`FAILED (${err.message})`)
      ok = false
    }
  }
  return ok
}

function printAgentManualInstructions () {
  const agentNames = REQUIRED_AGENTS.map(a => a.name).join(', ')
  console.log(`
  Agents — https://github.com/VoltAgent/awesome-claude-code-subagents

  Required: ${agentNames}

  Option A — Claude Code (recommended):
    claude plugin marketplace add VoltAgent/awesome-claude-code-subagents
    Then install the relevant category plugins, e.g.:
      claude plugin install voltagent-core-dev    # frontend-developer
      claude plugin install voltagent-qa-sec      # code-reviewer, ui-ux-tester
      claude plugin install voltagent-research    # market-researcher, research-analyst

  Option B — Interactive installer (no clone required):
    curl -sO https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/install-agents.sh
    chmod +x install-agents.sh && ./install-agents.sh

  Option C — Manual copy to ~/.claude/agents/ or .claude/agents/:
    Copy the relevant .md files from the VoltAgent repo into your agents directory.
`)
}

function printQuickStart (rel) {
  console.log(`
  ─────────────────────────────────────────────────────
  Quick start — new project:
    1. Fill in  ${rel}/templates/phase-1-kickoff.md  with your idea.
    2. Open your AI assistant with the project folder as working directory.
    3. Say: "Start Phase 1 using ${rel}/phase-1-bootstrap.md."

  Existing project (skip Phase 1):
    Share  ${rel}/phase-2-feature-dev.md  or  ${rel}/phase-2-single-pass.md
    and say: "Pick the next pending feature and run the Phase 2 cycle."

  Full docs:  https://khoaly2003.github.io/craft-kit
  ─────────────────────────────────────────────────────
`)
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const args      = process.argv.slice(2)
const force     = args.includes('--force')
const skipSetup = args.includes('--skip-setup')

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  craft-kit v${PKG.version}

  Usage
    npx github:KhoaLy2003/craft-kit [target-dir] [flags]

  Arguments
    target-dir    Directory to install the kit into  (default: ./kit)

  Flags
    --force         Overwrite an existing install
    --skip-setup    Copy kit files only; skip skill/agent setup
    --version       Print version and exit
    --help          Show this message

  Examples
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
  console.error('\n  Internal error: kit/ directory not found in this package.\n')
  process.exit(1)
}

// ─── Preflight ────────────────────────────────────────────────────────────────

if (fs.existsSync(target)) {
  const entries = fs.readdirSync(target)
  if (entries.length > 0 && !force) {
    console.error(`
  Target directory already exists and is not empty:
    ${target}

  To update an existing install:
    npx github:KhoaLy2003/craft-kit --force
`)
    process.exit(1)
  }
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

try {
  fs.mkdirSync(target, { recursive: true })
  fs.cpSync(src, target, { recursive: true, force: true })
} catch (err) {
  console.error(`\n  Copy failed: ${err.message}\n`)
  process.exit(1)
}

const rel = path.relative(process.cwd(), target) || '.'
console.log(`\n  Kit installed  →  ${rel}/\n`)

if (skipSetup) {
  printQuickStart(rel)
  process.exit(0)
}

// ─── Post-install: skills and agents ─────────────────────────────────────────

const harness = detectHarness()

// Non-interactive (CI, piped stdin): print everything, run nothing interactive.
if (!process.stdin.isTTY) {
  const harnessLabels = { 'claude-code': 'Claude Code', cursor: 'Cursor', gemini: 'Gemini CLI', hermes: 'Hermes', copilot: 'GitHub Copilot' }
  if (harness) {
    console.log(`  Detected harness: ${harnessLabels[harness] || harness}\n`)
  } else {
    console.log(`  No harness detected — see instructions below for your harness.\n`)
  }
  console.log(SUPERPOWERS_INSTALL_INSTRUCTIONS)
  console.log(`  design-taste-frontend — run this in your terminal:`)
  console.log(`    npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes\n`)
  printAgentManualInstructions()
  printQuickStart(rel)
  process.exit(0)
}

// ─── Interactive setup ────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

;(async () => {
  console.log(`  This kit needs skills and agents before Phase 1 can run.`)
  if (harness) {
    const labels = { 'claude-code': 'Claude Code', cursor: 'Cursor', gemini: 'Gemini CLI', hermes: 'Hermes', copilot: 'GitHub Copilot' }
    console.log(`  Detected harness: ${labels[harness] || harness}\n`)
  } else {
    console.log(`  No harness detected — instructions will be printed.\n`)
  }

  // 1. Superpowers — always instructional; installed from inside the AI session
  console.log(SUPERPOWERS_INSTALL_INSTRUCTIONS)

  // 2. taste-skill — automatable via npx skills add
  const ans2 = await prompt(rl, `  Install design-taste-frontend now via npx? [Y/n] `)
  if (ans2.trim().toLowerCase() !== 'n') {
    console.log('')
    const ok = installTasteSkill()
    console.log(ok
      ? `\n  design-taste-frontend installed.\n`
      : `\n  Install failed. Run manually:\n    npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes\n`
    )
  } else {
    console.log(`\n  Skipped. Run when ready:\n    npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes\n`)
  }

  // 3. Agents
  if (harness === 'claude-code') {
    const ans3 = await prompt(rl, `  Download and install required agents to ~/.claude/agents/? [Y/n] `)
    if (ans3.trim().toLowerCase() !== 'n') {
      console.log('')
      const ok = await installAgentsForClaudeCode()
      console.log(ok
        ? `\n  Agents installed to ~/.claude/agents/\n`
        : `\n  Some agents failed. Install the rest manually (see below).\n`
      )
      if (!ok) printAgentManualInstructions()
    } else {
      printAgentManualInstructions()
    }
  } else {
    printAgentManualInstructions()
  }

  rl.close()
  printQuickStart(rel)
  process.exit(0)
})()
