// Copied into <site>/.vitepress/ by view-docs.js on every run; do not edit the copy.
// Sidebar, nav and title come from generated.json (rewritten when docs/ changes).
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import generated from './generated.json'

const here = dirname(fileURLToPath(import.meta.url))

// Tags that may pass through from the documents. Anything else (`<feature-slug>`,
// `<Component>`) is escaped, because Vue would otherwise try to compile it and fail.
const ALLOWED_TAGS = new Set([
  'br', 'hr', 'b', 'i', 'em', 'strong', 'code', 'kbd', 'sub', 'sup', 'mark', 'span',
  'details', 'summary', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption', 'iframe', 'small',
])

const escapeText = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;')

function sanitizeHtml(html: string): string {
  return html
    .replace(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g, (m, _slash, name) =>
      ALLOWED_TAGS.has(String(name).toLowerCase()) ? m.replace(/\{\{/g, '&#123;&#123;') : escapeText(m))
}

function pageMeta(relativePath: string) {
  try {
    const index = JSON.parse(readFileSync(resolve(here, '..', 'index.json'), 'utf8'))
    const doc = index.docs.find((d: { path: string }) => d.path === relativePath)
    const lint = index.lint.filter((f: { file: string }) => f.file === `docs/${relativePath}`)
    return doc ? { status: doc.status, updated: doc.updated, updatedLabel: doc.updated_label, lint } : null
  } catch {
    return null
  }
}

export default defineConfig({
  title: generated.title,
  description: 'craft-kit project documents',
  base: process.env.CRAFT_KIT_VIEWER_BASE || '/',
  srcDir: 'content',
  cleanUrls: false,
  ignoreDeadLinks: true,
  lastUpdated: false,
  themeConfig: {
    nav: generated.nav,
    sidebar: generated.sidebar,
    search: { provider: 'local' },
    outline: [2, 3],
    notFound: {
      title: 'Page not found',
      quote: 'This document is not in the project docs. It may have been renamed or removed.',
      linkText: 'Back to the overview',
    },
  },
  markdown: {
    config(md) {
      md.set({ html: true })

      // Tables scroll inside their own box, so a wide table never pushes the page sideways.
      md.renderer.rules.table_open = () => '<div class="ck-table"><div class="ck-table-scroll"><table>\n'
      md.renderer.rules.table_close = () => '</table></div></div>\n'

      // Links to files that are not pages (prototype HTML, PDFs) must leave the client router.
      const linkOpen = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const href = token.attrGet('href') || ''
        if (!/^[a-z][a-z0-9+.-]*:/i.test(href) && /\.(html?|pdf)([?#].*)?$/i.test(href)) token.attrSet('target', '_self')
        return linkOpen ? linkOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
      }

      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim().split(/\s+/)[0] === 'mermaid') {
          return `<Mermaid code="${encodeURIComponent(token.content)}" />`
        }
        return fence(tokens, idx, options, env, self)
      }

      // Plain text may contain `{{ }}`, which Vue would evaluate.
      const text = md.renderer.rules.text
      md.renderer.rules.text = (tokens, idx, options, env, self) =>
        (text ? text(tokens, idx, options, env, self) : md.utils.escapeHtml(tokens[idx].content)).replace(/\{\{/g, '&#123;&#123;')

      for (const rule of ['html_inline', 'html_block'] as const) {
        md.renderer.rules[rule] = (tokens, idx) => sanitizeHtml(tokens[idx].content)
      }
    },
  },
  transformPageData(pageData) {
    const meta = pageMeta(pageData.relativePath)
    if (meta) pageData.frontmatter.ckMeta = meta
  },
})
