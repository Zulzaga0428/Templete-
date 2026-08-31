import type { Locale } from "./i18n";

/**
 * Hand-written copy for the category landing pages, per locale.
 *
 * Category names come from the ingest, so a category with no entry here still
 * gets a page — it just falls back to a generic sentence. Write proper copy
 * when a category earns enough templates to be worth ranking for.
 */
export interface CategoryCopy {
  headline: string;
  intro: string;
  /** Used as the meta description; keep it under ~155 characters. */
  meta: string;
}

const EN: Record<string, CategoryCopy> = {
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

const MN: Record<string, CategoryCopy> = {
  Dashboard: {
    headline: "Админ дашбоардын template-ууд",
    intro:
      "Хэн ч барихыг дурладаггүй хэсгүүд нь бэлэн байгаа back-office интерфейсүүд: хүснэгт, шүүлтүүр, график, цэс, нэвтрэх дэлгэц. Kodu дээр нээгээд өөрийн өгөгдлөө оруул.",
    meta: "Үнэгүй, нээлттэй эхийн админ дашбоардын template-ууд — хүснэгт, график, нэвтрэлт, цэс бэлэн. Kodu дээр нээгээд AI агентаар зас.",
  },
  SaaS: {
    headline: "SaaS эхлэлийн template-ууд",
    intro:
      "Бүртгэл, төлбөр, олон түрээслэгчийн бүтцийг аль хэдийн зохицуулсан full-stack эхлэлүүд — бүтээгдэхүүн болгонд адилхан харагддаг атлаа хэдэн долоо хоног иддэг тэр ажил.",
    meta: "Нэвтрэлт, төлбөр, multi-tenancy бэлэн суусан үнэгүй SaaS boilerplate-ууд. Kodu дээр нээгээд үнэхээр чинийх байх хэсгээс нь эхэл.",
  },
  Marketing: {
    headline: "Landing хуудасны template-ууд",
    intro:
      "Хурд, хөрвүүлэлтэд зориулж хийсэн маркетингийн сайтууд — hero, боломжууд, үнэ, FAQ, холбогдох маягт бүгд загварчлагдсан, дэлгэцэд зохицсон.",
    meta: "Үнэгүй, нээлттэй эхийн landing хуудас болон маркетингийн сайтын template-ууд. Хурдан, дэлгэцэд зохицсон, Kodu дээр prompt-оор засагдана.",
  },
  Portfolio: {
    headline: "Портфолио template-ууд",
    intro:
      "Ажлаа харуулах хувийн сайтууд — төслүүд, бичвэрүүд, намтар, холбоо барих. Ихэнх нь нэг тохиргооны файл засахад чинийх болно.",
    meta: "Хөгжүүлэгч, дизайнеруудад зориулсан үнэгүй портфолио болон хувийн сайтын template-ууд. Kodu дээр нээгээд өөрийнхөө болго.",
  },
  Blog: {
    headline: "Блог, баримт бичгийн template-ууд",
    intro:
      "Markdown буюу MDX нь аль хэдийн холбогдсон контентын сайтууд, дээр нь мартагддаг зүйлс: RSS, шошго, хайлт, унших хугацаа.",
    meta: "Markdown, RSS, хайлт бэлэн суусан үнэгүй блог болон баримт бичгийн template-ууд. Kodu дээр нээгээд нийтэлж эхэл.",
  },
  "E-commerce": {
    headline: "Цахим худалдааны template-ууд",
    intro:
      "Бүтээгдэхүүний жагсаалт, сагс, төлбөрийн урсгал нь байрандаа орсон дэлгүүрүүд — дэлгүүрийн бүтэц бэлэн, чи зөвхөн барааныхаа мэдээллийг нэмнэ.",
    meta: "Бүтээгдэхүүний хуудас, сагс, төлбөртэй үнэгүй цахим худалдааны template-ууд. Kodu дээр нээгээд бараагаа нэм.",
  },
  "UI kit": {
    headline: "UI кит, компонентын сангууд",
    intro:
      "Дуусгасан апп биш, дээр нь барих компонентын цуглуулга, дизайн системүүд. Бэлэн төлөвлөгөө биш, эд ангиуд хэрэгтэй үед тохиромжтой.",
    meta: "Үнэгүй, нээлттэй эхийн UI кит, компонентын сан, дизайн системүүд. Kodu дээр нээгээд ажилладаг эд ангиудаас интерфейсээ бүтээ.",
  },
  Starter: {
    headline: "Төслийн эхлэлүүд",
    intro:
      "Санаа нь тодорхой хоосон суурь — lint, тест, форматлалт, CI тохируулагдсан. Ингэснээр эхний commit чинь тохиргоо биш, боломж болно.",
    meta: "Хэрэгсэл, тест, CI нь бэлэн тохируулагдсан үнэгүй төслийн эхлэл, boilerplate-ууд. Kodu дээр нээгээд шууд барьж эхэл.",
  },
  AI: {
    headline: "AI аппын template-ууд",
    intro:
      "Чат интерфейс, RAG урсгал, агентын суурь — streaming болон мессежийн төлөвийг дахин бичихгүйгээр AI бүтээгдэхүүний бүтцийг шууд авна.",
    meta: "Үнэгүй AI аппын template-ууд — чат интерфейс, RAG урсгал, агентын суурь. Kodu дээр нээгээд өөрийн загвар руугаа чиглүүл.",
  },
};

const BY_LOCALE: Record<Locale, Record<string, CategoryCopy>> = { en: EN, mn: MN };

export function categoryCopy(category: string, count: number, locale: Locale): CategoryCopy {
  const known = BY_LOCALE[locale][category];
  if (known) return known;

  const lower = category.toLowerCase();
  return locale === "mn"
    ? {
        headline: `${category} template-ууд`,
        intro: `Ашиглахыг чинь зөвшөөрдөг лицензтэй эсэхийг нь шалгасан ${count} нээлттэй эхийн ${lower} template.`,
        meta: `Лицензээр шалгасан, Kodu дээр шууд нээгддэг үнэгүй ${lower} template-ууд.`,
      }
    : {
        headline: `${category} templates`,
        intro: `${count} open-source ${lower} templates, each checked for a licence that lets you use it.`,
        meta: `Free open-source ${lower} templates, licence-checked and ready to open in Kodu.`,
      };
}

/**
 * Display names. Category keys come from the ingest and stay in English —
 * they are data, and slugs are built from them — so only the label shown to
 * the reader is translated.
 */
const NAMES: Record<Locale, Record<string, string>> = {
  en: {},
  mn: {
    Dashboard: "Дашбоард",
    SaaS: "SaaS",
    Marketing: "Маркетинг",
    Portfolio: "Портфолио",
    Blog: "Блог",
    "E-commerce": "Цахим худалдаа",
    "UI kit": "UI кит",
    Starter: "Эхлэл",
    AI: "AI",
  },
};

export function categoryName(category: string, locale: Locale): string {
  return NAMES[locale][category] ?? category;
}
