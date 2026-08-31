/**
 * Captures a real screenshot of each template's live demo.
 *
 * GitHub's social card is a grey box with the repo name on it — fine as a
 * fallback, useless as a reason to click. A screenshot of the running demo is
 * the single biggest visual difference between this gallery and a list of
 * links.
 *
 *   npx playwright install chromium     # once
 *   PLAYWRIGHT_CHROMIUM_PATH=…          # or point at a Chromium you already have
 *   npm run screenshots                 # capture anything missing
 *   npm run screenshots -- --force      # recapture everything
 *   npm run screenshots -- --only=astrowind,precedent
 *
 * Results go to public/shots/<slug>.jpg and are indexed in
 * data/screenshots.json, keyed by template id so an ingest run never wipes
 * them.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import type { ScreenshotIndex, ScreenshotRecord, Template, TemplateIndex } from "../lib/types";

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
const ONLY = args.get("only")?.split(",").map((s) => s.trim()).filter(Boolean);
const TIMEOUT = Number(args.get("timeout") ?? 30_000);
const CONCURRENCY = Number(args.get("concurrency") ?? 3);

const ROOT = process.cwd();
const SHOTS_DIR = path.join(ROOT, "public", "shots");
const INDEX_FILE = path.join(ROOT, "data", "screenshots.json");

// 1200x630 is the Open Graph aspect ratio, which is also what the cards use.
const VIEWPORT = { width: 1200, height: 630 };

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

function readIndex(): ScreenshotIndex {
  if (!fs.existsSync(INDEX_FILE)) {
    return { generatedAt: new Date().toISOString(), shots: {} };
  }
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8")) as ScreenshotIndex;
}

async function capture(
  browser: Browser,
  template: Template,
): Promise<ScreenshotRecord | { error: string }> {
  const url = template.demoUrl;
  if (!url) return { error: "no demo URL" };

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    // Demos are marketing sites; the desktop layout is the one worth showing.
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    // A screenshot job has no business carrying state between sites.
    storageState: undefined,
  });

  try {
    const page = await context.newPage();
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: TIMEOUT });

    if (!response) return { error: "no response" };
    if (!response.ok()) return { error: `HTTP ${response.status()}` };

    // Let entrance animations and lazy images settle, then kill anything still
    // moving so repeat runs produce identical files.
    await page.waitForTimeout(1500);
    await page.addStyleTag({
      content: `*, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }`,
    });

    // Cookie banners cover exactly the part of the page worth showing.
    await dismissConsent(page);

    // Playwright writes png or jpeg only. jpeg at 82 keeps a 1200x630@2x
    // screenshot around 150KB; next/image re-encodes it to webp on the way out.
    const file = path.join(SHOTS_DIR, `${template.slug}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 82 });

    const headers = response.headers();
    const xfo = (headers["x-frame-options"] ?? "").toLowerCase();
    const csp = (headers["content-security-policy"] ?? "").toLowerCase();
    const ancestors = /frame-ancestors([^;]*)/.exec(csp)?.[1] ?? "";
    const embeddable =
      !xfo.includes("deny") && !xfo.includes("sameorigin") && (!ancestors || ancestors.includes("*"));

    return {
      path: `/shots/${template.slug}.jpg`,
      sourceUrl: url,
      capturedAt: new Date().toISOString(),
      embeddable,
    };
  } catch (error) {
    return { error: (error as Error).message.split("\n")[0] };
  } finally {
    await context.close();
  }
}

/**
 * Whether a page lets itself be framed.
 *
 * A plain fetch, not a browser: this only needs response headers, and it runs
 * for demos that already have a screenshot, where launching Chromium again
 * would be minutes of work for two header lookups.
 */
async function checkEmbeddable(url: string): Promise<boolean | undefined> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "templete.kodu.live" },
    });
    if (!res.ok) return undefined;

    const xfo = res.headers.get("x-frame-options")?.toLowerCase() ?? "";
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;

    const csp = res.headers.get("content-security-policy")?.toLowerCase() ?? "";
    const ancestors = /frame-ancestors([^;]*)/.exec(csp)?.[1] ?? "";
    // A frame-ancestors list we are not on is a no. Only a bare wildcard is a
    // yes — anything naming specific origins excludes us.
    if (ancestors && !ancestors.includes("*")) return false;

    return true;
  } catch {
    // A demo we cannot reach is one we should not try to frame.
    return undefined;
  }
}

async function dismissConsent(page: import("playwright").Page): Promise<void> {
  const labels = [/accept all/i, /accept cookies/i, /^accept$/i, /^agree$/i, /got it/i];
  for (const label of labels) {
    const button = page.getByRole("button", { name: label }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(400);
      return;
    }
  }
}

async function main() {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });

  const index = readIndex();
  const templates = readTemplates()
    .filter((t) => t.demoUrl)
    .filter((t) => (ONLY ? ONLY.some((needle) => t.slug.includes(needle)) : true))
    .filter((t) => FORCE || !index.shots[t.id]);

  if (templates.length === 0) {
    console.log("Nothing new to capture. Pass --force to recapture.");
  }

  // Backfill the embeddable flag for anything captured before it existed,
  // without recapturing the image.
  const needsFlag = readTemplates().filter(
    (t) => t.demoUrl && index.shots[t.id] && index.shots[t.id].embeddable === undefined,
  );
  if (needsFlag.length > 0) {
    console.log(`Checking ${needsFlag.length} demos for embeddability…`);
    let allowed = 0;
    for (let i = 0; i < needsFlag.length; i += 8) {
      const batch = needsFlag.slice(i, i + 8);
      const results = await Promise.all(batch.map((t) => checkEmbeddable(t.demoUrl!)));
      batch.forEach((t, j) => {
        const value = results[j];
        if (value !== undefined) {
          index.shots[t.id].embeddable = value;
          if (value) allowed++;
        }
      });
    }
    index.generatedAt = new Date().toISOString();
    fs.writeFileSync(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);
    console.log(`  ${allowed} of ${needsFlag.length} allow framing\n`);
  }

  if (templates.length === 0) return;

  console.log(`Capturing ${templates.length} screenshots (${CONCURRENCY} at a time)…\n`);
  const browser = await chromium.launch({
    // Set PLAYWRIGHT_CHROMIUM_PATH when the machine already has a Chromium
    // that Playwright did not download itself (most CI images, and any
    // sandbox that pins its own build).
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  const failures: string[] = [];

  // A small pool: enough to hide the network wait, few enough that a slow demo
  // does not starve the others.
  const queue = [...templates];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let template = queue.shift(); template; template = queue.shift()) {
        const result = await capture(browser, template);
        if ("error" in result) {
          failures.push(`${template.slug}: ${result.error}`);
          console.log(`  ✗ ${template.slug} — ${result.error}`);
        } else {
          index.shots[template.id] = result;
          console.log(`  ✓ ${template.slug}`);
        }
      }
    }),
  );

  await browser.close();

  index.generatedAt = new Date().toISOString();
  fs.writeFileSync(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);

  const captured = templates.length - failures.length;
  console.log(`\n${captured} captured, ${failures.length} failed.`);
  if (failures.length > 0) {
    console.log("Failures fall back to the GitHub social card:");
    for (const failure of failures) console.log(`  ${failure}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
