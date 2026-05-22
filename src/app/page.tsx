"use client";

import { useState, useMemo, useEffect } from "react";
import { PeriodicTable } from "@/components/PeriodicTable";
import { FormulaDisplay } from "@/components/FormulaDisplay";
import { periodicTableData } from "@/lib/periodicTableData";
import { 
  calculateElementMode, 
  calculateOxideMode, 
  generateEmpiricalFormula, 
  identifyMineral,
  preParseMineralDb,
  ESTIMATABLE_ELEMENTS
} from "@/lib/calculations";
import { mineralDb as rawMineralDb } from "@/lib/mineralDb";
import { CalculationResult, IdentificationCandidate, OxideCalculationRow, ElementCalculationRow } from "@/lib/types";
import { Download, Info, History as HistoryIcon, ArrowUpDown, Trash2, X } from "lucide-react";
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
  const [candidates, setCandidates] = useState<IdentificationCandidate[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const [elNormMode, setElNormMode] = useState<"none" | "stoichiometric-oxygen" | "element-ratio" | "total-anions">("none");
  const [elTargetElement, setElTargetElement] = useState<string>("");
  const [elTargetValue, setElTargetValue] = useState<number>(1.0);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

    const identified = identifyMineral(calcResults, mineralDb).slice(0, 5);
    setFormula(currentFormula);
    setResults(calcResults);
    setCandidates(identified);

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
  };

  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("履歴をすべて削除しますか？")) {
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

  const exportToCSV = () => {
    if (!results) return;
    const headers = mode === "oxide" 
      ? ["Item", "wt%", "Mol. Weight", "Mol. Prop", "Cation Prop", "Oxygen Prop", "Atomic Ratio"]
      : ["Item", "wt%", "At. Weight", "At. Prop", "Atomic Ratio"];
    
    const rows = results.map(res => {
      if (mode === "oxide") {
        const r = res as OxideCalculationRow;
        return [r.Item, r["wt%"], r["Molecular Weight"], r["Molecular Proportion"], r["Cation Proportion"], r["Oxygen Proportion"], r["Atomic Ratio"]];
      } else {
        const r = res as ElementCalculationRow;
        return [r.Item, r["wt%"], r["Atomic Weight"], r["Atomic Proportion"], r["Atomic Ratio"]];
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
    <main className="min-h-screen bg-[#fafafa] p-4 md:p-12 font-sans text-gray-900 overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-black">Minera</h1>
            <p className="text-gray-500 max-w-2xl text-lg">
              地球科学・鉱物学のための化学組成計算ツール
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              <HistoryIcon size={16} />
              履歴
            </button>
          </div>
        </header>

        {/* History Sidebar */}
        <div className={cn(
          "fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col",
          isHistoryOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <HistoryIcon size={18} />
              計算履歴
            </h2>
            <div className="flex gap-2">
              <button onClick={clearHistory} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="すべて削除">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-20 text-gray-400 italic text-sm">
                履歴はありません
              </div>
            ) : (
              history.map(entry => (
                <div 
                  key={entry.id}
                  onClick={() => loadHistoryEntry(entry)}
                  className="group p-3 border border-gray-100 rounded-sm hover:border-black hover:bg-gray-50 cursor-pointer transition-all relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <button 
                      onClick={(e) => deleteHistoryEntry(entry.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="font-bold text-sm truncate mb-1">{entry.formula}</div>
                  <div className="text-[10px] text-gray-500 flex justify-between">
                    <span>{entry.mode === "oxide" ? "酸化物" : "元素"}</span>
                    <span className="truncate max-w-[120px] text-right">{entry.topCandidate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black/5 z-[90] backdrop-blur-[1px]" onClick={() => setIsHistoryOpen(false)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">1. 成分選択</h2>
                <div className="flex bg-gray-100 p-1 rounded-sm">
                  <button
                    onClick={() => setMode("element")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${
                      mode === "element" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    元素モード
                  </button>
                  <button
                    onClick={() => setMode("oxide")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${
                      mode === "oxide" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    酸化物モード
                  </button>
                </div>
              </div>
              
              <PeriodicTable selectedItems={selectedItems} onToggleItem={toggleItem} mode={mode} />
            </section>

            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">2. 分析データ入力 (wt%)</h2>
              
              {selectedItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 font-semibold text-sm text-gray-600">成分</th>
                        <th className="py-3 font-semibold text-sm text-gray-600">重量パーセント (wt%)</th>
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
                  上の周期表から成分を選択してください。
                </p>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">3. 計算設定</h2>
              <div className="space-y-4">
                {mode === "oxide" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">正規化酸素数</label>
                      <input
                        type="number"
                        value={targetOxygen}
                        onChange={(e) => setTargetOxygen(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-bold text-gray-500 uppercase">原子価（Mixed-valence）推定</label>
                        <input
                          type="checkbox"
                          checked={isEstimationEnabled}
                          onChange={(e) => setIsEstimationEnabled(e.target.checked)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                      </div>
                      
                      {isEstimationEnabled && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">対象元素</label>
                              <select
                                value={estimationElement}
                                onChange={(e) => setEstimationElement(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none"
                              >
                                {Object.keys(ESTIMATABLE_ELEMENTS).map(el => (
                                  <option key={el} value={el}>{el}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">理論的カチオン数</label>
                              <input
                                type="number"
                                value={idealCations}
                                onChange={(e) => setIdealCations(parseFloat(e.target.value) || 0)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                              />
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            電荷バランス法により {estimationElement} の原子価状態を推定します（例: スピネルなら 3, ざくろ石なら 8）。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">正規化モード</label>
                      <select
                        value={elNormMode}
                        onChange={(e) => setElNormMode(e.target.value as any)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="none">なし（未正規化）</option>
                        <option value="element-ratio">特定元素基準 (例: S=1)</option>
                        <option value="total-anions">全アニオン合計基準</option>
                        <option value="stoichiometric-oxygen">理論的酸素量基準</option>
                      </select>
                    </div>
                    {elNormMode === "element-ratio" && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={elTargetElement}
                          onChange={(e) => setElTargetElement(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-sm px-2 py-1.5 text-sm focus:outline-none"
                        >
                          <option value="">対象元素...</option>
                          {selectedItems.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <input
                          type="number"
                          value={elTargetValue}
                          onChange={(e) => setElTargetValue(parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-sm px-2 py-1.5 text-sm focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleCalculate}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-black text-white font-bold py-3 px-6 rounded-sm hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
                >
                  計算実行
                </button>
              </div>
            </section>

            {results && (
              <section className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">実験組成式 (Empirical Formula)</h2>
                  <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 flex items-center justify-center min-h-[80px]">
                    <FormulaDisplay formula={formula} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">鉱物同定候補</h2>
                    <Info size={14} className="text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    {candidates.map((cand, idx) => (
                      <div key={idx} className={`p-3 rounded-sm border transition-all ${idx === 0 ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold">{cand.name}</span>
                          <span className={`text-[10px] font-mono ${idx === 0 ? 'text-gray-400' : 'text-gray-300'}`}>
                            Diff: {cand.score.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-70">
                          <span>{cand.category}</span>
                          <span className="font-serif italic">{cand.formula}</span>
                        </div>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">詳細計算テーブル</h2>
              <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-sm hover:bg-gray-50 transition-all">
                <Download size={14} />
                CSVエクスポート
              </button>
            </div>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-black" onClick={() => handleSort("Item")}>
                    項目 <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-black" onClick={() => handleSort("wt%")}>
                    wt% <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                  {mode === "oxide" ? (
                    <>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">分子量</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">分子比</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">陽イオン比</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">酸素比</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">原子量</th>
                      <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">原子比</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-black" onClick={() => handleSort("Atomic Ratio")}>
                    原子数比 <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedResults?.map((res, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-bold">{res.Item}</td>
                    <td className="py-4 px-4 text-sm">{res["wt%"].toFixed(2)}</td>
                    {mode === "oxide" ? (
                      <>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as OxideCalculationRow)["Molecular Weight"]?.toFixed(3)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as OxideCalculationRow)["Molecular Proportion"]?.toFixed(4)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as OxideCalculationRow)["Cation Proportion"]?.toFixed(4)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as OxideCalculationRow)["Oxygen Proportion"]?.toFixed(4)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as ElementCalculationRow)["Atomic Weight"]?.toFixed(3)}</td>
                        <td className="py-4 px-4 text-sm font-mono text-gray-500">{(res as ElementCalculationRow)["Atomic Proportion"]?.toFixed(4)}</td>
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
