const MAX_CHARS = 23;
const CUSTOM_FAMILY = "UserCutFont";
const FPS = 30;
const SIZES = {
  "9:16": { w: 1080, h: 1920 },
  "1:1": { w: 1080, h: 1080 },
  "16:9": { w: 1920, h: 1080 },
};

const RANDOM_KEYWORDS = {
  zh: [
    "人工智能", "开源模型", "具身智能", "量子计算", "商业航天",
    "端侧芯片", "固态电池", "自动驾驶", "低空经济", "合成生物",
    "深空探测", "绿电直连", "数字修复", "城市更新", "独立游戏",
    "降息周期", "稀土永磁", "算力集群",
  ],
  hant: [
    "人工智慧", "開源模型", "具身智慧", "量子運算", "商業航太",
    "邊緣晶片", "固態電池", "自動駕駛", "低空經濟", "合成生物",
    "深空探測", "綠電直供", "數位修復", "都市更新", "獨立遊戲",
    "降息週期", "稀土永磁", "算力叢集",
  ],
  en: [
    "Open Source", "RATE CUTS", "Rare Earths", "Neural Chips", "Quantum Leap",
    "Spaceflight", "Clean Grid", "Edge Compute", "Robotics", "Fusion Power",
    "Biofoundry", "WebGPU", "Deep Sea", "High Speed", "Film Craft",
    "Autonomous", "Zero Carbon", "Semiconductors", "Sovereign AI", "Grid Scale",
    "Dark Matter", "Gene Editing", "Antitrust", "Artificial Intelligence",
  ],
};

function normalizeLocale(locale) {
  if (locale === "en") return "en";
  if (locale === "hant") return "hant";
  return "zh";
}

function cssFont(weight, px, family, italic) {
  const size = Number.isFinite(px) && px > 0 ? px : 32;
  return `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
}

function fontPx(fontSpec) {
  const m = String(fontSpec).match(/([\d.]+)px/);
  const n = m ? Number(m[1]) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 32;
}

function finite(n, fallback) {
  return Number.isFinite(n) ? n : fallback;
}

function keywordUnits(keyword) {
  return Math.max(1, [...String(keyword || "").replace(/\s+/g, "")].length);
}

function hashString(str) {
  const s = String(str || "");
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const FONT_CATALOG = {
  zh: [
    { id: "song", label: "宋体", zhLabel: "宋体", hantLabel: "宋體", enLabel: "SimSun (Songti)", family: 'SimSun, "Noto Serif SC", serif' },
    { id: "noto-serif", label: "思源宋体", zhLabel: "思源宋体", hantLabel: "思源宋體", enLabel: "Noto Serif SC", family: '"Noto Serif SC", SimSun, serif' },
    { id: "kai", label: "楷体", zhLabel: "楷体", hantLabel: "楷體", enLabel: "KaiTi", family: "KaiTi, STKaiti, serif" },
    { id: "fang", label: "仿宋", zhLabel: "仿宋", hantLabel: "仿宋", enLabel: "FangSong", family: "FangSong, STFangsong, serif" },
    { id: "hei", label: "黑体", zhLabel: "黑体", hantLabel: "黑體", enLabel: "SimHei", family: 'SimHei, "Microsoft YaHei", sans-serif' },
    { id: "yahei", label: "微软雅黑", zhLabel: "微软雅黑", hantLabel: "微軟雅黑", enLabel: "Microsoft YaHei", family: '"Microsoft YaHei", sans-serif' },
    { id: "noto-sans", label: "思源黑体", zhLabel: "思源黑体", hantLabel: "思源黑體", enLabel: "Noto Sans SC", family: '"Noto Sans SC", sans-serif' },
  ],
  hant: [
    { id: "noto-serif-tc", label: "思源宋體", zhLabel: "思源宋体", enLabel: "Noto Serif TC", family: '"Noto Serif TC", PMingLiU, "Songti TC", serif' },
    { id: "ming", label: "新細明體", zhLabel: "新细明体", enLabel: "PMingLiU (Mingti)", family: 'PMingLiU, MingLiU, "Songti TC", "Noto Serif TC", serif' },
    { id: "kai-tc", label: "標楷體", zhLabel: "标楷体", enLabel: "DFKai-SB (BiauKai)", family: 'DFKai-SB, BiauKai, "Kaiti TC", KaiTi, "Noto Serif TC", serif' },
    { id: "fang-tc", label: "仿宋體", zhLabel: "仿宋体", enLabel: "FangSong TC", family: 'FangSong, STFangsong, "Noto Serif TC", serif' },
    { id: "noto-sans-tc", label: "思源黑體", zhLabel: "思源黑体", enLabel: "Noto Sans TC", family: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif' },
    { id: "jhenghei", label: "微軟正黑體", zhLabel: "微软正黑体", enLabel: "Microsoft JhengHei", family: '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif' },
  ],
  en: [
    { id: "playfair", label: "Playfair Display", family: '"Playfair Display", Georgia, serif' },
    { id: "georgia", label: "Georgia", family: "Georgia, serif" },
    { id: "times", label: "Times New Roman", family: '"Times New Roman", Times, serif' },
    { id: "baskerville", label: "Libre Baskerville", family: '"Libre Baskerville", Georgia, serif' },
    { id: "newsreader", label: "Newsreader", family: "Newsreader, Georgia, serif" },
    { id: "oswald", label: "Oswald", family: "Oswald, sans-serif" },
    { id: "inter", label: "Inter", family: "Inter, Arial, sans-serif" },
    { id: "roboto-black", label: "Roboto Black", family: '"Roboto-Black", sans-serif' },
    { id: "roboto-blackitalic", label: "Roboto Black Italic", family: '"Roboto-BlackItalic", sans-serif' },
    { id: "roboto-condensed", label: "Roboto Condensed", family: '"Roboto-Condensed", sans-serif' },
    { id: "roboto-italic", label: "Roboto Italic", family: '"Roboto-Italic", sans-serif' },
    { id: "roboto-light", label: "Roboto Light", family: '"Roboto-Light", sans-serif' },
  ],
};

const MAST_FAMILY = {
  "noto-sans": '"Noto Sans SC", sans-serif',
  "noto-serif": '"Noto Serif SC", SimSun, serif',
  kai: "KaiTi, STKaiti, serif",
  hei: 'SimHei, "Microsoft YaHei", sans-serif',
  song: 'SimSun, "Noto Serif SC", serif',
  "noto-sans-tc": '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
  "noto-serif-tc": '"Noto Serif TC", PMingLiU, "Songti TC", serif',
  "kai-tc": 'DFKai-SB, BiauKai, "Kaiti TC", KaiTi, "Noto Serif TC", serif',
  jhenghei: '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif',
  ming: 'PMingLiU, MingLiU, "Songti TC", "Noto Serif TC", serif',
  inter: "Inter, Arial, sans-serif",
  oswald: "Oswald, sans-serif",
  times: '"Times New Roman", Times, serif',
  playfair: '"Playfair Display", Georgia, serif',
  baskerville: '"Libre Baskerville", Georgia, serif',
};

const PAPER_KINDS = {
  zh: [
    { id: "metro", kicker: "城事聚焦", fonts: ["song", "noto-serif"], mast: "noto-sans", hue: [38, 48], sat: [10, 20], light: [92, 96], fmts: [0, 2, 3], layouts: ["headline", "columns", "photo", "pullquote"] },
    { id: "finance", kicker: "市场观察", fonts: ["noto-serif", "song", "hei"], mast: "noto-serif", hue: [20, 32], sat: [24, 40], light: [89, 93], fmts: [5, 0, 1], layouts: ["table", "headline", "columns", "wire"] },
    { id: "business", kicker: "产业纵深", fonts: ["noto-serif", "yahei", "song"], mast: "hei", hue: [36, 46], sat: [12, 22], light: [91, 95], fmts: [0, 1, 4], layouts: ["headline", "columns", "pullquote", "table"] },
    { id: "weekly", kicker: "封面报道", fonts: ["noto-serif", "kai", "song"], mast: "noto-serif", hue: [34, 44], sat: [10, 18], light: [92, 96], fmts: [1, 4, 7], layouts: ["pullquote", "headline", "columns", "photo"] },
    { id: "evening", kicker: "晚间博览", fonts: ["song", "kai", "noto-serif"], mast: "song", hue: [30, 42], sat: [14, 26], light: [90, 94], fmts: [0, 3, 4], layouts: ["photo", "columns", "headline"] },
    { id: "tech", kicker: "硬科技周刊", fonts: ["noto-sans", "hei", "yahei"], mast: "noto-sans", hue: [40, 52], sat: [6, 14], light: [93, 97], fmts: [6, 2, 1], layouts: ["headline", "wire", "columns", "pullquote"] },
    { id: "sports", kicker: "焦点战报", fonts: ["hei", "noto-sans", "yahei"], mast: "hei", hue: [42, 56], sat: [10, 20], light: [91, 95], fmts: [3, 2, 6], layouts: ["sports", "photo", "headline"] },
    { id: "culture", kicker: "艺文副刊", fonts: ["noto-serif", "kai", "fang"], mast: "noto-serif", hue: [35, 45], sat: [12, 22], light: [92, 96], fmts: [7, 0, 4], layouts: ["pullquote", "photo", "body", "columns"] },
    { id: "science", kicker: "前沿探索", fonts: ["noto-serif", "noto-sans", "song"], mast: "noto-sans", hue: [42, 54], sat: [6, 14], light: [94, 97], fmts: [7, 6, 0], layouts: ["columns", "headline", "photo", "body"] },
    { id: "classified", kicker: "分类指南", fonts: ["song", "hei", "fang"], mast: "hei", hue: [38, 48], sat: [8, 16], light: [92, 96], fmts: [4, 0], layouts: ["classified", "table", "columns"] },
    { id: "digest", kicker: "每周精粹", fonts: ["fang", "song", "noto-serif"], mast: "song", hue: [36, 46], sat: [10, 18], light: [92, 95], fmts: [7, 4, 0], layouts: ["wire", "pullquote", "columns", "body"] },
    { id: "wire", kicker: "电报直达", fonts: ["noto-sans", "yahei", "hei"], mast: "noto-sans", hue: [38, 50], sat: [8, 16], light: [93, 96], fmts: [6, 1, 2], layouts: ["wire", "table", "headline"] },
  ],
  hant: [
    { id: "metro", kicker: "都會焦點", fonts: ["ming", "noto-serif-tc"], mast: "noto-sans-tc", hue: [38, 48], sat: [10, 20], light: [92, 96], fmts: [0, 2, 3], layouts: ["headline", "columns", "photo", "pullquote"] },
    { id: "finance", kicker: "市場觀察", fonts: ["noto-serif-tc", "ming", "jhenghei"], mast: "noto-serif-tc", hue: [20, 32], sat: [24, 40], light: [89, 93], fmts: [5, 0, 1], layouts: ["table", "headline", "columns", "wire"] },
    { id: "business", kicker: "產業縱深", fonts: ["noto-serif-tc", "jhenghei", "ming"], mast: "jhenghei", hue: [36, 46], sat: [12, 22], light: [91, 95], fmts: [0, 1, 4], layouts: ["headline", "columns", "pullquote", "table"] },
    { id: "weekly", kicker: "封面報導", fonts: ["noto-serif-tc", "kai-tc", "ming"], mast: "noto-serif-tc", hue: [34, 44], sat: [10, 18], light: [92, 96], fmts: [1, 4, 7], layouts: ["pullquote", "headline", "columns", "photo"] },
    { id: "evening", kicker: "晚間博覽", fonts: ["ming", "kai-tc", "noto-serif-tc"], mast: "ming", hue: [30, 42], sat: [14, 26], light: [90, 94], fmts: [0, 3, 4], layouts: ["photo", "columns", "headline"] },
    { id: "tech", kicker: "硬科技週刊", fonts: ["noto-sans-tc", "jhenghei"], mast: "noto-sans-tc", hue: [40, 52], sat: [6, 14], light: [93, 97], fmts: [6, 2, 1], layouts: ["headline", "wire", "columns", "pullquote"] },
    { id: "sports", kicker: "焦點戰報", fonts: ["jhenghei", "noto-sans-tc"], mast: "jhenghei", hue: [42, 56], sat: [10, 20], light: [91, 95], fmts: [3, 2, 6], layouts: ["sports", "photo", "headline"] },
    { id: "culture", kicker: "藝文副刊", fonts: ["noto-serif-tc", "kai-tc", "fang-tc"], mast: "noto-serif-tc", hue: [35, 45], sat: [12, 22], light: [92, 96], fmts: [7, 0, 4], layouts: ["pullquote", "photo", "body", "columns"] },
    { id: "science", kicker: "前瞻探索", fonts: ["noto-serif-tc", "noto-sans-tc", "ming"], mast: "noto-sans-tc", hue: [42, 54], sat: [6, 14], light: [94, 97], fmts: [7, 6, 0], layouts: ["columns", "headline", "photo", "body"] },
    { id: "classified", kicker: "分類指南", fonts: ["ming", "jhenghei", "fang-tc"], mast: "jhenghei", hue: [38, 48], sat: [8, 16], light: [92, 96], fmts: [4, 0], layouts: ["classified", "table", "columns"] },
    { id: "digest", kicker: "每週精選", fonts: ["fang-tc", "ming", "noto-serif-tc"], mast: "ming", hue: [36, 46], sat: [10, 18], light: [92, 95], fmts: [7, 4, 0], layouts: ["wire", "pullquote", "columns", "body"] },
    { id: "wire", kicker: "電訊直擊", fonts: ["noto-sans-tc", "jhenghei"], mast: "noto-sans-tc", hue: [38, 50], sat: [8, 16], light: [93, 96], fmts: [6, 1, 2], layouts: ["wire", "table", "headline"] },
  ],
  en: [
    { id: "broadsheet", kicker: "NATIONAL DESK", fonts: ["playfair", "times", "baskerville"], mast: "playfair", hue: [38, 48], sat: [10, 20], light: [92, 96], fmts: [0, 4], layouts: ["headline", "columns", "photo", "pullquote"] },
    { id: "ft_pink", kicker: "COMPANIES & MARKETS", fonts: ["times", "baskerville", "newsreader"], mast: "playfair", hue: [19, 29], sat: [34, 50], light: [88, 92], fmts: [5, 0], layouts: ["table", "columns", "headline", "pullquote"] },
    { id: "guardian", kicker: "THE LONG READ", fonts: ["playfair", "georgia", "newsreader"], mast: "inter", hue: [40, 50], sat: [8, 16], light: [93, 97], fmts: [2, 6], layouts: ["headline", "pullquote", "photo", "columns"] },
    { id: "economist", kicker: "BRIEFING", fonts: ["baskerville", "newsreader", "georgia"], mast: "inter", hue: [38, 46], sat: [8, 16], light: [93, 97], fmts: [1, 7], layouts: ["pullquote", "columns", "headline", "table"] },
    { id: "wsj", kicker: "WHAT'S NEWS", fonts: ["times", "baskerville", "georgia"], mast: "times", hue: [36, 45], sat: [10, 18], light: [92, 96], fmts: [0, 4, 5], layouts: ["columns", "wire", "table", "headline"] },
    { id: "wire", kicker: "NEWSWIRE BULLETIN", fonts: ["inter", "roboto-condensed", "georgia"], mast: "inter", hue: [40, 50], sat: [6, 14], light: [93, 97], fmts: [6, 1], layouts: ["wire", "headline", "table"] },
    { id: "tech", kicker: "COMPUTE & SILICON", fonts: ["oswald", "inter", "roboto-condensed"], mast: "oswald", hue: [40, 52], sat: [6, 14], light: [93, 97], fmts: [6, 2, 3], layouts: ["headline", "pullquote", "photo", "wire"] },
    { id: "science", kicker: "RESEARCH BRIEFING", fonts: ["baskerville", "newsreader", "times"], mast: "baskerville", hue: [42, 52], sat: [6, 12], light: [94, 97], fmts: [7, 0], layouts: ["columns", "body", "photo", "headline"] },
    { id: "tabloid", kicker: "CITY FINAL", fonts: ["oswald", "roboto-black", "georgia"], mast: "oswald", hue: [40, 54], sat: [14, 28], light: [90, 95], fmts: [3, 4], layouts: ["photo", "headline", "columns"] },
    { id: "sports", kicker: "MATCHDAY DESK", fonts: ["oswald", "roboto-black", "roboto-condensed"], mast: "oswald", hue: [44, 58], sat: [10, 18], light: [91, 95], fmts: [3, 2, 6], layouts: ["sports", "photo", "headline"] },
    { id: "culture", kicker: "BOOKS & ARTS", fonts: ["playfair", "newsreader", "baskerville"], mast: "playfair", hue: [35, 45], sat: [12, 22], light: [92, 96], fmts: [7, 0, 4], layouts: ["pullquote", "body", "photo", "columns"] },
    { id: "classified", kicker: "EXCHANGE & ROLES", fonts: ["times", "georgia", "roboto-condensed"], mast: "inter", hue: [38, 48], sat: [8, 16], light: [92, 96], fmts: [4, 0], layouts: ["classified", "columns"] },
    { id: "weather", kicker: "SYNOPTIC ALMANAC", fonts: ["roboto-condensed", "inter", "georgia"], mast: "inter", hue: [198, 216], sat: [8, 16], light: [92, 96], fmts: [7, 6], layouts: ["weather", "table", "columns"] },
  ],
};

function fontById(locale, id) {
  const list = FONT_CATALOG[locale] || FONT_CATALOG.zh;
  return list.find(f => f.id === id) || list[0];
}

function kindById(locale, id) {
  const list = PAPER_KINDS[locale] || PAPER_KINDS.zh;
  return list.find(k => k.id === id) || null;
}

const PUNCT_NO_START = "，。、》」』”’！？；：%）〕】…—";
const PUNCT_NO_END = "《「『“‘（〔【";
const FORMAT_CATALOG = [
  { value: "mp4", label: "MP4 (H.264)", ext: "mp4", candidates: [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4;codecs=avc1",
    "video/mp4;codecs=h264,opus",
    "video/mp4;codecs=h264",
    "video/mp4",
  ]},
  { value: "webm-vp9", label: "WebM (VP9)", ext: "webm", candidates: ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp9"] },
  { value: "webm-vp8", label: "WebM (VP8)", ext: "webm", candidates: ["video/webm;codecs=vp8,opus", "video/webm;codecs=vp8"] },
  { value: "webm", label: "WebM", ext: "webm", candidates: ["video/webm"] },
];

function supports(mime) {
  try { return typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime); } catch { return false; }
}

function probeFormats() {
  return FORMAT_CATALOG
    .map(f => ({ ...f, mime: f.candidates.find(supports) }))
    .filter(f => f.mime)
    .filter((f, i, arr) => {
      if (f.value === "webm") return !arr.some(o => o.ext === "webm" && o.value !== "webm");
      return true;
    });
}

function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rr = (r, a, b) => a + r() * (b - a);
const ri = (r, a, b) => Math.floor(a + r() * (b - a + 1));
const pick = (r, a) => a[Math.floor(r() * a.length)];
const shuffle = (r, a) => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

function hexToRgba(hex, a) {
  const h = String(hex || "#ffe72e").replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  if (!Number.isFinite(n)) return `rgba(255,231,46,${a})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function easeCurve(kind, t) {
  const u = Math.min(1, Math.max(0, t));
  if (kind === "in") return u * u;
  if (kind === "out") return 1 - (1 - u) * (1 - u);
  return u;
}

function planCutSchedule(opts) {
  const D = Math.max(1, Number(opts.duration) || 4);
  const holdSec = opts.hold ? 1 : 0;
  const active = Math.max(0.2, D - holdSec);
  const c0 = Math.max(2, Number(opts.cps0) || 12);
  const c1 = Math.max(2, Number(opts.cps1) || c0);
  const fps = Math.max(1, opts.fps || (Math.max(c0, c1) > 15 ? 60 : FPS));
  const totalFrames = Math.max(1, Math.round(D * fps));
  const cutAt = new Int16Array(totalFrames);
  const cpsAtCut = [c0];
  let acc = 0;
  let nCuts = 1;
  const changeAt = [0];
  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    if (t >= active) {
      cutAt[f] = nCuts - 1;
      continue;
    }
    const cps = c0 + (c1 - c0) * easeCurve(opts.curve, t / active);
    const idx = Math.min(359, Math.floor(acc + 1e-9));
    if (idx > nCuts - 1) {
      nCuts = idx + 1;
      changeAt.push(f);
      cpsAtCut.push(cps);
    }
    cutAt[f] = idx;
    acc += cps / fps;
  }
  nCuts = Math.max(1, Math.min(360, nCuts));
  for (let f = 0; f < totalFrames; f++) {
    if (cutAt[f] > nCuts - 1) cutAt[f] = nCuts - 1;
  }
  return { nCuts, totalFrames, fps, cutAt, changeAt, cpsAtCut };
}

function splitSentences(text, locale) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  const parts = locale === "en"
    ? raw.split(/(?<=[.!?])(?:\s+|$)|[\n\r]+/)
    : raw.split(/[。！？\n\r]+/);
  return parts.map(s => s.trim()).filter(Boolean);
}

function customHighlightSents(text, keyword, locale) {
  const kw = String(keyword || "").trim();
  if (!kw) return [];
  return splitSentences(text, locale).filter(s => s.includes(kw));
}

function withCustomCopy(copy, keyword, customText, mixBg, locale) {
  const out = Object.assign({}, copy);
  const hl = customHighlightSents(customText, keyword, locale);
  if (hl.length) {
    out.customHl = hl;
    out.headlineWithKeyword = hl;
    out.pullquotesWithKeyword = hl;
  }
  if (mixBg) {
    const all = splitSentences(customText, locale);
    if (all.length) out.sentences = all.concat(all, copy.sentences || []);
  }
  return out;
}

function tokenize(text, keyword) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (keyword && text.startsWith(keyword, i)) {
      tokens.push(keyword);
      i += keyword.length;
    } else {
      tokens.push(text[i]);
      i += 1;
    }
  }
  return tokens;
}

function injectKeyword(sentence, keyword, r, locale) {
  if (locale === "en") {
    const words = String(sentence || "").replace(/[.?!]+$/, "").split(/\s+/).filter(Boolean);
    const at = ri(r, 0, Math.max(0, words.length));
    words.splice(at, 0, keyword);
    return words.join(" ") + ".";
  }
  const s = String(sentence || "").replace(/[。！？]+$/g, "");
  const cuts = [];
  for (let i = 0; i < s.length; i++) {
    if ("，、；： ".includes(s[i])) cuts.push(i + 1);
  }
  const before = locale === "hant"
    ? pick(r, ["", "", "", "", "圍繞", "隨著", "聚焦", "依託"])
    : pick(r, ["", "", "", "", "围绕", "随着", "聚焦", "依托"]);
  const after = locale === "hant"
    ? pick(r, ["", "", "", "", "的", "中", "後", "方案", "體系", "：", "，"])
    : pick(r, ["", "", "", "", "的", "中", "后", "方案", "体系", "：", "，"]);
  const glue = (rawLeft, rawRight) => {
    const left = String(rawLeft || "").replace(/[，、；：\s]+$/, "");
    const right = String(rawRight || "").replace(/^[，、；：\s。！？]+/, "");
    if (!right) return `${left ? left + "，" : ""}${before}${keyword}${after === "：" || after === "，" ? "" : after}。`;
    return `${left ? left + "，" : ""}${before}${keyword}${after}${right}。`;
  };
  if (cuts.length) {
    const at = cuts[ri(r, 0, cuts.length - 1)];
    return glue(s.slice(0, at), s.slice(at));
  }
  const mid = Math.max(1, Math.floor(s.length * (0.3 + r() * 0.4)));
  const mode = ri(r, 0, 2);
  if (mode === 0) return glue("", s);
  if (mode === 1) return glue(s, "");
  return glue(s.slice(0, mid), s.slice(mid));
}

function wrapEn(ctx, text, maxW) {
  const out = [];
  const words = String(text).split(" ");
  let line = "";
  const take = (w) => {
    if (ctx.measureText(w).width <= maxW) {
      const t = line ? `${line} ${w}` : w;
      if (line && ctx.measureText(t).width > maxW) {
        out.push(line);
        line = w;
      } else line = t;
      return;
    }
    if (line) { out.push(line); line = ""; }
    let chunk = "";
    for (const ch of w) {
      const t = chunk + ch;
      if (chunk && ctx.measureText(t).width > maxW) {
        out.push(chunk);
        chunk = ch;
      } else chunk = t;
    }
    line = chunk;
  };
  for (const w of words) take(w);
  if (line) out.push(line);
  return out;
}

function wrap(ctx, text, maxW, keyword, locale) {
  if (locale === "en") return wrapEn(ctx, text, maxW);
  const rawTokens = tokenize(text, keyword);
  const tokens = [];
  for (let i = 0; i < rawTokens.length; i++) {
    let tok = rawTokens[i];
    while (tok.length === 1 && PUNCT_NO_END.includes(tok) && i + 1 < rawTokens.length) {
      i += 1;
      tok += rawTokens[i];
    }
    tokens.push(tok);
  }
  const out = [];
  let line = "";
  for (const tok of tokens) {
    const t = line + tok;
    if (line && ctx.measureText(t).width > maxW) {
      out.push(line);
      line = tok;
    } else {
      line = t;
    }
  }
  if (line) out.push(line);
  for (let i = 1; i < out.length; i++) {
    while (out[i] && PUNCT_NO_START.includes(out[i][0])) {
      out[i - 1] += out[i][0];
      out[i] = out[i].slice(1);
    }
    if (!out[i]) {
      out.splice(i, 1);
      i -= 1;
    }
  }
  return out.filter(Boolean);
}

function measureKeyword(ctx, fontSpec, keyword) {
  ctx.font = fontSpec;
  ctx.textBaseline = "alphabetic";
  const m = ctx.measureText(keyword);
  const px = fontPx(fontSpec);
  const w = finite(m.width, px * Math.max(1, String(keyword).length));
  let ascent = m.actualBoundingBoxAscent;
  let descent = m.actualBoundingBoxDescent;
  if (!Number.isFinite(ascent) || ascent <= 0) ascent = 0.84 * px;
  if (!Number.isFinite(descent) || descent < 0) descent = 0.16 * px;
  return {
    w: Math.max(1, Math.round(w)),
    h: ascent + descent,
    ascent,
    descent,
    centerFromBaseline: (ascent - descent) / 2,
  };
}

function findKeyword(ctx, lines, keyword, lineH, startRelY, fontSpec) {
  ctx.font = fontSpec;
  for (let li = 0; li < lines.length; li++) {
    const idx = lines[li].indexOf(keyword);
    if (idx === -1) continue;
    const off = Math.round(ctx.measureText(lines[li].slice(0, idx)).width);
    const met = measureKeyword(ctx, fontSpec, keyword);
    return {
      kwLineIdx: li,
      kwOff: off,
      kwW: met.w,
      kwH: met.h,
      kwRelY: startRelY + li * lineH,
      met,
    };
  }
  const met = measureKeyword(ctx, fontSpec, keyword);
  return { kwLineIdx: 0, kwOff: 0, kwW: met.w, kwH: met.h, kwRelY: startRelY, met };
}

function pickFontEntry(locale, fontId, kind, r) {
  if (fontId === "custom") return { id: "custom", family: CUSTOM_FAMILY };
  if (fontId && fontId !== "random") return fontById(locale, fontId);
  return fontById(locale, pick(r, kind.fonts));
}

function splitCols(lines, nCols) {
  const per = Math.max(1, Math.ceil(lines.length / nCols));
  return { per, nCols };
}

function linePrefixWidth(ctx, spec, line, keyword) {
  ctx.font = spec;
  const idx = line.indexOf(keyword);
  if (idx <= 0) return 0;
  return Math.round(ctx.measureText(line.slice(0, idx)).width);
}

function createMeasureCtx() {
  if (typeof document !== "undefined" && document.createElement) {
    const c = document.createElement("canvas");
    const ctx = c.getContext && c.getContext("2d");
    if (ctx) return ctx;
  }
  return {
    font: "400 32px serif",
    textBaseline: "alphabetic",
    measureText(str) {
      const px = fontPx(this.font);
      let units = 0;
      for (const ch of String(str || "")) {
        units += ch.charCodeAt(0) > 255 ? 1.0 : 0.56;
      }
      return {
        width: units * px,
        actualBoundingBoxAscent: px * 0.84,
        actualBoundingBoxDescent: px * 0.16,
      };
    },
  };
}

function buildDescs(n, keyword, W, H, zoomLevel, copy, locale, fontId, extras) {
  const loc = normalizeLocale(locale);
  const isHant = loc === "hant";
  const mCtx = createMeasureCtx();
  const kToken = String(keyword || "").replace(/ /g, "\u00A0");
  const kinds = PAPER_KINDS[loc];
  const REF_SIZE = H * 0.06;
  const refFamily = fontById(loc, kinds[0].fonts[0]).family;
  mCtx.font = cssFont(700, REF_SIZE, refFamily, false);
  const refKwW = finite(mCtx.measureText(kToken).width, 0) || 1;
  const nCh = keywordUnits(keyword);
  const maxEm = nCh <= 1 ? 0.30 : nCh <= 2 ? 0.22 : nCh <= 3 ? 0.16 : 0.115;
  const minEm = nCh <= 3 ? 0.07 : 0.044;
  const hlSizeBase = Math.round(
    Math.max(H * minEm, Math.min(H * maxEm, REF_SIZE * (W * 0.50) / refKwW))
  );
  const zoomMax = Math.max(0.1, Number(zoomLevel) || 1.5);
  const joinBody = loc === "en" ? " " : "";
  const daysCjk = isHant
    ? ["週一", "週二", "週三", "週四", "週五", "週六", "週日"]
    : ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const romans = ["CLXXIV", "CLXXV", "CXCVIII", "LXXXII", "CXXXIV", "LXIX"];

  const extra = extras || {};
  const hlHex = extra.hlColor || "#ffe72e";
  const hlFill = hexToRgba(hlHex, 0.82);
  const hlStyle = extra.hlStyle === "box" ? "box" : "marker";
  const seedOffset = Number(extra.seedOffset) || 0;
  const seedW = Number(extra.seedW) || W;
  const kwHash = hashString(keyword);

  const pubs = Array.isArray(copy && copy.publications)
    ? copy.publications.filter(p => p && (loc === "en" || p.kind !== "weather"))
    : [];
  const safeSents = (copy && Array.isArray(copy.sentences) && copy.sentences.length)
    ? copy.sentences
    : (loc === "en"
      ? ["Global compute clusters expanded capacity across major industrial corridors this quarter."]
      : isHant
        ? ["多地科技園區持續推進算力基礎設施與智慧製造產線協同升級。"]
        : ["多地产业园区持续推进算力基础设施与智能制造产线协同升级。"]);
  const headKwPool = (copy && Array.isArray(copy.headlineWithKeyword) && copy.headlineWithKeyword.length)
    ? copy.headlineWithKeyword
    : (copy && Array.isArray(copy.headlines) && copy.headlines.length)
      ? copy.headlines
      : null;
  const safeHeadKw = headKwPool || [
    loc === "en"
      ? "New benchmark puts {K} at the center of industry plans"
      : isHant
        ? "年度產業觀察：{K}邁入規模化商用新階段"
        : "年度产业观察：{K}迈入规模化应用新阶段",
  ];
  const headNoKwPool = (copy && Array.isArray(copy.headlineNoKeyword) && copy.headlineNoKeyword.length)
    ? copy.headlineNoKeyword
    : (copy && Array.isArray(copy.headlinesNoKw) && copy.headlinesNoKw.length)
      ? copy.headlinesNoKw
      : null;
  const safeHeadNoKw = headNoKwPool || [
    loc === "en"
      ? "Regional supply chains accelerate next-generation tooling rollout"
      : isHant
        ? "核心零組件產能穩步釋放，上下游訂單排期延續至下季度"
        : "核心零部件产能稳步释放，上下游订单排期延续至下季度",
  ];
  const safeDecks = (copy && Array.isArray(copy.decks) && copy.decks.length)
    ? copy.decks
    : safeHeadNoKw;
  const safeBylines = (copy && Array.isArray(copy.bylines) && copy.bylines.length)
    ? copy.bylines
    : [loc === "en" ? "By Staff Correspondent" : isHant ? "本報記者 綜合報導" : "本报记者 综合报道"];

  return Array.from({ length: n }, (_, i) => {
    const seed = (i * 7919 + Math.imul(kwHash, 31) + seedW + Math.imul(seedOffset, 104729)) >>> 0;
    const r = prng(seed);

    let pub = null;
    let kind = null;
    if (pubs.length > 0) {
      pub = pick(r, pubs);
      kind = kindById(loc, pub.kind) || pick(r, kinds);
    } else {
      kind = pick(r, kinds);
    }

    const paperName = pub
      ? pub.name
      : ((copy && Array.isArray(copy.paperNames) && copy.paperNames.length)
        ? pick(r, copy.paperNames)
        : (loc === "en" ? "The Morning Dispatch" : isHant ? "工商觀察早報" : "商业观察早报"));
    const paperSub = pub && pub.sub ? pub.sub : "";
    const kicker = (pub && Array.isArray(pub.sectionKickers) && pub.sectionKickers.length)
      ? pick(r, pub.sectionKickers)
      : (kind.kicker || "");

    const entry = pickFontEntry(loc, fontId, kind, r);
    const italic = loc === "en" && (entry.id === "playfair" || entry.id === "roboto-italic" || entry.id === "roboto-blackitalic") && r() < 0.32;
    const hlWeight = entry.id === "roboto-light" ? 400 : 700;
    const colW = Math.round(W * rr(r, 0.92, 0.98));
    const colX = Math.round((W - colW) / 2);

    let layout = pick(r, kind.layouts);
    if (loc !== "en" && layout === "weather") layout = "columns";

    const fmt = pick(r, kind.fmts);
    const hlSize = (layout === "headline" || layout === "photo")
      ? Math.round(hlSizeBase * 0.56)
      : hlSizeBase;
    const bodySize = Math.round(hlSize * rr(r, nCh <= 3 ? 0.48 : 0.38, nCh <= 3 ? 0.58 : 0.44));
    const hlLineH = Math.round(hlSize * 1.22);
    const bodyLineH = Math.round(bodySize * 1.66);
    const hlSpec = cssFont(hlWeight, hlSize, entry.family, italic);
    const bodySpec = cssFont(400, bodySize, entry.family, false);
    const deckSize = Math.max(12, Math.round(hlSize * 0.31));
    const deckLineH = Math.round(deckSize * 1.52);
    const deckSpec = cssFont(400, deckSize, entry.family, loc === "en");
    const mastFamily = MAST_FAMILY[kind.mast] || entry.family;
    const mhSize = Math.max(12, Math.round(H * 0.0135));
    const bylineSpec = cssFont(400, Math.max(11, Math.round(mhSize * 0.94)), mastFamily, loc === "en");

    const bgFillW = W - Math.round(W * 0.04);
    mCtx.font = bodySpec;
    const bgPool = safeSents.length >= 16
      ? shuffle(r, safeSents).slice(0, 24)
      : shuffle(r, [...safeSents, ...safeSents, ...safeSents, ...safeSents]);
    const bgLines = wrap(mCtx, bgPool.join(joinBody), bgFillW, kToken, loc);

    const hasDeck = fmt === 0 || fmt === 1 || fmt === 5 || fmt === 7;
    const topInk = (layout === "headline" || layout === "photo")
      ? Math.round(hlSize * 1.08)
      : (layout === "classified" || layout === "sports" || layout === "weather" || layout === "wire")
        ? Math.round(hlLineH * 0.88)
        : Math.round(mhSize * 2.2);
    const kickerRelY = -topInk - Math.round(mhSize * 1.85);
    let kwX, kwW, kwH, kwRelY, met;
    let kwLineH = bodyLineH;
    let desc = {};

    const replaceKw = tpl => String(tpl || "").replace(/\{K\}/g, kToken);
    const customWithToken = () => String(pick(r, copy.customHl)).split(keyword).join(kToken);
    const headlineFromCustom = () => (copy && copy.customHl && copy.customHl.length)
      ? customWithToken()
      : replaceKw(pick(r, safeHeadKw));
    const pullquoteFromCopy = () => {
      let raw;
      if (copy && copy.customHl && copy.customHl.length) {
        raw = customWithToken();
      } else if (copy && Array.isArray(copy.pullquotesWithKeyword) && copy.pullquotesWithKeyword.length) {
        raw = replaceKw(pick(r, copy.pullquotesWithKeyword));
      } else if (copy && Array.isArray(copy.quotes) && copy.quotes.length) {
        raw = replaceKw(pick(r, copy.quotes));
      } else {
        raw = replaceKw(pick(r, safeHeadKw));
      }
      if (isHant) {
        let s = String(raw || "").trim();
        while (s.startsWith("「「") && s.endsWith("」」")) {
          s = s.slice(1, -1).trim();
        }
        if (s.startsWith("「") && s.endsWith("」")) return s;
        if (
          (s.startsWith("『") && s.endsWith("』")) ||
          (s.startsWith("“") && s.endsWith("”")) ||
          (s.startsWith('"') && s.endsWith('"')) ||
          (s.startsWith("'") && s.endsWith("'"))
        ) {
          s = s.slice(1, -1).trim();
        } else {
          s = s.replace(/^[「“"']+/, "").replace(/[」”"']+$/, "");
        }
        return `「${s}」`;
      }
      return raw;
    };
    const plantKeyword = sents => {
      const idx = ri(r, 0, Math.min(4, Math.max(0, sents.length - 1)));
      sents[idx] = (copy && copy.customHl && copy.customHl.length)
        ? customWithToken()
        : injectKeyword(sents[idx], kToken, r, loc);
    };

    if (layout === "headline") {
      const headline = headlineFromCustom();
      mCtx.font = hlSpec;
      const hlLines = wrap(mCtx, headline, colW, kToken, loc);
      const found = findKeyword(mCtx, hlLines, kToken, hlLineH, 0, hlSpec);
      kwX = colX + found.kwOff;
      kwRelY = found.kwRelY;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      kwLineH = hlLineH;
      const headEnd = hlLines.length * hlLineH;
      let deckLines = [], deckRelY = 0;
      if (hasDeck) {
        mCtx.font = deckSpec;
        deckLines = wrap(mCtx, pick(r, safeDecks), colW, kToken, loc);
        deckRelY = headEnd + Math.round(hlSize * 0.34);
      }
      const afterHead = hasDeck ? deckRelY + deckLines.length * deckLineH : headEnd;
      const bylineRelY = afterHead + Math.round(hlSize * (hasDeck ? 0.28 : 0.40));
      const ruleRelY = bylineRelY + Math.round(mhSize * 2.3);
      const nCols = r() < 0.35 ? 3 : 2;
      const gap = Math.round(colW * 0.03);
      const inner = Math.round((colW - gap * (nCols - 1)) / nCols);
      const bodyRelY = ruleRelY + Math.round(bodySize * 1.4);
      mCtx.font = bodySpec;
      const bodyLines = wrap(mCtx, shuffle(r, safeSents).slice(0, 12).join(joinBody), inner, kToken, loc);
      const { per } = splitCols(bodyLines, nCols);
      desc = {
        layout, headline, hlLines, hlSpec, hlSize, hlLineH,
        deckLines, deckRelY, deckSize, deckLineH, deckSpec, hasDeck,
        bylineRelY, ruleRelY, bodyRelY, bodyLines, nCols, colGap: gap, innerW: inner, colPer: per,
        kicker, kickerRelY, contentBottomRelY: bodyRelY + per * bodyLineH,
      };
    } else if (layout === "columns") {
      const subHlSize = Math.round(hlSize * 0.56);
      const subHlLineH = Math.round(subHlSize * 1.22);
      const subHlSpec = cssFont(hlWeight, subHlSize, entry.family, italic);
      const headline = pick(r, safeHeadNoKw);
      mCtx.font = subHlSpec;
      const hlLines = wrap(mCtx, headline, colW, kToken, loc);
      const headEnd = hlLines.length * subHlLineH;
      const bylineRelY = headEnd + Math.round(subHlSize * 0.3);
      const ruleRelY = bylineRelY + Math.round(mhSize * 2.1);
      const nCols = (kind.id === "wsj" || r() < 0.45) ? 3 : 2;
      const gap = Math.round(colW * 0.028);
      const inner = Math.round((colW - gap * (nCols - 1)) / nCols);
      const bodyRelY = ruleRelY + Math.round(bodySize * 1.35);
      const sents = shuffle(r, safeSents).slice(0, 14);
      while (sents.length < 6) sents.push(safeSents[0]);
      plantKeyword(sents);
      mCtx.font = bodySpec;
      const bodyLines = wrap(mCtx, sents.join(joinBody), inner, kToken, loc);
      const { per } = splitCols(bodyLines, nCols);
      const found = findKeyword(mCtx, bodyLines, kToken, bodyLineH, 0, bodySpec);
      const colIndex = Math.min(nCols - 1, Math.floor(found.kwLineIdx / per));
      const lineInCol = found.kwLineIdx - colIndex * per;
      kwX = colX + colIndex * (inner + gap) + found.kwOff;
      kwRelY = bodyRelY + lineInCol * bodyLineH;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      desc = {
        layout, headline, hlLines, hlSpec: subHlSpec, hlSize: subHlSize, hlLineH: subHlLineH,
        hasDeck: false, deckLines: [], bylineRelY, ruleRelY,
        bodyRelY, bodyLines, nCols, colGap: gap, innerW: inner, colPer: per,
        kicker, kickerRelY, contentBottomRelY: bodyRelY + per * bodyLineH,
      };
    } else if (layout === "pullquote") {
      const subHlSize = Math.round(hlSize * 0.50);
      const subHlLineH = Math.round(subHlSize * 1.22);
      const subHlSpec = cssFont(hlWeight, subHlSize, entry.family, false);
      const headline = pick(r, safeHeadNoKw);
      mCtx.font = subHlSpec;
      const hlLines = wrap(mCtx, headline, colW, kToken, loc);
      const bylineRelY = hlLines.length * subHlLineH + Math.round(subHlSize * 0.28);
      const ruleRelY = bylineRelY + Math.round(mhSize * 2.0);

      const pqTopRuleRelY = ruleRelY + Math.round(bodySize * 0.95);
      const pqInset = Math.round(colW * 0.065);
      const pqW = colW - pqInset * 2;
      const pqSize = Math.round(hlSize * 0.62);
      const pqLineH = Math.round(pqSize * 1.34);
      const pqSpec = cssFont(700, pqSize, entry.family, loc === "en" && entry.id !== "oswald");
      const pqText = pullquoteFromCopy();
      mCtx.font = pqSpec;
      const pqLines = wrap(mCtx, pqText, pqW, kToken, loc);
      const pqRelY = pqTopRuleRelY + Math.round(pqSize * 1.25);
      const found = findKeyword(mCtx, pqLines, kToken, pqLineH, pqRelY, pqSpec);
      kwX = colX + pqInset + found.kwOff;
      kwRelY = found.kwRelY;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      kwLineH = pqLineH;

      const pqBotRuleRelY = pqRelY + Math.max(0, pqLines.length - 1) * pqLineH + Math.round(pqSize * 0.68);
      const nCols = 2;
      const gap = Math.round(colW * 0.03);
      const inner = Math.round((colW - gap) / nCols);
      const bodyRelY = pqBotRuleRelY + Math.round(bodySize * 1.45);
      mCtx.font = bodySpec;
      const bodyLines = wrap(mCtx, shuffle(r, safeSents).slice(0, 10).join(joinBody), inner, kToken, loc);
      const { per } = splitCols(bodyLines, nCols);
      desc = {
        layout, headline, hlLines, hlSpec: subHlSpec, hlSize: subHlSize, hlLineH: subHlLineH,
        bylineRelY, ruleRelY,
        pqText, pqLines, pqSpec, pqSize, pqLineH, pqInset, pqW, pqRelY, pqTopRuleRelY, pqBotRuleRelY,
        bodyRelY, bodyLines, nCols, colGap: gap, innerW: inner, colPer: per,
        kicker, kickerRelY, contentBottomRelY: bodyRelY + per * bodyLineH,
      };
    } else if (layout === "wire") {
      const briefsPool = (copy && Array.isArray(copy.briefs) && copy.briefs.length)
        ? shuffle(r, copy.briefs).slice(0, 7)
        : shuffle(r, safeSents).slice(0, 7);
      while (briefsPool.length < 5) briefsPool.push(safeSents[0]);
      const hitItem = ri(r, 1, Math.min(3, briefsPool.length - 1));
      briefsPool[hitItem] = (copy && copy.customHl && copy.customHl.length)
        ? String(pick(r, copy.customHl)).split(keyword).join(kToken)
        : injectKeyword(briefsPool[hitItem], kToken, r, loc);

      const wireGutter = Math.round(colW * 0.16);
      const wireTextW = colW - wireGutter;
      mCtx.font = bodySpec;
      const wireRows = [];
      let curRelY = Math.round(bodyLineH * 0.6);
      let baseMin = ri(r, 8, 16) * 60 + ri(r, 5, 50);
      briefsPool.forEach((item, idx) => {
        const hh = String(Math.floor(baseMin / 60) % 24).padStart(2, "0");
        const mm = String(baseMin % 60).padStart(2, "0");
        baseMin += ri(r, 6, 23);
        const tag = kind.id === "digest"
          ? (loc === "en" ? `ITEM 0${idx + 1}` : isHant ? `精選 0${idx + 1}` : `精编 0${idx + 1}`)
          : `${hh}:${mm}`;
        const wrapped = wrap(mCtx, item, wireTextW, kToken, loc);
        wrapped.forEach((ln, li) => {
          wireRows.push({
            text: ln,
            tag: li === 0 ? tag : "",
            dividerAbove: li === 0 && idx > 0,
            relY: curRelY,
          });
          curRelY += bodyLineH;
        });
        curRelY += Math.round(bodyLineH * 0.34);
      });
      const hitRow = wireRows.find(row => row.text.includes(kToken)) || wireRows[0];
      const metFound = measureKeyword(mCtx, bodySpec, kToken);
      kwX = colX + wireGutter + linePrefixWidth(mCtx, bodySpec, hitRow.text, kToken);
      kwRelY = hitRow.relY;
      kwW = metFound.w;
      kwH = metFound.h;
      met = metFound;
      kwLineH = bodyLineH;
      desc = {
        layout: "wire", wireRows, wireGutter, wireTextW,
        kicker, kickerRelY, contentBottomRelY: curRelY,
      };
    } else if (layout === "photo") {
      const headline = headlineFromCustom();
      mCtx.font = hlSpec;
      const hlLines = wrap(mCtx, headline, colW, kToken, loc);
      const found = findKeyword(mCtx, hlLines, kToken, hlLineH, 0, hlSpec);
      kwX = colX + found.kwOff;
      kwRelY = found.kwRelY;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      kwLineH = hlLineH;
      const photoRelY = hlLines.length * hlLineH + Math.round(hlSize * 0.36);
      const photoH = Math.round(hlSize * 3.3);
      const capRelY = photoRelY + photoH + Math.round(bodySize * 1.18);
      const cap = (copy && copy.captions && copy.captions.length) ? pick(r, copy.captions) : pick(r, safeDecks);
      mCtx.font = deckSpec;
      const capLines = wrap(mCtx, cap, colW, kToken, loc);
      const nCols = 2;
      const gap = Math.round(colW * 0.03);
      const inner = Math.round((colW - gap) / nCols);
      const bodyRelY = capRelY + capLines.length * deckLineH + Math.round(bodySize * 0.85);
      mCtx.font = bodySpec;
      const bodyLines = wrap(mCtx, shuffle(r, safeSents).slice(0, 8).join(joinBody), inner, kToken, loc);
      const { per } = splitCols(bodyLines, nCols);
      desc = {
        layout, headline, hlLines, hlSpec, hlSize, hlLineH,
        photoRelY, photoH, photoSeed: Math.floor(r() * 1e9),
        capLines, capRelY, deckLineH, deckSpec,
        bodyRelY, bodyLines, nCols, colGap: gap, innerW: inner, colPer: per,
        kicker, kickerRelY, contentBottomRelY: bodyRelY + per * bodyLineH,
      };
    } else if (layout === "classified") {
      const ads = ((copy && copy.classifieds && copy.classifieds.length) ? copy.classifieds : safeSents).slice();
      const kwLine = loc === "en"
        ? `OPEN ROLE · ${kToken} Lead Engineer · Full-time hybrid, competitive equity`
        : isHant
          ? `誠徵 ${kToken} 資深研發與產品主管 · 核心業務直招`
          : `诚聘 ${kToken} 高级研发与产品岗位 · 核心业务线直招 待遇从优`;
      ads.splice(ri(r, 1, Math.min(5, ads.length)), 0, kwLine);
      const inner = colW;
      mCtx.font = bodySpec;
      const bodyLines = [];
      ads.slice(0, 16).forEach(ad => {
        wrap(mCtx, ad, inner, kToken, loc).forEach(ln => bodyLines.push(ln));
      });
      const found = findKeyword(mCtx, bodyLines, kToken, bodyLineH, 0, bodySpec);
      kwX = colX + found.kwOff;
      kwRelY = found.kwRelY;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      desc = {
        layout, bodyLines, bodyRelY: 0, nCols: 1, innerW: inner, colPer: bodyLines.length,
        kicker, kickerRelY, contentBottomRelY: bodyLines.length * bodyLineH,
      };
    } else if (layout === "table") {
      const heads = loc === "en"
        ? ["INDEX / EQUITY", "LAST", "CHG"]
        : isHant
          ? ["指數 / 標的", "最新價", "漲跌幅"]
          : ["指数 / 标的", "最新价", "涨跌幅"];
      const tickers = (copy && copy.tickers && copy.tickers.length ? shuffle(r, copy.tickers) : []).slice();
      while (tickers.length < 9) tickers.push(["TECH IDX", "1842.50", "+1.42%"]);
      const rows = tickers.slice(0, 9).map(row => row.slice());
      const kwRow = ri(r, 1, rows.length - 2);
      rows[kwRow][0] = kToken;
      const rowH = Math.round(bodyLineH * 1.18);
      const tableRelY = Math.round(hlSize * 0.2);
      const cellPadX = Math.max(8, Math.round(colW * 0.022));
      kwX = colX + cellPadX;
      const found = measureKeyword(mCtx, bodySpec, kToken);
      kwW = found.w;
      kwH = found.h;
      met = found;
      kwRelY = tableRelY + (kwRow + 1) * rowH;
      kwLineH = rowH;
      desc = {
        layout, tableHeads: heads, tableRows: rows, tableRelY, rowH, cellPadX,
        kicker, kickerRelY, contentBottomRelY: tableRelY + (rows.length + 1) * rowH,
      };
    } else if (layout === "sports") {
      const games = ((copy && copy.sports && copy.sports.length) ? shuffle(r, copy.sports) : safeSents).slice(0, 8);
      const kwGame = loc === "en"
        ? `${kToken} Cup  3 - 1  FULL TIME`
        : isHant
          ? `${kToken}盃焦點戰  3 - 1  全場戰報`
          : `${kToken}杯焦点战  3 - 1  全场战报`;
      games.splice(ri(r, 1, Math.min(3, games.length)), 0, kwGame);
      const innerPad = Math.round(colW * 0.06);
      mCtx.font = hlSpec;
      const longest = games.reduce((w, g) => Math.max(w, mCtx.measureText(g).width), 1);
      const fit = Math.min(1, (colW - innerPad * 2) / longest);
      const scoreSize = Math.max(bodySize, Math.round(hlSize * 0.68 * fit));
      const scoreSpec = cssFont(hlWeight, scoreSize, entry.family, false);
      const boxH = Math.round(scoreSize * 1.56);
      const found = measureKeyword(mCtx, scoreSpec, kToken);
      kwW = found.w;
      kwH = found.h;
      met = found;
      const hit = games.findIndex(g => g.includes(kToken));
      const gLine = games[Math.max(0, hit)] || kwGame;
      kwX = colX + innerPad + linePrefixWidth(mCtx, scoreSpec, gLine, kToken);
      kwRelY = (Math.max(0, hit) + 0.7) * boxH;
      kwLineH = boxH;
      desc = {
        layout, games, boxH, hlSpec: scoreSpec, scorePad: innerPad,
        kicker, kickerRelY, contentBottomRelY: games.length * boxH,
      };
    } else if (layout === "weather" && loc === "en") {
      const rows = ((copy && copy.weather && copy.weather.length) ? shuffle(r, copy.weather) : []).slice(0, 8);
      const kwRow = `Advisory · ${kToken} Corridor  58 / 72 F  Clear`;
      rows.splice(ri(r, 1, Math.min(4, rows.length || 1)), 0, kwRow);
      const rowH = Math.round(bodyLineH * 1.26);
      const weatherPad = Math.max(6, Math.round(colW * 0.018));
      const found = measureKeyword(mCtx, bodySpec, kToken);
      kwW = found.w;
      kwH = found.h;
      met = found;
      const hit = Math.max(0, rows.findIndex(g => g.includes(kToken)));
      kwX = colX + weatherPad + linePrefixWidth(mCtx, bodySpec, rows[hit] || kwRow, kToken);
      kwRelY = (hit + 0.74) * rowH;
      kwLineH = rowH;
      desc = {
        layout: "weather", weatherRows: rows, rowH, weatherPad,
        kicker, kickerRelY, contentBottomRelY: rows.length * rowH,
      };
    } else {
      const subHlSize = Math.round(hlSize * 0.56);
      const subHlLineH = Math.round(subHlSize * 1.22);
      const subHlSpec = cssFont(hlWeight, subHlSize, entry.family, italic);
      const headline = pick(r, safeHeadNoKw);
      mCtx.font = subHlSpec;
      const hlLines = wrap(mCtx, headline, colW, kToken, loc);
      const bylineRelY = hlLines.length * subHlLineH + Math.round(subHlSize * 0.3);
      const ruleRelY = bylineRelY + Math.round(mhSize * 2.2);
      const bodyRelY = ruleRelY + Math.round(bodySize * 1.55);
      const sents = shuffle(r, safeSents).slice(0, 10);
      while (sents.length < 5) sents.push(safeSents[0]);
      plantKeyword(sents);
      mCtx.font = bodySpec;
      const bodyLines = wrap(mCtx, sents.join(joinBody), colW, kToken, loc);
      const found = findKeyword(mCtx, bodyLines, kToken, bodyLineH, bodyRelY, bodySpec);
      kwX = colX + found.kwOff;
      kwRelY = found.kwRelY;
      kwW = found.kwW;
      kwH = found.kwH;
      met = found.met;
      desc = {
        layout: "body", headline, hlLines, hlSpec: subHlSpec, hlSize: subHlSize, hlLineH: subHlLineH,
        hasDeck: false, deckLines: [], bylineRelY, ruleRelY,
        bodyRelY, bodyLines, nCols: 1, innerW: colW, colPer: bodyLines.length,
        kicker, kickerRelY, contentBottomRelY: bodyRelY + bodyLines.length * bodyLineH,
      };
    }

    kwX = finite(kwX, W / 2);
    kwW = Math.max(1, finite(kwW, fontPx(bodySpec)));
    kwH = Math.max(1, finite(kwH, fontPx(hlSpec)));
    const centerFromBaseline = met ? finite(met.centerFromBaseline, kwH * 0.35) : kwH * 0.35;
    const offsetY = Math.round(H + centerFromBaseline - finite(kwRelY, 0));
    const xShift = Math.round(W - (finite(kwX, W / 2) + kwW / 2));
    const ZOOM_TARGET = nCh <= 1 ? 0.40 : nCh <= 2 ? 0.50 : nCh <= 3 ? 0.60 : 0.75;
    const zoomCap = nCh <= 3 ? 1.12 : 1.85;
    const zoomScale = Math.min(
      zoomCap,
      Math.max(0.55, (W * ZOOM_TARGET / kwW) * (zoomMax / 4))
    );
    const focalR = Math.max(
      24,
      Math.max(kwW, kwH) * (nCh <= 3 ? 2.6 : 1.8),
      ((nCh <= 3 ? 0.22 : 0.16) * Math.min(W, H)) / zoomScale
    );
    const hPad = 4;
    const vUp = Math.min(
      Math.round((met ? met.ascent : kwH * 0.82) + 2),
      Math.max(8, Math.round(kwLineH * 0.78))
    );
    const vDn = Math.min(
      Math.round((met ? met.descent : kwH * 0.18) + 2),
      Math.max(3, Math.round(kwLineH * 0.18))
    );
    const hlRect = {
      x: kwX - hPad,
      y: H + Math.round(centerFromBaseline) - vUp,
      w: kwW + hPad * 2,
      h: vUp + vDn,
    };

    const yr = r() < 0.78 ? 2026 : 2025;
    const mo = ri(r, 1, 12);
    const dy = ri(r, 1, 28);
    const dateline = loc === "en"
      ? `${monthsEn[mo - 1]} ${dy}, ${yr} · Vol. ${pick(r, romans)} No. ${ri(r, 41200, 62900)}`
      : isHant
        ? `${yr}年${mo}月${dy}日 ${pick(r, daysCjk)} · 總第 ${ri(r, 3400, 6890)} 期`
        : `${yr}年${mo}月${dy}日 ${pick(r, daysCjk)} · 总第 ${ri(r, 3400, 6890)} 期`;
    const folio = loc === "en"
      ? `Section ${pick(r, ["A", "B", "C", "M"])}${ri(r, 1, 16)} · Late Edition`
      : `第 ${pick(r, ["A", "B", "C"])}${ri(r, 1, 16)} 版 · 今日 ${pick(r, [16, 24, 32])} 版`;

    return {
      ...desc,
      locale: loc, kindId: kind.id, nCh, colW, colX, bodySpec, bodySize, bodyLineH, bgLines,
      mhSize, mastFamily, bylineSpec, offsetY, xShift, zoomScale, hlRect, hlBoxH: hlRect.h,
      hlSize: desc.hlSize || hlSize, kwX, kwW, kwH,
      focalCx: W, focalCy: H, focalR, fmt,
      paperName, paperSub, dateline, folio,
      byline: pick(r, safeBylines),
      paperHue: rr(r, kind.hue[0], kind.hue[1]),
      paperSat: rr(r, kind.sat[0], kind.sat[1]),
      paperLight: rr(r, kind.light[0], kind.light[1]),
      grainSeed: Math.floor(r() * 1e9),
      hlHex, hlFill, hlStyle,
    };
  });
}

function drawHighlight(ctx, d) {
  const r = d.hlRect;
  if (!r) return;
  const hex = d.hlHex || "#ffe72e";
  if (d.hlStyle === "box") {
    ctx.fillStyle = hexToRgba(hex, 0.82);
    ctx.fillRect(r.x, r.y, r.w, r.h);
    return;
  }
  const slant = Math.max(2, Math.round(r.h * 0.10));
  const x0 = r.x - 2;
  const x1 = r.x + r.w + 3;
  const y0 = r.y;
  const y1 = r.y + r.h;

  ctx.save();
  ctx.fillStyle = hexToRgba(hex, 0.68);
  ctx.beginPath();
  ctx.moveTo(x0 + slant, y0 + 1);
  ctx.quadraticCurveTo((x0 + x1) * 0.5, y0 - 0.8, x1 + slant, y0 + 0.6);
  ctx.lineTo(x1 - slant, y1 - 0.5);
  ctx.quadraticCurveTo((x0 + x1) * 0.5, y1 + 1.0, x0 - slant, y1 + 0.4);
  ctx.closePath();
  ctx.fill();

  const iy0 = y0 + r.h * 0.13;
  const iy1 = y0 + r.h * 0.89;
  ctx.fillStyle = hexToRgba(hex, 0.36);
  ctx.beginPath();
  ctx.moveTo(x0 + slant * 0.8 + 1, iy0);
  ctx.lineTo(x1 + slant * 0.7 - 1, iy0 + 0.4);
  ctx.lineTo(x1 - slant * 0.8 - 1, iy1);
  ctx.lineTo(x0 - slant * 0.7 + 1, iy1 - 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = hexToRgba(hex, 0.22);
  ctx.fillRect(x0, y1 - 2.2, x1 - x0 - slant * 0.5, 2);
  ctx.restore();
}

function drawHalftonePhoto(ctx, x, py, w, h, seed, locale, mast, bodySize) {
  const r = prng(seed || 12345);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, py, w, h);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, py, x + w * 0.35, py + h);
  bg.addColorStop(0, "#d8d2c5");
  bg.addColorStop(0.55, "#b9b2a3");
  bg.addColorStop(1, "#8d8679");
  ctx.fillStyle = bg;
  ctx.fillRect(x, py, w, h);

  const horizonY = py + h * rr(r, 0.54, 0.68);
  ctx.fillStyle = "rgba(38,35,31,0.22)";
  ctx.fillRect(x, horizonY, w, py + h - horizonY);

  const nBlocks = ri(r, 5, 9);
  for (let i = 0; i < nBlocks; i++) {
    const bw = w * rr(r, 0.08, 0.20);
    const bh = h * rr(r, 0.22, 0.66);
    const bx = x + (i / nBlocks) * w * 0.92 + rr(r, -8, 12);
    const by = horizonY - bh * 0.78;
    ctx.fillStyle = `rgba(30,28,24,${rr(r, 0.16, 0.42).toFixed(2)})`;
    ctx.fillRect(bx, by, bw, bh);
  }

  const sunX = x + w * rr(r, 0.24, 0.76);
  const sunY = py + h * rr(r, 0.24, 0.44);
  const glow = ctx.createRadialGradient(sunX, sunY, h * 0.03, sunX, sunY, h * 0.48);
  glow.addColorStop(0, "rgba(250,246,236,0.58)");
  glow.addColorStop(1, "rgba(30,28,24,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x, py, w, h);

  const step = Math.max(5, Math.round(Math.min(w, h) * 0.032));
  ctx.fillStyle = "rgba(24,22,19,0.28)";
  for (let gy = py + step * 0.5; gy < py + h; gy += step) {
    const vNorm = (gy - py) / Math.max(1, h);
    const rowShift = ((Math.round((gy - py) / step) & 1) * step) * 0.5;
    for (let gx = x + rowShift; gx < x + w; gx += step) {
      const dx = (gx - sunX) / Math.max(1, w);
      const dy = (gy - sunY) / Math.max(1, h);
      const dist = Math.hypot(dx, dy);
      const darkness = Math.min(0.88, Math.max(0.12, 0.22 + vNorm * 0.36 + dist * 0.35));
      const rad = step * 0.42 * darkness;
      ctx.beginPath();
      ctx.arc(gx, gy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.strokeStyle = "#2b2823";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, py + 0.5, w - 1, h - 1);

  const credit = locale === "en"
    ? "STAFF PHOTOGRAPH · ARCHIVE WIRE"
    : locale === "hant"
      ? "本報視覺中心 · 現場攝影"
      : "本报视觉中心 · 现场摄影";
  const cSize = Math.max(10, Math.round(bodySize * 0.68));
  ctx.font = `400 ${cSize}px ${mast}`;
  const cw = ctx.measureText(credit).width;
  ctx.fillStyle = "rgba(20,18,16,0.68)";
  ctx.fillRect(x + w - cw - 14, py + h - cSize - 10, cw + 10, cSize + 6);
  ctx.fillStyle = "#f4efe6";
  ctx.fillText(credit, x + w - cw - 9, py + h - 8);
  ctx.restore();
}

function drawMasthead(ctx, d, W, y, mhRelY, dlRelY, topRuleRelY, kickerY) {
  const { colX, colW, mhSize, fmt, xShift } = d;
  const mast = d.mastFamily || (d.locale === "hant" ? '"Noto Sans TC", sans-serif' : '"Noto Sans SC", sans-serif');
  const centerX = W / 2 - xShift;
  const metaLine = d.folio ? `${d.dateline}   ·   ${d.folio}` : d.dateline;

  if (fmt === 1) {
    // Economist / Caixin red top-accent bar + crisp left nameplate
    ctx.fillStyle = "#c41e24";
    ctx.fillRect(colX, y(mhRelY - mhSize * 2.1), colW, Math.max(4, Math.round(mhSize * 0.36)));
    const badgeSize = Math.round(mhSize * 1.28);
    ctx.font = `700 ${badgeSize}px ${mast}`;
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillStyle = "#c41e24";
    ctx.fillRect(colX, y(mhRelY) - badgeSize * 0.92, nw + 18, badgeSize * 1.24);
    ctx.fillStyle = "#fbf8f1";
    ctx.fillText(d.paperName, colX + 9, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#5a554c";
    const mw = ctx.measureText(metaLine).width;
    ctx.fillText(metaLine, colX + colW - mw, y(mhRelY));
    ctx.strokeStyle = "#1a1816";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else if (fmt === 2) {
    // Guardian / Paper deep-navy header band
    const bandH = Math.round(mhSize * 2.6);
    const bandTop = y(mhRelY) - Math.round(mhSize * 1.65);
    ctx.fillStyle = "#0d2542";
    ctx.fillRect(colX, bandTop, colW, bandH);
    ctx.fillStyle = "#e0b84c";
    ctx.fillRect(colX, bandTop + bandH - 3, colW, 3);
    const nameSize = Math.round(mhSize * 1.42);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#f6f2e9";
    ctx.fillText(d.paperName, colX + 12, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.78)}px ${mast}`;
    ctx.fillStyle = "#5c564d";
    ctx.fillText(metaLine, colX, y(topRuleRelY - 4));
    ctx.strokeStyle = "#1a1816";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else if (fmt === 3) {
    // Bold metro / tabloid banner
    const nameSize = Math.round(mhSize * 1.62);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#141210";
    ctx.fillText(d.paperName, colX, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#5a544b";
    ctx.fillText(metaLine, colX, y(dlRelY));
    ctx.fillStyle = "#b51d24";
    ctx.fillRect(colX, y(topRuleRelY) - 2, colW, 4);
  } else if (fmt === 4) {
    // Boxed inverse nameplate centered + ear rules
    const nameSize = Math.round(mhSize * 1.24);
    ctx.font = `700 ${nameSize}px ${mast}`;
    const nw = ctx.measureText(d.paperName).width;
    const pad = 14;
    ctx.fillStyle = "#161412";
    ctx.fillRect(Math.round(centerX - nw / 2) - pad, y(mhRelY) - Math.round(nameSize * 0.94), nw + pad * 2, Math.round(nameSize * 1.28));
    ctx.fillStyle = "#f5f0e6";
    ctx.fillText(d.paperName, Math.round(centerX - nw / 2), y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.78)}px ${mast}`;
    ctx.fillStyle = "#5e584e";
    const mw = ctx.measureText(metaLine).width;
    ctx.fillText(metaLine, Math.round(centerX - mw / 2), y(dlRelY));
    ctx.strokeStyle = "#1a1816";
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else if (fmt === 5) {
    // Financial Times / CBN classic serif masthead + double market rule
    const nameSize = Math.round(mhSize * 1.56);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#181512";
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillText(d.paperName, Math.round(centerX - nw / 2), y(mhRelY));
    if (d.paperSub) {
      ctx.font = `400 ${Math.round(mhSize * 0.72)}px ${mast}`;
      ctx.fillStyle = "#6e5d53";
      const sw = ctx.measureText(d.paperSub).width;
      ctx.fillText(d.paperSub, Math.round(centerX - sw / 2), y(mhRelY - nameSize * 0.98));
    }
    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#544840";
    const mw = ctx.measureText(metaLine).width;
    ctx.fillText(metaLine, Math.round(centerX - mw / 2), y(dlRelY));
    ctx.strokeStyle = "#2b221e";
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY + 4)); ctx.lineTo(colX + colW, y(topRuleRelY + 4)); ctx.stroke();
  } else if (fmt === 6) {
    // Modern tech / wire dispatch header with left vertical bar
    ctx.fillStyle = "#161412";
    ctx.fillRect(colX, y(mhRelY - mhSize * 1.4), 6, Math.round(mhSize * 3.1));
    const nameSize = Math.round(mhSize * 1.44);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#141210";
    ctx.fillText(d.paperName, colX + 14, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.78)}px ${mast}`;
    ctx.fillStyle = "#5c564d";
    ctx.fillText(metaLine, colX + 14, y(dlRelY));
    ctx.strokeStyle = "#161412";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else if (fmt === 7) {
    // Science / Literary journal rule header
    ctx.strokeStyle = "#161412";
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(colX, y(mhRelY - mhSize * 1.65)); ctx.lineTo(colX + colW, y(mhRelY - mhSize * 1.65)); ctx.stroke();
    const nameSize = Math.round(mhSize * 1.38);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#161412";
    ctx.fillText(d.paperName, colX, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.78)}px ${mast}`;
    ctx.fillStyle = "#5f5950";
    const mw = ctx.measureText(d.dateline).width;
    ctx.fillText(d.dateline, colX + colW - mw, y(mhRelY));
    if (d.paperSub) {
      ctx.fillText(d.paperSub, colX, y(dlRelY));
    }
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else {
    // Classic broadsheet (NYT / WaPo / Beijing News) with ear boxes & double rule
    const nameSize = Math.round(mhSize * 1.52);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#12100e";
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillText(d.paperName, Math.round(centerX - nw / 2), y(mhRelY));

    const earW = Math.round(colW * 0.16);
    const earH = Math.round(mhSize * 1.65);
    if (nw + earW * 2.4 < colW) {
      ctx.strokeStyle = "#9e9688";
      ctx.lineWidth = 0.7;
      ctx.strokeRect(colX, y(mhRelY) - Math.round(earH * 0.82), earW, earH);
      ctx.strokeRect(colX + colW - earW, y(mhRelY) - Math.round(earH * 0.82), earW, earH);
      ctx.font = `400 ${Math.max(9, Math.round(mhSize * 0.64))}px ${mast}`;
      ctx.fillStyle = "#665f55";
      const earLeft = d.locale === "en" ? "LATE EDITION" : d.locale === "hant" ? "早報頭版" : "今日早刊";
      const earRight = d.folio
        ? d.folio.split("·")[0].trim()
        : (d.locale === "en" ? "FINAL" : d.locale === "hant" ? "重點導讀" : "重点导读");
      ctx.fillText(earLeft, colX + 6, y(mhRelY - earH * 0.15));
      ctx.fillText(earRight, colX + colW - earW + 6, y(mhRelY - earH * 0.15));
    }

    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#59534a";
    const mw = ctx.measureText(metaLine).width;
    ctx.fillText(metaLine, Math.round(centerX - mw / 2), y(dlRelY));

    ctx.strokeStyle = "#181614";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY + 5)); ctx.lineTo(colX + colW, y(topRuleRelY + 5)); ctx.stroke();
  }

  if (d.kicker) {
    const kSize = Math.round(mhSize * 0.92);
    ctx.font = `700 ${kSize}px ${mast}`;
    if (fmt === 3 || fmt === 1) {
      const kw = ctx.measureText(d.kicker).width;
      ctx.fillStyle = "#b51d24";
      ctx.fillRect(colX, y(kickerY) - Math.round(kSize * 0.86), kw + 10, Math.round(kSize * 1.12));
      ctx.fillStyle = "#fbf8f1";
      ctx.fillText(d.kicker, colX + 5, y(kickerY));
    } else {
      ctx.fillStyle = fmt === 2 ? "#0d2542" : "#8f1d1d";
      ctx.fillText(d.kicker, colX, y(kickerY));
    }
  }
}

function drawColumns(ctx, d, colX, y) {
  const n = d.nCols || 1;
  const inner = d.innerW || d.colW;
  const gap = d.colGap || 0;
  const per = d.colPer || (d.bodyLines || []).length;
  const lines = d.bodyLines || [];
  ctx.font = d.bodySpec;
  ctx.fillStyle = "#1c1a17";
  const clipSlack = n > 1 ? Math.max(2, Math.floor(gap * 0.42)) : Math.round((d.bodySize || 16) * 0.55);
  for (let c = 0; c < n; c++) {
    const x = colX + c * (inner + gap);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y(d.bodyRelY) - d.bodyLineH, inner + clipSlack, per * d.bodyLineH + d.bodyLineH * 1.2);
    ctx.clip();
    lines.slice(c * per, (c + 1) * per).forEach((ln, i) => {
      ctx.fillText(ln, x, y(d.bodyRelY + i * d.bodyLineH));
    });
    ctx.restore();
    if (c > 0) {
      ctx.strokeStyle = "#c6bfb2";
      ctx.lineWidth = 0.65;
      const rx = x - gap / 2;
      ctx.beginPath();
      ctx.moveTo(rx, y(d.bodyRelY - d.bodyLineH * 0.35));
      ctx.lineTo(rx, y(d.contentBottomRelY || d.bodyRelY));
      ctx.stroke();
    }
  }
}

let grainTiles = null;
function getGrainTile(seed) {
  if (typeof document === "undefined") return null;
  if (!grainTiles) {
    grainTiles = [0, 1, 2, 3].map(idx => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const gCtx = c.getContext("2d");
      const gr = prng(0x9e3779b9 ^ (idx * 7919));
      for (let i = 0; i < 420; i++) {
        gCtx.fillStyle = `rgba(24,20,14,${(0.012 + gr() * 0.038).toFixed(3)})`;
        gCtx.fillRect(gr() * 256 | 0, gr() * 256 | 0, 1, 1);
      }
      return c;
    });
  }
  return grainTiles[(seed >>> 0) & 3];
}

function renderCut(ctx, d, W, H, viewOpts) {
  const { offsetY, xShift, colX, colW, mhSize } = d;
  const hasView = Boolean(viewOpts && viewOpts.outW > 0 && viewOpts.outH > 0);
  const outW = hasView ? viewOpts.outW : W;
  const outH = hasView ? viewOpts.outH : H;
  const zoom = hasView ? Math.max(0.1, Number(viewOpts.zoom) || 1) : 1;
  const y = rel => Math.round(rel + offsetY);

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `hsl(${d.paperHue},${d.paperSat}%,${d.paperLight}%)`;
  ctx.fillRect(0, 0, outW, outH);

  const gTile = getGrainTile(d.grainSeed);
  if (gTile) {
    const pat = ctx.createPattern(gTile, "repeat");
    if (pat) {
      const gx = ((d.grainSeed >>> 0) * 53) & 255;
      const gy = ((d.grainSeed >>> 0) * 97) & 255;
      ctx.save();
      ctx.translate(-gx, -gy);
      ctx.fillStyle = pat;
      ctx.fillRect(gx, gy, outW, outH);
      ctx.restore();
    }
  } else {
    const gr = prng(d.grainSeed);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(24,20,14,${(0.012 + gr() * 0.038).toFixed(3)})`;
      ctx.fillRect(gr() * outW | 0, gr() * outH | 0, 1, 1);
    }
  }

  if (hasView) {
    ctx.translate(outW / 2, outH / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-outW, -outH);
  }
  ctx.translate(xShift, 0);
  ctx.textBaseline = "alphabetic";

  const kickerY = d.kickerRelY || -Math.round(mhSize * 3);
  const topRuleRelY = kickerY - Math.round(mhSize * 1.4);
  const mhRelY = topRuleRelY - Math.round(mhSize * 4.4);
  const dlRelY = mhRelY + Math.round(mhSize * 1.65);
  const mast = d.mastFamily || (d.locale === "hant" ? '"Noto Sans TC", sans-serif' : '"Noto Sans SC", sans-serif');

  drawMasthead(ctx, d, W, y, mhRelY, dlRelY, topRuleRelY, kickerY);

  if (d.layout === "classified") {
    drawHighlight(ctx, d);
    drawColumns(ctx, d, colX, y);
  } else if (d.layout === "table") {
    const heads = d.tableHeads || [];
    const rows = d.tableRows || [];
    const rowH = d.rowH;
    const pad = d.cellPadX || 8;
    const lastRightX = colX + Math.round(colW * 0.71);
    const chgRightX = colX + colW - pad;

    ctx.fillStyle = "#181614";
    ctx.fillRect(colX, y(d.tableRelY) - rowH * 0.74, colW, rowH);
    ctx.fillStyle = "#f5f0e6";
    ctx.font = `700 ${Math.round(d.bodySize * 0.88)}px ${mast}`;
    if (heads[0]) ctx.fillText(heads[0], colX + pad, y(d.tableRelY));
    if (heads[1]) {
      const w1 = ctx.measureText(heads[1]).width;
      ctx.fillText(heads[1], lastRightX - w1, y(d.tableRelY));
    }
    if (heads[2]) {
      const w2 = ctx.measureText(heads[2]).width;
      ctx.fillText(heads[2], chgRightX - w2, y(d.tableRelY));
    }

    rows.forEach((row, riIdx) => {
      const ry = d.tableRelY + (riIdx + 1) * rowH;
      if (riIdx % 2 === 0) {
        ctx.fillStyle = "rgba(22,20,18,0.038)";
        ctx.fillRect(colX, y(ry) - rowH * 0.74, colW, rowH);
      }
      ctx.strokeStyle = "rgba(22,20,18,0.10)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(colX, y(ry) + rowH * 0.26);
      ctx.lineTo(colX + colW, y(ry) + rowH * 0.26);
      ctx.stroke();
    });

    drawHighlight(ctx, d);

    ctx.font = d.bodySpec;
    rows.forEach((row, riIdx) => {
      const ry = d.tableRelY + (riIdx + 1) * rowH;
      ctx.fillStyle = "#181614";
      ctx.fillText(String(row[0] || ""), colX + pad, y(ry));
      const vLast = String(row[1] || "");
      const wLast = ctx.measureText(vLast).width;
      ctx.fillText(vLast, lastRightX - wLast, y(ry));

      const vChg = String(row[2] || "");
      const isNeg = vChg.trim().startsWith("-");
      const wChg = ctx.measureText(vChg).width;
      ctx.fillStyle = isNeg ? "rgba(156,36,30,0.11)" : "rgba(24,114,68,0.11)";
      ctx.fillRect(chgRightX - wChg - 10, y(ry) - rowH * 0.58, wChg + 12, rowH * 0.74);
      ctx.fillStyle = isNeg ? "#8e1f19" : "#15623b";
      ctx.fillText(vChg, chgRightX - wChg - 4, y(ry));
    });

    ctx.strokeStyle = "#8a8275";
    ctx.lineWidth = 0.9;
    ctx.strokeRect(colX, y(d.tableRelY) - rowH * 0.74, colW, rowH * (rows.length + 1));
  } else if (d.layout === "sports") {
    drawHighlight(ctx, d);
    (d.games || []).forEach((g, i) => {
      const ry = (i + 0.7) * d.boxH;
      ctx.fillStyle = i % 2 === 0 ? "rgba(22,20,18,0.035)" : "rgba(255,255,255,0.22)";
      ctx.fillRect(colX, y(ry) - d.boxH * 0.7, colW, d.boxH * 0.92);
      ctx.strokeStyle = "#181614";
      ctx.lineWidth = 1.1;
      ctx.strokeRect(colX, y(ry) - d.boxH * 0.7, colW, d.boxH * 0.92);
      ctx.fillStyle = "#b51d24";
      ctx.fillRect(colX, y(ry) - d.boxH * 0.7, 5, d.boxH * 0.92);
      ctx.save();
      ctx.beginPath();
      ctx.rect(colX + 6, y(ry) - d.boxH * 0.7, colW - 10, d.boxH * 0.92);
      ctx.clip();
      ctx.font = d.hlSpec || d.bodySpec;
      ctx.fillStyle = "#12100e";
      ctx.fillText(g, colX + (d.scorePad || Math.round(colW * 0.06)), y(ry));
      ctx.restore();
    });
  } else if (d.layout === "weather") {
    drawHighlight(ctx, d);
    const wPad = d.weatherPad || 8;
    ctx.font = d.bodySpec;
    (d.weatherRows || []).forEach((g, i) => {
      const ry = (i + 0.74) * d.rowH;
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(28,58,88,0.055)";
        ctx.fillRect(colX, y(ry) - d.rowH * 0.72, colW, d.rowH);
      }
      ctx.fillStyle = "#181614";
      ctx.fillText(g, colX + wPad, y(ry));
    });
  } else if (d.layout === "wire") {
    drawHighlight(ctx, d);
    const railX = colX + d.wireGutter - Math.round(d.wireGutter * 0.16);
    ctx.strokeStyle = "#bfb7a8";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(railX, y(0));
    ctx.lineTo(railX, y(d.contentBottomRelY || 0));
    ctx.stroke();

    (d.wireRows || []).forEach(row => {
      if (row.dividerAbove) {
        ctx.strokeStyle = "rgba(22,20,18,0.14)";
        ctx.lineWidth = 0.6;
        const dy = y(row.relY - d.bodyLineH * 0.84);
        ctx.beginPath();
        ctx.moveTo(colX, dy);
        ctx.lineTo(colX + colW, dy);
        ctx.stroke();
      }
      if (row.tag) {
        ctx.font = `700 ${Math.max(11, Math.round(d.bodySize * 0.80))}px ${mast}`;
        ctx.fillStyle = "#8f1d1d";
        ctx.fillText(row.tag, colX, y(row.relY));
      }
      ctx.font = d.bodySpec;
      ctx.fillStyle = "#181614";
      ctx.fillText(row.text, colX + d.wireGutter, y(row.relY));
    });
  } else if (d.layout === "pullquote") {
    if (d.hlLines) {
      ctx.font = d.hlSpec;
      ctx.fillStyle = "#141210";
      d.hlLines.forEach((ln, i) => ctx.fillText(ln, colX, y(i * d.hlLineH)));
    }
    if (d.bylineRelY != null) {
      ctx.font = d.bylineSpec;
      ctx.fillStyle = "#5c564d";
      ctx.fillText(d.byline, colX, y(d.bylineRelY));
    }
    if (d.ruleRelY != null) {
      ctx.strokeStyle = "#b8b0a2";
      ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(colX, y(d.ruleRelY)); ctx.lineTo(colX + colW, y(d.ruleRelY)); ctx.stroke();
    }

    const qx0 = colX + d.pqInset;
    const qx1 = colX + colW - d.pqInset;
    ctx.strokeStyle = "#181614";
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(qx0, y(d.pqTopRuleRelY)); ctx.lineTo(qx1, y(d.pqTopRuleRelY)); ctx.stroke();
    ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(qx0, y(d.pqBotRuleRelY)); ctx.lineTo(qx1, y(d.pqBotRuleRelY)); ctx.stroke();

    ctx.font = `700 ${Math.round(d.pqSize * 1.9)}px ${mast}`;
    ctx.fillStyle = "rgba(155,34,30,0.22)";
    ctx.fillText(d.locale === "hant" ? "「" : "“", colX + Math.round(d.pqInset * 0.12), y(d.pqRelY + Math.round(d.pqSize * 0.35)));

    drawHighlight(ctx, d);

    ctx.font = d.pqSpec;
    ctx.fillStyle = "#12100e";
    (d.pqLines || []).forEach((ln, i) => {
      ctx.fillText(ln, qx0, y(d.pqRelY + i * d.pqLineH));
    });

    if (d.bodyLines) drawColumns(ctx, d, colX, y);
  } else if (d.layout === "photo") {
    drawHighlight(ctx, d);
    ctx.font = d.hlSpec;
    ctx.fillStyle = "#100f0d";
    (d.hlLines || []).forEach((ln, i) => ctx.fillText(ln, colX, y(i * d.hlLineH)));
    drawHalftonePhoto(ctx, colX, y(d.photoRelY), colW, d.photoH, d.photoSeed, d.locale, mast, d.bodySize);
    ctx.font = d.deckSpec || d.bodySpec;
    ctx.fillStyle = "#47423a";
    (d.capLines || []).forEach((ln, i) => ctx.fillText(ln, colX, y(d.capRelY + i * (d.deckLineH || d.bodyLineH))));
    drawColumns(ctx, d, colX, y);
  } else {
    drawHighlight(ctx, d);
    if (d.hlLines) {
      ctx.font = d.hlSpec;
      ctx.fillStyle = "#100f0d";
      d.hlLines.forEach((ln, i) => ctx.fillText(ln, colX, y(i * d.hlLineH)));
    }
    if (d.hasDeck && d.deckLines && d.deckLines.length) {
      ctx.font = d.deckSpec || `400 ${d.deckSize}px ${mast}`;
      ctx.fillStyle = "#3d3933";
      d.deckLines.forEach((ln, i) => ctx.fillText(ln, colX, y(d.deckRelY + i * d.deckLineH)));
    }
    if (d.bylineRelY != null) {
      ctx.font = d.bylineSpec || `400 ${Math.round(mhSize * 0.94)}px ${mast}`;
      ctx.fillStyle = "#5c564d";
      ctx.fillText(d.byline, colX, y(d.bylineRelY));
    }
    if (d.ruleRelY != null) {
      ctx.strokeStyle = "#b5ad9e";
      ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(colX, y(d.ruleRelY)); ctx.lineTo(colX + colW, y(d.ruleRelY)); ctx.stroke();
    }
    if (d.bodyLines) drawColumns(ctx, d, colX, y);
  }

  if (d.bgLines && d.bgLines.length && d.bodyLineH > 0) {
    const bgLen = d.bgLines.length;
    const vTop = hasView ? Math.floor(outH - outH / (2 * zoom) - 48) : 0;
    const vBot = hasView ? Math.ceil(outH + outH / (2 * zoom) + 48) : H;
    const vLeft = (hasView ? Math.floor(outW - outW / (2 * zoom) - 48) : 0) - xShift;
    const vRight = (hasView ? Math.ceil(outW + outW / (2 * zoom) + 48) : W) - xShift;

    ctx.font = d.bodySpec;
    ctx.fillStyle = "#22201c";
    const articleTopY = y(mhRelY) - Math.round(d.mhSize * 2.4);
    let idx = 0;
    for (let ly = articleTopY - d.bodyLineH; ly > vTop - d.bodyLineH; ly -= d.bodyLineH) {
      if (ly <= vBot + d.bodyLineH) {
        ctx.fillText(d.bgLines[idx % bgLen], colX, Math.round(ly));
      }
      idx++;
    }
    const lastRelY = d.contentBottomRelY || ((d.bodyRelY || 0) + (d.bodyLines ? d.bodyLines.length * d.bodyLineH : 0));
    let idx2 = 37;
    for (let ly = y(lastRelY) + d.bodyLineH; ly < vBot + d.bodyLineH; ly += d.bodyLineH) {
      if (ly >= vTop - d.bodyLineH) {
        ctx.fillText(d.bgLines[idx2 % bgLen], colX, Math.round(ly));
      }
      idx2++;
    }

    const sideGap = Math.max(12, Math.round(d.bodySize * 1.35));
    const sideColW = Math.max(80, Math.round((colW || 900) * 0.34));
    const sideSubSpec = `700 ${Math.round(d.bodySize * 1.06)}px ${mast}`;
    const startRow = Math.min(0, Math.floor((vTop - d.bodyLineH * 0.9) / d.bodyLineH));
    const drawSideCol = (sx, ruleX, seedIdx) => {
      ctx.strokeStyle = "#c6bfb2";
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(ruleX, vTop);
      ctx.lineTo(ruleX, vBot);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, vTop, sideColW, Math.max(1, vBot - vTop));
      ctx.clip();
      for (let row = startRow; ; row++) {
        const ly = d.bodyLineH * 0.9 + row * d.bodyLineH;
        if (ly > vBot + d.bodyLineH) break;
        if (ly < vTop - d.bodyLineH) continue;
        const lineIdx = (((seedIdx * 19 + row) % bgLen) + bgLen) % bgLen;
        const lineText = d.bgLines[lineIdx];
        const mod14 = (((row + seedIdx * 5) % 14) + 14) % 14;
        if (mod14 === 3) {
          ctx.strokeStyle = "rgba(22,20,18,0.18)";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(sx, Math.round(ly - d.bodyLineH * 0.78));
          ctx.lineTo(sx + sideColW, Math.round(ly - d.bodyLineH * 0.78));
          ctx.stroke();
          ctx.font = sideSubSpec;
          ctx.fillStyle = "#161412";
          ctx.fillText(lineText, sx, Math.round(ly));
        } else {
          ctx.font = d.bodySpec;
          ctx.fillStyle = "#22201c";
          ctx.fillText(lineText, sx, Math.round(ly));
        }
      }
      ctx.restore();
    };

    const maxSideCols = hasView ? 8 : 4;
    let sideStep = 0;
    for (
      let sx = colX - sideGap - sideColW;
      sx + sideColW > vLeft && sideStep < maxSideCols;
      sx -= (sideColW + sideGap), sideStep++
    ) {
      drawSideCol(sx, sx + sideColW + sideGap / 2, sideStep + 1);
    }
    sideStep = 0;
    for (
      let sx = colX + colW + sideGap;
      sx < vRight && sideStep < maxSideCols;
      sx += (sideColW + sideGap), sideStep++
    ) {
      drawSideCol(sx, sx - sideGap / 2, sideStep + 5);
    }
  }
  ctx.restore();
}

const blurPool = {
  bW: 0,
  bH: 0,
  small: null,
  sCtx: null,
  c14: null,
  x14: null,
  c5: null,
  x5: null,
  c15: null,
  x15: null,
  patch: null,
  pCtx: null,
};

function ensureBlurPool(bW, bH, pW, pH) {
  if (!blurPool.small || blurPool.bW !== bW || blurPool.bH !== bH) {
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = bW;
      c.height = bH;
      return [c, c.getContext("2d")];
    };
    [blurPool.small, blurPool.sCtx] = mk();
    [blurPool.c14, blurPool.x14] = mk();
    [blurPool.c5, blurPool.x5] = mk();
    [blurPool.c15, blurPool.x15] = mk();
    blurPool.bW = bW;
    blurPool.bH = bH;
  }
  if (!blurPool.patch) {
    blurPool.patch = document.createElement("canvas");
    blurPool.patch.width = Math.max(256, pW);
    blurPool.patch.height = Math.max(256, pH);
    blurPool.pCtx = blurPool.patch.getContext("2d");
  } else {
    if (blurPool.patch.width < pW) blurPool.patch.width = Math.ceil(pW * 1.25);
    if (blurPool.patch.height < pH) blurPool.patch.height = Math.ceil(pH * 1.25);
  }
}

function lensBlur(dst, src, cx, cy, R, W, H, blurFactor, innerPlateauR) {
  if (blurFactor <= 0 || typeof document === "undefined") {
    dst.drawImage(src, 0, 0);
    return;
  }
  const S = 0.5, bW = Math.max(1, W * S | 0), bH = Math.max(1, H * S | 0);
  cx = finite(cx, W / 2);
  cy = finite(cy, H / 2);
  R = Math.max(8, finite(R, Math.min(W, H) * 0.08));

  const rad = Math.max(16, R * 1.4);
  const solidR = Math.max(12, Math.min(rad * 0.78, finite(innerPlateauR, R * 0.52)));
  const px0 = Math.max(0, Math.floor(cx - rad - 2));
  const py0 = Math.max(0, Math.floor(cy - rad - 2));
  const px1 = Math.min(W, Math.ceil(cx + rad + 2));
  const py1 = Math.min(H, Math.ceil(cy + rad + 2));
  const pW = Math.max(1, px1 - px0);
  const pH = Math.max(1, py1 - py0);

  ensureBlurPool(bW, bH, pW, pH);

  blurPool.sCtx.clearRect(0, 0, bW, bH);
  blurPool.sCtx.drawImage(src, 0, 0, bW, bH);

  const blurInto = (c, x, sigma) => {
    x.globalCompositeOperation = "source-over";
    x.clearRect(0, 0, bW, bH);
    x.filter = `blur(${sigma * blurFactor}px)`;
    x.drawImage(blurPool.small, 0, 0);
    x.filter = "none";
    return c;
  };
  const mask = (x, r0, r1) => {
    x.globalCompositeOperation = "destination-in";
    const inner = Math.max(0, finite(r0, 0));
    const outer = Math.max(inner + 0.5, finite(r1, inner + 8));
    const g = x.createRadialGradient(cx * S, cy * S, inner, cx * S, cy * S, outer);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, bW, bH);
    x.globalCompositeOperation = "source-over";
  };

  dst.drawImage(blurInto(blurPool.c14, blurPool.x14, 22), 0, 0, W, H);
  blurInto(blurPool.c5, blurPool.x5, 8);
  mask(blurPool.x5, solidR * S, R * S * 4.5);
  dst.drawImage(blurPool.c5, 0, 0, W, H);

  blurInto(blurPool.c15, blurPool.x15, 2.5);
  mask(blurPool.x15, solidR * S, R * S * 2.4);
  dst.drawImage(blurPool.c15, 0, 0, W, H);

  const sx = blurPool.pCtx;
  sx.globalCompositeOperation = "source-over";
  sx.clearRect(0, 0, pW, pH);
  sx.drawImage(src, px0, py0, pW, pH, 0, 0, pW, pH);
  sx.globalCompositeOperation = "destination-in";
  const g = sx.createRadialGradient(cx - px0, cy - py0, solidR, cx - px0, cy - py0, rad);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  sx.fillStyle = g;
  sx.fillRect(0, 0, pW, pH);
  sx.globalCompositeOperation = "source-over";
  dst.drawImage(blurPool.patch, 0, 0, pW, pH, px0, py0, pW, pH);
}

function drawVignette(ctx, W, H) {
  const cx = W / 2, cy = H / 2;
  const r0 = 0.48 * Math.max(W, H);
  const r1 = 0.74 * Math.hypot(W, H);
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, Math.max(r0 + 1, r1));
  g.addColorStop(0, "rgba(18,14,10,0)");
  g.addColorStop(1, "rgba(18,14,10,0.22)");
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

const SFX = {
  paper(ac, gn, w) {
    const l = ac.sampleRate * 0.04 | 0, b = ac.createBuffer(1, l, ac.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < l; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / l) ** 1.8;
    const s = ac.createBufferSource(); s.buffer = b;
    const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3800; f.Q.value = 0.7;
    const e = ac.createGain();
    e.gain.setValueAtTime(0, w); e.gain.linearRampToValueAtTime(0.42, w + 0.005); e.gain.exponentialRampToValueAtTime(0.0001, w + 0.04);
    s.connect(f); f.connect(e); e.connect(gn); s.start(w);
  },
  shutter(ac, gn, w) {
    for (const [t, freq, amp, dur] of [[0, 2800, 0.5, 0.018], [0.026, 2200, 0.28, 0.013]]) {
      const l = ac.sampleRate * dur | 0, b = ac.createBuffer(1, l, ac.sampleRate);
      const d = b.getChannelData(0); for (let i = 0; i < l; i++) d[i] = Math.random() * 2 - 1;
      const s = ac.createBufferSource(); s.buffer = b;
      const f = ac.createBiquadFilter(); f.type = "highpass"; f.frequency.value = freq;
      const e = ac.createGain(); const wt = w + t;
      e.gain.setValueAtTime(0, wt); e.gain.linearRampToValueAtTime(amp, wt + 0.002); e.gain.exponentialRampToValueAtTime(0.0001, wt + dur);
      s.connect(f); f.connect(e); e.connect(gn); s.start(wt);
    }
  },
  film(ac, gn, w) {
    for (let i = 0; i < 4; i++) {
      const t = w + i * 0.022, l = ac.sampleRate * 0.016 | 0, b = ac.createBuffer(1, l, ac.sampleRate);
      const d = b.getChannelData(0); for (let j = 0; j < l; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / l) ** 2;
      const s = ac.createBufferSource(); s.buffer = b;
      const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1800 + i * 200; f.Q.value = 1.2;
      const e = ac.createGain();
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.35 - i * 0.05, t + 0.002); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);
      s.connect(f); f.connect(e); e.connect(gn); s.start(t);
    }
  },
  polaroid(ac, gn, w) {
    const o = ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(80, w); o.frequency.linearRampToValueAtTime(55, w + 0.09);
    const og = ac.createGain();
    og.gain.setValueAtTime(0, w); og.gain.linearRampToValueAtTime(0.14, w + 0.01); og.gain.setValueAtTime(0.14, w + 0.07); og.gain.linearRampToValueAtTime(0, w + 0.095);
    o.connect(og); og.connect(gn); o.start(w); o.stop(w + 0.1);
    const cl = ac.sampleRate * 0.02 | 0, cb = ac.createBuffer(1, cl, ac.sampleRate), cd = cb.getChannelData(0);
    for (let i = 0; i < cl; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cl) ** 1.5;
    const cs = ac.createBufferSource(); cs.buffer = cb;
    const ch = ac.createBiquadFilter(); ch.type = "highpass"; ch.frequency.value = 2500;
    const ce = ac.createGain(); const cw = w + 0.042;
    ce.gain.setValueAtTime(0, cw); ce.gain.linearRampToValueAtTime(0.45, cw + 0.004); ce.gain.exponentialRampToValueAtTime(0.0001, cw + 0.022);
    cs.connect(ch); ch.connect(ce); ce.connect(gn); cs.start(cw);
  },
  flash(ac, gn, w) {
    const o = ac.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(110, w); o.frequency.exponentialRampToValueAtTime(38, w + 0.065);
    const og = ac.createGain();
    og.gain.setValueAtTime(0, w); og.gain.linearRampToValueAtTime(0.65, w + 0.004); og.gain.exponentialRampToValueAtTime(0.0001, w + 0.065);
    o.connect(og); og.connect(gn); o.start(w); o.stop(w + 0.07);
  },
  none() {},
};

function cpsGainScale(cps) {
  return Math.min(1, Math.sqrt(14 / Math.max(1, Number(cps) || 12)));
}

function createAudioChain(ac, dest) {
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -10;
  comp.knee.value = 12;
  comp.ratio.value = 6;
  comp.attack.value = 0.002;
  comp.release.value = 0.08;
  const master = ac.createGain();
  master.gain.value = 0.72;
  master.connect(comp);
  comp.connect(dest);
  return { master, comp };
}

function triggerSfx(ac, masterGain, sound, when, cps) {
  const fn = SFX[sound];
  if (!fn || sound === "none") return;
  const scale = cpsGainScale(cps);
  const cg = ac.createGain();
  cg.gain.setValueAtTime(scale, when);
  cg.connect(masterGain);
  fn(ac, cg, when);
}

async function resumeAudio(ac, ms = 1200) {
  if (!ac || ac.state !== "suspended") return;
  try {
    await Promise.race([ac.resume(), new Promise(r => setTimeout(r, ms))]);
  } catch (e) { console.warn(e); }
}

const FONT_LOAD_SPECS = {
  zh: [
    '400 48px "Noto Sans SC"', '700 48px "Noto Sans SC"',
    '400 48px "Noto Serif SC"', '700 48px "Noto Serif SC"',
    "400 48px SimSun", "700 48px SimSun",
    "400 32px KaiTi", "400 32px FangSong",
    "400 32px SimHei", '400 32px "Microsoft YaHei"',
  ],
  hant: [
    '400 48px "Noto Sans TC"', '700 48px "Noto Sans TC"',
    '400 48px "Noto Serif TC"', '700 48px "Noto Serif TC"',
    "400 48px PMingLiU", "700 48px PMingLiU",
    '400 32px "Microsoft JhengHei"', '700 32px "Microsoft JhengHei"',
    "400 32px DFKai-SB", "400 32px FangSong",
  ],
  en: [
    '400 48px "Playfair Display"', '700 48px "Playfair Display"',
    'italic 400 48px "Playfair Display"', 'italic 700 48px "Playfair Display"',
    "400 48px Inter", "600 48px Inter",
    '400 48px "Libre Baskerville"', '700 48px "Libre Baskerville"',
    "400 48px Newsreader", "500 48px Oswald",
    '400 48px "Roboto-Black"', '400 48px "Roboto-BlackItalic"',
    '400 48px "Roboto-Condensed"', '400 48px "Roboto-Italic"', '400 48px "Roboto-Light"',
  ],
};
const fontLoadCache = {};

async function loadFonts(locale) {
  if (typeof document === "undefined" || !document.fonts) return;
  const loc = normalizeLocale(locale);
  if (!fontLoadCache[loc]) {
    const specs = FONT_LOAD_SPECS[loc] || FONT_LOAD_SPECS.zh;
    const sample = loc === "en"
      ? "TextMatchCut 0123456789"
      : loc === "hant"
        ? "人工智慧繁體報刊Aa0123"
        : "人工智能中文报刊Aa0123";
    fontLoadCache[loc] = Promise.allSettled(specs.map(s => document.fonts.load(s, sample)));
  }
  await fontLoadCache[loc];
}

function releaseCanvases(list) {
  if (!Array.isArray(list)) return;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c) { c.width = 0; c.height = 0; }
  }
}

function renderBakedFrame(d, W, H, flat, fCtx, blurFactor, vignette, targetCanvas) {
  if (flat.width !== W) flat.width = W;
  if (flat.height !== H) flat.height = H;
  const zoom = Math.max(0.1, Number(d.zoomScale) || 1);
  renderCut(fCtx, d, 2 * W, 2 * H, { outW: W, outH: H, zoom });

  const frame = targetCanvas || document.createElement("canvas");
  if (frame.width !== W) frame.width = W;
  if (frame.height !== H) frame.height = H;
  const fx = frame.getContext("2d");
  fx.setTransform(1, 0, 0, 1, 0, 0);
  fx.clearRect(0, 0, W, H);

  const kwScreenW = (d.kwW || W * 0.18) * zoom;
  const kwScreenH = (d.hlBoxH || (d.hlRect && d.hlRect.h) || d.hlSize || H * 0.06) * zoom;
  const innerPlateauR = Math.max(kwScreenW * 0.64, kwScreenH * 1.25);
  const screenR = Math.max(innerPlateauR * 1.35, (d.focalR || W * 0.16) * zoom);
  const blurAmt = (Number(blurFactor) || 0) * (d.nCh <= 3 ? 0.6 : 1);

  lensBlur(fx, flat, W / 2, H / 2, screenR, W, H, blurAmt, innerPlateauR);
  if (vignette !== false) drawVignette(fx, W, H);
  return frame;
}

async function bakeFrames(keyword, ratio, opts, onProgress, copy, locale, fontId) {
  const baseSize = SIZES[ratio] || SIZES["1:1"];
  const scale = opts && opts.renderScale ? opts.renderScale : 1;
  const shouldAbort = opts && typeof opts.shouldAbort === "function" ? opts.shouldAbort : null;
  const cooperative = Boolean(opts && opts.cooperative);
  const W = Math.round(baseSize.w * scale);
  const H = Math.round(baseSize.h * scale);
  const sched = planCutSchedule({
    duration: opts.duration,
    cps0: opts.cps0,
    cps1: opts.cps1,
    curve: opts.curve,
    hold: opts.hold,
    fps: opts && opts.fps,
  });
  await loadFonts(locale);
  if (shouldAbort && shouldAbort()) return { aborted: true, baked: [], sched, W, H };

  const descs = buildDescs(sched.nCuts, keyword, W, H, opts.zoomVariance, copy, locale, fontId, {
    hlColor: opts.hlColor,
    hlStyle: opts.hlStyle,
    seedOffset: opts.seedOffset,
    seedW: baseSize.w,
  });
  const flat = document.createElement("canvas"); flat.width = W; flat.height = H;
  const fCtx = flat.getContext("2d");
  const baked = [];
  let sliceStart = typeof performance !== "undefined" ? performance.now() : 0;

  for (let ci = 0; ci < sched.nCuts; ci++) {
    if (shouldAbort && shouldAbort()) {
      flat.width = 0; flat.height = 0;
      releaseCanvases(baked);
      return { aborted: true, baked: [], sched, W, H };
    }
    const frame = renderBakedFrame(
      descs[ci], W, H, flat, fCtx,
      opts.blurFactor, opts.vignette !== false
    );
    baked.push(frame);
    if (onProgress) onProgress(ci + 1, sched.nCuts, "渲染", frame, sched);
    if (cooperative && ci + 1 < sched.nCuts && typeof performance !== "undefined" && (performance.now() - sliceStart >= 12 || ci === 0)) {
      await new Promise(r => setTimeout(r, 0));
      sliceStart = performance.now();
    }
  }
  flat.width = 0; flat.height = 0;
  return { aborted: false, baked, sched, W, H };
}

async function exportVideo(baked, sched, W, H, opts, onProgress) {
  const total = sched.totalFrames;
  const fps = sched.fps || FPS;
  const sound = opts.sound || "none";
  let ac = null, masterGain = null, ad = null;
  if (sound !== "none") {
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      await resumeAudio(ac);
      ad = ac.createMediaStreamDestination();
      masterGain = createAudioChain(ac, ad).master;
    } catch (e) { console.warn(e); }
  }

  const main = document.createElement("canvas");
  main.width = W;
  main.height = H;
  const mCtx = main.getContext("2d");
  mCtx.drawImage(baked[0], 0, 0);

  const mime = opts.mime || "";
  const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
  const stream = main.captureStream(fps);
  if (ad) ad.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const rec = new MediaRecorder(
    stream,
    mime ? { mimeType: mime, videoBitsPerSecond: 8_000_000 } : { videoBitsPerSecond: 8_000_000 }
  );
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };
  const done = new Promise(res => {
    rec.onstop = () => res(new Blob(chunks, { type: mime || "video/webm" }));
  });

  rec.start(80);
  await new Promise(r => setTimeout(r, 80));
  const t0 = performance.now();
  const fi = 1000 / fps;

  if (ac && masterGain) {
    sched.changeAt.forEach((f, idx) => {
      const when = ac.currentTime + f / fps + 0.016;
      const cps = sched.cpsAtCut ? sched.cpsAtCut[idx] : opts.cps0;
      triggerSfx(ac, masterGain, sound, when, cps);
    });
  }

  await new Promise(resolve => {
    let finished = false;
    let rafId = 0;
    let ivId = 0;
    let lastFrame = -1;
    const tick = () => {
      if (finished) return;
      const el = performance.now() - t0;
      const lf = Math.min(Math.max(0, (el / fi) | 0), total - 1);
      if (lf !== lastFrame) {
        lastFrame = lf;
        const ci = sched.cutAt[lf];
        mCtx.drawImage(baked[ci], 0, 0);
        if (onProgress) onProgress(lf + 1, total, "录制");
      }
      if (el >= total * fi) {
        finished = true;
        cancelAnimationFrame(rafId);
        clearInterval(ivId);
        mCtx.drawImage(baked[sched.cutAt[total - 1]], 0, 0);
        if (onProgress) onProgress(total, total, "录制");
        setTimeout(() => {
          try { if (rec.state !== "inactive") rec.stop(); } catch {}
          resolve();
        }, 360);
      }
    };
    const onRaf = () => {
      tick();
      if (!finished) rafId = requestAnimationFrame(onRaf);
    };
    rafId = requestAnimationFrame(onRaf);
    ivId = setInterval(tick, Math.max(8, Math.floor(fi / 2)));
  });

  const blob = await done;
  main.width = 0; main.height = 0;
  if (ac) { try { await ac.close(); } catch {} }
  return { blob, ext };
}

async function generate(keyword, ratio, opts, onProgress, copy, locale, fontId) {
  const bakeOpts = Object.assign({}, opts, { cooperative: true });
  const { baked, sched, W, H } = await bakeFrames(keyword, ratio, bakeOpts, onProgress, copy, locale, fontId);
  try {
    if (onProgress) onProgress(0, sched.totalFrames, "录制");
    return await exportVideo(baked, sched, W, H, opts, onProgress);
  } finally {
    releaseCanvases(baked);
  }
}

function ensureVideoMetadata(vid, url) {
  if (!vid) return Promise.resolve();
  return new Promise(resolve => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timer = setTimeout(finish, 2200);
    vid.preload = "auto";
    vid.muted = true;
    vid.onloadedmetadata = () => {
      if (vid.duration === Infinity || Number.isNaN(vid.duration)) {
        const onSeek = () => {
          vid.removeEventListener("timeupdate", onSeek);
          vid.removeEventListener("durationchange", onSeek);
          try { vid.currentTime = 0; } catch {}
          clearTimeout(timer);
          finish();
        };
        vid.addEventListener("timeupdate", onSeek);
        vid.addEventListener("durationchange", onSeek);
        try { vid.currentTime = 1e101; } catch {
          clearTimeout(timer);
          finish();
        }
      } else {
        clearTimeout(timer);
        finish();
      }
    };
    vid.onerror = () => {
      clearTimeout(timer);
      finish();
    };
    vid.src = url;
    try { vid.load(); } catch {}
  });
}

if (typeof document !== "undefined") (function () {
  const PREVIEW_SCALE = 1.0;
  const $ = id => document.getElementById(id);
  const kw = $("keyword");
  if (!kw) return;

  const stageCanvas = $("stageCanvas");
  const vid = $("preview");
  const formatSelect = $("formatSelect");
  const formatBtn = $("formatBtn");
  const formatBtnLabel = $("formatBtnLabel");
  const formatMenu = $("formatMenu");
  const exportSplit = $("exportSplit");
  const fontSelect = $("fontSelect");
  const playPauseBtn = $("playPauseBtn");
  const playPauseLabel = $("playPauseLabel");
  const livePreviewToggle = $("livePreviewToggle");
  const downloadBtn = $("downloadBtn");
  const progressEl = $("progress");
  const timeReadout = $("timeReadout");
  const stageProgressTrack = $("stageProgressTrack");
  const stageProgressFill = $("stageProgressFill");
  const errorEl = $("error");
  const formats = probeFormats();

  const defaults = { en: "Open Source", zh: "人工智能", hant: "人工智慧" };

  function parseUiLangParam(raw) {
    if (!raw) return "";
    const v = String(raw).trim();
    const lc = v.toLowerCase();
    if (lc === "hant" || lc === "zh-tw" || lc === "zh-hk" || lc === "zh-hant" || lc === "tw") return "hant";
    if (lc === "zh" || lc === "zh-cn" || lc === "zh-hans") return "zh";
    if (lc === "en") return "en";
    return "";
  }

  function detectInitialUiLang() {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      const fromQuery = parseUiLangParam(q);
      if (fromQuery) return fromQuery;
    } catch {}
    try {
      const saved = localStorage.getItem("tmc_ui_lang");
      if (saved === "en" || saved === "zh" || saved === "hant") return saved;
    } catch {}
    return "en";
  }

  let uiLang = detectInitialUiLang();
  let locale = uiLang;
  const initRatioBtn = document.querySelector("#ratios button.on[data-ratio]");
  let ratio = (initRatioBtn && initRatioBtn.dataset.ratio) || "1:1";
  let copyPack = null;
  let lastUrl = null;
  let lastBlob = null;
  let lastExt = "mp4";
  let curve = "lin";
  let speedMode = "const";
  const initSwatch = document.querySelector("#hlColors button.on[data-hl]");
  let hlColor = (initSwatch && initSwatch.dataset.hl) || "#ffe72e";
  const initHlStyleBtn = document.querySelector("#hlStyleBtns button.on[data-hl-style]");
  let hlStyle = (initHlStyleBtn && initHlStyleBtn.dataset.hlStyle) || "marker";
  let seedOffset = 0;
  let livePreview = true;
  let isPlaying = false;
  let isExporting = false;
  let exportPct = 0;
  let previewToken = 0;
  let previewRafId = 0;
  let sharedAc = null;
  let previewMasterGain = null;
  let audioUnlocked = false;
  let heroScratch = null;
  let staticTimerId = 0;
  let inputDebounceTimer = 0;
  let kwComposing = false;
  let ctComposing = false;
  let pausedRatio = 0;
  let activeLoopControl = null;
  let activeErrorKey = "";

  const LEGAL_HASHES = new Set(["#legal", "#placeholders", "#privacy", "#terms", "#cookies", "#disclaimer"]);
  const CTA_FONTS = {
    en: [
      { family: '"Playfair Display", serif', style: "normal", weight: "700" },
      { family: "Inter, sans-serif", style: "normal", weight: "700" },
      { family: '"Playfair Display", serif', style: "italic", weight: "700" },
      { family: "Oswald, sans-serif", style: "normal", weight: "500" },
      { family: '"Libre Baskerville", serif', style: "normal", weight: "700" },
      { family: '"Roboto-BlackItalic", sans-serif', style: "italic", weight: "400" },
    ],
    zh: [
      { family: '"Noto Serif SC", serif', weight: "700" },
      { family: '"Noto Sans SC", sans-serif', weight: "700" },
      { family: 'KaiTi, "Kaiti SC", serif', weight: "700" },
      { family: 'FangSong, "STFangsong", serif', weight: "700" },
      { family: 'SimHei, "Noto Sans SC", sans-serif', weight: "700" },
      { family: 'SimSun, "Noto Serif SC", serif', weight: "700" },
    ],
    hant: [
      { family: '"Noto Serif TC", PMingLiU, serif', weight: "700" },
      { family: '"Noto Sans TC", "Microsoft JhengHei", sans-serif', weight: "700" },
      { family: 'DFKai-SB, BiauKai, "Kaiti TC", serif', weight: "700" },
      { family: 'FangSong, STFangsong, "Noto Serif TC", serif', weight: "700" },
      { family: '"Microsoft JhengHei", "Noto Sans TC", sans-serif', weight: "700" },
      { family: 'PMingLiU, MingLiU, "Noto Serif TC", serif', weight: "700" },
    ],
  };
  const CTA_TILTS = ["-0.9deg", "0.7deg", "-0.4deg", "0.9deg", "0deg", "-0.6deg"];

  let inLegalView = false;
  let wasPlayingBeforeLegal = false;
  let tocLockUntil = 0;
  let legalTocBound = false;
  let exBakeToken = 0;
  let lastExampleBakeLang = "";
  let exampleCards = [];
  let examplesInView = false;
  let hoveredExampleIdx = -1;
  let exHoverStartCut = 0;
  let exRafId = 0;
  let exLoopOrigin = 0;
  let finalCtaInView = false;
  let ctaTimerId = 0;
  let ctaStepIdx = 0;

  function syncDocumentTitle() {
    if (inLegalView && $("legalView")) {
      document.title = uiLang === "hant"
        ? "隱私政策與使用條款 — 文字對切"
        : uiLang === "zh"
          ? "隐私政策与使用条款 — 文字对切"
          : "Legal, Privacy & Terms — TextMatchCut";
      return;
    }
    const docEl = document.documentElement;
    const titleAttr = uiLang === "hant"
      ? "data-hant-title"
      : uiLang === "zh"
        ? "data-zh-title"
        : "data-en-title";
    const customTitle = docEl.getAttribute(titleAttr);
    document.title = customTitle || (uiLang === "hant"
      ? "文字對切 — 免費報刊剪報高亮快切影片產生器"
      : uiLang === "zh"
        ? "文字对切 — 免费报刊剪报高亮快切视频生成器"
        : "TextMatchCut — Free Newspaper Highlight Match Cut Video Generator");
  }

  const previewCache = {
    key: "",
    baked: null,
    sched: null,
    ratio: "",
  };

  const ERROR_MESSAGES = {
    fontRead: { en: "Could not read font file", zh: "字体文件无法读取", hant: "無法讀取字體檔案" },
    copyLoad: { en: "Failed to load editorial copy — please open via local server", zh: "文案加载失败，请通过本地服务打开页面", hant: "文案載入失敗，請透過本地伺服器開啟頁面" },
    needKeyword: { en: "Please enter a focal word first", zh: "请先输入焦点词", hant: "請先輸入焦點詞" },
    copyPending: { en: "Editorial copy is still loading", zh: "文案尚未加载完成", hant: "文案尚未載入完成" },
    needFont: { en: "Please upload a font file first", zh: "请先上传字体文件", hant: "請先上傳字體檔案" },
    noRecorder: { en: "In-browser video recording is not supported in this browser", zh: "当前浏览器不支持页内录制", hant: "目前瀏覽器不支援頁內錄製" },
    exportFail: { en: "Video export failed, please try again", zh: "视频导出失败，请重试", hant: "影片匯出失敗，請重試" },
  };

  let lastStatusStr = "";
  let lastTimeStr = "";
  const timelineState = {
    kind: "ready",
    pct: 0,
    done: 0,
    total: 0,
    ci: 0,
    nCuts: 48,
    curSec: 0,
    totSec: 4,
    totalFrames: 120,
  };

  function formatRightTime(curSec, totSec, totalFrames) {
    const f = Math.max(1, Math.round(totalFrames || 120));
    if (uiLang === "hant") return `${curSec.toFixed(1)} / ${totSec.toFixed(1)} 秒 · ${f} 幀`;
    if (uiLang === "zh") return `${curSec.toFixed(1)} / ${totSec.toFixed(1)} 秒 · ${f} 帧`;
    return `${curSec.toFixed(1)} / ${totSec.toFixed(1)}s · ${f}f`;
  }

  function formatIdleSpan(totSec, totalFrames) {
    const f = Math.max(1, Math.round(totalFrames || 120));
    if (uiLang === "hant") return `共 ${totSec.toFixed(1)} 秒 · ${f} 幀`;
    if (uiLang === "zh") return `共 ${totSec.toFixed(1)} 秒 · ${f} 帧`;
    return `${totSec.toFixed(1)}s · ${f}f`;
  }

  function setTimelineUi(pct, statusStr, timeStr, mode) {
    if (stageProgressFill) {
      const clamped = Math.max(0, Math.min(100, Number(pct) || 0));
      stageProgressFill.style.width = `${clamped.toFixed(1)}%`;
    }
    if (stageProgressTrack) {
      stageProgressTrack.classList.toggle("is-baking", mode === "baking");
      stageProgressTrack.classList.toggle("is-exporting", mode === "exporting");
    }
    if (progressEl && statusStr !== undefined && statusStr !== lastStatusStr) {
      lastStatusStr = statusStr;
      progressEl.textContent = statusStr;
    }
    if (timeReadout && timeStr !== undefined && timeStr !== lastTimeStr) {
      lastTimeStr = timeStr;
      timeReadout.textContent = timeStr;
    }
  }

  function setTimelineState(patch) {
    Object.assign(timelineState, patch);
    const s = timelineState;
    let statusStr = "";
    let timeStr = "";
    let barMode = "idle";
    const isHant = uiLang === "hant";
    const isZh = uiLang === "zh";

    if (s.kind === "ready") {
      statusStr = isHant ? "準備就緒" : isZh ? "准备就绪" : "Ready";
      timeStr = formatRightTime(0, s.totSec, s.totalFrames);
    } else if (s.kind === "single") {
      statusStr = isHant ? "單幀定格" : isZh ? "单帧定格" : "Single frame";
      timeStr = formatIdleSpan(s.totSec, s.totalFrames);
    } else if (s.kind === "empty") {
      statusStr = isHant ? "請輸入焦點詞" : isZh ? "请输入焦点词" : "Enter a focal word";
      timeStr = formatIdleSpan(s.totSec, s.totalFrames);
    } else if (s.kind === "baking") {
      barMode = "baking";
      statusStr = isHant
        ? `準備畫面 ${s.done} / ${s.total} 刀`
        : isZh
          ? `准备画面 ${s.done} / ${s.total} 刀`
          : `Preparing ${s.done} / ${s.total} cuts`;
      timeStr = `${Math.round(s.pct)}%`;
    } else if (s.kind === "playing") {
      barMode = "playing";
      statusStr = isHant
        ? `循環預覽 · 第 ${s.ci + 1} / ${s.nCuts} 刀`
        : isZh
          ? `循环预览 · 第 ${s.ci + 1} / ${s.nCuts} 刀`
          : `Looping · Cut ${s.ci + 1} / ${s.nCuts}`;
      timeStr = formatRightTime(s.curSec, s.totSec, s.totalFrames);
    } else if (s.kind === "paused") {
      statusStr = isHant
        ? `已暫停 · 第 ${s.ci + 1} / ${s.nCuts} 刀`
        : isZh
          ? `已暂停 · 第 ${s.ci + 1} / ${s.nCuts} 刀`
          : `Paused · Cut ${s.ci + 1} / ${s.nCuts}`;
      timeStr = formatRightTime(s.curSec, s.totSec, s.totalFrames);
    } else if (s.kind === "exporting") {
      barMode = "exporting";
      const p = Math.round(s.pct);
      statusStr = isHant ? `正在匯出 ${p}%` : isZh ? `正在导出 ${p}%` : `Exporting ${p}%`;
      timeStr = `${p}%`;
    } else if (s.kind === "exported") {
      statusStr = isHant ? "匯出完成" : isZh ? "导出完成" : "Export complete";
      timeStr = "100%";
    } else if (s.kind === "exportFailed") {
      statusStr = isHant ? "匯出失敗" : isZh ? "导出失败" : "Export failed";
      timeStr = "";
    }
    setTimelineUi(s.pct, statusStr, timeStr, barMode);
  }

  function showError(keyOrEmpty) {
    activeErrorKey = keyOrEmpty || "";
    if (!errorEl) return;
    if (!activeErrorKey) {
      errorEl.hidden = true;
      errorEl.textContent = "";
      return;
    }
    const entry = ERROR_MESSAGES[activeErrorKey];
    const msg = entry ? (entry[uiLang] || entry.en) : activeErrorKey;
    errorEl.hidden = false;
    errorEl.textContent = msg;
  }

  function ensureSharedAc() {
    if (!sharedAc) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) sharedAc = new Ctx();
    }
    if (sharedAc && !previewMasterGain) {
      previewMasterGain = createAudioChain(sharedAc, sharedAc.destination).master;
    }
    return sharedAc;
  }

  function unlockPreviewAudio() {
    audioUnlocked = true;
    setTimeout(() => {
      try {
        const ac = ensureSharedAc();
        if (ac && ac.state === "suspended") {
          ac.resume().catch(() => {});
        }
      } catch {}
    }, 0);
  }

  async function auditionSfx(sound) {
    unlockPreviewAudio();
    if (!sound || sound === "none") return;
    try {
      const ac = ensureSharedAc();
      if (!ac) return;
      await resumeAudio(ac, 400);
      if (ac.state === "running" && previewMasterGain) {
        triggerSfx(ac, previewMasterGain, sound, ac.currentTime + 0.01, currentCpsPair().cps0);
      }
    } catch (e) { console.warn(e); }
  }

  function updatePlayUi(playing) {
    isPlaying = playing;
    if (playPauseBtn) playPauseBtn.classList.toggle("is-playing", playing);
    if (playPauseLabel) {
      playPauseLabel.textContent = playing
        ? (uiLang === "hant" ? "暫停" : uiLang === "zh" ? "暂停" : "Pause")
        : (uiLang === "hant" || uiLang === "zh" ? "播放" : "Play");
    }
  }

  function copyForLocale() {
    if (!copyPack) return null;
    return copyPack[locale] || copyPack.zh || copyPack;
  }

  function activeKeyword() {
    const raw = kw.value.trim();
    return raw || defaults[locale] || "Open Source";
  }

  function isPresetOrDefaultKeyword(val) {
    const v = String(val || "").trim();
    if (!v) return true;
    if (v === defaults.en || v === defaults.zh || v === defaults.hant || v === "Web Dev") return true;
    return (RANDOM_KEYWORDS.en || []).includes(v)
      || (RANDOM_KEYWORDS.zh || []).includes(v)
      || (RANDOM_KEYWORDS.hant || []).includes(v);
  }

  function currentCpsPair() {
    const c0 = Number($("cpsRange") && $("cpsRange").value) || 12;
    const c1 = speedMode === "ramp"
      ? (Number($("cps2Range") && $("cps2Range").value) || 18)
      : c0;
    return { cps0: c0, cps1: c1 };
  }

  function currentOpts() {
    const { cps0, cps1 } = currentCpsPair();
    return {
      cps0,
      cps1,
      curve,
      duration: Number($("durRange") && $("durRange").value) || 4,
      hold: Boolean($("holdLast") && $("holdLast").checked),
      sound: ($("audioSelect") && $("audioSelect").value) || "paper",
      zoomVariance: (Number($("zoomRange") && $("zoomRange").value) || 15) / 10,
      blurFactor: (Number($("blurRange") && $("blurRange").value) || 10) / 10,
      vignette: $("vignetteCheck") ? $("vignetteCheck").checked : true,
      mime: formatSelect ? formatSelect.value : "",
      hlColor,
      hlStyle,
      seedOffset,
    };
  }

  function buildPreviewKey(opts, keyword, myLoc, fontVal, customVal, mixBg) {
    return [
      myLoc,
      keyword,
      ratio,
      opts.duration,
      opts.cps0,
      opts.cps1,
      opts.curve,
      opts.hold ? 1 : 0,
      opts.zoomVariance,
      opts.blurFactor,
      opts.vignette ? 1 : 0,
      opts.hlColor,
      opts.hlStyle,
      opts.seedOffset,
      fontVal,
      mixBg ? 1 : 0,
      customVal,
    ].join("|");
  }

  function totalDurationSeconds(opts) {
    return Math.max(1, Number(opts.duration) || 4);
  }

  function estimatedTotalFrames(opts) {
    const fps = Math.max(opts.cps0 || 12, opts.cps1 || 12) > 15 ? 60 : FPS;
    return Math.max(1, Math.round(totalDurationSeconds(opts) * fps));
  }

  function updateCharCount() {
    if (kw.value.length > MAX_CHARS) kw.value = kw.value.slice(0, MAX_CHARS);
    const cc = $("charCount");
    if (cc) cc.textContent = `${kw.value.length} / ${MAX_CHARS}`;
  }

  function updateDurUi() {
    const dr = $("durRange");
    const dv = $("durVal");
    if (!dr || !dv) return;
    dv.textContent = (uiLang === "zh" || uiLang === "hant") ? `${dr.value} 秒` : `${dr.value}s`;
  }

  function updateCpsLabelUi() {
    const cl = $("cpsLabel");
    if (!cl) return;
    const isCjkUi = uiLang === "zh" || uiLang === "hant";
    cl.textContent = speedMode === "ramp"
      ? (isCjkUi ? "起始刀速" : "Start CPS")
      : (isCjkUi ? "刀速" : "Cuts / sec");
  }

  function updateGenerateBtnUi() {
    const genBtn = $("generateBtn");
    if (!genBtn) return;
    if (isExporting) {
      const p = Math.round(exportPct);
      genBtn.textContent = uiLang === "hant"
        ? `匯出中 ${p}%`
        : uiLang === "zh"
          ? `导出中 ${p}%`
          : `Exporting ${p}%`;
    } else {
      genBtn.textContent = uiLang === "hant"
        ? "匯出影片"
        : uiLang === "zh"
          ? "导出视频"
          : "Export Video";
    }
  }

  function updateDownloadBtnUi() {
    if (!downloadBtn) return;
    const extLabel = (lastExt || "mp4").toUpperCase();
    downloadBtn.textContent = uiLang === "hant"
      ? `下載 ${extLabel}`
      : uiLang === "zh"
        ? `下载 ${extLabel}`
        : `Download ${extLabel}`;
  }

  function updateCustomBadge() {
    const badge = $("customBadge");
    const ct = $("customText");
    if (!badge || !ct) return;
    if (!ct.value.trim()) {
      badge.textContent = "";
      badge.hidden = true;
      return;
    }
    const n = customHighlightSents(ct.value, kw.value.trim(), locale).length;
    if (n > 0) {
      badge.textContent = (uiLang === "zh" || uiLang === "hant")
        ? `命中 ${n} 句`
        : (n === 1 ? "1 match" : `${n} matches`);
      badge.hidden = false;
    } else {
      badge.textContent = "";
      badge.hidden = true;
    }
  }

  function fillFonts() {
    if (!fontSelect) return;
    const keep = fontSelect.value;
    fontSelect.innerHTML = "";
    const add = (value, label) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      fontSelect.appendChild(opt);
    };
    add("random", uiLang === "hant" ? "按報刊隨機" : uiLang === "zh" ? "按报刊随机" : "Random by Press");
    (FONT_CATALOG[locale] || FONT_CATALOG.en).forEach(f => {
      const fontLabel = uiLang === "en"
        ? (f.enLabel || f.label)
        : uiLang === "zh"
          ? (f.zhLabel || f.label)
          : (f.hantLabel || f.label);
      add(f.id, fontLabel);
    });
    add("custom", uiLang === "hant" ? "自訂字體" : uiLang === "zh" ? "自定义字体" : "Custom Font");
    if ([...fontSelect.options].some(o => o.value === keep)) fontSelect.value = keep;
    else fontSelect.value = "random";
  }

  const AUDIO_LABELS_FALLBACK = {
    paper: { en: "Paper Flip", zh: "翻纸", hant: "翻紙" },
    shutter: { en: "Shutter", zh: "快门", hant: "快門" },
    film: { en: "Film Advance", zh: "过片", hant: "過片" },
    polaroid: { en: "Polaroid", zh: "拍立得", hant: "拍立得" },
    flash: { en: "Flash Pop", zh: "闪光", hant: "閃光" },
    none: { en: "Muted", zh: "无声", hant: "無聲" },
  };

  function pickLangAttr(el, suffix) {
    if (uiLang === "hant") {
      const hv = el.getAttribute(`data-hant-${suffix}`);
      if (hv !== null) return hv;
      return el.getAttribute(`data-zh-${suffix}`);
    }
    if (uiLang === "zh") return el.getAttribute(`data-zh-${suffix}`);
    return el.getAttribute(`data-en-${suffix}`);
  }

  function applyUiLang(nextLang, opts = {}) {
    uiLang = nextLang === "hant" ? "hant" : nextLang === "zh" ? "zh" : "en";
    const { syncClipLocale = false, persist = false } = opts;
    if (persist) {
      try { localStorage.setItem("tmc_ui_lang", uiLang); } catch {}
    }

    const docEl = document.documentElement;
    docEl.lang = uiLang === "hant" ? "zh-Hant" : uiLang === "zh" ? "zh-CN" : "en";
    docEl.dataset.uiLang = uiLang;
    syncDocumentTitle();

    document.querySelectorAll("#uiLangBtns button[data-ui-lang], [data-ui-lang-btn]").forEach(btn => {
      const active = btn.dataset.uiLang === uiLang;
      btn.classList.toggle("on", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.querySelectorAll("[data-en-text], [data-zh-text], [data-hant-text]").forEach(el => {
      const val = pickLangAttr(el, "text");
      if (val === null) return;
      if (el.children.length === 0) {
        el.textContent = val;
      } else {
        const tn = [...el.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim().length > 0);
        if (tn) tn.nodeValue = val;
      }
    });

    document.querySelectorAll("[data-en-tip], [data-zh-tip], [data-hant-tip]").forEach(el => {
      const val = pickLangAttr(el, "tip");
      if (val !== null) el.setAttribute("data-tip", val);
    });

    document.querySelectorAll("[data-en-label], [data-zh-label], [data-hant-label]").forEach(el => {
      const val = pickLangAttr(el, "label");
      if (val !== null) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("[data-en-placeholder], [data-zh-placeholder], [data-hant-placeholder]").forEach(el => {
      const val = pickLangAttr(el, "placeholder");
      if (val !== null) el.setAttribute("placeholder", val);
    });

    if ($("audioSelect")) {
      [...$("audioSelect").options].forEach(opt => {
        if (!opt.hasAttribute("data-en-text") && AUDIO_LABELS_FALLBACK[opt.value]) {
          opt.textContent = AUDIO_LABELS_FALLBACK[opt.value][uiLang] || AUDIO_LABELS_FALLBACK[opt.value].en;
        }
      });
    }

    if (formatSelect && formats.length === 0) {
      formatSelect.innerHTML = uiLang === "hant"
        ? "<option value=''>目前瀏覽器不支援頁內錄製</option>"
        : uiLang === "zh"
          ? "<option value=''>当前浏览器不支持页内录制</option>"
          : "<option value=''>In-browser recording unsupported</option>";
      if (formatBtnLabel) {
        formatBtnLabel.textContent = uiLang === "hant" ? "無" : uiLang === "zh" ? "无" : "N/A";
      }
    }

    if (syncClipLocale) {
      const prevLocale = locale;
      locale = uiLang;
      if (isPresetOrDefaultKeyword(kw.value)) {
        kw.value = defaults[locale];
      }
      document.querySelectorAll("#localeBtns button[data-locale]").forEach(b => {
        b.classList.toggle("on", b.dataset.locale === locale);
      });
      updateCharCount();
      if (prevLocale !== locale && copyPack && !isExporting) {
        handleMotionEdit(false);
      }
    }

    fillFonts();
    updateDurUi();
    updateCpsLabelUi();
    updatePlayUi(isPlaying);
    updateGenerateBtnUi();
    updateDownloadBtnUi();
    updateCustomBadge();
    if (activeErrorKey) showError(activeErrorKey);
    setTimelineState({});
    if (copyPack && lastExampleBakeLang !== uiLang) {
      bakeExampleCanvases();
    }
  }

  function drawPreviewFrameToStage(frameCanvas) {
    if (!stageCanvas || !frameCanvas) return;
    const fullSize = SIZES[ratio] || SIZES["1:1"];
    if (stageCanvas.width !== fullSize.w) stageCanvas.width = fullSize.w;
    if (stageCanvas.height !== fullSize.h) stageCanvas.height = fullSize.h;
    if (stageCanvas.hidden) stageCanvas.hidden = false;
    if (vid && !vid.hidden) vid.hidden = true;
    const sCtx = stageCanvas.getContext("2d");
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = "high";
    sCtx.clearRect(0, 0, fullSize.w, fullSize.h);
    sCtx.drawImage(frameCanvas, 0, 0, fullSize.w, fullSize.h);
  }

  async function renderStaticHero() {
    if (!stageCanvas || isExporting) return;
    const copy = copyForLocale();
    if (!copy) return;
    const myLoc = locale;
    await loadFonts(myLoc);
    if (isPlaying || isExporting) return;

    const opts = currentOpts();
    const keyword = activeKeyword();
    const customVal = $("customText") ? $("customText").value : "";
    const mixBg = Boolean($("mixCustomBg") && $("mixCustomBg").checked);
    const mixed = withCustomCopy(copy, keyword, customVal, mixBg, myLoc);
    const baseSize = SIZES[ratio] || SIZES["1:1"];
    const W = Math.round(baseSize.w * PREVIEW_SCALE);
    const H = Math.round(baseSize.h * PREVIEW_SCALE);

    if (!heroScratch || heroScratch.w !== W || heroScratch.h !== H) {
      if (heroScratch) {
        heroScratch.flat.width = 0; heroScratch.flat.height = 0;
        heroScratch.out.width = 0; heroScratch.out.height = 0;
      }
      const flat = document.createElement("canvas"); flat.width = W; flat.height = H;
      const out = document.createElement("canvas"); out.width = W; out.height = H;
      heroScratch = { w: W, h: H, flat, fCtx: flat.getContext("2d"), out };
    }

    const fontVal = fontSelect ? fontSelect.value : "random";
    const descs = buildDescs(1, keyword, W, H, opts.zoomVariance, mixed, myLoc, fontVal, {
      hlColor: opts.hlColor,
      hlStyle: opts.hlStyle,
      seedOffset: opts.seedOffset,
      seedW: baseSize.w,
    });
    renderBakedFrame(
      descs[0], W, H,
      heroScratch.flat, heroScratch.fCtx,
      opts.blurFactor, opts.vignette,
      heroScratch.out
    );
    drawPreviewFrameToStage(heroScratch.out);

    const totSec = totalDurationSeconds(opts);
    const totFrames = estimatedTotalFrames(opts);
    if (!livePreview) {
      setTimelineState({ kind: "single", pct: 0, totSec, totalFrames: totFrames });
    }
  }

  function scheduleStaticHero(delayMs = 0) {
    if (staticTimerId) clearTimeout(staticTimerId);
    staticTimerId = setTimeout(() => {
      staticTimerId = 0;
      renderStaticHero();
    }, delayMs);
  }

  function stopPreviewPlayback(drawHero) {
    previewToken += 1;
    activeLoopControl = null;
    if (previewRafId) {
      cancelAnimationFrame(previewRafId);
      previewRafId = 0;
    }
    updatePlayUi(false);
    if (drawHero) {
      if (previewCache.baked && previewCache.baked.length && previewCache.sched) {
        const sched = previewCache.sched;
        const fps = sched.fps || FPS;
        const total = sched.totalFrames;
        const lf = Math.min(Math.max(0, Math.floor(pausedRatio * total)), total - 1);
        const ci = sched.cutAt[lf];
        drawPreviewFrameToStage(previewCache.baked[ci]);
        const totSec = total / fps;
        const curSec = pausedRatio * totSec;
        if (livePreview) {
          setTimelineState({
            kind: "paused",
            pct: pausedRatio * 100,
            ci,
            nCuts: sched.nCuts,
            curSec,
            totSec,
            totalFrames: total,
          });
        } else {
          setTimelineState({
            kind: "single",
            pct: 0,
            totSec,
            totalFrames: total,
          });
        }
      } else {
        scheduleStaticHero(0);
      }
    }
  }

  function startContinuousLoop(token, baked, sched, initialRatio) {
    const fullSize = SIZES[ratio] || SIZES["1:1"];
    if (stageCanvas.width !== fullSize.w) stageCanvas.width = fullSize.w;
    if (stageCanvas.height !== fullSize.h) stageCanvas.height = fullSize.h;
    if (stageCanvas.hidden) stageCanvas.hidden = false;
    if (vid && !vid.hidden) vid.hidden = true;

    const sCtx = stageCanvas.getContext("2d");
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = "high";

    const fps = sched.fps || FPS;
    const fi = 1000 / fps;
    const total = Math.max(1, sched.totalFrames);
    const loopMs = total * fi;
    const totSec = total / fps;
    const startOffsetMs = Math.max(0, Math.min(0.999, Number(initialRatio) || 0)) * loopMs;
    let originNow = performance.now() - startOffsetMs;
    let lastCut = -1;
    let lastCycle = -1;

    activeLoopControl = {
      seek(r) {
        const clamped = Math.max(0, Math.min(0.999, r));
        originNow = performance.now() - clamped * loopMs;
        lastCut = -1;
      },
    };

    updatePlayUi(true);

    const step = now => {
      if (token !== previewToken || isExporting) return;
      const rawElapsed = Math.max(0, now - originNow);
      const cycle = Math.floor(rawElapsed / loopMs);
      const el = rawElapsed - cycle * loopMs;
      const ratioNow = el / loopMs;
      pausedRatio = ratioNow;

      if (cycle !== lastCycle) {
        lastCycle = cycle;
        stageCanvas.dataset.loopCycle = String(cycle);
        lastCut = -1;
      }

      const lf = Math.min(Math.max(0, (el / fi) | 0), total - 1);
      const ci = sched.cutAt[lf];
      if (ci !== lastCut) {
        lastCut = ci;
        sCtx.drawImage(baked[ci], 0, 0, fullSize.w, fullSize.h);
        if (audioUnlocked && sharedAc && sharedAc.state === "running" && previewMasterGain) {
          const curSound = ($("audioSelect") && $("audioSelect").value) || "none";
          if (curSound !== "none") {
            const cps = sched.cpsAtCut ? sched.cpsAtCut[ci] : currentCpsPair().cps0;
            triggerSfx(sharedAc, previewMasterGain, curSound, sharedAc.currentTime + 0.006, cps);
          }
        }
      }

      const curSec = lf / fps;
      setTimelineState({
        kind: "playing",
        pct: ratioNow * 100,
        ci,
        nCuts: sched.nCuts,
        curSec,
        totSec,
        totalFrames: total,
      });

      previewRafId = requestAnimationFrame(step);
    };

    previewRafId = requestAnimationFrame(step);
  }

  async function startPreviewPass(playOpts) {
    if (!stageCanvas || isExporting) return;
    const copy = copyForLocale();
    if (!copy) return;

    if (playOpts && playOpts.fromUserGesture) unlockPreviewAudio();

    stopPreviewPlayback(false);
    const token = ++previewToken;
    const opts = currentOpts();
    const keyword = activeKeyword();
    const myLoc = locale;
    const customVal = $("customText") ? $("customText").value : "";
    const mixBg = Boolean($("mixCustomBg") && $("mixCustomBg").checked);
    const fontVal = fontSelect ? fontSelect.value : "random";
    const key = buildPreviewKey(opts, keyword, myLoc, fontVal, customVal, mixBg);

    if (previewCache.key === key && previewCache.baked && previewCache.sched) {
      const startAt = playOpts && playOpts.resume ? pausedRatio : 0;
      startContinuousLoop(token, previewCache.baked, previewCache.sched, startAt);
      return;
    }

    pausedRatio = 0;
    const estCuts = Math.max(1, Math.min(360, Math.round(opts.duration * ((opts.cps0 + opts.cps1) / 2))));
    setTimelineState({ kind: "baking", pct: 2, done: 0, total: estCuts });

    const mixed = withCustomCopy(copy, keyword, customVal, mixBg, myLoc);
    const res = await bakeFrames(
      keyword,
      ratio,
      Object.assign({}, opts, {
        renderScale: PREVIEW_SCALE,
        cooperative: true,
        shouldAbort: () => token !== previewToken || isExporting,
      }),
      (done, total, _phase, frame) => {
        if (token !== previewToken || isExporting) return;
        if (done === 1 && frame) drawPreviewFrameToStage(frame);
        const pct = (done / Math.max(1, total)) * 100;
        setTimelineState({ kind: "baking", pct, done, total });
      },
      mixed,
      myLoc,
      fontVal
    );

    if (res.aborted || token !== previewToken || isExporting) return;

    if (previewCache.baked && previewCache.baked !== res.baked) {
      releaseCanvases(previewCache.baked);
    }
    previewCache.key = key;
    previewCache.baked = res.baked;
    previewCache.sched = res.sched;
    previewCache.ratio = ratio;

    startContinuousLoop(token, res.baked, res.sched, 0);
  }

  function handleMotionEdit(fromUserAudioGesture, delayMs = 150) {
    clearTimeout(inputDebounceTimer);
    if (fromUserAudioGesture) unlockPreviewAudio();
    stopPreviewPlayback(false);
    scheduleStaticHero(0);
    if (!livePreview || inLegalView) return;
    inputDebounceTimer = setTimeout(() => {
      if (livePreview && !isExporting && !inLegalView) {
        startPreviewPass({ fromUserGesture: false, resume: false });
      }
    }, delayMs);
  }

  function handleTextEdit() {
    clearTimeout(inputDebounceTimer);
    stopPreviewPlayback(false);
    scheduleStaticHero(55);
    if (!livePreview || inLegalView) return;
    inputDebounceTimer = setTimeout(() => {
      if (livePreview && !isExporting && !inLegalView && kw.value.trim()) {
        startPreviewPass({ fromUserGesture: false, resume: false });
      }
    }, 240);
  }

  updateCharCount();
  kw.addEventListener("compositionstart", () => { kwComposing = true; });
  kw.addEventListener("compositionend", () => {
    kwComposing = false;
    showError("");
    updateCharCount();
    updateCustomBadge();
    handleTextEdit();
  });
  kw.addEventListener("input", () => {
    showError("");
    updateCharCount();
    if (kwComposing) return;
    updateCustomBadge();
    handleTextEdit();
  });

  if ($("clearKwBtn")) {
    $("clearKwBtn").addEventListener("click", () => {
      clearTimeout(inputDebounceTimer);
      kw.value = "";
      showError("");
      updateCharCount();
      updateCustomBadge();
      stopPreviewPlayback(false);
      scheduleStaticHero(0);
      const opts = currentOpts();
      setTimelineState({
        kind: "empty",
        pct: 0,
        totSec: totalDurationSeconds(opts),
        totalFrames: estimatedTotalFrames(opts),
      });
      kw.focus();
    });
  }

  if ($("randomKwBtn")) {
    $("randomKwBtn").addEventListener("click", () => {
      const pool = RANDOM_KEYWORDS[locale] || RANDOM_KEYWORDS.en;
      const choices = pool.filter(w => w !== kw.value.trim());
      kw.value = choices[Math.floor(Math.random() * choices.length)] || pool[0];
      seedOffset += 1;
      showError("");
      updateCharCount();
      updateCustomBadge();
      handleMotionEdit(true);
    });
  }

  if ($("ratios")) {
    $("ratios").addEventListener("click", e => {
      const btn = e.target.closest("button[data-ratio]");
      if (!btn || btn.dataset.ratio === ratio) return;
      applyRatioSelection(btn.dataset.ratio);
      handleMotionEdit(false);
    });
  }

  if ($("localeBtns")) {
    $("localeBtns").addEventListener("click", e => {
      const btn = e.target.closest("button[data-locale]");
      if (!btn || btn.dataset.locale === locale) return;
      const next = normalizeLocale(btn.dataset.locale);
      if (isPresetOrDefaultKeyword(kw.value)) kw.value = defaults[next];
      locale = next;
      document.querySelectorAll("#localeBtns button").forEach(b => b.classList.toggle("on", b === btn));
      updateCharCount();
      fillFonts();
      updateCustomBadge();
      handleMotionEdit(false);
    });
  }

  if ($("hlColors")) {
    $("hlColors").addEventListener("click", e => {
      const btn = e.target.closest("button[data-hl]");
      if (!btn || btn.dataset.hl === hlColor) return;
      hlColor = btn.dataset.hl;
      document.querySelectorAll("#hlColors button").forEach(b => b.classList.toggle("on", b === btn));
      handleMotionEdit(false, 140);
    });
  }

  if ($("hlStyleBtns")) {
    $("hlStyleBtns").addEventListener("click", e => {
      const btn = e.target.closest("button[data-hl-style]");
      if (!btn || btn.dataset.hlStyle === hlStyle) return;
      hlStyle = btn.dataset.hlStyle;
      document.querySelectorAll("#hlStyleBtns button").forEach(b => b.classList.toggle("on", b === btn));
      handleMotionEdit(false, 140);
    });
  }

  if ($("moreToggle") && $("morePanel")) {
    $("moreToggle").addEventListener("click", () => {
      const open = $("morePanel").hidden;
      $("morePanel").hidden = !open;
      $("moreToggle").setAttribute("aria-expanded", open ? "true" : "false");
      $("moreToggle").classList.toggle("on", open);
    });
  }

  if ($("speedModeBtns")) {
    $("speedModeBtns").addEventListener("click", e => {
      const btn = e.target.closest("button[data-speed-mode]");
      if (!btn || btn.dataset.speedMode === speedMode) return;
      speedMode = btn.dataset.speedMode;
      document.querySelectorAll("#speedModeBtns button").forEach(b => b.classList.toggle("on", b === btn));
      if ($("rampGroup")) $("rampGroup").hidden = speedMode !== "ramp";
      updateCpsLabelUi();
      handleMotionEdit(false);
    });
  }

  if ($("durRange")) {
    $("durRange").addEventListener("input", () => {
      updateDurUi();
      handleMotionEdit(false, 200);
    });
  }

  if ($("cpsRange")) {
    $("cpsRange").addEventListener("input", () => {
      if ($("cpsVal")) $("cpsVal").textContent = $("cpsRange").value;
      handleMotionEdit(false, 200);
    });
  }

  if ($("cps2Range")) {
    $("cps2Range").addEventListener("input", () => {
      if ($("cps2Val")) $("cps2Val").textContent = $("cps2Range").value;
      handleMotionEdit(false, 200);
    });
  }

  if ($("curveBtns")) {
    $("curveBtns").addEventListener("click", e => {
      const btn = e.target.closest("button[data-curve]");
      if (!btn || btn.dataset.curve === curve) return;
      curve = btn.dataset.curve;
      document.querySelectorAll("#curveBtns button").forEach(b => b.classList.toggle("on", b === btn));
      handleMotionEdit(false);
    });
  }

  if ($("audioSelect")) {
    $("audioSelect").addEventListener("change", () => {
      const v = $("audioSelect").value;
      if (v !== "none") auditionSfx(v);
    });
  }

  if ($("holdLast")) {
    $("holdLast").addEventListener("change", () => handleMotionEdit(false));
  }

  if (fontSelect) {
    fontSelect.addEventListener("change", () => handleMotionEdit(false));
  }

  if ($("fontFileBtn") && $("fontFile")) {
    $("fontFileBtn").addEventListener("click", () => $("fontFile").click());
    $("fontFile").addEventListener("change", async () => {
      const file = $("fontFile").files && $("fontFile").files[0];
      if (!file) return;
      showError("");
      try {
        const buf = await file.arrayBuffer();
        const face = new FontFace(CUSTOM_FAMILY, buf);
        await face.load();
        document.fonts.add(face);
        if (fontSelect) fontSelect.value = "custom";
        previewCache.key = "";
        handleMotionEdit(false);
      } catch (err) {
        showError("fontRead");
        console.error(err);
      }
    });
  }

  if ($("zoomRange")) {
    $("zoomRange").addEventListener("input", () => {
      if ($("zoomVal")) $("zoomVal").textContent = (Number($("zoomRange").value) / 10).toFixed(1) + "×";
      handleMotionEdit(false, 180);
    });
  }

  if ($("blurRange")) {
    $("blurRange").addEventListener("input", () => {
      if ($("blurVal")) $("blurVal").textContent = (Number($("blurRange").value) / 10).toFixed(1) + "×";
      handleMotionEdit(false, 180);
    });
  }

  if ($("vignetteCheck")) {
    $("vignetteCheck").addEventListener("change", () => {
      handleMotionEdit(false, 120);
    });
  }

  if ($("customText")) {
    $("customText").addEventListener("compositionstart", () => { ctComposing = true; });
    $("customText").addEventListener("compositionend", () => {
      ctComposing = false;
      updateCustomBadge();
      handleTextEdit();
    });
    $("customText").addEventListener("input", () => {
      if (ctComposing) return;
      updateCustomBadge();
      handleTextEdit();
    });
  }

  if ($("mixCustomBg")) {
    $("mixCustomBg").addEventListener("change", () => handleMotionEdit(false));
  }

  const togglePlay = () => {
    if (isExporting) return;
    if (isPlaying) stopPreviewPlayback(true);
    else startPreviewPass({ fromUserGesture: true, resume: true });
  };
  if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
  if (stageCanvas) stageCanvas.addEventListener("click", togglePlay);

  if (stageProgressTrack) {
    stageProgressTrack.addEventListener("click", e => {
      if (isExporting) return;
      const rect = stageProgressTrack.getBoundingClientRect();
      if (!rect.width) return;
      const r = Math.max(0, Math.min(0.999, (e.clientX - rect.left) / rect.width));
      pausedRatio = r;
      if (isPlaying && activeLoopControl) {
        activeLoopControl.seek(r);
      } else if (previewCache.baked && previewCache.baked.length && previewCache.sched) {
        const sched = previewCache.sched;
        const fps = sched.fps || FPS;
        const total = sched.totalFrames;
        const lf = Math.min(Math.max(0, Math.floor(r * total)), total - 1);
        const ci = sched.cutAt[lf];
        drawPreviewFrameToStage(previewCache.baked[ci]);
        const totSec = total / fps;
        setTimelineState({
          kind: "paused",
          pct: r * 100,
          ci,
          nCuts: sched.nCuts,
          curSec: r * totSec,
          totSec,
          totalFrames: total,
        });
      }
    });
  }

  if (livePreviewToggle) {
    livePreviewToggle.addEventListener("click", () => {
      livePreview = !livePreview;
      livePreviewToggle.classList.toggle("on", livePreview);
      livePreviewToggle.setAttribute("aria-pressed", livePreview ? "true" : "false");
      clearTimeout(inputDebounceTimer);
      if (!livePreview) {
        pausedRatio = 0;
        stopPreviewPlayback(true);
      } else {
        startPreviewPass({ fromUserGesture: false, resume: true });
      }
    });
  }

  if ($("rerollBtn")) {
    $("rerollBtn").addEventListener("click", () => {
      seedOffset += 1;
      handleMotionEdit(true, 90);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async e => {
      if (!lastBlob) return;
      const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
      if (!/Mobi|Android|iPhone|iPad|BiliApp/i.test(ua)) return;
      if (typeof navigator.share !== "function" || typeof File === "undefined") return;
      try {
        const mime = lastBlob.type || (lastExt === "mp4" ? "video/mp4" : "video/webm");
        const file = new File([lastBlob], `text-match-cut.${lastExt}`, { type: mime });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          e.preventDefault();
          await navigator.share({ files: [file], title: activeKeyword() });
        }
      } catch (err) {
        if (err && err.name !== "AbortError") console.warn(err);
      }
    });
  }

  function closeFormatMenu() {
    if (!formatMenu || formatMenu.hidden) return;
    formatMenu.hidden = true;
    if (formatBtn) formatBtn.setAttribute("aria-expanded", "false");
  }

  function shortFormatBadge(f) {
    if (!f) return "MP4";
    return f.ext === "mp4" ? "MP4" : "WebM";
  }

  if (formatSelect) {
    if (formats.length === 0) {
      formatSelect.innerHTML = uiLang === "hant"
        ? "<option value=''>目前瀏覽器不支援頁內錄製</option>"
        : uiLang === "zh"
          ? "<option value=''>当前浏览器不支持页内录制</option>"
          : "<option value=''>In-browser recording unsupported</option>";
      formatSelect.disabled = true;
      if (formatBtn) formatBtn.disabled = true;
      if (formatBtnLabel) {
        formatBtnLabel.textContent = uiLang === "hant" ? "無" : uiLang === "zh" ? "无" : "N/A";
      }
    } else {
      formats.forEach((f, idx) => {
        const opt = document.createElement("option");
        opt.value = f.mime;
        opt.dataset.ext = f.ext;
        opt.textContent = f.label;
        formatSelect.appendChild(opt);

        if (formatMenu) {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "fmt-opt" + (idx === 0 ? " on" : "");
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", idx === 0 ? "true" : "false");
          item.dataset.mime = f.mime;
          item.dataset.short = shortFormatBadge(f);

          const textSpan = document.createElement("span");
          textSpan.textContent = f.label;
          const checkSpan = document.createElement("span");
          checkSpan.className = "ico fmt-check";
          checkSpan.setAttribute("aria-hidden", "true");
          checkSpan.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 8.3l3.1 3.1 6.5-6.8"/></svg>';

          item.appendChild(textSpan);
          item.appendChild(checkSpan);
          item.addEventListener("click", () => {
            formatSelect.value = f.mime;
            if (formatBtnLabel) formatBtnLabel.textContent = shortFormatBadge(f);
            formatMenu.querySelectorAll(".fmt-opt").forEach(b => {
              const active = b === item;
              b.classList.toggle("on", active);
              b.setAttribute("aria-selected", active ? "true" : "false");
            });
            closeFormatMenu();
          });
          formatMenu.appendChild(item);
        }
      });
      if (formatBtnLabel) formatBtnLabel.textContent = shortFormatBadge(formats[0]);
    }
  }

  function scrollToStudio(focusInput) {
    const studioEl = $("studio") || document.querySelector(".studio-grid, .panel");
    if (studioEl && typeof studioEl.scrollIntoView === "function") {
      studioEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (focusInput && kw) {
      setTimeout(() => {
        try {
          kw.focus({ preventScroll: true });
          kw.select();
        } catch {
          kw.focus();
        }
      }, 150);
    }
  }

  function syncRatioButtonsUi() {
    document.querySelectorAll("#ratios button[data-ratio]").forEach(b => {
      b.classList.toggle("on", b.dataset.ratio === ratio);
    });
    document.querySelectorAll("[data-use-ratio]").forEach(b => {
      const active = b.dataset.useRatio === ratio;
      b.classList.toggle("is-active", active);
      b.classList.toggle("on", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyRatioSelection(nextRatio) {
    if (!nextRatio || !SIZES[nextRatio]) return;
    ratio = nextRatio;
    syncRatioButtonsUi();
  }

  function setActiveLegalToc(activeId) {
    const rail = document.querySelector("#legalView .toc-rail, .toc-rail");
    if (!rail) return;
    rail.querySelectorAll("a").forEach(link => {
      const target = link.getAttribute("data-toc-link") || (link.getAttribute("href") || "").replace(/^#/, "");
      const active = Boolean(activeId) && target === activeId;
      link.classList.toggle("is-active", active);
      link.classList.toggle("on", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function ensureLegalTocObserver() {
    if (legalTocBound) return;
    const rail = document.querySelector("#legalView .toc-rail, .toc-rail");
    if (!rail) return;
    const secIds = ["placeholders", "privacy", "terms", "cookies", "disclaimer"];
    const sections = secIds.map(id => $(id)).filter(Boolean);
    if (!sections.length) return;
    legalTocBound = true;

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(entries => {
        if (!inLegalView || performance.now() < tocLockUntil) return;
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            setActiveLegalToc(entries[i].target.id);
            break;
          }
        }
      }, { rootMargin: "-16% 0px -68% 0px", threshold: 0 });
      sections.forEach(sec => obs.observe(sec));
    }

    let scrollTicking = false;
    window.addEventListener("scroll", () => {
      if (!inLegalView || scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        if (!inLegalView || performance.now() < tocLockUntil) return;
        let activeId = sections[0].id;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].getBoundingClientRect().top <= 136) activeId = sections[i].id;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
          activeId = sections[sections.length - 1].id;
        }
        setActiveLegalToc(activeId);
      });
    }, { passive: true });
  }

  function syncRouteFromHash({ smooth = false } = {}) {
    const rawHash = window.location.hash || "";
    const hash = rawHash.toLowerCase();
    const mainView = $("mainView");
    const legalView = $("legalView");
    const legalBackBtn = $("legalBackBtn");
    const navLegalLink = $("navLegalLink");

    if (LEGAL_HASHES.has(hash) && legalView) {
      const enteringLegal = !inLegalView;
      inLegalView = true;
      if (enteringLegal) {
        wasPlayingBeforeLegal = isPlaying;
        clearTimeout(inputDebounceTimer);
        if (isPlaying) stopPreviewPlayback(true);
        else previewToken += 1;
      }
      if (mainView) mainView.hidden = true;
      legalView.hidden = false;
      if (legalBackBtn) legalBackBtn.hidden = false;
      if (navLegalLink) navLegalLink.classList.add("on");
      syncDocumentTitle();
      ensureLegalTocObserver();
      stopExampleLoop();
      stopCtaWordCycle();

      const behavior = smooth && !enteringLegal ? "smooth" : "auto";
      if (hash === "#legal") {
        window.scrollTo({ top: 0, behavior });
        const firstToc = $("placeholders") || $("privacy");
        if (firstToc) {
          tocLockUntil = performance.now() + 120;
          setActiveLegalToc(firstToc.id);
        }
      } else {
        const targetEl = $(hash.slice(1));
        if (targetEl) {
          tocLockUntil = performance.now() + (behavior === "smooth" ? 480 : 120);
          setActiveLegalToc(targetEl.id);
          targetEl.scrollIntoView({ behavior, block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior });
        }
      }
      return;
    }

    const wasLegal = inLegalView || Boolean(legalView && !legalView.hidden);
    inLegalView = false;
    if (wasLegal) {
      if (legalView) legalView.hidden = true;
      if (mainView) mainView.hidden = false;
      if (legalBackBtn) legalBackBtn.hidden = true;
      if (navLegalLink) navLegalLink.classList.remove("on");
      syncDocumentTitle();
      window.scrollTo({ top: 0, behavior: "auto" });
      const shouldResume = livePreview || wasPlayingBeforeLegal;
      wasPlayingBeforeLegal = false;
      if (shouldResume && copyPack && !isExporting) {
        startPreviewPass({ fromUserGesture: false, resume: true });
      } else if (copyPack && !isExporting) {
        scheduleStaticHero(0);
      }
      syncExampleLoopState();
      syncCtaWordCycleState();
    } else {
      if (legalBackBtn) legalBackBtn.hidden = true;
      if (navLegalLink) navLegalLink.classList.remove("on");
    }

    if (rawHash && rawHash.length > 1) {
      let targetEl = null;
      try { targetEl = $(decodeURIComponent(rawHash.slice(1))); } catch { targetEl = $(rawHash.slice(1)); }
      if (targetEl && (!mainView || mainView.contains(targetEl))) {
        targetEl.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      }
    }
  }

  function drawExampleCut(card, cutIdx) {
    const frame = card && card.frames && card.frames[cutIdx];
    if (!frame || !card.canvas) return;
    if (card.canvas.width !== 560) card.canvas.width = 560;
    if (card.canvas.height !== 350) card.canvas.height = 350;
    if (!card.ctx) card.ctx = card.canvas.getContext("2d");
    if (!card.ctx) return;
    card.ctx.clearRect(0, 0, 560, 350);
    card.ctx.drawImage(frame, 0, 0, 560, 350);
  }

  function stopExampleLoop() {
    if (exRafId) {
      cancelAnimationFrame(exRafId);
      exRafId = 0;
    }
  }

  function syncExampleLoopState() {
    const mainHidden = Boolean($("mainView") && $("mainView").hidden);
    const activeIdx = hoveredExampleIdx;
    const activeCard = activeIdx >= 0 ? exampleCards[activeIdx] : null;
    const hasAnim = Boolean(activeCard && activeCard.frames && activeCard.frames.length > 1);
    const shouldRun = activeIdx >= 0 && examplesInView && !mainHidden && !inLegalView && !isExporting && !document.hidden && hasAnim;
    if (!shouldRun) {
      stopExampleLoop();
      return;
    }
    if (exRafId) return;
    exLoopOrigin = performance.now();
    exHoverStartCut = (activeCard.lastCut + 1) % activeCard.frames.length;
    const stepExamples = now => {
      const idx = hoveredExampleIdx;
      const card = idx >= 0 ? exampleCards[idx] : null;
      if (
        idx < 0 ||
        !card ||
        !card.frames ||
        card.frames.length < 2 ||
        !examplesInView ||
        ($("mainView") && $("mainView").hidden) ||
        inLegalView ||
        isExporting ||
        document.hidden
      ) {
        exRafId = 0;
        return;
      }
      const elapsedSec = Math.max(0, (now - exLoopOrigin) / 1000);
      const len = card.frames.length;
      let cutSeq = 0;
      if (card.mode === "ramp") {
        const loopDur = 3.2;
        const cyc = Math.floor(elapsedSec / loopDur);
        const u = (elapsedSec - cyc * loopDur) / loopDur;
        const perCycle = Math.max(1, Math.round(loopDur * 0.5 * (card.cps0 + card.cps1)));
        const inCycle = Math.min(perCycle - 1, Math.floor(loopDur * (card.cps0 * u + 0.5 * (card.cps1 - card.cps0) * u * u)));
        cutSeq = cyc * perCycle + inCycle;
      } else {
        cutSeq = Math.floor(elapsedSec * card.cps0);
      }
      const cutIdx = (((exHoverStartCut + cutSeq) % len) + len) % len;
      if (cutIdx !== card.lastCut) {
        card.lastCut = cutIdx;
        drawExampleCut(card, cutIdx);
        const nextStep = (Number(card.canvas.dataset.animStep) || 0) + 1;
        card.canvas.dataset.animStep = String(nextStep);
      }
      exRafId = requestAnimationFrame(stepExamples);
    };
    exRafId = requestAnimationFrame(stepExamples);
  }

  async function bakeExampleCanvases() {
    const canvases = [...document.querySelectorAll("canvas[data-example-canvas]")];
    if (!canvases.length || !copyPack) return;
    const myToken = ++exBakeToken;
    const bakeLang = uiLang === "hant" ? "hant" : uiLang === "zh" ? "zh" : "en";
    lastExampleBakeLang = bakeLang;
    await loadFonts(bakeLang);
    if (myToken !== exBakeToken) return;

    stopExampleLoop();
    exampleCards.forEach(c => releaseCanvases(c.frames));

    const nCuts = 10;
    const exW = 560;
    const exH = 350;
    const copyData = copyPack[bakeLang] || copyPack.zh || copyPack.en;
    const nextCards = canvases.map((canvas, idx) => {
      canvas.dataset.baked = "0";
      canvas.dataset.animStep = "0";
      const kwText = (bakeLang === "hant"
        ? (canvas.dataset.exHant || canvas.dataset.exZh)
        : bakeLang === "zh"
          ? canvas.dataset.exZh
          : canvas.dataset.exEn)
        || canvas.dataset.exEn
        || defaults[bakeLang];
      const cardHl = canvas.dataset.exHl || "#ffe72e";
      const cardStyle = canvas.dataset.exStyle === "box" ? "box" : "marker";
      const mode = canvas.dataset.exMode === "ramp" ? "ramp" : "const";
      const cps0 = Math.max(2, Number(canvas.dataset.exCps) || 10);
      const cps1 = mode === "ramp" ? Math.max(2, Number(canvas.dataset.exCps2) || 22) : cps0;
      const descs = buildDescs(nCuts, kwText, exW, exH, 1.45, copyData, bakeLang, "random", {
        hlColor: cardHl,
        hlStyle: cardStyle,
        seedOffset: idx * 7 + 3,
        seedW: 960,
      });
      return { canvas, ctx: canvas.getContext("2d"), mode, cps0, cps1, descs, frames: [], lastCut: 0 };
    });
    exampleCards = nextCards;

    const exFlat = document.createElement("canvas");
    exFlat.width = exW;
    exFlat.height = exH;
    const exFCtx = exFlat.getContext("2d");

    for (let ci = 0; ci < nCuts; ci++) {
      for (let idx = 0; idx < nextCards.length; idx++) {
        if (myToken !== exBakeToken) {
          exFlat.width = 0; exFlat.height = 0;
          nextCards.forEach(c => releaseCanvases(c.frames));
          return;
        }
        const card = nextCards[idx];
        const frame = renderBakedFrame(card.descs[ci], exW, exH, exFlat, exFCtx, 0.9, true);
        card.frames.push(frame);
        if (ci === 0) {
          card.lastCut = 0;
          drawExampleCut(card, 0);
          card.canvas.dataset.animStep = "0";
        }
        if (ci === nCuts - 1) {
          card.canvas.dataset.baked = "1";
          card.canvas.dataset.bakedCuts = String(card.frames.length);
        }
        await new Promise(r => setTimeout(r, 0));
      }
      if (ci === 1 && hoveredExampleIdx >= 0) syncExampleLoopState();
    }
    exFlat.width = 0;
    exFlat.height = 0;
    syncExampleLoopState();
  }

  function initExampleObserver() {
    let lastTouchTs = 0;
    const canvases = [...document.querySelectorAll("canvas[data-example-canvas]")];
    canvases.forEach((c, idx) => {
      c.style.cursor = "pointer";
      const cardEl = c.closest(".example-card") || c;
      cardEl.addEventListener("pointerdown", e => {
        if (e && e.pointerType === "touch") lastTouchTs = performance.now();
      }, { passive: true });
      const onEnter = e => {
        if (e && e.pointerType === "touch") return;
        if (e && e.type === "mouseenter" && performance.now() - lastTouchTs < 800) return;
        if (hoveredExampleIdx === idx) return;
        stopExampleLoop();
        hoveredExampleIdx = idx;
        syncExampleLoopState();
      };
      const onLeave = e => {
        if (e && e.pointerType === "touch") return;
        if (hoveredExampleIdx !== idx) return;
        hoveredExampleIdx = -1;
        stopExampleLoop();
      };
      cardEl.addEventListener("pointerenter", onEnter);
      cardEl.addEventListener("mouseenter", onEnter);
      cardEl.addEventListener("pointerleave", onLeave);
      cardEl.addEventListener("mouseleave", onLeave);
      cardEl.addEventListener("focusin", e => {
        if (e.target && typeof e.target.matches === "function" && e.target.matches(":focus-visible")) {
          if (hoveredExampleIdx !== idx) {
            stopExampleLoop();
            hoveredExampleIdx = idx;
            syncExampleLoopState();
          }
        }
      });
      cardEl.addEventListener("focusout", e => {
        if (!cardEl.contains(e.relatedTarget) && !cardEl.matches(":hover")) {
          if (hoveredExampleIdx === idx) {
            hoveredExampleIdx = -1;
            stopExampleLoop();
          }
        }
      });
    });
    const exSec = $("examples");
    if (!exSec) return;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(entries => {
        examplesInView = entries.some(en => en.isIntersecting);
        if (!examplesInView) {
          hoveredExampleIdx = -1;
          stopExampleLoop();
          return;
        }
        syncExampleLoopState();
      }, { rootMargin: "80px 0px", threshold: 0.02 });
      obs.observe(exSec);
    } else {
      examplesInView = true;
    }
  }

  function initFaqAccordion() {
    document.querySelectorAll("details.faq-item").forEach(details => {
      if (details.open) details.classList.add("is-open");
      const summary = details.querySelector(":scope > summary") || details.querySelector("summary");
      const body = details.querySelector(".faq-body");
      if (!summary || !body) return;
      summary.addEventListener("click", e => {
        e.preventDefault();
        const isOpening = !details.open || details.classList.contains("is-closing");
        if (isOpening) {
          if (details._faqAnim) {
            details._faqAnim.onfinish = null;
            details._faqAnim.cancel();
            details._faqAnim = null;
          }
          details.classList.remove("is-closing");
          details.open = true;
          details.classList.add("is-open");
          const h = body.offsetHeight;
          if (typeof body.animate === "function") {
            body.style.overflow = "hidden";
            const anim = body.animate([
              { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px" },
              { height: h + "px", opacity: 1, paddingTop: "14px", paddingBottom: "18px" },
            ], { duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
            details._faqAnim = anim;
            anim.onfinish = () => {
              body.style.overflow = "";
              details._faqAnim = null;
            };
            anim.oncancel = () => { body.style.overflow = ""; };
          }
        } else {
          const h = Math.max(0, Math.round(body.getBoundingClientRect().height || body.offsetHeight));
          if (details._faqAnim) {
            details._faqAnim.onfinish = null;
            details._faqAnim.cancel();
            details._faqAnim = null;
          }
          details.classList.remove("is-open");
          details.classList.add("is-closing");
          if (typeof body.animate === "function" && h > 0) {
            body.style.overflow = "hidden";
            const anim = body.animate([
              { height: h + "px", opacity: 1, paddingTop: "14px", paddingBottom: "18px" },
              { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px" },
            ], { duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
            details._faqAnim = anim;
            anim.onfinish = () => {
              details.open = false;
              details.classList.remove("is-closing");
              body.style.overflow = "";
              details._faqAnim = null;
            };
            anim.oncancel = () => { body.style.overflow = ""; };
          } else {
            details.open = false;
            details.classList.remove("is-closing");
          }
        }
      });
    });
  }

  function applyCtaWordStep(stepIdx) {
    document.querySelectorAll("[data-cta-word]").forEach(el => {
      const w = el.dataset.ctaWord;
      const key = w === "hant" ? "hant" : w === "zh" ? "zh" : "en";
      const list = CTA_FONTS[key];
      const spec = list[stepIdx % list.length];
      el.style.fontFamily = spec.family;
      el.style.fontStyle = spec.style || "normal";
      el.style.fontWeight = spec.weight || "700";
      el.dataset.fontCutIdx = String(stepIdx);
      const box = el.closest(".cta-match-box");
      if (box) box.style.setProperty("--cta-tilt", CTA_TILTS[stepIdx % CTA_TILTS.length]);
    });
  }

  function stopCtaWordCycle() {
    if (ctaTimerId) {
      clearInterval(ctaTimerId);
      ctaTimerId = 0;
    }
  }

  function syncCtaWordCycleState() {
    const mainHidden = Boolean($("mainView") && $("mainView").hidden);
    const hasWords = document.querySelectorAll("[data-cta-word]").length > 0;
    const shouldRun = finalCtaInView && !mainHidden && !inLegalView && !isExporting && !document.hidden && hasWords;
    if (!shouldRun) {
      stopCtaWordCycle();
      return;
    }
    if (ctaTimerId) return;
    ctaTimerId = setInterval(() => {
      if (!finalCtaInView || ($("mainView") && $("mainView").hidden) || inLegalView || isExporting || document.hidden) {
        stopCtaWordCycle();
        return;
      }
      ctaStepIdx += 1;
      applyCtaWordStep(ctaStepIdx);
    }, 170);
  }

  function initCtaWordCycle() {
    const ctaSec = document.querySelector(".final-cta");
    if (!ctaSec) return;
    applyCtaWordStep(0);
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(entries => {
        finalCtaInView = entries.some(en => en.isIntersecting);
        syncCtaWordCycleState();
      }, { threshold: 0.05 });
      obs.observe(ctaSec);
    } else {
      finalCtaInView = true;
      syncCtaWordCycleState();
    }
  }

  document.addEventListener("click", e => {
    if (formatMenu && !formatMenu.hidden && exportSplit && !exportSplit.contains(e.target)) {
      closeFormatMenu();
    }

    const langBtn = e.target.closest("#uiLangBtns button[data-ui-lang], [data-ui-lang-btn]");
    if (langBtn && langBtn.dataset.uiLang) {
      if (langBtn.dataset.uiLang !== uiLang) {
        applyUiLang(langBtn.dataset.uiLang, { syncClipLocale: true, persist: true });
      }
      return;
    }

    const exCanvas = e.target.closest("canvas[data-example-canvas]");
    if (exCanvas) {
      const cardBtn = exCanvas.closest(".example-card")?.querySelector("[data-try-prompt]");
      if (cardBtn) cardBtn.click();
      return;
    }

    const tryBtn = e.target.closest("[data-try-prompt], [data-try-en], [data-try-zh], [data-try-hant]");
    if (tryBtn && !isExporting) {
      e.preventDefault();
      clearTimeout(inputDebounceTimer);
      showError("");

      const promptStr = locale === "hant"
        ? (tryBtn.dataset.tryHant || tryBtn.dataset.tryZh || tryBtn.dataset.tryPrompt || tryBtn.dataset.tryEn)
        : locale === "zh"
          ? (tryBtn.dataset.tryZh || tryBtn.dataset.tryPrompt || tryBtn.dataset.tryEn)
          : (tryBtn.dataset.tryEn || tryBtn.dataset.tryPrompt || tryBtn.dataset.tryZh);
      if (promptStr) {
        kw.value = promptStr.slice(0, MAX_CHARS);
      }

      if (tryBtn.dataset.tryRatio) {
        applyRatioSelection(tryBtn.dataset.tryRatio);
      }

      if (tryBtn.dataset.tryHl) {
        const targetHl = tryBtn.dataset.tryHl.trim();
        hlColor = targetHl;
        document.querySelectorAll("#hlColors button[data-hl]").forEach(b => {
          const bh = (b.dataset.hl || "").toLowerCase();
          const th = targetHl.toLowerCase();
          const isYellowAlias = (th === "#ffe600" || th === "#ffe72e") && (bh === "#ffe600" || bh === "#ffe72e");
          const match = bh === th || isYellowAlias;
          if (match) hlColor = b.dataset.hl;
          b.classList.toggle("on", match);
        });
      }

      if (tryBtn.dataset.tryStyle === "box" || tryBtn.dataset.tryStyle === "marker") {
        hlStyle = tryBtn.dataset.tryStyle;
        document.querySelectorAll("#hlStyleBtns button[data-hl-style]").forEach(b => {
          b.classList.toggle("on", b.dataset.hlStyle === hlStyle);
        });
      }

      if (tryBtn.dataset.tryMode || tryBtn.dataset.tryCps2 || tryBtn.dataset.tryCps) {
        const nextMode = (tryBtn.dataset.tryMode === "ramp" || (!tryBtn.dataset.tryMode && tryBtn.dataset.tryCps2))
          ? "ramp"
          : "const";
        speedMode = nextMode;
        document.querySelectorAll("#speedModeBtns button[data-speed-mode]").forEach(b => {
          b.classList.toggle("on", b.dataset.speedMode === speedMode);
        });
        if ($("rampGroup")) $("rampGroup").hidden = speedMode !== "ramp";
        updateCpsLabelUi();
      }

      if (tryBtn.dataset.tryCps && $("cpsRange")) {
        $("cpsRange").value = String(tryBtn.dataset.tryCps);
        if ($("cpsVal")) $("cpsVal").textContent = $("cpsRange").value;
      }

      if (tryBtn.dataset.tryCps2 && $("cps2Range")) {
        $("cps2Range").value = String(tryBtn.dataset.tryCps2);
        if ($("cps2Val")) $("cps2Val").textContent = $("cps2Range").value;
      }

      if (tryBtn.dataset.tryCurve) {
        curve = tryBtn.dataset.tryCurve;
        document.querySelectorAll("#curveBtns button[data-curve]").forEach(b => {
          b.classList.toggle("on", b.dataset.curve === curve);
        });
      }

      if (tryBtn.dataset.tryDur && $("durRange")) {
        $("durRange").value = String(tryBtn.dataset.tryDur);
        updateDurUi();
      }

      seedOffset += 1;
      updateCharCount();
      updateCustomBadge();
      scrollToStudio(false);
      startPreviewPass({ fromUserGesture: true, resume: false });
      return;
    }

    const useRatioBtn = e.target.closest("[data-use-ratio]");
    if (useRatioBtn && !isExporting) {
      e.preventDefault();
      clearTimeout(inputDebounceTimer);
      showError("");
      applyRatioSelection(useRatioBtn.dataset.useRatio);
      scrollToStudio(false);
      startPreviewPass({ fromUserGesture: true, resume: false });
      return;
    }

    const scrollBtn = e.target.closest("[data-scroll-studio]");
    if (scrollBtn) {
      e.preventDefault();
      scrollToStudio(true);
      return;
    }

    const hashLink = e.target.closest('a[href^="#"]');
    if (hashLink && !hashLink.hasAttribute("download") && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && (e.button === 0 || e.button == null)) {
      const href = hashLink.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        if (href === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (window.location.hash !== href) {
          try { history.pushState(null, "", href); } catch { window.location.hash = href; }
        }
        syncRouteFromHash({ smooth: true });
      }
    }
  });

  if (formatBtn && formatMenu) {
    formatBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (isExporting || formatBtn.disabled) return;
      const willOpen = formatMenu.hidden;
      formatMenu.hidden = !willOpen;
      formatBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeFormatMenu();
      return;
    }
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const t = e.target;
      const isEditable = t && (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT" ||
        t.isContentEditable
      );
      if (!isEditable && kw && !inLegalView) {
        e.preventDefault();
        scrollToStudio(false);
        kw.focus();
        kw.select();
      }
    }
  });

  syncRatioButtonsUi();
  initFaqAccordion();
  initExampleObserver();
  initCtaWordCycle();
  applyUiLang(uiLang, { syncClipLocale: true, persist: false });
  syncRouteFromHash({ smooth: false });

  window.addEventListener("hashchange", () => syncRouteFromHash({ smooth: false }));
  window.addEventListener("popstate", () => syncRouteFromHash({ smooth: false }));
  document.addEventListener("visibilitychange", () => {
    syncExampleLoopState();
    syncCtaWordCycleState();
  });

  fetch("./copy.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(async j => {
      copyPack = j;
      await renderStaticHero();
      if (livePreview && !isExporting && !inLegalView) {
        startPreviewPass({ fromUserGesture: false, resume: false });
      }
      bakeExampleCanvases();
    })
    .catch(err => {
      showError("copyLoad");
      console.error(err);
    });

  if ($("generateBtn")) {
    $("generateBtn").addEventListener("click", async () => {
      showError("");
      closeFormatMenu();
      const keyword = kw.value.trim();
      if (!keyword) {
        showError("needKeyword");
        kw.focus();
        return;
      }
      const copy = copyForLocale();
      if (!copy) {
        showError("copyPending");
        return;
      }
      if (fontSelect && fontSelect.value === "custom" && ![...document.fonts].some(f => f.family.replace(/["']/g, "") === CUSTOM_FAMILY)) {
        showError("needFont");
        return;
      }
      if (!formatSelect || !formatSelect.value) {
        showError("noRecorder");
        return;
      }

      clearTimeout(inputDebounceTimer);
      stopPreviewPlayback(false);
      isExporting = true;
      exportPct = 0;
      stopExampleLoop();
      stopCtaWordCycle();
      const genBtn = $("generateBtn");
      genBtn.disabled = true;
      if (formatBtn) formatBtn.disabled = true;
      updateGenerateBtnUi();
      setTimelineState({ kind: "exporting", pct: 0 });

      try {
        const opts = currentOpts();
        const customVal = $("customText") ? $("customText").value : "";
        const mixBg = Boolean($("mixCustomBg") && $("mixCustomBg").checked);
        const mixed = withCustomCopy(copy, keyword, customVal, mixBg, locale);
        const fontVal = fontSelect ? fontSelect.value : "random";

        const { blob, ext } = await generate(
          keyword,
          ratio,
          opts,
          (done, total, phase) => {
            const ratioDone = Math.min(1, Math.max(0, done / Math.max(1, total)));
            const pct = phase === "渲染"
              ? Math.round(ratioDone * 45)
              : 45 + Math.round(ratioDone * 55);
            exportPct = pct;
            updateGenerateBtnUi();
            setTimelineState({ kind: "exporting", pct });
          },
          mixed,
          locale,
          fontVal
        );

        if (lastUrl) URL.revokeObjectURL(lastUrl);
        lastUrl = URL.createObjectURL(blob);
        lastBlob = blob;
        lastExt = ext;

        await ensureVideoMetadata(vid, lastUrl);

        if (downloadBtn) {
          downloadBtn.href = lastUrl;
          downloadBtn.download = `text-match-cut.${ext}`;
          updateDownloadBtnUi();
          downloadBtn.hidden = false;
          downloadBtn.style.display = "inline-flex";
        }
        setTimelineState({ kind: "exported", pct: 100 });
      } catch (err) {
        console.error(err);
        showError("exportFail");
        setTimelineState({ kind: "exportFailed", pct: 0 });
      } finally {
        isExporting = false;
        exportPct = 0;
        genBtn.disabled = false;
        updateGenerateBtnUi();
        if (formatBtn && formats.length > 0) formatBtn.disabled = false;
        if (livePreview && !inLegalView) {
          startPreviewPass({ fromUserGesture: false, resume: false });
        } else {
          renderStaticHero();
        }
        syncExampleLoopState();
        syncCtaWordCycleState();
      }
    });
  }
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    hashString,
    prng,
    planCutSchedule,
    customHighlightSents,
    splitSentences,
    hexToRgba,
    withCustomCopy,
    injectKeyword,
    normalizeLocale,
    wrap,
    tokenize,
    measureKeyword,
    buildDescs,
    renderCut,
    lensBlur,
    RANDOM_KEYWORDS,
    FONT_CATALOG,
    FONT_LOAD_SPECS,
    MAST_FAMILY,
    PAPER_KINDS,
  };
}
