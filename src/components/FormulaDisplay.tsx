import React from "react";

interface FormulaDisplayProps {
  formula: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formula }) => {
  if (!formula) return <span className="text-gray-400">N/A</span>;

  /**
   * Refined scientific typesetting logic:
   * 1. Element symbols (Mg, Fe, Si...) -> Roman (Upright)
   * 2. Delimiters ( ( ) , · ・ ) -> Roman (Upright)
   * 3. Counts/Expressions (1.8, 1-x, 4...)
   *    - If following an element or ')', it's a Subscript.
   *    - Otherwise (at start or after ·), it's a Coefficient.
   *    - Inside counts: Numbers are Roman, Variables (x, y, z, n) are Italic.
   */

  // Split by elements and delimiters to identify structural blocks
  const parts = formula.split(/([A-Z][a-z]*|[(),·・])/g).filter(Boolean);

  return (
    <span className="font-sans font-medium text-2xl tracking-tight text-black select-all">
      {parts.map((part, i) => {
        const isElementOrDelimiter = part.match(/^([A-Z][a-z]*|[(),·・])$/);

        if (isElementOrDelimiter) {
          // Element symbols and structural delimiters are always Roman (Upright)
          return (
            <span key={i} className="not-italic">
              {part}
            </span>
          );
        } else {
          // This is a "count" or "expression" part (e.g., "1.8", "2", "1-x")
          const prevPart = i > 0 ? parts[i - 1] : null;

          // Heuristic: If it follows an element symbol or a closing parenthesis, it's a subscript
          const isSubscript = prevPart && (prevPart.match(/^[A-Z][a-z]*$/) || prevPart === ")");

          if (isSubscript) {
            // Further tokenize the expression to apply italics to variables
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
            // It's a coefficient (e.g., the "2" in "· 2H2O")
            return (
              <span key={i} className="not-italic ml-1 mr-0.5">
                {part}
              </span>
            );
          }
        }
      })}
    </span>
  );
};

function stplitSubTokens(part: string) {
  return part.split(/([xyz n]|\d+(?:\.\d+)?|[-+])/g).filter(Boolean);
}

