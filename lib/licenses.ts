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

export function licenseLabel(license: LicenseInfo): string {
  if (license.spdx) return license.spdx;
  if (license.name) return license.name;
  return "No licence";
}

/** Short, human explanation of why a template is copy- or link-only. */
export function usageExplanation(license: LicenseInfo): string {
  if (license.permissive) {
    return `${licenseLabel(license)} — free to copy and modify. The original licence and copyright notice are kept with the code.`;
  }
  if (license.spdx) {
    return `${licenseLabel(license)} — this licence has terms we cannot accept on your behalf, so we link to the source instead of copying it.`;
  }
  return "This project ships no licence, which means all rights are reserved by default. We link to it rather than copying the code.";
}
