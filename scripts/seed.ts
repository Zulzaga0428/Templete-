/**
 * Writes data/templates.json from a hand-checked list.
 *
 * Every entry here was collected from GitHub search with a `license:mit`
 * qualifier, so the licence is verified by GitHub rather than assumed. It
 * gives the gallery real content without requiring a GITHUB_TOKEN, and it is
 * what CI falls back to if an ingest run fails.
 *
 * `npm run ingest` replaces this file with a much larger, freshly crawled set.
 */
import fs from "node:fs";
import path from "node:path";
import { toTemplate, type RepoLike } from "./transform";
import type { TemplateIndex } from "../lib/types";

interface Seed {
  full_name: string;
  description: string;
  homepage: string | null;
  stars: number;
  forks: number;
  branch: string;
  updated: string;
  topics: string[];
  category: string;
  featured?: boolean;
}

const MIT = { spdx_id: "MIT", name: "MIT License", url: "https://api.github.com/licenses/mit" };

const SEEDS: Seed[] = [
  {
    full_name: "ixartz/Next-js-Boilerplate",
    description:
      "Next.js boilerplate and starter with App Router support, Tailwind CSS 4 and TypeScript. Ships ESLint, Prettier, Drizzle ORM, Vitest, Playwright, Storybook and Sentry out of the box.",
    homepage: "https://nextjs-boilerplate.com",
    stars: 13057,
    forks: 2409,
    branch: "main",
    updated: "2026-08-20T19:51:14Z",
    topics: ["nextjs", "nextjs-template", "react", "tailwindcss", "typescript", "starter-kit"],
    category: "Starter",
    featured: true,
  },
  {
    full_name: "wasp-lang/open-saas",
    description:
      "A free, full-featured SaaS boilerplate with auth, email sending, background jobs, payments (Stripe, Polar), S3 uploads and a landing page. React, Node and Prisma on the Wasp framework.",
    homepage: "https://opensaas.sh",
    stars: 15671,
    forks: 1872,
    branch: "main",
    updated: "2026-08-30T08:20:29Z",
    topics: ["saas-boilerplate", "saas-starter", "react", "prisma", "typescript", "stripe"],
    category: "SaaS",
    featured: true,
  },
  {
    full_name: "arhamkhnz/next-shadcn-admin-dashboard",
    description: "A modern admin dashboard template built with shadcn/ui and Next.js 16.",
    homepage: "https://next-shadcn-admin-dashboard.vercel.app",
    stars: 2952,
    forks: 596,
    branch: "main",
    updated: "2026-08-30T05:52:40Z",
    topics: ["admin-dashboard", "nextjs-template", "shadcn-ui", "nextjs", "typescript"],
    category: "Dashboard",
    featured: true,
  },
  {
    full_name: "steven-tey/precedent",
    description:
      "An opinionated collection of components, hooks and utilities for a Next.js project — auth, Prisma, Radix UI and Framer Motion already wired together.",
    homepage: "https://precedent.dev",
    stars: 5113,
    forks: 493,
    branch: "main",
    updated: "2024-10-02T20:28:59Z",
    topics: ["nextjs", "nextjs-template", "prisma", "radix-ui", "tailwindcss", "typescript"],
    category: "Starter",
  },
  {
    full_name: "TailAdmin/free-nextjs-admin-dashboard",
    description:
      "TailAdmin is a free, open-source Next.js and Tailwind CSS admin dashboard template with the components and pages needed for a full back-office.",
    homepage: "https://nextjs-demo.tailadmin.com",
    stars: 2537,
    forks: 850,
    branch: "main",
    updated: "2026-04-28T10:22:20Z",
    topics: ["admin-dashboard", "dashboard-templates", "nextjs", "tailwindcss", "react"],
    category: "Dashboard",
  },
  {
    full_name: "ixartz/Next-JS-Landing-Page-Starter-Template",
    description:
      "A free Next.js landing page template written in Tailwind CSS and TypeScript, set up for a fast marketing site.",
    homepage: "https://creativedesignsguru.com",
    stars: 2138,
    forks: 722,
    branch: "master",
    updated: "2026-01-18T21:31:34Z",
    topics: ["landing-page", "nextjs", "nextjs-template", "tailwindcss", "typescript"],
    category: "Marketing",
  },
  {
    full_name: "arthelokyo/astrowind",
    description:
      "AstroWind — a free template built on Astro and Tailwind CSS, tuned for marketing sites, blogs and landing pages with near-perfect Lighthouse scores.",
    homepage: "https://astrowind.vercel.app",
    stars: 5922,
    forks: 1665,
    branch: "main",
    updated: "2026-08-30T07:42:50Z",
    topics: ["astro", "astro-template", "tailwindcss", "landing-page", "blog"],
    category: "Marketing",
    featured: true,
  },
  {
    full_name: "mearashadowfax/ScrewFast",
    description:
      "An open-source Astro website template with sleek, customisable Tailwind CSS components — a full marketing site with blog and docs.",
    homepage: "https://screwfast.uk",
    stars: 1406,
    forks: 382,
    branch: "main",
    updated: "2026-08-30T06:45:38Z",
    topics: ["astro", "astro-template", "tailwindcss", "landing-page", "blog"],
    category: "Marketing",
  },
  {
    full_name: "chrismwilliams/astro-theme-cactus",
    description:
      "A simple, fast Astro theme for a personal blog or website, with Tailwind CSS, MDX content collections and a built-in search.",
    homepage: "https://astro-cactus.chriswilliams.dev",
    stars: 1725,
    forks: 276,
    branch: "main",
    updated: "2026-08-28T23:43:05Z",
    topics: ["astro", "astro-template", "blog", "tailwindcss", "static-site"],
    category: "Blog",
  },
  {
    full_name: "manuelernestog/astrofy",
    description:
      "A free personal portfolio template built with Astro and Tailwind CSS, including blog, CV, project section, store and RSS feed.",
    homepage: "https://astrofy-template.netlify.app",
    stars: 1434,
    forks: 463,
    branch: "main",
    updated: "2026-08-28T18:59:33Z",
    topics: ["astro", "astro-template", "portfolio-template", "blog", "tailwindcss"],
    category: "Portfolio",
  },
  {
    full_name: "GreatStackDev/gocart",
    description:
      "GoCart is a free multi-vendor e-commerce template built with Next.js and Tailwind CSS, with a modern responsive storefront and the pages a marketplace needs.",
    homepage: null,
    stars: 947,
    forks: 335,
    branch: "main",
    updated: "2026-08-30T09:27:43Z",
    topics: ["ecommerce-template", "nextjs", "react", "admin-dashboard", "multi-vendor"],
    category: "E-commerce",
    featured: true,
  },
  {
    full_name: "tabler/tabler",
    description:
      "Tabler is a free and open-source dashboard UI kit built on Bootstrap, with a large set of responsive admin components and ready-made pages.",
    homepage: "https://tabler.io",
    stars: 41587,
    forks: 4421,
    branch: "dev",
    updated: "2026-08-30T09:38:31Z",
    topics: ["admin-dashboard", "dashboard-templates", "bootstrap", "ui-kit", "html"],
    category: "Dashboard",
  },
  {
    full_name: "ColorlibHQ/AdminLTE",
    description: "AdminLTE — a free admin dashboard template based on Bootstrap 5.",
    homepage: "https://adminlte.io",
    stars: 45563,
    forks: 18168,
    branch: "master",
    updated: "2026-08-30T00:47:58Z",
    topics: ["admin-dashboard", "admin-template", "bootstrap5", "dashboard-template", "html"],
    category: "Dashboard",
  },
  {
    full_name: "ColorlibHQ/gentelella",
    description:
      "A free admin dashboard template built with vanilla JavaScript, SCSS and Vite — no Bootstrap and no jQuery.",
    homepage: "https://colorlibhq.github.io/gentelella",
    stars: 21503,
    forks: 6828,
    branch: "master",
    updated: "2026-08-30T06:08:24Z",
    topics: ["admin-dashboard", "dashboard-template", "scss", "vite", "vanilla-javascript"],
    category: "Dashboard",
  },
  {
    full_name: "marmelab/react-admin",
    description:
      "A frontend framework for building admin single-page applications on top of REST or GraphQL APIs, using TypeScript, React and Material Design.",
    homepage: "https://marmelab.com/react-admin",
    stars: 26915,
    forks: 5467,
    branch: "master",
    updated: "2026-08-29T17:16:44Z",
    topics: ["admin-dashboard", "react", "typescript", "graphql", "material-ui"],
    category: "Dashboard",
  },
  {
    full_name: "PanJiaChen/vue-element-admin",
    description:
      "A production-ready Vue admin template built on Element UI, with i18n, permissions, rich text editing and a large catalogue of example screens.",
    homepage: "https://panjiachen.github.io/vue-element-admin",
    stars: 90199,
    forks: 30334,
    branch: "master",
    updated: "2026-08-29T18:44:58Z",
    topics: ["admin-dashboard", "admin-template", "vue", "element-ui", "i18n"],
    category: "Dashboard",
  },
  {
    full_name: "akveo/ngx-admin",
    description: "A customisable admin dashboard template based on Angular 10+ and Nebular.",
    homepage: "https://akveo.github.io/ngx-admin",
    stars: 25694,
    forks: 7894,
    branch: "master",
    updated: "2026-08-30T06:07:58Z",
    topics: ["admin-dashboard", "admin-template", "typescript", "bootstrap4", "dashboard"],
    category: "Dashboard",
  },
  {
    full_name: "RyanFitzgerald/devportfolio",
    description:
      "A modern, minimalist portfolio template built with Astro and Tailwind CSS, for showing off skills, experience and projects.",
    homepage: null,
    stars: 4959,
    forks: 4163,
    branch: "master",
    updated: "2026-08-29T17:40:58Z",
    topics: ["portfolio-template", "portfolio-website", "astro", "template"],
    category: "Portfolio",
  },
  {
    full_name: "ashutosh1919/masterPortfolio",
    description:
      "A fully customisable software developer portfolio template that showcases your work and background from a single config file.",
    homepage: "https://ashutoshhathidara.com",
    stars: 4223,
    forks: 1715,
    branch: "master",
    updated: "2026-08-29T22:36:20Z",
    topics: ["portfolio-template", "developer-portfolio", "react", "reactjs-template"],
    category: "Portfolio",
  },
  {
    full_name: "arifszn/gitprofile",
    description:
      "Create and publish a GitHub-synced portfolio by providing nothing more than your GitHub username.",
    homepage: "https://arifszn.github.io/gitprofile",
    stars: 2300,
    forks: 2158,
    branch: "main",
    updated: "2026-08-29T15:25:28Z",
    topics: ["portfolio-template", "developer-portfolio", "react", "github-pages", "typescript"],
    category: "Portfolio",
  },
  {
    full_name: "HugoBlox/hugo-theme-academic-cv",
    description:
      "An academic portfolio and CV theme with BibTeX import, Jupyter and LaTeX support, and a visual block editor. Content stays plain Markdown.",
    homepage: "https://hugoblox.com",
    stars: 5049,
    forks: 6446,
    branch: "main",
    updated: "2026-08-30T02:18:19Z",
    topics: ["portfolio-template", "resume-template", "hugo", "personal-website", "blog-engine"],
    category: "Portfolio",
  },
];

function toRepoLike(seed: Seed): RepoLike {
  const [owner, name] = seed.full_name.split("/");
  return {
    full_name: seed.full_name,
    name,
    owner: { login: owner },
    html_url: `https://github.com/${seed.full_name}`,
    description: seed.description,
    homepage: seed.homepage,
    stargazers_count: seed.stars,
    forks_count: seed.forks,
    default_branch: seed.branch,
    pushed_at: seed.updated,
    updated_at: seed.updated,
    archived: false,
    disabled: false,
    fork: false,
    topics: seed.topics,
    license: MIT,
  };
}

const templates = SEEDS.map((seed) =>
  toTemplate(toRepoLike(seed), { fallbackCategory: seed.category, featured: seed.featured }),
).sort((a, b) => b.stars - a.stars);

const index: TemplateIndex = {
  generatedAt: new Date().toISOString(),
  count: templates.length,
  templates,
};

const out = path.join(process.cwd(), "data", "templates.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(index, null, 2)}\n`);
console.log(`Seeded ${templates.length} templates to data/templates.json`);
