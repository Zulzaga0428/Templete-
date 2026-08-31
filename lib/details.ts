/**
 * The extra facts a template page needs to be worth reading — and worth
 * indexing. A page carrying only a one-line description has around 17 words of
 * its own, which is not enough for a search engine to consider it a page about
 * anything.
 *
 * Kept in data/details.json keyed by template id, for the same reason as
 * screenshots: an ingest run rewrites templates.json from scratch, and these
 * cost an API call each to produce.
 */

/** One concrete thing the template ships, read from its package.json. */
export interface StackFact {
  /** Display name, e.g. "Next.js" or "Prisma". */
  name: string;
  /** Resolved major version where the manifest pins one, e.g. "16". */
  version: string | null;
  /** What it is there for, in the reader's language. */
  role: "framework" | "styling" | "database" | "auth" | "payments" | "testing" | "content" | "ui";
}

export interface TemplateDetails {
  /** Opening paragraphs of the README, cleaned of badges and markup. */
  summary: string | null;
  /** Bullets from a Features-style section, at most eight. */
  features: string[];
  /** What the manifest actually depends on. */
  stack: StackFact[];
  /** Total dependency count, as a rough gauge of how much comes with it. */
  dependencyCount: number | null;
  fetchedAt: string;
}

export interface DetailsIndex {
  generatedAt: string;
  details: Record<string, TemplateDetails>;
}

/** Packages worth naming on the page, and what to call them. */
const KNOWN: Record<string, { name: string; role: StackFact["role"] }> = {
  next: { name: "Next.js", role: "framework" },
  react: { name: "React", role: "framework" },
  vue: { name: "Vue", role: "framework" },
  nuxt: { name: "Nuxt", role: "framework" },
  svelte: { name: "Svelte", role: "framework" },
  astro: { name: "Astro", role: "framework" },
  "@remix-run/react": { name: "Remix", role: "framework" },
  vite: { name: "Vite", role: "framework" },
  tailwindcss: { name: "Tailwind CSS", role: "styling" },
  sass: { name: "Sass", role: "styling" },
  "styled-components": { name: "styled-components", role: "styling" },
  bootstrap: { name: "Bootstrap", role: "styling" },
  "@mui/material": { name: "MUI", role: "ui" },
  "@chakra-ui/react": { name: "Chakra UI", role: "ui" },
  "@mantine/core": { name: "Mantine", role: "ui" },
  antd: { name: "Ant Design", role: "ui" },
  "@radix-ui/react-dialog": { name: "Radix UI", role: "ui" },
  "lucide-react": { name: "Lucide icons", role: "ui" },
  prisma: { name: "Prisma", role: "database" },
  "@prisma/client": { name: "Prisma", role: "database" },
  "drizzle-orm": { name: "Drizzle ORM", role: "database" },
  mongoose: { name: "Mongoose", role: "database" },
  "@supabase/supabase-js": { name: "Supabase", role: "database" },
  convex: { name: "Convex", role: "database" },
  "next-auth": { name: "NextAuth", role: "auth" },
  "@auth/core": { name: "Auth.js", role: "auth" },
  "@clerk/nextjs": { name: "Clerk", role: "auth" },
  "better-auth": { name: "Better Auth", role: "auth" },
  stripe: { name: "Stripe", role: "payments" },
  "@stripe/stripe-js": { name: "Stripe", role: "payments" },
  "@paddle/paddle-js": { name: "Paddle", role: "payments" },
  vitest: { name: "Vitest", role: "testing" },
  jest: { name: "Jest", role: "testing" },
  "@playwright/test": { name: "Playwright", role: "testing" },
  cypress: { name: "Cypress", role: "testing" },
  "contentlayer2": { name: "Contentlayer", role: "content" },
  "@next/mdx": { name: "MDX", role: "content" },
  "next-mdx-remote": { name: "MDX", role: "content" },
  "gray-matter": { name: "Markdown front matter", role: "content" },
};

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** "^16.3.3" -> "16". Ranges without a number resolve to null. */
function majorVersion(range: string): string | null {
  const match = /(\d+)/.exec(range.replace(/^[^\d]*/, ""));
  return match ? match[1] : null;
}

export function readStack(pkg: PackageJson | null): {
  stack: StackFact[];
  dependencyCount: number | null;
} {
  if (!pkg) return { stack: [], dependencyCount: null };

  const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const seen = new Set<string>();
  const stack: StackFact[] = [];

  for (const [name, range] of Object.entries(all)) {
    const known = KNOWN[name];
    // Several package names map to one product — Prisma and Stripe each ship
    // two — so the display name is what gets deduplicated, not the package.
    if (!known || seen.has(known.name)) continue;
    seen.add(known.name);
    stack.push({ name: known.name, version: majorVersion(range), role: known.role });
  }

  const order: StackFact["role"][] = [
    "framework", "styling", "ui", "database", "auth", "payments", "content", "testing",
  ];
  stack.sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));

  return { stack, dependencyCount: Object.keys(pkg.dependencies ?? {}).length };
}

/**
 * Turns a README into a paragraph a person would want to read.
 *
 * READMEs open with badge rows, centred HTML, logos and demo links before they
 * say what the thing is. All of that has to go, or the page ends up quoting
 * "npm version build passing license MIT" as its description.
 */
export function readSummary(readme: string | null, maxChars = 600): string | null {
  if (!readme) return null;

  const cleaned = readme
    // Fenced code, HTML blocks, comments, and the tables people put at the top.
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    // Images and the badge links that wrap them.
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // Links keep their text, lose their target.
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\r/g, "");

  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    // A line of shields, a lone heading, or a list item is not a description.
    .filter((p) => p.length > 60 && !/^[-•*\d.]\s/.test(p) && /[.!?]/.test(p));

  if (paragraphs.length === 0) return null;

  let summary = "";
  for (const paragraph of paragraphs) {
    if (summary.length + paragraph.length > maxChars) break;
    summary += (summary ? " " : "") + paragraph;
  }

  // A single paragraph longer than the budget still beats nothing: cut it at a
  // sentence rather than mid-word.
  if (!summary) {
    const first = paragraphs[0].slice(0, maxChars);
    const lastStop = Math.max(first.lastIndexOf(". "), first.lastIndexOf("! "));
    summary = lastStop > 120 ? first.slice(0, lastStop + 1) : `${first.trimEnd()}…`;
  }

  return summary || null;
}

/** Bullets from a Features-style section, cleaned and capped. */
export function readFeatures(readme: string | null, max = 8): string[] {
  if (!readme) return [];

  // No `m` flag on purpose. With it, `$` matches the end of any line, so the
  // lazy body stops at the blank line right under the heading and the section
  // always comes back empty. The heading is anchored with an explicit newline
  // instead, and `$` means the end of the document.
  const section = new RegExp(
    String.raw`(?:^|\n)#{1,4}[ \t]*[^\n]*\b(features?|what'?s included|includes|highlights|what you get)\b[^\n]*\n([\s\S]*?)(?=\n#{1,4}[ \t]|$)`,
    "i",
  ).exec(readme);
  if (!section) return [];

  return section[2]
    .split("\n")
    .filter((line) => /^\s*[-*+]\s+/.test(line))
    .map((line) =>
      line
        .replace(/^\s*[-*+]\s+/, "")
        .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/[*_`]/g, "")
        // Checklist markers say nothing to a reader outside the repo.
        .replace(/^\[[ xX]\]\s*/, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((line) => line.length > 3 && line.length < 160)
    .slice(0, max);
}
