import { 
  calculateOxideMode, 
  calculateElementMode,
  generateEmpiricalFormula, 
  identifyMineral,
  preParseMineralDb
} from '../src/lib/calculations';
import { periodicTableData } from '../src/lib/periodicTableData';
import { mineralDb as rawMineralDb } from '../src/lib/mineralDb';
import { CalculationResult } from '../src/lib/types';

const mineralDb = preParseMineralDb(rawMineralDb);
const atomicWeights: Record<string, number> = {};
periodicTableData.forEach(item => {
  atomicWeights[item.symbol] = item.atomicWeight;
});

function runProblem(
  name: string, 
  mode: 'oxide' | 'element', 
  input: { Item: string; "wt%": number }[], 
  settings: any
) {
  console.log(`\n=== Running Problem: ${name} ===`);
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
  
  const candidates = identifyMineral(results, mineralDb);
  
  console.log(`Calculated Formula: ${formula}`);
  console.log(`Detailed Ratios:`);
  results.forEach(r => {
    console.log(`  ${r.Item}: ${r["Atomic Ratio"].toFixed(4)}`);
  });
  console.log(`Top Identification: ${candidates[0].name} (Diff: ${candidates[0].score.toFixed(6)})`);
  return { formula, results, topCandidate: candidates[0] };
}

// Problem 1: Chromite
runProblem("類題1: Chromite", 'oxide', [
  { Item: "Cr2O3", "wt%": 54.22 },
  { Item: "Al2O3", "wt%": 15.59 },
  { Item: "FeO", "wt%": 21.97 },
  { Item: "MgO", "wt%": 8.22 }
], { targetOxygen: 4 });

// Problem 2: Bornite
runProblem("類題2: Bornite", 'element', [
  { Item: "Cu", "wt%": 63.31 },
  { Item: "Fe", "wt%": 11.13 },
  { Item: "S", "wt%": 25.56 }
], { 
  normalization: { 
    mode: 'element-ratio', 
    targetElement: 'S', 
    targetValue: 4 
  } 
});

// Problem 3: Spinel with Fe3+ (Droop)
runProblem("類題3: Spinel with Fe3+", 'oxide', [
  { Item: "Al2O3", "wt%": 10.20 },
  { Item: "Cr2O3", "wt%": 45.60 },
  { Item: "FeO", "wt%": 32.33 },
  { Item: "MgO", "wt%": 12.09 }
], { 
  targetOxygen: 4, 
  estimation: { idealCations: 3, elementSymbol: "Fe" } 
});

// Problem 4: Mn Mixed Valence
runProblem("類題4: Mn Mixed Valence", 'oxide', [
  { Item: "Al2O3", "wt%": 15.08 },
  { Item: "MnO", "wt%": 73.44 },
  { Item: "MgO", "wt%": 5.96 }
], { 
  targetOxygen: 4, 
  estimation: { idealCations: 3, elementSymbol: "Mn" } 
});
