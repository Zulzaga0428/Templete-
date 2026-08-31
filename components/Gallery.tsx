"use client";

import { useMemo, useState } from "react";
import type { Template } from "@/lib/types";
import { TemplateCard } from "./TemplateCard";

interface Props {
  templates: Template[];
  categories: { name: string; count: number }[];
  frameworks: { name: string; count: number }[];
  /** Seeded from ?q= and ?category= so links from the landing page land pre-filtered. */
  initialQuery?: string;
  initialCategory?: string;
  /** Set on a category page, where the category is the page rather than a filter. */
  hideCategoryFilter?: boolean;
}

const ALL = "All";

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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return templates.filter((t) => {
      if (category !== ALL && t.category !== category) return false;
      if (framework !== ALL && !t.frameworks.includes(framework)) return false;
      if (copyableOnly && t.usage !== "copy") return false;
      if (!needle) return true;

      const haystack = [t.title, t.description, t.category, ...t.frameworks, ...t.tags]
        .join(" ")
        .toLowerCase();
      // Every word must appear somewhere, so "next dashboard" narrows rather
      // than widens the result set.
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [templates, query, category, framework, copyableOnly]);

  const clearable =
    query !== "" || (!hideCategoryFilter && category !== ALL) || framework !== ALL || copyableOnly;

  return (
    <>
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
              placeholder="Search templates — dashboard, saas, astro, stripe…"
              aria-label="Search templates"
              className="w-full rounded-lg border border-line bg-raised py-2.5 pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-line-strong"
            />
          </div>

          {hideCategoryFilter ? null : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Pill active={category === ALL} onClick={() => setCategory(ALL)}>
                All
              </Pill>
              {categories.map((c) => (
                <Pill
                  key={c.name}
                  active={category === c.name}
                  onClick={() => setCategory(c.name)}
                >
                  {c.name}
                  <span className="ml-1.5 opacity-60">{c.count}</span>
                </Pill>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            <label className="flex items-center gap-2 text-muted">
              Stack
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="rounded-md border border-line bg-raised px-2 py-1 text-fg"
              >
                <option value={ALL}>Any</option>
                {frameworks.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.count})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={copyableOnly}
                onChange={(e) => setCopyableOnly(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Only templates I can copy
            </label>

            <span className="ml-auto text-subtle">
              {results.length} of {templates.length}
            </span>

            {clearable ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  if (!hideCategoryFilter) setCategory(ALL);
                  setFramework(ALL);
                  setCopyableOnly(false);
                }}
                className="text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-20 text-center">
          <p className="text-sm text-muted">Nothing matches that yet.</p>
          <p className="mt-1 text-[13px] text-subtle">
            Try a broader search, or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </>
  );
}
