import { ImageResponse } from "next/og";
import { logoMarkStyle } from "./logoMarkStyle";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={logoMarkStyle(size.width)}>
        fl
      </div>
    ),
    { ...size },
  );
}
