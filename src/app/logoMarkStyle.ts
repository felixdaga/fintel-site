/** Proportions from Logo.tsx lg mark: h-9 w-9 (36px) + text-lg (18px) + rounded-lg (8px). */
const LOGO_MARK_BOX = 36;
const LOGO_MARK_FONT = 18;
const LOGO_MARK_RADIUS = 8;

export function logoMarkStyle(boxSize: number) {
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
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  } as const;
}
