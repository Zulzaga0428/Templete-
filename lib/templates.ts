import fs from "node:fs";
import path from "node:path";
import type { Template, TemplateIndex } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function readIndex(file: string): Template[] {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(full, "utf8")) as TemplateIndex;
    return Array.isArray(parsed.templates) ? parsed.templates : [];
  } catch (error) {
    // A malformed data file should fail the build loudly rather than ship an
    // empty gallery that looks like a working site.
    throw new Error(`Could not parse data/${file}: ${(error as Error).message}`);
  }
}

let cache: Template[] | null = null;

export function getAllTemplates(): Template[] {
  if (cache) return cache;

  const curated = readIndex("curated.json");
  const ingested = readIndex("templates.json");

  // Curated entries win on id collision — a hand-written description beats a
  // scraped one.
  const byId = new Map<string, Template>();
  for (const t of ingested) byId.set(t.id, t);
  for (const t of curated) byId.set(t.id, t);

  cache = [...byId.values()].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.stars - a.stars;
  });
  return cache;
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return getAllTemplates().find((t) => t.slug === slug);
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of getAllTemplates()) {
    counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getFrameworks(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of getAllTemplates()) {
    for (const f of t.frameworks) counts.set(f, (counts.get(f) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getRelated(template: Template, limit = 4): Template[] {
  const overlap = (t: Template) =>
    t.frameworks.filter((f) => template.frameworks.includes(f)).length +
    (t.category === template.category ? 2 : 0);

  return getAllTemplates()
    .filter((t) => t.id !== template.id)
    .map((t) => ({ t, score: overlap(t) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.t.stars - a.t.stars)
    .slice(0, limit)
    .map((x) => x.t);
}
