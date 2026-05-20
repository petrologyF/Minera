"use client";

import { useState } from "react";
import { PeriodicTable } from "@/components/PeriodicTable";
import { Toggle } from "@/components/ui/toggle";

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mode, setMode] = useState<"element" | "oxide">("element");

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "element" ? "oxide" : "element"));
    setSelectedItems([]); // Clear selection when switching modes
  };

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mineral Components</h1>
          <p className="text-gray-500">
            Select elements or oxides to include in your mineral chemistry analysis.
          </p>
        </header>

        <section className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => mode !== "element" && toggleMode()}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-all ${
                mode === "element"
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Elements
            </button>
            <button
              onClick={() => mode !== "oxide" && toggleMode()}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-all ${
                mode === "oxide"
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Oxides
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {selectedItems.length} items selected
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <PeriodicTable
            selectedItems={selectedItems}
            onToggleItem={toggleItem}
            mode={mode}
          />
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Selected {mode === "element" ? "Elements" : "Oxides"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <div
                  key={item}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">No items selected.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
