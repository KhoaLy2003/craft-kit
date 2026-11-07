import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vitepress'
import { SUMMARIES } from './summaries'

// The root package version is the kit release shown on every page.
const KIT_VERSION: string = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8')).version

// Resolve docs-site node_modules by absolute path. Needed because srcDir is '..'
// which causes kit/ files to compile with physical paths outside this package.
// Rollup SSR build can't resolve vue/server-renderer from those locations.
// Aliases pin all Vue resolution to docs-site/node_modules.
const nodeModules = resolve(__dirname, '../node_modules')

// ─── Page table ───────────────────────────────────────────────────────────────
// One entry per published page: `src` is relative to srcDir ('..' = repo root),
// `to` is the site path, `text` is the sidebar/nav label.
// Rewrites, nav, and sidebar are all derived from these arrays.

type Page = { src: string; to: string; text: string }
const kit = (file: string, to: string, text: string): Page => ({ src: `kit/${file}.md`, to, text })
const docs = (file: string, to: string, text: string): Page => ({ src: `docs-site/${file}.md`, to, text })
const steps = (phase: string, rows: [string, string][]): Page[] =>
  rows.map(([file, text]) => kit(`steps/${phase}/${file}`, `phases/steps/${file}`, text))

const PHASES: Page[] = [
  kit('START',                  'start',                 'Start — Entry Router'),
  kit('phase-1-bootstrap',      'phases/phase-1',        'Phase 1 — Bootstrap'),
  kit('phase-2',                'phases/phase-2',        'Phase 2 — Build (workflow)'),
  kit('phase-bug-fix',          'phases/bug-fix',        'Bug Fix Workflow'),
  kit('phase-maintenance',      'phases/phase-maintenance', 'Maintenance Workflow'),
  kit('phase-admin',            'phases/admin',          'Admin Site Workflow'),
  kit('phase-adopt',            'phases/adopt',          'Adopt — Existing Codebase'),
  kit('phase-upgrade',          'phases/upgrade',        'Project Upgrade'),
  kit('phase-docs-backfill',    'phases/docs-backfill',  'Docs Backfill'),
  kit('phase-api-backfill',     'phases/api-backfill',   'API Backfill'),
  kit('phase-test-accounts-backfill', 'phases/test-accounts-backfill', 'Test Accounts Backfill'),
  kit('phase-verification-backfill',  'phases/verification-backfill',  'Verification Backfill'),
  kit('phase-log-collapse',     'phases/log-collapse',   'Log Collapse'),
  kit('phase-onboarding',       'phases/onboarding',     'Developer Onboarding'),
]

const PHASE_1_STEPS = steps('phase-1', [
  ['p1-01-ideation',         'Step 1 — Ideation'],
  ['p1-02-market-research',  'Step 2 — Market Research'],
  ['p1-03-prototype-design', 'Step 3 — Prototype & Design'],
  ['p1-04-roadmap',          'Step 4 — Roadmap'],
  ['p1-05-screen-design',    'Step 5 — Full Screen Design'],
  ['p1-06-architecture',     'Step 6 — Architecture & Data'],
  ['p1-07-constitution',     'Step 7 — Constitution'],
  ['p1-08-scaffold',         'Step 8 — Scaffold'],
])

const PHASE_2_STEPS = steps('phase-2', [
  ['p2-01-spec',         'Step 1 — Spec'],
  ['p2-02-plan',         'Step 2 — Plan'],
  ['p2-03-implement',    'Step 3 — Implement'],
  ['p2-04-review',       'Step 4 — Review'],
  ['p2-05-e2e',          'Step 5 — E2E'],
  ['p2-06-manual-check', 'Step 6 — Manual Check'],
  ['p2-07-ship',         'Step 7 — Ship'],
])

const GUIDES: Page[] = [
  docs('guides/what-to-say',                'guides/what-to-say',                'What to Say to the AI'),
  docs('guides/existing-projects',          'guides/existing-projects',          'Existing Projects'),
  docs('guides/phase-1-bootstrap',          'guides/phase-1-bootstrap',          'Phase 1 — Bootstrap (guide)'),
  docs('guides/phase-2-build',              'guides/phase-2-build',              'Phase 2 — Build (guide)'),
  docs('guides/adding-a-feature',           'guides/adding-a-feature',           'Adding a Single Feature'),
  docs('guides/fixing-a-bug',               'guides/fixing-a-bug',               'Fixing a Bug'),
  docs('guides/admin-site',                 'guides/admin-site',                 'Building an Admin Site'),
  docs('guides/onboarding-a-developer',     'guides/onboarding-a-developer',     'Onboarding a New Developer'),
  docs('guides/resuming-a-session',         'guides/resuming-a-session',         'Resuming in a New Session'),
  kit('guides/evolving-specs',              'guides/evolving-specs',             'Evolving Specs'),
  kit('guides/session-handover',            'guides/session-handover',           'Session Handover'),
  kit('guides/design-reference',            'guides/design-reference',           'Design Reference'),
  kit('guides/diagrams',                    'guides/diagrams',                   'Diagram Rendering'),
  kit('guides/test-accounts',               'guides/test-accounts',              'Test Accounts'),
  kit('guides/phase-2-feature-scope',       'guides/phase-2-feature-scope',      'Phase 2 Feature Scope'),
  kit('guides/change-control',              'guides/change-control',             'Change Control'),
  kit('guides/design-mcp',                  'guides/design-mcp',                 'Designs via MCP'),
  kit('guides/conventions-detail',          'guides/conventions-detail',         'Conventions Detail'),
]

const REFERENCE_SETUP: Page[] = [
  docs('reference/required-skills', 'reference/required-skills', 'Skills & Agents'),
  docs('reference/templates',       'reference/templates',       'Templates'),
  docs('reference/glossary',        'reference/glossary',        'Glossary'),
]

const REFERENCE_ORCHESTRATOR: Page[] = [
  kit('task-agent-rubric',       'reference/task-agent-rubric',       'Task → Specialist Rubric'),
  kit('orchestrator-conventions', 'reference/orchestrator-conventions', 'Orchestrator Conventions'),
  kit('session-logging',         'reference/session-logging',         'Session Logging'),
  kit('stack-catalog',           'reference/stack-catalog',           'Stack Catalog'),
]

const OTHER: Page[] = [
  kit('CHANGELOG',          'changelog',       'Changelog'),
  docs('index',             'index',           'Home'),
  docs('getting-started',   'getting-started', 'Getting Started'),
]

const PAGES = [
  ...PHASES, ...PHASE_1_STEPS, ...PHASE_2_STEPS, ...GUIDES,
  ...REFERENCE_SETUP, ...REFERENCE_ORCHESTRATOR, ...OTHER,
]

const rewrites = Object.fromEntries(PAGES.map(p => [p.src, `${p.to}.md`]))
const item = (p: Page) => ({ text: p.text, link: `/${p.to}` })

// Kit markdown that is deliberately not a docs page. Anything else under kit/
// must be in the page table above — the check below fails the build otherwise,
// so a new kit file can never leak out as an unlinked /kit/... page.
const KIT_NOT_PUBLISHED = ['kit/templates/', 'kit/resource/']

function listMarkdown(dir: string, prefix: string): string[] {
  return readdirSync(resolve(dir), { withFileTypes: true }).flatMap(e =>
    e.isDirectory()
      ? listMarkdown(resolve(dir, e.name), `${prefix}${e.name}/`)
      : e.name.endsWith('.md') ? [`${prefix}${e.name}`] : [],
  )
}

// A summary keyed to a renamed or removed page would silently vanish; fail the build instead.
for (const key of Object.keys(SUMMARIES)) {
  if (!PAGES.some(p => p.to === key)) throw new Error(`summaries.ts: no page "${key}"`)
}

const unmapped = listMarkdown(resolve(__dirname, '../../kit'), 'kit/').filter(
  f => !(f in rewrites) && !KIT_NOT_PUBLISHED.some(p => f.startsWith(p)),
)
if (unmapped.length) {
  throw new Error(
    `docs-site/.vitepress/config.ts: kit files with no docs mapping: ${unmapped.join(', ')}. ` +
      `Add them to the page table or to KIT_NOT_PUBLISHED.`,
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const byTo = new Map(PAGES.map(p => [p.to, p]))
const pick = (...tos: string[]): Page[] => tos.map(t => {
  const p = byTo.get(t)
  if (!p) throw new Error(`docs-site/.vitepress/config.ts: nav names unknown page "${t}"`)
  return p
})

// One-time upgrade modules are run by Project Upgrade, not entered directly.
const UPGRADE_MODULES = pick(
  'phases/docs-backfill', 'phases/api-backfill',
  'phases/test-accounts-backfill', 'phases/verification-backfill', 'phases/log-collapse',
)

// Task-first sidebar, shared by every page.
const group = (text: string, items: Page[], collapsed = false) =>
  ({ text, collapsed, items: items.map(item) })
const withChildren = (p: Page, children: Page[]) =>
  ({ ...item(p), collapsed: true, items: children.map(item) })

const SIDEBAR = [
  group('Start here', pick('getting-started', 'guides/what-to-say', 'start')),
  {
    text: 'Build a new product',
    items: [
      item(byTo.get('guides/phase-1-bootstrap')!),
      withChildren(byTo.get('phases/phase-1')!, PHASE_1_STEPS),
      withChildren(byTo.get('phases/phase-2')!, PHASE_2_STEPS),
      ...pick('guides/phase-2-build', 'guides/phase-2-feature-scope').map(item),
    ],
  },
  {
    text: 'Change a shipped product', collapsed: true,
    items: [
      ...pick('guides/fixing-a-bug', 'phases/bug-fix', 'phases/phase-maintenance').map(item),
      ...pick(
        'guides/adding-a-feature', 'guides/evolving-specs', 'guides/change-control',
        'guides/admin-site', 'phases/admin',
      ).map(item),
    ],
  },
  {
    text: 'Existing code', collapsed: true,
    items: [
      ...pick('guides/existing-projects', 'phases/adopt').map(item),
      withChildren(byTo.get('phases/upgrade')!, UPGRADE_MODULES),
      ...pick('guides/onboarding-a-developer', 'phases/onboarding').map(item),
    ],
  },
  group('Sessions, designs, tests', pick(
    'guides/resuming-a-session', 'guides/session-handover', 'guides/design-reference',
    'guides/design-mcp', 'guides/diagrams', 'guides/test-accounts', 'guides/conventions-detail',
  ), true),
  group('Reference', [...REFERENCE_SETUP, ...REFERENCE_ORCHESTRATOR], true),
]

// Pages whose H1 repeats another page's H1 get their nav label as the page title.
const UNIQUE_TITLES = new Map(
  [...PHASES, ...GUIDES].filter(p => /\((workflow|guide)\)$/.test(p.text)).map(p => [`${p.to}.md`, p.text]),
)

export default defineConfig({
  title: 'CraftKit',
  base: '/craft-kit/',
  description:
    'A reusable, agent-friendly workflow kit for crafting software products with AI coding agents.',
  head: [
    ['link', { rel: 'icon', href: '/craft-kit/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'CraftKit' }],
    ['meta', { property: 'og:description', content: 'A reusable, agent-friendly workflow kit for crafting software products with AI coding agents.' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'CraftKit' }],
    ['meta', { name: 'twitter:description', content: 'A reusable, agent-friendly workflow kit for crafting software products with AI coding agents.' }],
  ],

  // Serve from the repo root — kit files are the single source of truth.
  srcDir: '..',

  srcExclude: [
    'docs-site/.vitepress/**',
    'docs-site/node_modules/**',
    'testing/**',
    // Everything outside kit/ and docs-site/ is repo plumbing, never a docs page.
    'docs/**',
    'tests/**',
    '.github/**',
    'bin/**',
    // Fill-in forms and dev-only files (resource/ is not installed either).
    ...KIT_NOT_PUBLISHED.map(p => `${p}**`),
    // Root-level markdown that is not a docs page.
    'AGENTS.md',
    'README.md',
    'RELEASE_NOTES.md',
  ],

  rewrites,

  transformPageData(pageData) {
    const title = UNIQUE_TITLES.get(pageData.relativePath)
    if (title) pageData.title = title
    const summary = SUMMARIES[pageData.relativePath.replace(/\.md$/, '')]
    if (summary) pageData.frontmatter.summary = summary
    // The changelog has one H2 per release; H3 sub-headings would bury the version list.
    if (pageData.relativePath === 'changelog.md') pageData.frontmatter.outline = [2, 2]
  },

  // Fix SSR build: alias Vue packages to absolute paths so Rollup can find them
  // when compiling pages from kit/ paths outside docs-site/.
  vite: {
    plugins: [
      {
        // The full changelog is ~1000 lines. Publish the latest releases and link the rest.
        name: 'craft-kit:trim-changelog',
        enforce: 'pre',
        transform(code: string, id: string) {
          if (!/kit[\\/]CHANGELOG\.md$/.test(id)) return
          const KEEP = 6 // "Unreleased" plus the five newest releases
          const heads = [...code.matchAll(/^## \[/gm)]
          if (heads.length <= KEEP) return
          return (
            code.slice(0, heads[KEEP].index).trimEnd() +
            '\n\n---\n\nOlder releases: [full changelog on GitHub](https://github.com/KhoaLy2003/craft-kit/blob/main/kit/CHANGELOG.md).\n'
          )
        },
      },
    ],
    publicDir: resolve(__dirname, '../public'),
    resolve: {
      alias: [
        // vue/server-renderer and vue itself: resolves from kit/ paths which have
        // no ancestor node_modules. Once found here, @vue/* sibling packages
        // resolve correctly within docs-site/node_modules/ without aliasing.
        { find: /^vue\/server-renderer$/, replacement: resolve(nodeModules, 'vue/server-renderer/index.mjs') },
        { find: 'vue', replacement: resolve(nodeModules, 'vue/dist/vue.esm-bundler.js') },
      ],
    },
  },

  themeConfig: {
    nav: [
      { text: 'Get Started', link: '/getting-started' },
      { text: 'What to Say', link: '/guides/what-to-say' },
      {
        text: 'Workflows',
        items: pick(
          'start', 'phases/phase-1', 'phases/phase-2', 'phases/bug-fix', 'phases/phase-maintenance',
          'phases/admin', 'phases/adopt', 'phases/upgrade', 'phases/onboarding',
        ).map(item),
      },
      {
        text: 'Guides',
        items: pick(
          'guides/existing-projects', 'guides/phase-1-bootstrap', 'guides/phase-2-build',
          'guides/adding-a-feature', 'guides/fixing-a-bug', 'guides/admin-site',
          'guides/onboarding-a-developer', 'guides/resuming-a-session',
        ).map(item),
      },
      { text: 'Reference', link: '/reference/glossary' },
      { text: `Changelog (v${KIT_VERSION})`, link: '/changelog' },
    ],

    sidebar: {
      '/changelog': [],
      '/': SIDEBAR,
    },

    outline: { level: [2, 3], label: 'On this page' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KhoaLy2003/craft-kit' },
    ],

    footer: {
      message: `CraftKit v${KIT_VERSION} · Released under the MIT License.`,
      copyright: `Copyright © ${new Date().getFullYear()} Khoa Ly`,
    },

    search: {
      provider: 'local',
    },
  },
})
