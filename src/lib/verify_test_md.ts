import { 
  calculateOxideMode, 
  calculateElementMode,
  generateEmpiricalFormula,
} from './calculations';
import { periodicTableData } from './periodicTableData';
import { CalculationResult } from './types';

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

const tests = [
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
