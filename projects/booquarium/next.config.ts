import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const config: NextConfig = {
  output: "export",
  basePath: isProd ? "/aisoldier" : "",
  reactStrictMode: true,
  transpilePackages: ["@aisoldier/ui-kit"],
  experimental: {
    externalDir: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    if (config.resolve) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default config;
