"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { periodicTableData } from "@/lib/periodicTableData";
import { ElementData, ElementCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PeriodicTableProps {
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  mode: "element" | "oxide";
}

const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "border-red-200 bg-red-50 text-red-900 hover:bg-red-100 data-[state=on]:bg-red-600 data-[state=on]:border-red-700",
  "alkaline-earth": "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 data-[state=on]:bg-orange-600 data-[state=on]:border-orange-700",
  "transition-metal": "border-yellow-200 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 data-[state=on]:bg-yellow-600 data-[state=on]:border-yellow-700",
  "post-transition-metal": "border-green-200 bg-green-50 text-green-900 hover:bg-green-100 data-[state=on]:bg-green-600 data-[state=on]:border-green-700",
  "metalloid": "border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 data-[state=on]:bg-teal-600 data-[state=on]:border-teal-700",
  "nonmetal": "border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:border-blue-700",
  "halogen": "border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 data-[state=on]:bg-indigo-600 data-[state=on]:border-indigo-700",
  "noble-gas": "border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 data-[state=on]:bg-purple-600 data-[state=on]:border-purple-700",
  "lanthanide": "border-pink-200 bg-pink-50 text-pink-900 hover:bg-pink-100 data-[state=on]:bg-pink-600 data-[state=on]:border-pink-700",
  "actinide": "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100 data-[state=on]:bg-rose-600 data-[state=on]:border-rose-700",
};

const renderFormula = (formula: string) => {
  if (!formula) return "";
  const parts = formula.split(/(\d+)/);
  return parts.map((part, index) => {
    if (/\d+/.test(part)) {
      return <sub key={index} className="bottom-0 text-[0.8em]">{part}</sub>;
    }
    return part;
  });
};

const ElementCell = memo(({ 
  item, 
  selectedItems, 
  onToggle, 
  mode 
}: { 
  item: ElementData; 
  selectedItems: string[]; 
  onToggle: (id: string) => void;
  mode: "element" | "oxide";
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close selection popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (mode === "oxide" && !item.commonOxide) {
    return (
      <div 
        style={{ gridColumnStart: item.group, gridRowStart: item.period }}
        className="w-full h-full border border-transparent"
      />
    );
  }

  const categoryClass = item.category ? CATEGORY_COLORS[item.category] : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100";
  
  const currentOxides = [item.commonOxide, ...(item.alternativeOxides || [])];
  const selectedCount = currentOxides.filter(ox => selectedItems.includes(ox)).length;
  const isSelected = mode === "element" ? selectedItems.includes(item.symbol) : selectedCount > 0;

  const handleMainClick = () => {
    if (mode === "oxide" && item.alternativeOxides?.length) {
      setShowOptions(!showOptions);
    } else {
      onToggle(mode === "element" ? item.symbol : item.commonOxide);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ gridColumnStart: item.group, gridRowStart: item.period }}
      className="p-0.5 h-14 relative"
    >
      <Toggle
        pressed={isSelected}
        onPressedChange={handleMainClick}
        aria-label={`${item.name} (${item.symbol})`}
        className={cn(
          "w-full h-full flex flex-col items-center justify-center border rounded-sm transition-all duration-200 p-1 relative",
          "data-[state=on]:text-white shadow-sm data-[state=on]:ring-2 data-[state=on]:ring-offset-2 data-[state=on]:ring-zinc-900 data-[state=on]:scale-110 data-[state=on]:z-10 font-bold data-[state=on]:shadow-lg",
          categoryClass
        )}
      >
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[8px] z-20 ring-1 ring-white">
            ✓
          </div>
        )}
        <span className={cn(
          "text-[9px] font-mono mb-0.5 transition-colors",
          isSelected ? "text-white/90" : "text-gray-400"
        )}>
          {item.atomicNumber}
        </span>
        <span className="text-sm font-bold leading-none">
          {mode === "element" ? item.symbol : renderFormula(item.commonOxide)}
        </span>
        
        {mode === "oxide" && item.alternativeOxides?.length && (
          <div className={cn(
            "absolute bottom-0.5 right-0.5 text-[7px] font-black uppercase tracking-tighter",
            isSelected ? "text-white/70" : "text-zinc-400"
          )}>
            Multi
          </div>
        )}
      </Toggle>

      {/* Multiple Oxide Selection Popover */}
      {showOptions && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white border border-gray-200 shadow-xl rounded-md p-1.5 flex flex-col gap-1 min-w-[80px]">
          <div className="text-[10px] font-bold text-gray-400 mb-1 px-1 border-b border-gray-100 pb-1 text-center">
            {item.name}
          </div>
          {currentOxides.map(ox => (
            <button
              key={ox}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(ox);
              }}
              className={cn(
                "px-2 py-1.5 text-xs font-bold rounded-sm text-left transition-colors flex items-center justify-between gap-3",
                selectedItems.includes(ox) 
                  ? "bg-black text-white" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <span>{renderFormula(ox)}</span>
              {selectedItems.includes(ox) && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ElementCell.displayName = "ElementCell";

export const PeriodicTable = memo(({ selectedItems, onToggleItem, mode }: PeriodicTableProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide periodic-table-container no-print">
      <div className="min-w-[950px] flex justify-center">
        <div className="grid grid-cols-18 gap-0 p-1">
          {periodicTableData.map((item) => (
            <ElementCell
              key={item.atomicNumber}
              item={item}
              selectedItems={selectedItems}
              onToggle={onToggleItem}
              mode={mode}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

PeriodicTable.displayName = "PeriodicTable";
