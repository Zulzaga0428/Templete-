import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { format, getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { matchIntent } from "@/lib/intent";
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

  const { q, category, intent: rawIntent } = await searchParams;
  const t = getDictionary(lang);
  const all = getAllTemplates();

  // A description from the landing page ranks the gallery instead of filtering
  // it; the search box still works on whatever comes back.
  const intent = typeof rawIntent === "string" ? rawIntent.trim().slice(0, 500) : "";
  const matches = intent ? matchIntent(all, intent, 60) : null;
  const templates = matches ? matches.map((m) => m.template) : all;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      {intent ? (
        <header className="py-10 sm:py-14">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.gallery.intentHeading}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] italic leading-relaxed text-muted">
            {format(t.gallery.intentQuote, { intent })}
          </p>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-subtle">
            {templates.length > 0 ? t.gallery.intentNote : t.gallery.intentEmpty}
          </p>
          <Link
            href={`/${lang}/templates`}
            className="mt-4 inline-block text-[13px] text-accent underline-offset-4 hover:underline"
          >
            {t.gallery.showAll} →
          </Link>
        </header>
      ) : (
        <header className="py-10 sm:py-14">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.gallery.title}</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            {format(t.gallery.lede, { count: all.length })}
          </p>
        </header>
      )}

      {templates.length > 0 ? (
        <Gallery
          templates={templates}
          categories={getCategories(templates).map((c) => ({
            ...c,
            label: categoryName(c.name, lang),
          }))}
          frameworks={getFrameworks(templates)}
          lang={lang}
          t={t.gallery}
          licenceT={t.licence}
          initialQuery={typeof q === "string" ? q : ""}
          initialCategory={typeof category === "string" ? category : undefined}
          intent={intent || undefined}
        />
      ) : null}

      <div className="h-20" />
    </main>
  );
}
