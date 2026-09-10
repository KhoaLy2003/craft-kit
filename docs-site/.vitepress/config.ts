import { resolve } from 'path'
import { defineConfig } from 'vitepress'

// Resolve docs-site node_modules by absolute path. Needed because srcDir is '..'
// which causes kit/ files to compile with physical paths outside this package.
// Rollup SSR build can't resolve vue/server-renderer from those locations.
// Aliases pin all Vue resolution to docs-site/node_modules.
const nodeModules = resolve(__dirname, '../node_modules')

export default defineConfig({
  title: 'CraftKit',
  description:
    'A reusable, agent-friendly workflow kit for crafting software products with AI coding agents.',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],

  // Serve from playround root — kit files are the single source of truth.
  srcDir: '..',

  srcExclude: [
    'docs-site/.vitepress/**',
    'docs-site/node_modules/**',
    'testing/**',
    // Kit files that are not docs pages (fill-in forms, examples, raw README)
    'kit/templates/**',
    'kit/samples/**',
    'kit/README.md',
    // Internal resource files used by orchestrators; not standalone doc pages
    'kit/resource/**',
    // Root-level non-doc markdown files
    'AGENTS.md',
  ],

  rewrites: {
    // Phase orchestration files — served directly from kit.
    'kit/phase-1-bootstrap.md':    'phases/phase-1.md',
    'kit/phase-2-feature-dev.md':  'phases/phase-2-standard.md',
    'kit/phase-2-single-pass.md':  'phases/phase-2-single-pass.md',
    'kit/phase-bug-fix.md':        'phases/bug-fix.md',

    // Phase 1 step detail files.
    'kit/steps/phase-1/p1-01-ideation.md':        'phases/steps/p1-01-ideation.md',
    'kit/steps/phase-1/p1-02-market-research.md': 'phases/steps/p1-02-market-research.md',
    'kit/steps/phase-1/p1-03-prototype.md':       'phases/steps/p1-03-prototype.md',
    'kit/steps/phase-1/p1-04-design.md':          'phases/steps/p1-04-design.md',
    'kit/steps/phase-1/p1-05-roadmap.md':         'phases/steps/p1-05-roadmap.md',
    'kit/steps/phase-1/p1-06-architecture.md':    'phases/steps/p1-06-architecture.md',
    'kit/steps/phase-1/p1-07-constitution.md':    'phases/steps/p1-07-constitution.md',
    'kit/steps/phase-1/p1-08-scaffold.md':        'phases/steps/p1-08-scaffold.md',

    // Phase 2 — Standard Loop step detail files.
    'kit/steps/phase-2/p2-01-spec.md':                  'phases/steps/p2-01-spec.md',
    'kit/steps/phase-2/p2-02-plan.md':                  'phases/steps/p2-02-plan.md',
    'kit/steps/phase-2/p2-03-assign-specialists.md':    'phases/steps/p2-03-assign-specialists.md',
    'kit/steps/phase-2/p2-04-implement.md':             'phases/steps/p2-04-implement.md',
    'kit/steps/phase-2/p2-05-converge.md':              'phases/steps/p2-05-converge.md',
    'kit/steps/phase-2/p2-06-code-review.md':           'phases/steps/p2-06-code-review.md',
    'kit/steps/phase-2/p2-07-e2e-testing.md':           'phases/steps/p2-07-e2e-testing.md',
    'kit/steps/phase-2/p2-08-manual-check.md':          'phases/steps/p2-08-manual-check.md',
    'kit/steps/phase-2/p2-09-ship.md':                  'phases/steps/p2-09-ship.md',

    // Phase 2 — Single-Pass step detail files.
    'kit/steps/phase-2/p2sp-01-full-app-spec.md':       'phases/steps/p2sp-01-full-app-spec.md',
    'kit/steps/phase-2/p2sp-02-plan.md':                'phases/steps/p2sp-02-plan.md',
    'kit/steps/phase-2/p2sp-03-implement.md':           'phases/steps/p2sp-03-implement.md',
    'kit/steps/phase-2/p2sp-04-converge.md':            'phases/steps/p2sp-04-converge.md',
    'kit/steps/phase-2/p2sp-05a-e2e-plan.md':           'phases/steps/p2sp-05a-e2e-plan.md',
    'kit/steps/phase-2/p2sp-05b-code-review-e2e.md':    'phases/steps/p2sp-05b-code-review-e2e.md',
    'kit/steps/phase-2/p2sp-06-manual-check.md':        'phases/steps/p2sp-06-manual-check.md',
    'kit/steps/phase-2/p2sp-07-ship.md':                'phases/steps/p2sp-07-ship.md',

    // Reference files — orchestrator conventions and runtime aids.
    'kit/CHANGELOG.md':                   'changelog.md',
    'kit/guides/evolving-specs.md':       'guides/evolving-specs.md',
    'kit/task-agent-rubric.md':           'reference/task-agent-rubric.md',
    'kit/orchestrator-conventions.md':    'reference/orchestrator-conventions.md',
    'kit/gate-management.md':             'reference/gate-management.md',
    'kit/session-logging.md':             'reference/session-logging.md',
    'kit/stack-catalog.md':               'reference/stack-catalog.md',
    'kit/phase-1-checklist.md':           'reference/phase-1-checklist.md',
    'kit/phase-2-checklist.md':           'reference/phase-2-checklist.md',

    // Docs-layer files (content that has no equivalent in kit/).
    'docs-site/index.md':                      'index.md',
    'docs-site/getting-started.md':            'getting-started.md',
    'docs-site/guides/existing-projects.md':   'guides/existing-projects.md',
    'docs-site/reference/required-skills.md':  'reference/required-skills.md',
    'docs-site/reference/templates.md':        'reference/templates.md',
  },

  // Fix SSR build: alias Vue packages to absolute paths so Rollup can find them
  // when compiling pages from kit/ paths outside docs-site/.
  vite: {
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
      {
        text: 'Phases',
        items: [
          { text: 'Phase 1 — Bootstrap',     link: '/phases/phase-1' },
          { text: 'Phase 2 — Standard Loop', link: '/phases/phase-2-standard' },
          { text: 'Phase 2 — Single Pass',   link: '/phases/phase-2-single-pass' },
          { text: 'Bug Fix Workflow',         link: '/phases/bug-fix' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Existing Projects', link: '/guides/existing-projects' },
          { text: 'Evolving Specs',    link: '/guides/evolving-specs' },
        ],
      },
      { text: 'Reference', link: '/reference/required-skills' },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: {
      '/getting-started': [
        {
          text: 'Getting Started',
          items: [{ text: 'Overview', link: '/getting-started' }],
        },
        {
          text: 'Phases',
          items: [
            { text: 'Phase 1 — Bootstrap',     link: '/phases/phase-1' },
            { text: 'Phase 2 — Standard Loop', link: '/phases/phase-2-standard' },
            { text: 'Phase 2 — Single Pass',   link: '/phases/phase-2-single-pass' },
            { text: 'Bug Fix Workflow',         link: '/phases/bug-fix' },
          ],
        },
      ],
      '/phases/': [
        {
          text: 'Phases',
          items: [
            { text: 'Phase 1 — Bootstrap',     link: '/phases/phase-1' },
            { text: 'Phase 2 — Standard Loop', link: '/phases/phase-2-standard' },
            { text: 'Phase 2 — Single Pass',   link: '/phases/phase-2-single-pass' },
            { text: 'Bug Fix Workflow',         link: '/phases/bug-fix' },
          ],
        },
        {
          text: 'Phase 1 — Step Detail',
          collapsed: true,
          items: [
            { text: 'Step 1 — Product Ideation',          link: '/phases/steps/p1-01-ideation' },
            { text: 'Step 2 — Market Research',           link: '/phases/steps/p1-02-market-research' },
            { text: 'Step 3 — Interactive Prototype',     link: '/phases/steps/p1-03-prototype' },
            { text: 'Step 4 — Product Design',            link: '/phases/steps/p1-04-design' },
            { text: 'Step 5 — Roadmap Generation',        link: '/phases/steps/p1-05-roadmap' },
            { text: 'Step 6 — Tech Stack & Architecture', link: '/phases/steps/p1-06-architecture' },
            { text: 'Step 7 — Constitution',              link: '/phases/steps/p1-07-constitution' },
            { text: 'Step 8 — Scaffold',                  link: '/phases/steps/p1-08-scaffold' },
          ],
        },
        {
          text: 'Phase 2 — Standard Loop Steps',
          collapsed: true,
          items: [
            { text: 'Step 1 — Brainstorm & Spec',       link: '/phases/steps/p2-01-spec' },
            { text: 'Step 2 — Plan',                    link: '/phases/steps/p2-02-plan' },
            { text: 'Step 3 — Assign Specialists',      link: '/phases/steps/p2-03-assign-specialists' },
            { text: 'Step 4 — Implement',               link: '/phases/steps/p2-04-implement' },
            { text: 'Step 5 — Converge',                link: '/phases/steps/p2-05-converge' },
            { text: 'Step 6 — Code Review',             link: '/phases/steps/p2-06-code-review' },
            { text: 'Step 7 — E2E Testing',             link: '/phases/steps/p2-07-e2e-testing' },
            { text: 'Step 8 — Manual Double Check',     link: '/phases/steps/p2-08-manual-check' },
            { text: 'Step 9 — Ship',                    link: '/phases/steps/p2-09-ship' },
          ],
        },
        {
          text: 'Phase 2 — Single-Pass Steps',
          collapsed: true,
          items: [
            { text: 'Step 1 — Full-App Spec',               link: '/phases/steps/p2sp-01-full-app-spec' },
            { text: 'Step 2 — Plan',                        link: '/phases/steps/p2sp-02-plan' },
            { text: 'Step 3 — Implement',                   link: '/phases/steps/p2sp-03-implement' },
            { text: 'Step 4 — Converge',                    link: '/phases/steps/p2sp-04-converge' },
            { text: 'Step 5a — E2E Testing Plan',           link: '/phases/steps/p2sp-05a-e2e-plan' },
            { text: 'Step 5b — Code Review + E2E Testing',  link: '/phases/steps/p2sp-05b-code-review-e2e' },
            { text: 'Step 6 — Manual Check',                link: '/phases/steps/p2sp-06-manual-check' },
            { text: 'Step 7 — Ship',                        link: '/phases/steps/p2sp-07-ship' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Existing Projects', link: '/guides/existing-projects' },
            { text: 'Evolving Specs',    link: '/guides/evolving-specs' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Existing Projects', link: '/guides/existing-projects' },
            { text: 'Evolving Specs',    link: '/guides/evolving-specs' },
          ],
        },
        {
          text: 'Phases',
          items: [
            { text: 'Phase 1 — Bootstrap',     link: '/phases/phase-1' },
            { text: 'Phase 2 — Standard Loop', link: '/phases/phase-2-standard' },
            { text: 'Phase 2 — Single Pass',   link: '/phases/phase-2-single-pass' },
            { text: 'Bug Fix Workflow',         link: '/phases/bug-fix' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Setup',
          items: [
            { text: 'What You Need',              link: '/reference/required-skills' },
            { text: 'Templates',                  link: '/reference/templates' },
          ],
        },
        {
          text: 'Orchestrator Reference',
          items: [
            { text: 'Task → Specialist Rubric',   link: '/reference/task-agent-rubric' },
            { text: 'Orchestrator Conventions',   link: '/reference/orchestrator-conventions' },
            { text: 'Gate Management',            link: '/reference/gate-management' },
            { text: 'Session Logging',            link: '/reference/session-logging' },
          ],
        },
        {
          text: 'Checklists',
          items: [
            { text: 'Phase 1 — Pre-Step Checklist', link: '/reference/phase-1-checklist' },
            { text: 'Phase 2 — Pre-Step Checklist', link: '/reference/phase-2-checklist' },
          ],
        },
        {
          text: 'Stack & Tech',
          items: [
            { text: 'Stack Catalog',              link: '/reference/stack-catalog' },
          ],
        },
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
