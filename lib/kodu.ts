import type { Template } from "./types";

/**
 * Handoff to the main Kodu app.
 *
 * Two modes, so the gallery works today and gets better once the Kodu API
 * contract is fixed:
 *
 *  1. `link`  (default) — we build a URL and let kodu.live pull the template
 *     itself. No secrets live in this app.
 *  2. `api`   — set KODU_API_URL + KODU_API_TOKEN and /api/kodu/open will POST
 *     the template to Kodu, get back a workspace URL, and redirect there.
 *
 * Mode 2 is only used when both env vars are present; otherwise we fall back
 * to mode 1 so a missing token can never break the button.
 */

export const KODU_APP_URL = process.env.NEXT_PUBLIC_KODU_APP_URL ?? "https://kodu.live";

export interface KoduHandoff {
  templateId: string;
  slug: string;
  name: string;
  /** git URL Kodu should clone. Null for link-only templates. */
  repoUrl: string | null;
  ref: string | null;
  license: string | null;
  sourceUrl: string;
}

export function buildHandoff(template: Template): KoduHandoff {
  const copyable = template.usage === "copy" && template.repo !== null;
  return {
    templateId: template.id,
    slug: template.slug,
    name: template.title,
    repoUrl: copyable ? template.repo!.cloneUrl : null,
    ref: copyable ? template.repo!.defaultBranch : null,
    license: template.license.spdx,
    sourceUrl: template.sourceUrl,
  };
}

/**
 * URL that opens a new Kodu workspace seeded with this template.
 * Link-only templates get sent to their source instead — we never hand Kodu a
 * repo we are not allowed to copy.
 */
export function koduOpenUrl(template: Template): string {
  if (template.usage !== "copy" || !template.repo) {
    return template.demoUrl ?? template.sourceUrl;
  }
  const params = new URLSearchParams({
    template: template.slug,
    repo: `${template.repo.owner}/${template.repo.name}`,
    ref: template.repo.defaultBranch,
    utm_source: "templete",
  });
  return `${KODU_APP_URL}/new?${params.toString()}`;
}

export function hasServerApi(): boolean {
  return Boolean(process.env.KODU_API_URL && process.env.KODU_API_TOKEN);
}
