import type { Metadata } from "next";
import Link from "next/link";
import { getAllTemplates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Templete collects open-source templates, how licences are checked, and how a template gets opened in Kodu.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const templates = getAllTemplates();
  const copyable = templates.filter((t) => t.usage === "copy").length;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 sm:px-6">
      <h1 className="pt-14 text-3xl font-semibold tracking-tight">How Templete works</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Templete is a gallery of free, open-source web templates that you can open directly in{" "}
        <a
          href={process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live"}
          className="text-accent underline-offset-4 hover:underline"
        >
          Kodu
        </a>{" "}
        and edit with an AI agent.
      </p>

      <Section title="Where the templates come from">
        <p>
          An ingest job searches GitHub for repositories that tag themselves as templates or
          starters, then keeps the ones that are public, actively maintained, not archived, and
          carry a description. Awesome-lists, tutorials and course material are filtered out —
          they are not things you can open and edit as an app.
        </p>
        <p>
          The job re-runs from scratch, so a repository that is deleted, archived, or has its
          licence changed drops out of the gallery on the next run.
        </p>
      </Section>

      <Section title="How licences are handled">
        <p>
          Every search asks GitHub for a specific set of permissive licences — MIT, Apache-2.0,
          BSD, ISC, MPL-2.0, Unlicense and CC0 — so the licence is verified by GitHub rather than
          guessed from a README. {copyable} of the {templates.length} templates listed here fall
          into that group and can be copied into your workspace, with the original{" "}
          <code className="rounded bg-hover px-1 py-0.5 font-mono text-[13px]">LICENSE</code> file
          and copyright notice kept intact.
        </p>
        <p>
          Anything without a permissive licence is never copied. A repository that ships no licence
          at all is, by default, all-rights-reserved — for those we link to the source instead.
        </p>
        <p>
          If you are the author of a template listed here and would rather it were removed, get in
          touch and it comes down.
        </p>
      </Section>

      <Section title="What happens when you open one">
        <p>
          The Open in Kodu button posts the template to Kodu, which clones the repository into a
          fresh sandbox and starts the dev server. From there it is an ordinary Kodu project — you
          describe what you want changed and the agent edits the code.
        </p>
        <p>
          You are starting from a codebase that already runs, so the first change is a change
          rather than a guess.
        </p>
      </Section>

      <Section title="Adding a template">
        <p>
          Templates are generated into a data file in this project&apos;s repository. To add one by
          hand, add an entry to{" "}
          <code className="rounded bg-hover px-1 py-0.5 font-mono text-[13px]">
            data/curated.json
          </code>{" "}
          — curated entries override the ingested ones and can be pinned to the top of the gallery.
        </p>
      </Section>

      <div className="border-t border-line pt-8">
        <Link href="/templates" className="text-[15px] text-accent underline-offset-4 hover:underline">
          ← Back to the gallery
        </Link>
      </div>
    </main>
  );
}
