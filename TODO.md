# 今後の改善点・開発タスク (Future Improvements & TODO)

本アプリケーション (**Minera**) のユーザー体験、機能、および地質化学計算としての学術的な正確性をさらに高めるためのロードマップです。

---

## 📊 タスクステータス凡例
- `[ ] 未着手` (Not Started)
- `[/] 一部実装済 / 進行中` (Partially Implemented / In Progress)
- `[x] 実装完了` (Completed)

---

## 🚀 タスクロードマップ

### 1. 端成分プロットの可視化改善 (Ternary Diagram & Visualization)
端成分の組成比率を視覚的に理解しやすくするための、グラフおよびプロット機能の強化タスクです。

- [ ] **かんらん石 (Fo-Fa-Te) の三角図プロット化** [優先度: 高]
  - **内容**: 現在は1次元の積層バーで表示されているかんらん石 (Forsterite - Fayalite - Tephroite) についても、輝石/長石と同様の SVG 三角ダイアグラムへとアップグレードする。
  - **対象**: [EndMemberPlot.tsx](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/components/EndMemberPlot.tsx)
- [/] **輝石 (Wo-En-Fs)・長石 (An-Ab-Or) 三角図の高度化** [優先度: 中]
  - **現状**: すでに基本的な三角プロットと現在値の赤丸マッピングが実装済み。
  - **追加**: 分類境界線（例えば輝石の Augite, Pigeonite, Enstatite 等の境界線）を SVG 上にガイドラインとして重ねて描画し、視覚的な分類をより直感的にする。
  - **対象**: [EndMemberPlot.tsx](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/components/EndMemberPlot.tsx)
- [ ] **ザクロ石 (Garnet) 等のマルチ端成分可視化の強化** [優先度: 低]
  - **内容**: 主要4端成分 (Py-Al-Sp-Gr) に加え、Andradite や Uvarovite などの多成分系に対応するため、適切な端成分ダイアグラム（パイラルスパイト系 Py-Al-Sp / ウグランダイト系 Gr-And-Uv など）を自動選択して表示する。
- [ ] **プロットの複数表示およびトレンド可視化 (Zoning & Trend)** [優先度: 中]
  - **内容**: 同一セッション内で複数の計算点（結晶のコアからリムへの測定データなど）を保持し、三角図上に同時にプロットして化学組成累帯構造 (Zoning) や分化トレンドを可視化する。
- [ ] **ダイアグラム画像の保存・エクスポート** [優先度: 中]
  - **内容**: 生成された三角図を SVG または PNG 形式でローカルに保存・ダウンロードできるボタンの設置。

---

### 2. 地質化学計算エンジン・価数推定ロジックの高度化 (Geochemical Calculation Engine)
地質化学モデルに準拠した計算の正確性および多様な鉱物への対応力を向上させるためのタスクです。

- [/] **鉄の価数分配 (Fe²⁺/Fe³⁺) ロジックの拡張** [優先度: 高]
  - **現状**: Droop (1987) 法に基づく、理想カチオン数と電荷バランスによる鉄の自動価数推定が実装済み。
  - **追加**: 輝石向け Papike et al. (1974) や、角閃石向け Schumacher (1991) など、鉱物グループ固有の価数分配アルゴリズムの追加。
  - **対象**: [calculations.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/calculations.ts)
- [ ] **複数多価元素の自動価数分配** [優先度: 低]
  - **内容**: Fe と Mn (あるいは Ti, Cr) が共存し、双方が多価で存在する可能性がある場合の連立方程式による最適化分配ロジックの導入。
- [ ] **水酸基・ハロゲンサイトの正規化 (Stoichiometric Anion Basis)** [優先度: 高]
  - **内容**: $\text{F}$, $\text{Cl}$, $\text{OH}$ などが混在する鉱物（アパタイト、雲母、角閃石）において、陰イオン全体の電価バランス（stoichiometric oxygen-equivalent basis、フッ素・塩素の酸素等量補正）を考慮した高精度な正規化処理。
  - **対象**: [calculations.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/calculations.ts)
- [ ] **カチオン分配 (Site Assignment) アルゴリズムの精緻化** [優先度: 中]
  - **内容**: 角閃石 (Amphibole) など、A, B(M4), C(M1-3), T サイト間のカチオン占有率判定が非常に複雑な鉱物に対して、IMA (国際鉱物学連合) 規格に準拠した自動分配ルールを実装する。
  - **対象**: [calculations.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/calculations.ts) / [mineralDb.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/mineralDb.ts)

---

### 3. 鉱物データベースの拡充と同定精度の向上 (Database & Matching Algorithm)
同定可能な鉱物のバリエーションを増やし、分析値から正しく鉱物種を判定するアルゴリズムを改良するタスクです。

- [ ] **含水・フッ素含有鉱物および複雑な珪酸塩鉱物の定義追加** [優先度: 中]
  - **内容**: 角閃石グループ（Tremolite, Actinolite, Hornblende 等）、雲母グループ（Biotite, Muscovite, Phlogopite 等）、粘土鉱物などの定義を拡張する。
  - **対象**: [mineralDb.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/mineralDb.ts)
- [ ] **マッチングアルゴリズムの重み付け評価の導入** [優先度: 高]
  - **内容**: 単純な元素量の二乗和誤差 (L2ノルム) だけでなく、「必須元素の有無（例: クロム鉄鉱におけるCrの必須性）」や「特定のサイト制限」によるフィルタリングおよびスコア重み付けを行い、同定精度を向上させる。
  - **対象**: [calculations.ts](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/lib/calculations.ts) の `identifyMineral` 関数
- [ ] **結晶サイト秩序度を考慮した同定** [優先度: 低]
  - **内容**: ドロマイト $\text{CaMg(CO}_3)_2$ とカルサイト $\text{CaCO}_3$ 固溶体など、カチオンが特定のサイトに秩序化して配置されることによる鉱物種分類の判別。

---

### 4. バッチ処理およびファイル入出力機能 (Batch Processing & File I/O)
実務や研究での大量データ処理を円滑にするためのデータ連携タスクです。

- [ ] **EPMA分析値の一括インポート (CSV / Excel)** [優先度: 高]
  - **内容**: 複数スポットの分析値を記録した CSV または Excel ファイル（.xlsx）をブラウザへドラッグ＆ドロップし、一括で読み込む機能。
  - **仕様**: ユーザーが各列の名前と酸化物/元素種（例: `SiO2_wt%` を `SiO2` に割り当てる）をマッピングできる簡易UIの提供。
- [ ] **一括計算結果のエクスポート** [優先度: 高]
  - **内容**: 一括計算した全スポットの構造式、カチオン数、同定鉱物名、端成分比率を単一の結合テーブルにまとめ、CSV または Excel 形式でダウンロードできるようにする。

---

### 5. UI/UX・国際化・アクセシビリティ (UI/UX & Localization)
多様な環境の研究者や学生が利用しやすい親切なインターフェースを構築するタスクです。

- [ ] **多言語化 (i18n) の導入** [優先度: 中]
  - **内容**: 鉱物名だけでなく、ボタン、フォームラベル、結果テーブルヘッダー、ヘルプテキストなど、UI全体を日本語・英語で完全に切り替えられるようにする。
- [ ] **ダークモード (Dark Theme) のサポート** [優先度: 低]
  - **内容**: Tailwind CSS と shadcn/ui のテーマ機能を利用し、薄暗い研究室や顕微鏡室での利用時に適したダークモードを実装する。
  - **対象**: [globals.css](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/app/globals.css) / 各コンポーネント
- [ ] **元素周期表入力インターフェースの改善** [優先度: 中]
  - **内容**: キーボードショートカット（Tabキー移動やテンキー入力等）への対応強化、および頻繁に使用する元素セット（例: 「超塩基性岩セット」「長石セット」）をワンクリックで選択状態にできるプリセット機能の追加。
  - **対象**: [PeriodicTable.tsx](file:///C:/Users/climb/Documents/CREATIVE/mineral_naming/src/components/PeriodicTable.tsx)
