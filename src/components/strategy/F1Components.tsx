import { Fragment } from "react";
import Image from "next/image";

const ROWS = [
  {
    f1: "Driver",
    f1Detail: "Has his own driving style and favorite tracks.",
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

function LaneCell({
  title,
  detail,
  side,
}: {
  title: string;
  detail: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col justify-center ${side === "left" ? "text-right" : "text-left"}`}
    >
      <p className="text-base font-semibold leading-snug text-text sm:text-lg">
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-text-soft">{detail}</p>
    </div>
  );
}

export function F1Components() {
  return (
    <figure className="relative mx-auto max-w-4xl px-1 sm:px-4">
      <figcaption className="sr-only">
        Formula One components mapped to the AI investing stack
      </figcaption>

      <div className="relative grid grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,1fr)] gap-x-3 gap-y-5 sm:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-8">
        {ROWS.map((row, i) => (
          <Fragment key={row.f1}>
            <LaneCell side="left" title={row.f1} detail={row.f1Detail} />
            {i === 0 ? (
              <div className="row-span-3 flex min-h-[16rem] justify-center sm:min-h-[24rem]">
                <CarSilhouette />
              </div>
            ) : null}
            <LaneCell side="right" title={row.invest} detail={row.investDetail} />
          </Fragment>
        ))}
      </div>
    </figure>
  );
}
