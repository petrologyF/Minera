import { ElementData } from "./types";

export const periodicTableData: ElementData[] = [
  // Period 1
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", group: 1, period: 1, commonOxide: "H2O", atomicWeight: 1.008, category: "nonmetal" },
  { atomicNumber: 2, symbol: "He", name: "Helium", group: 18, period: 1, commonOxide: "", atomicWeight: 4.003, category: "noble-gas" },

  // Period 2
  { atomicNumber: 3, symbol: "Li", name: "Lithium", group: 1, period: 2, commonOxide: "Li2O", atomicWeight: 6.941, category: "alkali-metal" },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", group: 2, period: 2, commonOxide: "BeO", atomicWeight: 9.012, category: "alkaline-earth" },
  { atomicNumber: 5, symbol: "B", name: "Boron", group: 13, period: 2, commonOxide: "B2O3", atomicWeight: 10.81, category: "metalloid" },
  { atomicNumber: 6, symbol: "C", name: "Carbon", group: 14, period: 2, commonOxide: "CO2", atomicWeight: 12.01, category: "nonmetal" },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", group: 15, period: 2, commonOxide: "N2O5", atomicWeight: 14.01, category: "nonmetal" },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", group: 16, period: 2, commonOxide: "", atomicWeight: 16.00, category: "nonmetal" },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", group: 17, period: 2, commonOxide: "", atomicWeight: 19.00, category: "halogen" },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", group: 18, period: 2, commonOxide: "", atomicWeight: 20.18, category: "noble-gas" },

  // Period 3
  { atomicNumber: 11, symbol: "Na", name: "Sodium", group: 1, period: 3, commonOxide: "Na2O", atomicWeight: 22.99, category: "alkali-metal" },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", group: 2, period: 3, commonOxide: "MgO", atomicWeight: 24.31, category: "alkaline-earth" },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium", group: 13, period: 3, commonOxide: "Al2O3", atomicWeight: 26.98, category: "post-transition-metal" },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", group: 14, period: 3, commonOxide: "SiO2", atomicWeight: 28.09, category: "metalloid" },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", group: 15, period: 3, commonOxide: "P2O5", atomicWeight: 30.97, category: "nonmetal" },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", group: 16, period: 3, commonOxide: "SO3", atomicWeight: 32.07, category: "nonmetal" },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", group: 17, period: 3, commonOxide: "", atomicWeight: 35.45, category: "halogen" },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", group: 18, period: 3, commonOxide: "", atomicWeight: 39.95, category: "noble-gas" },

  // Period 4
  { atomicNumber: 19, symbol: "K", name: "Potassium", group: 1, period: 4, commonOxide: "K2O", atomicWeight: 39.10, category: "alkali-metal" },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", group: 2, period: 4, commonOxide: "CaO", atomicWeight: 40.08, category: "alkaline-earth" },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium", group: 3, period: 4, commonOxide: "Sc2O3", atomicWeight: 44.96, category: "transition-metal" },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium", group: 4, period: 4, commonOxide: "TiO2", alternativeOxides: ["Ti2O3"], atomicWeight: 47.87, category: "transition-metal" },
  { atomicNumber: 23, symbol: "V", name: "Vanadium", group: 5, period: 4, commonOxide: "V2O5", alternativeOxides: ["V2O3"], atomicWeight: 50.94, category: "transition-metal" },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium", group: 6, period: 4, commonOxide: "Cr2O3", atomicWeight: 52.00, category: "transition-metal" },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese", group: 7, period: 4, commonOxide: "MnO", alternativeOxides: ["Mn2O3", "MnO2"], atomicWeight: 54.94, category: "transition-metal" },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", group: 8, period: 4, commonOxide: "FeO", alternativeOxides: ["Fe2O3"], atomicWeight: 55.85, category: "transition-metal" },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt", group: 9, period: 4, commonOxide: "CoO", atomicWeight: 58.93, category: "transition-metal" },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel", group: 10, period: 4, commonOxide: "NiO", atomicWeight: 58.69, category: "transition-metal" },
  { atomicNumber: 29, symbol: "Cu", name: "Copper", group: 11, period: 4, commonOxide: "CuO", atomicWeight: 63.55, category: "transition-metal" },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc", group: 12, period: 4, commonOxide: "ZnO", atomicWeight: 65.38, category: "transition-metal" },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium", group: 13, period: 4, commonOxide: "Ga2O3", atomicWeight: 69.72, category: "post-transition-metal" },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium", group: 14, period: 4, commonOxide: "GeO2", atomicWeight: 72.63, category: "post-transition-metal" },
  { atomicNumber: 33, symbol: "As", name: "Arsenic", group: 15, period: 4, commonOxide: "As2O3", atomicWeight: 74.92, category: "metalloid" },
  { atomicNumber: 34, symbol: "Se", name: "Selenium", group: 16, period: 4, commonOxide: "SeO2", atomicWeight: 78.97, category: "metalloid" },
  { atomicNumber: 35, symbol: "Br", name: "Bromine", group: 17, period: 4, commonOxide: "", atomicWeight: 79.90, category: "halogen" },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton", group: 18, period: 4, commonOxide: "", atomicWeight: 83.80, category: "noble-gas" },

  // Period 5 (Select elements)
  { atomicNumber: 37, symbol: "Rb", name: "Rubidium", group: 1, period: 5, commonOxide: "Rb2O", atomicWeight: 85.47, category: "alkali-metal" },
  { atomicNumber: 38, symbol: "Sr", name: "Strontium", group: 2, period: 5, commonOxide: "SrO", atomicWeight: 87.62, category: "alkaline-earth" },
  { atomicNumber: 39, symbol: "Y", name: "Yttrium", group: 3, period: 5, commonOxide: "Y2O3", atomicWeight: 88.91, category: "transition-metal" },
  { atomicNumber: 40, symbol: "Zr", name: "Zirconium", group: 4, period: 5, commonOxide: "ZrO2", atomicWeight: 91.22, category: "transition-metal" },
  { atomicNumber: 41, symbol: "Nb", name: "Niobium", group: 5, period: 5, commonOxide: "Nb2O5", atomicWeight: 92.91, category: "transition-metal" },
  { atomicNumber: 42, symbol: "Mo", name: "Molybdenum", group: 6, period: 5, commonOxide: "MoO3", atomicWeight: 95.95, category: "transition-metal" },
  { atomicNumber: 47, symbol: "Ag", name: "Silver", group: 11, period: 5, commonOxide: "Ag2O", atomicWeight: 107.9, category: "transition-metal" },
  { atomicNumber: 48, symbol: "Cd", name: "Cadmium", group: 12, period: 5, commonOxide: "CdO", atomicWeight: 112.4, category: "transition-metal" },
  { atomicNumber: 50, symbol: "Sn", name: "Tin", group: 14, period: 5, commonOxide: "SnO2", atomicWeight: 118.7, category: "post-transition-metal" },
  { atomicNumber: 51, symbol: "Sb", name: "Antimony", group: 15, period: 5, commonOxide: "Sb2O3", atomicWeight: 121.8, category: "post-transition-metal" },

  // Period 6 (Select elements)
  { atomicNumber: 55, symbol: "Cs", name: "Caesium", group: 1, period: 6, commonOxide: "Cs2O", atomicWeight: 132.9, category: "alkali-metal" },
  { atomicNumber: 56, symbol: "Ba", name: "Barium", group: 2, period: 6, commonOxide: "BaO", atomicWeight: 137.3, category: "alkaline-earth" },
  { atomicNumber: 72, symbol: "Hf", name: "Hafnium", group: 4, period: 6, commonOxide: "HfO2", atomicWeight: 178.5, category: "transition-metal" },
  { atomicNumber: 73, symbol: "Ta", name: "Tantalum", group: 5, period: 6, commonOxide: "Ta2O5", atomicWeight: 180.9, category: "transition-metal" },
  { atomicNumber: 74, symbol: "W", name: "Tungsten", group: 6, period: 6, commonOxide: "WO3", atomicWeight: 183.8, category: "transition-metal" },
  { atomicNumber: 82, symbol: "Pb", name: "Lead", group: 14, period: 6, commonOxide: "PbO", atomicWeight: 207.2, category: "post-transition-metal" },
  { atomicNumber: 83, symbol: "Bi", name: "Bismuth", group: 15, period: 6, commonOxide: "Bi2O3", atomicWeight: 209.0, category: "post-transition-metal" },

  // Period 7 (Select elements)
  { atomicNumber: 87, symbol: "Fr", name: "Francium", group: 1, period: 7, commonOxide: "Fr2O", atomicWeight: 223, category: "alkali-metal" },
  { atomicNumber: 88, symbol: "Ra", name: "Radium", group: 2, period: 7, commonOxide: "RaO", atomicWeight: 226, category: "alkaline-earth" },
  { atomicNumber: 90, symbol: "Th", name: "Thorium", group: 4, period: 7, commonOxide: "ThO2", atomicWeight: 232.0, category: "actinide" },
  { atomicNumber: 92, symbol: "U", name: "Uranium", group: 6, period: 7, commonOxide: "UO2", atomicWeight: 238.0, category: "actinide" },
];
