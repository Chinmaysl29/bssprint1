import sys
from pathlib import Path

import streamlit as st

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

PAGES_DIR = PROJECT_ROOT / "pages"

st.set_page_config(
    page_title="Nifty 100 Analytics",
    layout="wide",
    initial_sidebar_state="expanded",
)

navigation = st.navigation(
    [
        st.Page(str(PAGES_DIR / "01_home.py"), title="Home", icon="🏠", default=True),
        st.Page(str(PAGES_DIR / "02_profile.py"), title="Company Profile", icon="🏢"),
        st.Page(str(PAGES_DIR / "03_screener.py"), title="Screener", icon="🔎"),
        st.Page(str(PAGES_DIR / "04_peers.py"), title="Peer Comparison", icon="👥"),
        st.Page(str(PAGES_DIR / "05_trends.py"), title="Trend Analysis", icon="📈"),
        st.Page(str(PAGES_DIR / "06_sectors.py"), title="Sector Analysis", icon="📊"),
        st.Page(str(PAGES_DIR / "07_capital.py"), title="Capital Allocation", icon="🌳"),
        st.Page(str(PAGES_DIR / "08_reports.py"), title="Annual Reports", icon="📄"),
    ]
)

navigation.run()
