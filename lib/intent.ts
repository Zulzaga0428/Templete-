import type { Template } from "./types";

/**
 * Matches a plain-language description of a project against the gallery.
 *
 * The gallery's own search requires every word to appear, which is right for
 * "admin dashboard" and useless for "Би ресторанд ширээ захиалдаг сайт хийе".
 * This scores instead: each word that lands somewhere useful adds to a total,
 * and the best few come back. Nothing matching is a valid answer.
 *
 * Deliberately no model call. It runs in the browser on 200 templates in under
 * a millisecond, costs nothing, and cannot be down. When it stops being good
 * enough, the place to add embeddings is `score`.
 */

/** Words that carry no signal about what someone is building. */
const STOPWORDS = new Set([
  // English
  "a", "an", "the", "i", "we", "my", "our", "want", "need", "make", "build",
  "create", "for", "to", "with", "and", "or", "that", "this", "is", "are",
  "be", "it", "of", "on", "in", "app", "application", "site", "website",
  "page", "project", "would", "like", "please", "help", "me", "us", "can",
  // Mongolian
  "би", "бид", "манай", "миний", "бидний", "нэг", "гэсэн", "гэж", "юм",
  "байна", "байгаа", "хэрэгтэй", "хүсэж", "хийе", "хийх", "хиймээр", "болох",
  "болно", "сайт", "вэб", "апп", "хуудас", "төсөл", "дээр", "нь", "бол",
  "тэр", "энэ", "минь", "чинь", "аа", "ээ", "юу", "яаж",
]);

/**
 * Mongolian and loose English words mapped to the vocabulary the templates
 * actually use. This is the part that makes the box work for someone typing
 * in Mongolian, which no other template gallery does.
 */
const CONCEPTS: Record<string, string[]> = {
  // Commerce
  дэлгүүр: ["ecommerce", "shop", "store", "storefront", "commerce"],
  худалдаа: ["ecommerce", "commerce", "shop"],
  бараа: ["ecommerce", "product", "shop"],
  захиалга: ["booking", "appointment", "reservation", "order"],
  төлбөр: ["payments", "stripe", "billing", "checkout"],
  сагс: ["cart", "ecommerce", "checkout"],
  // Back office
  самбар: ["dashboard", "admin", "analytics"],
  удирдлага: ["admin", "dashboard", "management"],
  админ: ["admin", "dashboard"],
  тайлан: ["analytics", "dashboard", "reporting", "charts"],
  статистик: ["analytics", "charts", "dashboard"],
  хүснэгт: ["table", "dashboard", "data"],
  // Content
  блог: ["blog", "mdx", "markdown", "content"],
  нийтлэл: ["blog", "article", "content"],
  мэдээ: ["blog", "news", "content"],
  баримт: ["docs", "documentation", "mdx"],
  сургалт: ["course", "docs", "education"],
  // Personal
  портфолио: ["portfolio", "personal"],
  намтар: ["resume", "cv", "portfolio"],
  танилцуулга: ["landing", "marketing", "company", "corporate"],
  // Marketing
  ланд: ["landing", "marketing"],
  зар: ["landing", "marketing"],
  сурталчилгаа: ["landing", "marketing"],
  үнэ: ["pricing", "landing", "saas"],
  // SaaS
  бүртгэл: ["auth", "authentication", "signup", "saas"],
  нэвтрэх: ["auth", "authentication", "login"],
  хэрэглэгч: ["auth", "users", "saas"],
  захиалагч: ["subscription", "saas", "billing"],
  // AI
  чат: ["chat", "chatbot", "ai"],
  ярилцах: ["chat", "chatbot", "ai"],
  // Domain nouns that imply a shape
  ресторан: ["restaurant", "booking", "landing", "menu"],
  кафе: ["restaurant", "landing", "menu"],
  зочид: ["hotel", "booking", "landing"],
  эмнэлэг: ["clinic", "appointment", "booking", "medical"],
  эмч: ["doctor", "appointment", "booking"],
  сургууль: ["school", "education", "landing"],
  компани: ["company", "corporate", "landing", "agency"],
  агентлаг: ["agency", "landing", "marketing"],
  // English shorthand people actually type
  shop: ["ecommerce", "storefront"],
  store: ["ecommerce", "storefront"],
  booking: ["booking", "appointment", "reservation"],
  crm: ["dashboard", "admin", "saas"],
  blog: ["blog", "mdx", "content"],
  landing: ["landing", "marketing"],
  portfolio: ["portfolio", "personal"],
};

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/**
 * True when a typed word is a case-inflected form of a concept.
 *
 * Mongolian both suffixes and drops vowels: дэлгүүр → дэлгүүрийн, and
 * эмнэлэг → эмнэлгийн, where the stem itself changes. A plain prefix test
 * catches the first and misses the second, so this compares how much of the
 * concept survives instead — most of it, with a floor of four characters so
 * short words cannot match each other by accident.
 */
function isInflectionOf(word: string, concept: string): boolean {
  if (word === concept) return true;
  if (word.length < 4 || concept.length < 4) return false;
  return commonPrefixLength(word, concept) >= Math.max(4, concept.length - 2);
}

/** Expands a query into the words worth matching on. */
export function expandQuery(query: string): string[] {
  const words = normalize(query);
  const expanded = new Set(words);

  for (const word of words) {
    for (const [concept, targets] of Object.entries(CONCEPTS)) {
      if (isInflectionOf(word, concept)) {
        for (const target of targets) expanded.add(target);
      }
    }
  }
  return [...expanded];
}

/** Weighted so a match in the title counts for more than one in a tag. */
function score(template: Template, words: string[]): number {
  const title = template.title.toLowerCase();
  const description = template.description.toLowerCase();
  const category = template.category.toLowerCase();
  const tags = template.tags.join(" ").toLowerCase();
  const frameworks = template.frameworks.join(" ").toLowerCase();

  let total = 0;
  for (const word of words) {
    if (title.includes(word)) total += 5;
    if (category.includes(word)) total += 4;
    if (tags.includes(word)) total += 3;
    if (description.includes(word)) total += 2;
    if (frameworks.includes(word)) total += 2;
  }

  // A nudge, not a ranking: among templates that fit equally well, the one
  // more people rely on is the safer place to start.
  if (total > 0) total += Math.min(Math.log10(template.stars + 1), 3);
  return total;
}

export interface IntentMatch {
  template: Template;
  score: number;
}

export function matchIntent(templates: Template[], query: string, limit = 24): IntentMatch[] {
  const words = expandQuery(query);
  if (words.length === 0) return [];

  return templates
    .map((template) => ({ template, score: score(template, words) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
