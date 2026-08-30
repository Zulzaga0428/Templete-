import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { getAllTemplates, getCategories, getFrameworks } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Browse templates",
  description:
    "Search free, open-source web templates by category and stack. Every template is licence-checked and opens straight into Kodu.",
  alternates: { canonical: "/templates" },
};

export default async function TemplatesPage({ searchParams }: PageProps<"/templates">) {
  const { q, category } = await searchParams;
  const templates = getAllTemplates();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <header className="py-10 sm:py-14">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Browse templates</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
          {templates.length} open-source templates, each checked for a licence that lets you use
          it.
        </p>
      </header>

      <Gallery
        templates={templates}
        categories={getCategories()}
        frameworks={getFrameworks()}
        initialQuery={typeof q === "string" ? q : ""}
        initialCategory={typeof category === "string" ? category : undefined}
      />

      <div className="h-20" />
    </main>
  );
}
