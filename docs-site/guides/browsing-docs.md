# Browsing Your Project Documents

The kit writes a lot of documents into your project's `docs/` folder. The docs viewer shows them as a website, so you can read, search and review them without opening files one by one. It is read-only: nothing in `docs/` is ever changed.

It needs Node 18 or newer. The first run also needs network access, once, to install [VitePress](https://vitepress.dev) into `~/.craft-kit/viewer/`.

---

## Starting

From the project root:

```bash
node kit/scripts/view-docs.js
```

It prints a local address (default `http://localhost:5173`). Leave it running while the AI works: new, changed and deleted documents appear within a second or two.

| Option | Effect |
|---|---|
| `--port 4000` | Use another port |
| `--build` | Write a static site instead of starting a server |
| `--out <dir>` | With `--build`, copy the site to `<dir>` |
| `--base /docs/` | With `--build`, set the URL prefix (for GitHub Pages and similar hosts) |

If the kit is installed somewhere other than `kit/`, use that folder in the path.

---

## What you see

- **Sidebar** grouped by purpose: Discovery, Design, Planning, Architecture, Governance, Specs, Testing, Session logs, Archive. Specs nest by feature (named from the backlog), with each feature's Spec, Plan and Screens.
- **Status badge** on every document: `Status` and `Last updated` from its header, plus any lint finding for that file. The document's own Metadata section is folded under the title.
- **Overview, Documents, Backlog, Artifacts** pages generated from your documents: counts by status, the `Based on` links between documents, the backlog by release and status, and your HTML prototypes, diagrams and design images (opened inside the viewer).
- **Mermaid diagrams** drawn in place; **Expand** shows a wide diagram at full size.
- **Wide view** (top right of each page) hides the page outline and uses the full width, useful for wide tables. Tables that are still too wide scroll inside their own box, with a fade on the side that has more.
- **Search** across every document.

---

## What is not shown

Dotfiles, JSON files (so test accounts and the backlog file itself), and file types a website does not need are never copied. The backlog is shown as tables built from `docs/backlog.json`. Machine-written test-run output (Playwright `*-report/`, `*-artifacts/`, `test-results/` folders) stays reachable by link and search but is left out of the sidebar and lists.

---

## After a kit update

Update the kit as usual (`npx github:KhoaLy2003/craft-kit --force`). The viewer's theme and configuration ship with the kit and are refreshed on the next run; no document migration is needed. A document written by an older kit that has no `Status` header is shown without a badge.

---

## Troubleshooting

- **"npm install failed"**: check your network, then run the command again.
- **A diagram shows its source text**: the Mermaid syntax has an error; the message is shown above the source.
- **The backlog page says it is unreadable**: `docs/backlog.json` is not valid JSON, possibly mid-write. It refreshes when the file is valid.
