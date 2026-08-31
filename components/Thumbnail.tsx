"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Tries each source in turn and falls back to a deterministic gradient.
 *
 * A template usually has two: a real screenshot of its live demo, and GitHub's
 * social card. Screenshots go stale when a demo moves or dies, and social
 * cards 404 on renamed repos, so neither can be trusted on its own.
 */
function hueFrom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  }
  return hash;
}

function initials(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

interface Props {
  sources: (string | null | undefined)[];
  title: string;
  seed: string;
  sizes: string;
  priority?: boolean;
}

export function Thumbnail({ sources, title, seed, sizes, priority = false }: Props) {
  const candidates = sources.filter((s): s is string => Boolean(s));
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  if (!src) {
    const hue = hueFrom(seed);
    return (
      <div
        aria-hidden
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 45% 22%), hsl(${(hue + 48) % 360} 40% 14%))`,
        }}
      >
        <span className="text-2xl font-semibold tracking-tight text-white/70">
          {initials(title)}
        </span>
      </div>
    );
  }

  return (
    <Image
      key={src}
      src={src}
      alt={`${title} preview`}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setIndex((i) => i + 1)}
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  );
}
