import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
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

interface MineralProblem {
  name: string;
  input: { Item: string; "wt%": number }[];
  settings: {
    targetOxygen: number;
    idealCations?: number;
  };
  expected: {
    formulaMatch: RegExp;
    mineralName: string;
  };
}

const problems: MineralProblem[] = [
  {
    name: "Olivine (Forsteritic)",
    input: [
      { Item: "SiO2", "wt%": 40.82 },
      { Item: "MgO", "wt%": 50.84 },
      { Item: "FeO", "wt%": 8.34 }
    ],
    settings: { targetOxygen: 4 },
    expected: {
      formulaMatch: /Mg1\.\d*Fe0\.\d*Si\d*\.?\d*O4/,
      mineralName: "かんらん石"
    }
  },
  {
    name: "Pyrope Garnet",
    input: [
      { Item: "SiO2", "wt%": 44.82 },
      { Item: "Al2O3", "wt%": 25.35 },
      { Item: "MgO", "wt%": 20.05 },
      { Item: "FeO", "wt%": 9.78 }
    ],
    settings: { targetOxygen: 12 },
    expected: {
      formulaMatch: /Mg2\.\d*Fe0\.\d*Al2\.\d*Si3\.\d*O12/,
      mineralName: "パイロープ"
    }
  },
  {
    name: "Spinel with Fe3+ Estimation (Droop Method)",
    input: [
      { Item: "Al2O3", "wt%": 59.50 },
      { Item: "MgO", "wt%": 24.50 },
      { Item: "FeO", "wt%": 16.00 } // Total Fe as FeO
    ],
    settings: { targetOxygen: 4, idealCations: 3 },
    expected: {
      formulaMatch: /Mg0\.\d*Fe²⁺0\.\d*Fe³⁺0\.\d*Al1\.\d*O4/,
      mineralName: "スピネル"
    }
  }
];

describe('Mineral Calculation Verification (Challenge Problems)', () => {
  problems.forEach(prob => {
    test(`Verification: ${prob.name}`, () => {
      const results = calculateOxideMode(
        prob.input, 
        atomicWeights, 
        prob.settings.targetOxygen, 
        prob.settings.idealCations
      );
      
      const formula = generateEmpiricalFormula(results, { 
        mode: 'oxide', 
        targetOxygen: prob.settings.targetOxygen 
      });
      
      const candidates = identifyMineral(results, mineralDb);
      const topMatch = candidates[0];

      console.log(`\n--- ${prob.name} ---`);
      console.log(`Calculated Formula: ${formula}`);
      console.log(`Top Identification: ${topMatch.name} (Diff: ${topMatch.score.toFixed(6)})`);

      // Verify formula pattern
      assert.ok(
        prob.expected.formulaMatch.test(formula), 
        `Formula '${formula}' did not match expected pattern ${prob.expected.formulaMatch}`
      );

      // Verify identification
      assert.ok(
        topMatch.name.includes(prob.expected.mineralName), 
        `Top match '${topMatch.name}' did not contain expected mineral name '${prob.expected.mineralName}'`
      );
    });
  });
});
