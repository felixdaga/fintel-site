"use client";

import type { ReactNode } from "react";
import type { Party } from "./data";
import { METRIC_COLOR, PARTY_BORDER, PARTY_LABEL } from "./data";

export function ChartPartyCard({
  party,
  controls,
  children,
}: {
  party: Party;
  controls?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl bg-bg/70 p-5"
      style={{ border: `2px solid ${PARTY_BORDER[party]}` }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">{PARTY_LABEL[party]}</h3>
        {controls ?? null}
      </div>
      {children}
    </div>
  );
}

function MetricToggle({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
        active ? "text-white" : "border border-border text-text-soft hover:text-text"
      }`}
      style={active ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  );
}

export function ThreatActionToggles({
  metric,
  onThreat,
  onAction,
}: {
  metric: "threat" | "action";
  onThreat: () => void;
  onAction: () => void;
}) {
  return (
    <div className="flex gap-2">
      <MetricToggle
        label="Threat"
        active={metric === "threat"}
        onClick={onThreat}
        color={METRIC_COLOR.threat}
      />
      <MetricToggle
        label="Action"
        active={metric === "action"}
        onClick={onAction}
        color={METRIC_COLOR.action}
      />
    </div>
  );
}
