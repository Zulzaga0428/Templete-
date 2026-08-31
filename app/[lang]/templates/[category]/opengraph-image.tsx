import { ImageResponse } from "next/og";
import { categoryCopy } from "@/lib/categories";
import { DEFAULT_LOCALE, format, getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { categoryFromSlug, categorySlug, getCategories, getTemplatesByCategory } from "@/lib/templates";

export const alt = "Templates by category";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getCategories().map((c) => ({ lang, category: categorySlug(c.name) })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category: slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = getDictionary(locale);
  const name = categoryFromSlug(slug);

  if (!name) {
    return new ImageResponse(<OgCard eyebrow="Templete" title={t.detail.notFound} />, size);
  }

  const templates = getTemplatesByCategory(name);
  const copy = categoryCopy(name, templates.length, locale);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={t.landing.categoriesEyebrow.toLowerCase()}
        title={copy.headline}
        description={copy.intro}
        chips={[format(t.gallery.resultCount, { shown: templates.length, total: templates.length })]}
      />
    ),
    size,
  );
}
