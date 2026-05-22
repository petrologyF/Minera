"use client";

import React, { memo } from "react";
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
      return <sub key={index}>{part}</sub>;
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
  if (mode === "oxide" && !item.commonOxide) {
    return (
      <div 
        style={{ gridColumnStart: item.group, gridRowStart: item.period }}
        className="w-full h-full border border-transparent"
      />
    );
  }

  const categoryClass = item.category ? CATEGORY_COLORS[item.category] : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100";

  const renderToggle = (id: string, label: string, isSmall = false) => (
    <Toggle
      pressed={selectedItems.includes(id)}
      onPressedChange={() => onToggle(id)}
      aria-label={`${item.name} (${id})`}
      className={cn(
        "w-full flex flex-col items-center justify-center border rounded-sm transition-all duration-200",
        "data-[state=on]:text-white shadow-sm",
        categoryClass,
        isSmall ? "h-7 min-h-0 py-0" : "h-full min-h-[50px]"
      )}
    >
      {!isSmall && (
        <span className={cn(
          "text-[10px] font-mono mb-0.5",
          selectedItems.includes(id) ? "text-white/80" : "text-gray-400"
        )}>
          {item.atomicNumber}
        </span>
      )}
      <span className={cn("font-bold leading-none", isSmall ? "text-[10px]" : "text-sm")}>
        {renderFormula(label)}
      </span>
    </Toggle>
  );

  return (
    <div 
      style={{ gridColumnStart: item.group, gridRowStart: item.period }}
      className="p-0.5 flex flex-col gap-0.5"
    >
      {mode === "element" ? (
        renderToggle(item.symbol, item.symbol)
      ) : (
        <>
          {renderToggle(item.commonOxide, item.commonOxide, !!item.alternativeOxides?.length)}
          {item.alternativeOxides?.map(alt => (
            renderToggle(alt, alt, true)
          ))}
        </>
      )}
    </div>
  );
});

ElementCell.displayName = "ElementCell";

export const PeriodicTable = memo(({ selectedItems, onToggleItem, mode }: PeriodicTableProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-[900px] grid grid-cols-18 gap-0 p-1 auto-rows-fr">
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
  );
});

PeriodicTable.displayName = "PeriodicTable";
