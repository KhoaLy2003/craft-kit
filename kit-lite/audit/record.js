#!/usr/bin/env node
// craft-kit lite: conversation audit recorder (Claude Code hook).
//
//   node record.js prompt   UserPromptSubmit: append the user's prompt, quoted
//   node record.js stop     Stop:             append the assistant's final reply, quoted
//   node record.js end      SessionEnd:       append a one-line summary
//
// Reads the hook payload (JSON) from stdin and appends to
// <project>/docs/audit/<YYYY-MM-DD>-<session>.md. It never throws and always exits 0, so a recorder
// problem can never block the conversation; failures are noted in docs/audit/.errors.log.

'use strict'

const fs = require('fs')
const path = require('path')

const TAG_LINE = /^[ \t]*\[audit\][ \t]*(.*)$/
const USER_HEADING = /^## Turn (\d+) · [^\n]* · user$/gm

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

// Split the reply into its text and the `[audit] key=value ...` tag line the AI was asked to add.
// Only the last non-empty line counts, so an earlier line that merely mentions the format stays in the body.
function splitTag (text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n')
  const m = TAG_LINE.exec(lines[lines.length - 1])
  if (!m) return { body: text, tag: '(missing)' }
  return { body: lines.slice(0, -1).join('\n').trim(), tag: m[1].trim() || '(missing)' }
}

// Last assistant message with text in a Claude Code transcript (JSON lines).
function lastAssistantText (transcriptPath) {
  let raw
  try { raw = fs.readFileSync(transcriptPath, 'utf8') } catch { return '' }
  const lines = raw.split('\n')
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue
    let entry
    try { entry = JSON.parse(lines[i]) } catch { continue }
    const msg = entry && entry.message
    if (!entry || entry.type !== 'assistant' || !msg) continue
    const content = msg.content
    const text = typeof content === 'string'
      ? content
      : Array.isArray(content) ? content.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text).join('\n\n') : ''
    if (text.trim()) return text
  }
  return ''
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

function write (mode, payload, file, sid, root) {
  const doc = existing(file)
  const now = new Date()
  let add = ''

  if (mode === 'prompt') {
    const text = typeof payload.prompt === 'string' ? payload.prompt : ''
    add = `## Turn ${userTurns(doc) + 1} · ${timeOf(now)} · user\n${quote(text)}\n\n`
  } else if (mode === 'stop') {
    const text = (typeof payload.last_assistant_message === 'string' && payload.last_assistant_message.trim())
      ? payload.last_assistant_message
      : lastAssistantText(payload.transcript_path)
    if (!text.trim()) return
    const turn = Math.max(userTurns(doc), 1)
    if (new RegExp(`^## Turn ${turn} · [^\\n]* · assistant$`, 'm').test(doc)) return   // one assistant record per turn
    const { body, tag } = splitTag(text)
    add = `## Turn ${turn} · ${timeOf(now)} · assistant\n**Tag:** ${tag}\n\n${quote(body)}\n\n`
  } else if (mode === 'end') {
    if (!doc) return
    const turns = userTurns(doc)
    const missing = (doc.match(/^\*\*Tag:\*\* \(missing\)$/gm) || []).length
    add = `## Session end · ${timeOf(now)}\nTurns: ${turns} · Missing tags: ${missing}\n`
  } else {
    return
  }

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

module.exports = { quote, splitTag, lastAssistantText, record }
