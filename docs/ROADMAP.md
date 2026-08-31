# Roadmap and decisions

Working notes for templete.kodu.live: what is built, what is blocked, and the reasoning behind
the choices that are easy to forget and expensive to redo.

## Where things stand

**Built and deployed.** Landing, gallery with search and filters, seven prerendered category
pages, per-template pages, licensing policy page, generated Open Graph cards, English and
Mongolian throughout, pagination and sorting, licence-filtered GitHub ingest, a screenshot
pipeline, and support for Kodu's own templates and derivative work.

**Waiting on someone to run it.** `npm run screenshots` and `npm run ingest` with a
`GITHUB_TOKEN`. Both need network the build sandbox does not have. Until they run, the gallery
shows 21 seeded templates and no screenshots.

**Waiting on Kodu.** The `/new?repo=…&ref=…` route. This is the one that matters — see below.
A JSON API for the catalogue is live at `/api/templates`, so an in-app picker in Kodu can be built
against it whenever it is wanted.

## The next thing to build is on Kodu's side

The gallery's only action is "Open in Kodu", which sends people to:

```
https://kodu.live/new?repo=OWNER/NAME&ref=BRANCH&utm_source=templete
```

That route does not exist yet, so today the site's main button leads nowhere. Everything else on
this list is worth less than making that one route work: clone the repo into a sandbox, start the
dev server, open the workspace.

Nothing else about the integration is needed yet. `/api/kodu/open` already falls back to the URL
handoff when `KODU_API_URL` and `KODU_API_TOKEN` are unset, so the API mode can wait until there
is a reason for it.

## Publishing from Kodu into the gallery

The team builds and throws away 10–20 test sites a day. The question was whether those should
flow into the gallery.

**Not automatically.** A test site is not a template. Most are half-finished, carry placeholder
content, and ship no README or licence. Publishing them all would fill the gallery with things
nobody can start from, and the useful entries would sink. The value of this gallery is that
something was filtered — the same reason the licence checking exists. A discovery page that
accepts everything stops being worth visiting within a week.

**The gate already exists.** A repo only enters the gallery if it carries the `kodu-template`
topic. A test site does not have it and is invisible. Someone has to decide a build is worth
keeping and tag it. Deliberate, human, one at a time.

So the flow is:

```
20 test sites   → deleted, as now
1 that is good  → push to the Kodu org + add `kodu-template`  → next ingest picks it up
```

The missing piece is exporting a Kodu sandbox to a GitHub repo. That is Kodu-side work, and it is
worth building once — it is also what lets a user keep what they made.

If a self-serve publish flow is ever wanted, the gate has to survive it: a submission needs a
licence, a README, a description, and a human approval before it appears. Skipping any of those
turns the gallery back into a dump.

## Is this Kodu's library?

Yes, and it can be that without becoming part of Kodu.

It stays a separate site on its own domain because that is what makes it crawlable, fast and
findable — a template gallery inside an app behind a login earns no search traffic at all. When
Kodu needs an in-app picker, that is a second surface over the same data, not a second catalogue:
it reads `/api/templates` and renders whatever it likes.

**Do we need a database?** Not yet, and it is worth being precise about why. GitHub is currently
the database: repos are the storage, topics are the metadata, and the ingest is the sync. That is
a real architecture, not a shortcut — it is free, it backs itself up, and it has no schema to
migrate.

The moment a database is genuinely needed is specific: **when something has to be stored per
visitor.** Likes, saved templates, "opened 412 times", a submission queue with human approval.
None of those exist yet. Until one does, adding a database buys nothing and costs a service to run.

**Is there an off-the-shelf "GitHub gallery"?** Not one that does this job. GitHub's own topic
pages list repos but do not filter by licence, rank by usefulness, or read well. Its template
repository feature gives a "Use this template" button but is not a gallery. Awesome-lists are
hand-edited Markdown that goes stale. None of them is a curated, licence-checked, searchable,
bilingual catalogue — which is the reason this exists.

## Decisions worth not relitigating

**Data lives in a JSON file, not a database.** It costs nothing, every page prerenders, and it
handles a few thousand templates comfortably. `lib/templates.ts` is the only file that changes
when that stops being true — which is the moment the gallery needs per-visitor state (likes,
saved templates, open counts).

**Licences are verified by GitHub, not by us.** Every ingest query carries a `license:`
qualifier, so no README is ever parsed and no licence is ever guessed. Only permissive licences
are marked copyable; everything else is linked. A repo with no licence is all-rights-reserved by
default and can never be copied or forked.

**Screenshots are keyed by template id in a separate file.** An ingest run rewrites
`templates.json` wholesale. Screenshots are far too expensive to lose weekly.

**Category keys stay English.** They come from the ingest and slugs are built from them. Only the
displayed label is translated.

**Template titles and descriptions stay in their authors' language.** Machine-translating
someone's project description would be worse than leaving it.

## Ideas not yet started

- **Template submission form.** Could open a prefilled GitHub issue and need no backend at all.
- **Tag pages** (`/:lang/templates/tag/nextjs`) for more search surface.
- **Mongolian-localised forks** of the highest-value templates. AstroWind (marketing site) and
  TailAdmin (dashboard) are the two most useful to Mongolian small businesses.
- **Popularity signals** — "opened 412 times". Needs the database above.

## Known sharp edges

- The name `templete` is a misspelling of `template`. Nobody searches for it. The pages themselves
  use the correct spelling, but the domain will never rank for the obvious query. Worth
  reconsidering while there is no traffic to lose.
- A GitHub topic cannot contain a slash, so `derived-from-OWNER-REPO` splits on the first dash and
  resolves wrong for an owner whose name contains one. The reverse link only renders on a match,
  so a bad guess shows nothing rather than something wrong.
- v0 templates are deliberately absent. Copying them into the gallery risks conflicting with
  Vercel's terms; adding them to `data/curated.json` as `usage: "link"` entries is the safe way in.
