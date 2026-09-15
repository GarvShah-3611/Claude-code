import { ImageResponse } from "next/og";

/** Favicon: the voter's ink mark, which is the whole identity in one dot. */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
/* Generated once at build time — required for `output: "export"`. */
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6f2",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 999,
            background: "#7a1e3c",
          }}
        />
      </div>
    ),
    size,
  );
}
