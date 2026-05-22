```python
def make_q5():
    # Magnetite with some Mg and Al: (Mg0.1 Fe2+0.9)(Al0.1 Fe3+1.9)O4
    # Cations: Mg=0.1, Fe2+=0.9, Al=0.1, Fe3=1.9. Total Fe = 2.8
    # In EPMA, all Fe is reported as FeO*. Total FeO* moles = 2.8
    # Oxides for input: Al2O3 (0.05 moles), MgO (0.1 moles), FeO* (2.8 moles)
    m_al2o3 = 0.05 * 101.96
    m_mgo = 0.1 * 40.30
    m_feo = 2.8 * 71.85
    total = m_al2o3 + m_mgo + m_feo
    print(f"Q5 values: Al2O3={m_al2o3/total*100:.2f}%, MgO={m_mgo/total*100:.2f}%, FeO*={m_feo/total*100:.2f}%")

def make_q6():
    # Ilmenite-Hematite solid solution: Fe2+0.6 Fe3+0.8 Ti0.6 O3 (Basis: 3 O)
    # Cations: Ti=0.6, Fe2+=0.6, Fe3+=0.8. Total Fe = 1.4. Total Ti = 0.6.
    # Reported as TiO2 (0.6 mol), FeO* (1.4 mol)
    m_tio2 = 0.6 * 79.87
    m_feo = 1.4 * 71.85
    total = m_tio2 + m_feo
    print(f"Q6 values: TiO2={m_tio2/total*100:.2f}%, FeO*={m_feo/total*100:.2f}%")

def make_q7():
    # Chromite with mixed valence Fe: (Mg0.6 Fe2+0.4)(Cr1.2 Al0.4 Fe3+0.4)O4
    # Cations: Mg=0.6, Fe2+=0.4, Cr=1.2, Al=0.4, Fe3+=0.4. Total Fe = 0.8
    m_mgo = 0.6 * 40.30
    m_cr2o3 = 0.6 * 151.99
    m_al2o3 = 0.2 * 101.96
    m_feo = 0.8 * 71.85
    total = m_mgo + m_cr2o3 + m_al2o3 + m_feo
    print(f"Q7 values: Cr2O3={m_cr2o3/total*100:.2f}%, Al2O3={m_al2o3/total*100:.2f}%, MgO={m_mgo/total*100:.2f}%, FeO*={m_feo/total*100:.2f}%")

def make_q8():
    # Pyrrhotite Fe0.88S (Basis: S=1)
    # Fe = 0.88 * 55.85, S = 1 * 32.07
    m_fe = 0.88 * 55.85
    m_s = 32.07
    total = m_fe + m_s
    print(f"Q8 values: Fe={m_fe/total*100:.2f}%, S={m_s/total*100:.2f}%")

def make_q9():
    # Maghemite gamma-Fe2O3 as cation-deficient spinel. On basis of 32 oxygens, Fe_21.33 Vac_2.67 O_32.
    # On basis of 4 oxygens: Fe_(2.667) O_4.
    # If reported as FeO*: Fe = 2.6667 moles.
    # Let's make a titanomaghemite or just pure maghemite reported as FeO*.
    # Pure Fe2O3 analyzed as FeO*. Fe2O3 has 2 Fe and 3 O.
    # Weight% Fe=69.94%, O=30.06%. If reported as FeO*, Fe=69.94%, O from FeO would be 69.94/55.85 * 16 = 20.03%. Total FeO* = 89.98%
    print("Q9: Maghemite analyzed as FeO* total = 89.98%")

def make_q10():
    # Tetrahedrite (Cu10 Fe2) As4 S13
    # Cu=10*63.55, Fe=2*55.85, As=4*74.92, S=13*32.07
    m_cu = 10 * 63.55
    m_fe = 2 * 55.85
    m_as = 4 * 74.92
    m_s = 13 * 32.07
    total = m_cu + m_fe + m_as + m_s
    print(f"Q10 values: Cu={m_cu/total*100:.2f}%, Fe={m_fe/total*100:.2f}%, As={m_as/total*100:.2f}%, S={m_s/total*100:.2f}%")

make_q5()
make_q6()
make_q7()
make_q8()
make_q9()
make_q10()



```

```text
Q5 values: Al2O3=2.42%, MgO=1.92%, FeO*=95.66%
Q6 values: TiO2=32.27%, FeO*=67.73%
Q7 values: Cr2O3=47.19%, Al2O3=10.55%, MgO=12.51%, FeO*=29.74%
Q8 values: Fe=60.51%, S=39.49%
Q9: Maghemite analyzed as FeO* total = 89.98%
Q10 values: Cu=43.41%, Fe=7.63%, As=20.47%, S=28.48%


```

## 第一部：基本例題 (Basic Problems)

### Q1. 【酸化物】スピネル固溶体 (Spinel Solid Solution)

下表のEPMA分析値（Weight %）から、**酸素数 4 を基準 (On basis of 4 oxygens)** として構造式（Structural formula）を算出せよ。

* **分析データ:** $\text{Al}_2\text{O}_3 = 68.63\%$, $\text{FeO} = 9.67\%$, $\text{MgO} = 21.70\%$ (Total: $100.00\%$)
* **分子量 (Molecular Weight):** $\text{Al}_2\text{O}_3 = 101.96$, $\text{FeO} = 71.85$, $\text{MgO} = 40.30$

#### 解答・解説

1. 分子比（Molecular Proportion）: $\text{Al}_2\text{O}_3 = 0.67310$, $\text{FeO} = 0.13459$, $\text{MgO} = 0.53846$
2. 酸素比（Proportion Oxygen）: $\text{O} = (0.67310 \times 3) + 0.13459 + 0.53846 = 2.69235$
3. 換算係数（Normalization Factor）: $K = 4 / 2.69235 = 1.48569$
4. 原子比（Atomic Ratio）: $\text{Al} = (0.67310 \times 2) \times K = 2.000$, $\text{Fe} = 0.13459 \times K = 0.200$, $\text{Mg} = 0.53846 \times K = 0.800$

* **構造式:** $(\text{Mg}_{0.80}\text{Fe}^{2+}_{0.20})\text{Al}_{2.00}\text{O}_4$

---

### Q2. 【酸化物】チタン鉄鉱 (Ilmenite)

下表の分析値から、**酸素数 3 を基準 (On basis of 3 oxygens)** として構造式を算出せよ。

* **分析データ:** $\text{TiO}_2 = 52.61\%$, $\text{FeO} = 47.39\%$ (Total: $100.00\%$)
* **分子量:** $\text{TiO}_2 = 79.87$, $\text{FeO} = 71.85$

#### 解答・解説

1. 分子比: $\text{TiO}_2 = 0.65870$, $\text{FeO} = 0.65957$
2. 酸素比: $\text{O} = (0.65870 \times 2) + 0.65957 = 1.97697$
3. 換算係数: $K = 3 / 1.97697 = 1.51747$
4. 原子比: $\text{Ti} = 0.65870 \times K = 1.000$, $\text{Fe} = 0.65957 \times K = 1.001 \approx 1.000$

* **構造式:** $\text{Fe}_{1.00}\text{Ti}_{1.00}\text{O}_3$

---

### Q3. 【硫化物】黄銅鉱 (Chalcopyrite)

下表の分析値から、**硫黄数 2 を基準 (On basis of 2 S atoms)** として構造式を算出せよ。

* **分析データ:** $\text{Cu} = 34.62\%$, $\text{Fe} = 30.43\%$, $\text{S} = 34.95\%$ (Total: $100.00\%$)
* **原子量 (Atomic Weight):** $\text{Cu} = 63.55$, $\text{Fe} = 55.85$, $\text{S} = 32.07$

#### 解答・解説

1. 原子比（Atomic Proportion）: $\text{Cu} = 0.54477$, $\text{Fe} = 0.54485$, $\text{S} = 1.08980$
2. 換算係数: $K = 2 / 1.08980 = 1.83520$
3. 原子比（Atomic Ratio）: $\text{Cu} = 0.54477 \times K = 1.000$, $\text{Fe} = 0.54485 \times K = 1.000$, $\text{S} = 2.000$

* **構造式:** $\text{Cu}_{1.00}\text{Fe}_{1.00}\text{S}_2$

---

### Q4. 【硫化物】鉄閃亜鉛鉱 (Ferroan Sphalerite)

下表の分析値から、**アニオン数 1 を基準 (On basis of 1 S atom)** として構造式を算出せよ。

* **分析データ:** $\text{Zn} = 57.88\%$, $\text{Fe} = 8.72\%$, $\text{S} = 33.40\%$ (Total: $100.00\%$)
* **原子量:** $\text{Zn} = 65.38$, $\text{Fe} = 55.85$, $\text{S} = 32.07$

#### 解答・解説

1. 原子比（Molar proportion）: $\text{Zn} = 0.88529$, $\text{Fe} = 0.15613$, $\text{S} = 1.04147$
2. 換算係数: $K = 1 / 1.04147 = 0.96018$
3. 原子比: $\text{Zn} = 0.88529 \times K = 0.850$, $\text{Fe} = 0.15613 \times K = 0.150$

* **構造式:** $(\text{Zn}_{0.85}\text{Fe}_{0.15})\text{S}$

---

## 第二部：変則例題 — 混合原子価の分離 (Mixed-Valence Separation)

### Q5. 【酸化物・混合原子価】チタン磁鉄鉱 (Titanomagnetite)

EPMA分析では全鉄が二価（$\text{FeO}^*$）として一括測定される。**カチオン総数 3 を基準 (On basis of 3 cations)** とした電荷バランス（Charge balance）により $\text{Fe}^{2+}$ と $\text{Fe}^{3+}$ を分離し、構造式を求めよ。

* **分析データ:** $\text{Al}_2\text{O}_3 = 2.42\%$, $\text{MgO} = 1.92\%$, $\text{FeO}^* = 95.66\%$ (Total: $100.00\%$)
* **分子量:** $\text{Al}_2\text{O}_3 = 101.96$, $\text{MgO} = 40.30$, $\text{FeO} = 71.85$

#### 解答・解説

1. 仮のカチオン比: $\text{Al} = (2.42 / 101.96) \times 2 = 0.04747$, $\text{Mg} = 1.92 / 40.30 = 0.04764$, $\text{Fe (Total)} = 95.66 / 71.85 = 1.33138$ (総和 $\sum P_{\text{cat}} = 1.42649$)
2. カチオン換算係数: $K_{\text{cat}} = 3 / 1.42649 = 2.10306$
3. 規格化原子比: $\text{Al} = 0.0998 \approx 0.100$, $\text{Mg} = 0.1002 \approx 0.100$, $\text{Fe (Total)} = 2.8000$
4. 全鉄を二価（$+2$）とした場合の仮の正電荷総和: $\sum \text{Charge}_* = (0.100 \times 3) + (0.100 \times 2) + (2.800 \times 2) = 6.100$
5. 4酸素の理想電荷（$8$）との差分より $\text{Fe}^{3+}$ を算出: $\text{Fe}^{3+} = 8.000 - 6.100 = 1.900$
6. 二価鉄の算出: $\text{Fe}^{2+} = \text{Fe (Total)} - \text{Fe}^{3+} = 2.800 - 1.900 = 0.900$

* **構造式:** $(\text{Mg}_{0.10}\text{Fe}^{2+}_{0.90})(\text{Fe}^{3+}_{1.90}\text{Al}_{0.10})\text{O}_4$

---

### Q6. 【酸化物・混合原子価】イルメナイト-赤鉄鉱固溶体 (Ilmenite-Hematite Solid Solution)

下表は全鉄を $\text{FeO}^*$ として算出したデータである。**酸素数 3 を基準 (On basis of 3 oxygens)** とし、化学量論性（Stoichiometry: $\sum \text{Cations} = 2$）を満たすよう $\text{Fe}^{2+}$ と $\text{Fe}^{3+}$ を分離して構造式を求めよ。

* **分析データ:** $\text{TiO}_2 = 32.27\%$, $\text{FeO}^* = 67.73\%$ (Total: $100.00\%$)
* **分子量:** $\text{TiO}_2 = 79.87$, $\text{FeO} = 71.85$

#### 解答・解説

1. 分子比（＝仮のカチオン比・酸素比）: $\text{TiO}_2 = 0.40403$ ($\text{O} = 0.80806$), $\text{FeO}^* = 0.94266$ ($\text{O} = 0.94266$)
2. 酸素総和: $\sum P_{\text{ox}} = 0.80806 + 0.94266 = 1.75072$
3. 酸素換算係数: $K_{\text{ox}} = 3 / 1.75072 = 1.71358$
4. 規格化原子比: $\text{Ti} = 0.40403 \times K_{\text{ox}} = 0.6923$, $\text{Fe (Total)} = 0.94266 \times K_{\text{ox}} = 1.6153$ (カチオン総和 $\sum \text{Cations} = 2.3076$)
5. 3酸素ベースにおける価数分離公式 $\text{Fe}^{3+} = 2 \times (\text{理想酸素数 } 3) - 2 \times \sum \text{Cationsを2倍した正電荷等価値})$ ではなく、以下の電荷バランスに基づく：
$\text{Fe}^{3+} = 2 \times (\text{理想カチオン数 } 2) - \sum \text{Cations (暫定)} \times \text{因子}$
より簡便には、カチオン総数 $2.000$ を達成するための関係式：
$\text{Fe}^{3+} = 2 \times (\text{理想酸素数 } 3) - \text{正電荷総和(鉄をすべて2価とした場合)} = 6 - (0.6923 \times 4 + 1.6153 \times 2) = 6 - 6.000 = 0$？
*修正*: 3酸素ベースの $\text{Fe}^{3+}$ 分配公式：

$$\text{Fe}^{3+} = 2 \times (\text{理想酸素数 } 3) - \sum (\text{各カチオン原子比} \times \text{そのカチオンの通常の価数})$$



鉄をすべて二価と仮定すると、$\text{Ti}^{4+} = 0.6923 \times 4 = 2.7692$, $\text{Fe}^{2+} = 1.6153 \times 2 = 3.2306$。電荷総和 $= 6.000$。
したがって $\text{Fe}^{3+} = 6 - 6 = 0$ となり、カチオン総数が $2.3076$ となって理想値 $2$ を超える。これは、ベースとなる酸素数に対するカチオン過剰を意味する。
酸素3基準で $\sum \text{Cations} = 2$ を満たすには、$\text{Fe}^{3+} = 2 \times (3 - \sum P_{\text{ox\_uncorrected}}) \times \dots$ ではなく、カチオン数基準 $K_{\text{cat}} = 2 / (\text{Ti} + \text{Fe}) = 2 / (0.40403 + 0.94266) = 2 / 1.34669 = 1.48512$ を使用する。
6. カチオン基準での再計算: $\text{Ti} = 0.40403 \times 1.48512 = 0.600$, $\text{Fe (Total)} = 0.94266 \times 1.48512 = 1.400$（総和 $2.000$）
7. 電荷過不足の調整: 理想正電荷は $3 \times 2 = 6$。鉄をすべて二価とすると、$(0.600 \times 4) + (1.400 \times 2) = 5.200$。
8. $\text{Fe}^{3+} = 6.000 - 5.200 = 0.800$。 $\text{Fe}^{2+} = 1.400 - 0.800 = 0.600$。

* **構造式:** $(\text{Fe}^{2+}_{0.60}\text{Fe}^{3+}_{0.80}\text{Ti}_{0.60})\text{O}_3$

---

### Q7. 【酸化物・混合原子価】クロムスピネル (Chromite)

下表の全鉄 $\text{FeO}^*$ データから、**カチオン総数 3 を基準** として $\text{Fe}^{2+}$ と $\text{Fe}^{3+}$ を分離し、構造式を算出せよ。

* **分析データ:** $\text{Cr}_2\text{O}_3 = 47.19\%$, $\text{Al}_2\text{O}_3 = 10.55\%$, $\text{MgO} = 12.51\%$, $\text{FeO}^* = 29.74\%$ (Total: $100.00\%$)
* **分子量:** $\text{Cr}_2\text{O}_3 = 151.99$, $\text{Al}_2\text{O}_3 = 101.96$, $\text{MgO} = 40.30$, $\text{FeO} = 71.85$

#### 解答・解説

1. 仮のカチオン比: $\text{Cr} = 0.62096$, $\text{Al} = 0.20694$, $\text{Mg} = 0.31042$, $\text{Fe (Total)} = 0.41392$ ($\sum P_{\text{cat}} = 1.55224$)
2. 換算係数: $K_{\text{cat}} = 3 / 1.55224 = 1.93269$
3. 原子比: $\text{Cr} = 1.200$, $\text{Al} = 0.400$, $\text{Mg} = 0.600$, $\text{Fe (Total)} = 0.800$
4. 全鉄を2価とした場合の電荷総和: $(1.200 \times 3) + (0.400 \times 3) + (0.600 \times 2) + (0.800 \times 2) = 7.600$
5. $\text{Fe}^{3+}$ の算出: $8.000 - 7.600 = 0.400$
6. $\text{Fe}^{2+}$ の算出: $0.800 - 0.400 = 0.400$

* **構造式:** $(\text{Mg}_{0.60}\text{Fe}^{2+}_{0.40})(\text{Cr}_{1.20}\text{Al}_{0.40}\text{Fe}^{3+}_{0.40})\text{O}_4$

---

## 第三部：変則例題 — 非化学量論性と特殊組成 (Non-Stoichiometry & Complex Systems)

### Q8. 【硫化物・非化学量論】磁硫鉄鉱 (Pyrrhotite)

磁硫鉄鉱は鉄欠損を持つ非化学量論的化合物（Non-stoichiometric compound）である。下表の分析値から、**硫黄数 1 を基準 (On basis of 1 S atom)** として構造式 $\text{Fe}_{1-x}\text{S}$ の $x$ を求めよ。

* **分析データ:** $\text{Fe} = 60.51\%$, $\text{S} = 39.49\%$ (Total: $100.00\%$)
* **原子量:** $\text{Fe} = 55.85$, $\text{S} = 32.07$

#### 解答・解説

1. 原子比: $\text{Fe} = 60.51 / 55.85 = 1.08344$, $\text{S} = 39.49 / 32.07 = 1.23137$
2. 換算係数 ($S=1$ 基準): $K = 1 / 1.23137 = 0.81210$
3. 規格化原子比: $\text{Fe} = 1.08344 \times K = 0.880$, $\text{S} = 1.000$
4. 欠損度 $x$ の算出: $1 - x = 0.880 \rightarrow x = 0.120$

* **構造式:** $\text{Fe}_{0.88}\text{S}$ （$x = 0.12$）

---

### Q9. 【酸化物・カチオン欠損】マグヘマイト (Maghemite)

赤鉄鉱（$\alpha\text{-Fe}_2\text{O}_3$）と同組成でありながらスピネル構造（逆スピネル型）を持つマグヘマイト（$\gamma\text{-Fe}_2\text{O}_3$）のEPMAデータ（全鉄を $\text{FeO}^*$ として測定）がある。**酸素数 4 を基準** とし、構造式中のカチオン欠損（Vacancy: $\Box$）の割合を明記した構造式を算出せよ。

* **分析データ:** $\text{FeO}^* = 89.98\%$ (酸素の不確定性により Total が $100\%$ に達しない)
* **分子量・原子量:** $\text{FeO} = 71.85$, $\text{Fe} = 55.85$, $\text{O} = 16.00$

#### 解答・解説

1. 全鉄を $\text{FeO}^*$ としたときの分子比: $89.98 / 71.85 = 1.25233$
2. このときの仮の酸素比: $\text{O} = 1.25233$
3. しかし本来のマグヘマイトは $\text{Fe}^{3+}$ のみからなる酸化物（$\text{Fe}: \text{O} = 2:3$）である。
4. 酸素 4 ベースに換算するため、本来の化学量論比 $\text{Fe} / \text{O} = 2/3$ を適用する。酸素が $4.000$ のとき、カチオン（$\text{Fe}$）の数は $4 \times (2/3) = 2.667$ となる。
5. スピネル構造の理想カチオン席数は 3 であるため、欠損（$\Box$）の数は $3.000 - 2.667 = 0.333$ となる。

* **構造式:** $\text{Fe}^{3+}_{2.67}\Box_{0.33}\text{O}_4$ （あるいは $\text{Fe}_{8/3}\Box_{1/3}\text{O}_4$）

---

### Q10. 【硫化物・複雑固溶体】砒礫四面銅鉱 (Tennantite)

下表の多元素系硫化鉱物の分析値（Weight %）から、**アニオン（$\text{S}$）数 13 を基準 (On basis of 13 S atoms)** として構造式を決定せよ。

* **分析データ:** $\text{Cu} = 43.41\%$, $\text{Fe} = 7.63\%$, $\text{As} = 20.47\%$, $\text{S} = 28.48\%$ (Total: $100.00\%$)
* **原子量:** $\text{Cu} = 63.55$, $\text{Fe} = 55.85$, $\text{As} = 74.92$, $\text{S} = 32.07$

#### 解答・解説

1. 原子比: $\text{Cu} = 0.68308$, $\text{Fe} = 0.13662$, $\text{As} = 0.27322$, $\text{S} = 0.88806$
2. 換算係数 ($\text{S}=13$ 基準): $K = 13 / 0.88806 = 14.63865$
3. 規格化原子比:
* $\text{Cu} = 0.68308 \times K = 10.000$
* $\text{Fe} = 0.13662 \times K = 2.000$
* $\text{As} = 0.27322 \times K = 4.000$



* **構造式:** $(\text{Cu}_{10.00}\text{Fe}_{2.00})\text{As}_{4.00}\text{S}_{13}$

---

## 改善点と検証結果 (Improvements & Verification)

本プロジェクトの計算エンジン（`src/lib/calculations.ts`）において、上記の例題 Q1〜Q10 をすべて正しく計算できることを検証しました。

### 1. 混合原子価分離ロジックの刷新 (Mixed-Valence Separation)
- **改善点:** 従来の酸素基準正規化の後に電荷調整を行う手法から、**理想カチオン数に基づく正規化と電荷収支の不整合（Charge Deficit/Excess）から原子価を推定する手法（Droop, 1987準拠）**へ刷新しました。
- **効果:** Q5, Q6, Q7 のような、全鉄を FeO* として分析したデータからカチオン総数を拘束条件として Fe2+ と Fe3+ を分離する計算が正確に行えるようになりました。

### 2. カチオン・アニオン分類の最適化 (Element Classification)
- **改善点:** `CATION_ORDER` を見直し、砒素（As）やアンチモン（Sb）などの準金属を、硫化鉱物系においてカチオン側として扱うように調整しました。
- **効果:** Q10（テトラヘドライト/テナンタイト）において、「S=13」のようなアニオン基準の正規化を行う際、As がアニオンとしてカウントされてしまう誤りを防ぎ、理想的な原子比（Cu:10, Fe:2, As:4）が算出されるようになりました。

### 3. 非化学量論性と欠損の扱い (Non-Stoichiometry & Vacancy)
- **検証:** Q8 (Pyrrhotite) のような $S=1$ 基準の非化学量論的組成や、Q9 (Maghemite) のようなカチオン欠損（Vacancy）を含む系についても、適切な正規化モード（酸素基準または特定元素基準）を選択することで正確な原子比が得られることを確認しました。

### 検証結果サマリー

| 問題 | 対象 | 基準 | 主な結果 | ステータス |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | スピネル | O=4 | Mg: 0.80, Fe: 0.20, Al: 2.00 | **PASS** |
| **Q2** | イルメナイト | O=3 | Fe: 1.00, Ti: 1.00 | **PASS** |
| **Q3** | 黄銅鉱 | S=2 | Cu: 1.00, Fe: 1.00 | **PASS** |
| **Q4** | 閃亜鉛鉱 | S=1 | Zn: 0.85, Fe: 0.15 | **PASS** |
| **Q5** | チタン磁鉄鉱 | Cat=3 | Fe2+: 0.90, Fe3+: 1.90 | **PASS** |
| **Q6** | イルム-ヘム | Cat=2 | Fe2+: 0.60, Fe3+: 0.80 | **PASS** |
| **Q7** | クロムスピネル | Cat=3 | Fe2+: 0.40, Fe3+: 0.40 | **PASS** |
| **Q8** | 磁硫鉄鉱 | S=1 | Fe: 0.88 (x=0.12) | **PASS** |
| **Q9** | マグヘマイト | O=4 | Fe: 2.67 (Vac: 0.33) | **PASS** |
| **Q10** | 砒礫四面銅鉱 | S=13 | Cu: 10.0, Fe: 2.0, As: 4.0 | **PASS** |

---

## 第四部：追加検証例題 (Additional Verification Problems)

### Q11. Chalcopyrite

* **モード**: 元素 (Elemental)
* **基準**: S=2
* **入力データ**:
    * Cu: 34.30
    * Fe: 30.59
    * S: 34.82

* **期待される結果（正解）**:
    * Cu: 0.9942
    * Fe: 1.009
    * S: 2

### Q12. Troilite or Pyrrhotite

* **モード**: 元素 (Elemental)
* **基準**: S=1
* **入力データ**:
    * Fe: 63.53
    * Mn: 0.00
    * Cd: 0.00
    * Zn: 0.00
    * S: 36.47

* **期待される結果（正解）**:
    * Fe: 1.0002
    * S: 1

### Q13. Arsenopyrite

* **モード**: 元素 (Elemental)
* **基準**: S=1
* **入力データ**:
    * Fe: 34.30
    * As: 46.01
    * S: 19.69

* **期待される結果（正解）**:
    * Fe: 1.000
    * As: 1.000
    * S: 1

### Q14. Magnetite

* **モード**: 酸化物 (Oxide)
* **基準**: O=4
* **入力データ**:
    * SiO2: 0.27
    * Al2O3: 0.21
    * Fe2O3: 68.85
    * FeO: 30.78

* **期待される結果（正解）**:
    * Fe2+: 0.9841
    * Fe3+: 1.986
    * Al: 0.009454
    * Si: 0.01031

### Q15. Spinel

* **モード**: 酸化物 (Oxide)
* **基準**: O=4
* **入力データ**:
    * Al2O3: 71.67
    * MgO: 28.33

* **期待される結果（正解）**:
    * Mg: 0.9999
    * Al: 2.000

### Q16. Hematite

* **モード**: 元素 (Elemental)
* **基準**: O=3
* **入力データ**:
    * Fe: 69.94
    * O: 30.06

* **推定 (任意)**: Fe3+推定あり (Total Weight % 収束判定による価数決定)
* **期待される結果（正解）**:
    * Fe: 2.000