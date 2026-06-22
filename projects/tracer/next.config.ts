import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // Multiple lockfiles exist (repo root + this project). Pin the tracing root
  // to this project so Next stops guessing.
  outputFileTracingRoot: path.resolve(__dirname),
  // The shared kit is symlinked into node_modules/@aisoldier/ui-kit (it really
  // lives at ../../ui-kit). transpilePackages runs its TS/TSX through this
  // project's loader pipeline.
  transpilePackages: ["@aisoldier/ui-kit"],
  experimental: {
    externalDir: true,
  },
  webpack: (cfg) => {
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      // Point @ui-kit at the SYMLINKED location under node_modules. Combined
      // with resolve.symlinks=false below, kit files keep the symlinked path
      // during resolution, so their imports of react / framer-motion / lenis
      // walk up to THIS project's node_modules (the template-design pattern).
      "@ui-kit": path.resolve(__dirname, "node_modules/@aisoldier/ui-kit"),
    };
    if (cfg.resolve) cfg.resolve.symlinks = false;
    return cfg;
  },
};

export default config;
