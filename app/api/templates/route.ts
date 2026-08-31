import { NextResponse } from "next/server";
import { koduOpenUrl } from "@/lib/kodu";
import {
  categorySlug,
  getAllTemplates,
  getCategories,
  getContentLanguages,
  getFrameworks,
} from "@/lib/templates";
import type { Template } from "@/lib/types";

/**
 * The gallery as data, so Kodu can render its own template picker from the
 * same source rather than keeping a second copy of it.
 *
 * There is no database behind any of this: the ingest writes a JSON file,
 * this endpoint serves it, and both the website and Kodu read the one thing.
 *
 *   GET /api/templates
 *   GET /api/templates?category=dashboard&framework=Next.js&copyable=true
 *   GET /api/templates?lang=mn&limit=12
 *   GET /api/templates?q=admin+dashboard
 *
 * Rendered per request rather than statically: a static handler is built once
 * and serves the same body for every query string, which silently ignores
 * every filter. The work is a filter over an in-memory array, and the
 * Cache-Control header lets a CDN absorb the traffic anyway.
 */

/** Trimmed for a picker: enough to render a card and open the template. */
function toPublic(template: Template) {
  return {
    id: template.id,
    slug: template.slug,
    title: template.title,
    description: template.description,
    category: template.category,
    categorySlug: categorySlug(template.category),
    frameworks: template.frameworks,
    tags: template.tags,
    stars: template.stars,
    updatedAt: template.updatedAt,
    featured: template.featured,
    contentLanguage: template.contentLanguage ?? "en",
    license: template.license.spdx,
    // Whether Kodu may clone it. `false` means link-only: the licence does not
    // let us copy the code, so a picker must not offer it as a starting point.
    copyable: template.usage === "copy",
    repo: template.repo ? `${template.repo.owner}/${template.repo.name}` : null,
    ref: template.repo?.defaultBranch ?? null,
    cloneUrl: template.usage === "copy" ? (template.repo?.cloneUrl ?? null) : null,
    sourceUrl: template.sourceUrl,
    demoUrl: template.demoUrl,
    imageUrl: template.screenshotUrl ?? template.imageUrl,
    derivedFrom: template.derivedFrom ?? null,
    openUrl: koduOpenUrl(template),
  };
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const category = params.get("category");
  const framework = params.get("framework");
  const lang = params.get("lang");
  const query = params.get("q")?.trim().toLowerCase();
  const copyable = params.get("copyable");
  const limit = Number(params.get("limit") ?? 0);

  let templates = getAllTemplates();

  if (category) {
    templates = templates.filter((t) => categorySlug(t.category) === category.toLowerCase());
  }
  if (framework) {
    const needle = framework.toLowerCase();
    templates = templates.filter((t) => t.frameworks.some((f) => f.toLowerCase() === needle));
  }
  if (lang) {
    templates = templates.filter((t) => (t.contentLanguage ?? "en") === lang);
  }
  if (copyable === "true") {
    templates = templates.filter((t) => t.usage === "copy");
  }
  if (query) {
    const words = query.split(/\s+/);
    templates = templates.filter((t) => {
      const haystack = [t.title, t.description, t.category, ...t.frameworks, ...t.tags]
        .join(" ")
        .toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }

  const total = templates.length;
  if (limit > 0) templates = templates.slice(0, limit);

  return NextResponse.json(
    {
      total,
      count: templates.length,
      categories: getCategories().map((c) => ({ ...c, slug: categorySlug(c.name) })),
      frameworks: getFrameworks(),
      languages: getContentLanguages(),
      templates: templates.map(toPublic),
    },
    {
      headers: {
        // Public data, read by kodu.live from the browser.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
