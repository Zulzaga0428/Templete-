/**
 * Builds data/templates.json from public sources.
 *
 * Run with:  npm run ingest
 *            npm run ingest -- --min-stars=500 --limit=20
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
import { COPYABLE_LICENSE_QUALIFIERS, GITHUB_QUERIES } from "./sources";
import { isRejected, toTemplate, type RepoLike } from "./transform";
import type { Template, TemplateIndex } from "../lib/types";

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
    const q = `${query.q} ${licenseClause} stars:>=${MIN_STARS} archived:false is:public`;
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

async function main() {
  const templates = await ingestGithub();
  templates.sort((a, b) => b.stars - a.stars);

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
