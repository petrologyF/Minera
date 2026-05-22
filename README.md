# Minera 💎

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**Minera** is a web-based tool designed to support research and education in earth sciences and mineralogy. It derives empirical chemical formulas from analytical data obtained via EPMA (Electron Probe Micro Analyzer) and other methods, and automatically identifies mineral species.

[View Demo](https://minera-taupe.vercel.app/)

---

## ✨ Features

- **Empirical Formula Calculation**: Precise calculation of atomic ratios based on weight percentages (wt%).
- **Site-Based Structural Formula**: Automatically groups elements into crystallographic sites (e.g., A, B, M, T sites) based on the identified mineral structure.
- **Mineral Identification**: Scores and suggests potential mineral matches by comparing calculated ratios with a built-in database.
- **Multi-Mode Support**:
  - **Oxide Mode**: Normalization based on a fixed number of oxygens. Supports iron valence estimation (Droop method).
  - **Element Mode**: Normalization based on specific element ratios (e.g., S=1) or total anions.
- **History Management**: Automatically saves calculation history to local storage for quick retrieval.
- **Professional Export**: Copy formulas in LaTeX `\ce{}` (mhchem) format or export detailed data to CSV.
- **Bilingual Mineral Names**: Displays mineral names in English with Japanese names in brackets (e.g., Magnetite (磁鉄鉱)).

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/petrologyF/mineral_naming.git
   cd mineral_naming
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🧪 Testing & Verification

The project includes a robust suite of unit and integration tests.

- **Unit Tests (Vitest)**: Tests for core calculation logic.
  ```bash
  npm test
  ```
- **Empirical Verification**: Automated verification using 18 basic and challenge problems (Spinel, Magnetite, Pyrrhotite, etc.) documented in `tests/test.md`.
  ```bash
  npm run verify
  ```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Logic**: High-precision geochemical calculations in pure TypeScript.

---

## 📂 Project Structure

```text
.
├── src/
│   ├── app/            # Next.js App Router (Main UI)
│   ├── components/     # UI Components (Periodic Table, Formula Display)
│   └── lib/            # Core geochemical logic and mineral database
├── tests/              # Unit tests and documented test cases
└── public/             # Static assets
```

---

## 📄 License

This project is released under the **MIT License**. You are free to use it for both commercial and non-commercial purposes. See the [LICENSE](LICENSE) file for details.

---

**Minera** - *Empowering Geoscience through Modern Web Technology.*  
Created by [Asahi Fukumoto](https://github.com/petrologyF)
