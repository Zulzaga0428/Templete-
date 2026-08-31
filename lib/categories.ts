/**
 * Hand-written copy for the category landing pages.
 *
 * Category names come from the ingest, so anything without an entry here still
 * gets a page — it just falls back to a generic sentence. Write one when a
 * category earns enough templates to be worth ranking for.
 */
interface CategoryCopy {
  headline: string;
  intro: string;
  /** Used as the meta description; keep it under ~155 characters. */
  meta: string;
}

const COPY: Record<string, CategoryCopy> = {
  Dashboard: {
    headline: "Admin dashboard templates",
    intro:
      "Back-office UIs with the parts nobody enjoys building: tables, filters, charts, navigation and auth screens. Open one in Kodu and swap in your own data.",
    meta: "Free open-source admin dashboard templates — tables, charts, auth and navigation already built. Open any of them in Kodu and edit with an AI agent.",
  },
  SaaS: {
    headline: "SaaS starter templates",
    intro:
      "Full-stack starters that already handle sign-up, billing and multi-tenancy — the plumbing that takes weeks and looks the same in every product.",
    meta: "Free open-source SaaS boilerplates with auth, billing and multi-tenancy built in. Open one in Kodu and start on the part that is actually yours.",
  },
  Marketing: {
    headline: "Landing page templates",
    intro:
      "Marketing sites built for speed and conversion — hero, features, pricing, FAQ and a contact form, styled and responsive out of the box.",
    meta: "Free open-source landing page and marketing site templates. Fast, responsive, and editable in Kodu with a prompt instead of a design tool.",
  },
  Portfolio: {
    headline: "Portfolio templates",
    intro:
      "Personal sites for showing work — projects, writing, CV and contact. Most are a config file away from being yours.",
    meta: "Free open-source portfolio and personal website templates for developers and designers. Open one in Kodu and make it yours.",
  },
  Blog: {
    headline: "Blog and docs templates",
    intro:
      "Content sites with Markdown or MDX already wired up, plus the things that get forgotten: RSS, tags, search and reading time.",
    meta: "Free open-source blog and documentation templates with Markdown, RSS and search built in. Open one in Kodu and publish.",
  },
  "E-commerce": {
    headline: "E-commerce templates",
    intro:
      "Storefronts with product listings, cart and checkout flow in place — the structure of a shop, ready for your catalogue.",
    meta: "Free open-source e-commerce and storefront templates with product pages, cart and checkout. Open one in Kodu and add your catalogue.",
  },
  "UI kit": {
    headline: "UI kits and component libraries",
    intro:
      "Component collections and design systems to build on, rather than finished apps. Useful when you want the pieces, not the plan.",
    meta: "Free open-source UI kits, component libraries and design systems. Open one in Kodu and build your interface from parts that already work.",
  },
  Starter: {
    headline: "Project starters",
    intro:
      "Opinionated blank slates — linting, testing, formatting and CI configured, so the first commit is a feature rather than a setup.",
    meta: "Free open-source project starters and boilerplates with tooling, testing and CI already configured. Open one in Kodu and start building.",
  },
  AI: {
    headline: "AI app templates",
    intro:
      "Chat interfaces, RAG pipelines and agent scaffolding — the shape of an AI product, without rebuilding streaming and message state again.",
    meta: "Free open-source AI app templates — chat UIs, RAG pipelines and agent scaffolding. Open one in Kodu and point it at your model.",
  },
};

export function categoryCopy(category: string, count: number): CategoryCopy {
  return (
    COPY[category] ?? {
      headline: `${category} templates`,
      intro: `${count} open-source ${category.toLowerCase()} templates, each checked for a licence that lets you use it.`,
      meta: `Free open-source ${category.toLowerCase()} templates, licence-checked and ready to open in Kodu.`,
    }
  );
}
