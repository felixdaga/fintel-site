"use client";

import { useEffect, useState } from "react";

const W = 1200;
const H = 520;
const PAD = 28;
const MID_Y = H / 2;

const X0 = 20;
const X1 = 160;
const X2 = 340;
const X3 = W - 340;
const X4 = W - 160;
const X5 = W - 20;

const LEAVES = 20;
const STROKE = 1;

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

/** Horizontal-first orthogonal: horizontal → vertical → horizontal. */
function elbowH(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
}

/** Vertical-first orthogonal: vertical → horizontal → vertical. */
function elbowV(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} V ${my} H ${x2} V ${y2}`;
}

function buildHorizontalLines() {
  const lines: { d: string; key: string }[] = [];

  BRANCH_YS.forEach((y, i) => {
    lines.push({ key: `l-${i}`, d: elbowH(X0, MID_Y, X1, y) });
  });

  BRANCH_YS.forEach((hubY, bi) => {
    const leafYs = endpoints(ZONES[bi].lo, ZONES[bi].hi, LEAVES);
    leafYs.forEach((ey, i) => {
      lines.push({ key: `out-${bi}-${i}`, d: elbowH(X1, hubY, X2, ey) });
      lines.push({ key: `mid-${bi}-${i}`, d: `M ${X2} ${ey} H ${X3}` });
      lines.push({ key: `in-${bi}-${i}`, d: elbowH(X3, ey, X4, hubY) });
    });
  });

  BRANCH_YS.forEach((y, i) => {
    lines.push({ key: `r-${i}`, d: elbowH(X4, y, X5, MID_Y) });
  });

  return lines;
}

/** Top → fan → bottom (portrait): mirror of the desktop left → fan → right flow. */
function buildVerticalLines() {
  const vw = H;
  const vh = W;
  const y0 = 20;
  const y1 = 160;
  const y2 = 340;
  const y3 = vh - 340;
  const y4 = vh - 160;
  const y5 = vh - 20;
  const midX = vw / 2;

  const third = vw / 3;
  const branchXs = [third * 0.5, third * 1.5, third * 2.5];
  const zones = [
    { lo: PAD, hi: third - PAD },
    { lo: third + PAD, hi: 2 * third - PAD },
    { lo: 2 * third + PAD, hi: vw - PAD },
  ];

  const lines: { d: string; key: string }[] = [];

  branchXs.forEach((x, i) => {
    lines.push({ key: `t-${i}`, d: elbowV(midX, y0, x, y1) });
  });

  branchXs.forEach((hubX, bi) => {
    const leafXs = endpoints(zones[bi].lo, zones[bi].hi, LEAVES);
    leafXs.forEach((ex, i) => {
      lines.push({ key: `out-${bi}-${i}`, d: elbowV(hubX, y1, ex, y2) });
      lines.push({ key: `mid-${bi}-${i}`, d: `M ${ex} ${y2} V ${y3}` });
      lines.push({ key: `in-${bi}-${i}`, d: elbowV(ex, y3, hubX, y4) });
    });
  });

  branchXs.forEach((x, i) => {
    lines.push({ key: `b-${i}`, d: elbowV(x, y4, midX, y5) });
  });

  return lines;
}

const HORIZONTAL = buildHorizontalLines();
const VERTICAL = buildVerticalLines();

export function HeroBackdrop() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const lines = mobile ? VERTICAL : HORIZONTAL;
  const viewBox = mobile ? `0 0 ${H} ${W}` : `0 0 ${W} ${H}`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 sm:opacity-25">
      <svg
        viewBox={viewBox}
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
            strokeWidth={STROKE}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="square"
          />
        ))}
      </svg>
    </div>
  );
}
