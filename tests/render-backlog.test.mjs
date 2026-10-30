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

  it('rejects a depends_on cycle', () => {
    const root = tempProject({
      backlog: backlog([
        baseFeature({ id: 'F01', depends_on: ['F02'] }),
        baseFeature({ id: 'F02', depends_on: ['F01'] }),
      ]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /depends_on cycle: F01 -> F02 -> F01/);
  });

  it('rejects an event date that is not ISO 8601', () => {
    const root = tempProject({
      backlog: backlog([
        baseFeature({
          events: [{ at: 'March 3, 2026', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: '' }],
        }),
      ]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /at must be an ISO 8601 date-time or null/);
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

  it('card shows created and shipped dates, styling only unverified ones; undated dates are omitted', () => {
    const root = tempProject({
      backlog: backlog([
        baseFeature({
          status: 'shipped',
          events: [
            { at: '2026-09-02T08:00:00Z', type: 'created', source: 'backfill-unverified', by: 'migration', evidence: null, note: '' },
            { at: '2026-09-12T16:40:00Z', type: 'shipped', source: 'backfill-confirmed', by: 'user', evidence: 'PR #4', note: '' },
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
    assert.ok(html.includes('<span class="unverified" title="from git, unverified">created 2026-09-02</span> → <span title="from git, confirmed">shipped 2026-09-12</span>'));
    const undatedCard = html.slice(html.indexOf('<button type="button" class="card" data-open="dlg-F02"'));
    assert.ok(!undatedCard.slice(0, undatedCard.indexOf('</button>')).includes('class="meta"'));
  });

  it('each feature gets a detail dialog with the full name, release, dependencies and history', () => {
    const longName = 'Daily check-in with streak count and a very long description '.repeat(3).trim();
    const root = tempProject({
      backlog: backlog([
        baseFeature({ id: 'F01', name: 'Sign in' }),
        baseFeature({
          id: 'F02',
          name: longName,
          depends_on: ['F01'],
          status: 'shipped',
          events: [
            { at: '2026-09-02T08:00:00Z', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: 'first note' },
            { at: '2026-09-12T16:40:00Z', type: 'shipped', source: 'live', by: 'orchestrator', evidence: 'PR #7', note: '' },
          ],
        }),
      ]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(html.includes('<dialog class="detail" id="dlg-F02" aria-labelledby="dlg-F02-title">'));
    assert.ok(html.includes(`<h2 id="dlg-F02-title">${longName}</h2>`));
    assert.ok(html.includes('<dt>Depends on</dt><dd>F01</dd>'));
    assert.ok(html.includes('<dt>Release</dt><dd>MVP</dd>'));
    assert.ok(html.includes('PR #7'));
    assert.ok(html.includes('<div class="note">first note</div>'));
    assert.ok(html.includes('<form method="dialog"><button class="close">Close</button></form>'));
  });

  it('escapes feature text inside the dialog', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ name: '<img src=x onerror=alert(1)>' })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(!html.includes('<img src=x'));
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  });
});

describe('render-backlog: warnings and line endings', () => {
  const sameTime = '2026-09-02T08:00:00Z';
  const createdAt = (id, at = sameTime) => baseFeature({
    id,
    name: `Feature ${id}`,
    events: [{ at, type: 'created', source: 'backfill-unverified', by: 'migration', evidence: 'commit abc', note: '' }],
  });

  it('warns when three or more features share one dated timestamp, without failing', () => {
    const root = tempProject({
      backlog: backlog([createdAt('F01'), createdAt('F02'), createdAt('F03')]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /warning: 3 features share the same created time 2026-09-02T08:00:00Z \(F01, F02, F03\)/);
  });

  it('does not warn for two features sharing a timestamp', () => {
    const root = tempProject({
      backlog: backlog([createdAt('F01'), createdAt('F02')]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
  });

  it('writes the feature table with the roadmap file line endings (no mixed CRLF and LF)', () => {
    const crlfRoadmap = roadmapWithMarkers.replace(/\n/g, '\r\n');
    const root = tempProject({
      backlog: backlog([baseFeature({})]),
      roadmap: crlfRoadmap,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const md = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    const lfOnly = md.match(/(?<!\r)\n/g) || [];
    assert.equal(lfOnly.length, 0);
    assert.ok(md.includes('| F01 | Sign in | Must | M |  | pending |'));
  });

  it('generated HTML contains no carriage returns', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({})]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(!html.includes('\r'));
  });
});

describe('render-backlog: short title and description', () => {
  it('dialog shows the description under the short title; roadmap table shows only the title', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ name: 'Short title', description: 'Full detail line one\nline two' })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(html.includes('<p class="description">Full detail line one\nline two</p>'));
    const md = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    assert.ok(md.includes('| F01 | Short title | Must | M |  | pending |'));
    assert.ok(!md.includes('Full detail line one'));
  });

  it('warns, without failing, when a title is longer than 80 characters', () => {
    const longTitle = 'x'.repeat(81);
    const root = tempProject({
      backlog: backlog([baseFeature({ name: longTitle })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /F01: name is 81 characters \(over 80\)/);
  });

  it('rejects a description that is not a string', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ description: 42 })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /F01: description must be a string when present/);
  });
});

describe('render-backlog: cancelled features', () => {
  const cancelledEvents = (note) => [
    { at: '2026-09-02T08:00:00Z', type: 'created', source: 'live', by: 'orchestrator', evidence: null, note: '' },
    { at: '2026-10-01T08:00:00Z', type: 'cancelled', source: 'live', by: 'user', evidence: null, note },
  ];

  it('accepts a cancelled feature that keeps its release and renders it in a Cancelled column', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ status: 'cancelled', events: cancelledEvents('client dropped the requirement') })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'docs', 'backlog.html'), 'utf8');
    assert.ok(html.includes('Cancelled<span class="count">1</span>'));
    assert.ok(html.includes('client dropped the requirement'));
    const md = fs.readFileSync(path.join(root, 'docs', 'roadmap.md'), 'utf8');
    assert.ok(md.includes('| F01 | Sign in | Must | M |  | cancelled |'));
  });

  it('rejects a cancelled event without a reason', () => {
    const root = tempProject({
      backlog: backlog([baseFeature({ status: 'cancelled', events: cancelledEvents('  ') })]),
      roadmap: roadmapWithMarkers,
    });
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /a cancelled event needs a note giving the reason/);
  });
});
