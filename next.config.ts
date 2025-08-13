import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Build sırasında ESLint hatalarını yok say
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
