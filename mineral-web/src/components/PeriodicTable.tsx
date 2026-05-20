"use client";

import React, { memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { periodicTableData, ElementData } from "@/lib/periodicTableData";
import { cn } from "@/lib/utils";

interface PeriodicTableProps {
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  mode: "element" | "oxide";
}

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
  isSelected, 
  onToggle, 
  mode 
}: { 
  item: ElementData; 
  isSelected: boolean; 
  onToggle: (id: string) => void;
  mode: "element" | "oxide";
}) => {
  const displayValue = mode === "element" ? item.symbol : item.commonOxide;
  
  // Skip rendering if in oxide mode and no oxide defined
  if (mode === "oxide" && !item.commonOxide) {
    return (
      <div 
        style={{ gridColumnStart: item.group, gridRowStart: item.period }}
        className="w-full h-full border border-transparent"
      />
    );
  }

  return (
    <div 
      style={{ gridColumnStart: item.group, gridRowStart: item.period }}
      className="p-0.5"
    >
      <Toggle
        pressed={isSelected}
        onPressedChange={() => onToggle(displayValue)}
        className={cn(
          "w-full h-full min-h-[50px] flex flex-col items-center justify-center border rounded-sm transition-colors duration-200",
          "data-[state=on]:bg-black data-[state=on]:text-white",
          "data-[state=off]:bg-white data-[state=off]:border-gray-200 data-[state=off]:text-gray-700 data-[state=off]:hover:bg-gray-100"
        )}
      >
        <span className="text-xs text-gray-400 font-mono mb-0.5">{item.atomicNumber}</span>
        <span className="text-sm font-bold leading-none">
          {mode === "element" ? item.symbol : renderFormula(item.commonOxide)}
        </span>
      </Toggle>
    </div>
  );
});

ElementCell.displayName = "ElementCell";

export const PeriodicTable = memo(({ selectedItems, onToggleItem, mode }: PeriodicTableProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[900px] grid grid-cols-18 gap-0">
        {periodicTableData.map((item) => (
          <ElementCell
            key={item.atomicNumber}
            item={item}
            isSelected={selectedItems.includes(mode === "element" ? item.symbol : item.commonOxide)}
            onToggle={onToggleItem}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
});

PeriodicTable.displayName = "PeriodicTable";
