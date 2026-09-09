import Link from "next/link";
import { CHART_START, PAGE_GUTTER, PAGE_PAD } from "./whyEvalData";
import { COPY } from "./main_texts";
import { EvalStoryChart } from "./EvalStoryChart";
import { evalStoryWindow } from "./evalStory";
import { SectionHeader } from "./SectionHeader";
import { LiveDot } from "@/components/LiveDot";

export function WhyEval() {
  const { dates, series } = evalStoryWindow(CHART_START);
  const { kicker, title, titleAccent, lede, demo } = COPY.whyEval;

  return (
    <section id="why-eval" className="scroll-mt-16 bg-bg-soft">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={`${PAGE_GUTTER} flex flex-col gap-8`}>
          <SectionHeader
            kicker={kicker}
            title={title}
            titleAccent={titleAccent}
            lede={lede}
          />

          <div>
            <EvalStoryChart dates={dates} series={series} />
            <p className="mt-5 text-center text-sm leading-relaxed text-text-soft sm:text-base">
              {demo.detail}{" "}
              <Link
                href={demo.href}
                className="inline-flex items-center gap-1.5 font-medium text-text underline decoration-orange/70 underline-offset-4 transition-colors hover:text-orange"
              >
                {demo.label}
                <LiveDot />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
