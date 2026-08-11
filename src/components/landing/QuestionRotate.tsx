"use client";

import { useEffect, useState } from "react";

const QUESTIONS = [
  "Can AI generate durable and additive alpha over traditional strategies?",
  "How can we systematically backtest and evaluate AI agents?",
  "Which investment strategy is implementable with the current state of AI?",
  "How can we quantify impact from each iteration of the strategy and agent?",
];

const HOLD_MS = 4000;
const FADE_MS = 500;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 mt-14 flex w-screen max-w-[100vw] -translate-x-1/2 items-center">
      <div className="h-px flex-1 bg-highlight/40" aria-hidden />
      <div className="w-full max-w-3xl shrink-0 border border-highlight/40 bg-bg px-6 py-10 sm:px-10">
        {children}
      </div>
      <div className="h-px flex-1 bg-highlight/40" aria-hidden />
    </div>
  );
}

export function QuestionRotate() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const fadeOut = window.setTimeout(() => setVisible(false), HOLD_MS);
    const next = window.setTimeout(() => {
      setIndex((i) => (i + 1) % QUESTIONS.length);
      setVisible(true);
    }, HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeOut);
      window.clearTimeout(next);
    };
  }, [index, reduceMotion]);

  if (reduceMotion) {
    return (
      <Frame>
        <ol className="space-y-5">
          {QUESTIONS.map((q) => (
            <li
              key={q}
              className="text-center text-xl font-medium leading-relaxed text-white sm:text-2xl"
            >
              &ldquo;{q}&rdquo;
            </li>
          ))}
        </ol>
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="flex min-h-[5rem] items-center justify-center sm:min-h-[4rem]">
        <div className="grid w-full">
          {QUESTIONS.map((q, i) => (
            <p
              key={q}
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 text-center text-xl font-medium leading-relaxed text-white transition-opacity duration-500 sm:text-2xl ${
                i === index && visible ? "opacity-100" : "opacity-0"
              }`}
            >
              &ldquo;{q}&rdquo;
            </p>
          ))}
        </div>
      </div>
    </Frame>
  );
}
