import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub's social card for every public repo — our thumbnail source.
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    // Every page lives under /:lang. The root sends people to English, and the
    // pre-i18n paths are kept alive so anything already linked or indexed does
    // not start 404ing.
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/templates", destination: "/en/templates", permanent: true },
      { source: "/templates/:category", destination: "/en/templates/:category", permanent: true },
      { source: "/t/:slug", destination: "/en/t/:slug", permanent: true },
      { source: "/about", destination: "/en/about", permanent: true },
    ];
  },
};

export default nextConfig;
