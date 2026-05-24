import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - Turbopack config is not yet in the official types for all versions
  turbopack: {},
};

// Temporarily disabling PWA to debug cache issue
export default nextConfig;
