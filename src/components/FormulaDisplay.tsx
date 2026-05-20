import React from "react";

interface FormulaDisplayProps {
  formula: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formula }) => {
  if (!formula) return <span className="text-gray-400">N/A</span>;

  // Split by numbers (including decimals) to wrap them in <sub> tags
  // Example: "Mg1.8Fe0.2SiO4" -> ["Mg", "1.8", "Fe", "0.2", "SiO", "4"]
  const parts = formula.split(/(\d+(?:\.\d+)?)/g);

  return (
    <span className="font-serif italic text-2xl tracking-tighter text-black select-all">
      {parts.map((part, i) => {
        // If the part is a number, wrap it in <sub>
        if (part.match(/^\d+(\.\d+)?$/)) {
          return (
            <sub 
              key={i} 
              className="text-[0.65em] align-baseline relative top-[0.3em] ml-0.5 mr-0.5 font-sans font-bold not-italic"
            >
              {part}
            </sub>
          );
        }
        // Otherwise, render as plain text
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};
