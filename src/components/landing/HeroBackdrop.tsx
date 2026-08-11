"use client";

const W = 1200;
const H = 520;
const PAD = 28;
const MID_Y = H / 2;

const X0 = 20;
const X1 = 160; // 1 → 3
const X2 = 340; // 3 → fan
const X3 = W - 340; // fan → 3
const X4 = W - 160; // 3 → 1
const X5 = W - 20;

const LEAVES = 20;

const THIRD = H / 3;
const BRANCH_YS = [THIRD * 0.5, THIRD * 1.5, THIRD * 2.5];

const ZONES = [
  { lo: PAD, hi: THIRD - PAD },
  { lo: THIRD + PAD, hi: 2 * THIRD - PAD },
  { lo: 2 * THIRD + PAD, hi: H - PAD },
];

function endpoints(lo: number, hi: number, n: number) {
  return Array.from({ length: n }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / n);
}

/** Orthogonal path: horizontal → vertical → horizontal. */
function elbow(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
}

export function HeroBackdrop() {
  const lines: { d: string; key: string }[] = [];

  // left: 1 → 3
  BRANCH_YS.forEach((y, i) => {
    lines.push({ key: `l-branch-${i}`, d: elbow(X0, MID_Y, X1, y) });
  });

  // middle-left: 3 → fan, then middle-right: fan → 3
  BRANCH_YS.forEach((hubY, bi) => {
    const leafYs = endpoints(ZONES[bi].lo, ZONES[bi].hi, LEAVES);
    leafYs.forEach((ey, i) => {
      lines.push({
        key: `out-${bi}-${i}`,
        d: elbow(X1, hubY, X2, ey),
      });
      // straight through the wide middle
      lines.push({
        key: `mid-${bi}-${i}`,
        d: `M ${X2} ${ey} H ${X3}`,
      });
      lines.push({
        key: `in-${bi}-${i}`,
        d: elbow(X3, ey, X4, hubY),
      });
    });
  });

  // right: 3 → 1
  BRANCH_YS.forEach((y, i) => {
    lines.push({ key: `r-branch-${i}`, d: elbow(X4, y, X5, MID_Y) });
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
            strokeWidth={0.9}
            strokeLinecap="square"
          />
        ))}
      </svg>
    </div>
  );
}
