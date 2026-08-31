import type { MetadataRoute } from "next";
import { categorySlug, getAllTemplates, getCategories } from "@/lib/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://templete.kodu.live";

export default function sitemap(): MetadataRoute.Sitemap {
  const templates = getAllTemplates().map((t) => ({
    url: `${SITE_URL}/t/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categories = getCategories().map((c) => ({
    url: `${SITE_URL}/templates/${categorySlug(c.name)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/templates`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    ...categories,
    ...templates,
  ];
}
