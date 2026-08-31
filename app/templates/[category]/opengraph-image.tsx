import { ImageResponse } from "next/og";
import { categoryCopy } from "@/lib/categories";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { categoryFromSlug, categorySlug, getCategories, getTemplatesByCategory } from "@/lib/templates";

export const alt = "Templates by category";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: categorySlug(c.name) }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);

  if (!category) {
    return new ImageResponse(<OgCard eyebrow="templates" title="Category not found" />, size);
  }

  const templates = getTemplatesByCategory(category);
  const copy = categoryCopy(category, templates.length);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="browse by category"
        title={copy.headline}
        description={copy.intro}
        chips={[`${templates.length} templates`, "Open source"]}
      />
    ),
    size,
  );
}
