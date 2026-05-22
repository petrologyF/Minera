export type ElementCategory = 
  | "alkali-metal" 
  | "alkaline-earth" 
  | "transition-metal" 
  | "post-transition-metal" 
  | "metalloid" 
  | "nonmetal" 
  | "halogen" 
  | "noble-gas" 
  | "lanthanide" 
  | "actinide";

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  commonOxide: string;
  atomicWeight: number;
  category?: ElementCategory;
}

export interface BaseCalculationRow {
  Item: string;
  "wt%": number;
  "Atomic Ratio": number;
}

export interface OxideCalculationRow extends BaseCalculationRow {
  "Molecular Weight": number;
  "Molecular Proportion": number;
  "Cation Proportion": number;
  "Oxygen Proportion": number;
}

export interface ElementCalculationRow extends BaseCalculationRow {
  "Atomic Weight": number;
  "Atomic Proportion": number;
  "Oxygen Proportion"?: number; // For stoichiometric oxygen mode
}

export type CalculationResult = OxideCalculationRow | ElementCalculationRow;

export interface MineralData {
  category: string;
  nameJA: string;
  nameEN: string;
  formula: string;
  parsedFormula?: Record<string, number>; // For performance optimization
}

export interface IdentificationCandidate {
  name: string;
  nameEN: string;
  category: string;
  formula: string;
  score: number;
}
