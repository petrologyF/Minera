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
  alternativeOxides?: string[];
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
  "Oxygen Ratio": number;
}

export interface ElementCalculationRow extends BaseCalculationRow {
  "Atomic Weight": number;
  "Atomic Proportion": number;
  "Oxygen Proportion"?: number; // For stoichiometric oxygen mode
  "Oxygen Ratio"?: number;
}

export type CalculationResult = OxideCalculationRow | ElementCalculationRow;

export interface MineralSite {
  name: string;
  capacity: number;
  elements: string[]; // e.g. ["Fe²⁺", "Mg", "Mn"]
}

export interface MineralData {
  category: string;
  nameJA: string;
  nameEN: string;
  formula: string;
  parsedFormula?: Record<string, number>;
  sites?: MineralSite[];
}

export interface IdentificationCandidate {
  name: string;
  nameEN: string;
  category: string;
  formula: string;
  score: number;
  matchPercentage: number;
}

export interface EndMemberResult {
  notation: string;
  components: { symbol: string; percentage: number }[];
}
