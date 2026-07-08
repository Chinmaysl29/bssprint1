import sqlite3
from pathlib import Path

from PIL import Image, ImageStat

from src.analytics.peer import (
    calculate_yearly_peer_percentiles,
    generate_report_radar_chart,
    get_company_peer_group,
    get_database_path,
    load_peer_groups,
    save_to_database,
)


def test_peer_groups_loading():
    peer_groups = load_peer_groups()

    assert not peer_groups.empty
    assert {"company_id", "group_name", "is_primary"}.issubset(peer_groups.columns)


def test_11_groups_exist():
    peer_groups = load_peer_groups()

    assert peer_groups["group_name"].nunique() == 11


def test_percentile_calculation():
    percentiles = calculate_yearly_peer_percentiles()

    assert not percentiles.empty
    assert {"company_id", "peer_group_name", "metric", "value", "percentile_rank", "year"}.issubset(
        percentiles.columns
    )
    assert percentiles["percentile_rank"].between(0, 100).all()


def test_de_inverse_works():
    percentiles = calculate_yearly_peer_percentiles()
    de_rows = percentiles[percentiles["metric"] == "D/E"]

    assert not de_rows.empty
    for _, group in de_rows.groupby(["peer_group_name", "year"]):
        if group["value"].nunique() < 2:
            continue
        lowest_de = group.loc[group["value"].idxmin()]
        highest_de = group.loc[group["value"].idxmax()]
        assert lowest_de["percentile_rank"] > highest_de["percentile_rank"]
        return

    raise AssertionError("No D/E peer/year group with varied values found")


def test_database_insert_works():
    saved = save_to_database()
    conn = sqlite3.connect(get_database_path())
    try:
        row_count = conn.execute("SELECT COUNT(*) FROM peer_percentiles").fetchone()[0]
        columns = [row[1] for row in conn.execute("PRAGMA table_info(peer_percentiles)").fetchall()]
    finally:
        conn.close()

    assert row_count == len(saved)
    assert columns == ["company_id", "peer_group_name", "metric", "value", "percentile_rank", "year"]


def test_missing_peer_handling():
    assert get_company_peer_group("ABB") is None


def test_radar_chart_creation(tmp_path):
    assigned_chart = Path(generate_report_radar_chart("TCS", output_dir=str(tmp_path)))
    standalone_chart = Path(generate_report_radar_chart("ABB", output_dir=str(tmp_path)))

    for chart in [assigned_chart, standalone_chart]:
        assert chart.exists()
        assert chart.stat().st_size > 10_000
        image = Image.open(chart).convert("RGB")
        assert max(ImageStat.Stat(image).stddev) > 5
