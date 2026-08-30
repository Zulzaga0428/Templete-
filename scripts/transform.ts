/**
 * Turns a GitHub repository payload into a gallery Template.
 * Shared by the live ingest (scripts/ingest.ts) and the seed data builder
 * (scripts/seed.ts) so both produce identical records.
 */
import { normalizeLicense } from "../lib/licenses";
import type { Template } from "../lib/types";
import { CATEGORY_RULES, FRAMEWORK_TOPICS, REJECT_PATTERNS } from "./sources";

export interface RepoLike {
  full_name: string;
  name: string;
  owner: { login: string };
  html_url: string;
  description: string | null;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  pushed_at?: string;
  updated_at: string;
  archived: boolean;
  disabled?: boolean;
  fork: boolean;
  topics?: string[];
  license: { spdx_id?: string | null; name?: string | null; url?: string | null } | null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function titleize(name: string): string {
  return name
    .replace(/\.(github|io|dev|com)$/i, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function detectFrameworks(repo: RepoLike): string[] {
  const found = new Set<string>();
  for (const topic of repo.topics ?? []) {
    const label = FRAMEWORK_TOPICS[topic];
    if (label) found.add(label);
  }
  // Fall back to name/description when a repo tags nothing useful.
  const haystack = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  for (const [topic, label] of Object.entries(FRAMEWORK_TOPICS)) {
    if (found.size >= 5) break;
    if (new RegExp(`\\b${topic}\\b`).test(haystack)) found.add(label);
  }
  return [...found];
}

export function detectCategory(repo: RepoLike, fallback: string): string {
  const haystack = `${(repo.topics ?? []).join(" ")} ${repo.name} ${repo.description ?? ""}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(haystack)) return rule.category;
  }
  return fallback;
}

export function isRejected(repo: RepoLike): boolean {
  const haystack = `${repo.name} ${repo.description ?? ""}`;
  return REJECT_PATTERNS.some((p) => p.test(haystack));
}

export function toTemplate(
  repo: RepoLike,
  options: { fallbackCategory: string; featured?: boolean },
): Template {
  const license = normalizeLicense(repo.license);
  const updatedAt = repo.pushed_at ?? repo.updated_at;

  return {
    id: `github:${repo.full_name}`,
    slug: slugify(`${repo.owner.login}-${repo.name}`),
    name: repo.name,
    title: titleize(repo.name),
    description: (repo.description ?? "").trim(),
    source: "github",
    sourceUrl: repo.html_url,
    demoUrl: repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : null,
    // GitHub renders a social card for every public repo — a free, stable
    // thumbnail with no scraping and no screenshot pipeline to babysit.
    imageUrl: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    repo: {
      owner: repo.owner.login,
      name: repo.name,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: updatedAt,
      cloneUrl: `${repo.html_url}.git`,
      tarballUrl: `https://api.github.com/repos/${repo.full_name}/tarball/${repo.default_branch}`,
    },
    license,
    usage: license.permissive ? "copy" : "link",
    category: detectCategory(repo, options.fallbackCategory),
    frameworks: detectFrameworks(repo),
    tags: (repo.topics ?? []).slice(0, 12),
    stars: repo.stargazers_count,
    updatedAt,
    ingestedAt: new Date().toISOString(),
    featured: options.featured ?? false,
  };
}
