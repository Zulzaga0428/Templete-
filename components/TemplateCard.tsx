import Link from "next/link";
import type { Template } from "@/lib/types";
import { LicenseBadge } from "./LicenseBadge";
import { Thumbnail } from "./Thumbnail";

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(stars >= 10_000 ? 0 : 1)}k`;
  return String(stars);
}

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Link
      href={`/t/${template.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-raised transition-colors hover:border-line-strong"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-hover">
        <Thumbnail
          src={template.imageUrl}
          title={template.title}
          seed={template.id}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start gap-2">
          <h3 className="text-sm font-semibold leading-snug text-fg">{template.title}</h3>
          <span className="ml-auto shrink-0 pt-0.5 text-xs text-subtle" title="GitHub stars">
            ★ {formatStars(template.stars)}
          </span>
        </div>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
          {template.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          <LicenseBadge template={template} />
          {template.frameworks.slice(0, 2).map((framework) => (
            <span
              key={framework}
              className="rounded-full border border-line px-2 py-0.5 text-[11px] text-subtle"
            >
              {framework}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
