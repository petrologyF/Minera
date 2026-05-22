import { test, describe, expect } from 'vitest';
import { 
  parseComplexFormula, 
  calculateOxideMode, 
  generateEmpiricalFormula 
} from '../src/lib/calculations';
import { CalculationResult } from '../src/lib/types';


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
    expect(res['Si']).toBe(1);
    expect(res['O']).toBe(2);
  });

  test('should parse formula with parentheses', () => {
    const res = parseComplexFormula('Mg2(SiO4)');
    expect(res['Mg']).toBe(2);
    expect(res['Si']).toBe(1);
    expect(res['O']).toBe(4);
  });

  test('should parse complex formula with hydration', () => {
    const res = parseComplexFormula('CaSO4·2H2O');
    expect(res['Ca']).toBe(1);
    expect(res['S']).toBe(1);
    expect(res['H']).toBe(4);
    expect(res['O']).toBe(6); // 4 from SO4 + 2 from 2H2O
  });

  test('should handle variables like x in Fe1-xS', () => {
    const res = parseComplexFormula('Fe1-xS');
    expect(res['Fe']).toBe(1);
    expect(res['S']).toBe(1);
  });
});

describe('Stoichiometry Calculations', () => {
  test('Olivine (Forsterite) calculation', () => {
    const input = [
      { Item: 'SiO2', 'wt%': 42.71 },
      { Item: 'MgO', 'wt%': 57.29 }
    ];
    const results = calculateOxideMode(input, mockAtomicWeights, 4);
    
    const forsterite = results.find(r => r.Item === 'Mg');
    const silica = results.find(r => r.Item === 'Si');
    
    // Forsterite (Mg2SiO4) should have Mg ~ 2, Si ~ 1
    expect(Math.abs((forsterite?.['Atomic Ratio'] ?? 0) - 2.0)).toBeLessThan(0.01);
    expect(Math.abs((silica?.['Atomic Ratio'] ?? 0) - 1.0)).toBeLessThan(0.01);
  });

  test('Fe3+ estimation using Droop method', () => {
    // Spinel (MgAl2O4) with some Fe
    const input = [
      { Item: 'FeO', 'wt%': 10.0 },
      { Item: 'Al2O3', 'wt%': 60.0 },
      { Item: 'MgO', 'wt%': 30.0 }
    ];
    // Ideal cations for spinel = 3, Oxygen = 4
    const results = calculateOxideMode(input, mockAtomicWeights, 4, { idealCations: 3, elementSymbol: "Fe" });
    
    const fe2 = results.find(r => r.Item.includes('Fe²⁺'));
    const fe3 = results.find(r => r.Item.includes('Fe³⁺'));
    
    expect(fe2 !== undefined || fe3 !== undefined).toBe(true);
  });
});

describe('Formula Generation', () => {
  test('should generate clean formula', () => {
    const results = [
      { Item: 'Si', 'Atomic Ratio': 1.0, 'wt%': 0, 'Atomic Weight': 0, 'Atomic Proportion': 0 },
      { Item: 'Mg', 'Atomic Ratio': 2.0, 'wt%': 0, 'Atomic Weight': 0, 'Atomic Proportion': 0 }
    ] as CalculationResult[];
    const formula = generateEmpiricalFormula(results, { mode: 'oxide', targetOxygen: 4 });
    expect(formula).toBe('Mg2SiO4');
  });
});
