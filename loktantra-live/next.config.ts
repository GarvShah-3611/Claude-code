import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* This app sits inside a repo that has its own lockfile; pin the root
     so Turbopack does not resolve upward to the workspace. */
  turbopack: { root: __dirname },
  /* config options here */
};

export default nextConfig;
