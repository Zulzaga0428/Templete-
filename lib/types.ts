export type SourceKind = "github" | "v0" | "shadcn" | "kodu";

/**
 * How a template may be used. Permissive licences can be copied into a Kodu
 * workspace; everything else is link-only so we never redistribute code we
 * have no right to.
 */
export type UsageMode = "copy" | "link";

export interface LicenseInfo {
  /** SPDX id, e.g. "MIT". `null` when the repo ships no licence at all. */
  spdx: string | null;
  name: string | null;
  url: string | null;
  permissive: boolean;
}

export interface RepoInfo {
  owner: string;
  name: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  pushedAt: string;
  cloneUrl: string;
  tarballUrl: string;
}

export interface Template {
  /** Stable across re-ingests: `${source}:${owner}/${name}`. */
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  source: SourceKind;
  sourceUrl: string;
  /** Live demo, when the project publishes one. */
  demoUrl: string | null;
  /** Social preview / OG image used as the gallery thumbnail. */
  imageUrl: string | null;
  repo: RepoInfo | null;
  license: LicenseInfo;
  usage: UsageMode;
  category: string;
  frameworks: string[];
  tags: string[];
  stars: number;
  updatedAt: string;
  ingestedAt: string;
  /** Set by curated entries to pin them to the top of the gallery. */
  featured: boolean;
}

export interface TemplateIndex {
  generatedAt: string;
  count: number;
  templates: Template[];
}
