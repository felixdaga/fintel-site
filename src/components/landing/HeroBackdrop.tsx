"use client";

const W = 1200;
const H = 520;
const PAD = 28;
const START = { x: 20, y: H / 2 };
const SPLIT = { x: 50, y: H / 2 }; // short trunk
const HUB_X = 200;
const END_X = W - 20;

const THIRD = H / 3;
const BRANCHES = [
  { hubY: THIRD * 0.5, zoneLo: PAD, zoneHi: THIRD - PAD },
  { hubY: THIRD * 1.5, zoneLo: THIRD + PAD, zoneHi: 2 * THIRD - PAD },
  { hubY: THIRD * 2.5, zoneLo: 2 * THIRD + PAD, zoneHi: H - PAD },
];

function branchEndpoints(lo: number, hi: number, n: number) {
  return Array.from({ length: n }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / n);
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export function HeroBackdrop() {
  const lines: { d: string; key: string; thin?: boolean }[] = [];

  // short single trunk
  lines.push({ key: "trunk", d: curve(START.x, START.y, SPLIT.x, SPLIT.y) });

  // split immediately into 3, then 20 each
  BRANCHES.forEach((b, bi) => {
    lines.push({
      key: `branch-${bi}`,
      d: curve(SPLIT.x, SPLIT.y, HUB_X, b.hubY),
    });

    branchEndpoints(b.zoneLo, b.zoneHi, 20).forEach((ey, i) => {
      lines.push({
        key: `leaf-${bi}-${i}`,
        d: curve(HUB_X, b.hubY, END_X, ey),
        thin: true,
      });
    });
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        {lines.map((l) => (
          <path
            key={l.key}
            d={l.d}
            fill="none"
            stroke="var(--highlight)"
            strokeWidth={l.thin ? 0.55 : 1.3}
            strokeLinecap="round"
          />
        ))}
        {/* branch point + one dot per main branch before the 30-line fan */}
        <circle cx={SPLIT.x} cy={SPLIT.y} r={4} fill="var(--highlight)" />
        {BRANCHES.map((b, i) => (
          <circle
            key={i}
            cx={HUB_X}
            cy={b.hubY}
            r={4}
            fill="var(--highlight)"
          />
        ))}
      </svg>
    </div>
  );
}
