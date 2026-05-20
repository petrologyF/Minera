import pandas as pd
import re
from typing import Dict, List, Tuple
from collections import Counter

def parse_complex_formula(formula: str) -> Counter:
    """
    Recursively parses a chemical formula including parentheses and multipliers.
    Handles basic formulas, parentheses, and multipliers.
    Mixed sites like (Mg, Fe) are treated as individual components.
    """
    # Remove water of hydration and other additives
    formula = formula.split('·')[0].split('・')[0].replace(' ', '')
    
    def parse_part(f: str) -> Counter:
        res = Counter()
        i = 0
        while i < len(f):
            if f[i] == '(':
                # Find matching parenthesis
                count_open = 1
                j = i + 1
                while j < len(f) and count_open > 0:
                    if f[j] == '(': count_open += 1
                    elif f[j] == ')': count_open -= 1
                    j += 1
                
                inner = parse_part(f[i+1:j-1])
                i = j
                # Find multiplier
                m = re.match(r'^(\d+(\.\d+)?)', f[i:])
                mult = 1.0
                if m:
                    mult = float(m.group(1))
                    i += len(m.group(1))
                
                for k, v in inner.items():
                    res[k] += v * mult
            elif f[i] in [',', '-', 'x']: # Basic handling of mixed sites, non-stoichiometry
                i += 1
                continue
            else:
                m = re.match(r'^([A-Z][a-z]*)(\d+(\.\d+)?)?', f[i:])
                if m:
                    sym = m.group(1)
                    count_str = m.group(2)
                    count = float(count_str) if count_str else 1.0
                    res[sym] += count
                    i += len(m.group(0))
                else:
                    i += 1
        return res

    return parse_part(formula)

def get_molecular_weight(formula: str, atomic_weights: Dict[str, float]) -> float:
    """
    Calculates the molecular weight of a given formula.
    """
    counts = parse_complex_formula(formula)
    mw = 0.0
    for symbol, count in counts.items():
        if symbol not in atomic_weights:
            # For identification/DB purposes, some formulas might have unknown symbols (e.g., OH, F)
            # We return 0 or a very large number, but for calculation we should error.
            if symbol in ['OH', 'F', 'Cl']: # Common additions
                continue 
            raise ValueError(f"Unknown element in formula '{formula}': {symbol}")
        mw += atomic_weights[symbol] * count
    return mw

# Default valences for common rock-forming elements to support O-normalization from elemental data
DEFAULT_VALENCES = {
    'Si': 4, 'Ti': 4, 'Al': 3, 'Fe': 2, 'Mn': 2, 'Mg': 2, 'Ca': 2, 'Na': 1, 'K': 1,
    'Cr': 3, 'Ni': 2, 'Zn': 2, 'Cu': 2, 'P': 5, 'S': 6
}

def calculate_element_mode(df_input: pd.DataFrame, atomic_weights: Dict[str, float], target_oxygen: float = None) -> pd.DataFrame:
    """
    Performs calculations for element analysis mode.
    If target_oxygen is provided, performs O-normalization based on assumed valences.
    """
    df = df_input.copy()
    df['Atomic Weight'] = df['Item'].map(atomic_weights)
    df['Atomic Proportion'] = df['wt%'] / df['Atomic Weight']
    
    if target_oxygen is not None:
        # Calculate theoretical oxygen proportion: sum(atomic_prop * valence / 2)
        oxygen_props = []
        for _, row in df.iterrows():
            valence = DEFAULT_VALENCES.get(row['Item'], 2) # Default to 2 if unknown
            oxygen_props.append(row['Atomic Proportion'] * (valence / 2.0))
        
        df['Oxygen Proportion'] = oxygen_props
        total_o_prop = df['Oxygen Proportion'].sum()
        
        norm_factor = target_oxygen / total_o_prop if total_o_prop > 0 else 0.0
        df['Atomic Ratio'] = df['Atomic Proportion'] * norm_factor
    else:
        df['Atomic Ratio'] = df['Atomic Proportion']
        
    return df

def calculate_oxide_mode(df_input: pd.DataFrame, atomic_weights: Dict[str, float], target_oxygen: float) -> pd.DataFrame:
    """
    Performs calculations for oxide analysis mode.
    """
    df = df_input.copy()
    
    mw_list = []
    cation_counts = []
    oxygen_counts = []
    
    for oxide in df['Item']:
        mw = get_molecular_weight(oxide, atomic_weights)
        mw_list.append(mw)
        
        counts = parse_complex_formula(oxide)
        o_count = counts.pop('O', 0)
        c_count = sum(counts.values()) # Total cations
        
        cation_counts.append(c_count)
        oxygen_counts.append(o_count)
        
    df['Molecular Weight'] = mw_list
    df['Molecular Proportion'] = df['wt%'] / df['Molecular Weight']
    df['Cation Proportion'] = df['Molecular Proportion'] * pd.Series(cation_counts, index=df.index)
    df['Oxygen Proportion'] = df['Molecular Proportion'] * pd.Series(oxygen_counts, index=df.index)
    
    total_oxygen_prop = df['Oxygen Proportion'].sum()
    norm_factor = target_oxygen / total_oxygen_prop if total_oxygen_prop > 0 else 0.0
    df['Atomic Ratio'] = df['Cation Proportion'] * norm_factor
    
    return df

# Standard Cation Priority for Mineral Formulas
# Large Cations (A-site) -> Medium (M-site) -> Small (T-site)
CATION_ORDER = {
    'K': 10, 'Na': 20, 'Ca': 30, 'Ba': 40, 'Sr': 50,
    'Mg': 60, 'Fe': 70, 'Mn': 80, 'Ti': 90,
    'Al': 100, 'Cr': 110,
    'Si': 120, 'P': 130, 'S': 140
}

def generate_empirical_formula(df: pd.DataFrame, target_oxygen: float = None) -> str:
    """
    Generates a mineralogical empirical formula following standard cation ordering.
    A-site (K, Na, Ca) -> M-site (Mg, Fe, Mn, Ti) -> T-site (Al, Si).
    """
    cation_data = []
    for _, row in df.iterrows():
        item = row['Item']
        ratio = row['Atomic Ratio']
        
        # Extract main cation symbol
        m = re.match(r'([A-Z][a-z]*)', item)
        cation = m.group(1) if m else item
        
        if ratio > 0.001:
            priority = CATION_ORDER.get(cation, 999) # Unknowns at the end
            cation_data.append((priority, cation, ratio))
    
    # Sort by priority
    cation_data.sort()
    
    parts = []
    for _, cation, ratio in cation_data:
        # Format ratio: omit 1.00 if very close to 1, or use 2 decimal places
        if abs(ratio - 1.0) < 0.005:
            parts.append(cation)
        else:
            parts.append(f"{cation}{ratio:.2f}")
            
    formula = "".join(parts)
    
    # Add Oxygen if provided (oxide mode)
    if target_oxygen is not None:
        if abs(target_oxygen - round(target_oxygen)) < 0.001:
            formula += f"O{int(target_oxygen)}"
        else:
            formula += f"O{target_oxygen:.1f}"
            
    return formula

def identify_mineral(df: pd.DataFrame, mineral_db: pd.DataFrame) -> List[Tuple[str, float]]:
    """
    Identifies the closest mineral from the database based on Atomic Ratios.
    Handles the new DB format with '化学組成' strings.
    """
    calc_ratios = {}
    for _, row in df.iterrows():
        item = row['Item']
        ratio = row['Atomic Ratio']
        m = re.match(r'([A-Z][a-z]*)', item)
        cation = m.group(1) if m else item
        calc_ratios[cation] = ratio
        
    results = []
    for _, row in mineral_db.iterrows():
        formula_str = str(row['化学組成'])
        db_counts = parse_complex_formula(formula_str)
        # Match only common cations found in calculation
        db_cations = {k: v for k, v in db_counts.items() if k not in ['O', 'H', 'C', 'S', 'Cl', 'F']}
        
        score = 0.0
        # Compare based on relative proportions if possible, or simple sum of squares
        # Here we use sum of squares on cations present in the input
        all_cations = set(calc_ratios.keys()) | set(db_cations.keys())
        
        for cation in all_cations:
            calc_val = calc_ratios.get(cation, 0.0)
            db_val = db_cations.get(cation, 0.0)
            score += (db_val - calc_val) ** 2
            
        name = f"{row['鉱物名']} ({row['英語']})"
        results.append((name, score))
        
    results.sort(key=lambda x: x[1])
    return results
