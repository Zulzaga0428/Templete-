import { NextResponse } from "next/server";
import { buildHandoff, hasServerApi, koduOpenUrl } from "@/lib/kodu";
import { getTemplateBySlug } from "@/lib/templates";

export const dynamic = "force-dynamic";

/**
 * Opens a template in Kodu.
 *
 * Posting here (rather than linking straight to kodu.live) gives us one place
 * to swap in the real Kodu API without touching any page: when KODU_API_URL
 * and KODU_API_TOKEN are set we ask Kodu to provision the workspace and
 * redirect to whatever it returns; otherwise we fall back to the public
 * /new?repo=… URL.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  // Bounded: this ends up in a URL, and a visitor's description is a sentence.
  const prompt = String(form.get("prompt") ?? "").trim().slice(0, 500) || undefined;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  if (template.usage !== "copy") {
    // Link-only templates are never handed to Kodu — we have no right to copy
    // the code, so the best we can do is send the visitor to the source.
    return NextResponse.redirect(new URL(template.sourceUrl), 303);
  }

  if (hasServerApi()) {
    try {
      const res = await fetch(`${process.env.KODU_API_URL}/workspaces/from-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.KODU_API_TOKEN}`,
        },
        body: JSON.stringify(buildHandoff(template, prompt)),
      });

      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) return NextResponse.redirect(new URL(data.url), 303);
      }
      console.error(`Kodu API returned ${res.status}; falling back to the public URL`);
    } catch (error) {
      // A provisioning outage must not break the button — degrade to the URL
      // handoff rather than showing the visitor an error page.
      console.error("Kodu API request failed; falling back to the public URL", error);
    }
  }

  return NextResponse.redirect(new URL(koduOpenUrl(template, prompt)), 303);
}
