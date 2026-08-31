/**
 * Fills data/details.json: what each template ships, and what its README says
 * about it.
 *
 *   npm run details                 # anything not fetched yet
 *   npm run details -- --force      # refetch everything
 *   npm run details -- --limit=20   # a slice, for trying it out
 *
 * A template page carrying only its one-line description has around 17 words
 * of its own. That is not enough for a search engine to treat it as a page
 * about anything, and not enough for a reader to choose with.
 *
 * Kept out of templates.json for the same reason as screenshots: an ingest run
 * rewrites that file wholesale, and each of these costs two API calls.
 */
import fs from "node:fs";
import path from "node:path";
import { readFeatures, readStack, readSummary } from "../lib/details";
import type { DetailsIndex, TemplateDetails } from "../lib/details";
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

const FORCE = args.has("force");
const LIMIT = Number(args.get("limit") ?? 0);
const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "details.json");
const token = process.env.GITHUB_TOKEN;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Returns null for 404 — plenty of templates ship no package.json at all. */
async function ghText(url: string): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "templete.kodu.live-details",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers });
    if (res.status === 404) return null;

    if (res.status === 403 || res.status === 429) {
      const reset = Number(res.headers.get("x-ratelimit-reset") ?? 0) * 1000;
      const waitMs =
        reset > Date.now() ? Math.min(reset - Date.now() + 1000, 60_000) : 4000 * 2 ** attempt;
      console.warn(`  rate limited, waiting ${Math.round(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }
    if (!res.ok) return null;
    return res.text();
  }
  return null;
}

function readTemplates(): Template[] {
  const merged = new Map<string, Template>();
  for (const file of ["templates.json", "curated.json"]) {
    const full = path.join(ROOT, "data", file);
    if (!fs.existsSync(full)) continue;
    const parsed = JSON.parse(fs.readFileSync(full, "utf8")) as TemplateIndex;
    for (const t of parsed.templates ?? []) merged.set(t.id, t);
  }
  return [...merged.values()];
}

function readIndex(): DetailsIndex {
  if (!fs.existsSync(OUT)) return { generatedAt: new Date().toISOString(), details: {} };
  return JSON.parse(fs.readFileSync(OUT, "utf8")) as DetailsIndex;
}

async function fetchDetails(template: Template): Promise<TemplateDetails | null> {
  const repo = template.repo;
  if (!repo) return null;
  const full = `${repo.owner}/${repo.name}`;

  const [readme, manifest] = await Promise.all([
    ghText(`https://api.github.com/repos/${full}/readme`),
    ghText(`https://api.github.com/repos/${full}/contents/package.json?ref=${repo.defaultBranch}`),
  ]);

  let pkg = null;
  if (manifest) {
    // A package.json that will not parse is the repo's problem, not a reason
    // to lose the README too.
    try {
      pkg = JSON.parse(manifest);
    } catch {
      pkg = null;
    }
  }

  const { stack, dependencyCount } = readStack(pkg);
  return {
    summary: readSummary(readme),
    features: readFeatures(readme),
    stack,
    dependencyCount,
    fetchedAt: new Date().toISOString(),
  };
}

async function main() {
  const index = readIndex();
  let templates = readTemplates().filter((t) => t.repo && (FORCE || !index.details[t.id]));
  if (LIMIT > 0) templates = templates.slice(0, LIMIT);

  if (templates.length === 0) {
    console.log("Nothing to fetch. Pass --force to refetch.");
    return;
  }
  if (!token) {
    console.warn("No GITHUB_TOKEN: 60 requests/hour, two per template. This will be slow.\n");
  }

  console.log(`Fetching details for ${templates.length} templates…\n`);
  let withSummary = 0;
  let withStack = 0;

  // Four at a time: two calls each, and the point is to be a good citizen of
  // an API that is doing this for free.
  for (let i = 0; i < templates.length; i += 4) {
    const batch = templates.slice(i, i + 4);
    const results = await Promise.all(batch.map(fetchDetails));

    batch.forEach((template, j) => {
      const details = results[j];
      if (!details) return;
      index.details[template.id] = details;
      if (details.summary) withSummary++;
      if (details.stack.length > 0) withStack++;
      const bits = [
        details.summary ? "summary" : null,
        details.features.length ? `${details.features.length} features` : null,
        details.stack.length ? `${details.stack.length} packages` : null,
      ].filter(Boolean);
      console.log(`  ${bits.length ? "✓" : "·"} ${template.slug} — ${bits.join(", ") || "nothing"}`);
    });

    index.generatedAt = new Date().toISOString();
    fs.writeFileSync(OUT, `${JSON.stringify(index, null, 2)}\n`);
    await sleep(token ? 300 : 2000);
  }

  console.log(`\n${templates.length} fetched.`);
  console.log(`  ${withSummary} have a usable summary, ${withStack} a readable stack.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
