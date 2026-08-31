import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { getAllTemplates } from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: { canonical: `/${lang}/about` },
  };
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line py-8">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const templates = getAllTemplates();
  const copyable = templates.filter((x) => x.usage === "copy").length;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 sm:px-6">
      <h1 className="pt-14 text-3xl font-semibold tracking-tight">{t.about.title}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        {t.about.lede1}
        <a
          href={process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live"}
          className="text-accent underline-offset-4 hover:underline"
        >
          Kodu
        </a>
        {t.about.lede2}
      </p>

      <Section title={t.about.sourcesTitle}>
        <p>{t.about.sources1}</p>
        <p>{t.about.sources2}</p>
      </Section>

      <Section id="licence" title={t.about.licenceTitle}>
        <p>{t.about.licence1(copyable, templates.length)}</p>
        <p>{t.about.licence2}</p>
        <p>{t.about.licence3}</p>
      </Section>

      <Section title={t.about.openTitle}>
        <p>{t.about.open1}</p>
        <p>{t.about.open2}</p>
      </Section>

      <Section title={t.about.addTitle}>
        <p>{t.about.add1}</p>
      </Section>

      <div className="border-t border-line pt-8">
        <Link
          href={`/${lang}/templates`}
          className="text-[15px] text-accent underline-offset-4 hover:underline"
        >
          {t.about.back}
        </Link>
      </div>
    </main>
  );
}
