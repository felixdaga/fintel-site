import { ImageResponse } from "next/og";
import { logoMarkStyle } from "./logoMarkStyle";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={logoMarkStyle(size.width)}>
        fl
      </div>
    ),
    { ...size },
  );
}
