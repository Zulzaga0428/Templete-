"use client";

import { useSearchParams } from "next/navigation";
import type { Template } from "@/lib/types";

/**
 * A form rather than a link, so the handoff runs server-side in
 * /api/kodu/open and can talk to the Kodu API when it is configured.
 * It works with JavaScript disabled, which also means it works while the page
 * is still hydrating.
 *
 * The visitor's description is read here from `?intent=` rather than on the
 * server. Reading it in the page would opt every template page out of static
 * rendering — 200-odd pages re-rendered per request to personalise one hidden
 * field and one sentence.
 */
export function OpenInKodu({
  template,
  labels,
  className = "",
}: {
  template: Template;
  labels: { openInKodu: string; viewOnGitHub: string; withIntent: string };
  className?: string;
}) {
  const params = useSearchParams();
  const intent = params?.get("intent")?.trim().slice(0, 500) ?? "";

  if (template.usage !== "copy") {
    return (
      <a
        href={template.sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-raised px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-hover ${className}`}
      >
        {labels.viewOnGitHub}
      </a>
    );
  }

  return (
    <>
      <form action="/api/kodu/open" method="post" className={className}>
        <input type="hidden" name="slug" value={template.slug} />
        {intent ? <input type="hidden" name="prompt" value={intent} /> : null}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
        >
          {labels.openInKodu}
          <span aria-hidden>→</span>
        </button>
      </form>

      {intent ? (
        <p className="mt-3 rounded-lg border border-accent/25 bg-accent/5 px-3 py-2.5 text-[12px] leading-relaxed text-muted">
          {labels.withIntent.replace("{intent}", intent)}
        </p>
      ) : null}
    </>
  );
}
