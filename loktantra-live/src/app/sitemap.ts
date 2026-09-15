import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/* Generated once at build time — required for `output: "export"`. */
export const dynamic = "force-static";

/** Single-page site, so the sitemap has one entry — but a real one. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
