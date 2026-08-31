import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/**
 * The logo lockup, shared by the header and the footer so the two can never
 * drift apart.
 *
 * Uses the 96px copy rather than the full-size logo: at 24px on screen the
 * optimiser has nothing useful to do with a 1426px source.
 */
export function Wordmark({ lang, size = 24 }: { lang: Locale; size?: number }) {
  return (
    <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold tracking-tight">
      <Image
        src="/logo-96.png"
        alt=""
        width={size}
        height={size}
        priority
        className="rounded-[6px]"
      />
      Templete
    </Link>
  );
}
