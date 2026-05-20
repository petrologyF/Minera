export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  commonOxide: string;
  atomicWeight: number;
}

export interface CalculationResult {
  Item: string;
  "wt%": number;
  "Molecular Weight"?: number;
  "Molecular Proportion"?: number;
  "Cation Proportion"?: number;
  "Oxygen Proportion"?: number;
  "Atomic Ratio": number;
  "Atomic Weight"?: number;
  "Atomic Proportion"?: number;
}

export interface MineralData {
  category: string;
  nameJA: string;
  nameEN: string;
  formula: string;
}
