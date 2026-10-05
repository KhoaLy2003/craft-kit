#!/usr/bin/env node

'use strict'

const fs        = require('fs')
const path      = require('path')
const https     = require('https')
const readline  = require('readline')
const { spawnSync } = require('child_process')

const PKG = require('../package.json')

// ─── ANSI helpers (stripped automatically when stdout is not a TTY) ───────────

const TTY = Boolean(process.stdout.isTTY)
const esc = TTY ? (c, s) => `\x1b[${c}m${s}\x1b[0m` : (_, s) => s

const bold    = s => esc('1',    s)
const dim     = s => esc('2',    s)
const cyan    = s => esc('36',   s)
const yellow  = s => esc('33',   s)
const red     = s => esc('31',   s)
const bCyan   = s => esc('1;36', s)
const bGreen  = s => esc('1;32', s)
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
// Skills (2 via npx): design-taste-frontend https://github.com/Leonxlnx/taste-skill,
//                     evon:ui-ux (optional, admin site workflow) https://github.com/evondev/evondevKit
//   → installed via `npx skills add` (cross-harness).
//
// Agents (6):       https://github.com/VoltAgent/awesome-claude-code-subagents
//   → downloaded as .md files into <cwd>/.agents/agents/ (project-scoped).

const TASTE_SKILL_REPO = 'https://github.com/Leonxlnx/taste-skill'
const TASTE_SKILL_NAME = 'design-taste-frontend'
const TASTE_SKILL_CMD  = `npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes`
const EVON_SKILL_REPO  = 'https://github.com/evondev/evondevKit'
const EVON_SKILL_NAME  = 'ui-ux'
const EVON_SKILL_CMD   = `npx skills add ${EVON_SKILL_REPO} --skill "${EVON_SKILL_NAME}" --yes`
const VOLTAGENT_RAW    = 'https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main'

const REQUIRED_AGENTS = [
  { name: 'market-researcher',  path: 'categories/10-research-analysis/market-researcher.md' },
  { name: 'research-analyst',   path: 'categories/10-research-analysis/research-analyst.md' },
  { name: 'frontend-developer', path: 'categories/01-core-development/frontend-developer.md' },
  { name: 'backend-developer',  path: 'categories/01-core-development/backend-developer.md' },
  { name: 'code-reviewer',      path: 'categories/04-quality-security/code-reviewer.md' },
  { name: 'ui-ux-tester',       path: 'categories/04-quality-security/ui-ux-tester.md' },
]

const VERSION_FILE  = '.craft-kit-version'
const MANIFEST_FILE = '.craft-kit-manifest.json'
const KNOWN_FLAGS   = new Set(['--force', '--skip-setup', '--help', '-h', '--version', '-v'])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function die (msg) {
  console.error(`\n  ${SYM.cross}  ${msg}\n`)
  process.exit(1)
}

const readKitFile = (target, name) => { try { return fs.readFileSync(path.join(target, name), 'utf8') } catch { return null } }

function httpsGet (url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'craft-kit-installer' }, timeout: 15_000 }, res => {
      const { statusCode, headers } = res
      if (statusCode >= 300 && statusCode < 400 && headers.location) {
        res.resume()
        if (redirectsLeft <= 0) return reject(new Error(`Too many redirects fetching ${url}`))
        return httpsGet(new URL(headers.location, url).href, redirectsLeft - 1).then(resolve, reject)
      }
      if (statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${statusCode} fetching ${url}`))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end',  () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', reject)
    })
    req.on('timeout', () => req.destroy(new Error(`Timed out fetching ${url}`)))
    req.on('error', reject)
  })
}

function installSkill (repo, name) {
  // shell: true is required on Windows (npx resolves to npx.cmd).
  // On Unix it triggers DEP0190 because args are concatenated, not escaped.
  const result = spawnSync(
    'npx',
    ['skills', 'add', repo, '--skill', name, '--yes'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  )
  return result.status === 0
}

// Prompt for one optional `npx skills add` install; `yes` is the Y/n prompt from interactiveSetup.
async function offerSkill (yes, { question, display, repo, name, cmd }) {
  if (await yes(question)) {
    console.log('')
    if (installSkill(repo, name)) {
      console.log(`\n  ${SYM.check}  ${bGreen(display)} installed.\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Install failed. Run manually:\n     ${dim(cmd)}\n`)
    }
  } else {
    console.log(`\n  Skipped. Run when ready:\n    ${dim(cmd)}\n`)
  }
}

async function installAgents (agentsDir) {
  fs.mkdirSync(agentsDir, { recursive: true })
  let ok = true
  for (const agent of REQUIRED_AGENTS) {
    process.stdout.write(`    ${SYM.down} ${agent.name.padEnd(22)}`)
    try {
      const content = await httpsGet(`${VOLTAGENT_RAW}/${agent.path}`)
      fs.writeFileSync(path.join(agentsDir, `${agent.name}.md`), content, 'utf8')
      console.log(SYM.check)
    } catch (err) {
      console.log(`${SYM.cross}  ${dim(err.message)}`)
      ok = false
    }
  }
  return ok
}

// ─── Kit files, manifest, stale cleanup ──────────────────────────────────────

// Everything under kit/ except resource/ (dev-only) and the top-level CHANGELOG.md.
function listKitFiles (dir, base = dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    const rel = path.relative(base, abs).split(path.sep).join('/')
    if (rel === 'resource' || rel === 'CHANGELOG.md') continue
    if (entry.isDirectory()) files.push(...listKitFiles(abs, base))
    else if (entry.isFile()) files.push(rel)
  }
  return files.sort()
}

function readManifest (target) {
  try {
    const list = JSON.parse(readKitFile(target, MANIFEST_FILE))
    return Array.isArray(list) ? list.filter(f => typeof f === 'string') : null
  } catch { return null }
}

// Delete a previously installed file and prune directories it leaves empty.
// Manifest entries that resolve outside the target are ignored.
function removeStale (target, relFile) {
  const abs = path.resolve(target, relFile)
  const r = path.relative(target, abs)
  if (!r || r === '..' || r.startsWith('..' + path.sep) || path.isAbsolute(r)) return false
  try { fs.rmSync(abs, { force: true }) } catch { return false }
  for (let d = path.dirname(abs); d !== target; d = path.dirname(d)) {
    try { fs.rmdirSync(d) } catch { break }   // throws while the directory is non-empty
  }
  return true
}

// ─── Output blocks ────────────────────────────────────────────────────────────

function section (n, title, note = '') {
  console.log(`\n  ${HR}`)
  console.log(`  ${bold(`Step ${n} of 3`)}  ${SYM.dot}  ${bCyan(title)}${note ? '  ' + dim(note) : ''}`)
  console.log(`  ${HR}\n`)
}

const HARNESS_INSTALL = [
  ['Claude Code', cyan('/plugin install superpowers@claude-plugins-official')],
  ['Cursor',      cyan('/add-plugin superpowers')],
  ['Codex CLI',   `${cyan('/plugins')}  then search "superpowers"`],
  ['Kimi Code',   `${cyan('/plugins')}  then Marketplace > Superpowers`],
  ['OpenCode',    `Ask your agent to fetch and follow:\n                 ${dim('https://raw.githubusercontent.com/obra/superpowers/main/.opencode/INSTALL.md')}`],
]

function printSuperpowers () {
  section(1, 'Superpowers', '(installed inside your AI session)')
  console.log(`  Superpowers — https://github.com/obra/superpowers`)
  console.log(`  Install from INSIDE your AI coding session. Command varies by harness:\n`)
  for (const [name, how] of HARNESS_INSTALL) console.log(`    ${name.padEnd(11)}  ${SYM.arrow}  ${how}`)
  console.log(`\n  Full guide: ${dim('https://github.com/obra/superpowers#installation')}`)
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
    Share  ${yellow(rel + '/phase-2.md')}  and say:  ${yellow('"Run Phase 2 using ' + rel + '/phase-2.md."')}

  ${SYM.dot} ${bold('Bug fix')}
    Share  ${yellow(rel + '/phase-bug-fix.md')}  and describe the problem

  ${SYM.dot} ${bold('Admin site')}  ${dim('(after Phase 2 has shipped)')}
    Share  ${yellow(rel + '/phase-admin.md')}  and say:  ${yellow('"Build the admin site using ' + rel + '/phase-admin.md."')}

  ${SYM.dot} ${bold('Docs')}  ${dim('https://khoaly2003.github.io/craft-kit')}
  ${HR}
`)
}

function usage () {
  return `
  ${bold('craft-kit')} v${PKG.version}

  ${bold('Usage')}
    npx github:KhoaLy2003/craft-kit [target-dir] [flags]

  ${bold('Arguments')}
    target-dir    Directory to install the kit into  (default: ./kit)

  ${bold('Flags')}
    --force         Update an existing install (overwrites kit files, removes
                    kit files dropped since the last install)
    --skip-setup    Copy kit files only; skip skill/agent setup
    --version       Print version and exit
    --help          Show this message

  ${bold('Examples')}
    npx github:KhoaLy2003/craft-kit                      install to ./kit/
    npx github:KhoaLy2003/craft-kit ./my-project/kit     install to a custom path
    npx github:KhoaLy2003/craft-kit --force              update an existing install
    npx github:KhoaLy2003/craft-kit --skip-setup         kit files only, no setup prompt
`
}

// ─── Interactive setup (TTY) ──────────────────────────────────────────────────

async function interactiveSetup () {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = question => new Promise(resolve => rl.question(`  ${bYellow('?')}  ${question} ${dim('[Y/n]')} `, resolve))
  const yes = async question => (await ask(question)).trim().toLowerCase() !== 'n'

  console.log(`  ${dim('Three quick steps to unlock the full Phase 1–2 workflow.')}`)
  printSuperpowers()

  section(2, 'Design skills', '(installed via npx)')
  await offerSkill(yes, {
    question: 'Install design-taste-frontend now via npx?',
    display: 'design-taste-frontend',
    repo: TASTE_SKILL_REPO,
    name: TASTE_SKILL_NAME,
    cmd: TASTE_SKILL_CMD,
  })

  console.log(`  ${dim('Optional: evon:ui-ux builds admin site screens (used by the admin site workflow).')}\n`)
  await offerSkill(yes, {
    question: 'Also install evon:ui-ux?',
    display: 'evon:ui-ux',
    repo: EVON_SKILL_REPO,
    name: EVON_SKILL_NAME,
    cmd: EVON_SKILL_CMD,
  })

  section(3, 'Specialist agents')
  const agentsDir = path.join(process.cwd(), '.agents', 'agents')
  const agentsRel = path.relative(process.cwd(), agentsDir)
  if (await yes(`Download agents to ${bold(agentsRel + '/')}?`)) {
    console.log('')
    if (await installAgents(agentsDir)) {
      console.log(`\n  ${SYM.check}  All agents installed to ${bold(agentsRel + '/')}\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Some agents failed. Install the rest manually:\n`)
      printAgentManualInstructions()
    }
  } else {
    printAgentManualInstructions()
  }
  rl.close()
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
  const args = process.argv.slice(2)

  const unknown = args.filter(a => a.startsWith('-') && !KNOWN_FLAGS.has(a))
  if (unknown.length) {
    console.error(`\n  ${SYM.cross}  Unknown flag${unknown.length > 1 ? 's' : ''}: ${unknown.join(' ')}`)
    console.error(usage())
    process.exit(1)
  }
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage())
    return
  }
  if (args.includes('--version') || args.includes('-v')) {
    console.log(PKG.version)
    return
  }

  const force     = args.includes('--force')
  const skipSetup = args.includes('--skip-setup')
  const targetArg = args.find(a => !a.startsWith('-'))
  const target    = targetArg ? path.resolve(process.cwd(), targetArg) : path.join(process.cwd(), 'kit')
  const rel       = path.relative(process.cwd(), target) || '.'
  const src       = path.join(__dirname, '..', 'kit')

  if (!fs.existsSync(src)) die('Internal error: kit/ directory not found in this package.')

  // Preflight
  let existing = []
  try {
    existing = fs.readdirSync(target)
  } catch (err) {
    if (err.code === 'ENOTDIR') die(`Cannot install into ${bold(rel)}: a file exists where a directory is needed.`)
    if (err.code !== 'ENOENT') die(`Cannot read ${bold(rel)}: ${err.message}`)
  }
  const prevVersion  = (readKitFile(target, VERSION_FILE) || '').trim() || null
  const prevManifest = readManifest(target)

  if (existing.length > 0 && !force) {
    const versionLine = !prevVersion
      ? `  ${dim('Installed:')}  ${dim('unknown version')}`
      : prevVersion === PKG.version
        ? `  ${dim('Installed:')}  v${prevVersion}  ${dim('(already up to date)')}`
        : `  ${dim('Installed:')}  ${yellow('v' + prevVersion)}  ${SYM.arrow}  ${bold('v' + PKG.version)}  ${dim('(update available)')}`
    console.error(`
  ${SYM.cross}  ${bold(rel + '/')} already exists.
${versionLine}

  To upgrade:
     npx github:KhoaLy2003/craft-kit --force
`)
    process.exit(1)
  }

  printBanner()

  // Copy
  const files = listKitFiles(src)
  try {
    for (const file of files) {
      const dest = path.join(target, ...file.split('/'))
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(path.join(src, ...file.split('/')), dest)
    }
  } catch (err) {
    die(`Copy failed: ${err.message}`)
  }

  // Drop kit files that earlier versions installed and this version no longer ships.
  let removed = 0
  if (force && prevManifest) {
    const current = new Set(files)
    for (const file of prevManifest) {
      if (!current.has(file) && removeStale(target, file)) removed++
    }
  }

  fs.writeFileSync(path.join(target, VERSION_FILE), PKG.version + '\n', 'utf8')
  fs.writeFileSync(path.join(target, MANIFEST_FILE), JSON.stringify(files, null, 2) + '\n', 'utf8')

  if (force && prevVersion && prevVersion !== PKG.version) {
    console.log(`  ${SYM.check}  Kit upgraded  ${SYM.arrow}  ${dim('v' + prevVersion)} ${SYM.arrow} ${bold('v' + PKG.version)}  ${dim('(' + rel + '/')}\n`)
    console.log(`  ${dim('What changed:')}  ${cyan('https://github.com/KhoaLy2003/craft-kit/blob/main/kit/CHANGELOG.md')}\n`)
  } else {
    console.log(`  ${SYM.check}  Kit installed  ${SYM.arrow}  ${bold(rel + '/')}\n`)
  }
  if (removed > 0) {
    console.log(`  ${dim(`Removed ${removed} file${removed > 1 ? 's' : ''} no longer part of the kit.`)}\n`)
  } else if (force && !prevManifest && existing.length > 0) {
    console.log(`  ${dim('No install manifest found: files renamed or removed since an older version may linger — delete the kit folder and reinstall for a clean copy.')}\n`)
  }

  // Post-install: skills and agents
  if (!skipSetup) {
    if (process.stdin.isTTY) {
      await interactiveSetup()
    } else {
      // Non-interactive (CI / piped stdin): print everything, run nothing.
      printSuperpowers()
      section(2, 'Design skills')
      console.log(`  Run in your terminal:\n    ${TASTE_SKILL_CMD}`)
      console.log(`\n  Optional — admin site workflow (evon:ui-ux):\n    ${EVON_SKILL_CMD}`)
      section(3, 'Specialist agents')
      printAgentManualInstructions()
    }
  }
  printQuickStart(rel)
}

main().catch(err => die(err.message))
