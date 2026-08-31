import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DEFAULT_LOCALE, getDictionary, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://templete.kodu.live";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

  const titles: Record<Locale, string> = {
    en: "Templete — free templates you can open in Kodu",
    mn: "Templete — Kodu дээр нээж болох үнэгүй template-ууд",
  };
  const descriptions: Record<Locale, string> = {
    en: "A curated gallery of free, open-source web templates. Pick one, open it in Kodu, and start editing with an AI agent instead of a blank prompt box.",
    mn: "Үнэгүй, нээлттэй эхийн вэб template-уудын галерей. Нэгийг нь сонгоод Kodu дээр нээж, хоосон prompt хайрцгийн оронд AI агентаар засаж эхэл.",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: titles[locale], template: "%s — Templete" },
    description: descriptions[locale],
    // Tell search engines the two versions are the same page in two languages,
    // rather than duplicates competing with each other.
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        mn: `${SITE_URL}/mn`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: { type: "website", siteName: "Templete", locale, url: `${SITE_URL}/${locale}` },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);

  return (
    <html lang={lang} className="h-full">
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-contrast"
              >
                T
              </span>
              Templete
            </Link>
            <nav className="ml-auto flex items-center gap-1 text-sm">
              <Link
                href={`/${lang}/templates`}
                className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-hover hover:text-fg"
              >
                {t.nav.templates}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="hidden rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-hover hover:text-fg sm:block"
              >
                {t.nav.howItWorks}
              </Link>
              <LanguageSwitcher current={lang} label={t.nav.switchLanguage} />
              <a
                href={process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live"}
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-contrast transition-opacity hover:opacity-90"
              >
                {t.nav.openKodu}
              </a>
            </nav>
          </div>
        </header>

        {children}

        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
