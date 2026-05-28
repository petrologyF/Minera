"use client";

import React from "react";
import { EndMemberResult } from "@/lib/types";

interface EndMemberPlotProps {
  result: EndMemberResult;
  mineralName: string;
}

export const EndMemberPlot: React.FC<EndMemberPlotProps> = ({ result, mineralName }) => {
  const name = mineralName.toLowerCase();
  
  if (name.includes("olivine") || name.includes("forsterite") || name.includes("fayalite") || name.includes("tephroite")) {
    const fo = result.components.find(c => c.symbol === "Fo")?.percentage || 0;
    const fa = result.components.find(c => c.symbol === "Fa")?.percentage || 0;
    const te = result.components.find(c => c.symbol === "Te")?.percentage || 0;
    const total = fo + fa + te;
    
    return (
      <div className="w-full max-w-md mx-auto space-y-4 px-2">
        <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <span>Fo</span>
          <span>Fa</span>
        </div>
        <div className="h-5 md:h-6 w-full bg-zinc-200 rounded-full overflow-hidden flex shadow-inner border border-zinc-300">
          <div 
            style={{ width: `${(fo / (total || 1)) * 100}%` }} 
            className="bg-green-600 h-full transition-all duration-500 flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold"
            title={`Fo: ${fo.toFixed(1)}%`}
          >
            {fo > 15 && `Fo${Math.round(fo)}`}
          </div>
          <div 
            style={{ width: `${(fa / (total || 1)) * 100}%` }} 
            className="bg-orange-800 h-full transition-all duration-500 flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold"
            title={`Fa: ${fa.toFixed(1)}%`}
          >
            {fa > 15 && `Fa${Math.round(fa)}`}
          </div>
          <div 
            style={{ width: `${(te / (total || 1)) * 100}%` }} 
            className="bg-pink-600 h-full transition-all duration-500 flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold"
            title={`Te: ${te.toFixed(1)}%`}
          >
            {te > 15 && `Te${Math.round(te)}`}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-600">Forsterite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-orange-800 rounded-full" />
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-600">Fayalite</span>
          </div>
          {te > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />
              <span className="text-[9px] md:text-[10px] font-bold text-zinc-600">Tephroite</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (name.includes("garnet") || name.includes("pyrope") || name.includes("almandine") || name.includes("spessartine") || name.includes("grossular")) {
    const py = result.components.find(c => c.symbol === "Py")?.percentage || 0;
    const al = result.components.find(c => c.symbol === "Al")?.percentage || 0;
    const sp = result.components.find(c => c.symbol === "Sp")?.percentage || 0;
    const gr = result.components.find(c => c.symbol === "Gr")?.percentage || 0;
    const total = py + al + sp + gr;

    return (
      <div className="w-full max-w-md mx-auto space-y-4 px-2">
        <h3 className="text-[9px] md:text-[10px] font-black text-center uppercase tracking-[0.2em] text-zinc-400">Garnet End-members</h3>
        <div className="h-5 md:h-6 w-full bg-zinc-200 rounded-full overflow-hidden flex shadow-inner border border-zinc-300">
          <div style={{ width: `${(py / (total || 1)) * 100}%` }} className="bg-red-700 h-full transition-all flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold">
            {py > 12 && `Py${Math.round(py)}`}
          </div>
          <div style={{ width: `${(al / (total || 1)) * 100}%` }} className="bg-red-900 h-full transition-all flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold">
            {al > 12 && `Al${Math.round(al)}`}
          </div>
          <div style={{ width: `${(sp / (total || 1)) * 100}%` }} className="bg-orange-500 h-full transition-all flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold">
            {sp > 12 && `Sp${Math.round(sp)}`}
          </div>
          <div style={{ width: `${(gr / (total || 1)) * 100}%` }} className="bg-emerald-700 h-full transition-all flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold">
            {gr > 12 && `Gr${Math.round(gr)}`}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1.5">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-700 rounded-full"/><span className="text-[7px] md:text-[8px] font-bold text-zinc-600">Pyrope</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-900 rounded-full"/><span className="text-[7px] md:text-[8px] font-bold text-zinc-600">Almandine</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-500 rounded-full"/><span className="text-[7px] md:text-[8px] font-bold text-zinc-600">Spessartine</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-700 rounded-full"/><span className="text-[7px] md:text-[8px] font-bold text-zinc-600">Grossular</span></div>
        </div>
      </div>
    );
  }

  if (name.includes("pyroxene") || name.includes("diopside") || name.includes("hedenbergite") || name.includes("enstatite") || name.includes("ferrosilite") || name.includes("augite") || name.includes("feldspar") || name.includes("albite") || name.includes("anorthite") || name.includes("orthoclase") || name.includes("plagioclase")) {
    const isFeldspar = name.includes("feldspar") || name.includes("albite") || name.includes("anorthite") || name.includes("orthoclase") || name.includes("plagioclase");
    
    const top = isFeldspar ? (result.components.find(c => c.symbol === "An")?.percentage || 0) : (result.components.find(c => c.symbol === "Wo")?.percentage || 0);
    const left = isFeldspar ? (result.components.find(c => c.symbol === "Or")?.percentage || 0) : (result.components.find(c => c.symbol === "En")?.percentage || 0);
    const right = isFeldspar ? (result.components.find(c => c.symbol === "Ab")?.percentage || 0) : (result.components.find(c => c.symbol === "Fs")?.percentage || 0);
    
    const topLabel = isFeldspar ? "An" : "Wo";
    const leftLabel = isFeldspar ? "Or" : "En";
    const rightLabel = isFeldspar ? "Ab" : "Fs";

    const sum = top + left + right;
    const normTop = (top / (sum || 1)) * 100;
    const normRight = (right / (sum || 1)) * 100;

    const x = (normRight + (normTop / 2)) / 100;
    const y = (normTop * 0.866) / 100;

    return (
      <div className="w-full max-w-[240px] md:max-w-[280px] mx-auto space-y-4">
        <div className="relative aspect-[1/0.866] w-full border-b-2 border-zinc-900">
          <svg viewBox="0 0 100 86.6" className="w-full h-full overflow-visible">
            <polygon points="50,0 0,86.6 100,86.6" fill="none" stroke="#d1d5db" strokeWidth="1" />
            <line x1="25" y1="43.3" x2="75" y2="43.3" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="50" y1="86.6" x2="75" y2="43.3" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="50" y1="86.6" x2="25" y2="43.3" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
            
            <text x="50" y="-5" textAnchor="middle" className="text-[6px] font-black fill-zinc-900">{topLabel}</text>
            <text x="-5" y="92" textAnchor="middle" className="text-[6px] font-black fill-zinc-900">{leftLabel}</text>
            <text x="105" y="92" textAnchor="middle" className="text-[6px] font-black fill-zinc-900">{rightLabel}</text>
            
            <circle cx={x * 100} cy={86.6 - (y * 100)} r="2.5" className="fill-red-600 stroke-white stroke-[0.5] shadow-lg animate-pulse" />
          </svg>
        </div>
        <div className="flex justify-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
          <span>{topLabel}:{Math.round(top)}</span>
          <span>{leftLabel}:{Math.round(left)}</span>
          <span>{rightLabel}:{Math.round(right)}</span>
        </div>
      </div>
    );
  }

  return null;
};
