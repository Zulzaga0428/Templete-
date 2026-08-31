import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { format, getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { categoryName } from "@/lib/categories";
import { getAllTemplates, getCategories, getFrameworks } from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/templates">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.gallery.title,
    description: t.gallery.metaDescription,
    alternates: { canonical: `/${lang}/templates` },
  };
}

export default async function TemplatesPage({
  params,
  searchParams,
}: PageProps<"/[lang]/templates">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { q, category } = await searchParams;
  const t = getDictionary(lang);
  const templates = getAllTemplates();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <header className="py-10 sm:py-14">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.gallery.title}</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          {format(t.gallery.lede, { count: templates.length })}
        </p>
      </header>

      <Gallery
        templates={templates}
        categories={getCategories().map((c) => ({ ...c, label: categoryName(c.name, lang) }))}
        frameworks={getFrameworks()}
        lang={lang}
        t={t.gallery}
        licenceT={t.licence}
        initialQuery={typeof q === "string" ? q : ""}
        initialCategory={typeof category === "string" ? category : undefined}
      />

      <div className="h-20" />
    </main>
  );
}
