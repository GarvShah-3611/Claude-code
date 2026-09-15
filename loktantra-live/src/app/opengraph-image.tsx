import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
/* Generated once at build time — required for `output: "export"`. */
export const dynamic = "force-static";

/**
 * Share card. Built from the same tokens as the page so a link preview
 * looks like the site it points at.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e12",
          backgroundImage:
            "radial-gradient(1000px 620px at 12% -10%, rgba(139,92,246,0.34), transparent 62%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#8b5cf6",
            }}
          />
          <div style={{ fontSize: 28, color: "#f4f1ea", letterSpacing: -0.5 }}>
            {site.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            lineHeight: 1.04,
            color: "#f4f1ea",
            letterSpacing: -3,
            maxWidth: 940,
          }}
        >
          {site.tagline}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#9a97a3" }}>
          Protest, policy, and the pulse of Indian democracy
        </div>
      </div>
    ),
    size,
  );
}
