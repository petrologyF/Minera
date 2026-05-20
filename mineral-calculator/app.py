import streamlit as st
import pandas as pd
import os
from utils.calculations import (
    calculate_element_mode,
    calculate_oxide_mode,
    generate_empirical_formula,
    identify_mineral
)

st.set_page_config(page_title="Mineral Naming & Formula Calculator", layout="wide")

def to_subscript(text: str) -> str:
    """Converts numbers in string to Unicode subscripts."""
    subscripts = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")
    return text.translate(subscripts)

# Notion-style Light Mode CSS
st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

    /* Global Styles */
    .stApp {{
        background-color: #FFFFFF;
        color: #37352F;
        font-family: 'Inter', sans-serif;
    }}

    /* Sidebar Styling - Force high contrast */
    [data-testid="stSidebar"] {{
        background-color: #F7F6F3;
        border-right: 1px solid #EDECE9;
    }}
    [data-testid="stSidebar"] * {{
        color: #37352F !important;
    }}
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {{
        font-weight: 600 !important;
    }}

    /* Typography */
    h1, h2, h3, .stMarkdown, p {{
        color: #37352F !important;
        font-family: 'Inter', sans-serif !important;
    }}

    /* Periodic Table Buttons */
    .stButton>button {{
        border-radius: 4px !important;
        border: 1px solid #EDECE9 !important;
        background-color: #FFFFFF !important;
        color: #37352F !important;
        padding: 0 !important;
        height: 38px !important;
        min-height: 38px !important;
        font-size: 0.75rem !important;
        transition: all 0.2s ease;
        white-space: nowrap !important;
        overflow: hidden !important;
    }}
    .stButton>button:hover {{
        background-color: #F7F6F3 !important;
        border-color: #D3D2D1 !important;
    }}
    /* Primary buttons (selected elements) */
    .stButton>button[kind="primary"] {{
        background-color: #EB5757 !important;
        color: #FFFFFF !important;
        border-color: #EB5757 !important;
    }}

    /* Grid Spacer */
    .grid-spacer {{
        height: 38px;
        margin-bottom: 12px;
    }}

    /* Data Editor & Tables */
    [data-testid="stDataFrame"] {{
        background-color: #FFFFFF !important;
    }}
    .stDataEditor {{
        border: 1px solid #EDECE9 !important;
        border-radius: 4px !important;
    }}

    /* Hide Streamlit components for pure app feel */
    #MainMenu {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    header {{visibility: hidden;}}
    </style>
""", unsafe_allow_html=True)

st.title("Mineral Naming & Formula Calculator")
st.markdown("Input wt% data to derive chemical formulas and identify minerals.")

# Load Data
@st.cache_data
def load_atomic_weights():
    df = pd.read_csv("data/atomic_weights.csv")
    df['AtomicWeight'] = df['AtomicWeight'].astype(str).str.replace(r'[\(\)]', '', regex=True).astype(float)
    return dict(zip(df['Symbol'], df['AtomicWeight']))

@st.cache_data
def load_mineral_db():
    return pd.read_csv("data/mineral_db.csv")

atomic_weights = load_atomic_weights()
mineral_db = load_mineral_db()

# Sidebar Settings
st.sidebar.header("Calculation Settings")
mode = st.sidebar.radio("Analysis Mode", ["Oxide", "Element"])
target_oxygen = st.sidebar.number_input("Normalization Oxygen Count (n)", min_value=1.0, value=4.0, step=1.0)

# Periodic Table Data
ELEMENTS_GRID = [
    ("H", 1, 1), ("He", 1, 18),
    ("Li", 2, 1), ("Be", 2, 2), ("B", 2, 13), ("C", 2, 14), ("N", 2, 15), ("O", 2, 16), ("F", 2, 17), ("Ne", 2, 18),
    ("Na", 3, 1), ("Mg", 3, 2), ("Al", 3, 13), ("Si", 3, 14), ("P", 3, 15), ("S", 3, 16), ("Cl", 3, 17), ("Ar", 3, 18),
    ("K", 4, 1), ("Ca", 4, 2), ("Sc", 4, 3), ("Ti", 4, 4), ("V", 4, 5), ("Cr", 4, 6), ("Mn", 4, 7), ("Fe", 4, 8), ("Co", 4, 9), ("Ni", 4, 10), ("Cu", 4, 11), ("Zn", 4, 12), ("Ga", 4, 13), ("Ge", 4, 14), ("As", 4, 15), ("Se", 4, 16), ("Br", 4, 17), ("Kr", 4, 18),
    ("Rb", 5, 1), ("Sr", 5, 2), ("Y", 5, 3), ("Zr", 5, 4), ("Nb", 5, 5), ("Mo", 5, 6), ("Tc", 5, 7), ("Ru", 5, 8), ("Rh", 5, 9), ("Pd", 5, 10), ("Ag", 5, 11), ("Cd", 5, 12), ("In", 5, 13), ("Sn", 5, 14), ("Sb", 5, 15), ("Te", 5, 16), ("I", 5, 17), ("Xe", 5, 18),
    ("Cs", 6, 1), ("Ba", 6, 2), ("Hf", 6, 4), ("Ta", 6, 5), ("W", 6, 6), ("Re", 6, 7), ("Os", 6, 8), ("Ir", 6, 9), ("Pt", 6, 10), ("Au", 6, 11), ("Hg", 6, 12), ("Tl", 6, 13), ("Pb", 6, 14), ("Bi", 6, 15), ("Po", 6, 16), ("At", 6, 17), ("Rn", 6, 18),
]

if 'selected_elements' not in st.session_state:
    st.session_state.selected_elements = set(["Si", "Ti", "Al", "Fe", "Mn", "Mg", "Ca", "Na", "K"])

def periodic_table_selector():
    st.subheader("Component Selection (Periodic Table)")

    oxide_map = {
        "Si": "SiO2", "Ti": "TiO2", "Al": "Al2O3", "Fe": "FeO", 
        "Mn": "MnO", "Mg": "MgO", "Ca": "CaO", "Na": "Na2O", "K": "K2O", "P": "P2O5"
    }

    grid_lookup = {(r, c): s for s, r, c in ELEMENTS_GRID}

    cols = st.columns(18)
    for c in range(1, 19):
        with cols[c-1]:
            for r in range(1, 7):
                symbol = grid_lookup.get((r, c))
                if symbol:
                    is_selected = symbol in st.session_state.selected_elements
                    display_name = oxide_map.get(symbol, symbol) if mode == "Oxide" else symbol
                    display_name = to_subscript(display_name)

                    btn_type = "primary" if is_selected else "secondary"
                    if st.button(display_name, key=f"btn_{symbol}", type=btn_type, use_container_width=True):
                        if is_selected:
                            st.session_state.selected_elements.remove(symbol)
                        else:
                            st.session_state.selected_elements.add(symbol)
                        st.rerun()
                else:
                    st.markdown("<div class='grid-spacer'></div>", unsafe_allow_html=True)

periodic_table_selector()

components = []
oxide_map_rev = {
    "Si": "SiO2", "Ti": "TiO2", "Al": "Al2O3", "Fe": "FeO", 
    "Mn": "MnO", "Mg": "MgO", "Ca": "CaO", "Na": "Na2O", "K": "K2O", "P": "P2O5"
}
for s in st.session_state.selected_elements:
    if mode == "Oxide":
        components.append(oxide_map_rev.get(s, s))
    else:
        components.append(s)

# Data Input
st.subheader("1. Input Weight Percent (wt%)")
input_df = pd.DataFrame({
    "Item": components,
    "wt%": [0.0] * len(components)
})

edited_df = st.data_editor(input_df, num_rows="dynamic", use_container_width=True)


# Validation
total_wt = edited_df["wt%"].sum()
st.info(f"Total wt%: {total_wt:.2f}")

if total_wt < 98.0 or total_wt > 102.0:
    st.warning(f"Warning: Total wt% ({total_wt:.2f}) is significantly far from 100%. Please check your input.")

# Calculation
if st.button("Calculate"):
    st.subheader("2. Calculation Results")
    
    try:
        if mode == "Oxide":
            results_df = calculate_oxide_mode(edited_df, atomic_weights, target_oxygen)
        else:
            results_df = calculate_element_mode(edited_df, atomic_weights, target_oxygen)
            
        st.dataframe(results_df, use_container_width=True)
        
        # Formula Derivation
        formula = generate_empirical_formula(results_df, target_oxyge