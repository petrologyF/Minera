export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number; // 1-18
  period: number; // 1-7
  commonOxide: string;
}

export const periodicTableData: ElementData[] = [
  // Period 1
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", group: 1, period: 1, commonOxide: "H2O" },
  { atomicNumber: 2, symbol: "He", name: "Helium", group: 18, period: 1, commonOxide: "" },

  // Period 2
  { atomicNumber: 3, symbol: "Li", name: "Lithium", group: 1, period: 2, commonOxide: "Li2O" },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", group: 2, period: 2, commonOxide: "BeO" },
  { atomicNumber: 5, symbol: "B", name: "Boron", group: 13, period: 2, commonOxide: "B2O3" },
  { atomicNumber: 6, symbol: "C", name: "Carbon", group: 14, period: 2, commonOxide: "CO2" },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", group: 15, period: 2, commonOxide: "N2O5" },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", group: 16, period: 2, commonOxide: "" },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", group: 17, period: 2, commonOxide: "" },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", group: 18, period: 2, commonOxide: "" },

  // Period 3
  { atomicNumber: 11, symbol: "Na", name: "Sodium", group: 1, period: 3, commonOxide: "Na2O" },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", group: 2, period: 3, commonOxide: "MgO" },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium", group: 13, period: 3, commonOxide: "Al2O3" },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", group: 14, period: 3, commonOxide: "SiO2" },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", group: 15, period: 3, commonOxide: "P2O5" },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", group: 16, period: 3, commonOxide: "SO3" },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", group: 17, period: 3, commonOxide: "" },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", group: 18, period: 3, commonOxide: "" },

  // Period 4
  { atomicNumber: 19, symbol: "K", name: "Potassium", group: 1, period: 4, commonOxide: "K2O" },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", group: 2, period: 4, commonOxide: "CaO" },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium", group: 3, period: 4, commonOxide: "Sc2O3" },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium", group: 4, period: 4, commonOxide: "TiO2" },
  { atomicNumber: 23, symbol: "V", name: "Vanadium", group: 5, period: 4, commonOxide: "V2O5" },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium", group: 6, period: 4, commonOxide: "Cr2O3" },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese", group: 7, period: 4, commonOxide: "MnO" },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", group: 8, period: 4, commonOxide: "FeO" },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt", group: 9, period: 4, commonOxide: "CoO" },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel", group: 10, period: 4, commonOxide: "NiO" },
  { atomicNumber: 29, symbol: "Cu", name: "Copper", group: 11, period: 4, commonOxide: "CuO" },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc", group: 12, period: 4, commonOxide: "ZnO" },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium", group: 13, period: 4, commonOxide: "Ga2O3" },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium", group: 14, period: 4, commonOxide: "GeO2" },
  { atomicNumber: 33, symbol: "As", name: "Arsenic", group: 15, period: 4, commonOxide: "As2O3" },
  { atomicNumber: 34, symbol: "Se", name: "Selenium", group: 16, period: 4, commonOxide: "SeO2" },
  { atomicNumber: 35, symbol: "Br", name: "Bromine", group: 17, period: 4, commonOxide: "" },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton", group: 18, period: 4, commonOxide: "" },

  // Period 5 (Select elements)
  { atomicNumber: 37, symbol: "Rb", name: "Rubidium", group: 1, period: 5, commonOxide: "Rb2O" },
  { atomicNumber: 38, symbol: "Sr", name: "Strontium", group: 2, period: 5, commonOxide: "SrO" },
  { atomicNumber: 39, symbol: "Y", name: "Yttrium", group: 3, period: 5, commonOxide: "Y2O3" },
  { atomicNumber: 40, symbol: "Zr", name: "Zirconium", group: 4, period: 5, commonOxide: "ZrO2" },
  { atomicNumber: 41, symbol: "Nb", name: "Niobium", group: 5, period: 5, commonOxide: "Nb2O5" },
  { atomicNumber: 42, symbol: "Mo", name: "Molybdenum", group: 6, period: 5, commonOxide: "MoO3" },
  { atomicNumber: 47, symbol: "Ag", name: "Silver", group: 11, period: 5, commonOxide: "Ag2O" },
  { atomicNumber: 48, symbol: "Cd", name: "Cadmium", group: 12, period: 5, commonOxide: "CdO" },
  { atomicNumber: 50, symbol: "Sn", name: "Tin", group: 14, period: 5, commonOxide: "SnO2" },
  { atomicNumber: 51, symbol: "Sb", name: "Antimony", group: 15, period: 5, commonOxide: "Sb2O3" },

  // Period 6 (Select elements)
  { atomicNumber: 55, symbol: "Cs", name: "Caesium", group: 1, period: 6, commonOxide: "Cs2O" },
  { atomicNumber: 56, symbol: "Ba", name: "Barium", group: 2, period: 6, commonOxide: "BaO" },
  { atomicNumber: 72, symbol: "Hf", name: "Hafnium", group: 4, period: 6, commonOxide: "HfO2" },
  { atomicNumber: 73, symbol: "Ta", name: "Tantalum", group: 5, period: 6, commonOxide: "Ta2O5" },
  { atomicNumber: 74, symbol: "W", name: "Tungsten", group: 6, period: 6, commonOxide: "WO3" },
  { atomicNumber: 82, symbol: "Pb", name: "Lead", group: 14, period: 6, commonOxide: "PbO" },
  { atomicNumber: 83, symbol: "Bi", name: "Bismuth", group: 15, period: 6, commonOxide: "Bi2O3" },

  // Period 7 (Select elements)
  { atomicNumber: 87, symbol: "Fr", name: "Francium", group: 1, period: 7, commonOxide: "Fr2O" },
  { atomicNumber: 88, symbol: "Ra", name: "Radium", group: 2, period: 7, commonOxide: "RaO" },
  { atomicNumber: 90, symbol: "Th", name: "Thorium", group: 4, period: 7, commonOxide: "ThO2" },
  { atomicNumber: 92, symbol: "U", name: "Uranium", group: 6, period: 7, commonOxide: "UO2" },
];
