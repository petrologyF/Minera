import { CalculationResult, ElementData, MineralData } from "./types";

export function parseComplexFormula(formula: string): Record<string, number> {
  const cleanFormula = formula.split(/[·・]/)[0].replace(/\s/g, "");

  function parsePart(f: string): Record<string, number> {
    const res: Record<string, number> = {};
    let i = 0;

    while (i < len(f)) {
      if (f[i] === "(") {
        let countOpen = 1;
        let j = i + 1;
        while (j < len(f) && countOpen > 0) {
          if (f[j] === "(") countOpen++;
          else if (f[j] === ")") countOpen--;
          j++;
        }

        const inner = parsePart(f.substring(i + 1, j - 1));
        i = j;

        const match = f.substring(i).match(/^(\d+(\.\d+)?)/);
        let mult = 1.0;
        if (match) {
          mult = parseFloat(match[1]);
          i += match[1].length;
        }

        for (const [k, v] of Object.entries(inner)) {
          res[k] = (res[k] || 0) + v * mult;
        }
      } else if (f[i] === "," || f[i] === "-" || f[i] === "x") {
        i++;
        continue;
      } else {
        const match = f.substring(i).match(/^([A-Z][a-z]*)(\d+(\.\d+)?)?/);
        if (match) {
          const sym = match[1];
          const count = match[2] ? parseFloat(match[2]) : 1.0;
          res[sym] = (res[sym] || 0) + count;
          i += match[0].length;
        } else {
          i++;
        }
      }
    }
    return res;
  }

  function len(s: string) { return s.length; }

  return parsePart(cleanFormula);
}

export function getMolecularWeight(formula: string, atomicWeights: Record<string, number>): number {
  const counts = parseComplexFormula(formula);
  let mw = 0.0;
  for (const [symbol, count] of Object.entries(counts)) {
    if (!(symbol in atomicWeights)) {
      if (["OH", "F", "Cl"].includes(symbol)) continue;
      throw new Error(`Unknown element in formula '${formula}': ${symbol}`);
    }
    mw += atomicWeights[symbol] * count;
  }
  return mw;
}

export const DEFAULT_VALENCES: Record<string, number> = {
  Si: 4, Ti: 4, Al: 3, Fe: 2, Mn: 2, Mg: 2, Ca: 2, Na: 1, K: 1,
  Cr: 3, Ni: 2, Zn: 2, Cu: 2, P: 5, S: 6
};

export function calculateElementMode(
  input: { Item: string; "wt%": number }[],
  atomicWeights: Record<string, number>,
  normalization?: {
    mode: "stoichiometric-oxygen" | "element-ratio";
    targetValue: number;
    targetElement?: string;
  }
): CalculationResult[] {
  const results: CalculationResult[] = input.map(row => {
    const weight = atomicWeights[row.Item] || 0;
    const prop = row["wt%"] / weight;
    return {
      Item: row.Item,
      "wt%": row["wt%"],
      "Atomic Weight": weight,
      "Atomic Proportion": prop,
      "Atomic Ratio": prop // Default to raw prop
    };
  });

  if (!normalization) return results;

  if (normalization.mode === "stoichiometric-oxygen") {
    let totalOProp = 0;
    results.forEach(res => {
      const valence = DEFAULT_VALENCES[res.Item] || 2;
      const oProp = (res["Atomic Proportion"] || 0) * (valence / 2.0);
      res["Oxygen Proportion"] = oProp;
      totalOProp += oProp;
    });

    const normFactor = totalOProp > 0 ? normalization.targetValue / totalOProp : 0;
    results.forEach(res => {
      res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * normFactor;
    });
  } else if (normalization.mode === "element-ratio" && normalization.targetElement) {
    const targetRes = results.find(r => r.Item === normalization.targetElement);
    const targetProp = targetRes?.["Atomic Proportion"] || 0;
    const normFactor = targetProp > 0 ? normalization.targetValue / targetProp : 0;
    
    results.forEach(res => {
      res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * normFactor;
    });
  }

  return results;
}

export function calculateOxideMode(
  input: { Item: string; "wt%": number }[],
  atomicWeights: Record<string, number>,
  targetOxygen: number
): CalculationResult[] {
  const results: CalculationResult[] = input.map(row => {
    const mw = getMolecularWeight(row.Item, atomicWeights);
    const molProp = row["wt%"] / mw;
    
    const counts = parseComplexFormula(row.Item);
    const oCount = counts["O"] || 0;
    delete counts["O"];
    const cCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return {
      Item: row.Item,
      "wt%": row["wt%"],
      "Molecular Weight": mw,
      "Molecular Proportion": molProp,
      "Cation Proportion": molProp * cCount,
      "Oxygen Proportion": molProp * oCount,
      "Atomic Ratio": 0 // Placeholder
    };
  });

  const totalOxygenProp = results.reduce((sum, res) => sum + (res["Oxygen Proportion"] || 0), 0);
  const normFactor = totalOxygenProp > 0 ? targetOxygen / totalOxygenProp : 0;

  results.forEach(res => {
    res["Atomic Ratio"] = (res["Cation Proportion"] || 0) * normFactor;
  });

  return results;
}

// IUPAC/IMA standard ordering priorities for mineral formulas.
// Lower values = appears earlier in the formula.
// Grouping: Large Cations (A) -> Medium Cations (M) -> Network Formers (T) -> Anions
export const CATION_ORDER: Record<string, number> = {
  // 1. Alkali & Large Alkaline Earth Metals (Large/A-site)
  Cs: 10, Rb: 20, K: 30, Na: 40, Li: 50,
  Ba: 60, Sr: 70, Ca: 80,
  
  // 2. Rare Earth Elements (REE)
  La: 100, Ce: 110, Pr: 120, Nd: 130, Sm: 140, Eu: 150, Gd: 160,
  
  // 3. Medium Cations (Transition metals, Mg, etc. / M-site)
  Mg: 200, Fe: 210, Mn: 220, Ni: 230, Co: 240, Zn: 250, Cu: 260,
  // High-valence medium cations
  Al: 300, Cr: 310, V: 320, Sc: 330,
  Ti: 340, Zr: 350, Sn: 360,
  
  // 4. Small Cations (Network Formers / T-site)
  Si: 400, P: 410, B: 430,
  
  // 5. Anions
  O: 1000, F: 1010, Cl: 1020, OH: 1030, S: 1040 // S as anion (standard for sulfides)
};

export function generateEmpiricalFormula(
  results: CalculationResult[], 
  options?: {
    mode: "element" | "oxide";
    targetOxygen?: number;
    normalizationMode?: "stoichiometric-oxygen" | "element-ratio";
  }
): string {
  const elementsData: { priority: number; symbol: string; ratio: number; isAnion: boolean }[] = [];

  results.forEach(res => {
    const ratio = res["Atomic Ratio"];
    if (ratio > 0.0001) {
      const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
      const priority = CATION_ORDER[symbol] || 999;
      const isAnion = priority >= 1000;
      elementsData.push({ priority, symbol, ratio, isAnion });
    }
  });

  elementsData.sort((a, b) => a.priority - b.priority);

  const formatRatio = (num: number) => {
    // If it's effectively an integer (within a very tight tolerance), return as integer string
    if (Math.abs(num - Math.round(num)) < 0.00001) {
      const intVal = Math.round(num);
      return intVal === 1 ? "" : intVal.toString();
    }
    
    // Use 4 significant figures for scientific precision
    let formatted = num.toPrecision(4);
    
    // Remove trailing zeros after decimal point and the decimal point if not needed
    if (formatted.includes(".")) {
      formatted = formatted.replace(/\.?0+$/, "");
    }
    
    return formatted === "1" ? "" : formatted;
  };

  let formula = elementsData
    .filter(e => !e.isAnion)
    .map(e => `${e.symbol}${formatRatio(e.ratio)}`)
    .join("");

  const otherAnions = elementsData.filter(e => e.isAnion && e.symbol !== "O");
  otherAnions.forEach(a => {
    formula += `${a.symbol}${formatRatio(a.ratio)}`;
  });

  // Handle Oxygen
  if (options?.mode === "oxide") {
    // In oxide mode, O is always appended based on targetOxygen
    if (options.targetOxygen !== undefined) {
      const roundedO = Math.round(options.targetOxygen * 100) / 100;
      formula += `O${roundedO === 1 ? "" : roundedO}`;
    }
  } else {
    // In element mode, check if O is in the results
    const oRes = elementsData.find(e => e.symbol === "O");
    if (oRes) {
      formula += `O${formatRatio(oRes.ratio)}`;
    } else if (options?.normalizationMode === "stoichiometric-oxygen" && options.targetOxygen !== undefined) {
      // If O wasn't selected but we normalized by stoichiometric O
      const roundedO = Math.round(options.targetOxygen * 100) / 100;
      formula += `O${roundedO === 1 ? "" : roundedO}`;
    }
  }

  return formula;
}

export function identifyMineral(results: CalculationResult[], mineralDb: MineralData[]): { name: string; score: number }[] {
  const EXCLUDED_FOR_COMPARE = ["O", "H"];
  
  const calcRatios: Record<string, number> = {};
  results.forEach(res => {
    const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
    // Only compare non-volatile/non-oxygen elements to focus on cation/anion framework
    if (!EXCLUDED_FOR_COMPARE.includes(symbol)) {
      calcRatios[symbol] = res["Atomic Ratio"];
    }
  });

  const scores = mineralDb.map(mineral => {
    const dbCounts = parseComplexFormula(mineral.formula);
    const dbCompareProps: Record<string, number> = {};
    
    for (const [k, v] of Object.entries(dbCounts)) {
      if (!EXCLUDED_FOR_COMPARE.includes(k)) {
        dbCompareProps[k] = v;
      }
    }

    const allElements = new Set([...Object.keys(calcRatios), ...Object.keys(dbCompareProps)]);
    let score = 0;
    allElements.forEach(el => {
      const calcVal = calcRatios[el] || 0;
      const dbVal = dbCompareProps[el] || 0;
      score += Math.pow(dbVal - calcVal, 2);
    });

    return {
      name: `${mineral.nameJA} (${mineral.nameEN})`,
      score
    };
  });

  return scores.sort((a, b) => a.score - b.score);
}
