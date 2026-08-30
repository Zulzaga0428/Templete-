/**
 * Where we look for templates.
 *
 * Each query is a GitHub search expression. We lean on `topic:` because repos
 * that bother to tag themselves are far more likely to be real, maintained
 * starters than whatever a keyword search dredges up.
 */
export interface GithubQuery {
  /** GitHub search qualifier string. */
  q: string;
  /** Category applied to everything this query returns, unless topics say otherwise. */
  category: string;
}

export const GITHUB_QUERIES: GithubQuery[] = [
  { q: "topic:nextjs-template", category: "Starter" },
  { q: "topic:nextjs-starter", category: "Starter" },
  { q: "topic:react-template", category: "Starter" },
  { q: "topic:vite-template", category: "Starter" },
  { q: "topic:astro-template", category: "Marketing" },
  { q: "topic:tailwind-template", category: "Marketing" },
  { q: "topic:saas-starter", category: "SaaS" },
  { q: "topic:saas-boilerplate", category: "SaaS" },
  { q: "topic:admin-dashboard topic:react", category: "Dashboard" },
  { q: "topic:portfolio-template", category: "Portfolio" },
  { q: "topic:ecommerce-template", category: "E-commerce" },
  { q: "topic:landing-page-template", category: "Marketing" },
  { q: "topic:blog-template", category: "Blog" },
  { q: "topic:shadcn-ui topic:template", category: "UI kit" },
];

/** Topics that reliably identify the stack, mapped to the label we display. */
export const FRAMEWORK_TOPICS: Record<string, string> = {
  nextjs: "Next.js",
  "next-js": "Next.js",
  next: "Next.js",
  react: "React",
  vue: "Vue",
  nuxt: "Nuxt",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  astro: "Astro",
  remix: "Remix",
  vite: "Vite",
  tailwind: "Tailwind",
  tailwindcss: "Tailwind",
  typescript: "TypeScript",
  "shadcn-ui": "shadcn/ui",
  shadcn: "shadcn/ui",
  supabase: "Supabase",
  prisma: "Prisma",
  stripe: "Stripe",
  trpc: "tRPC",
};

/** Category keywords checked against topics, name and description, in order. */
export const CATEGORY_RULES: { category: string; match: RegExp }[] = [
  { category: "SaaS", match: /\b(saas|boilerplate|starter-kit)\b/i },
  { category: "Dashboard", match: /\b(dashboard|admin|analytics)\b/i },
  { category: "E-commerce", match: /\b(ecommerce|e-commerce|shop|store|commerce)\b/i },
  { category: "Portfolio", match: /\b(portfolio|resume|cv|personal-site)\b/i },
  { category: "Blog", match: /\b(blog|docs|documentation|mdx)\b/i },
  { category: "Marketing", match: /\b(landing|marketing|agency|startup-page)\b/i },
  { category: "UI kit", match: /\b(ui-kit|components|design-system|shadcn)\b/i },
  { category: "AI", match: /\b(ai|chatbot|llm|openai|rag)\b/i },
];

/**
 * Repos we never want in the gallery: awesome-lists, tutorials, and course
 * material are not things you can open and edit as an app.
 */
export const REJECT_PATTERNS: RegExp[] = [
  /^awesome[-_]/i,
  /\b(tutorial|course|learning|exercise|interview|cheatsheet|roadmap)\b/i,
  /\b(clone|example|examples|demo-only|playground)\b/i,
];

/**
 * GitHub `license:` keys we are willing to copy. Kept in sync with
 * PERMISSIVE_SPDX in lib/licenses.ts — searching by licence means GitHub
 * verifies the licence for us instead of us trusting a repo's README.
 */
export const COPYABLE_LICENSE_QUALIFIERS = [
  "mit",
  "apache-2.0",
  "bsd-2-clause",
  "bsd-3-clause",
  "isc",
  "unlicense",
  "0bsd",
  "cc0-1.0",
  "mpl-2.0",
];
