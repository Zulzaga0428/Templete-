import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LicenseBadge } from "@/components/LicenseBadge";
import { OpenInKodu } from "@/components/OpenInKodu";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplateDetails } from "@/components/TemplateDetails";
import { LivePreview } from "@/components/LivePreview";
import { categoryName } from "@/lib/categories";
import { format, getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { usageExplanation } from "@/lib/licenses";
import {
  categorySlug,
  getAllTemplates,
  getDerivatives,
  getRelated,
  getTemplateBySlug,
} from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getAllTemplates().map((t) => ({ lang, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/t/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!isLocale(lang)) return {};
  if (!template) return { title: getDictionary(lang).detail.notFound };

  return {
    title: template.title,
    description: template.description,
    alternates: { canonical: `/${lang}/t/${template.slug}` },
    // No `images` here: opengraph-image.tsx generates the card.
    openGraph: { title: `${template.title} — Templete`, description: template.description },
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-fg">{value}</dd>
    </div>
  );
}

export default async function TemplatePage({ params }: PageProps<"/[lang]/t/[slug]">) {
  const { lang, slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!isLocale(lang) || !template) notFound();

  const t = getDictionary(lang);
  const related = getRelated(template);
  const derivatives = getDerivatives(template);
  const origin = template.derivedFrom ?? null;
  const updated = new Date(template.updatedAt).toLocaleDateString(
    lang === "mn" ? "mn-MN" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 sm:px-6">
      <nav className="py-6 text-[13px] text-subtle">
        <Link
          href={`/${lang}/templates`}
          className="underline-offset-4 hover:text-fg hover:underline"
        >
          {t.nav.templates}
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link
          href={`/${lang}/templates/${categorySlug(template.category)}`}
          className="underline-offset-4 hover:text-fg hover:underline"
        >
          {categoryName(template.category, lang)}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <LivePreview
            demoUrl={template.demoUrl}
            screenshotUrl={template.screenshotUrl}
            imageUrl={template.imageUrl}
            title={template.title}
            seed={template.id}
            embeddable={template.embeddable}
            labels={{
              tryIt: t.detail.tryItLive,
              tryItNote: t.detail.tryItNote,
              showScreenshot: t.detail.showScreenshot,
              liveNote: t.detail.liveNote,
            }}
          />

          <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
            {template.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            {template.description}
          </p>

          {template.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-raised px-2.5 py-1 text-[11px] text-subtle"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {template.details ? (
            <TemplateDetails
              details={template.details}
              sourceUrl={template.sourceUrl}
              t={t.detail}
            />
          ) : null}

          <section
            className={`${template.details ? "mt-4" : "mt-10"} rounded-xl border border-line bg-raised p-5`}
          >
            <h2 className="text-sm font-semibold">{t.detail.licenceHeading}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {usageExplanation(template.license, t.licence)}
            </p>
            {template.license.url ? (
              <a
                href={`${template.sourceUrl}#license`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-[13px] text-accent underline-offset-4 hover:underline"
              >
                {t.detail.readLicence}
              </a>
            ) : null}
          </section>

          {origin ? (
            <section className="mt-4 rounded-xl border border-line bg-raised p-5">
              <h2 className="text-sm font-semibold">{t.detail.basedOnHeading}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {origin.license
                  ? format(t.detail.basedOn, {
                      name: origin.name,
                      author: origin.author,
                      license: origin.license,
                    })
                  : format(t.detail.basedOnNoLicense, {
                      name: origin.name,
                      author: origin.author,
                    })}
              </p>
              {origin.note ? (
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{origin.note}</p>
              ) : null}
              <a
                href={origin.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-[13px] text-accent underline-offset-4 hover:underline"
              >
                {t.detail.viewOriginal}
              </a>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-raised p-5">
            {/* useSearchParams needs a boundary, or the whole page falls back
                to rendering per request. */}
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="h-[42px] rounded-lg bg-hover"
                />
              }
            >
              <OpenInKodu
                template={template}
                labels={{
                  openInKodu: t.detail.openInKodu,
                  viewOnGitHub: t.detail.viewOnGitHub,
                  withIntent: t.detail.withIntent,
                }}
              />
            </Suspense>

            <div className="mt-3 flex gap-2">
              {template.demoUrl ? (
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-[13px] text-muted transition-colors hover:bg-hover hover:text-fg"
                >
                  {t.detail.liveDemo}
                </a>
              ) : null}
              <a
                href={template.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-[13px] text-muted transition-colors hover:bg-hover hover:text-fg"
              >
                {t.detail.source}
              </a>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <Stat label={t.detail.stars} value={template.stars.toLocaleString("en-GB")} />
              <Stat
                label={t.detail.forks}
                value={(template.repo?.forks ?? 0).toLocaleString("en-GB")}
              />
              <Stat label={t.detail.updated} value={updated} />
              <Stat label={t.detail.category} value={categoryName(template.category, lang)} />
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-line pt-5">
              <LicenseBadge template={template} t={t.licence} />
              {template.frameworks.map((framework) => (
                <span
                  key={framework}
                  className="rounded-full border border-line px-2 py-0.5 text-[11px] text-subtle"
                >
                  {framework}
                </span>
              ))}
            </div>

            {template.repo ? (
              <p className="mt-5 border-t border-line pt-5 text-[11px] leading-relaxed text-subtle">
                <a
                  href={`https://github.com/${template.repo.owner}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted underline-offset-4 hover:underline"
                >
                  {t.detail.byAuthor(template.repo.owner)}
                </a>
                {t.detail.copyNote}
              </p>
            ) : null}
          </div>
        </aside>
      </div>

      {derivatives.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-4 text-sm font-semibold text-muted">{t.detail.derivativesHeading}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {derivatives.map((item) => (
              <TemplateCard key={item.id} template={item} lang={lang} t={t.licence} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-4 text-sm font-semibold text-muted">{t.detail.similar}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <TemplateCard key={item.id} template={item} lang={lang} t={t.licence} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
