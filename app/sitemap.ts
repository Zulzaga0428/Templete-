import type { MetadataRoute } from "next";
import { getAllTemplates } from "@/lib/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://templete.kodu.live";

export default function sitemap(): MetadataRoute.Sitemap {
  const templates = getAllTemplates().map((t) => ({
    url: `${SITE_URL}/t/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    ...templates,
  ];
}
