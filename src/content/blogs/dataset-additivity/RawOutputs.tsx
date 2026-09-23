"use client";

import { WeeklyScoresTable } from "@/components/live-agent/WeeklyScoresTable";
import type { StrategyWeek } from "@/components/live-agent/types";
import rawOutputs from "./raw_outputs.json";

export function RawOutputs() {
  return <WeeklyScoresTable weeks={rawOutputs.weeks as StrategyWeek[]} />;
}
