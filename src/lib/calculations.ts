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
  targetOxygen?: number
): CalculationResult[] {
  const results: CalculationResult[] = input.map(row => {
    const weight = atomicWeights[row.Item] || 0;
    const prop = row["wt%"] / weight;
    return {
      Item: row.Item,
      "wt%": row["wt%"],
      "Atomic Weight": weight,
      "Atomic Proportion": prop,
      "Atomic Ratio": prop // Initial
    };
  });

  if (targetOxygen !== undefined) {
    let totalOProp = 0;
    results.forEach(res => {
      const valence = DEFAULT_VALENCES[res.Item] || 2;
      const oProp = (res["Atomic Proportion"] || 0) * (valence / 2.0);
      res["Oxygen Proportion"] = oProp;
      totalOProp += oProp;
    });

    const normFactor = totalOProp > 0 ? targetOxygen / totalOProp : 0;
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

export const CATION_ORDER: Record<string, number> = {
  K: 10, Na: 20, Ca: 30, Ba: 40, Sr: 50,
  Mg: 60, Fe: 70, Mn: 80, Ti: 90,
  Al: 100, Cr: 110,
  Si: 120, P: 130, S: 140
};

export function generateEmpiricalFormula(results: CalculationResult[], targetOxygen?: number): string {
  const cationData: { priority: number; symbol: string; ratio: number }[] = [];

  results.forEach(res => {
    const ratio = res["Atomic Ratio"];
    if (ratio > 0.001) {
      const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
      const priority = CATION_ORDER[symbol] || 999;
      cationData.push({ priority, symbol, ratio });
    }
  });

  cationData.sort((a, b) => a.priority - b.priority);

  let formula = cationData.map(c => {
    if (Math.abs(c.ratio - 1.0) < 0.005) return c.symbol;
    return `${c.symbol}${c.ratio.toFixed(2)}`;
  }).join("");

  if (targetOxygen !== undefined) {
    if (Math.abs(targetOxygen - Math.round(targetOxygen)) < 0.001) {
      formula += `O${Math.round(targetOxygen)}`;
    } else {
      formula += `O${targetOxygen.toFixed(1)}`;
    }
  }

  return formula;
}

export function identifyMineral(results: CalculationResult[], mineralDb: MineralData[]): { name: string; score: number }[] {
  const calcRatios: Record<string, number> = {};
  results.forEach(res => {
    const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
    calcRatios[symbol] = res["Atomic Ratio"];
  });

  const scores = mineralDb.map(mineral => {
    const dbCounts = parseComplexFormula(mineral.formula);
    const dbCations: Record<string, number> = {};
    for (const [k, v] of Object.entries(dbCounts)) {
      if (!["O", "H", "C", "S", "Cl", "F"].includes(k)) {
        dbCations[k] = v;
      }
    }

    const allCations = new Set([...Object.keys(calcRatios), ...Object.keys(dbCations)]);
    let score = 0;
    allCations.forEach(cation => {
      const calcVal = calcRatios[cation] || 0;
      const dbVal = dbCations[cation] || 0;
      score += Math.pow(dbVal - calcVal, 2);
    });

    return {
      name: `${mineral.nameJA} (${mineral.nameEN})`,
      score
    };
  });

  return scores.sort((a, b) => a.score - b.score);
}
