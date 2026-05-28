import { MineralData } from "./types";

export const mineralDb: MineralData[] = [
  { category: "元素鉱物", nameJA: "自然銅", nameEN: "native copper", formula: "Cu" },
  { category: "元素鉱物", nameJA: "自然銀", nameEN: "native silver", formula: "Ag" },
  { category: "元素鉱物", nameJA: "自然金", nameEN: "native gold", formula: "Au" },
  { category: "元素鉱物", nameJA: "自然白金", nameEN: "native platinum", formula: "Pt" },
  { category: "元素鉱物", nameJA: "自然ニッケル", nameEN: "native nickel", formula: "Ni" },
  { category: "元素鉱物", nameJA: "自然鉄", nameEN: "native iron", formula: "Fe" },
  { category: "元素鉱物", nameJA: "自然亜鉛", nameEN: "native zinc", formula: "Zn" },
  { category: "元素鉱物", nameJA: "自然砒", nameEN: "native arsenic", formula: "As" },
  { category: "元素鉱物", nameJA: "自然アンチモニー", nameEN: "native antimony", formula: "Sb" },
  { category: "元素鉱物", nameJA: "自然蒼鉛", nameEN: "native bismuth", formula: "Bi" },
  { category: "元素鉱物", nameJA: "ダイヤモンド", nameEN: "diamond", formula: "C" },
  { category: "元素鉱物", nameJA: "自然珪素", nameEN: "native silicon", formula: "Si" },
  { category: "元素鉱物", nameJA: "グラファイト", nameEN: "graphite", formula: "C" },
  { category: "元素鉱物", nameJA: "自然硫黄", nameEN: "native sulphur", formula: "S" },
  { category: "硫化鉱物", nameJA: "方鉛鉱", nameEN: "galena", formula: "PbS" },
  { category: "硫化鉱物", nameJA: "閃マンガン鉱", nameEN: "alabandite", formula: "MnS" },
  { category: "硫化鉱物", nameJA: "辰砂", nameEN: "cinnabar", formula: "HgS" },
  { category: "硫化鉱物", nameJA: "閃亜鉛鉱", nameEN: "sphalerite", formula: "ZnS" },
  { category: "硫化鉱物", nameJA: "黄銅鉱", nameEN: "chalcopyrite", formula: "CuFeS2" },
  { category: "硫化鉱物", nameJA: "ウルツ鉱", nameEN: "wurtzite", formula: "ZnS" },
  { category: "硫化鉱物", nameJA: "紅砒ニッケル鉱", nameEN: "nickeline", formula: "NiAs" },
  { category: "硫化鉱物", nameJA: "磁硫鉄鉱", nameEN: "pyrrhotite", formula: "Fe1-xS" },
  { category: "硫化鉱物", nameJA: "トロイライト", nameEN: "troilite", formula: "FeS" },
  { category: "硫化鉱物", nameJA: "黄鉄鉱", nameEN: "pyrite", formula: "FeS2" },
  { category: "硫化鉱物", nameJA: "白鉄鉱", nameEN: "marcasite", formula: "FeS2" },
  { category: "硫化鉱物", nameJA: "硫砒鉄鉱", nameEN: "arsenopyrite", formula: "FeAsS" },
  { category: "硫化鉱物", nameJA: "輝安鉱", nameEN: "stibnite", formula: "Sb2S3" },
  { category: "硫化鉱物", nameJA: "輝水鉛鉱", nameEN: "molybdenite", formula: "MoS2" },
  { category: "酸化鉱物", nameJA: "赤銅鉱", nameEN: "cuprite", formula: "Cu2O" },
  { category: "酸化鉱物", nameJA: "緑マンガン鉱", nameEN: "manganosite", formula: "MnO" },
  { category: "酸化鉱物", nameJA: "紅亜鉛鉱", nameEN: "zincite", formula: "ZnO" },
  { category: "酸化鉱物", nameJA: "コランダム", nameEN: "corundum", formula: "Al2O3" },
  { category: "酸化鉱物", nameJA: "赤鉄鉱", nameEN: "hematite", formula: "Fe2O3" },
  { category: "酸化鉱物", nameJA: "ルチル", nameEN: "rutile", formula: "TiO2" },
  { category: "酸化鉱物", nameJA: "錫石", nameEN: "cassiterite", formula: "SnO2" },
  { category: "酸化鉱物", nameJA: "スティショバイト", nameEN: "stishovite", formula: "SiO2" },
  { category: "酸化鉱物", nameJA: "クリストバライト", nameEN: "cristobalite", formula: "SiO2" },
  { category: "酸化鉱物", nameJA: "石英", nameEN: "quartz", formula: "SiO2" },
  { category: "酸化鉱物", nameJA: "スピネル", nameEN: "spinel", formula: "MgAl2O4", sites: [
    { name: "A", capacity: 1, elements: ["Mg", "Fe²⁺", "Mn²⁺", "Zn"] },
    { name: "B", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺"] }
  ]},
  { category: "酸化鉱物", nameJA: "鉄スピネル", nameEN: "hercynite", formula: "FeAl2O4", sites: [
    { name: "A", capacity: 1, elements: ["Fe²⁺", "Mg", "Mn²⁺", "Zn"] },
    { name: "B", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺"] }
  ]},
  { category: "酸化鉱物", nameJA: "フランクリン鉱", nameEN: "franklinite", formula: "ZnFe2O4", sites: [
    { name: "A", capacity: 1, elements: ["Zn", "Mn²⁺", "Fe²⁺", "Mg"] },
    { name: "B", capacity: 2, elements: ["Fe³⁺", "Mn³⁺", "Al", "Cr"] }
  ]},
  { category: "酸化鉱物", nameJA: "磁鉄鉱", nameEN: "magnetite", formula: "FeFe2O4", sites: [
    { name: "A", capacity: 1, elements: ["Fe²⁺", "Mg", "Mn²⁺", "Ni", "Zn"] },
    { name: "B", capacity: 2, elements: ["Fe³⁺", "Al", "Cr", "Ti⁴⁺", "V⁵⁺", "Si"] }
  ]},
  { category: "酸化鉱物", nameJA: "ウルボスピネル", nameEN: "ulvospinel", formula: "TiFe2O4", sites: [
    { name: "A", capacity: 1, elements: ["Fe²⁺", "Mg", "Mn²⁺"] },
    { name: "B", capacity: 2, elements: ["Ti⁴⁺", "Fe²⁺", "Fe³⁺", "Al", "Cr"] }
  ]},
  { category: "酸化鉱物", nameJA: "ハウスマン鉱", nameEN: "hausmannite", formula: "MnMn2O4", sites: [
    { name: "A", capacity: 1, elements: ["Mn²⁺", "Mg", "Fe²⁺", "Zn"] },
    { name: "B", capacity: 2, elements: ["Mn³⁺", "Fe³⁺", "Al", "Cr"] }
  ]},
  { category: "酸化鉱物", nameJA: "チタン鉄鉱", nameEN: "ilmenite", formula: "FeTiO3", sites: [
    { name: "A", capacity: 1, elements: ["Fe²⁺", "Mg", "Mn²⁺", "Ca"] },
    { name: "B", capacity: 1, elements: ["Ti⁴⁺", "Fe³⁺", "Al", "Cr"] }
  ]},
  { category: "酸化鉱物", nameJA: "ペロブスカイト", nameEN: "perovskite", formula: "CaTiO3", sites: [
    { name: "A", capacity: 1, elements: ["Ca", "Na", "K", "Sr", "LREE"] },
    { name: "B", capacity: 1, elements: ["Ti⁴⁺", "Nb", "Ta", "Fe³⁺", "Al", "Si"] }
  ]},
  { category: "酸化鉱物", nameJA: "ブルーサイト", nameEN: "brucite", formula: "Mg(OH)2" },
  { category: "酸化鉱物", nameJA: "ギブサイト", nameEN: "gibbsite", formula: "Al(OH)3" },
  { category: "ハロゲン化鉱物", nameJA: "岩塩", nameEN: "halite", formula: "NaCl" },
  { category: "ハロゲン化鉱物", nameJA: "蛍石", nameEN: "fluorite", formula: "CaF2" },
  { category: "炭酸塩鉱物", nameJA: "方解石", nameEN: "calcite", formula: "CaCO3" },
  { category: "炭酸塩鉱物", nameJA: "菱マンガン鉱", nameEN: "rhodochrosite", formula: "MnCO3" },
  { category: "炭酸塩鉱物", nameJA: "菱鉄鉱", nameEN: "siderite", formula: "FeCO3" },
  { category: "炭酸塩鉱物", nameJA: "菱苦土鉱", nameEN: "magnesite", formula: "MgCO3" },
  { category: "炭酸塩鉱物", nameJA: "アラゴナイト", nameEN: "aragonite", formula: "CaCO3" },
  { category: "炭酸塩鉱物", nameJA: "白鉛鉱", nameEN: "cerussite", formula: "PbCO3" },
  { category: "炭酸塩鉱物", nameJA: "毒重土石", nameEN: "witherite", formula: "BaCO3" },
  { category: "炭酸塩鉱物", nameJA: "ストロンチアン石", nameEN: "strontianite", formula: "SrCO3" },
  { category: "炭酸塩鉱物", nameJA: "ドロマイト", nameEN: "dolomite", formula: "CaMg(CO3)2" },
  { category: "硼酸塩鉱物", nameJA: "小藤石", nameEN: "kotoite", formula: "Mg3(BO3)2" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "硬石膏", nameEN: "anhydrite", formula: "CaSO4" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "重晶石", nameEN: "barite", formula: "BaSO4" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "天青石", nameEN: "celestine", formula: "SrSO4" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "硫酸鉛鉱", nameEN: "anglesite", formula: "PbSO4" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "石こう", nameEN: "gypsum", formula: "CaSO4・2H2O" },
  { category: "硫酸塩鉱物・タングステン酸塩鉱物", nameJA: "灰重石", nameEN: "scheelite", formula: "CaWO4" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "ふっ素燐灰石", nameEN: "fluorapatite", formula: "Ca5(PO4)3F" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "塩素燐灰石", nameEN: "chlorapatite", formula: "Ca5(PO4)3Cl" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "水酸燐灰石", nameEN: "hydroxylapatite", formula: "Ca5(PO4)3(OH)" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "緑鉛鉱", nameEN: "pyromorphite", formula: "Pb5(PO4)3Cl" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "黄鉛鉱", nameEN: "mimetite", formula: "Pb5(AsO4)3Cl" },
  { category: "燐酸塩・砒酸塩・バナジン酸塩鉱物", nameJA: "褐鉛鉱", nameEN: "vanadinite", formula: "Pb5(VO4)3Cl" },
  { category: "ネソ珪酸塩鉱物", nameJA: "苦土かんらん石", nameEN: "forsterite", formula: "Mg2SiO4", sites: [
    { name: "M", capacity: 2, elements: ["Mg", "Fe²⁺", "Mn²⁺", "Ni", "Ca"] },
    { name: "T", capacity: 1, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "鉄かんらん石", nameEN: "fayalite", formula: "Fe2SiO4", sites: [
    { name: "M", capacity: 2, elements: ["Fe²⁺", "Mg", "Mn²⁺", "Ni", "Ca"] },
    { name: "T", capacity: 1, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "モンチセリ石", nameEN: "monticellite", formula: "CaMgSiO4", sites: [
    { name: "M2", capacity: 1, elements: ["Ca", "Mn²⁺", "Sr"] },
    { name: "M1", capacity: 1, elements: ["Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "T", capacity: 1, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "ヒューム石", nameEN: "humite", formula: "Mg7(SiO4)3(OH)2" },
  { category: "ネソ珪酸塩鉱物", nameJA: "コンドロ石", nameEN: "chondrodite", formula: "Mg5(SiO4)2(OH)2" },
  { category: "ネソ珪酸塩鉱物", nameJA: "ジルコン", nameEN: "zircon", formula: "ZrSiO4" },
  { category: "ネソ珪酸塩鉱物", nameJA: "グロシュラー", nameEN: "grossular", formula: "Ca3Al2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Ca", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "Y", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺", "V³⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "アルマンディン", nameEN: "almandine", formula: "Fe3Al2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Fe²⁺", "Mg", "Ca", "Mn²⁺"] },
    { name: "Y", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "パイロープ", nameEN: "pyrope", formula: "Mg3Al2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Mg", "Fe²⁺", "Ca", "Mn²⁺"] },
    { name: "Y", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "スペッサルティン", nameEN: "spessartine", formula: "Mn3Al2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Mn²⁺", "Mg", "Fe²⁺", "Ca"] },
    { name: "Y", capacity: 2, elements: ["Al", "Cr", "Fe³⁺", "Ti⁴⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "アンドラダイト", nameEN: "andradite", formula: "Ca3Fe2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Ca", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "Y", capacity: 2, elements: ["Fe³⁺", "Al", "Cr", "Ti⁴⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "ウバロバイト", nameEN: "uvarovite", formula: "Ca3Cr2(SiO4)3", sites: [
    { name: "X", capacity: 3, elements: ["Ca", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "Y", capacity: 2, elements: ["Cr", "Al", "Fe³⁺", "Ti⁴⁺"] },
    { name: "Z", capacity: 3, elements: ["Si", "Al"] }
  ]},
  { category: "ネソ珪酸塩鉱物", nameJA: "珪線石", nameEN: "sillimanite", formula: "Al2SiO5" },
  { category: "ネソ珪酸塩鉱物", nameJA: "紅柱石", nameEN: "andalusite", formula: "Al2SiO5" },
  { category: "ネソ珪酸塩鉱物", nameJA: "藍晶石", nameEN: "kyanite", formula: "Al2SiO5" },
  { category: "ソロ珪酸塩鉱物", nameJA: "異極鉱", nameEN: "hemimorphite", formula: "Zn4Si2O7(OH)2・H2O" },
  { category: "ソロ珪酸塩鉱物", nameJA: "ベスブ石", nameEN: "vesuvianite", formula: "Ca19(Mg,Fe,Al)5(Al,Fe)8(O,OH)10(SiO4)10(Si2O7)4" },
  { category: "ソロ珪酸塩鉱物", nameJA: "緑簾石", nameEN: "epidote", formula: "Ca2Al2Fe(Si2O7)(SiO4)O(OH)" },
  { category: "ソロ珪酸塩鉱物", nameJA: "紅簾石", nameEN: "piedmontite", formula: "Ca2Al2Mn(Si2O7)(SiO4)O(OH)" },
  { category: "ソロ珪酸塩鉱物", nameJA: "斜灰簾石", nameEN: "clinozoisite", formula: "Ca2Al3(Si2O7)(SiO4)O(OH)" },
  { category: "ソロ珪酸塩鉱物", nameJA: "灰簾石", nameEN: "zoisite", formula: "Ca2Al3(Si2O7)(SiO4)O(OH)" },
  { category: "シクロ珪酸塩鉱物", nameJA: "ベニト石", nameEN: "benitoite", formula: "BaTiSi3O9" },
  { category: "シクロ珪酸塩鉱物", nameJA: "緑柱石", nameEN: "beryl", formula: "Be3Al2Si6O18" },
  { category: "シクロ珪酸塩鉱物", nameJA: "鉄電気石", nameEN: "schorl", formula: "NaFe3Al6(BO3)3Si6O18(OH)4" },
  { category: "シクロ珪酸塩鉱物", nameJA: "大隅石", nameEN: "osumilite", formula: "(K,Na,Ca)Fe2Al3(Si10Al2O30)・H2O" },
  { category: "イノ珪酸塩鉱物", nameJA: "透輝石", nameEN: "diopside", formula: "CaMgSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "M2", capacity: 1, elements: ["Ca", "Na", "Mn²⁺", "Fe²⁺", "Mg"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "ヘデンベルグ輝石", nameEN: "hedenbergite", formula: "CaFeSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Fe²⁺", "Mg", "Mn²⁺"] },
    { name: "M2", capacity: 1, elements: ["Ca", "Na", "Mn²⁺", "Fe²⁺", "Mg"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "ヨハンセン輝石", nameEN: "johannsenite", formula: "CaMnSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Mn²⁺", "Fe²⁺", "Mg"] },
    { name: "M2", capacity: 1, elements: ["Ca", "Na", "Mn²⁺"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "ひすい輝石", nameEN: "jadeite", formula: "NaAlSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Cr", "Mg", "Fe²⁺"] },
    { name: "M2", capacity: 1, elements: ["Na", "Ca"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "エジリン輝石", nameEN: "aegirine", formula: "NaFeSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Fe³⁺", "Al", "Ti⁴⁺", "V³⁺", "Mg", "Fe²⁺"] },
    { name: "M2", capacity: 1, elements: ["Na", "Ca"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "珪灰石", nameEN: "wollastonite", formula: "Ca3Si3O9" },
  { category: "イノ珪酸塩鉱物", nameJA: "ばら輝石", nameEN: "rhodonite", formula: "(Mn,Ca)5Si5O15" },
  { category: "イノ珪酸塩鉱物", nameJA: "パイロクスマンガン石", nameEN: "pyroxmangite", formula: "Mn7Si7O21" },
  { category: "イノ珪酸塩鉱物", nameJA: "透閃石", nameEN: "tremolite", formula: "Ca2Mg5Si8O22(OH)2" },
  { category: "イノ珪酸塩鉱物", nameJA: "直閃石", nameEN: "anthophyllite", formula: "Mg7Si8O22(OH)2" },
  { category: "イノ珪酸塩鉱物", nameJA: "ゾノトラ石", nameEN: "xonotlite", formula: "Ca6Si6O17(OH)2" },
  { category: "イノ珪酸塩鉱物", nameJA: "単斜ジムトンプソン石", nameEN: "clinojimthompsonite", formula: "(Mg,Fe)17Si20O54(OH)6" },
  { category: "イノ珪酸塩鉱物", nameJA: "チェスタライト", nameEN: "chesterite", formula: "(Mg,Fe)17Si20O54(OH)6" },
  { category: "フィロ珪酸塩鉱物", nameJA: "白雲母", nameEN: "muscovite", formula: "KAl2(Si3AlO10)(OH,F)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "金雲母", nameEN: "phlogopite", formula: "KMg3(Si3AlO10)(OH,F)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "パイロフィライト", nameEN: "pyrophyllite", formula: "Al2Si4O10(OH)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "滑石", nameEN: "talc", formula: "Mg3Si4O10(OH)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "クリノクロア", nameEN: "clinochlore", formula: "Mg5Al(Si3AlO10)(OH)8" },
  { category: "フィロ珪酸塩鉱物", nameJA: "アンチゴライト", nameEN: "antigorite", formula: "Mg6Si4O10(OH)8" },
  { category: "フィロ珪酸塩鉱物", nameJA: "カオリナイト", nameEN: "kaolinite", formula: "Al4Si4O10(OH)8" },
  { category: "フィロ珪酸塩鉱物", nameJA: "モンモリロナイト", nameEN: "montmorillonite", formula: "(Na,Ca)0.3(Al,Mg)2(Si4O10)(OH)2・nH2O" },
  { category: "フィロ珪酸塩鉱物", nameJA: "スチルプノメレーン", nameEN: "stilpnomelane", formula: "K3-x(Fe,Mn,Mg)24(Si,Al)36O84(O,OH)30" },
  { category: "テクト珪酸塩鉱物", nameJA: "ネフェリン", nameEN: "nepheline", formula: "KNa3(AlSiO4)4" },
  { category: "テクト珪酸塩鉱物", nameJA: "正長石", nameEN: "orthoclase", formula: "KAlSi3O8", sites: [
    { name: "A", capacity: 1, elements: ["K", "Na", "Ba", "Ca"] },
    { name: "T", capacity: 4, elements: ["Si", "Al", "Fe³⁺"] }
  ]},
  { category: "テクト珪酸塩鉱物", nameJA: "曹長石", nameEN: "albite", formula: "NaAlSi3O8", sites: [
    { name: "A", capacity: 1, elements: ["Na", "Ca", "K"] },
    { name: "T", capacity: 4, elements: ["Si", "Al", "Fe³⁺"] }
  ]},
  { category: "テクト珪酸塩鉱物", nameJA: "灰長石", nameEN: "anorthite", formula: "CaAl2Si2O8", sites: [
    { name: "A", capacity: 1, elements: ["Ca", "Na", "K"] },
    { name: "T", capacity: 4, elements: ["Si", "Al", "Fe³⁺"] }
  ]},
  { category: "テクト珪酸塩鉱物", nameJA: "ソーダ沸石", nameEN: "natrolite", formula: "Na2Al2Si3O10・2H2O" },
  { category: "テクト珪酸塩鉱物", nameJA: "方沸石", nameEN: "analcime", formula: "NaAlSi2O6・H2O" },
  { category: "テクト珪酸塩鉱物", nameJA: "菱沸石", nameEN: "chabazite", formula: "(Ca0.5,Na,K)Al4Si8O24・12H2O" },
  { category: "テクト珪酸塩鉱物", nameJA: "輝沸石", nameEN: "heulandite", formula: "(Ca0.5,Na,K)4.5Al9Si27O72・24H2O" },
  // Additional Minerals
  { category: "硫化鉱物", nameJA: "斑銅鉱", nameEN: "bornite", formula: "Cu5FeS4" },
  { category: "硫化鉱物", nameJA: "銅藍", nameEN: "covellite", formula: "CuS" },
  { category: "硫化鉱物", nameJA: "輝銅鉱", nameEN: "chalcocite", formula: "Cu2S" },
  { category: "硫化鉱物", nameJA: "四面銅鉱", nameEN: "tetrahedrite", formula: "Cu12Sb4S13" },
  { category: "硫化鉱物", nameJA: "砒四面銅鉱", nameEN: "tennantite", formula: "Cu12As4S13" },
  { category: "酸化鉱物", nameJA: "クロム鉄鉱", nameEN: "chromite", formula: "FeCr2O4", sites: [
    { name: "A", capacity: 1, elements: ["Fe²⁺", "Mg", "Mn²⁺", "Zn"] },
    { name: "B", capacity: 2, elements: ["Cr", "Al", "Fe³⁺", "Ti⁴⁺"] }
  ]},
  { category: "酸化鉱物", nameJA: "針鉄鉱", nameEN: "goethite", formula: "FeO(OH)" },
  { category: "酸化鉱物", nameJA: "褐鉄鉱", nameEN: "limonite", formula: "FeO(OH)・nH2O" },
  { category: "酸化鉱物", nameJA: "ペリクレース", nameEN: "periclase", formula: "MgO" },
  { category: "炭酸塩鉱物", nameJA: "孔雀石", nameEN: "malachite", formula: "Cu2(CO3)(OH)2" },
  { category: "炭酸塩鉱物", nameJA: "藍銅鉱", nameEN: "azurite", formula: "Cu3(CO3)2(OH)2" },
  { category: "ネソ珪酸塩鉱物", nameJA: "チタナイト", nameEN: "titanite", formula: "CaTiSiO5" },
  { category: "ネソ珪酸塩鉱物", nameJA: "トパーズ", nameEN: "topaz", formula: "Al2SiO4(F,OH)2" },
  { category: "ネソ珪酸塩鉱物", nameJA: "十字石", nameEN: "staurolite", formula: "Fe2Al9Si4O22(OH)2" },
  { category: "イノ珪酸塩鉱物", nameJA: "普通輝石", nameEN: "augite", formula: "(Ca,Na)(Mg,Fe,Al,Ti)(Si,Al)2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "M2", capacity: 1, elements: ["Ca", "Na", "Mn²⁺", "Fe²⁺", "Mg"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "頑火輝石", nameEN: "enstatite", formula: "Mg2Si2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Mg", "Fe²⁺", "Mn²⁺"] },
    { name: "M2", capacity: 1, elements: ["Mg", "Fe²⁺", "Ca", "Mn²⁺", "Na"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "鉄輝石", nameEN: "ferrosilite", formula: "Fe2Si2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺", "Ti⁴⁺", "Cr", "Fe²⁺", "Mg", "Mn²⁺"] },
    { name: "M2", capacity: 1, elements: ["Fe²⁺", "Mg", "Ca", "Mn²⁺", "Na"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "リチア輝石", nameEN: "spodumene", formula: "LiAlSi2O6", sites: [
    { name: "T", capacity: 2, elements: ["Si", "Al"] },
    { name: "M1", capacity: 1, elements: ["Al", "Fe³⁺"] },
    { name: "M2", capacity: 1, elements: ["Li", "Na"] }
  ]},
  { category: "イノ珪酸塩鉱物", nameJA: "藍閃石", nameEN: "glaucophane", formula: "Na2Mg3Al2Si8O22(OH)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "鉄雲母", nameEN: "annite", formula: "KFe3(AlSi3O10)(OH,F)2" },
  { category: "フィロ珪酸塩鉱物", nameJA: "クリソタイル", nameEN: "chrysotile", formula: "Mg3Si2O5(OH)4" },
  { category: "テクト珪酸塩鉱物", nameJA: "白榴石", nameEN: "leucite", formula: "KAlSi2O6" },
  { category: "テクト珪酸塩鉱物", nameJA: "ソーダ石", nameEN: "sodalite", formula: "Na8(Al6Si6O24)Cl2" },
  { category: "高圧相鉱物", nameJA: "ワズレイアイト", nameEN: "wadsleyite", formula: "Mg2SiO4" },
  { category: "高圧相鉱物", nameJA: "リングウッダイト", nameEN: "ringwoodite", formula: "Mg2SiO4" },
  { category: "高圧相鉱物", nameJA: "ブリッジマナイト", nameEN: "bridgmanite", formula: "MgSiO3" },
  { category: "高圧相鉱物", nameJA: "アキモトアイト", nameEN: "akimotoite", formula: "MgSiO3" },
  { category: "高圧相鉱物", nameJA: "デイブマオアイト", nameEN: "davemaoite", formula: "CaSiO3" },
  { category: "高圧相鉱物", nameJA: "フェロペリクレース", nameEN: "ferropericlase", formula: "(Mg,Fe)O" },
];
