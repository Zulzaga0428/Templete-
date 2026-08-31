import { ImageResponse } from "next/og";
import { getDictionary, isLocale, LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { getAllTemplates } from "@/lib/templates";

export const alt = "Templete";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = getDictionary(locale);
  const copyable = getAllTemplates().filter((x) => x.usage === "copy").length;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={locale === "mn" ? "Kodu-д зориулсан template" : "templates for Kodu"}
        title={t.landing.title}
        description={t.landing.lede}
        chips={[t.landing.badge(copyable)]}
      />
    ),
    size,
  );
}
