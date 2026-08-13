#!/usr/bin/env python3
"""Extract geopol-full-0001 run data into a JSON file for the site report.

Produces: site/src/content/blogs/geopol-trade-war-2018/geopol-full-0001.json
"""
import json
import glob
from pathlib import Path

RUN_ROOT = Path(__file__).resolve().parents[2] / "runs" / "geopol-full-0001"
OUTCOMES = Path(__file__).resolve().parents[2] / "packages" / "geopol_trade_war_2018" / "outcomes.json"
SITE_DATA = Path(__file__).resolve().parent.parent / "src" / "content" / "blogs" / "geopol-trade-war-2018" / "geopol-full-0001.json"


def extract_cell(run_idx: int, date: str, cell_name: str) -> dict:
    cell_file = RUN_ROOT / f"r{run_idx}" / "trials" / date / "cells" / f"{cell_name}.json"
    if not cell_file.is_file():
        return {}
    d = json.loads(cell_file.read_text())
    view = d.get("views", {}).get(cell_name, {})
    # access.jsonl for tool call / search data
    access = RUN_ROOT / f"r{run_idx}" / "sessions" / f"geopol-full-0001-r{run_idx}" / date / cell_name / "access.jsonl"
    reads: list[str] = []
    searches: list[str] = []
    if access.is_file():
        for line in access.read_text().splitlines():
            if not line.strip():
                continue
            e = json.loads(line)
            if e.get("event") == "read":
                kind = e.get("kind", "")
                reads.append(kind)
                if kind == "web_search":
                    q = e.get("query", {}).get("query", "")
                    if q:
                        searches.append(q)
    return {
        "threat_score": view.get("threat_score"),
        "action_score": view.get("action_score"),
        "action_level": view.get("action_level"),
        "score": view.get("score"),
        "rationale": view.get("rationale", ""),
        "key_factors": view.get("key_factors", []),
        "sources_cited": view.get("sources_cited", []),
        "n_reads": len(reads),
        "n_searches": len(searches),
        "search_queries": searches,
        "read_kinds": {k: reads.count(k) for k in sorted(set(reads))},
        "elapsed_ms": d.get("elapsed_ms", 0),
    }


def main() -> None:
    runs: dict[str, dict] = {}
    for r in (1, 2, 3):
        run_data: dict[str, dict] = {"dates": {}}
        for cell_file in sorted(glob.glob(str(RUN_ROOT / f"r{r}" / "trials" / "*" / "cells" / "*.json"))):
            d = json.loads(Path(cell_file).read_text())
            date = d["decision_date"]
            cell_name = d["cell"]
            if date not in run_data["dates"]:
                run_data["dates"][date] = {}
            run_data["dates"][date][cell_name] = extract_cell(r, date, cell_name)
        runs[f"r{r}"] = run_data

    outcomes = json.loads(OUTCOMES.read_text())["outcomes"]

    SITE_DATA.parent.mkdir(parents=True, exist_ok=True)
    SITE_DATA.write_text(json.dumps({"runs": runs, "outcomes": outcomes}, indent=2))
    print(f"wrote {SITE_DATA}")
    # quick sanity
    for rk, rv in runs.items():
        n = len(rv["dates"])
        print(f"  {rk}: {n} dates")


if __name__ == "__main__":
    main()
