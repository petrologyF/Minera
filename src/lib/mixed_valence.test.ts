import { test, expect, describe } from 'vitest';
import { 
  calculateOxideMode, 
  generateEmpiricalFormula, 
  identifyMineral,
  preParseMineralDb
} from './calculations';
import { periodicTableData } from './periodicTableData';
import { mineralDb as rawMineralDb } from './mineralDb';

const mineralDb = preParseMineralDb(rawMineralDb);
const atomicWeights: Record<string, number> = {};
periodicTableData.forEach(item => {
  atomicWeights[item.symbol] = item.atomicWeight;
});

describe('Mixed Valence Estimation (Generalized)', () => {
  test('Problem 3: Spinel with Fe3+ Estimation (Droop)', () => {
    const input = [
      { Item: "Al2O3", "wt%": 10.20 },
      { Item: "Cr2O3", "wt%": 45.60 },
      { Item: "FeO", "wt%": 32.33 },
      { Item: "MgO", "wt%": 12.09 }
    ];
    
    const results = calculateOxideMode(input, atomicWeights, 4, { idealCations: 3, elementSymbol: "Fe" });
    const formula = generateEmpiricalFormula(results, { mode: 'oxide', targetOxygen: 4 });
    
    // Expect Fe2+ and Fe3+ to be present in the formula
    expect(formula).toContain('Fe²⁺');
    expect(formula).toContain('Fe³⁺');
    
    const fe3Row = results.find(r => r.Item.includes('Fe³⁺'));
    expect(fe3Row?.["Atomic Ratio"]).toBeCloseTo(0.451, 2);
  });

  test('Problem 4: Hausmannite-Spinel with Mn3+ Estimation', () => {
    const input = [
      { Item: "Al2O3", "wt%": 15.08 },
      { Item: "MnO", "wt%": 73.44 },
      { Item: "MgO", "wt%": 5.96 }
    ];
    
    const results = calculateOxideMode(input, atomicWeights, 4, { idealCations: 3, elementSymbol: "Mn" });
    const formula = generateEmpiricalFormula(results, { mode: 'oxide', targetOxygen: 4 });
    
    // Expect Mn2+ and Mn3+ to be present
    expect(formula).toContain('Mn²⁺');
    expect(formula).toContain('Mn³⁺');
    
    const mn3Row = results.find(r => r.Item.includes('Mn³⁺'));
    const mn2Row = results.find(r => r.Item.includes('Mn²⁺'));
    
    expect(mn3Row?.["Atomic Ratio"]).toBeCloseTo(1.4, 1);
    expect(mn2Row?.["Atomic Ratio"]).toBeCloseTo(0.7, 1);
  });
});
