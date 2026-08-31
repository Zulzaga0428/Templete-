# templete.kodu.live

A gallery of free, open-source web templates that open straight into
[Kodu](https://kodu.live). Instead of facing an empty prompt box, a visitor picks a template that
already runs, opens it in a Kodu workspace, and asks the agent for changes.

- **Landing** (`/`) — the pitch, a showcase row, and the category entry points.
- **Gallery** (`/templates`) — search, filter by category and stack, seeded from `?q=` and
  `?category=` so links arrive pre-filtered.
- **Category pages** (`/templates/dashboard`, …) — one prerendered page per category with its own
  headline, intro and meta description.
- **Ingest** — a re-runnable job that collects templates from GitHub, licence-filtered.
- **Handoff** — one endpoint that hands a template to Kodu, by URL today or through the Kodu API
  once that is wired up.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The gallery reads `data/templates.json`, which is committed to the repository. There is nothing
else to set up — no database, no API keys.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build; every template page is prerendered |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Next's route types, then runs `tsc --noEmit` |
| `npm run seed` | Rewrites `data/templates.json` from the hand-checked list in `scripts/seed.ts` |
| `npm run ingest` | Rewrites `data/templates.json` by crawling GitHub |
| `npm run screenshots` | Captures a screenshot of each template's live demo |

## How templates get in

### Ingest

`npm run ingest` searches GitHub for repositories tagged as templates or starters, one query per
category (`scripts/sources.ts`), and writes the result to `data/templates.json`.

```bash
npm run ingest                          # defaults: 150+ stars, 30 per query
npm run ingest -- --min-stars=500       # a stricter bar
npm run ingest -- --limit=100           # more results per query
GITHUB_TOKEN=ghp_… npm run ingest       # 30 req/min instead of 10
```

Each run rebuilds the whole file, so a repository that is archived, deleted, or relicensed drops
out of the gallery automatically.

Repos are dropped when they are archived, disabled, a fork, have no description, or look like an
awesome-list, tutorial, or course (`REJECT_PATTERNS` in `scripts/sources.ts`).

### Licence filtering

Every search carries a `license:` qualifier, so **GitHub** decides the licence — we never parse a
README and hope. Only these are collected, and they are the same set as `PERMISSIVE_SPDX` in
`lib/licenses.ts`:

> MIT · MIT-0 · Apache-2.0 · BSD-2-Clause · BSD-3-Clause · ISC · Unlicense · 0BSD · CC0-1.0 · MPL-2.0

A template with one of those gets `usage: "copy"` and an **Open in Kodu** button. Anything else
gets `usage: "link"` and only ever links to its source — a repository with no licence file is
all-rights-reserved by default, so copying it would not be ours to do.

When Kodu clones a template it must keep the original `LICENSE` file and copyright notice in the
workspace. That is what the permissive licences require in exchange, and it is what the template
detail page promises the visitor.

### Curated entries

`data/curated.json` uses the same shape as `data/templates.json` and is merged over it, matched by
`id`. Use it to:

- add your own templates (`"source": "kodu"`),
- override a scraped description with a better one,
- pin something to the top of the gallery with `"featured": true`.

Curated entries are never overwritten by an ingest run.

## Screenshots

GitHub's social card is a grey box with the repo name on it. A screenshot of the demo actually
running is the biggest visual difference between this gallery and a list of links.

```bash
npx playwright install chromium        # once
npm run screenshots                    # capture anything missing
npm run screenshots -- --force         # recapture everything
npm run screenshots -- --only=astrowind,precedent
```

Set `PLAYWRIGHT_CHROMIUM_PATH` if the machine already has a Chromium that Playwright did not
download itself — most CI images do.

Captures go to `public/shots/<slug>.jpg` at 1200×630, and are indexed in `data/screenshots.json`
keyed by template id. That keying is the point: an ingest run rewrites `templates.json` from
scratch, and screenshots are far too expensive to lose every week.

A template with no demo URL is skipped. A capture that fails — dead demo, timeout, HTTP error —
is logged and the card falls back to the GitHub social card, then to a generated gradient. The
thumbnail tries all three in order, so nothing ever renders as a broken image.

At a few hundred templates this is roughly 30–50 MB in the repository, which git handles fine. If
it grows past that, move `public/shots` to object storage and change the `path` written into
`data/screenshots.json` to a CDN URL — nothing else reads it.

## Open Graph images

Every page generates its own social card with `next/og`, prerendered alongside the page:

- `app/opengraph-image.tsx` — the site card
- `app/t/[slug]/opengraph-image.tsx` — per template, showing its licence and stack
- `app/templates/[category]/opengraph-image.tsx` — per category

`lib/og.tsx` holds the shared layout. Satori (what `next/og` renders with) supports a subset of
CSS — flexbox only, and any element with more than one child needs an explicit `display: flex`.

## Kodu handoff

**Open in Kodu** posts to `/api/kodu/open`, which resolves the template server-side and redirects.
Going through our own endpoint (rather than linking straight to kodu.live) means the contract can
change without touching a single page.

It runs in one of two modes:

**URL handoff (default).** Redirects to:

```
https://kodu.live/new?template=<slug>&repo=<owner/name>&ref=<branch>&utm_source=templete
```

Kodu clones the repo itself. Nothing secret lives in this app.

**API handoff.** Set `KODU_API_URL` and `KODU_API_TOKEN` and the endpoint instead POSTs to
`$KODU_API_URL/workspaces/from-template`:

```jsonc
// request
{
  "templateId": "github:arhamkhnz/next-shadcn-admin-dashboard",
  "slug": "arhamkhnz-next-shadcn-admin-dashboard",
  "name": "Next Shadcn Admin Dashboard",
  "repoUrl": "https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git",
  "ref": "main",
  "license": "MIT",
  "sourceUrl": "https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
}

// response
{ "url": "https://kodu.live/workspace/abc123" }
```

The visitor is redirected to `url`. If the API errors, times out, or returns no `url`, the
endpoint falls back to the URL handoff — a provisioning outage degrades the button instead of
breaking it.

## Deploying

Any Node host works; the site is static apart from `/api/kodu/open`.

```bash
npm run build && npm run start
```

`next start` binds to `$PORT`, so nothing needs configuring on a platform that sets it.

Set these on the deployment:

| Variable | Why |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `sitemap.xml`, canonical URLs and Open Graph tags. Without it they point at `templete.kodu.live` regardless of where the app actually runs. |
| `NEXT_PUBLIC_KODU_APP_URL` | Where **Open in Kodu** sends people. Defaults to `https://kodu.live`. |

### Railway

The repository builds as-is — Railway detects Next.js, runs `npm ci && npm run build`, and starts
it with `npm run start`. `engines.node` pins the runtime to Node 20+, which Next 16 requires.

Set `NEXT_PUBLIC_SITE_URL` to the domain you attach **before** the first build: it is inlined at
build time, so changing it later needs a redeploy, not just a restart.

### Keeping the gallery fresh

`.github/workflows/ingest.yml` re-runs the ingest weekly and opens a pull request when the data
changes, so new templates arrive without anyone remembering to do it. Review the diff before
merging — it is the one place a bad repository could reach the gallery.

## Project layout

```
app/
  page.tsx                        landing page
  templates/page.tsx              gallery, reads ?q= and ?category=
  templates/[category]/page.tsx   one prerendered page per category
  t/[slug]/page.tsx               template detail, prerendered per template
  about/page.tsx                  how it works + licensing policy
  api/kodu/open/                  handoff to Kodu
  **/opengraph-image.tsx          generated social cards
components/                       Gallery (client), TemplateCard, Thumbnail, OpenInKodu
lib/
  types.ts              Template shape
  licenses.ts           which licences may be copied
  templates.ts          reads and queries the data files
  categories.ts         hand-written copy for the category pages
  kodu.ts               handoff URL + payload
  og.tsx                shared Open Graph card layout
scripts/
  sources.ts            search queries, framework/category rules, reject list
  transform.ts          GitHub repo -> Template, shared by ingest and seed
  ingest.ts             crawls GitHub
  seed.ts               hand-checked fallback data
  screenshots.ts        captures demo screenshots
data/
  templates.json        generated by ingest or seed
  curated.json          hand-written, merged over the generated file
  screenshots.json      generated by screenshots, keyed by template id
public/shots/           captured screenshots
```

## Notes for later

The JSON file is deliberate: it costs nothing, prerenders every page, and handles a few thousand
templates without complaint. The moment the gallery needs per-visitor state — likes, saved
templates, "opened 412 times" — move the reads in `lib/templates.ts` to a database. That file is
the only thing that would have to change.
