"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { PeriodicTable } from "@/components/PeriodicTable";
import { FormulaDisplay } from "@/components/FormulaDisplay";
import { periodicTableData } from "@/lib/periodicTableData";
import { 
  calculateElementMode, 
  calculateOxideMode, 
  generateEmpiricalFormula, 
  generateStructuralFormula,
  identifyMineral,
  preParseMineralDb,
  ESTIMATABLE_ELEMENTS,
  calculateEndMembers
} from "@/lib/calculations";
import { mineralDb as rawMineralDb } from "@/lib/mineralDb";
import { CalculationResult, IdentificationCandidate, OxideCalculationRow, ElementCalculationRow, EndMemberResult } from "@/lib/types";
import { Download, Info, History as HistoryIcon, ArrowUpDown, Trash2, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const mineralDb = preParseMineralDb(rawMineralDb);

type SortConfig = { key: keyof CalculationResult; direction: "asc" | "desc" } | null;

interface HistoryEntry {
  id: string;
  timestamp: number;
  mode: "element" | "oxide";
  selectedItems: string[];
  wtPercents: Record<string, number>;
  formula: string;
  topCandidate?: string;
  settings: {
    targetOxygen: number;
    isEstimationEnabled: boolean;
    estimationElement: string;
    idealCations: number;
    elNormMode: string;
  };
}

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mode, setMode] = useState<"element" | "oxide">("oxide");
  const [wtPercents, setWtPercents] = useState<Record<string, number>>({});
  const [targetOxygen, setTargetOxygen] = useState<number>(4.0);
  const [isEstimationEnabled, setIsEstimationEnabled] = useState<boolean>(false);
  const [estimationElement, setEstimationElement] = useState<string>("Fe");
  const [idealCations, setIdealCations] = useState<number>(3.0);
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [formula, setFormula] = useState<string>("");
  const [structuralFormula, setStructuralFormula] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<IdentificationCandidate[]>([]);
  const [endMemberResult, setEndMemberResult] = useState<EndMemberResult | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const [elNormMode, setElNormMode] = useState<"none" | "stoichiometric-oxygen" | "element-ratio" | "total-anions">("none");
  const [elTargetElement, setElTargetElement] = useState<string>("");
  const [elTargetValue, setElTargetValue] = useState<number>(1.0);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Refs for auto-scrolling
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const section4Ref = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("minera-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("minera-history", JSON.stringify(history));
  }, [history]);

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
        const nextWtPercents = { ...wtPercents };
        delete nextWtPercents[item];
        setWtPercents(nextWtPercents);
        if (elTargetElement === item) setElTargetElement("");
        return next;
      } else {
        const next = [...prev, item];
        if (!elTargetElement) setElTargetElement(item);
        return next;
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

    if (input.length === 0) return;

    let calcResults: CalculationResult[];
    let currentFormula = "";
    if (mode === "oxide") {
      calcResults = calculateOxideMode(
        input, 
        atomicWeightsMap, 
        targetOxygen, 
        isEstimationEnabled ? { idealCations, elementSymbol: estimationElement } : undefined
      );
      currentFormula = generateEmpiricalFormula(calcResults, { mode: "oxide", targetOxygen });
    } else {
      const norm = elNormMode === "none" ? undefined : {
        mode: elNormMode,
        targetValue: elNormMode === "element-ratio" ? elTargetValue : targetOxygen,
        targetElement: elTargetElement
      };
      calcResults = calculateElementMode(input, atomicWeightsMap, norm);
      currentFormula = generateEmpiricalFormula(calcResults, { 
        mode: "element", 
        targetOxygen: (elNormMode === "stoichiometric-oxygen" || elNormMode === "total-anions") ? targetOxygen : undefined,
        normalizationMode: elNormMode === "none" ? undefined : (elNormMode === "total-anions" ? "element-ratio" : elNormMode)
      });
    }

    const identified = identifyMineral(calcResults, mineralDb);
    const topCandidate = identified[0];
    const rawMineralData = rawMineralDb.find(m => m.nameEN === topCandidate.nameEN);
    
    setFormula(currentFormula);
    if (rawMineralData && rawMineralData.sites) {
      setStructuralFormula(generateStructuralFormula(calcResults, rawMineralData, mode === "oxide" ? targetOxygen : undefined));
    } else {
      setStructuralFormula(null);
    }
    setResults(calcResults);
    setCandidates(identified.slice(0, 5));

    // End-member calculation
    if (topCandidate) {
      setEndMemberResult(calculateEndMembers(calcResults, topCandidate.nameEN));
    } else {
      setEndMemberResult(null);
    }

    // Save to history
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      mode,
      selectedItems: [...selectedItems],
      wtPercents: { ...wtPercents },
      formula: currentFormula,
      topCandidate: identified[0]?.name,
      settings: {
        targetOxygen,
        isEstimationEnabled,
        estimationElement,
        idealCations,
        elNormMode
      }
    };
    setHistory(prev => [entry, ...prev].slice(0, 50));

    // Auto-scroll to results
    setTimeout(() => scrollToSection(section4Ref), 100);
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setMode(entry.mode);
    setSelectedItems(entry.selectedItems);
    setWtPercents(entry.wtPercents);
    setTargetOxygen(entry.settings.targetOxygen);
    setIsEstimationEnabled(entry.settings.isEstimationEnabled);
    setEstimationElement(entry.settings.estimationElement);
    setIdealCations(entry.settings.idealCations);
    setElNormMode(entry.settings.elNormMode as any);
    setIsHistoryOpen(false);
    setResults(null);
    setEndMemberResult(null);
  };

  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all calculation history?")) {
      setHistory([]);
    }
  };

  const sortedResults = useMemo(() => {
    if (!results || !sortConfig) return results;
    const sorted = [...results].sort((a, b) => {
      const aVal = (a[sortConfig.key] as number) ?? 0;
      const bVal = (b[sortConfig.key] as number) ?? 0;
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [results, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      const typedKey = key as keyof CalculationResult;
      if (prev?.key === typedKey) {
        if (prev.direction === "asc") return { key: typedKey, direction: "desc" };
        return null;
      }
      return { key: typedKey, direction: "asc" };
    });
  };

  const totals = useMemo(() => {
    if (!results) return null;
    return results.reduce((acc, res) => ({
      wt: acc.wt + res["wt%"],
      cation: acc.cation + res["Atomic Ratio"],
      oxygen: acc.oxygen + (res["Oxygen Ratio"] || 0)
    }), { wt: 0, cation: 0, oxygen: 0 });
  }, [results]);

  const exportToCSV = () => {
    if (!results) return;
    const headers = mode === "oxide" 
      ? ["Item", "wt%", "Mol. Weight", "Mol. Prop", "Cation Prop", "Oxygen Prop", "Oxy. Ratio", "At. Ratio"]
      : ["Item", "wt%", "At. Weight", "At. Prop", "Oxy. Ratio", "At. Ratio"];
    
    const rows = results.map(res => {
      if (mode === "oxide") {
        const r = res as OxideCalculationRow;
        return [r.Item, r["wt%"], r["Molecular Weight"], r["Molecular Proportion"], r["Cation Proportion"], r["Oxygen Proportion"], r["Oxygen Ratio"], r["Atomic Ratio"]];
      } else {
        const r = res as ElementCalculationRow;
        return [r.Item, r["wt%"], r["Atomic Weight"], r["Atomic Proportion"], r["Oxygen Ratio"], r["Atomic Ratio"]];
      }
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `minera_results_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-zinc-100/50 p-4 md:p-8 lg:p-12 font-sans text-zinc-800 overflow-x-hidden">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-zinc-900">Minera</h1>
            <p className="text-zinc-700 max-w-2xl text-lg leading-snug">
              Geochemical Formula Calculator & Mineral Identification Tool
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-zinc-700 bg-zinc-50 border border-zinc-300 rounded-sm hover:bg-zinc-100 hover:border-zinc-400 transition-all shadow-sm active:scale-[0.98]"
            >
              <HistoryIcon size={16} />
              History
            </button>
          </div>
        </header>

        {/* History Sidebar */}
        <div className={cn(
          "fixed inset-y-0 right-0 w-80 bg-zinc-50 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out border-l border-zinc-300 flex flex-col",
          isHistoryOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2 text-zinc-900">
              <HistoryIcon size={18} />
              Calculation History
            </h2>
            <div className="flex gap-2">
              <button onClick={clearHistory} className="p-2 text-zinc-500 hover:text-red-600 transition-colors" title="Clear all">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 italic text-sm font-medium">
                No history yet
              </div>
            ) : (
              history.map(entry => (
                <div 
                  key={entry.id}
                  onClick={() => loadHistoryEntry(entry)}
                  className="group p-4 border border-zinc-200 rounded-sm hover:border-zinc-900 hover:bg-zinc-100 cursor-pointer transition-all relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <button 
                      onClick={(e) => deleteHistoryEntry(entry.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="font-bold text-sm truncate mb-1 text-zinc-900">{entry.formula}</div>
                  <div className="text-[10px] text-zinc-600 flex justify-between">
                    <span className="uppercase tracking-wider font-bold opacity-80">{entry.mode === "oxide" ? "Oxide" : "Element"}</span>
                    <span className="truncate max-w-[120px] text-right">{entry.topCandidate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-zinc-900/10 z-[90] backdrop-blur-[1px]" onClick={() => setIsHistoryOpen(false)} />
        )}

        <div className="space-y-12 pb-40">
          {/* 1. Component Selection */}
          <section ref={section1Ref} className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm scroll-mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-zinc-200 pb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">1. Select Components</h2>
              <div className="flex bg-zinc-100 p-1 rounded-sm w-full sm:w-auto shadow-inner border border-zinc-200">
                <button
                  onClick={() => setMode("element")}
                  className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest rounded-sm transition-all ${
                    mode === "element" ? "bg-zinc-50 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setMode("oxide")}
                  className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest rounded-sm transition-all ${
                    mode === "oxide" ? "bg-zinc-50 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  Oxides
                </button>
              </div>
            </div>
            
            <div className="w-full">
              <PeriodicTable selectedItems={selectedItems} onToggleItem={toggleItem} mode={mode} />
            </div>

            <div className="mt-10 flex justify-center border-t border-zinc-200 pt-8">
              <button 
                onClick={() => scrollToSection(section2Ref)}
                disabled={selectedItems.length === 0}
                className="group flex flex-col items-center gap-2 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-all disabled:opacity-0"
              >
                Go to Input Phase
                <ChevronDown size={22} className="group-hover:translate-y-1.5 transition-transform" />
              </button>
            </div>
          </section>

          {/* 2. Analytical Data Input */}
          <section ref={section2Ref} className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm scroll-mt-8">
            <div className="mb-8 border-b border-zinc-200 pb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">2. Analytical Data Input (wt%)</h2>
            </div>
            
            {selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-zinc-200">
                      <th className="py-4 px-2 font-bold text-xs uppercase tracking-widest text-zinc-600">Component</th>
                      <th className="py-4 px-2 font-bold text-xs uppercase tracking-widest text-zinc-600">Weight Percent (wt%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item) => (
                      <tr key={item} className="border-b border-zinc-100 hover:bg-zinc-100 transition-colors group">
                        <td className="py-5 px-2 text-sm font-bold text-zinc-800">{item}</td>
                        <td className="py-3 px-2">
                          <div className="relative max-w-[240px]">
                            <input
                              type="number"
                              step="0.01"
                              value={wtPercents[item] || ""}
                              onChange={(e) => handleWtChange(item, e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                              placeholder="0.00"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 group-focus-within:text-zinc-600">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-zinc-100 border-t-2 border-zinc-200">
                      <td className="py-6 px-4 text-xs font-black uppercase tracking-widest text-zinc-900">Total Composition</td>
                      <td className={`py-6 px-4 text-sm font-mono font-black ${totalWt < 98 || totalWt > 102 ? 'text-orange-600' : 'text-zinc-900'}`}>
                        {totalWt.toPrecision(5)} %
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm font-medium italic py-16 text-center border-2 border-dashed border-zinc-200 rounded-sm">
                Please select components from the periodic table above.
              </p>
            )}

            {selectedItems.length > 0 && (
              <div className="mt-10 flex justify-center border-t border-zinc-200 pt-8">
                <button 
                  onClick={() => scrollToSection(section3Ref)}
                  className="group flex flex-col items-center gap-2 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-all"
                >
                  Go to Calculation Settings
                  <ChevronDown size={22} className="group-hover:translate-y-1.5 transition-transform" />
                </button>
              </div>
            )}
          </section>

          {/* 3. Calculation Settings */}
          <section ref={section3Ref} className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm scroll-mt-8">
            <div className="mb-8 border-b border-zinc-200 pb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">3. Calculation Settings</h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
              {mode === "oxide" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 text-center md:text-left italic">
                      Normalization Basis
                    </label>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">On basis of</span>
                      <input
                        type="number"
                        value={targetOxygen}
                        onChange={(e) => setTargetOxygen(parseFloat(e.target.value) || 0)}
                        className="w-20 bg-zinc-50 border border-zinc-300 rounded-sm px-2 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-center"
                      />
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">oxygens</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Mixed-valence Estimation</label>
                      <input
                        type="checkbox"
                        checked={isEstimationEnabled}
                        onChange={(e) => setIsEstimationEnabled(e.target.checked)}
                        className="w-5 h-5 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900 cursor-pointer transition-all"
                      />
                    </div>
                    
                    {isEstimationEnabled && (
                      <div className="animate-in fade-in zoom-in-95 duration-200 bg-zinc-100 p-4 rounded-sm border border-zinc-200 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5 text-center">Element</label>
                            <select
                              value={estimationElement}
                              onChange={(e) => setEstimationElement(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:border-zinc-900 transition-all cursor-pointer font-bold"
                            >
                              {Object.keys(ESTIMATABLE_ELEMENTS).map(el => (
                                <option key={el} value={el}>{el}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5 text-center">Ideal Cations</label>
                            <input
                              type="number"
                              value={idealCations}
                              onChange={(e) => setIdealCations(parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-gray-200 rounded-sm px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-zinc-900 transition-all text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 text-center md:text-left">Normalization Mode</label>
                    <select
                      value={elNormMode}
                      onChange={(e) => setElNormMode(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-all cursor-pointer font-bold"
                    >
                      <option value="none">None (Raw Ratios)</option>
                      <option value="element-ratio">Specific Element (e.g. S=1)</option>
                      <option value="total-anions">Total Anions Sum</option>
                      <option value="stoichiometric-oxygen">Stoichiometric Oxygen</option>
                    </select>
                  </div>
                  {elNormMode === "element-ratio" && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-2 text-center">Target</label>
                        <select
                          value={elTargetElement}
                          onChange={(e) => setElTargetElement(e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 transition-all cursor-pointer text-center"
                        >
                          <option value="">Select...</option>
                          {selectedItems.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-2 text-center">Value</label>
                        <input
                          type="number"
                          value={elTargetValue}
                          onChange={(e) => setElTargetValue(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:border-zinc-900 transition-all text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center border-t border-zinc-200 pt-12 gap-6">
              <button
                onClick={handleCalculate}
                disabled={selectedItems.length === 0}
                className="group relative bg-zinc-900 text-zinc-50 font-black uppercase tracking-[0.25em] py-5 px-16 rounded-sm hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all shadow-2xl shadow-zinc-900/20 active:scale-[0.98] flex flex-col items-center gap-4 overflow-hidden min-w-[280px]"
              >
                <span className="relative z-10 text-sm">Run Calculation</span>
                <ChevronDown size={24} className="group-hover:translate-y-1 transition-transform opacity-70" />
              </button>
              <p className="text-[10px] font-black text-zinc-400 text-center uppercase tracking-widest">
                * Auto-saved to history
              </p>
            </div>
          </section>

          {/* 4. Results */}
          {results && (
            <section ref={section4Ref} className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm space-y-12 animate-in border-l-4 border-l-zinc-900 overflow-hidden scroll-mt-8">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 text-center border-b border-zinc-200 pb-4">Empirical Formula</h2>
                  <div className="bg-zinc-100 p-8 md:p-12 rounded-sm border border-zinc-200 flex items-center justify-center min-h-[120px] transition-all">
                    <FormulaDisplay formula={formula} />
                  </div>
                </div>

                {structuralFormula && (
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 text-center border-b border-zinc-200 pb-4 italic">Structural Formula (Site-Grouped)</h2>
                    <div className="bg-zinc-900 p-8 md:p-12 rounded-sm border border-zinc-800 flex items-center justify-center min-h-[120px] shadow-2xl transition-all">
                      <FormulaDisplay formula={structuralFormula} isDark />
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-zinc-500 leading-relaxed italic text-center uppercase tracking-wider">
                      Crystallographic sites automatically assigned
                    </p>
                  </div>
                )}

                {endMemberResult && (
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 text-center border-b border-zinc-200 pb-4">End-member Notation</h2>
                    <div className="bg-zinc-100 p-8 md:p-12 rounded-sm border border-zinc-200 flex items-center justify-center min-h-[100px] transition-all">
                      <div className="text-3xl font-serif tracking-tighter text-zinc-900 select-all">
                        {endMemberResult.notation.split(/(\d+)/).map((part, i) => 
                          /^\d+$/.test(part) ? <sub key={i} className="text-[0.6em] ml-0.5 mr-0.5">{part}</sub> : <span key={i}>{part}</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-zinc-500 leading-relaxed italic text-center uppercase tracking-wider">
                      Normalized for major end-members
                    </p>
                  </div>
                )}

                <div className="pt-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-6 px-1">Mineral Identification Candidates</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates.map((cand, idx) => (
                      <div key={idx} className={cn(
                        "p-5 rounded-sm border transition-all flex flex-col justify-between min-h-[110px]",
                        idx === 0 
                          ? "bg-zinc-900 text-zinc-50 border-zinc-900 shadow-xl ring-4 ring-zinc-900/5 ring-offset-4 scale-[1.01]" 
                          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:shadow-sm"
                      )}>
                        <div className="mb-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-black leading-tight">{cand.name}</span>
                            <span className={cn(
                              "shrink-0 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5",
                              idx === 0 ? "bg-zinc-50/10 text-zinc-50/90" : "bg-zinc-100 text-zinc-600"
                            )}>
                              <span className="text-[11px] leading-none">
                                {(cand.matchPercentage ?? 0) > 99.99 ? "◎" : (cand.matchPercentage ?? 0) >= 95 ? "○" : "Δ"}
                              </span>
                              <span>{(cand.matchPercentage ?? 0).toFixed(1)}% Match</span>
                            </span>
                          </div>
                          <div className="text-[10px] mt-2 opacity-70 font-bold uppercase tracking-wider">{cand.category}</div>
                        </div>
                        <div className="text-xs font-serif italic truncate pt-3 border-t border-current/20">{cand.formula}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Detailed Calculation Table */}
          {results && (
            <section className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 scroll-mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-zinc-200 pb-6">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">Detailed Calculation Table</h2>
                <button onClick={exportToCSV} className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-700 bg-zinc-50 border border-zinc-300 rounded-sm hover:bg-zinc-100 hover:border-zinc-400 transition-all shadow-sm active:scale-[0.98]">
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-zinc-200 bg-zinc-100">
                      <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em] cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => handleSort("Item")}>
                        Item <ArrowUpDown size={10} className="inline ml-1" />
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em] cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => handleSort("wt%")}>
                        wt% <ArrowUpDown size={10} className="inline ml-1" />
                      </th>
                      {mode === "oxide" ? (
                        <>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Mol. Weight</th>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Mol. Prop</th>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Cation Prop</th>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Oxygen Prop</th>
                        </>
                      ) : (
                        <>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">At. Weight</th>
                          <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">At. Prop</th>
                        </>
                      )}
                      <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em] cursor-pointer hover:text-zinc-900 transition-colors">
                        Oxy. Ratio
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em] cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => handleSort("Atomic Ratio")}>
                        At. Ratio <ArrowUpDown size={10} className="inline ml-1" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults?.map((res, i) => (
                      <tr key={i} className="border-b border-zinc-200 hover:bg-zinc-100 transition-colors group">
                        <td className="py-5 px-4 text-sm font-black text-zinc-900">{res.Item}</td>
                        <td className="py-5 px-4 text-sm font-mono text-zinc-800">{res["wt%"].toPrecision(5)}</td>
                        {mode === "oxide" ? (
                          <>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-zinc-900 transition-colors">{(res as OxideCalculationRow)["Molecular Weight"]?.toPrecision(5)}</td>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-zinc-900 transition-colors">{(res as OxideCalculationRow)["Molecular Proportion"]?.toPrecision(5)}</td>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-zinc-900 transition-colors">{(res as OxideCalculationRow)["Cation Proportion"]?.toPrecision(5)}</td>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-zinc-900 transition-colors">{(res as OxideCalculationRow)["Oxygen Proportion"]?.toPrecision(5)}</td>
                          </>
                        ) : (
                          <>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-gray-900 transition-colors">{(res as ElementCalculationRow)["Atomic Weight"]?.toPrecision(5)}</td>
                            <td className="py-5 px-4 text-xs font-mono text-zinc-600 group-hover:text-gray-900 transition-colors">{(res as ElementCalculationRow)["Atomic Proportion"]?.toPrecision(5)}</td>
                          </>
                        )}
                        <td className="py-5 px-4 text-sm font-mono text-zinc-500 group-hover:text-zinc-900 transition-colors">
                          {res["Oxygen Ratio"]?.toPrecision(5) || "-"}
                        </td>
                        <td className="py-5 px-4 text-sm font-mono font-black text-zinc-950">{res["Atomic Ratio"].toPrecision(5)}</td>
                      </tr>
                    ))}
                  </tbody>
                  {totals && (
                    <tfoot className="bg-zinc-100 font-black border-t-2 border-zinc-200">
                      <tr>
                        <td className="py-5 px-4 text-[10px] uppercase tracking-widest text-zinc-900">Total Sum</td>
                        <td className="py-5 px-4 text-sm font-mono">{totals.wt.toPrecision(5)}</td>
                        {mode === "oxide" ? <td colSpan={4}></td> : <td colSpan={2}></td>}
                        <td className="py-5 px-4 text-sm font-mono text-zinc-900">{totals.oxygen.toPrecision(6)}</td>
                        <td className="py-5 px-4 text-sm font-mono text-zinc-950">{totals.cation.toPrecision(6)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      <footer className="mt-20 border-t border-zinc-200 bg-zinc-50 py-12 px-6">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm font-bold text-zinc-900">Minera </span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-center md:text-left">
              © 2026 Asahi Fukumoto. Released under the MIT License.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/petrologyF/Minera" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-zinc-900 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
