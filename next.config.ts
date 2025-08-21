import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Build sırasında ESLint hatalarını yok say
    ignoreDuringBuilds: true,
  },
   typescript: {
    // Build sırasında TS hatalarını yok say
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
