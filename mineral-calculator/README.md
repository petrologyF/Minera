# 鉱物命名・化学組成計算ツール (Mineral Naming & Formula Calculator)

このプロジェクトは、EPMA（電子線マイクロアナライザ）などで得られた元素または酸化物の重量パーセント（wt%）データから、鉱物の化学組成式を導出し、鉱物名を特定するための統合ツール群です。

現在は **mineral-web** がメインの統合アプリケーションとして機能しており、従来の **mineral-calculator** のすべての計算ロジックとデータベースが移植されています。

---

## 1. Mineral Web (Next.js) - メイン・アプリケーション

最新のWeb技術を使用した、高度でインタラクティブな分析ダッシュボードです。

### 主な機能

- **統合分析ダッシュボード**: 
    - インタラクティブな周期表による直感的な成分選択。
    - **元素モード**と**酸化物モード**を動的に切り替え可能。
    - リアルタイムでの合計wt%バリデーション。
- **高度な計算エンジン**:
    - **組成式の自動生成**: 標準的な陽イオン順序（Aサイト→Mサイト→Tサイト）に基づいた実験式の導出。
    - **鉱物特定機能**: 120種類以上の鉱物データベースと照合し、最小二乗法で最も近い鉱物を特定。
    - **詳細な計算過程**: 分子量、原子比、陽イオン/酸素プロポーションなどを一覧表示。
- **モダンなUI/UX**:
    - Notion風のクリーンなデザイン。
    - 高速な動作とレスポンシブ対応。

### 技術スタック

- **Next.js (React)** / **TypeScript**
- **Tailwind CSS** / **shadcn/ui**

### インストールと実行

```bash
cd mineral-web
npm install
npm run dev
```

---

## 2. Mineral Calculator (Streamlit) - プロトタイプ

初期開発に使用された、Pythonベースのアプリケーションです。現在はリファレンスとして提供されています。

### インストールと実行

```bash
cd mineral-calculator
pip install -r requirements.txt
streamlit run app.py
```

---

## プロジェクト構造

```text
.
├── mineral-web/           # メイン・統合アプリケーション (Next.js)
│   ├── src/
│   │   ├── components/    # 周期表などのUIコンポーネント
│   │   ├── lib/
│   │   │   ├── calculations.ts  # 計算エンジン (Stoichiometry logic)
│   │   │   ├── mineralDb.ts     # 鉱物データベース (120+ minerals)
│   │   │   └── periodicTableData.ts # 元素・原子量データ
│   │   └── app/           # ダッシュボードUI
└── mineral-calculator/    # Pythonプロトタイプ (Reference)
```

## ライセンス

このプロジェクトは、地球科学分野の教育および研究目的で提供されています。
