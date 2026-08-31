import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { categoryCopy, categoryName } from "@/lib/categories";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import {
  categoryFromSlug,
  categorySlug,
  getCategories,
  getFrameworks,
  getTemplatesByCategory,
} from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getCategories().map((c) => ({ lang, category: categorySlug(c.name) })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/templates/[category]">): Promise<Metadata> {
  const { lang, category: slug } = await params;
  const name = categoryFromSlug(slug);
  if (!isLocale(lang) || !name) return {};

  const templates = getTemplatesByCategory(name);
  const copy = categoryCopy(name, templates.length, lang);

  return {
    title: copy.headline,
    description: copy.meta,
    alternates: { canonical: `/${lang}/templates/${slug}` },
    openGraph: { title: `${copy.headline} — Templete`, description: copy.meta },
  };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/templates/[category]">) {
  const { lang, category: slug } = await params;
  const name = categoryFromSlug(slug);
  if (!isLocale(lang) || !name) notFound();

  const t = getDictionary(lang);
  const templates = getTemplatesByCategory(name);
  const copy = categoryCopy(name, templates.length, lang);
  const others = getCategories().filter((c) => c.name !== name);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <nav className="pt-6 text-[13px] text-subtle">
        <Link
          href={`/${lang}/templates`}
          className="underline-offset-4 hover:text-fg hover:underline"
        >
          {t.nav.templates}
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-muted">{categoryName(name, lang)}</span>
      </nav>

      <header className="py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{copy.headline}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{copy.intro}</p>
      </header>

      <Gallery
        templates={templates}
        categories={getCategories().map((c) => ({ ...c, label: categoryName(c.name, lang) }))}
        frameworks={getFrameworks(templates)}
        lang={lang}
        t={t.gallery}
        licenceT={t.licence}
        hideCategoryFilter
      />

      <section className="mt-16 border-t border-line pt-8">
        <h2 className="mb-4 text-sm font-semibold text-muted">{t.gallery.otherCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c.name}
              href={`/${lang}/templates/${categorySlug(c.name)}`}
              className="rounded-full border border-line bg-raised px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {categoryName(c.name, lang)}
              <span className="ml-1.5 opacity-60">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-20" />
    </main>
  );
}
