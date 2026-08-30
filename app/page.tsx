import Link from "next/link";
import { TemplateCard } from "@/components/TemplateCard";
import { getAllTemplates, getCategories, getFrameworks } from "@/lib/templates";

export const metadata = {
  alternates: { canonical: "/" },
};

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

export default function LandingPage() {
  const templates = getAllTemplates();
  const categories = getCategories();
  const frameworks = getFrameworks();
  const copyable = templates.filter((t) => t.usage === "copy").length;

  // Featured first, then whatever has the most stars, to fill the row.
  const showcase = [
    ...templates.filter((t) => t.featured),
    ...templates.filter((t) => !t.featured),
  ].slice(0, 6);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] opacity-[0.18]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1 text-[13px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {copyable} licence-checked templates
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Start from something
            <br />
            that already works.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A blank prompt box is the hardest place to start. Pick a real open-source template,
            open it in Kodu, and tell the agent what to change.
          </p>

          <form action="/templates" method="get" className="mt-9 flex max-w-xl gap-2">
            <input
              type="search"
              name="q"
              placeholder="dashboard, saas, portfolio, astro…"
              aria-label="Search templates"
              className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-4 py-3 text-sm text-fg placeholder:text-subtle focus:border-line-strong"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-subtle">
            <Link href="/templates" className="text-muted underline-offset-4 hover:underline">
              Browse all {templates.length} →
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

      {/* Showcase */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Popular right now"
          title="Templates people actually ship with"
          href="/templates"
          linkLabel="See all"
        >
          Every one of these is open source, actively maintained, and free to copy into your own
          workspace.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-raised/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading eyebrow="How it works" title="Three steps, no setup">
            No cloning, no dependency install, no “works on my machine”. The sandbox does it.
          </SectionHeading>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Step n={1} title="Pick a template">
              Filter by what you are building and what stack you want. Check the live demo before
              you commit to anything.
            </Step>
            <Step n={2} title="Open it in Kodu">
              Kodu clones the repository into a sandbox and starts the dev server. You get a
              running app, not a zip file.
            </Step>
            <Step n={3} title="Tell the agent what to change">
              Describe the change in plain language. The agent edits real code you can read, keep,
              and deploy.
            </Step>
          </ol>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="Browse by category" title="What are you building?" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/templates?category=${encodeURIComponent(category.name)}`}
              className="group flex items-center justify-between rounded-xl border border-line bg-raised px-4 py-4 transition-colors hover:border-line-strong hover:bg-hover"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-[13px] text-subtle transition-colors group-hover:text-muted">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Licensing trust */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Licensing" title="Free means free here">
              Plenty of galleries list whatever they can scrape. We check the licence before a
              template is ever offered for copying.
            </SectionHeading>
            <Link
              href="/about"
              className="text-[15px] text-accent underline-offset-4 hover:underline"
            >
              Read the licensing policy →
            </Link>
          </div>

          <ul className="space-y-4 text-[15px] leading-relaxed text-muted">
            <li className="flex gap-3">
              <span aria-hidden className="mt-1 text-accent">
                ✓
              </span>
              <span>
                <strong className="font-medium text-fg">GitHub verifies the licence</strong>, not
                us. Every search asks for MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unlicense or CC0.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-1 text-accent">
                ✓
              </span>
              <span>
                <strong className="font-medium text-fg">The licence travels with the code.</strong>{" "}
                Copying a template into Kodu keeps the original LICENSE and copyright notice.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-1 text-accent">
                ✓
              </span>
              <span>
                <strong className="font-medium text-fg">No licence means no copy.</strong> A
                repository without one is all-rights-reserved by default, so we link to it instead.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your next project already exists.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Find the closest starting point and change it into what you meant.
          </p>
          <Link
            href="/templates"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
          >
            Browse templates
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
