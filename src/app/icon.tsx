import { ImageResponse } from "next/og";

/* Edge runtime is required for ImageResponse — without it Next.js
   tries to render the image in Node.js which lacks canvas support
   and causes a 500 on every page during dev head-generation. */
export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#273043",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "7px",
        }}
      >
        <div
          style={{
            background: "#DD0426",
            width: "22px",
            height: "22px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F7F4F3",
            fontSize: "15px",
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          O
        </div>
      </div>
    ),
    { ...size }
  );
}
