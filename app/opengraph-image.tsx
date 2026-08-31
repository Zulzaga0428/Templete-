import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { getAllTemplates } from "@/lib/templates";

export const alt = "Templete — free templates you can open in Kodu";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const copyable = getAllTemplates().filter((t) => t.usage === "copy").length;

  return new ImageResponse(
    (
      <OgCard
        eyebrow="templates for Kodu"
        title="Start from something that already works."
        description="Pick a real open-source template, open it in Kodu, and tell the agent what to change."
        chips={[`${copyable} licence-checked`, "Free and open source"]}
      />
    ),
    size,
  );
}
