import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow all HTTPS domains (more flexible for user-submitted content)
      {
        protocol: "https",
        hostname: "**",
      },
      // Allow HTTP for development/testing
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
