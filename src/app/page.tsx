"use client";

import { useState, useMemo } from "react";
import { PeriodicTable } from "@/components/PeriodicTable";
import { periodicTableData } from "@/lib/periodicTableData";
import { 
  calculateElementMode, 
  calculateOxideMode, 
  generateEmpiricalFormula, 
  identifyMineral 
} from "@/lib/calculations";
import { mineralDb } from "@/lib/mineralDb";
import { CalculationResult } from "@/lib/types";

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mode, setMode] = useState<"element" | "oxide">("oxide");
  const [wtPercents, setWtPercents] = useState<Record<string, number>>({});
  const [targetOxygen, setTargetOxygen] = useState<number>(4.0);
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [formula, setFormula] = useState<string>("");
  const [candidates, setCandidates] = useState<{ name: string; score: number }[]>([]);

  const atomicWeightsMap = useMemo(() => {
    const map: Record<string, number> = {};
    periodicTableData.forEach(item => {
      map[item.symbol] = item.atomicWeight;
    });
    return map;
  }, []);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) => {
      const isSelected = prev.includes(item);
      if (isSelected) {
        const next = prev.filter((i) => i !== item);
        const { [item]: _, ...rest } = wtPercents;
        setWtPercents(rest);
        return next;
      } else {
        return [...prev, item];
      }
    });
  };

  const handleWtChange = (item: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWtPercents(prev => ({ ...prev, [item]: numValue }));
  };

  const totalWt = useMemo(() => {
    return Object.values(wtPercents).reduce((a, b) => a + b, 0);
  }, [wtPercents]);

  const handleCalculate = () => {
    const input = selectedItems.map(item => ({
      Item: item,
      "wt%": wtPercents[item] || 0
    }));

    let calcResults: CalculationResult[];
    if (mode === "oxide") {
      calcResults = calculateOxideMode(input, atomicWeightsMap, targetOxygen);
    } else {
      calcResults = calculateElementMode(input, atomicWeightsMap);
    }

    setResults(calcResults);
    setFormula(generateEmpiricalFormula(calcResults, mode === "oxide" ? targetOxygen : undefined));
    setCandidates(identifyMineral(calcResults, mineralDb).slice(0, 5));
  };

  return (
    <main className="min-h-screen bg-[#fafafa] p-4 md:p-12 font-sans text-gray-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-black">Mineral Calculator</h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            An integrated tool for mineral chemistry analysis. Select components, input wt%, and derive empirical formulas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Selection & Input */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">1. Select Components</h2>
                <div className="flex bg-gray-100 p-1 rounded-sm">
                  <button
                    onClick={() => setMode("element")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${
                      mode === "element" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Elements
                  </button>
                  <button
                    onClick={() => setMode("oxide")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${
                      mode === "oxide" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Oxides
                  </button>
                </div>
              </div>
              
              <PeriodicTable
                selectedItems={selectedItems}
                onToggleItem={toggleItem}
                mode={mode}
              />
            </section>

            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">2. Input Data (wt%)</h2>
              
              {selectedItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 font-semibold text-sm text-gray-600">Component</th>
                        <th className="py-3 font-semibold text-sm text-gray-600">Weight Percent (wt%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item) => (
                        <tr key={item} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 text-sm font-medium">{item}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              step="0.01"
                              value={wtPercents[item] || ""}
                              onChange={(e) => handleWtChange(item, e.target.value)}
                              className="w-full max-w-[200px] bg-gray-50 border border-gray-200 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                              placeholder="0.00"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-3 text-sm font-bold text-gray-900">Total</td>
                        <td className={`py-4 px-3 text-sm font-bold ${totalWt < 98 || totalWt > 102 ? 'text-orange-500' : 'text-green-600'}`}>
                          {totalWt.toFixed(2)} %
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic py-10 text-center border-2 border-dashed border-gray-50 rounded-sm">
                  Select elements or oxides from the periodic table above to start.
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Settings & Results */}
          <div className="space-y-8">
            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">3. Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Normalization Oxygen Count</label>
                  <input
                    type="number"
                    value={targetOxygen}
                    onChange={(e) => setTargetOxygen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
                    Used in Oxide mode to calculate cation ratios (e.g., 4 for Olivine, 24 for Garnet).
                  </p>
                </div>
                
                <button
                  onClick={handleCalculate}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-black text-white font-bold py-3 px-6 rounded-sm hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
                >
                  Run Calculation
                </button>
              </div>
            </section>

            {results && (
              <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Empirical Formula</h2>
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <code className="text-xl font-mono font-bold text-black break-all">
                      {formula || "N/A"}
                    </code>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Mineral Identification</h2>
                  <div className="space-y-2">
                    {candidates.map((cand, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-sm border ${idx === 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-100'}`}>
                        <span className="text-sm font-medium">{cand.name}</span>
                        <span className={`text-[10px] font-mono ${idx === 0 ? 'text-gray-400' : 'text-gray-300'}`}>
                          Diff: {cand.score.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {results && (
          <section className="mt-8 bg-white border border-gray-200 rounded-sm p-6 shadow-sm overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Detailed Calculation Table</h2>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">wt%</th>
                  {mode === "oxide" ? (
                    <>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Mol. Weight</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Mol. Prop</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Cation Prop</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Oxygen Prop</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">At. Weight</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">At. Prop</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">At. Ratio</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-bold">{res.Item}</td>
                    <td className="py-4 px-4 text-sm">{res["wt%"].toFixed(2)}</td>
                    {mode === "oxide" ? (
                      <>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Molecular Weight"]?.toFixed(3)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Molecular Proportion"]?.toFixed(4)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Cation Proportion"]?.toFixed(4)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Oxygen Proportion"]?.toFixed(4)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Atomic Weight"]?.toFixed(3)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{res["Atomic Proportion"]?.toFixed(4)}</td>
                      </>
                    )}
                    <td className="py-4 px-4 text-sm font-bold text-black">{res["Atomic Ratio"].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}
