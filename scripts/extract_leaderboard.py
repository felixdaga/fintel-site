#!/usr/bin/env python3
"""One-off extract: Delorean pearson reports → site/src/data/leaderboard.json

Reads the cache-viewer default compare set (K=3, Pearson, naive residual tilt)
and writes a lean payload for the fintel leaderboard tab.
"""

from __future__ import annotations

import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DELOREAN = Path(__file__).resolve().parents[3] / "delorean" / "runs"
OUT = ROOT / "src" / "data" / "leaderboard.json"

# stem → (harness, modifier | None)
# Chart label: "{harness} {modifier} ({model})" or "{harness} ({model})"
CONFIGS: list[tuple[str, str, str | None]] = [
    ("floor_llm_v1_memory", "minimal harness", None),
    ("floor_llm_v1_glm_memory", "minimal harness", None),
    ("floor_llm_minimax_m3_memory", "minimal harness", None),
    ("floor_llm_grok_4_3_memory", "minimal harness", None),
    ("floor_llm_grok_4_5_memory", "minimal harness", None),
    ("agent_v1_memory", "openclaw", None),
    ("tradingagent_v2", "trading agent", None),
    ("optimized_agent_full", "fintel", None),
    ("optimized_agent_feedback", "fintel", "+ feedback loop"),
    ("optimized_agent_no_verify", "fintel", "- verifier"),
]

# LLM token cost for K=3 × 16 dates (USD), from paper Appendix A.
# OpenClaw is ledger-estimated (~$70); others from cost_summary totals in the paper.
COST_USD: dict[str, float] = {
    "floor_llm_v1_memory": 6.5,
    "floor_llm_v1_glm_memory": 10.3,
    "floor_llm_minimax_m3_memory": 7.8,
    "floor_llm_grok_4_3_memory": 7.9,
    "floor_llm_grok_4_5_memory": 26.6,
    "agent_v1_memory": 70.0,
    "tradingagent_v2": 46.1,
    "optimized_agent_full": 43.6,
    "optimized_agent_feedback": 45.7,
    "optimized_agent_no_verify": 23.8,
}
def short_model(raw: str) -> str:
    s = raw or "?"
    for prefix in ("openrouter/", "xiaomi/", "z-ai/", "x-ai/", "minimax/"):
        s = s.removeprefix(prefix)
    return s


def resolve_model(stem: str) -> str:
    c = yaml.safe_load((DELOREAN / f"{stem}_r1" / "config.yaml").read_text())
    agent = c.get("agent") or {}
    init = agent.get("init") or {}
    if isinstance(init.get("model"), str):
        return short_model(init["model"])
    inner = agent.get("inner") or {}
    model = inner.get("model")
    if isinstance(model, dict):
        return short_model(model.get("id") or "")
    if isinstance(model, str):
        return short_model(model)
    return "?"


def chart_label(harness: str, modifier: str | None, model: str) -> str:
    if modifier:
        return f"{harness} {modifier} ({model})"
    return f"{harness} ({model})"


def main() -> None:
    rows = []
    dates = None
    benchmark = None

    for stem, harness, modifier in CONFIGS:
        r = json.loads(
            (DELOREAN / f"{stem}_pearson_report" / "report.json").read_text()
        )
        h1 = ((r.get("factor_attribution") or {}).get("by_horizon") or {}).get("1") or {}
        per_run = (r.get("ir") or {}).get("per_run_ic") or {}
        nw = h1.get("residual_mean_ic_nw") or {}

        per_run_mean_ics = []
        for hv in per_run.values():
            cell = hv.get("1") if isinstance(hv, dict) else None
            if isinstance(cell, dict) and cell.get("mean_ic") is not None:
                per_run_mean_ics.append(float(cell["mean_ic"]))

        residual_ic = float(h1["residual_ic"])
        agent_ic = float(h1["agent_ic"])
        run_min = min(per_run_mean_ics) if per_run_mean_ics else None
        run_max = max(per_run_mean_ics) if per_run_mean_ics else None
        pm = (run_max - run_min) / 2.0 if run_min is not None else None
        model = resolve_model(stem)

        nav = (r.get("portfolio_construction") or {}).get("nav") or {}
        if dates is None:
            dates = nav.get("dates") or []
            benchmark = nav.get("benchmark") or []

        rows.append(
            {
                "id": stem,
                "agent": harness,
                "harness": harness,
                "iterations": modifier,
                "model": model,
                "chart_label": chart_label(harness, modifier, model),
                "runs": 3,
                "residual_ic": round(residual_ic, 4),
                "residual_nwt": round(float(nw["t"]), 2),
                "per_run_mean_ic_min": round(run_min, 4) if run_min is not None else None,
                "per_run_mean_ic_max": round(run_max, 4) if run_max is not None else None,
                "per_run_mean_ic_pm": round(pm, 4) if pm is not None else None,
                "agent_ic": round(agent_ic, 4),
                "factor_neutralization_delta": round(residual_ic - agent_ic, 4),
                "cost_usd": COST_USD[stem],
                "nav_residual": [
                    round(float(x), 4)
                    for x in (nav.get("naive_sandbox_residual") or [])
                ],
            }
        )

    rows.sort(key=lambda x: x["residual_nwt"], reverse=True)

    payload = {
        "meta": {
            "source": "delorean pearson reports (cache-viewer default compare set)",
            "ic_method": "pearson",
            "horizon": 1,
            "k": 3,
            "universe": "DJIA-30 (PIT)",
            "cadence": "quarterly",
            "window": "2022-07 → 2026-04",
            "benchmark": "djia_pw",
            "holding": "naive proportional tilt on Layer-4 residual signal",
            "notes": {
                "residual_ic": "mean Pearson IC of Fama–MacBeth residual vs next-period return",
                "nwt": "Newey–West t on mean residual IC (lag = h−1)",
                "per_run_pm": "± half-range of per-run mean IC across K=3 repeats",
                "factor_neutralization_delta": "residual_ic − agent_ic (post − pre)",
                "chart_label": "harness [+/- modifier] (model)",
                "cost_usd": "K=3 LLM token spend (USD) from paper Appendix A",
            },
        },
        "dates": dates,
        "benchmark_nav": [round(float(x), 4) for x in (benchmark or [])],
        "rows": rows,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT} ({len(rows)} rows)")
    for row in rows:
        print(f"  {row['residual_nwt']:5.2f}  ${row['cost_usd']:<5}  {row['chart_label']}")


if __name__ == "__main__":
    main()
