import { Gallery } from "@/components/Gallery";
import { getAllTemplates, getCategories, getFrameworks } from "@/lib/templates";

export default function HomePage() {
  const templates = getAllTemplates();
  const copyable = templates.filter((t) => t.usage === "copy").length;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <section className="py-14 sm:py-20">
        <p className="mb-3 text-[13px] font-medium tracking-wide text-accent">
          {copyable} free templates, ready to edit
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Don&apos;t start from a blank prompt.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          Pick a real, working open-source template, open it in Kodu, and tell the agent what to
          change. Every template here is checked for a licence that lets you use it.
        </p>
      </section>

      <Gallery
        templates={templates}
        categories={getCategories()}
        frameworks={getFrameworks()}
      />

      <div className="h-20" />
    </main>
  );
}
