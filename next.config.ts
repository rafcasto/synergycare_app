import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root — a stray lockfile in the home directory would
  // otherwise make Turbopack infer the wrong root.
  turbopack: { root: __dirname },
};

export default nextConfig;
