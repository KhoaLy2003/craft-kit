import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Product Development Kit',
  description:
    'A reusable, agent-friendly workflow kit for building software products with AI coding agents.',
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
  ],

  rewrites: {
    // Phase files — served directly from kit, no adapted copies.
    'kit/phase-1-bootstrap.md':    'phases/phase-1.md',
    'kit/phase-2-feature-dev.md':  'phases/phase-2-standard.md',
    'kit/phase-2-single-pass.md':  'phases/phase-2-single-pass.md',
    'kit/phase-bug-fix.md':        'phases/bug-fix.md',

    // Other kit files served directly.
    'kit/CHANGELOG.md':             'changelog.md',
    'kit/guides/evolving-specs.md': 'guides/evolving-specs.md',
    'kit/task-agent-rubric.md':     'reference/task-agent-rubric.md',

    // Docs-layer files (content that has no equivalent in kit/).
    'docs-site/index.md':                      'index.md',
    'docs-site/getting-started.md':            'getting-started.md',
    'docs-site/guides/existing-projects.md':   'guides/existing-projects.md',
    'docs-site/reference/required-skills.md':  'reference/required-skills.md',
    'docs-site/reference/templates.md':        'reference/templates.md',
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
          text: 'Reference',
          items: [
            { text: 'What You Need',              link: '/reference/required-skills' },
            { text: 'Task → Specialist Rubric', link: '/reference/task-agent-rubric' },
            { text: 'Templates',                link: '/reference/templates' },
          ],
        },
      ],
      '/changelog': [],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KhoaTonyRay/product-development-kit' },
    ],

    footer: {
      message: 'Built on <a href="https://omp.dev">Oh My Pi</a>.',
      copyright: 'Product Development Kit',
    },

    search: {
      provider: 'local',
    },
  },
})
