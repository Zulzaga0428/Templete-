# Publishing a template

How a template from the gallery becomes a Kodu template — localised, reworked, and listed in its
own right. Roughly two a day is a sustainable pace and adds up fast.

Nothing here needs a change to this repository. A repo declares what it is through its own GitHub
settings, and the weekly ingest picks it up.

## Before you start: what you may and may not do

The templates in the gallery are all under permissive licences, which allow derivative work — but
only on terms. Get this part right and there is never a problem; get it wrong and you have taken
someone's work.

- **Keep the original `LICENSE` file.** Unmodified. Add your own copyright line *alongside* the
  original's, never in place of it.
- **Say where it came from.** The `derived-from-` topic below does this on the site
  automatically.
- **Never fork a repo with no licence.** No licence means all rights reserved. Those are the
  link-only entries in the gallery, and they cannot be copied at all.

If you are unsure whether a template qualifies, its page says so: only a template showing **Open
in Kodu** is copyable.

## The steps

**1. Pick one.** Something a Mongolian business would actually use — a shop, a booking site, a
company page, a dashboard. Prefer a template that is maintained and whose demo still runs.

**2. Fork it into the Kodu organisation.** Keep the history; do not squash the original away.

**3. Rework it.** `docs/LOCALISE.md` holds a brief to hand the agent doing this — the font,
text-expansion and licence points in it are what decide whether the result looks professional.

**4. Deploy it somewhere.** This matters more than it looks: the gallery reads the repo's GitHub
**homepage** field as the demo URL, and without one the template gets no screenshot and no live
preview. Set the homepage to the deployed URL.

**5. Write the GitHub description.** One clear sentence. A repo without a description is skipped
by the ingest entirely — this is the most common reason a template never shows up.

**6. Add the topics.** This is what makes it a Kodu template:

| Topic | Required? | Meaning |
| --- | --- | --- |
| `kodu-template` | Yes | Without it the repo is invisible to the ingest |
| `lang-mn` | For Mongolian ones | Gets the **Монгол** badge and the gallery filter |
| `derived-from-OWNER-REPO` | If it is a fork | e.g. `derived-from-arthelokyo-astrowind` |

The `derived-from-` value is the original's owner and repo name joined with a dash. It drives the
attribution block on the template page and the reverse link on the original's page.

**7. Check the README.** The template page shows its opening paragraph and its Features list, so
write those two things for a reader who has never seen the project — they are what the page is
made of. A `package.json` that names its real dependencies fills in the "What's inside" panel by
itself.

## Getting it onto the site

Once a day or once a week, whichever suits:

**Actions → Refresh templates → Run workflow.**

It crawls GitHub, walks the Kodu organisation, fetches READMEs and manifests, and opens a pull
request. Merge it and the new templates are live.

Then **Actions → Capture screenshots → Run workflow** for the images.

### One-time setup

The org pass only runs when the organisation is named. Set it under
**Settings → Secrets and variables → Actions → Variables**:

```
KODU_TEMPLATES_ORG = your-github-org
```

Without it the weekly run still works — it just never looks at your own repos.

## If a template does not appear

Check these in order; each has caught something:

1. Does the repo carry the `kodu-template` topic?
2. Does it have a GitHub description? Without one it is skipped, and the run log says so.
3. Is it public and not archived?
4. Is `KODU_TEMPLATES_ORG` set?
5. Did the ingest pull request get merged?

## A note on volume

Two a day is a good pace because it leaves room to do each one properly. The gallery's worth is
that someone filtered it — a hundred half-finished forks are worth less than ten that a Mongolian
business could ship on Monday.
