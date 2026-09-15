import type { NextConfig } from "next";

/**
 * `OFFLINE_EXPORT=1` switches the build to a self-contained static bundle
 * (`npm run build:offline`) that opens by double-clicking index.html.
 * The normal build — and every Vercel deploy — is unaffected.
 */
const offline = process.env.OFFLINE_EXPORT === "1";

const nextConfig: NextConfig = {
  /* This app sits inside a repo that has its own lockfile; pin the root
     so Turbopack does not resolve upward to the workspace. */
  turbopack: { root: __dirname },

  ...(offline
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        /* Relative asset paths, so the bundle does not need to be served
           from a domain root. */
        assetPrefix: ".",
      }
    : {}),
};

export default nextConfig;
