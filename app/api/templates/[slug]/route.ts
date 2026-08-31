import { NextResponse } from "next/server";
import { buildHandoff, koduOpenUrl } from "@/lib/kodu";
import { getDerivatives, getRelated, getTemplateBySlug } from "@/lib/templates";

/** One template, with everything needed to open it and to credit it. */
export async function GET(_request: Request, { params }: RouteContext<"/api/templates/[slug]">) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return NextResponse.json(
      { error: "Unknown template" },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }

  return NextResponse.json(
    {
      ...template,
      openUrl: koduOpenUrl(template),
      handoff: buildHandoff(template),
      derivatives: getDerivatives(template).map((t) => ({ slug: t.slug, title: t.title })),
      related: getRelated(template).map((t) => ({ slug: t.slug, title: t.title })),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
