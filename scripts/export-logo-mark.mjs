import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fontPath = path.join(
  root,
  "node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.ttf",
);
const fontData = fs.readFileSync(fontPath);

/** Proportions from Logo.tsx lg mark: h-9 w-9 (36px) + text-lg (18px) + rounded-lg (8px). */
const LOGO_MARK_BOX = 36;
const LOGO_MARK_FONT = 18;
const LOGO_MARK_RADIUS = 8;

function markStyle(boxSize) {
  const scale = boxSize / LOGO_MARK_BOX;

  return {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom right, #6f93cf, #8aa9df)",
    borderRadius: Math.round(LOGO_MARK_RADIUS * scale),
    color: "white",
    fontSize: Math.round(LOGO_MARK_FONT * scale),
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.025em",
    fontFamily: "Geist Mono",
  };
}

async function renderMark(size) {
  const response = new ImageResponse(
    {
      type: "div",
      props: {
        style: markStyle(size),
        children: "fl",
      },
    },
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Geist Mono",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  return Buffer.from(await response.arrayBuffer());
}

const outputs = [
  { size: 32, file: "src/app/icon.png" },
  { size: 180, file: "src/app/apple-icon.png" },
];

for (const { size, file } of outputs) {
  const outPath = path.join(root, file);
  const png = await renderMark(size);
  fs.writeFileSync(outPath, png);
  console.log(`wrote ${file} (${size}x${size}, ${png.length} bytes)`);
}
