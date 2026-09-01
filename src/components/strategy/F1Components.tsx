import { Fragment } from "react";
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

function CarSilhouette() {
  return (
    <Image
      src="/f1.png"
      alt=""
      width={720}
      height={1465}
      className="h-full w-auto object-contain object-top"
      priority
    />
  );
}

export function F1Components() {
  return (
    <figure className="relative mx-auto max-w-4xl px-1 sm:px-4">
      <figcaption className="sr-only">
        Formula One components mapped to the AI investing stack
      </figcaption>

      <div className="relative grid grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)] sm:gap-x-8">
        {ROWS.map((row, i) => (
          <Fragment key={row.f1}>
            <p className="text-right text-sm font-semibold leading-snug text-text sm:text-lg">
              {row.f1}
            </p>
            {i === 0 ? (
              <div className="relative z-10 row-span-6 flex min-h-[16rem] justify-center self-stretch sm:min-h-[24rem]">
                <CarSilhouette />
              </div>
            ) : null}
            <p className="text-left text-sm font-semibold leading-snug text-text sm:text-lg">
              {row.invest}
            </p>
            <p
              className={`text-right text-xs leading-relaxed text-text-soft sm:text-sm ${
                i < ROWS.length - 1 ? "pb-5 sm:pb-8" : ""
              }`}
            >
              {row.f1Detail}
            </p>
            <p
              className={`text-left text-xs leading-relaxed text-text-soft sm:text-sm ${
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
