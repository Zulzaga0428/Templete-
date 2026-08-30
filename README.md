# templete.kodu.live

A gallery of free, open-source web templates that open straight into
[Kodu](https://kodu.live). Instead of facing an empty prompt box, a visitor picks a template that
already runs, opens it in a Kodu workspace, and asks the agent for changes.

- **Landing** (`/`) — the pitch, a showcase row, and the category entry points.
- **Gallery** (`/templates`) — search, filter by category and stack, seeded from `?q=` and
  `?category=` so links arrive pre-filtered.
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

Set `NEXT_PUBLIC_SITE_URL` so `sitemap.xml`, canonical URLs, and Open Graph tags point at the real
domain. Point `templete.kodu.live` at the deployment.

### Keeping the gallery fresh

`.github/workflows/ingest.yml` re-runs the ingest weekly and opens a pull request when the data
changes, so new templates arrive without anyone remembering to do it. Review the diff before
merging — it is the one place a bad repository could reach the gallery.

## Project layout

```
app/
  page.tsx              landing page
  templates/page.tsx    gallery, reads ?q= and ?category=
  t/[slug]/page.tsx     template detail, prerendered per template
  about/page.tsx        how it works + licensing policy
  api/kodu/open/        handoff to Kodu
components/             Gallery (client), TemplateCard, Thumbnail, OpenInKodu
lib/
  types.ts              Template shape
  licenses.ts           which licences may be copied
  templates.ts          reads and queries the data files
  kodu.ts               handoff URL + payload
scripts/
  sources.ts            search queries, framework/category rules, reject list
  transform.ts          GitHub repo -> Template, shared by ingest and seed
  ingest.ts             crawls GitHub
  seed.ts               hand-checked fallback data
data/
  templates.json        generated
  curated.json          hand-written, merged over the generated file
```

## Notes for later

The JSON file is deliberate: it costs nothing, prerenders every page, and handles a few thousand
templates without complaint. The moment the gallery needs per-visitor state — likes, saved
templates, "opened 412 times" — move the reads in `lib/templates.ts` to a database. That file is
the only thing that would have to change.
