import { ImageResponse } from "next/og";
import { DEFAULT_LOCALE, getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { licenseLabel } from "@/lib/licenses";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { getAllTemplates, getTemplateBySlug } from "@/lib/templates";

export const alt = "Template on Templete";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getAllTemplates().map((t) => ({ lang, slug: t.slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = getDictionary(locale);
  const template = getTemplateBySlug(slug);

  if (!template) {
    return new ImageResponse(<OgCard eyebrow="Templete" title={t.detail.notFound} />, size);
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={template.category.toLowerCase()}
        title={template.title}
        description={template.description}
        chips={[licenseLabel(template.license, t.licence.none), ...template.frameworks.slice(0, 3)]}
      />
    ),
    size,
  );
}
