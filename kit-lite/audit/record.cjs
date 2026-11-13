#!/usr/bin/env node
// craft-kit lite: conversation audit recorder (Claude Code hook).
//
//   node record.cjs prompt   UserPromptSubmit: append the user's prompt, quoted
//   node record.cjs stop     Stop:             append the assistant's messages for the turn, quoted
//   node record.cjs end      SessionEnd:       append a one-line summary
//
// The .cjs extension is deliberate: in a project whose package.json has "type": "module" a .js
// file is loaded as ESM and `require` below would throw before any hook code runs.
//
// Reads the hook payload (JSON) from stdin and appends to
// <project>/docs/audit/<YYYY-MM-DD>-<session>.md. It never throws and always exits 0, so a recorder
// problem can never block the conversation; failures are noted in docs/audit/.errors.log.
//
// A turn that runs several steps (Build and Wrap-up follow an approval without another prompt) is
// recorded as ONE assistant record that holds every assistant message of the turn, separated by
// rules. Its Tag is the step banners (`## Step N — Name | Gate: g`) found in those messages, in
// order, so the trail of steps is visible without the AI adding any extra line.

'use strict'

const fs = require('fs')
const path = require('path')

const BANNER = /^[ \t]*#{1,6}[ \t]*Step[ \t]+(\d)[ \t]*[—–-][^|\n]*\|[ \t]*Gate:[ \t]*(none|soft|hard)\b/gim
const USER_HEADING = /^## Turn (\d+) · [^\n]* · user$/gm
const NO_STEP = '(no step banner)'

const pad = n => String(n).padStart(2, '0')
const dateOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const timeOf = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

function readStdin () {
  try { return fs.readFileSync(0, 'utf8') } catch { return '' }
}

// Prefix every line with "> " so reply text (headings, fences) can never look like a new record.
function quote (text) {
  return text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n').map(l => (l ? '> ' + l : '>')).join('\n')
}

// Step banners in a message, in order: ['step=2 gate=none', ...].
function bannersOf (text) {
  return [...text.replace(/\r\n/g, '\n').matchAll(BANNER)].map(m => `step=${m[1]} gate=${m[2].toLowerCase()}`)
}

// Tag for a turn: the banners across its messages, consecutive repeats collapsed.
function tagOf (messages) {
  const trail = []
  for (const m of messages) for (const b of bannersOf(m)) if (trail[trail.length - 1] !== b) trail.push(b)
  return trail.length ? trail.join(' → ') : NO_STEP
}

function textOf (content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text).join('\n\n')
}

// A real user prompt, as opposed to a tool result that Claude Code also stores as a "user" entry.
function isPrompt (entry) {
  if (!entry || entry.type !== 'user' || entry.isMeta || !entry.message) return false
  const c = entry.message.content
  if (typeof c === 'string') return c.trim() !== ''
  return Array.isArray(c) && !c.some(b => b && b.type === 'tool_result') && textOf(c).trim() !== ''
}

// Every assistant message with text since the last user prompt in a Claude Code transcript (JSON lines),
// oldest first.
function turnMessages (transcriptPath) {
  let raw
  try { raw = fs.readFileSync(transcriptPath, 'utf8') } catch { return [] }
  const lines = raw.split('\n')
  const out = []
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue
    let entry
    try { entry = JSON.parse(lines[i]) } catch { continue }
    if (isPrompt(entry)) break
    if (!entry || entry.type !== 'assistant' || !entry.message) continue
    const text = textOf(entry.message.content)
    if (text.trim()) out.unshift(text)
  }
  return out
}

function auditFile (payload) {
  const root = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd()
  const sid = String(payload.session_id || 'unknown').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 8) || 'unknown'
  const dir = path.join(root, 'docs', 'audit')
  fs.mkdirSync(dir, { recursive: true })
  return { file: path.join(dir, `${dateOf(new Date())}-${sid}.md`), sid, root }
}

function existing (file) {
  try { return fs.readFileSync(file, 'utf8') } catch { return '' }
}

function header (project, sid) {
  return `# Audit — ${project} — ${dateOf(new Date())} — session ${sid}\n\n`
}

function userTurns (doc) {
  return (doc.match(USER_HEADING) || []).length
}

// Serialise the read-count-append cycle so two hooks firing together cannot reuse a turn number
// or both pass the one-assistant-record-per-turn check. Gives up after ~1s and proceeds unlocked.
function withLock (file, fn) {
  const lock = file + '.lock'
  let held = false
  for (let i = 0; i < 40 && !held; i++) {
    try { fs.closeSync(fs.openSync(lock, 'wx')); held = true } catch {
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 5000) fs.unlinkSync(lock) } catch { /* raced */ }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25)
    }
  }
  try { return fn() } finally { if (held) { try { fs.unlinkSync(lock) } catch { /* gone */ } } }
}

function record (mode, payload) {
  const { file, sid, root } = auditFile(payload)
  withLock(file, () => write(mode, payload, file, sid, root))
}

// The turn's assistant messages. The transcript may not yet hold the final message when the hook
// fires, so the payload's own last message is appended when the transcript does not end with it.
function messagesFor (payload) {
  const messages = turnMessages(payload.transcript_path)
  const last = typeof payload.last_assistant_message === 'string' ? payload.last_assistant_message : ''
  if (last.trim() && (!messages.length || messages[messages.length - 1].trim() !== last.trim())) messages.push(last)
  return messages
}

// One assistant record for the current turn, or '' when there is nothing to record or the turn already has one.
function assistantRecord (doc, payload, now) {
  const messages = messagesFor(payload)
  if (!messages.length) return ''
  const turn = Math.max(userTurns(doc), 1)
  if (new RegExp(`^## Turn ${turn} · [^\\n]* · assistant$`, 'm').test(doc)) return ''   // one assistant record per turn
  const body = messages.map(quote).join('\n>\n> ---\n>\n')
  return `## Turn ${turn} · ${timeOf(now)} · assistant\n**Tag:** ${tagOf(messages)}\n**Messages:** ${messages.length}\n\n${body}\n\n`
}

function write (mode, payload, file, sid, root) {
  let doc = existing(file)
  const now = new Date()
  let add = ''

  if (mode === 'prompt') {
    const text = typeof payload.prompt === 'string' ? payload.prompt : ''
    add = `## Turn ${userTurns(doc) + 1} · ${timeOf(now)} · user\n${quote(text)}\n\n`
  } else if (mode === 'stop') {
    add = assistantRecord(doc, payload, now)
  } else if (mode === 'end') {
    if (!doc) return
    // The Stop hook may never have fired for the last turn (crash, kill, window closed): back-fill it from the transcript.
    add = assistantRecord(doc, payload, now)
    doc += add
    const turns = userTurns(doc)
    const noStep = (doc.match(/^\*\*Tag:\*\* \(no step banner\)$/gm) || []).length
    add += `## Session end · ${timeOf(now)}\nTurns: ${turns} · Replies without a step banner: ${noStep}\n`
  } else {
    return
  }
  if (!add) return

  fs.appendFileSync(file, (doc ? '' : header(path.basename(root), sid)) + add, 'utf8')
}

// A recorder failure must never block the conversation, but it must not vanish either:
// note it in docs/audit/.errors.log (best effort) so a silently missing audit can be diagnosed.
function logError (err) {
  try {
    const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
    const dir = path.join(root, 'docs', 'audit')
    fs.mkdirSync(dir, { recursive: true })
    fs.appendFileSync(path.join(dir, '.errors.log'), `${dateOf(new Date())} ${timeOf(new Date())} ${process.argv[2] || ''} ${err && err.stack ? err.stack : err}\n`, 'utf8')
  } catch { /* nothing left to try */ }
}

function main () {
  try {
    const raw = readStdin()
    const payload = raw.trim() ? JSON.parse(raw) : {}
    record(process.argv[2], payload && typeof payload === 'object' ? payload : {})
  } catch (err) { logError(err) }
  process.exit(0)
}

if (require.main === module) main()

module.exports = { quote, bannersOf, tagOf, turnMessages, record }
