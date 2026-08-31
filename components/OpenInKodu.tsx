import type { Dictionary } from "@/lib/i18n";
import type { Template } from "@/lib/types";

/**
 * A form rather than a link, so the handoff runs server-side in
 * /api/kodu/open and can talk to the Kodu API when it is configured.
 * It works with JavaScript disabled, which also means it works while the page
 * is still hydrating.
 */
export function OpenInKodu({
  template,
  t,
  prompt,
  className = "",
}: {
  template: Template;
  t: Dictionary["detail"];
  /** The visitor's own description, carried through to the Kodu workspace. */
  prompt?: string;
  className?: string;
}) {
  if (template.usage !== "copy") {
    return (
      <a
        href={template.sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-raised px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-hover ${className}`}
      >
        {t.viewOnGitHub}
      </a>
    );
  }

  return (
    <form action="/api/kodu/open" method="post" className={className}>
      <input type="hidden" name="slug" value={template.slug} />
      {prompt ? <input type="hidden" name="prompt" value={prompt} /> : null}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
      >
        {t.openInKodu}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
