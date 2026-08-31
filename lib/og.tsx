import type { ReactElement } from "react";

/**
 * Shared layout for the generated Open Graph cards.
 *
 * `next/og` renders with Satori, which supports a subset of CSS: flexbox only,
 * and every element with more than one child needs an explicit `display: flex`.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#08090c";
const FG = "#f2f4f8";
const MUTED = "#9aa3b2";
const ACCENT = "#6ee7b7";
const LINE = "#1e222b";

export function OgCard({
  eyebrow,
  title,
  description,
  chips = [],
}: {
  eyebrow: string;
  title: string;
  description?: string;
  chips?: string[];
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: ACCENT,
            color: "#04201a",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          T
        </div>
        <div style={{ fontSize: 26, color: FG, fontWeight: 600 }}>Templete</div>
        <div style={{ fontSize: 22, color: MUTED, marginLeft: 12 }}>{eyebrow}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: title.length > 42 ? 62 : 76,
            lineHeight: 1.08,
            color: FG,
            fontWeight: 700,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        {description ? (
          <div style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, marginTop: 22 }}>
            {description.length > 130 ? `${description.slice(0, 127)}…` : description}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {chips.map((chip, i) => (
          <div
            key={chip}
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              border: `1px solid ${i === 0 ? "rgba(110,231,183,0.35)" : LINE}`,
              background: i === 0 ? "rgba(110,231,183,0.12)" : "transparent",
              color: i === 0 ? ACCENT : MUTED,
              fontSize: 22,
            }}
          >
            {chip}
          </div>
        ))}
        <div style={{ display: "flex", marginLeft: "auto", color: MUTED, fontSize: 22 }}>
          templete.kodu.live
        </div>
      </div>
    </div>
  );
}
