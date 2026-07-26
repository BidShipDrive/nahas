import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server's hot-reload connection work when opening the site
  // from another device on the LAN (e.g. testing on a phone) instead of localhost.
  allowedDevOrigins: ["192.168.0.100", "192.168.1.13", "192.168.0.103"],
  // Default is 1mb, too small for review photo uploads (a few phone photos easily
  // exceed that). Client + server also enforce their own per-file/total limits.
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
