import type { Template } from "@/lib/types";
import { licenseLabel } from "@/lib/licenses";

export function LicenseBadge({ template }: { template: Template }) {
  const copyable = template.usage === "copy";
  return (
    <span
      title={copyable ? "Free to copy into your workspace" : "Linked to the source, not copied"}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        copyable
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-line-strong bg-hover text-muted",
      ].join(" ")}
    >
      {licenseLabel(template.license)}
    </span>
  );
}
