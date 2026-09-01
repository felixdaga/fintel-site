"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";

const ROWS = [
  {
    f1: "Driver",
    f1Detail: "Has his own style and favorite tracks.",
    invest: "LLM",
    investDetail: "Has its own characteristics and limits.",
  },
  {
    f1: "Race car",
    f1Detail: "Optimized for the track and driver.",
    invest: "Agentic harness",
    investDetail: "Optimized for the strategy and LLM.",
  },
  {
    f1: "Racing environment",
    f1Detail: "Ever-changing tracks & regulations.",
    invest: "Market environment",
    investDetail: "Ever-changing market conditions.",
  },
] as const;

const TITLE_ROW = ["row-start-1", "row-start-3", "row-start-5"] as const;
const DETAIL_ROW = ["row-start-2", "row-start-4", "row-start-6"] as const;

const KERB_PERIOD = 56;

function CarSilhouette() {
  return (
    <Image
      src="/f1.png"
      alt=""
      width={720}
      height={1465}
      className="relative z-10 h-full w-auto object-contain object-top"
      priority
    />
  );
}

function Kerb({
  side,
  shift,
}: {
  side: "left" | "right";
  shift: number;
}) {
  const y = ((shift % KERB_PERIOD) + KERB_PERIOD) % KERB_PERIOD;
  const flip = side === "right";
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 w-1.5 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)] sm:w-2 ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{
        backgroundImage: `repeating-linear-gradient(to bottom, ${
          flip ? "#e6ecf3" : "#e11d48"
        } 0 28px, ${flip ? "#e11d48" : "#e6ecf3"} 28px 56px)`,
        backgroundPosition: `0 ${y}px`,
      }}
      aria-hidden
    />
  );
}

export function F1Components() {
  const rootRef = useRef<HTMLElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      setShift(-el.getBoundingClientRect().top);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <figure ref={rootRef} className="relative mx-auto max-w-4xl">
      <figcaption className="sr-only">
        Formula One components mapped to the AI investing stack
      </figcaption>

      <div className="relative grid min-h-[16rem] grid-cols-[minmax(0,1fr)_5.75rem_minmax(0,1fr)] grid-rows-[auto_auto_auto_auto_auto_auto] items-start gap-x-2 sm:min-h-[24rem] sm:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)] sm:gap-x-8">
        <div className="relative col-start-2 row-span-6 row-start-1 flex justify-center self-stretch overflow-hidden">
          <Kerb side="left" shift={shift} />
          <CarSilhouette />
          <Kerb side="right" shift={shift} />
        </div>

        {ROWS.map((row, i) => (
          <Fragment key={row.f1}>
            <p
              className={`col-start-1 ${TITLE_ROW[i]} self-start text-right text-[13px] font-semibold leading-snug text-text sm:text-lg`}
            >
              {row.f1}
            </p>
            <p
              className={`col-start-3 ${TITLE_ROW[i]} self-start text-left text-[13px] font-semibold leading-snug text-text sm:text-lg`}
            >
              {row.invest}
            </p>
            <p
              className={`col-start-1 ${DETAIL_ROW[i]} self-start text-right text-xs leading-relaxed text-text-soft sm:text-sm ${
                i < ROWS.length - 1 ? "pb-5 sm:pb-8" : ""
              }`}
            >
              {row.f1Detail}
            </p>
            <p
              className={`col-start-3 ${DETAIL_ROW[i]} self-start text-left text-xs leading-relaxed text-text-soft sm:text-sm ${
                i < ROWS.length - 1 ? "pb-5 sm:pb-8" : ""
              }`}
            >
              {row.investDetail}
            </p>
          </Fragment>
        ))}
      </div>
    </figure>
  );
}
