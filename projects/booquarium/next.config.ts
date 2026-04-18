import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
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
  webpack: (config) => {
    if (config.resolve) {
      config.resolve.symlinks = true;
      config.resolve.alias = {
        ...config.resolve.alias,
        "@aisoldier/ui-kit": require.resolve("@aisoldier/ui-kit"),
      };
    }
    return config;
  },
};

export default config;
