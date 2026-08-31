"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_LABELS, LOCALES, localizePath, type Locale } from "@/lib/i18n";

/**
 * Keeps the reader on the same page when they switch language, rather than
 * dropping them on the home page — the usual and infuriating default.
 */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;

  return (
    <div className="flex items-center rounded-md border border-line p-0.5" aria-label={label}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={localizePath(pathname, locale)}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          className={[
            "rounded px-2 py-1 text-[12px] transition-colors",
            locale === current ? "bg-hover text-fg" : "text-subtle hover:text-fg",
          ].join(" ")}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
