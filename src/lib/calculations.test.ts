import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  parseComplexFormula, 
  calculateOxideMode, 
  generateEmpiricalFormula 
} from './calculations';
import { CalculationResult } from './types';


const mockAtomicWeights = {
  Si: 28.085,
  Ti: 47.867,
  Al: 26.982,
  Fe: 55.845,
  Mn: 54.938,
  Mg: 24.305,
  Ca: 40.078,
  Na: 22.990,
  K: 39.098,
  O: 15.999
};

describe('Formula Parsing', () => {
  test('should parse simple formula', () => {
    const res = parseComplexFormula('SiO2');
    assert.strictEqual(res['Si'], 1);
    assert.strictEqual(res['O'], 2);
  });

  test('should parse formula with parentheses', () => {
    const res = parseComplexFormula('Mg2(SiO4)');
    assert.strictEqual(res['Mg'], 2);
    assert.strictEqual(res['Si'], 1);
    assert.strictEqual(res['O'], 4);
  });

  test('should parse complex formula with hydration', () => {
    const res = parseComplexFormula('CaSO4·2H2O');
    assert.strictEqual(res['Ca'], 1);
    assert.strictEqual(res['S'], 1);
    assert.strictEqual(res['H'], 4);
    assert.strictEqual(res['O'], 6); // 4 from SO4 + 2 from 2H2O
  });

  test('should handle variables like x in Fe1-xS', () => {
    const res = parseComplexFormula('Fe1-xS');
    assert.strictEqual(res['Fe'], 1);
    assert.strictEqual(res['S'], 1);
  });
});

describe('Stoichiometry Calculations', () => {
  test('Olivine (Forsterite) calculation', () => {
    const input = [
      { Item: 'SiO2', 'wt%': 42.71 },
      { Item: 'MgO', 'wt%': 57.29 }
    ];
    const results = calculateOxideMode(input, mockAtomicWeights, 4);
    
    const forsterite = results.find(r => r.Item === 'MgO');
    const silica = results.find(r => r.Item === 'SiO2');
    
    // Forsterite (Mg2SiO4) should have Mg ~ 2, Si ~ 1
    assert.ok(Math.abs((forsterite?.['Atomic Ratio'] ?? 0) - 2.0) < 0.01);
    assert.ok(Math.abs((silica?.['Atomic Ratio'] ?? 0) - 1.0) < 0.01);
  });

  test('Fe3+ estimation using Droop method', () => {
    // Spinel (MgAl2O4) with some Fe
    const input = [
      { Item: 'FeO', 'wt%': 10.0 },
      { Item: 'Al2O3', 'wt%': 60.0 },
      { Item: 'MgO', 'wt%': 30.0 }
    ];
    // Ideal cations for spinel = 3, Oxygen = 4
    const results = calculateOxideMode(input, mockAtomicWeights, 4, 3);
    
    const fe2 = results.find(r => r.Item === 'FeO (est.)');
    const fe3 = results.find(r => r.Item === 'Fe2O3 (est.)');
    
    assert.ok(fe2 !== undefined || fe3 !== undefined);
  });
});

describe('Formula Generation', () => {
  test('should generate clean formula', () => {
    const results = [
      { Item: 'Si', 'Atomic Ratio': 1.0, 'wt%': 0, 'Atomic Weight': 0, 'Atomic Proportion': 0 },
      { Item: 'Mg', 'Atomic Ratio': 2.0, 'wt%': 0, 'Atomic Weight': 0, 'Atomic Proportion': 0 }
    ] as CalculationResult[];
    const formula = generateEmpiricalFormula(results, { mode: 'oxide', targetOxygen: 4 });
    assert.strictEqual(formula, 'Mg2SiO4');
  });
});
