import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server's hot-reload connection work when opening the site
  // from another device on the LAN (e.g. testing on a phone) instead of localhost.
  allowedDevOrigins: ["192.168.0.100", "192.168.1.13", "192.168.0.103"],
  // Default is 1mb, too small for photo uploads. Must comfortably exceed
  // MAX_FILES * MAX_FILE_BYTES in src/lib/uploads.ts (20 * 5mb = 100mb) plus
  // multipart overhead, or a full-size upload gets rejected here before the
  // app's own per-file checks even run.
  experimental: {
    serverActions: {
      bodySizeLimit: "110mb",
    },
  },
};

export default nextConfig;
