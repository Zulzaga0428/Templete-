import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { categoryName } from "@/lib/categories";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { categorySlug, getAllTemplates, getCategories } from "@/lib/templates";

const KODU_URL = process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live";
const VEIO_URL = "https://veio.digital/";
/** Set to show a source link; omitted rather than pointing at a repo that may not be public. */
const SOURCE_URL = process.env.NEXT_PUBLIC_SOURCE_URL;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
        {title}
      </h2>
      <ul className="space-y-2.5 text-[13px]">{children}</ul>
    </div>
  );
}

function Item({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className = "text-muted transition-colors hover:text-fg";
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    </li>
  );
}

export function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  const templates = getAllTemplates();
  const copyable = templates.filter((x) => x.usage === "copy").length;
  // The four biggest categories; the rest live on the gallery page.
  const categories = getCategories().slice(0, 4);

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold tracking-tight">
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-contrast"
              >
                T
              </span>
              Templete
            </Link>

            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
              {t.footer.tagline}
            </p>

            <p className="mt-4 flex items-center gap-2 text-[12px] text-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t.landing.badge(copyable)}
            </p>

            <a
              href={KODU_URL}
              className="mt-4 inline-block text-[12px] text-subtle underline-offset-4 transition-colors hover:text-muted hover:underline"
            >
              {t.footer.aKoduProject}
            </a>
          </div>

          <Column title={t.footer.colTemplates}>
            <Item href={`/${lang}/templates`}>{t.footer.browseAll}</Item>
            {categories.map((category) => (
              <Item key={category.name} href={`/${lang}/templates/${categorySlug(category.name)}`}>
                {categoryName(category.name, lang)}
              </Item>
            ))}
          </Column>

          <Column title={t.footer.colLearn}>
            <Item href={`/${lang}/about`}>{t.nav.howItWorks}</Item>
            <Item href={`/${lang}/about#licence`}>{t.footer.policy}</Item>
          </Column>

          <Column title={t.footer.colMore}>
            <Item href={KODU_URL} external>
              {t.nav.openKodu}
            </Item>
            <Item href="/api/templates" external>
              {t.footer.api}
            </Item>
            {SOURCE_URL ? (
              <Item href={SOURCE_URL} external>
                {t.footer.source}
              </Item>
            ) : null}
          </Column>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[12px] text-subtle sm:flex-row sm:items-center">
          <p>{format(t.footer.copyright, { year: new Date().getFullYear() })}</p>

          <div className="flex items-center gap-4 sm:ml-auto">
            <LanguageSwitcher current={lang} label={t.nav.switchLanguage} />
            <a
              href={VEIO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-fg"
            >
              {t.footer.builtBy}
              <span aria-hidden className="ml-0.5 text-accent">
                •
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
