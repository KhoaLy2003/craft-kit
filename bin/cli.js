#!/usr/bin/env node

'use strict'

const fs        = require('fs')
const path      = require('path')
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
  dot   : dim('·'),
}

const HR = dim('─'.repeat(52))

// ─── Dependency sources ───────────────────────────────────────────────────────
//
// Superpowers skills (8):  https://github.com/obra/superpowers
//   → installed as a plugin inside your AI harness; not a shell command.
//
// Skills (2 via npx): design-taste-frontend https://github.com/Leonxlnx/taste-skill
//                     archify (diagram generation) https://github.com/tt-a1i/archify
//   → installed via `npx skills add` (cross-harness).
//
// Skills (4 via npx): code-review-and-quality, code-simplification, security-and-hardening,
//                     performance-optimization — https://github.com/addyosmani/agent-skills
//   → installed via `npx skills add` (cross-harness).

const TASTE_SKILL_REPO = 'https://github.com/Leonxlnx/taste-skill'
const TASTE_SKILL_NAME = 'design-taste-frontend'
const TASTE_SKILL_CMD  = `npx skills add ${TASTE_SKILL_REPO} --skill "${TASTE_SKILL_NAME}" --yes`
const ARCHIFY_SKILL_REPO = 'https://github.com/tt-a1i/archify'
const ARCHIFY_SKILL_NAME = 'archify'
const ARCHIFY_SKILL_CMD  = `npx skills add ${ARCHIFY_SKILL_REPO} --skill "${ARCHIFY_SKILL_NAME}" --yes`
const REVIEW_SKILLS_REPO = 'https://github.com/addyosmani/agent-skills'
const REVIEW_SKILL_NAMES = ['code-review-and-quality', 'code-simplification', 'security-and-hardening', 'performance-optimization']
const REVIEW_SKILLS_CMD  = REVIEW_SKILL_NAMES.map(n => `npx skills add ${REVIEW_SKILLS_REPO} --skill "${n}" --yes`).join('\n    ')

const VERSION_FILE  = '.craft-kit-version'
const MANIFEST_FILE = '.craft-kit-manifest.json'
const KNOWN_FLAGS   = new Set(['--force', '--skip-setup', '--help', '-h', '--version', '-v'])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function die (msg) {
  console.error(`\n  ${SYM.cross}  ${msg}\n`)
  process.exit(1)
}

const readKitFile = (target, name) => { try { return fs.readFileSync(path.join(target, name), 'utf8') } catch { return null } }

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
async function offerSkill (yes, { question, display, repo, names, cmd }) {
  if (await yes(question)) {
    console.log('')
    const results = names.map(n => installSkill(repo, n))
    if (results.every(Boolean)) {
      console.log(`\n  ${SYM.check}  ${bGreen(display)} installed.\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Install failed. Run manually:\n     ${dim(cmd)}\n`)
    }
  } else {
    console.log(`\n  Skipped. Run when ready:\n    ${dim(cmd)}\n`)
  }
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

  ${SYM.dot} ${bold('Not sure where to start?')}
    Say:  ${yellow('"Start using ' + rel + '/START.md."')}

  ${SYM.dot} ${bold('New project')}
    ${cyan('1.')} Copy ${yellow(rel + '/templates/phase-1-kickoff.md')} to ${yellow('docs/phase-1-kickoff.md')} and fill it in with your idea
    ${cyan('2.')} Open your AI assistant with this folder as the working directory
    ${cyan('3.')} Say:  ${yellow('"Start Phase 1 using ' + rel + '/phase-1-bootstrap.md."')}

  ${SYM.dot} ${bold('Existing project')}  ${dim('(skip Phase 1)')}
    Share  ${yellow(rel + '/phase-2.md')}  and say:  ${yellow('"Run Phase 2 using ' + rel + '/phase-2.md."')}
    If the project predates this kit version (missing docs/backlog.json, docs/data-model.md or docs/flows.md), first say:  ${yellow('"Run the project upgrade using ' + rel + '/phase-upgrade.md."')}
    If the codebase has no kit documents yet (no docs/constitution.md or docs/architecture.md), first say:  ${yellow('"Run Adopt using ' + rel + '/phase-adopt.md."')}

  ${SYM.dot} ${bold('Bug fix')}
    Share  ${yellow(rel + '/phase-bug-fix.md')}  and describe the problem

  ${SYM.dot} ${bold('Admin site')}  ${dim('(after Phase 2 has shipped)')}
    Share  ${yellow(rel + '/phase-admin.md')}  and say:  ${yellow('"Build the admin site using ' + rel + '/phase-admin.md."')}

  ${SYM.dot} ${bold('Developer onboarding')}  ${dim('(any time)')}
    Share  ${yellow(rel + '/phase-onboarding.md')}  and say:  ${yellow('"Run developer onboarding using ' + rel + '/phase-onboarding.md."')}

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
  // Ctrl+D closes readline and would leave a pending question unanswered, so the process exits
  // before the quick start prints. A closed input answers "n".
  let closed = false
  rl.on('close', () => { closed = true })
  const ask = question => new Promise(resolve => {
    if (closed) return resolve('n')
    rl.once('close', () => resolve('n'))
    rl.question(`  ${bYellow('?')}  ${question} ${dim('[Y/n]')} `, resolve)
  })
  const yes = async question => (await ask(question)).trim().toLowerCase() !== 'n'

  console.log(`  ${dim('Three quick steps to unlock the full Phase 1–2 workflow.')}`)
  printSuperpowers()

  section(2, 'Design skills', '(installed via npx)')
  await offerSkill(yes, {
    question: 'Install design-taste-frontend now via npx?',
    display: 'design-taste-frontend',
    repo: TASTE_SKILL_REPO,
    names: [TASTE_SKILL_NAME],
    cmd: TASTE_SKILL_CMD,
  })
  await offerSkill(yes, {
    question: 'Install archify (diagram generation) now via npx?',
    display: 'archify',
    repo: ARCHIFY_SKILL_REPO,
    names: [ARCHIFY_SKILL_NAME],
    cmd: ARCHIFY_SKILL_CMD,
  })

  section(3, 'Review skills', '(installed via npx)')
  await offerSkill(yes, {
    question: 'Install the 4 review skills (code-review-and-quality, code-simplification, security-and-hardening, performance-optimization) now via npx?',
    display: 'Review skills',
    repo: REVIEW_SKILLS_REPO,
    names: REVIEW_SKILL_NAMES,
    cmd: REVIEW_SKILLS_CMD,
  })
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

  // Existing project missing documents the current kit expects: point at the single upgrade entry point.
  // Keep this list in step with the registry in kit/phase-upgrade.md. File-existence checks only, except the constitution's `## Verification Commands` heading.
  // Assumes the kit sits directly under the project root (default ./kit); a deeper custom target yields no hint.
  const docsDir = path.join(path.resolve(target, '..'), 'docs')
  const has = f => fs.existsSync(path.join(docsDir, f))
  const missing = []
  if (has('roadmap.md') && !has('backlog.json')) missing.push('docs/backlog.json')
  if (has('architecture.md')) {
    for (const f of ['data-model.md', 'flows.md']) if (!has(f)) missing.push('docs/' + f)
  }
  if (has('constitution.md')) {
    const constitution = fs.readFileSync(path.join(docsDir, 'constitution.md'), 'utf8')
    if (!/^## Verification Commands\s*$/m.test(constitution)) missing.push('the Verification Commands section in docs/constitution.md')
  }
  if (missing.length > 0) {
    console.log(`  ${dim('Existing project detected: missing ' + missing.join(', ') + '. Run: "Run the project upgrade using ' + rel + '/phase-upgrade.md."')}\n`)
  }

  // Post-install: skills
  if (!skipSetup) {
    if (process.stdin.isTTY) {
      await interactiveSetup()
    } else {
      // Non-interactive (CI / piped stdin): print everything, run nothing.
      printSuperpowers()
      section(2, 'Design skills')
      console.log(`  Run in your terminal:\n    ${TASTE_SKILL_CMD}`)
      console.log(`\n  Diagram generation (archify):\n    ${ARCHIFY_SKILL_CMD}`)
      section(3, 'Review skills')
      console.log(`  Run in your terminal:\n    ${REVIEW_SKILLS_CMD}`)
    }
  }
  printQuickStart(rel)
}

main().catch(err => die(err.message))
