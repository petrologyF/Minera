import React, { useState } from "react";
import { Copy, Check, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormulaDisplayProps {
  formula: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formula }) => {
  const [copied, setCopied] = useState(false);

  if (!formula) return <span className="text-gray-400">N/A</span>;

  const copyAsLatex = async () => {
    // Convert to LaTeX \ce{} format (mhchem)
    // 1. Convert ionic symbols: ²⁺ -> ^{2+}, ³⁺ -> ^{3+}, ⁴⁺ -> ^{4+}
    // 2. Wrap in \ce{...}
    let latexFormula = formula
      .replace(/²⁺/g, "^{2+}")
      .replace(/³⁺/g, "^{3+}")
      .replace(/⁴⁺/g, "^{4+}")
      .replace(/⁵⁺/g, "^{5+}")
      .replace(/·/g, " . ");

    const latex = `\\ce{${latexFormula}}`;
    
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Split by elements and delimiters to identify structural blocks
  const parts = formula.split(/([A-Z][a-z]*|[(),·・])/g).filter(Boolean);

  return (
    <div className="relative group flex items-center gap-4">
      <span className="font-sans font-medium text-2xl tracking-tight text-black select-all">
        {parts.map((part, i) => {
          const isElementOrDelimiter = part.match(/^([A-Z][a-z]*|[(),·・])$/);

          if (isElementOrDelimiter) {
            return (
              <span key={i} className="not-italic">
                {part}
              </span>
            );
          } else {
            const prevPart = i > 0 ? parts[i - 1] : null;
            const isSubscript = prevPart && (prevPart.match(/^[A-Z][a-z]*$/) || prevPart === ")");

            if (isSubscript) {
              const subTokens = stplitSubTokens(part);
              return (
                <sub 
                  key={i} 
                  className="text-[0.65em] align-baseline relative top-[0.3em] ml-0.5 mr-0.5 font-bold"
                >
                  {subTokens.map((st, j) => {
                    const isVar = st.match(/^[xyz n]$/);
                    return (
                      <span 
                        key={j} 
                        className={isVar ? "italic font-serif" : "not-italic"}
                      >
                        {st}
                      </span>
                    );
                  })}
                </sub>
              );
            } else {
              return (
                <span key={i} className="not-italic ml-1 mr-0.5">
                  {part}
                </span>
              );
            }
          }
        })}
      </span>

      <button
        onClick={copyAsLatex}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all",
          "bg-white border border-gray-200 text-gray-400 hover:border-black hover:text-black shadow-sm",
          copied && "border-green-500 text-green-600 bg-green-50 hover:border-green-500 hover:text-green-600"
        )}
        title="LaTeX (\ce{}) 形式でコピー"
      >
        {copied ? (
          <>
            <Check size={12} />
            Copied
          </>
        ) : (
          <>
            <Code size={12} />
            Copy LaTeX
          </>
        )}
      </button>
    </div>
  );
};

function stplitSubTokens(part: string) {
  return part.split(/([xyz n]|\d+(?:\.\d+)?|[-+])/g).filter(Boolean);
}

