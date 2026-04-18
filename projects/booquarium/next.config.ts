import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = isProd ? "/booquarium" : "";

const config: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
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
