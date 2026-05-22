# Minera 💎

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**Minera** は、地球科学および鉱物学の研究・教育を支援するために開発された、Webベースの鉱物化学組成計算ツールです。EPMA（電子線マイクロアナライザ）などで得られた分析データから、即座に化学組成式を導出し、鉱物種を特定します。

[デモを見る（もし公開URLがあればここに）](#)

---

## 🌟 主な機能

- **インタラクティブな分析ダッシュボード**:
  - **動的成分選択**: 周期表を用いた直感的な操作で、分析対象の元素や酸化物を選択。
  - **ハイブリッド・モード**: 「元素モード」と「酸化物モード」をリアルタイムに切り替え。
  - **即時バリデーション**: 入力された wt% の合計値を自動計算し、分析の精度をチェック。

- **高度なストイキオメトリ・エンジン**:
  - **多様な正規化オプション**:
    - **酸化物モード**: 酸素数（例：かんらん石なら O=4）に基づく標準的な計算。
    - **元素モード**: 任意の元素（例：硫化物の S=1）を基準とした正規化、または全アニオン合計基準。
    - **化学量論的酸素推定**: 元素分析値から原子価に基づき酸素量を推定して計算。
  - **鉄原子価（Fe²⁺/Fe³⁺）推定**:
    - **Droop (1987) メソッド**: 分析された陽イオンの合計値と理想的な陽イオン数の比に基づき、電荷バランスを維持するように Fe³⁺ 量を推定。
    - 数式: $Fe^{3+} = 2X(1 - T/S)$ （$X$: 酸素数, $T$: 理想的な陽イオン数, $S$: 実測陽イオン合計）。
  - **学術的タイポグラフィによる組成式生成**:
    - **IUPAC準拠**: 元素記号と数字は直立体（ローマン体）、変数（$x, y, n$）はイタリック体で正確に表示。
    - **有効数字4桁**: 学術研究に耐えうる4桁の有効数字（Significant Figures）に基づいた高精度な式を算出。
    - **インテリジェントな書式**: 下付き文字や、水和物などの係数を自動的に判別して美しくレンダリング。
  - **スマート鉱物特定**: 120種類以上の鉱物データベースと照合し、最小二乗法を用いて最も可能性の高い鉱物名をリストアップ。
  - **透明性の高い計算過程**: 分子量、原子比、陽イオン/酸素プロポーションなどの詳細な計算ステップをすべて表示。

- **洗練されたユーザー体験**:
  - Notion風のクリーンでモダンなインターフェース.
  - レスポンシブ設計により、PCからタブレットまで対応.

---

## 🚀 クイックスタート

### 動作要件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/petrologyF/minera.git

# ディレクトリに移動
cd minera

# 依存関係をインストール
npm install
```

### 開発モードで実行

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリが表示されます。

---

## 🧪 テストと検証

本プロジェクトでは、鉱物計算の正確性を担保するために自動テストと検証スクリプトを導入しています。

- **単位テスト (Vitest)**: コアロジックの機能テスト。
  ```bash
  npm test
  ```
- **実測データ検証**: `tests/test.md` に記載された 16 問の基本・応用例題（スピネル、磁鉄鉱、磁硫鉄鉱など）を用いた自動検証。
  ```bash
  npm run verify
  ```

---

## 🛠 技術スタック

- **フロントエンド**: [Next.js](https://nextjs.org/) (App Router)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **コンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **計算ロジック**: 純粋な TypeScript 関数による高精度な化学計算

---

## 📂 プロジェクト構造

```text
.
├── src/
│   ├── app/           # Next.js App Router (ページ構成)
│   ├── components/    # 再利用可能なUIコンポーネント（周期表など）
│   ├── lib/           # コア・ロジック
│   │   ├── calculations.ts  # 組成計算・特定エンジン
│   │   ├── mineralDb.ts     # 120種類以上の鉱物定義データ
│   │   ├── periodicTableData.ts # 元素の物理特性データ
│   │   └── types.ts         # 型定義
│   └── styles/        # グローバルスタイル
├── public/            # 静的アセット（ロゴ・画像など）
└── package.json       # プロジェクト設定
```

---

## 🤝 貢献について

バグ報告や機能提案は、GitHub の Issues または Pull Requests で受け付けています。教育・研究目的での改善提案を歓迎します。

---

## 📄 ライセンス

このプロジェクトは **MIT ライセンス** の下で公開されています。商用・非商用を問わず、自由にご利用いただけます。詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

**Minera** - *Empowering Geoscience through Modern Web Technology.*
Created by [Asahi Fukumoto](https://github.com/petrologyF)

