"use client";

import { useState } from "react";
import { Thumbnail } from "./Thumbnail";

/**
 * A screenshot that becomes the running demo when asked.
 *
 * Not an iframe from the start, deliberately: loading a third-party site on
 * every page view is slow, hands the visitor to that site before they asked,
 * and breaks whenever the demo does. The screenshot is what the page owes the
 * reader; the live version is what they can choose.
 *
 * Only offered when the demo said it allows framing — see ScreenshotRecord.
 */
export function LivePreview({
  demoUrl,
  screenshotUrl,
  imageUrl,
  title,
  seed,
  embeddable,
  labels,
}: {
  demoUrl: string | null;
  screenshotUrl?: string | null;
  imageUrl: string | null;
  title: string;
  seed: string;
  embeddable?: boolean;
  /** Plain strings only: the dictionary holds functions, which cannot cross
   *  into a Client Component. */
  labels: { tryIt: string; tryItNote: string; showScreenshot: string; liveNote: string };
}) {
  const [live, setLive] = useState(false);
  const canGoLive = Boolean(demoUrl && embeddable);

  return (
    <div>
      <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-line bg-raised">
        {live && demoUrl ? (
          <iframe
            src={demoUrl}
            title={`${title} — live demo`}
            className="absolute inset-0 h-full w-full"
            // The demo is someone else's site: no referrer, no access to this
            // page, and popups it opens cannot navigate us away.
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="lazy"
          />
        ) : (
          <Thumbnail
            sources={[screenshotUrl, imageUrl]}
            title={title}
            seed={seed}
            sizes="(max-width: 1024px) 100vw, 760px"
            priority
          />
        )}
      </div>

      {canGoLive ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
          <button
            type="button"
            onClick={() => setLive((value) => !value)}
            className={[
              "rounded-lg border px-3 py-1.5 font-medium transition-colors",
              live
                ? "border-line-strong bg-hover text-fg"
                : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15",
            ].join(" ")}
          >
            {live ? labels.showScreenshot : labels.tryIt}
          </button>
          <span className="text-subtle">{live ? labels.liveNote : labels.tryItNote}</span>
        </div>
      ) : null}
    </div>
  );
}
