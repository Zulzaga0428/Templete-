/**
 * Builds data/templates.json from public sources.
 *
 * Run with:  npm run ingest
 *            npm run ingest -- --min-stars=500 --limit=20
 *            npm run ingest -- --org=kodu-live,ZulzagaEDU   (also pull your own)
 *            npm run ingest -- --max-age-months=24
 *            npm run ingest -- --out=data/templates.json
 *
 * Set GITHUB_TOKEN to lift the search rate limit from 10 to 30 requests/min.
 * Every query carries a `license:` qualifier, so GitHub itself guarantees the
 * licence of everything we collect — we never have to guess whether a repo is
 * safe to copy into a Kodu workspace.
 *
 * The script rewrites the whole index on each run, so a repo that goes
 * private, archived, or changes its licence simply disappears from the
 * gallery.
 */
import fs from "node:fs";
import path from "node:path";
import {
  COPYABLE_LICENSE_QUALIFIERS,
  GITHUB_QUERIES,
  MAX_MONTHS_SINCE_PUSH,
  pushedSinceQualifier,
} from "./sources";
import { isRejected, toTemplate, type RepoLike } from "./transform";
import type { Derivation, Template, TemplateIndex } from "../lib/types";

const args = new Map(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? "true"] as const;
    }),
);

const MIN_STARS = Number(args.get("min-stars") ?? 150);
const PER_QUERY = Number(args.get("limit") ?? 30);
const MAX_AGE_MONTHS = Number(args.get("max-age-months") ?? MAX_MONTHS_SINCE_PUSH);
const OUT = path.join(process.cwd(), args.get("out") ?? "data/templates.json");

const token = process.env.GITHUB_TOKEN;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function gh<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "templete.kodu.live-ingest",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers });

    if (res.status === 403 || res.status === 429) {
      // Secondary rate limit. Respect the reset header when GitHub sends one.
      const reset = Number(res.headers.get("x-ratelimit-reset") ?? 0) * 1000;
      const waitMs =
        reset > Date.now() ? Math.min(reset - Date.now() + 1000, 60_000) : 5000 * 2 ** attempt;
      console.warn(`  rate limited, waiting ${Math.round(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }
    if (!res.ok) {
      throw new Error(`GitHub ${res.status} for ${url}: ${await res.text()}`);
    }
    return (await res.json()) as T;
  }
  throw new Error(`GitHub kept rate limiting ${url}`);
}

async function ingestGithub(): Promise<Template[]> {
  const collected = new Map<string, Template>();
  // Repeated qualifiers of the same kind are OR'd by GitHub search, so this
  // single clause matches any licence we are allowed to copy.
  const licenseClause = COPYABLE_LICENSE_QUALIFIERS.map((l) => `license:${l}`).join(" ");

  for (const query of GITHUB_QUERIES) {
    const q =
      `${query.q} ${licenseClause} stars:>=${MIN_STARS} archived:false is:public ` +
      pushedSinceQualifier(MAX_AGE_MONTHS);
    const url =
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}` +
      `&sort=stars&order=desc&per_page=${PER_QUERY}`;

    process.stdout.write(`→ ${query.q} … `);
    const data = await gh<{ total_count: number; items: RepoLike[] }>(url);

    let kept = 0;
    for (const repo of data.items) {
      if (repo.archived || repo.disabled || repo.fork) continue;
      if (!repo.description) continue;
      if (isRejected(repo)) continue;
      if (collected.has(repo.full_name)) continue;

      collected.set(repo.full_name, toTemplate(repo, { fallbackCategory: query.category }));
      kept++;
    }
    console.log(`${data.items.length} found, ${kept} kept`);

    // Search allows 30 req/min authenticated, 10 unauthenticated.
    await sleep(token ? 2100 : 6500);
  }

  return [...collected.values()];
}

/**
 * Templates published by Kodu itself — localised forks, and starters written
 * from scratch.
 *
 * A repo declares what it is through its own GitHub topics, so nothing has to
 * be configured here when one is added:
 *
 *   kodu-template          required; without it the repo is ignored
 *   lang-mn                content language (lang-xx for any other)
 *   derived-from-OWNER-REPO  the template it was forked from
 *
 * Together with the LICENSE the fork keeps, that topic is what lets the
 * gallery credit the original author.
 */
async function ingestOrg(owner: string): Promise<Template[]> {
  const templates: Template[] = [];
  let page = 1;

  for (;;) {
    // Try the organisation endpoint, then the user one. A personal account is
    // not an org, and getting a 404 for that reason is a confusing way to
    // learn it.
    const orgUrl = `https://api.github.com/orgs/${owner}/repos?per_page=100&page=${page}&type=public`;
    const userUrl = `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&type=owner`;

    process.stdout.write(`→ ${owner} (page ${page}) … `);
    let repos = await gh<RepoLike[]>(orgUrl).catch(() => null);
    if (repos === null) repos = await gh<RepoLike[]>(userUrl);
    console.log(`${repos.length} repos`);
    if (repos.length === 0) break;

    let missingTopics = 0;
    for (const repo of repos) {
      const topics = repo.topics ?? [];
      // No topics at all on any repo means the API stopped returning them —
      // every repo would be silently skipped, which is worth saying out loud.
      if (repo.topics === undefined) missingTopics++;
      if (!topics.includes("kodu-template")) continue;
      if (repo.archived || repo.disabled) continue;
      if (!repo.description) {
        console.warn(`  skipped ${repo.full_name}: no GitHub description`);
        continue;
      }

      const template = toTemplate(repo, { fallbackCategory: "Starter", featured: true });
      template.source = "kodu";
      template.id = `kodu:${repo.full_name}`;

      const langTopic = topics.find((t) => /^lang-[a-z]{2}$/.test(t));
      if (langTopic) template.contentLanguage = langTopic.slice(5);

      const derivedTopic = topics.find((t) => t.startsWith("derived-from-"));
      if (derivedTopic) template.derivedFrom = derivationFromTopic(derivedTopic);

      templates.push(template);
    }

    if (missingTopics === repos.length && repos.length > 0) {
      console.warn(
        `  no repo under ${owner} reported topics — nothing can match kodu-template`,
      );
    }

    if (repos.length < 100) break;
    page++;
    await sleep(token ? 1000 : 6500);
  }

  return templates;
}

/**
 * `derived-from-arthelokyo-astrowind` -> the AstroWind repo.
 *
 * GitHub topics cannot hold a slash, so the owner and repo are joined with a
 * dash and split back on the first one. That breaks for an owner containing a
 * dash, which is why the resolved URL is checked against the ingested set
 * before it is trusted for the reverse link.
 */
function derivationFromTopic(topic: string): Derivation {
  const rest = topic.slice("derived-from-".length);
  const [owner, ...nameParts] = rest.split("-");
  const name = nameParts.join("-");

  return {
    id: `github:${owner}/${name}`,
    name,
    url: `https://github.com/${owner}/${name}`,
    author: owner,
    license: null,
    note: "",
  };
}

async function main() {
  const templates = await ingestGithub();

  // Comma-separated, because a team's own templates rarely all end up in one
  // place: some under an organisation, some under whoever made them.
  const owners = (args.get("org") ?? process.env.KODU_TEMPLATES_ORG ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  for (const owner of owners) {
    const own = await ingestOrg(owner);
    // Kodu's own templates win on id collision and sort to the front.
    templates.unshift(...own);
    console.log(`\n  ${own.length} from ${owner}`);
  }
  // Featured (Kodu's own) first, then by stars.
  templates.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.stars - a.stars;
  });

  const copyable = templates.filter((t) => t.usage === "copy").length;
  const index: TemplateIndex = {
    generatedAt: new Date().toISOString(),
    count: templates.length,
    templates,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(index, null, 2)}\n`);

  console.log(`\nWrote ${templates.length} templates to ${path.relative(process.cwd(), OUT)}`);
  console.log(`  ${copyable} copyable, ${templates.length - copyable} link-only`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
