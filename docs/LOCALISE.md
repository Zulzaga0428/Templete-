# Brief: localising a template

Paste the section below into the Claude Code session doing the work, with the two placeholders
filled in. It is written for an agent that has the repository checked out locally.

The parts that matter most are the ones a competent agent will not know without being told:
Cyrillic font coverage, text expansion, and the licence obligations. Those three decide whether
the result looks professional or looks broken.

---

## The brief

> You are localising an open-source web template into Mongolian, to be published as a Kodu
> template. The original is **{OWNER}/{REPO}** and this checkout is a fork of it.
>
> ### Rules you must not break
>
> 1. **Leave `LICENSE` exactly as it is.** Add your own copyright line *below* the original's,
>    never in place of it. This is the condition under which the fork is allowed to exist.
> 2. **Do not upgrade dependencies** and do not restructure the project. You are translating and
>    adapting a working template, not modernising it. Every dependency you bump is a way for it to
>    stop building.
> 3. **Keep it building.** Run the project's own build and dev server before you finish. A
>    template that does not start is worse than no template.
>
> ### Fonts — do this first, it decides how the result looks
>
> Most display and heading fonts have **no Cyrillic glyphs**. If the template uses one, every
> Mongolian heading falls back to a system font and the page looks broken while every individual
> string is correct. Check the font before you translate anything.
>
> - With `next/font/google`, add the subset explicitly: `subsets: ["latin", "cyrillic"]`. If the
>   font has no `cyrillic` subset, the call fails at build — that is the check.
> - Faces that do cover Cyrillic and are safe to swap to: **Inter, Manrope, Rubik, Montserrat,
>   Roboto, Open Sans, PT Sans, Golos Text, Noto Sans**.
> - When a brand-looking display face has no Cyrillic, keep it for the logo only and set a
>   Cyrillic-capable face for everything else.
>
> ### Text expansion
>
> Mongolian runs roughly 20–40% longer than English for the same meaning. Fixed-width buttons,
> single-line nav items, tight card titles and hero headlines all break. After translating, look
> at every layout at 390px and at 1280px, and loosen what wraps badly. Prefer `text-balance` and
> `min-w-0` over shortening the translation into something unnatural.
>
> ### What to localise
>
> - **All visible copy.** Natural Mongolian, not literal translation. If a sentence only makes
>   sense in an American context, replace it with one that makes sense here.
> - **Dates**: `toLocaleDateString("mn-MN", …)`. Mongolian writes year first — 2026 оны 8-р сарын 31.
> - **Currency**: төгрөг, `₮`, written after the amount with a space: `2,450,000 ₮`. Remove `$`
>   pricing tables and replace the numbers with plausible local ones — not converted US prices.
> - **Names** in sample data: Mongolian names, surname first (Бат-Эрдэнэ Ганбаатар).
> - **Phone numbers**: `+976 9911 2233`. **Addresses**: district, khoroo, building —
>   "Сүхбаатар дүүрэг, 1-р хороо".
> - **`lang="mn"`** on the html element, and the page metadata in Mongolian.
>
> ### What to delete
>
> Cut sections a Mongolian business will never use: US-only payment providers, testimonials from
> invented Western companies, "as seen in" logo walls, GDPR-specific copy. A shorter template that
> is all usable beats a long one half of which has to be deleted by every user.
>
> ### The README is the product page
>
> The gallery shows the README's opening paragraph and its Features list on the template's page.
> Write both for someone who has never seen the project: what it is, who it is for, what is
> already built. Say plainly that it is a Mongolian localisation of {OWNER}/{REPO} and link there.
>
> ### Done means
>
> - `npm run build` passes and the dev server renders every page
> - No Latin placeholder text left anywhere a visitor can see
> - Checked at 390px and 1280px
> - `LICENSE` intact, your copyright added below the original's
> - README rewritten, and `package.json` `name`/`description` updated
>
> ### Then publish it — do this yourself, do not leave it to a person
>
> Push, then set the repository's metadata with one command. All three matter: without a
> description the gallery skips the repo entirely, and without a homepage there is no screenshot
> and no live preview.
>
> ```bash
> gh repo edit OWNER/NEW-REPO \
>   --description "One clear sentence about what this template is" \
>   --homepage "https://your-deployed-demo.example" \
>   --add-topic kodu-template \
>   --add-topic lang-mn \
>   --add-topic derived-from-{OWNER}-{REPO}
> ```
>
> GitHub lowercases topics, which is fine — the gallery matches the original case-insensitively.
>
> Then tell whoever asked for this that it is ready, and give them the repo URL.

---

## After it is published

Run **Actions → Refresh templates**, then **Actions → Capture screenshots**, and merge both pull
requests. The template appears with a Монгол badge, an attribution block naming the original, and
a reverse link on the original's page.

See `docs/PUBLISHING.md` for the checklist form of this, and what to check when a template does
not appear.
