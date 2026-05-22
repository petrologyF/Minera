import { 
  calculateOxideMode, 
  calculateElementMode,
  generateEmpiricalFormula,
} from '../src/lib/calculations';
import { periodicTableData } from '../src/lib/periodicTableData';
import { CalculationResult } from '../src/lib/types';

const atomicWeights: Record<string, number> = {};
periodicTableData.forEach(item => {
  atomicWeights[item.symbol] = item.atomicWeight;
});

function runTest(
  id: string,
  mode: 'oxide' | 'element',
  input: { Item: string; "wt%": number }[],
  settings: any,
  expected: Record<string, number>
) {
  console.log(`\n--- Test ${id} ---`);
  let results: CalculationResult[];
  if (mode === 'oxide') {
    results = calculateOxideMode(
      input,
      atomicWeights,
      settings.targetOxygen,
      settings.estimation
    );
  } else {
    results = calculateElementMode(
      input,
      atomicWeights,
      settings.normalization
    );
  }

  const formula = generateEmpiricalFormula(results, {
    mode: mode,
    targetOxygen: mode === 'oxide' ? settings.targetOxygen : undefined
  });
  console.log(`Formula: ${formula}`);

  let passed = true;
  for (const [key, val] of Object.entries(expected)) {
    const res = results.find(r => r.Item.startsWith(key));
    const actual = res ? res["Atomic Ratio"] : 0;
    const diff = Math.abs(actual - val);
    if (diff > 0.01) {
      console.error(`  FAIL: ${key} expected ${val}, got ${actual.toFixed(4)}`);
      passed = false;
    } else {
      console.log(`  PASS: ${key} = ${actual.toFixed(4)}`);
    }
  }
  return passed;
}

const tests: {
  id: string;
  mode: 'oxide' | 'element';
  input: { Item: string; "wt%": number }[];
  settings: any;
  expected: Record<string, number>;
}[] = [
  {
    id: "Q1 (Spinel)",
    mode: 'oxide',
    input: [
      { Item: "Al2O3", "wt%": 68.63 },
      { Item: "FeO", "wt%": 9.67 },
      { Item: "MgO", "wt%": 21.70 }
    ],
    settings: { targetOxygen: 4 },
    expected: { "Al": 2.00, "Fe": 0.20, "Mg": 0.80 }
  },
  {
    id: "Q2 (Ilmenite)",
    mode: 'oxide',
    input: [
      { Item: "TiO2", "wt%": 52.61 },
      { Item: "FeO", "wt%": 47.39 }
    ],
    settings: { targetOxygen: 3 },
    expected: { "Ti": 1.00, "Fe": 1.00 }
  },
  {
    id: "Q3 (Chalcopyrite)",
    mode: 'element',
    input: [
      { Item: "Cu", "wt%": 34.62 },
      { Item: "Fe", "wt%": 30.43 },
      { Item: "S", "wt%": 34.95 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 2 } },
    expected: { "Cu": 1.00, "Fe": 1.00, "S": 2.00 }
  },
  {
    id: "Q4 (Sphalerite)",
    mode: 'element',
    input: [
      { Item: "Zn", "wt%": 57.88 },
      { Item: "Fe", "wt%": 8.72 },
      { Item: "S", "wt%": 33.40 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 1 } },
    expected: { "Zn": 0.85, "Fe": 0.15, "S": 1.00 }
  },
  {
    id: "Q5 (Titanomagnetite - Mixed Valence)",
    mode: 'oxide',
    input: [
      { Item: "Al2O3", "wt%": 2.42 },
      { Item: "MgO", "wt%": 1.92 },
      { Item: "FeO", "wt%": 95.66 }
    ],
    settings: { targetOxygen: 4, estimation: { idealCations: 3, elementSymbol: "Fe" } },
    expected: { "Al": 0.10, "Mg": 0.10, "Fe²⁺": 0.90, "Fe³⁺": 1.90 }
  },
  {
    id: "Q6 (Ilm-Hem - Mixed Valence)",
    mode: 'oxide',
    input: [
      { Item: "TiO2", "wt%": 32.27 },
      { Item: "FeO", "wt%": 67.73 }
    ],
    settings: { targetOxygen: 3, estimation: { idealCations: 2, elementSymbol: "Fe" } },
    expected: { "Ti": 0.60, "Fe²⁺": 0.60, "Fe³⁺": 0.80 }
  },
  {
    id: "Q7 (Chromite - Mixed Valence)",
    mode: 'oxide',
    input: [
      { Item: "Cr2O3", "wt%": 47.19 },
      { Item: "Al2O3", "wt%": 10.55 },
      { Item: "MgO", "wt%": 12.51 },
      { Item: "FeO", "wt%": 29.74 }
    ],
    settings: { targetOxygen: 4, estimation: { idealCations: 3, elementSymbol: "Fe" } },
    expected: { "Cr": 1.20, "Al": 0.40, "Mg": 0.60, "Fe²⁺": 0.40, "Fe³⁺": 0.40 }
  },
  {
    id: "Q8 (Pyrrhotite)",
    mode: 'element',
    input: [
      { Item: "Fe", "wt%": 60.51 },
      { Item: "S", "wt%": 39.49 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 1 } },
    expected: { "Fe": 0.88, "S": 1.00 }
  },
  {
    id: "Q9 (Maghemite)",
    mode: 'oxide',
    input: [
      { Item: "Fe2O3", "wt%": 100.00 }
    ],
    settings: { targetOxygen: 4 },
    expected: { "Fe": 2.667 }
  },
  {
    id: "Q10 (Tennantite)",
    mode: 'element',
    input: [
      { Item: "Cu", "wt%": 43.41 },
      { Item: "Fe", "wt%": 7.63 },
      { Item: "As", "wt%": 20.47 },
      { Item: "S", "wt%": 28.48 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 13 } },
    expected: { "Cu": 10.00, "Fe": 2.00, "As": 4.00, "S": 13.00 }
  },
  {
    id: "Q11 (Chalcopyrite)",
    mode: 'element',
    input: [
      { Item: "Cu", "wt%": 34.30 },
      { Item: "Fe", "wt%": 30.59 },
      { Item: "S", "wt%": 34.82 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 2 } },
    expected: { "Cu": 0.9942, "Fe": 1.009, "S": 2 }
  },
  {
    id: "Q12 (Troilite or Pyrrhotite)",
    mode: 'element',
    input: [
      { Item: "Fe", "wt%": 63.53 },
      { Item: "Mn", "wt%": 0.00 },
      { Item: "Cd", "wt%": 0.00 },
      { Item: "Zn", "wt%": 0.00 },
      { Item: "S", "wt%": 36.47 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 1 } },
    expected: { "Fe": 1.0002, "S": 1 }
  },
  {
    id: "Q13 (Arsenopyrite)",
    mode: 'element',
    input: [
      { Item: "Fe", "wt%": 34.30 },
      { Item: "As", "wt%": 46.01 },
      { Item: "S", "wt%": 19.69 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 1 } },
    expected: { "Fe": 1.000, "As": 1.000, "S": 1 }
  },
  {
    id: "Q14 (Magnetite)",
    mode: 'oxide',
    input: [
      { Item: "SiO2", "wt%": 0.27 },
      { Item: "Al2O3", "wt%": 0.21 },
      { Item: "Fe2O3", "wt%": 68.85 },
      { Item: "FeO", "wt%": 30.78 }
    ],
    settings: { targetOxygen: 4 },
    expected: { "Fe²⁺": 0.9841, "Fe³⁺": 1.986, "Al": 0.009454, "Si": 0.01031 }
  },
  {
    id: "Q15 (Spinel)",
    mode: 'oxide',
    input: [
      { Item: "Al2O3", "wt%": 71.67 },
      { Item: "MgO", "wt%": 28.33 }
    ],
    settings: { targetOxygen: 4 },
    expected: { "Mg": 0.9999, "Al": 2.000 }
  },
  {
    id: "Q16 (Hematite)",
    mode: 'element',
    input: [
      { Item: "Fe", "wt%": 69.94 },
      { Item: "O", "wt%": 30.06 }
    ],
    settings: { normalization: { mode: 'total-anions', targetValue: 3 } },
    expected: { "Fe": 2.000 }
  },
  {
    id: "Q17 (Chromite - Separated Fe)",
    mode: 'oxide',
    input: [
      { Item: "Cr2O3", "wt%": 47.05 },
      { Item: "Al2O3", "wt%": 15.78 },
      { Item: "Fe2O3", "wt%": 8.24 },
      { Item: "FeO", "wt%": 18.53 },
      { Item: "MgO", "wt%": 10.40 }
    ],
    settings: { targetOxygen: 4 },
    expected: { "Cr": 1.200, "Al": 0.600, "Fe³⁺": 0.200, "Fe²⁺": 0.500, "Mg": 0.500 }
  },
  {
    id: "Q18 (Augite - Separated Fe)",
    mode: 'oxide',
    input: [
      { Item: "SiO2", "wt%": 51.30 },
      { Item: "Al2O3", "wt%": 2.29 },
      { Item: "Cr2O3", "wt%": 0.68 },
      { Item: "Fe2O3", "wt%": 2.87 },
      { Item: "FeO", "wt%": 3.87 },
      { Item: "MgO", "wt%": 15.03 },
      { Item: "CaO", "wt%": 23.94 }
    ],
    settings: { targetOxygen: 6 },
    expected: { "Si": 1.900, "Al": 0.100, "Cr": 0.020, "Fe³⁺": 0.080, "Fe²⁺": 0.120, "Mg": 0.830, "Ca": 0.950 }
  }
];

let allPassed = true;
tests.forEach(t => {
  if (!runTest(t.id, t.mode as any, t.input, t.settings, t.expected)) {
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nALL TESTS PASSED!");
} else {
  console.log("\nSOME TESTS FAILED.");
}
