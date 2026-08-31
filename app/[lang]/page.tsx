import Link from "next/link";
import { notFound } from "next/navigation";
import { TemplateCard } from "@/components/TemplateCard";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { categoryName } from "@/lib/categories";
import { categorySlug, getAllTemplates, getCategories, getFrameworks } from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return { alternates: { canonical: `/${lang}` } };
}

function SectionHeading({
  eyebrow,
  title,
  children,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2">
      <div className="max-w-xl">
        {eyebrow ? (
          <p className="mb-2 text-[13px] font-medium tracking-wide text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {children ? (
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{children}</p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="ml-auto text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative rounded-xl border border-line bg-raised p-6">
      <span className="mb-4 grid h-7 w-7 place-items-center rounded-full border border-accent/40 bg-accent/10 text-[13px] font-semibold text-accent">
        {n}
      </span>
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{children}</p>
    </li>
  );
}

export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const templates = getAllTemplates();
  const categories = getCategories();
  const frameworks = getFrameworks();
  const copyable = templates.filter((x) => x.usage === "copy").length;

  // Featured first, then whatever has the most stars, to fill the row.
  const showcase = [
    ...templates.filter((x) => x.featured),
    ...templates.filter((x) => !x.featured),
  ].slice(0, 6);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] opacity-[0.18]"
          style={{
            background: "radial-gradient(60% 60% at 50% 50%, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1 text-[13px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {t.landing.badge(copyable)}
          </p>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {t.landing.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {t.landing.lede}
          </p>

          <form action={`/${lang}/templates`} method="get" className="mt-9 max-w-xl">
            <div className="flex gap-2">
              <input
                type="text"
                name="intent"
                placeholder={t.landing.searchPlaceholder}
                aria-label={t.landing.intentHint}
                className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-4 py-3 text-sm text-fg placeholder:text-subtle focus:border-line-strong"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
              >
                {t.landing.searchAction}
              </button>
            </div>
            <p className="mt-2.5 text-[13px] text-subtle">{t.landing.intentHint}</p>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-subtle">
            <Link
              href={`/${lang}/templates`}
              className="text-muted underline-offset-4 hover:underline"
            >
              {t.landing.browseAll(templates.length)}
            </Link>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span>
              {frameworks
                .slice(0, 5)
                .map((f) => f.name)
                .join(" · ")}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.landing.showcaseEyebrow}
          title={t.landing.showcaseTitle}
          href={`/${lang}/templates`}
          linkLabel={t.landing.seeAll}
        >
          {t.landing.showcaseLede}
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((template) => (
            <TemplateCard key={template.id} template={template} lang={lang} t={t.licence} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-raised/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading eyebrow={t.landing.stepsEyebrow} title={t.landing.stepsTitle}>
            {t.landing.stepsLede}
          </SectionHeading>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Step n={1} title={t.landing.step1Title}>
              {t.landing.step1Body}
            </Step>
            <Step n={2} title={t.landing.step2Title}>
              {t.landing.step2Body}
            </Step>
            <Step n={3} title={t.landing.step3Title}>
              {t.landing.step3Body}
            </Step>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t.landing.categoriesEyebrow} title={t.landing.categoriesTitle} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/${lang}/templates/${categorySlug(category.name)}`}
              className="group flex items-center justify-between rounded-xl border border-line bg-raised px-4 py-4 transition-colors hover:border-line-strong hover:bg-hover"
            >
              <span className="text-sm font-medium">{categoryName(category.name, lang)}</span>
              <span className="text-[13px] text-subtle transition-colors group-hover:text-muted">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow={t.landing.licensingEyebrow} title={t.landing.licensingTitle}>
              {t.landing.licensingLede}
            </SectionHeading>
            <Link
              href={`/${lang}/about`}
              className="text-[15px] text-accent underline-offset-4 hover:underline"
            >
              {t.landing.licensingLink}
            </Link>
          </div>

          <ul className="space-y-4 text-[15px] leading-relaxed text-muted">
            {[
              [t.landing.licensingPoint1Strong, t.landing.licensingPoint1],
              [t.landing.licensingPoint2Strong, t.landing.licensingPoint2],
              [t.landing.licensingPoint3Strong, t.landing.licensingPoint3],
            ].map(([strong, rest]) => (
              <li key={strong} className="flex gap-3">
                <span aria-hidden className="mt-1 text-accent">
                  ✓
                </span>
                <span>
                  <strong className="font-medium text-fg">{strong}</strong>
                  {rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.landing.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            {t.landing.ctaLede}
          </p>
          <Link
            href={`/${lang}/templates`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
          >
            {t.landing.ctaAction}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
