import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://templete.kodu.live";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Templete — free templates you can open in Kodu",
    template: "%s — Templete",
  },
  description:
    "A curated gallery of free, open-source web templates. Pick one, open it in Kodu, and start editing with an AI agent instead of a blank prompt box.",
  openGraph: {
    type: "website",
    siteName: "Templete",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
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
            href="/about"
            className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-hover hover:text-fg"
          >
            How it works
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live"}
            className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            Open Kodu
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:px-6">
        <p>
          Templates are the work of their original authors and stay under their own licences.
        </p>
        <Link href="/about" className="text-muted underline-offset-4 hover:underline sm:ml-auto">
          Licensing policy
        </Link>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
