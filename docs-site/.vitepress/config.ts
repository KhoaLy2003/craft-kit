import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vitepress'

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
  kit('phase-1-bootstrap',      'phases/phase-1',        'Phase 1 — Bootstrap'),
  kit('phase-2',                'phases/phase-2',        'Phase 2 — Build'),
  kit('phase-bug-fix',          'phases/bug-fix',        'Bug Fix Workflow'),
  kit('phase-3-iterate',        'phases/phase-3-iterate', 'Phase 3 — Iterate'),
]

const PHASE_1_STEPS = steps('phase-1', [
  ['p1-01-ideation',         'Step 1 — Ideation'],
  ['p1-02-market-research',  'Step 2 — Market Research'],
  ['p1-03-prototype-design', 'Step 3 — Prototype & Design'],
  ['p1-04-roadmap',          'Step 4 — Roadmap'],
  ['p1-05-screen-design',    'Step 5 — Full Screen Design'],
  ['p1-06-architecture',     'Step 6 — Architecture'],
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
  docs('guides/existing-projects',          'guides/existing-projects',          'Existing Projects'),
  kit('guides/evolving-specs',              'guides/evolving-specs',             'Evolving Specs'),
  kit('guides/session-handover',            'guides/session-handover',           'Session Handover'),
  kit('guides/interactive-prototype-process', 'guides/interactive-prototype-process', 'Interactive Prototype Process'),
  kit('guides/design-reference',            'guides/design-reference',           'Design Reference'),
  kit('guides/admin-blueprint',             'guides/admin-blueprint',            'Admin Blueprint'),
]

const REFERENCE_SETUP: Page[] = [
  docs('reference/required-skills', 'reference/required-skills', 'What You Need'),
  docs('reference/templates',       'reference/templates',       'Templates'),
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

const phasesGroup = { text: 'Phases', items: PHASES.map(item) }
const guidesGroup = { text: 'Guides', items: GUIDES.map(item) }

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
    // Fill-in forms and dev-only files (resource/ is not installed either).
    ...KIT_NOT_PUBLISHED.map(p => `${p}**`),
    // Root-level markdown that is not a docs page.
    'AGENTS.md',
    'README.md',
    'RELEASE_NOTES.md',
  ],

  rewrites,

  // Fix SSR build: alias Vue packages to absolute paths so Rollup can find them
  // when compiling pages from kit/ paths outside docs-site/.
  vite: {
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
      { text: 'Phases', items: phasesGroup.items },
      { text: 'Guides', items: guidesGroup.items },
      { text: 'Reference', link: '/reference/required-skills' },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: {
      '/getting-started': [
        { text: 'Getting Started', items: [{ text: 'Overview', link: '/getting-started' }] },
        phasesGroup,
      ],
      '/phases/': [
        phasesGroup,
        { text: 'Phase 1 — Steps', collapsed: true, items: PHASE_1_STEPS.map(item) },
        { text: 'Phase 2 — Steps', collapsed: true, items: PHASE_2_STEPS.map(item) },
        guidesGroup,
      ],
      '/guides/': [guidesGroup, phasesGroup],
      '/reference/': [
        { text: 'Setup', items: REFERENCE_SETUP.map(item) },
        { text: 'Orchestrator Reference', items: REFERENCE_ORCHESTRATOR.map(item) },
      ],
      '/changelog': [],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KhoaLy2003/craft-kit' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Khoa Ly`,
    },

    search: {
      provider: 'local',
    },
  },
})
