import { format, type Dictionary } from "./i18n";
import type { LicenseInfo } from "./types";

/**
 * Licences that allow us to copy a template into a user's Kodu workspace,
 * provided the original LICENSE and copyright notice travel with it.
 * Anything not on this list is shown in the gallery but only ever linked.
 */
const PERMISSIVE_SPDX = new Set([
  "MIT",
  "MIT-0",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "Unlicense",
  "0BSD",
  "CC0-1.0",
  "MPL-2.0",
]);

/**
 * The strings a licence needs to describe itself. Plain strings with {label}
 * placeholders rather than functions, because this object is handed to Client
 * Components and functions cannot cross that boundary.
 */
export type LicenceStrings = Dictionary["licence"];

export function isPermissive(spdx: string | null | undefined): boolean {
  if (!spdx) return false;
  return PERMISSIVE_SPDX.has(spdx);
}

export function normalizeLicense(
  raw: { spdx_id?: string | null; name?: string | null; url?: string | null } | null | undefined,
): LicenseInfo {
  // GitHub reports "NOASSERTION" when it detects a LICENSE file it cannot
  // classify — treat that as unknown rather than as a grant.
  const spdx = raw?.spdx_id && raw.spdx_id !== "NOASSERTION" ? raw.spdx_id : null;
  return {
    spdx,
    name: raw?.name ?? null,
    url: raw?.url ?? null,
    permissive: isPermissive(spdx),
  };
}

/** SPDX id where there is one, the licence's own name otherwise. */
export function licenseLabel(license: LicenseInfo, noneLabel = "No licence"): string {
  return license.spdx ?? license.name ?? noneLabel;
}

/** Short, human explanation of why a template is copy- or link-only. */
export function usageExplanation(license: LicenseInfo, t: LicenceStrings): string {
  const label = licenseLabel(license, t.none);
  if (license.permissive) return format(t.permissive, { label });
  if (license.spdx) return format(t.restricted, { label });
  return t.missing;
}
