import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { licenseLabel } from "@/lib/licenses";
import { getAllTemplates, getTemplateBySlug } from "@/lib/templates";

export const alt = "Template on Templete";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllTemplates().map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return new ImageResponse(<OgCard eyebrow="templates" title="Template not found" />, size);
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={template.category.toLowerCase()}
        title={template.title}
        description={template.description}
        chips={[licenseLabel(template.license), ...template.frameworks.slice(0, 3)]}
      />
    ),
    size,
  );
}
