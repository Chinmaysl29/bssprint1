from src.analytics.peer import generate_radar_chart, get_company_peer_group


def test_missing_peer_group_returns_message():
    assert get_company_peer_group("ABB") is None
    assert generate_radar_chart("ABB") == "No peer group assigned"


def test_assigned_peer_group_resolves():
    assert get_company_peer_group("TCS") == "IT Services"
