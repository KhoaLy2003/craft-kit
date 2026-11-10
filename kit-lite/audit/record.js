#!/usr/bin/env node
// craft-kit lite: conversation audit recorder (Claude Code hook).
//
//   node record.js prompt   UserPromptSubmit: append the user's prompt, verbatim
//   node record.js stop     Stop:             append the assistant's final reply, quoted
//   node record.js end      SessionEnd:       append a one-line summary
//
// Reads the hook payload (JSON) from stdin and appends to
// <project>/docs/audit/<YYYY-MM-DD>-<session>.md. It never throws and always exits 0,
// so a recorder problem can never block the conversation.

'use strict'

const fs = require('fs')
const path = require('path')

const TAG_LINE = /^[ \t]*\[audit\][ \t]*(.*)$/m
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
function splitTag (text) {
  const m = TAG_LINE.exec(text)
  if (!m) return { body: text, tag: '(missing)' }
  const body = (text.slice(0, m.index) + text.slice(m.index + m[0].length)).replace(/\n{3,}/g, '\n\n').trim()
  return { body, tag: m[1].trim() || '(missing)' }
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

function record (mode, payload) {
  const { file, sid, root } = auditFile(payload)
  const doc = existing(file)
  const now = new Date()
  let add = ''

  if (mode === 'prompt') {
    const text = typeof payload.prompt === 'string' ? payload.prompt : ''
    add = `## Turn ${userTurns(doc) + 1} · ${timeOf(now)} · user\n${text.replace(/\n+$/, '')}\n\n`
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

function main () {
  try {
    const raw = readStdin()
    const payload = raw.trim() ? JSON.parse(raw) : {}
    record(process.argv[2], payload && typeof payload === 'object' ? payload : {})
  } catch { /* never block the conversation */ }
  process.exit(0)
}

if (require.main === module) main()

module.exports = { quote, splitTag, lastAssistantText, record }
