import pytest
import pandas as pd
from collections import Counter
from utils.calculations import (
    parse_complex_formula, 
    get_molecular_weight, 
    calculate_oxide_mode,
    identify_mineral
)

@pytest.fixture
def atomic_weights():
    return {
        'Mg': 24.305,
        'Si': 28.085,
        'O': 15.999,
        'Al': 26.982,
        'Ca': 40.078,
        'Fe': 55.845,
        'Na': 22.990,
        'K': 39.098,
        'Ti': 47.867,
        'H': 1.008
    }

def test_parse_complex_formula():
    # Basic
    assert parse_complex_formula("Al2O3") == Counter({'Al': 2, 'O': 3})
    # Parentheses
    assert parse_complex_formula("Mg3(BO3)2") == Counter({'Mg': 3, 'B': 2, 'O': 6})
    # Nested/Complex
    # Epidote: Ca2Al2Fe(Si2O7)(SiO4)O(OH)
    # Ca: 2, Al: 2, Fe: 1, Si: 2+1=3, O: 7+4+1+1=13, H: 1
    res = parse_complex_formula("Ca2Al2Fe(Si2O7)(SiO4)O(OH)")
    assert res['Ca'] == 2
    assert res['Al'] == 2
    assert res['Fe'] == 1
    assert res['Si'] == 3
    assert res['O'] == 13
    assert res['H'] == 1
    
    # Mixed sites (handled by stripping comma)
    # (Mg, Fe)2SiO4 -> Mg2Fe2Si1O4 ? No, the parser treats comma as separator but sums counts.
    # Actually, the parser I wrote: m = re.match(r'^([A-Z][a-z]*)(\d+(\.\d+)?)?', f[i:])
    # For (Mg, Fe)2SiO4:
    # inner "Mg,Fe" -> Mg:1, Fe:1
    # multiplier 2 -> Mg:2, Fe:2
    # This is fine for "matching" purposes where we just want to see if these cations exist.
    res_olivine = parse_complex_formula("(Mg,Fe)2SiO4")
    assert res_olivine['Mg'] == 2
    assert res_olivine['Fe'] == 2
    assert res_olivine['Si'] == 1

def test_get_molecular_weight(atomic_weights):
    mw = get_molecular_weight("Mg2SiO4", atomic_weights)
    expected = 24.305 * 2 + 28.085 + 15.999 * 4
    assert mw == pytest.approx(expected)

def test_identify_mineral_new_format(atomic_weights):
    # Mock DB
    db_data = [
        {'鉱物名': '苦土かんらん石', '英語': 'forsterite', '化学組成': 'Mg2SiO4'},
        {'鉱物名': '鉄かんらん石', '英語': 'fayalite', '化学組成': 'Fe2SiO4'},
        {'鉱物名': '石英', '英語': 'quartz', '化学組成': 'SiO2'}
    ]
    mineral_db = pd.DataFrame(db_data)
    
    # Input for Forsterite
    # Mg: 2, Si: 1
    input_results = pd.DataFrame([
        {'Item': 'MgO', 'Atomic Ratio': 2.0},
        {'Item': 'SiO2', 'Atomic Ratio': 1.0}
    ])
    
    candidates = identify_mineral(input_results, mineral_db)
    assert "forsterite" in candidates[0][0].lower()
    assert candidates[0][1] < 1e-5 # Perfect match
