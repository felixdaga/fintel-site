#!/usr/bin/env python3
"""Extract the "how is this different" charts for the live F1 strategy page.

Outputs ``src/data/strategy_diff.json`` from three sources:

1. ``src/data/leaderboard.json``        → vary-model & vary-harness residual NAV
2. ``<fintel>/runs/.../report/``        → vary-strategy drawdown & biweekly performance
3. ``<delorean>/runs/agent_v1_memory/``  → stochasticity (JPM raw score, 3 repeats, openclaw)

Re-run after the leaderboard extract or after a new biweekly/alphaview report.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
FINTEL = Path(__file__).resolve().parents[2]
DELOREAN = FINTEL.parent / "delorean"
OUT = ROOT / "src" / "data" / "strategy_diff.json"

# ── chart 1: vary model (minimal harness, different models) ──────────────────
# leaderboard.json row id → masked label. glm-5.2 dropped per design.
VARY_MODEL: list[tuple[str, str]] = [
    ("floor_llm_grok_4_5_memory", "Model A (high intelligence, high hallucination)"),
    ("floor_llm_grok_4_3_memory", "Model B (low hallucination, low intelligence)"),
    ("floor_llm_v1_memory", "Model C (balanced A)"),
    ("floor_llm_minimax_m3_memory", "Model D (balanced B)"),
]

# ── chart 2: vary harness (same model: mimo-v2.5-pro) ────────────────────────
VARY_HARNESS: list[tuple[str, str]] = [
    ("agent_v1_memory", "Tool-calling ReAct"),
    ("optimized_agent_full", "Langgraph"),
    ("tradingagent_v2", "Hybrid"),
    ("floor_llm_v1_memory", "Single-turn agent"),
]

# ── chart 3 / 5: fintel run reports ──────────────────────────────────────────
BIWEEKLY_JOB = "systematic_stockrate_djia_biweekly_optimized_20260814_mimo_v2_5_pro_k1"
ALPHAVIEW_JOB = "systematic_stockrate_djia_biweekly_alphaview_optimized_k1"
WEEKLY_JOB = "systematic_stockrate_djia_weekly_optimized_20260806_mimo_v2_5_pro_k1_0001"
BIWEEKLY_WINDOW_STEM = "window-20260102"  # same-period sidecar (2026-01-02 → 2026-08-14)

# ── chart 4: stochasticity (openclaw, JPM raw score, 3 repeats) ──────────────────
DELOREAN_OPENCLAW_RUN = DELOREAN / "runs" / "agent_v1_memory"  # r1/r2/r3 subdirs
STOCHASTICITY_SYMBOL = "JPM"
STOCHASTICITY_SHADES = {"r1": "#f5b078", "r2": "#e8924a", "r3": "#b5652e"}


def _round_list(xs: list[float], n: int = 4) -> list[float]:
    return [round(float(x), n) for x in xs]


def _drawdown(nav: list[float]) -> list[float]:
    """Running max drawdown: dd_t = nav_t / max(nav_<=t) - 1 (≤ 0)."""
    out: list[float] = []
    peak = nav[0] if nav else 1.0
    for v in nav:
        peak = max(peak, v)
        out.append(round(v / peak - 1.0, 6) if peak else 0.0)
    return out


def _book_net(report: dict[str, Any], book: str) -> tuple[list[str], list[float]]:
    series = (report.get("holdings") or {}).get("strategies") or {}
    pts = (series.get(book) or {}).get("net") or []
    dates = [p["date"] for p in pts]
    nav = [float(p["nav"]) for p in pts]
    return dates, nav


def vary_model(leaderboard: dict[str, Any]) -> dict[str, Any]:
    rows = {r["id"]: r for r in leaderboard["rows"]}
    return {
        "dates": leaderboard["dates"],
        "benchmark": leaderboard["benchmark_nav"],
        "series": [
            {
                "id": rid,
                "label": label,
                "nav": rows[rid]["nav_residual"],
            }
            for rid, label in VARY_MODEL
        ],
    }


def vary_harness(leaderboard: dict[str, Any]) -> dict[str, Any]:
    rows = {r["id"]: r for r in leaderboard["rows"]}
    return {
        "dates": leaderboard["dates"],
        "benchmark": leaderboard["benchmark_nav"],
        "series": [
            {
                "id": rid,
                "label": label,
                "nav": rows[rid]["nav_residual"],
            }
            for rid, label in VARY_HARNESS
        ],
    }


def vary_strategy() -> dict[str, Any]:
    biweekly = json.loads(
        (FINTEL / "runs" / BIWEEKLY_JOB / "report" / f"{BIWEEKLY_WINDOW_STEM}.json").read_text()
    )
    alphaview = json.loads(
        (FINTEL / "runs" / ALPHAVIEW_JOB / "report" / "report.json").read_text()
    )
    bd, bnav = _book_net(biweekly, "sw_0.0")
    ad, anav = _book_net(alphaview, "sw_0.0")
    assert bd == ad, f"biweekly/alphaview same-period dates differ: {bd} vs {ad}"
    return {
        "dates": bd,
        "series": [
            {"id": "biweekly", "label": "Strategy A", "drawdown": _drawdown(bnav)},
            {"id": "alphaview", "label": "Strategy A variant", "drawdown": _drawdown(anav)},
        ],
    }


def biweekly_performance() -> dict[str, Any]:
    biweekly = json.loads(
        (FINTEL / "runs" / BIWEEKLY_JOB / "report" / f"{BIWEEKLY_WINDOW_STEM}.json").read_text()
    )
    dates, sw0 = _book_net(biweekly, "sw_0.0")
    _, sw3 = _book_net(biweekly, "sw_0.3")
    _, bench = _book_net(biweekly, "pw")
    return {
        "dates": dates,
        "series": [
            {"id": "sw_0.0", "label": "MVO", "nav": _round_list(sw0)},
            {"id": "sw_0.3", "label": "Unconstrained (agent trade like PM)", "nav": _round_list(sw3)},
            {"id": "benchmark", "label": "DJIA", "nav": _round_list(bench)},
        ],
    }


def cadence_bars() -> dict[str, Any]:
    """Biweekly vs weekly, SW Long >0.0 book: ann turnover (×) and ann cost (%)."""
    biweekly = json.loads(
        (FINTEL / "runs" / BIWEEKLY_JOB / "report" / f"{BIWEEKLY_WINDOW_STEM}.json").read_text()
    )
    weekly = json.loads(
        (FINTEL / "runs" / WEEKLY_JOB / "report" / "report.json").read_text()
    )
    bm = biweekly["holdings"]["metrics"]["sw_0.0"]
    wm = weekly["holdings"]["metrics"]["sw_0.0"]
    return {
        "cadences": [
            {"id": "biweekly", "label": "Biweekly",
             "period": f"{biweekly['decision_dates'][0]} → {biweekly['decision_dates'][-1]}"},
            {"id": "weekly", "label": "Weekly",
             "period": f"{weekly['decision_dates'][0]} → {weekly['decision_dates'][-1]}"},
        ],
        "metrics": [
            {
                "id": "ann_turnover",
                "label": "Ann turnover (×)",
                "values": {"biweekly": round(float(bm["ann_turn"]), 2),
                           "weekly": round(float(wm["ann_turn"]), 2)},
            },
            {
                "id": "ann_cost",
                "label": "Ann trading cost (%)",
                "values": {"biweekly": round(float(bm["ann_cost"]) * 100, 3),
                           "weekly": round(float(wm["ann_cost"]) * 100, 3)},
            },
        ],
    }


def stochasticity() -> dict[str, Any]:
    """JPM raw score across 3 repeats of openclaw (agent_v1_memory).

    Same agent, same prompt, same point-in-time inputs — the divergences
    (different scores, even different signs) are the stochasticity we
    control for via ensembling.
    """
    run_dir = DELOREAN_OPENCLAW_RUN
    # decision dates are shared across repeats; read them from r1.
    dates = sorted(
        p.stem for p in (run_dir / "r1" / "decisions").glob("*.json")
    )
    out_series: list[dict[str, Any]] = []
    for i, r in enumerate(["r1", "r2", "r3"], start=1):
        scores: list[float | None] = []
        for dt in dates:
            d = json.loads((run_dir / r / "decisions" / f"{dt}.json").read_text())
            v = (d.get("agent_response") or {}).get("views", {}).get(
                STOCHASTICITY_SYMBOL
            )
            scores.append(float(v["score"]) if v else None)
        out_series.append(
            {
                "id": f"r{i}",
                "label": f"Repeat {i}",
                "color": STOCHASTICITY_SHADES[r],
                "score": scores,
            }
        )
    return {"dates": dates, "series": out_series}


def main() -> None:
    leaderboard = json.loads((ROOT / "src" / "data" / "leaderboard.json").read_text())
    payload = {
        "meta": {
            "sources": {
                "vary_model": "site/src/data/leaderboard.json (minimal harness rows)",
                "vary_harness": "site/src/data/leaderboard.json (mimo-v2.5-pro rows)",
                "vary_strategy": f"fintel runs {BIWEEKLY_JOB} [{BIWEEKLY_WINDOW_STEM}] & {ALPHAVIEW_JOB} sw_0.0 book",
                "stochasticity": f"delorean agent_v1_memory r1/r2/r3, {STOCHASTICITY_SYMBOL} raw score (openclaw)",
                "biweekly_performance": f"fintel runs {BIWEEKLY_JOB} [{BIWEEKLY_WINDOW_STEM}] sw_0.0 / sw_0.3 / pw",
                "cadence_bars": f"fintel runs {BIWEEKLY_JOB} [{BIWEEKLY_WINDOW_STEM}] & {WEEKLY_JOB} sw_0.0 metrics",
            },
            "window": "challenge: 2022-07 → 2026-04 (quarterly) · biweekly same-period: 2026-01-02 → 2026-08-14",
            "note": "Labels on vary-model / vary-harness are intentionally masked for the public site.",
        },
        "varyModel": vary_model(leaderboard),
        "varyHarness": vary_harness(leaderboard),
        "varyStrategy": vary_strategy(),
        "stochasticity": stochasticity(),
        "biweeklyPerformance": biweekly_performance(),
        "cadenceBars": cadence_bars(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT}")
    for k, v in payload.items():
        if isinstance(v, dict) and "series" in v:
            print(f"  {k}: {len(v['series'])} series × {len(v.get('dates', []))} dates")


if __name__ == "__main__":
    main()
