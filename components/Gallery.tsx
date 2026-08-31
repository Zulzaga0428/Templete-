"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import type { LicenceStrings } from "@/lib/licenses";
import type { Template } from "@/lib/types";
import { TemplateCard } from "./TemplateCard";

interface Props {
  templates: Template[];
  categories: { name: string; label: string; count: number }[];
  frameworks: { name: string; count: number }[];
  lang: Locale;
  t: Dictionary["gallery"];
  licenceT: LicenceStrings;
  /** Seeded from ?q= and ?category= so links from the landing page land pre-filtered. */
  initialQuery?: string;
  initialCategory?: string;
  /** Set on a category page, where the category is the page rather than a filter. */
  hideCategoryFilter?: boolean;
}

const ALL = "All";

/**
 * How many cards are rendered before the reader asks for more. A full ingest
 * run puts several hundred templates on this page; rendering them all costs a
 * large prerendered document and thousands of DOM nodes for rows nobody
 * scrolls to.
 */
const PAGE_SIZE = 24;

/** Height of the fixed site header, so scroll targets clear it. */
const HEADER_HEIGHT = 56;

const SORTS = {
  featured: null,
  stars: (a: Template, b: Template) => b.stars - a.stars,
  updated: (a: Template, b: Template) => b.updatedAt.localeCompare(a.updatedAt),
  name: (a: Template, b: Template) => a.title.localeCompare(b.title),
} as const;

type SortKey = keyof typeof SORTS;

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
        active
          ? "border-accent bg-accent text-accent-contrast"
          : "border-line bg-raised text-muted hover:border-line-strong hover:text-fg",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function Gallery({
  templates,
  categories,
  frameworks,
  lang,
  t,
  licenceT,
  initialQuery = "",
  initialCategory,
  hideCategoryFilter = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    initialCategory && categories.some((c) => c.name === initialCategory) ? initialCategory : ALL,
  );
  const [framework, setFramework] = useState(ALL);
  const [copyableOnly, setCopyableOnly] = useState(false);
  const [mongolianOnly, setMongolianOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // The filter is pointless until Kodu has published localised versions, so
  // it stays hidden until at least one exists.
  const mongolianCount = useMemo(
    () => templates.filter((x) => x.contentLanguage === "mn").length,
    [templates],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = templates.filter((x) => {
      if (category !== ALL && x.category !== category) return false;
      if (framework !== ALL && !x.frameworks.includes(framework)) return false;
      if (copyableOnly && x.usage !== "copy") return false;
      if (mongolianOnly && x.contentLanguage !== "mn") return false;
      if (!needle) return true;

      const haystack = [x.title, x.description, x.category, ...x.frameworks, ...x.tags]
        .join(" ")
        .toLowerCase();
      // Every word must appear somewhere, so "next dashboard" narrows rather
      // than widens the result set.
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    });

    const compare = SORTS[sort];
    // "Featured" is the order the server sent, so leave it alone.
    return compare ? [...filtered].sort(compare) : filtered;
  }, [templates, query, category, framework, copyableOnly, mongolianOnly, sort]);

  // Any change to what is being shown starts the list over from the top.
  // Adjusted during render rather than in an effect, so the first paint after
  // a filter change already shows the right number of cards.
  const signature = `${query}|${category}|${framework}|${copyableOnly}|${mongolianOnly}|${sort}`;
  const [lastSignature, setLastSignature] = useState(signature);
  if (signature !== lastSignature) {
    setLastSignature(signature);
    setVisible(PAGE_SIZE);
  }

  // Filtering while scrolled deep into the list leaves the reader stranded at
  // the bottom of a set of results they have not seen the start of. Pull the
  // toolbar back into view when that happens, and only then.
  const top = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const node = top.current;
    if (!node) return;
    const offset = node.getBoundingClientRect().top - HEADER_HEIGHT;
    if (offset < 0) window.scrollTo({ top: window.scrollY + offset, behavior: "smooth" });
  }, [signature]);

  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = visible < results.length;

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible((v) => v + PAGE_SIZE);
      },
      // Start loading a screen early so the grid rarely appears to stop.
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, results.length]);

  const clearable =
    query !== "" ||
    (!hideCategoryFilter && category !== ALL) ||
    framework !== ALL ||
    copyableOnly ||
    mongolianOnly;

  return (
    <div ref={top}>
      <div className="sticky top-14 z-20 -mx-4 mb-8 border-b border-line bg-bg/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            >
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              className="w-full rounded-lg border border-line bg-raised py-2.5 pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-line-strong"
            />
          </div>

          {hideCategoryFilter ? null : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Pill active={category === ALL} onClick={() => setCategory(ALL)}>
                {t.all}
              </Pill>
              {categories.map((c) => (
                <Pill
                  key={c.name}
                  active={category === c.name}
                  onClick={() => setCategory(c.name)}
                >
                  {c.label}
                  <span className="ml-1.5 opacity-60">{c.count}</span>
                </Pill>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
            <label className="flex items-center gap-2 text-muted">
              {t.stack}
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="rounded-md border border-line bg-raised px-2 py-1 text-fg"
              >
                <option value={ALL}>{t.anyStack}</option>
                {frameworks.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.count})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-muted">
              {t.sort}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-line bg-raised px-2 py-1 text-fg"
              >
                <option value="featured">{t.sortFeatured}</option>
                <option value="stars">{t.sortStars}</option>
                <option value="updated">{t.sortUpdated}</option>
                <option value="name">{t.sortName}</option>
              </select>
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={copyableOnly}
                onChange={(e) => setCopyableOnly(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              {t.copyableOnly}
            </label>

            {mongolianCount > 0 ? (
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={mongolianOnly}
                  onChange={(e) => setMongolianOnly(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {t.mongolianOnly}
                <span className="text-subtle">{mongolianCount}</span>
              </label>
            ) : null}

            <span className="ml-auto text-subtle">
              {format(t.resultCount, { shown: results.length, total: templates.length })}
            </span>

            {clearable ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  if (!hideCategoryFilter) setCategory(ALL);
                  setFramework(ALL);
                  setCopyableOnly(false);
                  setMongolianOnly(false);
                }}
                className="text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                {t.clear}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-20 text-center">
          <p className="text-sm text-muted">{t.emptyTitle}</p>
          <p className="mt-1 text-[13px] text-subtle">{t.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                lang={lang}
                t={licenceT}
                mongolianLabel={t.mongolianBadge}
              />
            ))}
          </div>

          {hasMore ? (
            <>
              <div ref={sentinel} aria-hidden className="h-px" />
              {/* Also a real button: the observer needs JS, and a reader who
                  jumps to the end with keyboard or screen reader never
                  triggers it. */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-lg border border-line bg-raised px-5 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  {format(t.showMore, { count: Math.min(PAGE_SIZE, results.length - visible) })}
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
