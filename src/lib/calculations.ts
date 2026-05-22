import { CalculationResult, MineralData, OxideCalculationRow, ElementCalculationRow, IdentificationCandidate } from "./types";

export function parseComplexFormula(formula: string): Record<string, number> {
  const parts = formula.replace(/\s/g, "").split(/[·・]/);
  const totalRes: Record<string, number> = {};
  function parsePart(f: string): Record<string, number> {
    const res: Record<string, number> = {}; let i = 0;
    while (i < f.length) {
      if (f[i] === "(") {
        let countOpen = 1, j = i + 1;
        while (j < f.length && countOpen > 0) { if (f[j] === "(") countOpen++; else if (f[j] === ")") countOpen--; j++; }
        const inner = parsePart(f.substring(i + 1, j - 1)); i = j;
        const match = f.substring(i).match(/^(\d+(\.\d+)?)/);
        let mult = match ? parseFloat(match[1]) : 1.0; if (match) i += match[1].length;
        for (const [k, v] of Object.entries(inner)) res[k] = (res[k] || 0) + v * mult;
      } else if (f[i] === "," || f[i] === "-" || /[x-z]/.test(f[i])) { i++; }
      else {
        const match = f.substring(i).match(/^([A-Z][a-z]*)(\d+(\.\d+)?)?/);
        if (match) { const sym = match[1], count = match[2] ? parseFloat(match[2]) : 1.0; res[sym] = (res[sym] || 0) + count; i += match[0].length; }
        else i++;
      }
    }
    return res;
  }
  parts.forEach((part, index) => {
    let mult = 1.0, formulaPart = part;
    if (index > 0) {
      const match = part.match(/^(\d+(\.\d+)?|n)/);
      if (match) { mult = (match[1] === 'n') ? 1.0 : parseFloat(match[1]); formulaPart = part.substring(match[0].length); }
    }
    const partRes = parsePart(formulaPart);
    for (const [k, v] of Object.entries(partRes)) totalRes[k] = (totalRes[k] || 0) + v * mult;
  });
  return totalRes;
}

export function getMolecularWeight(formula: string, atomicWeights: Record<string, number>): number {
  const counts = parseComplexFormula(formula); let mw = 0.0;
  for (const [symbol, count] of Object.entries(counts)) if (symbol in atomicWeights) mw += atomicWeights[symbol] * count;
  return mw;
}

export const DEFAULT_VALENCES: Record<string, number> = {
  Si: 4, Ti: 4, Al: 3, Fe: 2, Mn: 2, Mg: 2, Ca: 2, Na: 1, K: 1, Cr: 3, Ni: 2, Zn: 2, Cu: 2, P: 5, S: 6
};

export function calculateElementMode(input: { Item: string; "wt%": number }[], atomicWeights: Record<string, number>, normalization?: { mode: "stoichiometric-oxygen" | "element-ratio" | "total-anions"; targetValue: number; targetElement?: string; }): ElementCalculationRow[] {
  const results: ElementCalculationRow[] = input.map(row => {
    const weight = atomicWeights[row.Item] || 0, prop = weight > 0 ? row["wt%"] / weight : 0;
    return { Item: row.Item, "wt%": row["wt%"], "Atomic Weight": weight, "Atomic Proportion": prop, "Atomic Ratio": prop };
  });
  if (!normalization) return results;
  if (normalization.mode === "stoichiometric-oxygen") {
    let totalOProp = 0;
    results.forEach(res => {
      const oProp = (res["Atomic Proportion"] || 0) * ((DEFAULT_VALENCES[res.Item] || 2) / 2.0);
      res["Oxygen Proportion"] = oProp; totalOProp += oProp;
    });
    const norm = totalOProp > 0 ? normalization.targetValue / totalOProp : 0;
    results.forEach(res => { res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * norm; });
  } else if (normalization.mode === "element-ratio" && normalization.targetElement) {
    const targetProp = results.find(r => r.Item === normalization.targetElement)?.["Atomic Proportion"] || 0;
    const norm = targetProp > 0 ? normalization.targetValue / targetProp : 0;
    results.forEach(res => { res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * norm; });
  } else if (normalization.mode === "total-anions") {
    let totalAnionProp = 0;
    results.forEach(res => {
      const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
      if ((CATION_ORDER[symbol] || 0) >= 1000) totalAnionProp += res["Atomic Proportion"] || 0;
    });
    const norm = totalAnionProp > 0 ? normalization.targetValue / totalAnionProp : 0;
    results.forEach(res => { res["Atomic Ratio"] = (res["Atomic Proportion"] || 0) * norm; });
  }
  return results;
}

export const ESTIMATABLE_ELEMENTS: Record<string, [number, number]> = { Fe: [2, 3], Mn: [2, 3], Ti: [3, 4], Cr: [2, 3] };

export function calculateOxideMode(input: { Item: string; "wt%": number }[], atomicWeights: Record<string, number>, targetOxygen: number, estimation?: { idealCations: number; elementSymbol: string; }): OxideCalculationRow[] {
  let results: OxideCalculationRow[] = input.map(row => {
    const mw = getMolecularWeight(row.Item, atomicWeights), molProp = mw > 0 ? row["wt%"] / mw : 0, counts = parseComplexFormula(row.Item);
    const oCount = counts["O"] || 0; delete counts["O"];
    const cationCount = Object.values(counts).reduce((a, b) => a + b, 0);
    return { Item: row.Item, "wt%": row["wt%"], "Molecular Weight": mw, "Molecular Proportion": molProp, "Cation Proportion": molProp * cationCount, "Oxygen Proportion": molProp * oCount, "Atomic Ratio": 0 };
  });
  const totalOProp = results.reduce((sum, res) => sum + (res["Oxygen Proportion"] || 0), 0);
  const norm = totalOProp > 0 ? targetOxygen / totalOProp : 0;
  results.forEach(res => { res["Atomic Ratio"] = (res["Cation Proportion"] || 0) * norm; });
  if (estimation && estimation.idealCations > 0) {
    const currentCationSum = results.reduce((sum, res) => sum + res["Atomic Ratio"], 0);
    if (currentCationSum > estimation.idealCations) {
      const valences = ESTIMATABLE_ELEMENTS[estimation.elementSymbol];
      if (valences) {
        const [vLow, vHigh] = valences; let currentCharge = 0;
        results.forEach(res => {
          const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
          currentCharge += res["Atomic Ratio"] * (DEFAULT_VALENCES[symbol] || 2);
        });
        const idealCharge = 2 * targetOxygen;
        const atomsToElevate = (idealCharge - currentCharge) / (vHigh - vLow);
        const targetIdx = results.findIndex(res => res.Item.includes(estimation.elementSymbol));
        if (targetIdx !== -1 && atomsToElevate > 0) {
          const totalAtoms = results[targetIdx]["Atomic Ratio"];
          const cappedElevated = Math.min(atomsToElevate, totalAtoms);
          const originalRow = results[targetIdx];
          const formatV = (v: number) => v === 1 ? "" : (v === 2 ? "²⁺" : (v === 3 ? "³⁺" : "⁴⁺"));
          const newResults = [...results];
          newResults.splice(targetIdx, 1, 
            { ...originalRow, Item: `${estimation.elementSymbol}${formatV(vLow)} (est.)`, "Atomic Ratio": totalAtoms - cappedElevated },
            { ...originalRow, Item: `${estimation.elementSymbol}${formatV(vHigh)} (est.)`, "Atomic Ratio": cappedElevated, "Cation Proportion": 0, "Oxygen Proportion": 0 }
          );
          results = newResults;
        }
      }
    }
  }
  return results;
}

export const CATION_ORDER: Record<string, number> = {
  Cs: 10, Rb: 20, K: 30, Na: 40, Li: 50, Ba: 60, Sr: 70, Ca: 80, La: 100, Ce: 110, Pr: 120, Nd: 130, Sm: 140, Eu: 150, Gd: 160,
  Mg: 200, Fe: 210, Mn: 220, Ni: 230, Co: 240, Zn: 250, Cu: 260, Al: 300, Cr: 310, V: 320, Sc: 330, Ti: 340, Zr: 350, Sn: 360, Si: 400, P: 410, B: 430,
  O: 1000, F: 1010, Cl: 1020, OH: 1030, S: 1040, As: 1050, Sb: 1060, Se: 1070, Te: 1080
};

export function generateEmpiricalFormula(results: CalculationResult[], options?: { mode: "element" | "oxide"; targetOxygen?: number; normalizationMode?: "stoichiometric-oxygen" | "element-ratio"; }): string {
  const elementsData: { priority: number; symbol: string; ratio: number; isAnion: boolean }[] = [];
  results.forEach(res => {
    if (res["Atomic Ratio"] > 0.0001) {
      const estMatch = res.Item.match(/^([A-Z][a-z]*[²³⁴]⁺)/);
      const symbol = estMatch ? estMatch[1] : (res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item);
      const priority = CATION_ORDER[symbol.match(/^([A-Z][a-z]*)/)?.[1] || symbol] || 999;
      elementsData.push({ priority, symbol, ratio: res["Atomic Ratio"], isAnion: (CATION_ORDER[symbol.match(/^([A-Z][a-z]*)/)?.[1] || symbol] || 0) >= 1000 });
    }
  });
  elementsData.sort((a, b) => (a.priority !== b.priority) ? a.priority - b.priority : a.symbol.localeCompare(b.symbol));
  const formatR = (num: number) => {
    if (Math.abs(num - Math.round(num)) < 0.00001) return Math.round(num) === 1 ? "" : Math.round(num).toString();
    let f = num.toPrecision(4); if (f.includes(".")) f = f.replace(/\.?0+$/, ""); return f === "1" ? "" : f;
  };
  let formula = elementsData.filter(e => !e.isAnion).map(e => `${e.symbol}${formatR(e.ratio)}`).join("");
  elementsData.filter(e => e.isAnion && e.symbol !== "O").forEach(a => { formula += `${a.symbol}${formatR(a.ratio)}`; });
  const oVal = options?.mode === "oxide" ? options.targetOxygen : elementsData.find(e => e.symbol === "O")?.ratio || (options?.normalizationMode === "stoichiometric-oxygen" ? options.targetOxygen : undefined);
  if (oVal !== undefined) { const roundedO = Math.round(oVal * 100) / 100; formula += `O${roundedO === 1 ? "" : roundedO}`; }
  return formula;
}

export function identifyMineral(results: CalculationResult[], mineralDb: MineralData[]): IdentificationCandidate[] {
  const EXCLUDED = ["O", "H"]; const calcRatios: Record<string, number> = {};
  results.forEach(res => {
    const symbol = res.Item.match(/^([A-Z][a-z]*)/)?.[1] || res.Item;
    if (!EXCLUDED.includes(symbol)) calcRatios[symbol] = (calcRatios[symbol] || 0) + res["Atomic Ratio"];
  });
  const scores: IdentificationCandidate[] = mineralDb.map(mineral => {
    const dbProps: Record<string, number> = {};
    const counts = mineral.parsedFormula || parseComplexFormula(mineral.formula);
    for (const [k, v] of Object.entries(counts)) if (!EXCLUDED.includes(k)) dbProps[k] = v;
    let score = 0; new Set([...Object.keys(calcRatios), ...Object.keys(dbProps)]).forEach(el => { score += Math.pow((calcRatios[el] || 0) - (dbProps[el] || 0), 2); });
    return { name: `${mineral.nameJA} (${mineral.nameEN})`, nameEN: mineral.nameEN, category: mineral.category, formula: mineral.formula, score };
  });
  return scores.sort((a, b) => a.score - b.score);
}

export function preParseMineralDb(mineralDb: MineralData[]): MineralData[] {
  return mineralDb.map(mineral => ({ ...mineral, parsedFormula: parseComplexFormula(mineral.formula) }));
}
