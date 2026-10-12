import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, '..', 'kit', 'scripts', 'render-backlog.js');

const MARK_BEGIN = '<!-- BEGIN FEATURES -->';
const MARK_END = '<!-- END FEATURES -->';

function tempProject({ backlog, roadmap }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'render-backlog-'));
  fs.mkdirSync(path.join(root, 'docs'));
  if (backlog !== undefined) {
    fs.writeFileSync(path.join(root, 'docs', 'backlog.json'),
      typeof backlog === 'string' ? backlog : JSON.stringify(backlog, null, 2));
  }
  if (roadmap !== undefined) {
    fs.writeFileSync(path.join(root, 'docs', 'roadmap.md'), roadmap);
  }
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
}

const roadmapWithMarkers = [
  '# roadmap.md',
  '',
  '## 2. Feature List',
  '',
  MARK_BEGIN,
  MARK_END,
  '',
  '## 3. Build Order',
  '',
].join('\n');

function baseFeature(overrides) {
  return {
    id: 'F01',
    name: 'Sign in',
    priority: 'Must',
    size: 'M',
    depends_on: [],
    release: 'r1',
    status: 'pending',
    events: [
      { at: '2026-09-02T08:00:00Z', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: '' },
    ],
    ...overrides,
  };
}

function backlog(features, releases = [{ id: 'r1', name: 'MVP', status: 'in-progress' }]) {
  return {
    schema_version: 1,
    project: 'habit-tracker',
    phase2_scope: 'feature',
    admin_site: 'no',
    releases,
    features,
  };
}

const validFeatures = [
  baseFeature({
    id: 'F01',
    name: 'Sign in',
    status: 'shipped',
    events: [
      { at: '2026-09-02T08:00:00Z', type: 'created', source: 'backfill-unverified', by: 'migration', evidence: null, note: '' },
      { at: '2026-09-12T16:40:00Z', type: 'shipped', source: 'backfill-confirmed', by: 'user', evidence: 'PR #4', note: '' },
    ],
  }),
  baseFeature({
    id: 'F02',
    name: 'Habits',
    priority: 'Should',
    depends_on: ['F01'],
    status: 'in-progress',
    events: [
      { at: '2026-09-10T09:00:00Z', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: '' },
      { at: '2026-10-08T14:20:00Z', type: 'started', source: 'live', by: 'orchestrator', evidence: null, note: '' },
    ],
  }),
  baseFeature({
    id: 'F03',
    name: 'Social sharing',
    priority: "Won't",
    size: 'L',
    release: null,
    status: 'deferred',
    events: [
      { at: '2026-09-22T09:00:00Z', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: '' },
      { at: '2026-09-22T09:05:00Z', type: 'deferred', source: 'live', by: 'user', evidence: null, note: 'later' },
    ],
  }),
];

describe('render-backlog: valid input', () => {
  let root;
  let firstRun;

  before(() => {
    root = tempProject({
      backlog: backlog(validFeatures),
      roadmap: roadmapWithMarkers,
    });
    firstRun = run(root);
  });

  it('exits 0 and writes docs/backlog.html', () => {
    assert.equal(firstRun.status, 0, firstRun.stderr);
    assert.ok(fs.existsSync(path.join(root, 'docs', 'backlog.html')));
  });

  it('places the generated feature table between the markers, keeping the narrative', () => {
    const md = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    assert.ok(md.includes('| F02 | Habits | Should | M | F01 | in-progress |'));
    assert.ok(md.includes('## 3. Build Order'), 'content outside the markers must survive');
    assert.ok(md.indexOf(MARK_BEGIN) < md.indexOf('| ID | Feature |'));
    assert.ok(md.indexOf('| ID | Feature |') < md.indexOf(MARK_END));
  });

  it('is idempotent: a second run produces byte-identical output', () => {
    const htmlBefore = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    const mdBefore = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    const second = run(root);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8'), htmlBefore);
    assert.equal(fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8'), mdBefore);
  });

  it('groups features into their release and an Unassigned section for null release', () => {
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(html.includes('<h2>MVP'));
    assert.ok(html.includes('<h2>Unassigned'));
    assert.ok(html.includes('Social sharing'));
  });
});

describe('render-backlog: validation failures', () => {
  it('reports every error, exits 1, and writes no output files', () => {
    const broken = backlog([
      baseFeature({ id: 'F01', status: 'in-progress', release: null }),
      baseFeature({
        id: 'F02',
        depends_on: ['F99'],
        events: [
          { at: null, type: 'created', source: 'unknown', by: 'migration', evidence: null, note: '' },
          { at: '2026-09-02T08:00:00Z', type: 'started', source: 'live', by: 'orchestrator', evidence: null, note: '' },
        ],
      }),
    ]);
    const root = tempProject({ backlog: broken, roadmap: roadmapWithMarkers });
    const result = run(root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /F01: status in-progress requires a release/);
    assert.match(result.stderr, /F02: depends on unknown feature "F99"/);
    assert.match(result.stderr, /F02: status pending does not match latest status event started/);
    assert.equal(fs.existsSync(path.join(root, 'docs', 'backlog.html')), false);
    assert.equal(fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8'), roadmapWithMarkers);
  });

  it('accepts an unknown created date followed by a known shipped date', () => {
    const root = tempProject({
      backlog: backlog([
        baseFeature({
          status: 'shipped',
          events: [
            { at: null, type: 'created', source: 'unknown', by: 'migration', evidence: null, note: '' },
            { at: '2026-09-12T16:40:00Z', type: 'shipped', source: 'backfill-confirmed', by: 'user', evidence: 'PR #4', note: '' },
          ],
        }),
      ]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
  });

  it('rejects a status that disagrees with the latest status-changing event', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ status: 'shipped' })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /F01: status shipped does not match latest status event created/);
  });

  it('rejects malformed JSON with a readable message', () => {
    const root = tempProject({ backlog: '{ not json', roadmap: roadmapWithMarkers });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /cannot read .*backlog\.json/);
  });

  it('rejects the unfilled skeleton template', () => {
    const skeleton = fs.readFileSync(path.join(here, '..', 'kit', 'templates', 'backlog.json'), 'utf8');
    const root = tempProject({ backlog: skeleton, roadmap: roadmapWithMarkers });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /project must be a non-empty string/);
  });
});

describe('render-backlog: roadmap markers', () => {
  it('refuses a roadmap without markers and writes no HTML', () => {
    const root = tempProject({
      backlog: backlog(validFeatures),
      roadmap: '# roadmap.md\n\nNo feature block here.\n',
    });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing the <!-- BEGIN FEATURES --> \.\.\. <!-- END FEATURES --> markers/);
    assert.equal(fs.existsSync(path.join(root, 'docs', 'backlog.html')), false);
  });
});

describe('render-backlog: presentation', () => {
  it('escapes user text in HTML and pipes in the roadmap table', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ name: 'Tags | <script>x</script>' })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    const md = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    assert.ok(html.includes('Tags | &lt;script&gt;x&lt;/script&gt;'));
    assert.ok(!html.includes('<script>x</script>'));
    assert.ok(md.includes('Tags \\| <script>x</script>'));
  });

  it('marks backfill-unverified dates distinctly and leaves an undated status event blank', () => {
    const root = tempProject({
      backlog: backlog([
        baseFeature({
          status: 'shipped',
          events: [
            { at: '2026-09-02T08:00:00Z', type: 'created', source: 'backfill-unverified', by: 'migration', evidence: null, note: '' },
            { at: '2026-09-12T16:40:00Z', type: 'shipped', source: 'backfill-unverified', by: 'migration', evidence: null, note: '' },
          ],
        }),
        baseFeature({
          id: 'F02',
          name: 'Undated',
          events: [
            { at: null, type: 'created', source: 'unknown', by: 'migration', evidence: null, note: 'date unknown' },
          ],
        }),
      ]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(html.includes('<time class="unverified">2026-09-12</time>'));
    assert.ok(html.includes('<span class="badge warn">unverified</span>'));
    const undatedCard = html.slice(html.indexOf('>Undated<'));
    assert.ok(!undatedCard.slice(0, undatedCard.indexOf('</article>')).includes('<time'));
  });
});
