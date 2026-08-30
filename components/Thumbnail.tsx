"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Repo social cards occasionally 404 (renamed repos, GitHub hiccups). Falling
 * back to a deterministic gradient keeps the grid from filling with broken
 * image icons.
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
  src: string | null;
  title: string;
  seed: string;
  sizes: string;
  priority?: boolean;
}

export function Thumbnail({ src, title, seed, sizes, priority = false }: Props) {
  const [failed, setFailed] = useState(false);
  const hue = hueFrom(seed);

  if (!src || failed) {
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
      src={src}
      alt={`${title} preview`}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  );
}
