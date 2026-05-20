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
  - **組成式の自動生成**: 標準的な陽イオンの占有順序（Aサイト→Mサイト→Tサイト）に基づいて実験式を算出。
  - **スマート鉱物特定**: 120種類以上の鉱物データベースと照合し、最小二乗法を用いて最も可能性の高い鉱物名をリストアップ。
  - **透明性の高い計算過程**: 分子量、原子比、陽イオン/酸素プロポーションなどの詳細な計算ステップをすべて表示。

- **洗練されたユーザー体験**:
  - Notion風のクリーンでモダンなインターフェース。
  - レスポンシブ設計により、PCからタブレットまで対応。

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

