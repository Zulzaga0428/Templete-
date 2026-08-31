import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LicenseBadge } from "@/components/LicenseBadge";
import { OpenInKodu } from "@/components/OpenInKodu";
import { TemplateCard } from "@/components/TemplateCard";
import { Thumbnail } from "@/components/Thumbnail";
import { usageExplanation } from "@/lib/licenses";
import { categorySlug, getAllTemplates, getRelated, getTemplateBySlug } from "@/lib/templates";

export function generateStaticParams() {
  return getAllTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/t/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "Template not found" };

  return {
    title: template.title,
    description: template.description,
    alternates: { canonical: `/t/${template.slug}` },
    // No `images` here: app/t/[slug]/opengraph-image.tsx generates the card.
    openGraph: {
      title: `${template.title} — Templete`,
      description: template.description,
    },
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

export default async function TemplatePage({ params }: PageProps<"/t/[slug]">) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const related = getRelated(template);
  const updated = new Date(template.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 sm:px-6">
      <nav className="py-6 text-[13px] text-subtle">
        <Link href="/templates" className="underline-offset-4 hover:text-fg hover:underline">
          Templates
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link
          href={`/templates/${categorySlug(template.category)}`}
          className="underline-offset-4 hover:text-fg hover:underline"
        >
          {template.category}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-line bg-raised">
            <Thumbnail
              sources={[template.screenshotUrl, template.imageUrl]}
              title={template.title}
              seed={template.id}
              sizes="(max-width: 1024px) 100vw, 760px"
              priority
            />
          </div>

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

          <section className="mt-10 rounded-xl border border-line bg-raised p-5">
            <h2 className="text-sm font-semibold">Licence</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {usageExplanation(template.license)}
            </p>
            {template.license.url ? (
              <a
                href={`${template.sourceUrl}#license`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-[13px] text-accent underline-offset-4 hover:underline"
              >
                Read the licence on GitHub
              </a>
            ) : null}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-raised p-5">
            <OpenInKodu template={template} />

            <div className="mt-3 flex gap-2">
              {template.demoUrl ? (
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-[13px] text-muted transition-colors hover:bg-hover hover:text-fg"
                >
                  Live demo
                </a>
              ) : null}
              <a
                href={template.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-[13px] text-muted transition-colors hover:bg-hover hover:text-fg"
              >
                Source
              </a>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <Stat label="Stars" value={template.stars.toLocaleString("en-GB")} />
              <Stat label="Forks" value={(template.repo?.forks ?? 0).toLocaleString("en-GB")} />
              <Stat label="Updated" value={updated} />
              <Stat label="Category" value={template.category} />
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-line pt-5">
              <LicenseBadge template={template} />
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
                By{" "}
                <a
                  href={`https://github.com/${template.repo.owner}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted underline-offset-4 hover:underline"
                >
                  {template.repo.owner}
                </a>
                . Opening it in Kodu copies the repository along with its licence and copyright
                notice.
              </p>
            ) : null}
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-4 text-sm font-semibold text-muted">Similar templates</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
