import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components는 사용하지 않음 (cacheComponents 미설정)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
