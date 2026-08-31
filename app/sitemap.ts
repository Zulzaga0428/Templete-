import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { categorySlug, getAllTemplates, getCategories } from "@/lib/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://templete.kodu.live";

/** Both language versions of a URL, cross-linked so crawlers pair them up. */
function alternates(path: string) {
  return {
    languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LOCALES) {
    entries.push(
      {
        url: `${SITE_URL}/${lang}`,
        changeFrequency: "daily",
        priority: 1,
        alternates: alternates(""),
      },
      {
        url: `${SITE_URL}/${lang}/templates`,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: alternates("/templates"),
      },
      {
        url: `${SITE_URL}/${lang}/about`,
        changeFrequency: "monthly",
        priority: 0.3,
        alternates: alternates("/about"),
      },
    );

    for (const category of getCategories()) {
      const path = `/templates/${categorySlug(category.name)}`;
      entries.push({
        url: `${SITE_URL}/${lang}${path}`,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: alternates(path),
      });
    }

    for (const template of getAllTemplates()) {
      const path = `/t/${template.slug}`;
      entries.push({
        url: `${SITE_URL}/${lang}${path}`,
        lastModified: new Date(template.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
