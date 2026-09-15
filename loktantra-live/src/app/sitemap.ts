import type { MetadataRoute } from "next";
import { site } from "@/content/site";

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
