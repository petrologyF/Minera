import { CalculationResult, MineralData, OxideCalculationRow, ElementCalculationRow, IdentificationCandidate } from "./types";

/**
 * Parses a complex mineral formula into element counts.
 * Handles:
 * - Nested parentheses: Mg3(Al,Fe)2(SiO4)3
 * - Hydration dots: CaSO4·2H2O, FeO(OH)·nH2O
 * - Variables/solid solutions: Fe1-xS, (Mg,Fe)2SiO4
 */
export function parseComplexFormula(formula: string): Record<string, number> {
  const parts = formula.replace(/\s/g, "").split(/[·・]/);
  const totalRes: Record<string, number> = {};

  function parsePart(f: string): Record<string, number> {
    const res: Record<string, number> = {};
    let i = 0;

    while (i < f.length) {
      if (f[i] === "(") {
        let countOpen = 1;
        let j = i + 1;
        while (j < f.length && countOpen > 0) {
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
      } else if (f[i] === "," || f[i] === "-" || /[x-z]/.test(f[i])) {
        // Skip variables (x, y, z) and commas in solid solutions
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

  parts.forEach((part, index) => {
    let mult = 1.0;
    let formulaPart = part;
    
    if (index > 0) {
      // Check for leading coefficient in hydration parts like 2H2O or nH2O
      const match = part.match(/^(\d+(\.\d+)?|n)/);
      if (match) {
        if (match[1] === 'n') {
          mult = 1.0; // Treat 'n' as 1 for nominal MW calculation
        } else {
          mult = parseFloat(match[1]);
        }
        formulaPart = part.substring(match[0].length);
      }
    }
    
    const partRes = parsePart(formulaPart);
    for (const [k, v] of Object.entries(partRes)) {
      totalRes[k] = (totalRes[k] || 0) + v * mult;
    }
  });

  return totalRes;
}

export function getMolecularWeight(formula: string, atomicWeights: Record<string, number>): number {
  const counts = parseComplexFormula(formula);
  let mw = 0.0;
  for (const [symbol, count] of Object.entries(counts)) {
    if (!(symbol in atomicWeights)) {
      // Common polyatomic groups or elements not in main table
      if (["OH", "F", "Cl", "S", "C", "P", "B", "W", "V", "As", "Sb"].includes(symbol)) {
        // If it's a known group like OH, it should have been parsed into O and H
        // If it's still here, we might need its weight if not in atomicWeights
        continue; 
      }
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
    mode: "stoichiometric-oxygen" | "element-ratio" | "total-anions";
    targetValue: number;
    targetElement?: string;
  }
): ElementCalculationRow[] {
  const results: ElementCalculationRow[] = input.map(row => {
    const weight = atomicWeights[row.Item] || 0;
    const prop = weight > 0 ? row["wt%"] / weight : 0;
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
  } else if (normalization.mode === "total-anions") {
    let totalAnionProp = 0;
    results.forEach(res => {
      const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
      const priority = CATION_ORDER[symbol] || 0;
      if (priority >= 1000) {
        totalAnionProp += res["Atomic Proportion"] || 0;
      }
    });

    const normFactor = totalAnionProp > 0 ? normalization.targetValue / totalAnionProp : 0;
    results.forEach(res => {
      res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * normFactor;
    });
  }

  return results;
}

export function calculateOxideMode(
  input: { Item: string; "wt%": number }[],
  atomicWeights: Record<string, number>,
  targetOxygen: number,
  idealCations?: number
): OxideCalculationRow[] {
  let results: OxideCalculationRow[] = input.map(row => {
    const mw = getMolecularWeight(row.Item, atomicWeights);
    const molProp = mw > 0 ? row["wt%"] / mw : 0;
    
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

  if (idealCations && idealCations > 0) {
    const currentCationSum = results.reduce((sum, res) => sum + res["Atomic Ratio"], 0);
    
    if (currentCationSum > idealCations) {
      const fe3Atoms = 2 * targetOxygen * (1 - idealCations / currentCationSum);
      const feIndex = results.findIndex(res => res.Item.includes("Fe"));
      
      if (feIndex !== -1) {
        const totalFeAtoms = results[feIndex]["Atomic Ratio"];
        const cappedFe3 = Math.min(fe3Atoms, totalFeAtoms);
        const fe2Atoms = totalFeAtoms - cappedFe3;

        const feRow = results[feIndex];
        const newResults = [...results];
        
        newResults.splice(feIndex, 1, 
          {
            ...feRow,
            Item: "FeO (est.)",
            "Atomic Ratio": fe2Atoms
          },
          {
            ...feRow,
            Item: "Fe2O3 (est.)",
            "Atomic Ratio": cappedFe3,
            "Cation Proportion": 0, 
            "Oxygen Proportion": 0
          }
        );
        results = newResults;
      }
    }
  }

  return results;
}

export const CATION_ORDER: Record<string, number> = {
  Cs: 10, Rb: 20, K: 30, Na: 40, Li: 50,
  Ba: 60, Sr: 70, Ca: 80,
  La: 100, Ce: 110, Pr: 120, Nd: 130, Sm: 140, Eu: 150, Gd: 160,
  Mg: 200, Fe: 210, Mn: 220, Ni: 230, Co: 240, Zn: 250, Cu: 260,
  Al: 300, Cr: 310, V: 320, Sc: 330,
  Ti: 340, Zr: 350, Sn: 360,
  Si: 400, P: 410, B: 430,
  O: 1000, F: 1010, Cl: 1020, OH: 1030, S: 1040,
  As: 1050, Sb: 1060, Se: 1070, Te: 1080
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
      let symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
      
      if (res.Item === "FeO (est.)") symbol = "Fe²⁺";
      if (res.Item === "Fe2O3 (est.)") symbol = "Fe³⁺";
      
      const prioritySymbol = symbol.startsWith("Fe") ? "Fe" : symbol;
      const priority = CATION_ORDER[prioritySymbol] || 999;
      const isAnion = priority >= 1000;
      elementsData.push({ priority, symbol, ratio, isAnion });
    }
  });

  elementsData.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.symbol.localeCompare(b.symbol);
  });

  const formatRatio = (num: number) => {
    if (Math.abs(num - Math.round(num)) < 0.00001) {
      const intVal = Math.round(num);
      return intVal === 1 ? "" : intVal.toString();
    }
    let formatted = num.toPrecision(4);
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

  if (options?.mode === "oxide") {
    if (options.targetOxygen !== undefined) {
      const roundedO = Math.round(options.targetOxygen * 100) / 100;
      formula += `O${roundedO === 1 ? "" : roundedO}`;
    }
  } else {
    const oRes = elementsData.find(e => e.symbol === "O");
    if (oRes) {
      formula += `O${formatRatio(oRes.ratio)}`;
    } else if (options?.normalizationMode === "stoichiometric-oxygen" && options.targetOxygen !== undefined) {
      const roundedO = Math.round(options.targetOxygen * 100) / 100;
      formula += `O${roundedO === 1 ? "" : roundedO}`;
    }
  }

  return formula;
}

export function identifyMineral(results: CalculationResult[], mineralDb: MineralData[]): IdentificationCandidate[] {
  const EXCLUDED_FOR_COMPARE = ["O", "H"];
  
  const calcRatios: Record<string, number> = {};
  results.forEach(res => {
    const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
    if (!EXCLUDED_FOR_COMPARE.includes(symbol)) {
      calcRatios[symbol] = res["Atomic Ratio"];
    }
  });

  const scores: IdentificationCandidate[] = mineralDb.map(mineral => {
    const dbCounts = mineral.parsedFormula || parseComplexFormula(mineral.formula);
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
      nameEN: mineral.nameEN,
      category: mineral.category,
      formula: mineral.formula,
      score
    };
  });

  return scores.sort((a, b) => a.score - b.score);
}

/**
 * Pre-parses the mineral database to populate 'parsedFormula' field.
 */
export function preParseMineralDb(mineralDb: MineralData[]): MineralData[] {
  return mineralDb.map(mineral => ({
    ...mineral,
    parsedFormula: parseComplexFormula(mineral.formula)
  }));
}
