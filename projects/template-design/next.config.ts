import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  // The kit is installed as a `file:../../ui-kit` dependency → it appears in
  // node_modules as a symlink. `transpilePackages` tells Next to run the kit's
  // TSX/TS through the project's loader pipeline.
  transpilePackages: ["@aisoldier/ui-kit"],

  experimental: {
    externalDir: true,
  },


  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // Webpack by default resolves symlinks to their real path, which for us
  // means `node_modules/@aisoldier/ui-kit/*` collapses to `../../ui-kit/*`
  // (a folder with no node_modules of its own). Turning symlinks off keeps
  // the symlinked path in place during resolution, so the kit's imports of
  // `framer-motion` / `react` / etc. walk up to THIS project's node_modules.
  webpack: (config) => {
    if (config.resolve) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default config;
