import { licenseLabel, type LicenceStrings } from "@/lib/licenses";
import type { Template } from "@/lib/types";

export function LicenseBadge({ template, t }: { template: Template; t: LicenceStrings }) {
  const copyable = template.usage === "copy";
  return (
    <span
      title={copyable ? t.copyable : t.linkOnly}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        copyable
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-line-strong bg-hover text-muted",
      ].join(" ")}
    >
      {licenseLabel(template.license, t.none)}
    </span>
  );
}
