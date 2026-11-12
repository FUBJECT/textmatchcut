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
    { id: "finance", kicker: "市场观察", fonts: ["noto-serif", "song", "hei"], mast: "noto-serif", hue: [28, 38], sat: [18, 30], light: [90, 94], fmts: [5, 0, 1], layouts: ["table", "headline", "columns", "wire"] },
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
    { id: "finance", kicker: "市場觀察", fonts: ["noto-serif-tc", "ming", "jhenghei"], mast: "noto-serif-tc", hue: [28, 38], sat: [18, 30], light: [90, 94], fmts: [5, 0, 1], layouts: ["table", "headline", "columns", "wire"] },
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
    { id: "ft_pink", kicker: "COMPANIES & MARKETS", fonts: ["times", "baskerville", "newsreader"], mast: "playfair", hue: [28, 38], sat: [18, 30], light: [90, 94], fmts: [5, 0], layouts: ["table", "columns", "headline", "pullquote"] },
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

// Largest k in [1, n] with fits(k); k = 1 is always taken. Gallops from `hint` (the previous line's length), then
// bisects, so a line costs a few measures instead of one per token.
// shortcut: assumes a longer prefix is never narrower than a shorter one (holds for the fonts here); upgrade if a font kerns narrower.
function fitCount(n, hint, fits) {
  let lo = 1, hi = n + 1, q = Math.min(n, Math.max(2, hint)), up = 1, down = 1;
  while (hi - lo > 1) {
    if (fits(q)) lo = q; else hi = q;
    if (hi - lo <= 1) break;
    if (hi > n) q = Math.min(n, lo + up), up *= 2;
    else if (lo === 1) q = Math.max(2, hi - down), down *= 2;
    else q = (lo + hi) >> 1;
  }
  return lo;
}

// A word's width on its own, per context and font: the same words recur across the paragraphs of one bake.
const wordWidths = new WeakMap();
function wordWidth(ctx, w) {
  let byFont = wordWidths.get(ctx);
  if (!byFont) wordWidths.set(ctx, byFont = new Map());
  const key = `${ctx.font}|${w}`;
  let width = byFont.get(key);
  if (width === undefined) byFont.set(key, width = ctx.measureText(w).width);
  return width;
}

function wrapEn(ctx, text, maxW) {
  const out = [];
  const words = String(text).split(" ");
  let line = "";
  const take = (w) => {
    if (wordWidth(ctx, w) <= maxW) {
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
  let hint = 16;
  for (let s = 0; s < tokens.length;) {
    const k = fitCount(tokens.length - s, hint, k => !(ctx.measureText(tokens.slice(s, s + k).join("")).width > maxW));
    out.push(tokens.slice(s, s + k).join(""));
    s += k;
    hint = k;
  }
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

// One layout descriptor per cut index, built on demand: each depends only on its index, so a cut can be
// baked as soon as it is built instead of after all of them.
function descBuilder(keyword, W, H, zoomLevel, copy, locale, fontId, extras) {
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

  return i => {
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
    const rawBodySize = Math.round(hlSize * rr(r, nCh <= 3 ? 0.48 : 0.38, nCh <= 3 ? 0.58 : 0.44));
    const maxBodySize = Math.max(22, Math.round(colW * (loc === "en" ? 0.074 : 0.086)));
    const bodySize = Math.min(rawBodySize, maxBodySize);
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

    const bgFillW = colW;
    const sideColW = Math.max(
      Math.round(bodySize * (loc === "en" ? 5.6 : 4.2)),
      Math.round((colW || 900) * 0.34)
    );
    mCtx.font = bodySpec;
    const bgPool = safeSents.length >= 16
      ? shuffle(r, safeSents).slice(0, 24)
      : shuffle(r, [...safeSents, ...safeSents, ...safeSents, ...safeSents]);
    const bgJoined = bgPool.join(joinBody);
    const bgLines = wrap(mCtx, bgJoined, bgFillW, kToken, loc);
    const sideLines = wrap(mCtx, bgJoined, sideColW, kToken, loc);

    const hasDeck = fmt === 0 || fmt === 1 || fmt === 5 || fmt === 7;
    const topInk = (layout === "headline" || layout === "photo")
      ? Math.round(hlSize * 1.08)
      : (layout === "columns" || layout === "pullquote" || layout === "body")
        ? Math.round(hlSize * 0.68)
        : (layout === "classified" || layout === "sports" || layout === "weather" || layout === "wire")
          ? Math.round(hlLineH * 0.88)
          : Math.max(Math.round(mhSize * 2.2), Math.round(bodyLineH * 0.95));
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
      const gap = Math.round(colW * 0.03);
      const minColW = bodySize * (loc === "en" ? 5.2 : 4.2);
      const nCols = (r() < 0.35 && Math.round((colW - gap * 2) / 3) >= minColW) ? 3 : 2;
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
      const gap = Math.round(colW * 0.028);
      const minColW = Math.max(bodySize * (loc === "en" ? 5.2 : 4.2), (nCh + 1.5) * bodySize);
      const want3 = kind.id === "wsj" || r() < 0.45;
      const nCols = (want3 && Math.round((colW - gap * 2) / 3) >= minColW) ? 3 : 2;
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

      const wireGutter = Math.min(
        Math.round(colW * 0.28),
        Math.max(Math.round(colW * 0.16), Math.round(bodySize * (kind.id === "digest" ? 3.1 : 2.35)))
      );
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
      const cellPadX = Math.max(8, Math.round(colW * 0.022));
      const measureTableCols = (rowSpec, headSpec) => {
        mCtx.font = headSpec;
        let maxW0 = mCtx.measureText(String(heads[0] || "")).width;
        let maxW1 = mCtx.measureText(String(heads[1] || "")).width;
        let maxW2 = mCtx.measureText(String(heads[2] || "")).width;
        mCtx.font = rowSpec;
        rows.forEach(row => {
          maxW0 = Math.max(maxW0, mCtx.measureText(String(row[0] || "")).width);
          maxW1 = Math.max(maxW1, mCtx.measureText(String(row[1] || "")).width);
          maxW2 = Math.max(maxW2, mCtx.measureText(String(row[2] || "")).width + 14);
        });
        return { maxW0, maxW1, maxW2 };
      };
      let tableSize = bodySize;
      let tableSpec = bodySpec;
      let tableHeadSpec = `700 ${Math.round(tableSize * 0.88)}px ${mastFamily}`;
      let { maxW0, maxW1, maxW2 } = measureTableCols(tableSpec, tableHeadSpec);
      const minGap = Math.max(18, Math.round(tableSize * 0.65));
      const needW = cellPadX * 2 + maxW0 + maxW1 + maxW2 + minGap * 2;
      if (needW > colW * 0.92) {
        tableSize = Math.max(16, Math.floor(bodySize * (colW * 0.90) / needW));
        tableSpec = cssFont(400, tableSize, entry.family, false);
        tableHeadSpec = `700 ${Math.round(tableSize * 0.88)}px ${mastFamily}`;
        ({ maxW0, maxW1, maxW2 } = measureTableCols(tableSpec, tableHeadSpec));
      }
      const gap1 = Math.max(14, Math.round(tableSize * 0.55));
      const gap2 = Math.max(16, Math.round(tableSize * 0.65));
      const chgRightX = colX + colW - cellPadX;
      const maxLastRightX = chgRightX - Math.ceil(maxW2) - gap2;
      const minLastRightX = colX + cellPadX + Math.ceil(maxW0) + gap1 + Math.ceil(maxW1);
      const lastRightX = minLastRightX <= maxLastRightX
        ? Math.min(maxLastRightX, Math.max(minLastRightX, colX + Math.round(colW * 0.68)))
        : Math.round((minLastRightX + maxLastRightX) / 2);
      const rowH = Math.round(Math.max(tableSize * 1.66, bodyLineH * (tableSize / Math.max(1, bodySize))) * 1.18);
      const tableRelY = Math.round(hlSize * 0.2);
      kwX = colX + cellPadX;
      const found = measureKeyword(mCtx, tableSpec, kToken);
      kwW = found.w;
      kwH = found.h;
      met = found;
      kwRelY = tableRelY + (kwRow + 1) * rowH;
      kwLineH = rowH;
      desc = {
        layout, tableHeads: heads, tableRows: rows, tableRelY, rowH, cellPadX,
        tableSize, tableSpec, tableHeadSpec, lastRightX,
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
      const maxFitSize = Math.max(18, Math.floor(hlSize * fit * 0.96));
      const scoreSize = Math.min(maxFitSize, Math.max(bodySize, Math.round(hlSize * 0.68 * fit)));
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
      const weatherPad = Math.max(6, Math.round(colW * 0.018));
      mCtx.font = bodySpec;
      const longestW = rows.reduce((w, g) => Math.max(w, mCtx.measureText(g).width), 1);
      const fitW = Math.min(1, (colW - weatherPad * 2) / longestW);
      const weatherSize = Math.max(16, Math.floor(bodySize * fitW));
      const weatherSpec = weatherSize === bodySize ? bodySpec : cssFont(400, weatherSize, entry.family, false);
      const rowH = Math.round(bodyLineH * 1.26);
      const found = measureKeyword(mCtx, weatherSpec, kToken);
      kwW = found.w;
      kwH = found.h;
      met = found;
      const hit = Math.max(0, rows.findIndex(g => g.includes(kToken)));
      kwX = colX + weatherPad + linePrefixWidth(mCtx, weatherSpec, rows[hit] || kwRow, kToken);
      kwRelY = (hit + 0.74) * rowH;
      kwLineH = rowH;
      desc = {
        layout: "weather", weatherRows: rows, rowH, weatherPad, weatherSpec,
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
      sideColW, sideLines,
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
  };
}

function buildDescs(n, ...args) {
  const build = descBuilder(...args);
  return Array.from({ length: n }, (_, i) => build(i));
}

function drawHighlight(ctx, d) {
  const r = d.hlRect;
  if (!r || d.hlStyle === "none") return;
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
    // Editorial review masthead: twin top rule + left accent mark + ink nameplate
    ctx.fillStyle = "#7a2e22";
    ctx.fillRect(colX, y(mhRelY - mhSize * 2.05), colW, Math.max(3, Math.round(mhSize * 0.24)));
    ctx.fillStyle = "#1a1816";
    ctx.fillRect(colX, y(mhRelY - mhSize * 1.65), colW, 1);
    const badgeSize = Math.round(mhSize * 1.34);
    ctx.font = `700 ${badgeSize}px ${mast}`;
    const markW = Math.max(8, Math.round(mhSize * 0.48));
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillStyle = "#7a2e22";
    ctx.fillRect(colX, y(mhRelY) - Math.round(badgeSize * 0.78), markW, Math.round(badgeSize * 0.82));
    ctx.fillStyle = "#161412";
    ctx.fillText(d.paperName, colX + markW + 10, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#5a554c";
    const mw = ctx.measureText(metaLine).width;
    if (markW + 10 + nw + 18 + mw <= colW) {
      ctx.fillText(metaLine, colX + colW - mw, y(mhRelY));
    } else {
      ctx.fillText(metaLine, colX, y(dlRelY));
    }
    ctx.strokeStyle = "#1a1816";
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
  } else if (fmt === 2) {
    // Civic chronicle framed header band (warm stone tint + ink frame)
    const bandH = Math.round(mhSize * 2.45);
    const bandTop = y(mhRelY) - Math.round(mhSize * 1.58);
    ctx.fillStyle = "#eae2d3";
    ctx.fillRect(colX, bandTop, colW, bandH);
    ctx.strokeStyle = "#1c1916";
    ctx.lineWidth = 1.6;
    ctx.strokeRect(colX, bandTop, colW, bandH);
    const nameSize = Math.round(mhSize * 1.38);
    ctx.font = `700 ${nameSize}px ${mast}`;
    ctx.fillStyle = "#161412";
    ctx.fillText(d.paperName, colX + 14, y(mhRelY));
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
    // Financial ledger split masthead: top rule + left serif title + right folio/dateline
    ctx.strokeStyle = "#2b221e";
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(colX, y(mhRelY - mhSize * 1.85)); ctx.lineTo(colX + colW, y(mhRelY - mhSize * 1.85)); ctx.stroke();
    const nameSize = Math.round(mhSize * 1.46);
    ctx.font = `700 ${nameSize}px ${mast}`;
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillStyle = "#181512";
    ctx.fillText(d.paperName, colX, y(mhRelY));
    if (d.paperSub) {
      ctx.font = `400 ${Math.round(mhSize * 0.72)}px ${mast}`;
      ctx.fillStyle = "#6e5d53";
      const sw = ctx.measureText(d.paperSub).width;
      if (nw + 18 + sw <= colW) {
        ctx.fillText(d.paperSub, colX + colW - sw, y(mhRelY));
      }
    }
    ctx.font = `400 ${Math.round(mhSize * 0.80)}px ${mast}`;
    ctx.fillStyle = "#544840";
    ctx.fillText(metaLine, colX, y(dlRelY));
    ctx.strokeStyle = "#2b221e";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(colX, y(topRuleRelY)); ctx.lineTo(colX + colW, y(topRuleRelY)); ctx.stroke();
    ctx.lineWidth = 1.8;
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
    const nw = ctx.measureText(d.paperName).width;
    ctx.fillStyle = "#161412";
    ctx.fillText(d.paperName, colX, y(mhRelY));
    ctx.font = `400 ${Math.round(mhSize * 0.78)}px ${mast}`;
    ctx.fillStyle = "#5f5950";
    const mw = ctx.measureText(d.dateline).width;
    if (nw + 18 + mw <= colW) {
      ctx.fillText(d.dateline, colX + colW - mw, y(mhRelY));
    }
    if (d.paperSub) {
      ctx.fillText(d.paperSub, colX, y(dlRelY));
    } else if (nw + 18 + mw > colW) {
      ctx.fillText(d.dateline, colX, y(dlRelY));
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

  // k is 1 at export size. Below 1 the same layout (laid out for W x H) is rasterized smaller, for the preview.
  const k = hasView ? outW / (W / 2) : 1;
  if (hasView) {
    ctx.translate(outW / 2, outH / 2);
    ctx.scale(zoom * k, zoom * k);
    ctx.translate(-W / 2, -H / 2);
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
    const tSize = d.tableSize || d.bodySize;
    const tSpec = d.tableSpec || d.bodySpec;
    const lastRightX = d.lastRightX || (colX + Math.round(colW * 0.68));
    const chgRightX = colX + colW - pad;

    ctx.fillStyle = "#181614";
    ctx.fillRect(colX, y(d.tableRelY) - rowH * 0.74, colW, rowH);
    ctx.fillStyle = "#f5f0e6";
    ctx.font = d.tableHeadSpec || `700 ${Math.round(tSize * 0.88)}px ${mast}`;
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

    ctx.font = tSpec;
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
    ctx.font = d.weatherSpec || d.bodySpec;
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
        let tagPx = Math.max(11, Math.round(d.bodySize * 0.74));
        ctx.font = `700 ${tagPx}px ${mast}`;
        const maxTagW = Math.max(24, d.wireGutter * 0.76);
        const tw = ctx.measureText(row.tag).width;
        if (tw > maxTagW) {
          tagPx = Math.max(10, Math.floor(tagPx * maxTagW / tw));
          ctx.font = `700 ${tagPx}px ${mast}`;
        }
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
    const vTop = hasView ? Math.floor(H / 2 - H / (4 * zoom) - 48) : 0;
    const vBot = hasView ? Math.ceil(H / 2 + H / (4 * zoom) + 48) : H;
    const vLeft = (hasView ? Math.floor(W / 2 - W / (4 * zoom) - 48) : 0) - xShift;
    const vRight = (hasView ? Math.ceil(W / 2 + W / (4 * zoom) + 48) : W) - xShift;

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
    const sideColW = d.sideColW || Math.max(80, Math.round((colW || 900) * 0.34));
    const sidePool = (d.sideLines && d.sideLines.length) ? d.sideLines : d.bgLines;
    const sideLen = sidePool.length;
    const sideClipSlack = Math.max(4, Math.floor(sideGap * 0.42));
    const sideSubSpec = d.bodySpec ? d.bodySpec.replace(/^400\b/, "700") : `700 ${d.bodySize}px ${mast}`;
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
      ctx.rect(sx - 2, vTop, sideColW + sideClipSlack + 2, Math.max(1, vBot - vTop));
      ctx.clip();
      for (let row = startRow; ; row++) {
        const ly = d.bodyLineH * 0.9 + row * d.bodyLineH;
        if (ly > vBot + d.bodyLineH) break;
        if (ly < vTop - d.bodyLineH) continue;
        const lineIdx = (((seedIdx * 19 + row) % sideLen) + sideLen) % sideLen;
        const lineText = sidePool[lineIdx];
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

// scale shrinks the fixed pixel constants (blur sigmas, minimum radii) with a smaller canvas; 1 is the export size
function lensBlur(dst, src, cx, cy, R, W, H, blurFactor, innerPlateauR, scale = 1) {
  if (blurFactor <= 0 || typeof document === "undefined") {
    dst.drawImage(src, 0, 0);
    return;
  }
  const S = 0.5, bW = Math.max(1, W * S | 0), bH = Math.max(1, H * S | 0);
  cx = finite(cx, W / 2);
  cy = finite(cy, H / 2);
  R = Math.max(8 * scale, finite(R, Math.min(W, H) * 0.08));

  const rad = Math.max(16 * scale, R * 1.4);
  const solidR = Math.max(12 * scale, Math.min(rad * 0.78, finite(innerPlateauR, R * 0.52)));
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
    x.filter = `blur(${sigma * blurFactor * scale}px)`;
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
      ? "TypePin 0123456789"
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

// W x H is the layout (export) size. scale < 1 rasterizes the same layout into a smaller canvas, for the preview.
function renderBakedFrame(d, W, H, flat, fCtx, blurFactor, vignette, targetCanvas, scale = 1) {
  const cw = Math.round(W * scale);
  const ch = Math.round(H * scale);
  const s = cw / W;
  if (flat.width !== cw) flat.width = cw;
  if (flat.height !== ch) flat.height = ch;
  const zoom = Math.max(0.1, Number(d.zoomScale) || 1);
  renderCut(fCtx, d, 2 * W, 2 * H, { outW: cw, outH: ch, zoom });

  const frame = targetCanvas || document.createElement("canvas");
  if (frame.width !== cw) frame.width = cw;
  if (frame.height !== ch) frame.height = ch;
  const fx = frame.getContext("2d");
  fx.setTransform(1, 0, 0, 1, 0, 0);
  fx.clearRect(0, 0, cw, ch);

  const kwScreenW = (d.kwW || W * 0.18) * zoom;
  const kwScreenH = (d.hlBoxH || (d.hlRect && d.hlRect.h) || d.hlSize || H * 0.06) * zoom;
  const innerPlateauR = Math.max(kwScreenW * 0.64, kwScreenH * 1.25);
  const screenR = Math.max(innerPlateauR * 1.35, (d.focalR || W * 0.16) * zoom);
  const blurAmt = (Number(blurFactor) || 0) * (d.nCh <= 3 ? 0.6 : 1);

  lensBlur(fx, flat, cw / 2, ch / 2, screenR * s, cw, ch, blurAmt, innerPlateauR * s, s);
  if (vignette !== false) drawVignette(fx, cw, ch);
  return frame;
}

// A MessageChannel hop lets rendering and input run without setTimeout's 4 ms clamp. Created on first use so
// requiring this file from node does not keep the process alive.
let yieldChannel = null;
const yieldWaiting = [];
function yieldToMain() {
  if (typeof MessageChannel === "undefined") return new Promise(r => setTimeout(r, 0));
  if (!yieldChannel) {
    yieldChannel = new MessageChannel();
    yieldChannel.port1.onmessage = () => yieldWaiting.shift()();
  }
  return new Promise(r => {
    yieldWaiting.push(r);
    yieldChannel.port2.postMessage(0);
  });
}

// renderScale < 1 rasterizes the same layout smaller (the preview); W x H in the result is the canvas size.
// into: a caller-owned array that receives the frames and keeps them when the bake is aborted.
async function bakeFrames(keyword, ratio, opts, onProgress, copy, locale, fontId) {
  const baseSize = SIZES[ratio] || SIZES["1:1"];
  const scale = opts && opts.renderScale ? opts.renderScale : 1;
  const shouldAbort = opts && typeof opts.shouldAbort === "function" ? opts.shouldAbort : null;
  const cooperative = Boolean(opts && opts.cooperative);
  const into = opts && opts.into;
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

  const build = descBuilder(keyword, baseSize.w, baseSize.h, opts.zoomVariance, copy, locale, fontId, {
    hlColor: opts.hlColor,
    hlStyle: opts.hlStyle,
    seedOffset: opts.seedOffset,
    seedW: baseSize.w,
  });
  const flat = document.createElement("canvas"); flat.width = W; flat.height = H;
  const fCtx = flat.getContext("2d");
  const baked = into || [];
  let sliceStart = typeof performance !== "undefined" ? performance.now() : 0;

  for (let ci = 0; ci < sched.nCuts; ci++) {
    if (shouldAbort && shouldAbort()) {
      flat.width = 0; flat.height = 0;
      if (!into) releaseCanvases(baked);
      return { aborted: true, baked: [], sched, W, H };
    }
    const frame = renderBakedFrame(
      build(ci), baseSize.w, baseSize.h, flat, fCtx,
      opts.blurFactor, opts.vignette !== false, undefined, scale
    );
    baked.push(frame);
    if (onProgress) onProgress(ci + 1, sched.nCuts, "渲染", frame, sched);
    if (cooperative && ci + 1 < sched.nCuts && typeof performance !== "undefined" && (performance.now() - sliceStart >= 12 || ci === 0)) {
      await yieldToMain();
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

// ---- Landing demos: one registry, one player (Demos, inside the page IIFE) ----
// id / canvas   entry id and the id of the <canvas> it paints
// group         at most one demo per group plays at a time; DEMO_GROUPS says who gets picked
// kind          "loop" (default) | "hero"
// ratio         studio frame when a clip or frame is opened
// parts         baked back to back; loc defaults to the UI language; word / fontId / custom may be {en, zh, hant}
// play          cut schedule (planCutSchedule options); the canvas element's own width / height is the bake size
// ui            feat only, the scripted mock panel (see mockAt): click [{ cut | at, k, text }], type [from, to], drag [from, to]
const DEMO_GROUPS = {
  hero: { pick: "solo" },
  cta: { pick: "solo" },
  feat: { pick: "select" },
  wall: { pick: "hover" },
  platform: { pick: "hover", rotateMs: 0 },
};

const FEAT_COPY = {
  en: "Our team ships on Friday. The Launch moves the whole roadmap forward. Every Launch needs one honest headline.",
  zh: "团队周五完成发布。这次发布把整张路线图往前推了一步。每次发布都需要一句老实的标题。",
  hant: "團隊週五完成發佈。這次發佈把整張路線圖往前推了一步。每次發佈都需要一句老實的標題。",
};

const DEMOS = [
  { id: "hero", canvas: "gateCanvas", group: "hero", kind: "hero" },

  { id: "w1", canvas: "demo-w1", group: "wall", ratio: "9:16", parts: [{ loc: "en", word: "Bitcoin" }], play: { cps0: 9 } },
  { id: "w2", canvas: "demo-w2", group: "wall", ratio: "1:1", parts: [{ loc: "zh", word: "降息", hlColor: "#ff9eb5" }], play: { cps0: 6, cps1: 16, curve: "in" } },
  { id: "w3", canvas: "demo-w3", group: "wall", ratio: "16:9", parts: [{ loc: "hant", word: "輝達", hlStyle: "box" }], play: { cps0: 10 } },
  { id: "w4", canvas: "demo-w4", group: "wall", ratio: "16:9", parts: [{ loc: "en", word: "TRUMP", hlColor: "#ffad66" }], play: { cps0: 11 } },
  { id: "w5", canvas: "demo-w5", group: "wall", ratio: "1:1", parts: [{ loc: "hant", word: "人工智慧", hlColor: "#9ee6b8" }], play: { cps0: 8 } },
  { id: "w6", canvas: "demo-w6", group: "wall", ratio: "9:16", parts: [{ loc: "zh", word: "特朗普", hlStyle: "box", hlColor: "#9cc8ff" }], play: { cps0: 12 } },

  { id: "p1", canvas: "demo-p1", group: "platform", ratio: "9:16", parts: [{ word: { en: "Go viral", zh: "爆款", hant: "爆款" } }], play: { cps0: 9 } },
  { id: "p2", canvas: "demo-p2", group: "platform", ratio: "1:1", parts: [{ word: { en: "Save it", zh: "种草", hant: "種草" } }], play: { cps0: 9 } },
  { id: "p3", canvas: "demo-p3", group: "platform", ratio: "16:9", parts: [{ word: { en: "Subscribe", zh: "三连", hant: "三連" } }], play: { cps0: 9 } },

  // f1-f6: the paper changes right after each scripted click of the mock studio panel (see mockAt).
  // Every part holds as many cuts as its duration needs, so duration = total cuts / cps0.
  {
    id: "f1", canvas: "featCanvas", group: "feat",
    parts: [{ loc: "hant", word: "人工智慧", cuts: 4 }, { loc: "en", word: "AI", cuts: 4 }, { loc: "zh", word: "人工智能", cuts: 4 }, { loc: "hant", word: "人工智慧", cuts: 4 }],
    play: { cps0: 3, duration: 16 / 3 },
    ui: { click: [{ cut: 4, k: "lang.en" }, { cut: 8, k: "lang.zh" }, { cut: 12, k: "lang.hant" }] },
  },
  {
    id: "f2", canvas: "featCanvas", group: "feat",
    parts: [{ word: { en: "Launch", zh: "发布", hant: "發佈" }, cuts: 10 }, { word: { en: "Launch", zh: "发布", hant: "發佈" }, custom: FEAT_COPY, cuts: 6 }],
    play: { cps0: 3, duration: 16 / 3 },
    ui: { click: [{ at: 0.9, k: "ta.box" }], type: [1.15, 3.1] },
  },
  {
    id: "f3", canvas: "featCanvas", group: "feat",
    parts: [
      { word: { en: "Exclusive", zh: "独家", hant: "獨家" }, cuts: 3 },
      { word: { en: "Exclusive", zh: "独家", hant: "獨家" }, cuts: 3, hlStyle: "box" },
      { word: { en: "Exclusive", zh: "独家", hant: "獨家" }, cuts: 3, hlStyle: "box", hlColor: "#ff9eb5" },
      { word: { en: "Exclusive", zh: "独家", hant: "獨家" }, cuts: 3, hlColor: "#ff9eb5" },
      { word: { en: "Exclusive", zh: "独家", hant: "獨家" }, cuts: 6, hlColor: "#9ee6b8" },
    ],
    play: { cps0: 3, duration: 6 },
    ui: { click: [{ cut: 3, k: "hl.box" }, { cut: 6, k: "col.p" }, { cut: 9, k: "hl.marker" }, { cut: 12, k: "col.m" }] },
  },
  {
    id: "f4", canvas: "featCanvas", group: "feat",
    parts: [{ word: { en: "Faster", zh: "提速", hant: "提速" }, cuts: 14 }],
    play: { cps0: 3, cps1: 26, curve: "in", duration: 6.5 },
    ui: { click: [{ at: 0.8, k: "curve.in" }, { at: 1.5, k: "cps.thumb" }], drag: [1.5, 6.2] },
  },
  {
    id: "f5", canvas: "featCanvas", group: "feat",
    parts: [
      { word: { en: "Typeset", zh: "排版", hant: "排版" }, cuts: 4 },
      { word: { en: "Typeset", zh: "排版", hant: "排版" }, cuts: 4, fontId: { en: "oswald", zh: "hei", hant: "jhenghei" } },
      { word: { en: "Typeset", zh: "排版", hant: "排版" }, cuts: 4, fontId: { en: "roboto-blackitalic", zh: "kai", hant: "kai-tc" } },
    ],
    play: { cps0: 3, duration: 4 },
    ui: { click: [{ cut: 4, k: "font.up", text: "MyFont.ttf" }, { cut: 8, k: "font.up", text: "Poster-Black.otf" }] },
  },
  {
    id: "f6", canvas: "featCanvas", group: "feat",
    parts: [{ word: { en: "Landed", zh: "落地", hant: "落地" }, cuts: 12 }],
    play: { cps0: 10, duration: 4, hold: true },
    ui: { click: [{ at: 1, k: "hold.sw" }] },
  },

  // the closing band's backdrop: slow, drawn small (CSS blurs and dims it)
  { id: "cta", canvas: "ctaCanvas", group: "cta", parts: [{ word: { en: "Pin", zh: "钉字", hant: "釘字" }, cuts: 8, zoom: 2.2 }], play: { cps0: 2, duration: 4 } },
];

function normalizeDemo(spec) {
  const play = Object.assign({ cps0: 8, curve: "lin", duration: 3, hold: false }, spec.play);
  play.cps1 = play.cps1 || play.cps0;
  const parts = (spec.parts || [{}]).map(p => Object.assign({ cuts: 8, hlStyle: "marker", hlColor: "#ffe72e", fontId: "random", zoom: 1.6 }, p));
  return Object.assign({ kind: "loop" }, spec, { play, parts });
}

const demoByLang = (v, lang) => (v && typeof v === "object" ? v[lang] : v);
const HERO_WORD = { en: "AI", zh: "人工智能", hant: "人工智慧" };

if (typeof document !== "undefined") (function () {
  // cuts baked before the preview starts to play; the loop covers the baked prefix while the rest bake
  const PREFIX_CUTS = 6;
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
  const stageFrame = document.querySelector(".stage-frame");
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
  // Preview pipeline phase, the one place that says where the bake is:
  //   idle            no batch baking
  //   baking          a batch is baking and none of it plays yet (the previous loop may keep playing)
  //   playing-prefix  the first PREFIX_CUTS cuts loop while the rest keep baking
  //   complete        every cut of the batch is baked
  let previewPhase = "idle";
  function setPhase(next) {
    previewPhase = next;
    if (stageCanvas) stageCanvas.dataset.phase = next;
  }
  let previewToken = 0; // bake generation: bumping it aborts the bake in flight
  let loopToken = 0; // loop generation: bumping it stops the loop on screen
  let pendingEl = null; // the control that asked for the bake in flight, shown busy until its loop plays
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

  const LEGAL_HASHES = new Set(["#about", "#legal", "#privacy", "#terms", "#cookies", "#disclaimer"]);
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
  let legalPage = "privacy";
  let wasPlayingBeforeLegal = false;
  let finalCtaInView = false;
  let ctaTimerId = 0;
  let ctaStepIdx = 0;

  function syncDocumentTitle() {
    if (typeof window.__syncFaqJsonLd === "function") {
      window.__syncFaqJsonLd(uiLang);
    }
    if (inLegalView && $("legalView")) {
      const h = $(`${legalPage}Title`);
      const brand = uiLang === "hant" ? "釘字" : uiLang === "zh" ? "钉字" : "TypePin";
      document.title = `${h ? h.innerText.trim() : ""} — ${brand}`;
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
      ? "文字跳切（Text Match Cut）免費線上產生器 | 釘字"
      : uiLang === "zh"
        ? "文字跳切（Text Match Cut）免费在线生成器 | 钉字"
        : "Text Match Cut Generator: Free Newspaper Effect Maker | TypePin");
  }

  const previewCache = {
    key: "",
    baked: null,
    sched: null,
    ratio: "",
    scale: 0,
  };
  const cacheComplete = () => Boolean(previewCache.baked && previewCache.sched && previewCache.baked.length >= previewCache.sched.nCuts);

  // Bake the preview at the size it is shown (CSS px x device pixels), never above the export size.
  // Steps of 1/16 keep the scale, and with it the cache, stable under small resizes.
  function previewScale() {
    const full = SIZES[ratio] || SIZES["1:1"];
    const box = stageFrame && stageFrame.getBoundingClientRect();
    if (!box || !box.width || !box.height) return 1;
    const fit = Math.min(box.width / full.w, box.height / full.h);
    return Math.min(1, Math.max(1 / 16, Math.ceil(fit * Math.max(1, window.devicePixelRatio || 1) * 16) / 16));
  }

  function setPending(el) {
    if (pendingEl && pendingEl !== el) pendingEl.removeAttribute("aria-busy");
    pendingEl = el;
    if (el) el.setAttribute("aria-busy", "true");
  }
  const clearPending = () => setPending(null);

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

  function closeSelectMenus(exceptMenu) {
    [
      [$("audioBtn"), $("audioMenu")],
      [$("fontBtn"), $("fontMenu")],
    ].forEach(([btn, menu]) => {
      if (!menu || menu === exceptMenu || menu.hidden) return;
      menu.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function syncSelectPopover(selectEl, btnEl, labelEl, menuEl) {
    if (!selectEl || !btnEl || !menuEl) return;
    const curVal = selectEl.value;
    const opts = [...selectEl.options];
    const activeOpt = opts.find(o => o.value === curVal) || opts[0];
    if (labelEl && activeOpt) {
      labelEl.textContent = activeOpt.textContent;
    }
    menuEl.innerHTML = "";
    opts.forEach(opt => {
      const isSel = opt === activeOpt;
      const item = document.createElement("button");
      item.type = "button";
      item.className = "fmt-opt" + (isSel ? " on" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", isSel ? "true" : "false");
      item.dataset.value = opt.value;

      const textSpan = document.createElement("span");
      textSpan.textContent = opt.textContent;
      const checkSpan = document.createElement("span");
      checkSpan.className = "ico fmt-check";
      checkSpan.setAttribute("aria-hidden", "true");
      checkSpan.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 8.3l3.1 3.1 6.5-6.8"/></svg>';

      item.appendChild(textSpan);
      item.appendChild(checkSpan);
      item.addEventListener("click", e => {
        e.stopPropagation();
        const changed = selectEl.value !== opt.value;
        selectEl.value = opt.value;
        if (labelEl) labelEl.textContent = opt.textContent;
        menuEl.querySelectorAll(".fmt-opt").forEach(b => {
          const on = b === item;
          b.classList.toggle("on", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        closeSelectMenus();
        if (changed) {
          selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (selectEl.id === "audioSelect" && opt.value !== "none") {
          auditionSfx(opt.value);
        }
      });
      menuEl.appendChild(item);
    });
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
    syncSelectPopover(fontSelect, $("fontBtn"), $("fontBtnLabel"), $("fontMenu"));
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
      btn.setAttribute("aria-checked", active ? "true" : "false");
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
      syncSelectPopover($("audioSelect"), $("audioBtn"), $("audioBtnLabel"), $("audioMenu"));
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
    if (copyPack) Demos.langChanged();
  }

  function drawPreviewFrameToStage(frameCanvas) {
    if (!stageCanvas || !frameCanvas) return;
    if (stageCanvas.width !== frameCanvas.width) stageCanvas.width = frameCanvas.width;
    if (stageCanvas.height !== frameCanvas.height) stageCanvas.height = frameCanvas.height;
    if (stageCanvas.hidden) stageCanvas.hidden = false;
    if (vid && !vid.hidden) vid.hidden = true;
    const sCtx = stageCanvas.getContext("2d");
    sCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    sCtx.drawImage(frameCanvas, 0, 0);
  }

  async function renderStaticHero() {
    if (!stageCanvas || isExporting || !studioOpen) return;
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
    const scale = previewScale();
    const W = Math.round(baseSize.w * scale);
    const H = Math.round(baseSize.h * scale);

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
    const descs = buildDescs(1, keyword, baseSize.w, baseSize.h, opts.zoomVariance, mixed, myLoc, fontVal, {
      hlColor: opts.hlColor,
      hlStyle: opts.hlStyle,
      seedOffset: opts.seedOffset,
      seedW: baseSize.w,
    });
    renderBakedFrame(
      descs[0], baseSize.w, baseSize.h,
      heroScratch.flat, heroScratch.fCtx,
      opts.blurFactor, opts.vignette,
      heroScratch.out, scale
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
    loopToken += 1;
    activeLoopControl = null;
    if (previewRafId) {
      cancelAnimationFrame(previewRafId);
      previewRafId = 0;
    }
    updatePlayUi(false);
    setPhase(cacheComplete() ? "complete" : "idle");
    if (drawHero) {
      clearPending();
      if (previewCache.baked && previewCache.baked.length && previewCache.sched) {
        const sched = previewCache.sched;
        const fps = sched.fps || FPS;
        const total = sched.totalFrames;
        const lf = Math.min(Math.max(0, Math.floor(pausedRatio * total)), total - 1);
        const ci = Math.min(sched.cutAt[lf], previewCache.baked.length - 1);
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

  // Plays `baked` in schedule order. While the bake is still filling the array the loop wraps where the baked
  // cuts end and stretches as more arrive, so the switch to the full schedule continues from the same cut.
  function startContinuousLoop(baked, sched, initialRatio) {
    const token = ++loopToken;
    drawPreviewFrameToStage(baked[0]);

    const sCtx = stageCanvas.getContext("2d");
    const fps = sched.fps || FPS;
    const fi = 1000 / fps;
    const total = Math.max(1, sched.totalFrames);
    const loopMs = total * fi;
    const totSec = total / fps;
    let readyCuts = 0;
    let limitMs = loopMs;
    const syncLimit = () => {
      if (baked.length === readyCuts) return;
      readyCuts = baked.length;
      const f = readyCuts >= sched.nCuts ? -1 : sched.cutAt.findIndex(c => c >= readyCuts);
      limitMs = f < 0 ? loopMs : f * fi;
    };
    syncLimit();
    let posMs = Math.min(Math.max(0, Math.min(0.999, Number(initialRatio) || 0)) * loopMs, limitMs - 1);
    let prevNow = performance.now();
    let lastCut = -1;
    let cycle = 0;
    stageCanvas.dataset.loopCycle = "0";

    activeLoopControl = {
      seek(r) {
        syncLimit();
        posMs = Math.min(Math.max(0, Math.min(0.999, r)) * loopMs, limitMs - 1);
        lastCut = -1;
      },
    };

    updatePlayUi(true);

    const step = now => {
      if (token !== loopToken || isExporting) return;
      syncLimit();
      posMs += Math.max(0, now - prevNow);
      prevNow = now;
      if (posMs >= limitMs) {
        if (limitMs === loopMs) {
          cycle += Math.floor(posMs / loopMs);
          stageCanvas.dataset.loopCycle = String(cycle);
        }
        posMs %= limitMs;
        lastCut = -1;
      }
      pausedRatio = posMs / loopMs;

      const lf = Math.min(Math.max(0, (posMs / fi) | 0), total - 1);
      const ci = sched.cutAt[lf];
      if (ci !== lastCut) {
        lastCut = ci;
        sCtx.drawImage(baked[ci], 0, 0);
        if (audioUnlocked && sharedAc && sharedAc.state === "running" && previewMasterGain) {
          const curSound = ($("audioSelect") && $("audioSelect").value) || "none";
          if (curSound !== "none") {
            const cps = sched.cpsAtCut ? sched.cpsAtCut[ci] : currentCpsPair().cps0;
            triggerSfx(sharedAc, previewMasterGain, curSound, sharedAc.currentTime + 0.006, cps);
          }
        }
      }

      // while the bake still runs, the timeline keeps showing its progress
      if (readyCuts >= sched.nCuts) {
        setTimelineState({
          kind: "playing",
          pct: pausedRatio * 100,
          ci,
          nCuts: sched.nCuts,
          curSec: lf / fps,
          totSec,
          totalFrames: total,
        });
      }

      previewRafId = requestAnimationFrame(step);
    };

    step(prevNow);
  }

  async function startPreviewPass(playOpts) {
    if (!stageCanvas || isExporting || !studioOpen) { clearPending(); return; }
    // the opening morph runs: its end starts the one bake, so an earlier request must not start a second
    if (studioOpening) return;
    const copy = copyForLocale();
    if (!copy) { clearPending(); return; }

    if (playOpts && playOpts.fromUserGesture) unlockPreviewAudio();

    // keepPlaying: the loop on screen stays until the new batch can play
    const keep = Boolean(playOpts && playOpts.keepPlaying) && isPlaying;
    if (!keep) stopPreviewPlayback(false);
    const token = ++previewToken;
    const opts = currentOpts();
    const keyword = activeKeyword();
    const myLoc = locale;
    const customVal = $("customText") ? $("customText").value : "";
    const mixBg = Boolean($("mixCustomBg") && $("mixCustomBg").checked);
    const fontVal = fontSelect ? fontSelect.value : "random";
    const key = buildPreviewKey(opts, keyword, myLoc, fontVal, customVal, mixBg);
    const scale = previewScale();

    if (previewCache.key === key && previewCache.scale >= scale && cacheComplete()) {
      setPhase("complete");
      clearPending();
      if (!keep) startContinuousLoop(previewCache.baked, previewCache.sched, playOpts && playOpts.resume ? pausedRatio : 0);
      return;
    }

    setPhase("baking");
    pausedRatio = 0;
    const estCuts = Math.max(1, Math.min(360, Math.round(opts.duration * ((opts.cps0 + opts.cps1) / 2))));
    if (!keep) setTimelineState({ kind: "baking", pct: 2, done: 0, total: estCuts });

    const frames = [];
    const mixed = withCustomCopy(copy, keyword, customVal, mixBg, myLoc);
    try {
      const res = await bakeFrames(
        keyword,
        ratio,
        Object.assign({}, opts, {
          renderScale: scale,
          cooperative: true,
          into: frames,
          shouldAbort: () => token !== previewToken || isExporting,
        }),
        (done, total, _phase, frame, sched) => {
          if (token !== previewToken || isExporting) return;
          if (done === 1 && !isPlaying) drawPreviewFrameToStage(frame);
          if (done === Math.min(PREFIX_CUTS, total)) {
            // enough cuts to play: this batch takes over from the previous one
            const previous = previewCache.baked;
            Object.assign(previewCache, { key, baked: frames, sched, ratio, scale });
            setPhase(done >= total ? "complete" : "playing-prefix");
            startContinuousLoop(frames, sched, 0);
            if (previous && previous !== frames) releaseCanvases(previous);
            clearPending();
          }
          // while this batch is still baking behind a loop kept from before, that loop owns the timeline
          if (previewPhase !== "baking" || !isPlaying) {
            setTimelineState({ kind: "baking", pct: (done / Math.max(1, total)) * 100, done, total });
          }
        },
        mixed,
        myLoc,
        fontVal
      );

      if (res.aborted || token !== previewToken || isExporting) {
        if (previewCache.baked !== frames) releaseCanvases(frames);
        return;
      }
      setPhase("complete");
    } finally {
      if (token === previewToken) clearPending();
    }
  }

  function handleMotionEdit(fromUserAudioGesture, delayMs = 150, edit = {}) {
    clearTimeout(inputDebounceTimer);
    if (fromUserAudioGesture) unlockPreviewAudio();
    // edit.keepPlaying: leave the loop on screen until the rebuilt one can play; edit.pending: the control to show busy
    const keep = Boolean(edit.keepPlaying) && isPlaying;
    if (!keep) {
      stopPreviewPlayback(false);
      scheduleStaticHero(0);
    }
    if (edit.pending) setPending(edit.pending);
    if (!livePreview || inLegalView) {
      clearPending();
      return;
    }
    inputDebounceTimer = setTimeout(() => {
      if (livePreview && !isExporting && !inLegalView) {
        startPreviewPass({ fromUserGesture: false, resume: false, keepPlaying: keep });
      } else {
        clearPending();
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
      if ($("randomKwBtn").getAttribute("aria-busy") === "true") return;
      const pool = RANDOM_KEYWORDS[locale] || RANDOM_KEYWORDS.en;
      const choices = pool.filter(w => w !== kw.value.trim());
      kw.value = choices[Math.floor(Math.random() * choices.length)] || pool[0];
      seedOffset += 1;
      showError("");
      updateCharCount();
      updateCustomBadge();
      handleMotionEdit(true, 150, { pending: $("randomKwBtn") });
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
      syncSelectPopover($("audioSelect"), $("audioBtn"), $("audioBtnLabel"), $("audioMenu"));
      const v = $("audioSelect").value;
      if (v !== "none") auditionSfx(v);
    });
  }

  if ($("holdLast")) {
    $("holdLast").addEventListener("change", () => handleMotionEdit(false));
  }

  if (fontSelect) {
    fontSelect.addEventListener("change", () => {
      syncSelectPopover(fontSelect, $("fontBtn"), $("fontBtnLabel"), $("fontMenu"));
      handleMotionEdit(false);
    });
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
        if (fontSelect) {
          fontSelect.value = "custom";
          syncSelectPopover(fontSelect, $("fontBtn"), $("fontBtnLabel"), $("fontMenu"));
        }
        previewCache.key = "";
        handleMotionEdit(false);
      } catch (err) {
        showError("fontRead");
        console.error(err);
      }
    });
  }

  [
    [$("audioBtn"), $("audioMenu")],
    [$("fontBtn"), $("fontMenu")],
  ].forEach(([btn, menu]) => {
    if (!btn || !menu) return;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (isExporting || btn.disabled) return;
      closeFormatMenu();
      closeSelectMenus(menu);
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

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
        const ci = Math.min(sched.cutAt[lf], previewCache.baked.length - 1);
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
      if ($("rerollBtn").getAttribute("aria-busy") === "true") return;
      seedOffset += 1;
      handleMotionEdit(true, 90, { keepPlaying: true, pending: $("rerollBtn") });
    });
  }

  // a window that grows needs sharper frames: rebake behind the loop that is playing, only when the stage
  // needs a larger step than the batch has (shrinking keeps the batch; a paused preview rebakes on Play)
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (studioOpen && isPlaying && livePreview && !isExporting && !inLegalView && previewScale() > previewCache.scale) {
        startPreviewPass({ fromUserGesture: false, resume: false, keepPlaying: true });
      }
    }, 300);
  });

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

  // —— Landing: the studio replaces the hero in place once the visitor pins a word, and stays open ——
  let studioOpen = false;
  let studioOpening = null;
  const gateInputs = [...document.querySelectorAll(".gate-input")];
  const CJK_RE = /[㐀-鿿豈-﫿]/;
  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
  const COARSE_POINTER = window.matchMedia("(hover: none)");

  const gateWord = () => (gateInputs[0] ? gateInputs[0].value : "").trim().slice(0, MAX_CHARS);
  const cjkLocale = () => (uiLang === "hant" ? "hant" : "zh");

  // One registry (DEMOS), one scheduler. Frames are baked lazily when a canvas comes into view and
  // cached by key; each group plays at most one demo, picked by DEMO_GROUPS[group].pick.
  const Demos = (() => {
    const BUDGET = 112 * 1024 * 1024;
    const HERO_RATIOS = ["9:16", "1:1", "16:9"];
    const HERO_SIZE = { "9:16": [450, 800], "1:1": [560, 560], "16:9": [800, 450] };
    const HERO_PHASE_MS = 3200;
    const HERO_CPS = 9;
    const clamp01 = n => Math.max(0, Math.min(1, n));
    // rAF timestamps can predate the performance.now() a demo started with
    const since = (now, t0) => Math.max(0, now - t0);

    const rts = DEMOS.map(d => {
      const spec = normalizeDemo(d);
      const el = $(spec.canvas);
      return { spec, el, ctx: el ? el.getContext("2d") : null, entry: null, t0: 0, last: -1 };
    }).filter(rt => rt.el);
    const byId = new Map(rts.map(rt => [rt.spec.id, rt]));
    const members = group => rts.filter(rt => rt.spec.group === group);
    const heroRt = byId.get("hero");
    const state = Object.fromEntries(Object.keys(DEMO_GROUPS).map(g => [g, { pointer: "", rot: "", rotAt: 0 }]));
    const playing = new Map();
    const near = new Set();
    const shown = new Set();
    const cache = new Map();
    const inflight = new Map();
    const queue = [];
    const hero = { i: 0, since: 0, lock: "", shown: "", word: "", loc: "", entries: {}, timer: 0 };
    let raf = 0;
    let pumping = false;

    const langDep = spec => spec.kind === "hero" || spec.parts.some(p => !p.loc || [p.word, p.fontId, p.custom].some(v => v && typeof v === "object"));
    const landingActive = () => !inLegalView && !document.hidden;
    const visible = rt => near.has(rt.el);
    const onScreen = rt => shown.has(rt.el);
    const selected = group => byId.get(state[group].pointer) || members(group)[0];
    const heroEntry = () => hero.entries[HERO_RATIOS[hero.i]];
    const wanted = rt => landingActive() && visible(rt) && (DEMO_GROUPS[rt.spec.group].pick !== "select" || selected(rt.spec.group) === rt);
    const ready = rt => onScreen(rt) && wanted(rt) && Boolean(rt.spec.kind === "hero" ? heroEntry() : rt.entry);
    const draw = (rt, frame) => rt.ctx.drawImage(frame, 0, 0, rt.el.width, rt.el.height);

    function turnMs(group) {
      const g = DEMO_GROUPS[group];
      return g.rotateMs || (g.pick === "hover" && COARSE_POINTER.matches ? 3600 : 0);
    }

    // ---- cache + serial bake queue ----
    function release(e) {
      releaseCanvases(e.frames);
    }

    function inUse(e, keep) {
      return e === keep
        || Object.values(hero.entries).includes(e)
        || rts.some(rt => rt.entry === e && (playing.get(rt.spec.group) === rt || wanted(rt)));
    }

    // soft budget: entries a visible demo still needs are never dropped; the rest go oldest first
    function evict(keep) {
      let total = 0;
      cache.forEach(e => { total += e.bytes; });
      for (const [k, e] of cache) {
        if (total <= BUDGET) break;
        if (inUse(e, keep)) continue;
        rts.forEach(rt => { if (rt.entry === e) rt.entry = null; });
        release(e);
        cache.delete(k);
        total -= e.bytes;
      }
    }

    async function pump() {
      if (pumping) return;
      pumping = true;
      while (queue.length) {
        const job = queue.shift();
        let entry = null;
        try {
          if (!job.skip()) {
            entry = await job.build();
            entry.bytes = entry.frames.reduce((n, c) => n + c.width * c.height * 4, 0);
            if (entry.lang && entry.lang !== uiLang) {
              release(entry);
              entry = null;
            } else {
              cache.set(job.key, entry);
              evict(entry);
            }
          }
        } catch (err) {
          console.error(err);
          entry = null;
        }
        inflight.delete(job.key);
        job.resolve(entry);
      }
      pumping = false;
    }

    function fetchEntry(key, build, front, skip) {
      const hit = cache.get(key);
      if (hit) {
        cache.delete(key);
        cache.set(key, hit);
        return Promise.resolve(hit);
      }
      if (inflight.has(key)) return inflight.get(key);
      const p = new Promise(resolve => {
        const job = { key, build, skip, resolve };
        if (front) queue.unshift(job);
        else queue.push(job);
      });
      inflight.set(key, p);
      pump();
      return p;
    }

    // ---- baking ----
    function resolveParts(spec, lang) {
      return spec.parts.map(p => {
        const loc = p.loc || lang;
        return Object.assign({}, p, {
          loc,
          word: String(demoByLang(p.word, lang) || defaults[loc]).slice(0, MAX_CHARS),
          fontId: demoByLang(p.fontId, lang),
          custom: demoByLang(p.custom, lang),
        });
      });
    }

    async function descsFor(p, w, h, seed) {
      await loadFonts(p.loc);
      let copy = copyPack[p.loc] || copyPack.en;
      if (p.custom) copy = withCustomCopy(copy, p.word, p.custom, true, p.loc);
      return descBuilder(p.word, w, h, p.zoom, copy, p.loc, p.fontId, { hlColor: p.hlColor, hlStyle: p.hlStyle, seedOffset: seed, seedW: 960 });
    }

    async function renderDescs(build, n, w, h) {
      const flat = document.createElement("canvas");
      const fCtx = flat.getContext("2d");
      const out = [];
      for (let i = 0; i < n; i++) {
        out.push(renderBakedFrame(build(i), w, h, flat, fCtx, 0.9, true));
        await yieldToMain();
      }
      flat.width = 0;
      flat.height = 0;
      return out;
    }

    async function bakeParts(parts, w, h, seed) {
      const frames = [];
      for (const [i, p] of parts.entries()) {
        frames.push(...await renderDescs(await descsFor(p, w, h, seed + i * 5), p.cuts, w, h));
      }
      return frames;
    }

    async function bakeLoop(rt, lang) {
      const w = rt.el.width;
      const h = rt.el.height;
      const frames = await bakeParts(resolveParts(rt.spec, lang), w, h, hashString(rt.spec.id) % 97);
      const sched = planCutSchedule(Object.assign({}, rt.spec.play, { fps: FPS }));
      return { frames, sched, w, h, lang: langDep(rt.spec) ? lang : "" };
    }

    // ---- hero: the frame morphs 9:16 -> 1:1 -> 16:9, each ratio baked once ----
    const heroKey = ratio => ["hero", hero.loc, hero.word, ...HERO_SIZE[ratio]].join("|");

    function heroResolve() {
      hero.word = gateWord() || HERO_WORD[uiLang];
      hero.loc = CJK_RE.test(hero.word) ? cjkLocale() : uiLang;
    }

    function heroSetRatio(now) {
      const ratio = HERO_RATIOS[hero.i];
      const e = hero.entries[ratio];
      if (heroRt.el.width !== e.w || heroRt.el.height !== e.h) {
        heroRt.el.width = e.w;
        heroRt.el.height = e.h;
      }
      $("heroFrame").dataset.ratio = ratio;
      $("heroRatioTag").textContent = ratio;
      hero.shown = ratio;
      hero.since = now;
      heroRt.last = -1;
      draw(heroRt, e.frames[0]);
    }

    function heroEnsure(ratio, front) {
      if (!hero.word) heroResolve();
      const key = heroKey(ratio);
      const [w, h] = HERO_SIZE[ratio];
      const lang = uiLang;
      const part = { loc: hero.loc, word: hero.word, cuts: 6, hlStyle: "marker", hlColor: "#ffe72e", fontId: "random", zoom: 2.2 };
      const build = async () => ({ frames: await bakeParts([part], w, h, 11), w, h, lang });
      return fetchEntry(key, build, front, () => !landingActive() || !visible(heroRt)).then(e => {
        if (!e) return e;
        if (key !== heroKey(ratio)) {
          if (!inUse(e)) {
            release(e);
            cache.delete(key);
          }
          return e;
        }
        hero.entries[ratio] = e;
        if (ratio === HERO_RATIOS[hero.i] && hero.shown !== ratio) heroSetRatio(performance.now());
        sync();
        return e;
      });
    }

    function heroPrefetch() {
      if (!hero.lock) heroEnsure(HERO_RATIOS[(hero.i + 1) % HERO_RATIOS.length], false);
    }

    function heroRefresh() {
      if (!copyPack) return;
      heroResolve();
      hero.entries = {};
      hero.shown = "";
      sync();
      for (const [k, e] of cache) {
        if (k.startsWith("hero|") && !inUse(e)) {
          release(e);
          cache.delete(k);
        }
      }
      heroEnsure(HERO_RATIOS[hero.i], true);
    }

    function lockHero(ratio) {
      const i = HERO_RATIOS.indexOf(ratio);
      if (i < 0) return;
      hero.lock = ratio;
      hero.i = i;
      if (hero.entries[ratio]) heroSetRatio(performance.now());
      else heroEnsure(ratio, true);
      sync();
    }

    function wordTyped() {
      clearTimeout(hero.timer);
      hero.timer = setTimeout(heroRefresh, 260);
    }

    // ---- feat mock: a fake studio panel clicked by a fake cursor, stateless in the demo clock `sec` ----
    // A click lands MOCK.lead before the cut that shows its result; the cursor starts MOCK.travel earlier.
    const MOCK = { lead: 0.14, press: 0.2, travel: 0.5, linger: 0.7 };
    const groupOf = k => k.split(".")[0];

    function mockOf(rt) {
      if (!rt.mock) {
        const pane = document.querySelector(`.feat-pane[data-pane="${rt.spec.id}"]`);
        const root = pane.closest(".feat-mock");
        const q = s => pane.querySelector(s);
        const els = new Map([...pane.querySelectorAll("[data-k]")].map(el => [el.dataset.k, el]));
        const init = {};
        els.forEach((el, k) => { if (el.classList.contains("on")) init[groupOf(k)] = k; });
        pane.style.setProperty("--h", 1 / rt.spec.play.duration);
        rt.mock = { pane, root, els, init, cursor: root.querySelector(".feat-cursor"), typed: q(".feat-typed"), chip: q(".feat-file"), pick: q("select"), range: q("input[type=range]"), num: q(".num"), entry: undefined, clicks: [] };
      }
      return rt.mock;
    }

    function mockPoint(m, el) {
      const a = m.root.getBoundingClientRect();
      if (!el) return [a.width * 0.72, a.height * 0.8];
      const b = el.getBoundingClientRect();
      const x = el.type === "range" ? 8 + ((el.value - el.min) / (el.max - el.min)) * (b.width - 16) : b.width / 2;
      return [b.left - a.left + x, b.top - a.top + Math.min(b.height / 2, 18)];
    }

    function mockAt(rt, sec) {
      const m = mockOf(rt);
      const { ui, play } = rt.spec;
      const e = rt.entry;
      if (m.entry !== e) {
        m.entry = e;
        m.clicks = ui.click.map(c => ({ ...c, t: c.at ?? (e ? e.sched.changeAt[c.cut] / e.sched.fps - MOCK.lead : Infinity) }));
      }
      const ck = m.clicks;
      const sel = { ...m.init };
      let file = "";
      ck.forEach(c => {
        if (c.t > sec) return;
        sel[groupOf(c.k)] = c.k;
        if (c.text) file = c.text;
      });
      m.els.forEach((el, k) => {
        const on = sel[groupOf(k)] === k;
        el.classList.toggle("on", on);
        if (el.type === "checkbox") el.checked = on;
      });
      if (m.typed) {
        const copy = FEAT_COPY[uiLang];
        const text = copy.slice(0, Math.floor(copy.length * clamp01((sec - ui.type[0]) / (ui.type[1] - ui.type[0]))));
        if (m.typed.textContent !== text) m.typed.textContent = text;
      }
      if (m.chip && m.chip.textContent !== file) m.chip.textContent = file;
      if (m.pick) m.pick.selectedIndex = file ? 1 : 0;
      const dragging = Boolean(ui.drag) && sec >= ui.drag[0] && sec < ui.drag[1];
      if (m.range) {
        // the thumb follows the speed the canvas actually cuts at
        const t = Math.min(Math.max(sec, ui.drag[0]), ui.drag[1]);
        const cps = play.cps0 + (play.cps1 - play.cps0) * easeCurve(play.curve, t / play.duration);
        m.range.value = cps;
        m.range.classList.toggle("is-drag", dragging);
        m.num.textContent = Math.round(cps);
      }
      m.pane.style.setProperty("--p", Math.min(0.995, sec / play.duration));
      m.pane.classList.toggle("is-hold", Boolean(play.hold) && sec >= play.duration - 1);

      let i = -1;
      ck.forEach((c, j) => { if (c.t - MOCK.travel <= sec) i = j; });
      const last = Math.max(ck[ck.length - 1].t, ui.drag ? ui.drag[1] : 0);
      const [x, y] = mockPoint(m, i < 0 ? null : m.els.get(ck[i].k));
      m.cursor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      m.cursor.classList.toggle("is-on", i >= 0 && sec < Math.min(last + MOCK.linger, play.duration - 0.25));
      m.cursor.classList.toggle("is-drag", dragging);
      m.cursor.classList.toggle("is-press", ck.some(c => c.t <= sec && sec < c.t + MOCK.press));
    }

    // ---- per-kind behaviour: poster (still picture) and render (one animation frame) ----
    const KIND = {
      loop: {
        bake: bakeLoop,
        // a feat demo rests on its end state: the last cut and the finished mock
        poster(rt) {
          const f = rt.entry.frames;
          draw(rt, f[rt.spec.ui ? f.length - 1 : 0]);
          if (rt.spec.ui) mockAt(rt, Infinity);
        },
        render(rt, now) {
          const e = rt.entry;
          const play = rt.spec.play;
          const sec = (since(now, rt.t0) / 1000) % play.duration;
          const ci = e.sched.cutAt[Math.min(e.sched.totalFrames - 1, Math.floor(sec * FPS))] % e.frames.length;
          if (ci !== rt.last) {
            rt.last = ci;
            draw(rt, e.frames[ci]);
          }
          if (play.hold) {
            const hold = sec >= play.duration - 1 ? "1" : "";
            if (rt.el.dataset.hold !== hold) rt.el.dataset.hold = hold;
          }
          if (rt.spec.ui) mockAt(rt, sec);
        },
      },
      hero: {
        render(rt, now) {
          if (!hero.lock && since(now, hero.since) >= HERO_PHASE_MS) {
            const next = (hero.i + 1) % HERO_RATIOS.length;
            if (hero.entries[HERO_RATIOS[next]]) {
              hero.i = next;
              heroSetRatio(now);
              heroPrefetch();
            }
          }
          const e = heroEntry();
          const ci = Math.floor((since(now, hero.since) / 1000) * HERO_CPS) % e.frames.length;
          if (ci !== rt.last) {
            rt.last = ci;
            draw(rt, e.frames[ci]);
          }
        },
      },
    };

    // ---- scheduler ----
    function pick(group) {
      const g = DEMO_GROUPS[group];
      const list = members(group);
      const st = state[group];
      if (!list.length) return null;
      if (g.pick === "solo") return ready(list[0]) ? list[0] : null;
      if (g.pick === "select") {
        const rt = selected(group);
        return ready(rt) ? rt : null;
      }
      const ptr = byId.get(st.pointer);
      if (ptr && ready(ptr)) return ptr;
      if (!turnMs(group)) return null;
      const cand = list.filter(ready);
      if (!cand.length) return null;
      let cur = cand.find(rt => rt.spec.id === st.rot);
      if (!cur) {
        cur = cand[0];
        st.rot = cur.spec.id;
        st.rotAt = performance.now();
      }
      return cur;
    }

    function start(rt, now) {
      playing.set(rt.spec.group, rt);
      rt.t0 = now;
      rt.last = -1;
      rt.el.dataset.playing = "1";
      rt.el.dataset.demo = rt.spec.id;
      if (rt.spec.kind === "hero") {
        hero.since = now;
        heroPrefetch();
      }
    }

    function stop(rt) {
      playing.delete(rt.spec.group);
      delete rt.el.dataset.playing;
      delete rt.el.dataset.hold;
    }

    function sync() {
      const run = landingActive() && !REDUCE_MOTION.matches;
      for (const group of Object.keys(DEMO_GROUPS)) {
        const next = run ? pick(group) : null;
        const cur = playing.get(group);
        if (next === cur) continue;
        if (cur) stop(cur);
        if (next) start(next, performance.now());
      }
      if (playing.size && !raf) raf = requestAnimationFrame(tick);
    }

    function rotate(now) {
      for (const group of Object.keys(DEMO_GROUPS)) {
        const turn = turnMs(group);
        const st = state[group];
        if (!turn || st.pointer || now - st.rotAt < turn) continue;
        const cand = members(group).filter(ready);
        if (cand.length < 2) continue;
        const at = cand.findIndex(rt => rt.spec.id === st.rot);
        st.rot = cand[(at + 1) % cand.length].spec.id;
        st.rotAt = now;
        sync();
      }
    }

    function tick(now) {
      raf = 0;
      if (!playing.size) return;
      rotate(now);
      playing.forEach(rt => KIND[rt.spec.kind].render(rt, now));
      if (playing.size && !raf) raf = requestAnimationFrame(tick);
    }

    // ---- entry points ----
    function ensure(rt, front) {
      const spec = rt.spec;
      if (spec.kind === "hero") return heroEnsure(HERO_RATIOS[hero.i], front);
      const lang = uiLang;
      const key = [spec.id, langDep(spec) ? lang : "", rt.el.width, rt.el.height].join("|");
      return fetchEntry(key, () => KIND[spec.kind].bake(rt, lang), front, () => !wanted(rt)).then(e => {
        if (!e || (e.lang && e.lang !== uiLang)) return e;
        rt.entry = e;
        const shared = members(spec.group).some(o => o !== rt && o.el === rt.el);
        if (playing.get(spec.group) !== rt && (!shared || selected(spec.group) === rt)) KIND[spec.kind].poster(rt);
        sync();
        return e;
      });
    }

    function refresh() {
      if (!copyPack) return;
      // a chip or clip pinned a different word while the landing was hidden
      if (heroRt && hero.word && wanted(heroRt) && (gateWord() || HERO_WORD[uiLang]) !== hero.word) heroRefresh();
      // the hero first: pump() starts the first queued job at once, so a wall job queued ahead of it would run first
      if (heroRt && wanted(heroRt) && !heroEntry()) heroEnsure(HERO_RATIOS[hero.i], true);
      rts.forEach(rt => {
        if (rt.spec.kind !== "hero" && wanted(rt) && !rt.entry) ensure(rt, false);
      });
      sync();
    }

    function langChanged() {
      rts.forEach(rt => {
        if (rt.entry && rt.entry.lang && rt.entry.lang !== uiLang) rt.entry = null;
      });
      hero.entries = {};
      sync();
      for (const [k, e] of cache) {
        if (e.lang && e.lang !== uiLang) {
          release(e);
          cache.delete(k);
        }
      }
      if (heroRt) heroRefresh();
      refresh();
    }

    // what "make this" carries into the studio; the hover bar lists exactly these numbers
    const wallPreset = rt => {
      const p = rt.spec.parts[0];
      const play = rt.spec.play;
      return { word: p.word, loc: p.loc, ratio: rt.spec.ratio, hlColor: p.hlColor, hlStyle: p.hlStyle, zoom: p.zoom, cps0: play.cps0, cps1: play.cps1, curve: play.curve };
    };

    const CLICK = {
      wall(rt) {
        const preset = wallPreset(rt);
        pinWord(preset.word, preset);
      },
      platform(rt) {
        chooseFrame(rt.spec.ratio);
      },
      feat(rt) {
        state.feat.pointer = rt.spec.id;
        document.querySelectorAll(".feat-item").forEach(li => {
          const on = li.dataset.demoId === rt.spec.id;
          li.classList.toggle("is-on", on);
          li.querySelector("button").setAttribute("aria-pressed", String(on));
        });
        document.querySelectorAll(".feat-pane").forEach(p => p.classList.toggle("is-on", p.dataset.pane === rt.spec.id));
        mockAt(rt, 0);
        ensure(rt, true);
        sync();
      },
    };

    function activate(id) {
      const rt = byId.get(id);
      if (rt && CLICK[rt.spec.group]) CLICK[rt.spec.group](rt);
    }

    const trilingual = (en, zh, hant) => `<span class="lang-en">${en}</span><span class="lang-zh">${zh}</span><span class="lang-hant">${hant}</span>`;

    document.querySelectorAll(".clip[data-demo-id]").forEach(host => {
      const rt = byId.get(host.dataset.demoId);
      const media = host.querySelector(".clip-media");
      if (!rt || !media) return;
      const { cps0, cps1, zoom } = wallPreset(rt);
      const speed = cps0 === cps1 ? `${cps0}` : `${cps0}→${cps1}`;
      media.insertAdjacentHTML("beforeend", `<span class="clip-cta" aria-hidden="true">
        <span class="clip-go">${trilingual("Make this", "一键做同款", "一鍵做同款")}</span>
        <span class="clip-chips">
          <span class="clip-chip">${trilingual(`${speed} cuts/s`, `刀速 ${speed}/s`, `刀速 ${speed}/s`)}</span>
          <span class="clip-chip">${trilingual(`Zoom ×${zoom}`, `缩放 ×${zoom}`, `縮放 ×${zoom}`)}</span>
        </span>
      </span>`);
    });

    document.querySelectorAll("[data-demo-id]").forEach(host => {
      const rt = byId.get(host.dataset.demoId);
      if (!rt || DEMO_GROUPS[rt.spec.group].pick !== "hover") return;
      const st = state[rt.spec.group];
      const on = e => {
        if (e.pointerType === "touch") return;
        st.pointer = rt.spec.id;
        sync();
      };
      const off = () => {
        if (st.pointer !== rt.spec.id) return;
        st.pointer = "";
        sync();
      };
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      host.addEventListener("focusin", e => { if (e.target.matches(":focus-visible")) on(e); });
      host.addEventListener("focusout", off);
    });

    // near the viewport: bake; actually on screen: play
    const track = (set, options) => new IntersectionObserver(entries => {
      entries.forEach(en => (en.isIntersecting ? set.add(en.target) : set.delete(en.target)));
      refresh();
    }, options);
    const nearIO = track(near, { rootMargin: "160px 0px" });
    const shownIO = track(shown, { threshold: 0.1 });
    new Set(rts.map(rt => rt.el)).forEach(el => {
      nearIO.observe(el);
      shownIO.observe(el);
    });
    REDUCE_MOTION.addEventListener("change", sync);

    return { sync, refresh, langChanged, wordTyped, lockHero, activate };
  })();

  // The hero frame wears the #frames chrome: copy each card's pieces once and tag them with their ratio.
  // CSS shows the set that matches heroFrame's data-ratio, and picks the 抖音/小红书/B站 variant by UI language.
  function wearPlatformChrome() {
    const frame = $("heroFrame");
    const slot = { head: frame.querySelector(".hero-head"), foot: frame.querySelector(".hero-foot"), over: frame.querySelector(".hero-ui") };
    document.querySelectorAll(".plat[data-demo-id]").forEach(card => {
      const r = DEMOS.find(d => d.id === card.dataset.demoId).ratio;
      card.querySelectorAll(".plat-ui").forEach(piece => {
        const copy = piece.cloneNode(true);
        copy.dataset.r = r;
        (piece.closest(".plat-shot") ? slot.over : piece.classList.contains("plat-head") ? slot.head : slot.foot).append(copy);
      });
    });
  }

  function scrollToTop() {
    if (window.scrollY < 2) return Promise.resolve();
    if (REDUCE_MOTION.matches) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return Promise.resolve();
    }
    return new Promise(resolve => {
      const done = () => {
        clearTimeout(timer);
        window.removeEventListener("scrollend", done);
        resolve();
      };
      const timer = setTimeout(done, 1200);
      window.addEventListener("scrollend", done);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function openStudio() {
    if (studioOpen || studioOpening) return;
    const root = document.documentElement;
    const swap = () => {
      studioOpen = true;
      document.body.classList.add("is-studio");
      Demos.sync();
    };
    if (REDUCE_MOTION.matches) {
      swap();
      handleMotionEdit(false, 0);
      return;
    }
    if (!document.startViewTransition) {
      const el = $("studio");
      swap();
      el.classList.add("studio-enter");
      el.addEventListener("animationend", () => el.classList.remove("studio-enter"), { once: true });
      handleMotionEdit(false, 0);
      return;
    }
    root.classList.add("vt-pin");
    const vt = document.startViewTransition(async () => {
      swap();
      // one still frame so the video morphs onto the pinned word; the live loop starts after the morph
      await Promise.race([renderStaticHero().catch(() => {}), new Promise(r => setTimeout(r, 250))]);
    });
    studioOpening = vt.finished.catch(() => {}).then(() => {
      root.classList.remove("vt-pin");
      studioOpening = null;
      handleMotionEdit(false, 0);
    });
  }

  function applyStudioPreset(p) {
    if (p.ratio) applyRatioSelection(p.ratio);
    if (p.zoom && $("zoomRange")) {
      $("zoomRange").value = String(Math.round(p.zoom * 10));
      if ($("zoomVal")) $("zoomVal").textContent = (Number($("zoomRange").value) / 10).toFixed(1) + "×";
    }
    if (p.hlColor) {
      hlColor = p.hlColor;
      document.querySelectorAll("#hlColors button[data-hl]").forEach(b => b.classList.toggle("on", b.dataset.hl.toLowerCase() === p.hlColor.toLowerCase()));
    }
    if (p.hlStyle) {
      hlStyle = p.hlStyle;
      document.querySelectorAll("#hlStyleBtns button[data-hl-style]").forEach(b => b.classList.toggle("on", b.dataset.hlStyle === hlStyle));
    }
    if (p.cps0 && $("cpsRange")) {
      speedMode = p.cps1 && p.cps1 !== p.cps0 ? "ramp" : "const";
      document.querySelectorAll("#speedModeBtns button[data-speed-mode]").forEach(b => b.classList.toggle("on", b.dataset.speedMode === speedMode));
      if ($("rampGroup")) $("rampGroup").hidden = speedMode !== "ramp";
      $("cpsRange").value = String(p.cps0);
      if ($("cpsVal")) $("cpsVal").textContent = $("cpsRange").value;
      if (speedMode === "ramp" && $("cps2Range")) {
        $("cps2Range").value = String(p.cps1);
        if ($("cps2Val")) $("cps2Val").textContent = $("cps2Range").value;
      }
      if (p.curve) {
        curve = p.curve;
        document.querySelectorAll("#curveBtns button[data-curve]").forEach(b => b.classList.toggle("on", b.dataset.curve === curve));
      }
      updateCpsLabelUi();
    }
  }

  function pinWord(word, preset) {
    unlockPreviewAudio();
    const want = (preset && preset.loc) || (CJK_RE.test(word) && locale === "en" ? cjkLocale() : "");
    if (want && want !== locale) {
      const btn = document.querySelector(`#localeBtns button[data-locale="${want}"]`);
      if (btn) btn.click();
    }
    if (preset) applyStudioPreset(preset);
    kw.value = word;
    seedOffset += 1;
    updateCharCount();
    updateCustomBadge();
    if (studioOpen) handleMotionEdit(false, 0);
    scrollToTop().then(openStudio);
  }

  function chooseFrame(nextRatio) {
    applyRatioSelection(nextRatio);
    Demos.lockHero(nextRatio);
    if (studioOpen) {
      handleMotionEdit(false, 0);
      scrollToTop();
      return;
    }
    const top = $("top");
    if (top) top.scrollIntoView({ behavior: REDUCE_MOTION.matches ? "auto" : "smooth", block: "start" });
    if (gateInputs[0]) gateInputs[0].focus({ preventScroll: true });
  }

  gateInputs.forEach(inp => {
    inp.maxLength = MAX_CHARS;
    inp.addEventListener("input", e => {
      gateInputs.forEach(o => { if (o !== inp) o.value = inp.value; });
      if (!e.isComposing) Demos.wordTyped();
    });
    inp.addEventListener("compositionend", () => Demos.wordTyped());
  });

  document.querySelectorAll("[data-gate-word]").forEach(btn => {
    btn.addEventListener("click", () => {
      const w = (btn.dataset[uiLang] || btn.dataset.en || "").slice(0, MAX_CHARS);
      gateInputs.forEach(o => { o.value = w; });
      pinWord(w);
    });
  });

  document.querySelectorAll(".gate-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const inp = form.querySelector(".gate-input");
      const word = inp ? inp.value.trim().slice(0, MAX_CHARS) : "";
      if (!word) {
        if (inp) inp.focus();
        form.classList.remove("is-shake");
        void form.offsetWidth;
        form.classList.add("is-shake");
        return;
      }
      pinWord(word);
    });
  });

  function syncRatioButtonsUi() {
    document.querySelectorAll("#ratios button[data-ratio]").forEach(b => {
      b.classList.toggle("on", b.dataset.ratio === ratio);
    });
  }

  function applyRatioSelection(nextRatio) {
    if (!nextRatio || !SIZES[nextRatio]) return;
    ratio = nextRatio;
    syncRatioButtonsUi();
  }

  // legal view: each document lists its h3 sections in a sticky rail; the current section follows the scroll
  const legalToc = $("legalToc");
  const legalTocList = $("legalTocList");
  const legalHeads = () => [...$(legalPage).querySelectorAll(":scope > h3")];
  document.querySelectorAll("#legalView .legal-card").forEach(card => {
    card.querySelectorAll(":scope > h3").forEach((h, i) => { h.id = `${card.id}-s${i + 1}`; });
  });

  function renderLegalToc() {
    const heads = legalHeads();
    legalToc.hidden = heads.length === 0;
    legalTocList.replaceChildren(...heads.map(h => {
      const li = document.createElement("li");
      const m = h.textContent.trim().match(/^[\d.]+/);
      li.innerHTML = `<a href="#${h.id}" data-toc="${h.id}"><span class="legal-toc-no">${m ? m[0] : ""}</span><span class="lang-en">${h.dataset.tocEn}</span><span class="lang-zh">${h.dataset.tocZh}</span><span class="lang-hant">${h.dataset.tocHant}</span></a>`;
      return li;
    }));
  }

  function syncLegalSpy() {
    const heads = inLegalView ? legalHeads() : [];
    if (!heads.length) return;
    const atEnd = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const cur = atEnd ? heads[heads.length - 1] : heads.filter(h => h.getBoundingClientRect().top <= 140).pop() || heads[0];
    legalTocList.querySelectorAll("a").forEach(a => {
      if (a.dataset.toc === cur.id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  let legalSpyRaf = 0;
  window.addEventListener("scroll", () => {
    if (!inLegalView || legalSpyRaf) return;
    legalSpyRaf = requestAnimationFrame(() => { legalSpyRaf = 0; syncLegalSpy(); });
  }, { passive: true });

  // stopPropagation keeps the document-level #hash router from treating a section anchor as a page change
  legalTocList.addEventListener("click", e => {
    const a = e.target.closest("a[data-toc]");
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    $(a.dataset.toc).scrollIntoView({ behavior: REDUCE_MOTION.matches ? "auto" : "smooth", block: "start" });
  });

  function syncRouteFromHash({ smooth = false } = {}) {
    const rawHash = window.location.hash || "";
    const hash = rawHash.toLowerCase();
    const mainView = $("mainView");
    const legalView = $("legalView");
    const legalBackBtn = $("legalBackBtn");

    if (LEGAL_HASHES.has(hash) && legalView) {
      const enteringLegal = !inLegalView;
      inLegalView = true;
      legalPage = hash === "#legal" ? "privacy" : hash.slice(1);
      if (enteringLegal) {
        wasPlayingBeforeLegal = isPlaying;
        clearTimeout(inputDebounceTimer);
        if (isPlaying) stopPreviewPlayback(true);
        else previewToken += 1;
      }
      legalView.querySelectorAll(".legal-card").forEach(card => { card.hidden = card.id !== legalPage; });
      legalView.querySelectorAll("[data-legal-tab]").forEach(a => {
        if (a.dataset.legalTab === legalPage) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      renderLegalToc();
      document.body.classList.add("is-legal");
      if (mainView) mainView.hidden = true;
      legalView.hidden = false;
      if (legalBackBtn) legalBackBtn.hidden = false;
      syncDocumentTitle();
      stopCtaWordCycle();
      Demos.sync();
      window.scrollTo({ top: 0, behavior: "auto" });
      syncLegalSpy();
      return;
    }

    const wasLegal = inLegalView || Boolean(legalView && !legalView.hidden);
    inLegalView = false;
    document.body.classList.remove("is-legal");
    if (legalBackBtn) legalBackBtn.hidden = true;
    if (wasLegal) {
      if (legalView) legalView.hidden = true;
      if (mainView) mainView.hidden = false;
      syncDocumentTitle();
      window.scrollTo({ top: 0, behavior: "auto" });
      const shouldResume = livePreview || wasPlayingBeforeLegal;
      wasPlayingBeforeLegal = false;
      if (shouldResume && copyPack && !isExporting) {
        startPreviewPass({ fromUserGesture: false, resume: true });
      } else if (copyPack && !isExporting) {
        scheduleStaticHero(0);
      }
      syncCtaWordCycleState();
    }

    Demos.sync();

    if (rawHash && rawHash.length > 1) {
      let targetEl = null;
      try { targetEl = $(decodeURIComponent(rawHash.slice(1))); } catch { targetEl = $(rawHash.slice(1)); }
      if (targetEl && (!mainView || mainView.contains(targetEl))) {
        // #top is display:none while the studio stands in for the hero
        if (targetEl.id === "top") window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
        else targetEl.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      }
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
    const shouldRun = finalCtaInView && !inLegalView && !document.hidden && !REDUCE_MOTION.matches;
    if (!shouldRun) {
      stopCtaWordCycle();
      return;
    }
    if (ctaTimerId) return;
    ctaTimerId = setInterval(() => {
      ctaStepIdx += 1;
      applyCtaWordStep(ctaStepIdx);
    }, 170);
  }

  // bars fill once the comparison is mostly on screen and replay on the next visit. isIntersecting is true from the first
  // visible pixel, so the ratio gates the start; the reset waits until it has fully left, so a small scroll never rewinds it.
  function initCompareBars() {
    const cmp = $("cmp");
    if (!cmp) return;
    new IntersectionObserver(entries => {
      const en = entries[entries.length - 1];
      if (en.intersectionRatio >= 0.6) cmp.classList.add("is-in");
      else if (!en.isIntersecting) cmp.classList.remove("is-in");
    }, { threshold: [0, 0.6] }).observe(cmp);
  }

  // the hero's scroll hint fades out once the page moves and comes back at the top
  function initHeroHint() {
    const hint = $("heroHint");
    const sync = () => hint.classList.toggle("is-away", window.scrollY > 24);
    window.addEventListener("scroll", sync, { passive: true });
    sync();
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
    if (!e.target.closest(".select-pop")) {
      closeSelectMenus();
    }

    if (langMenu && !langMenu.hidden && !e.target.closest(".lang-pick")) setLangMenu(false);

    const langBtn = e.target.closest("#uiLangBtns button[data-ui-lang], [data-ui-lang-btn]");
    if (langBtn && langBtn.dataset.uiLang) {
      if (langBtn.dataset.uiLang !== uiLang) {
        applyUiLang(langBtn.dataset.uiLang, { syncClipLocale: true, persist: true });
      }
      setLangMenu(false, true);
      return;
    }

    const demoHost = e.target.closest("[data-demo-id]");
    if (demoHost) {
      Demos.activate(demoHost.dataset.demoId);
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

  const langTrigger = $("uiLangTrigger");
  const langMenu = $("uiLangBtns");
  const langItems = () => [...langMenu.querySelectorAll("button[data-ui-lang]")];

  function setLangMenu(open, refocus) {
    if (!langMenu) return;
    langMenu.hidden = !open;
    langTrigger.setAttribute("aria-expanded", String(open));
    if (open) (langItems().find(b => b.dataset.uiLang === uiLang) || langItems()[0]).focus();
    else if (refocus) langTrigger.focus();
  }

  if (langTrigger && langMenu) {
    langTrigger.addEventListener("click", () => setLangMenu(langMenu.hidden));
    langTrigger.addEventListener("keydown", e => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      setLangMenu(true);
    });
    langMenu.addEventListener("keydown", e => {
      const items = langItems();
      const at = items.indexOf(document.activeElement);
      const to = { ArrowDown: (at + 1) % items.length, ArrowUp: (at + items.length - 1) % items.length, Home: 0, End: items.length - 1 }[e.key];
      if (to !== undefined) {
        e.preventDefault();
        items[to].focus();
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setLangMenu(false, true);
      } else if (e.key === "Tab") {
        setLangMenu(false, true);
      }
    });
  }

  if (formatBtn && formatMenu) {
    formatBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (isExporting || formatBtn.disabled) return;
      closeSelectMenus();
      const willOpen = formatMenu.hidden;
      formatMenu.hidden = !willOpen;
      formatBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeFormatMenu();
      closeSelectMenus();
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
      const input = studioOpen ? kw : gateInputs[0];
      if (!isEditable && input && !inLegalView) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    }
  });

  wearPlatformChrome();
  syncRatioButtonsUi();
  initFaqAccordion();
  initCompareBars();
  initHeroHint();
  initCtaWordCycle();
  applyUiLang(uiLang, { syncClipLocale: true, persist: false });
  syncRouteFromHash({ smooth: false });

  window.addEventListener("hashchange", () => syncRouteFromHash({ smooth: false }));
  window.addEventListener("popstate", () => syncRouteFromHash({ smooth: false }));
  document.addEventListener("visibilitychange", () => {
    Demos.sync();
    syncCtaWordCycleState();
  });

  fetch("./copy.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(async j => {
      copyPack = j;
      Demos.refresh();
      if (studioOpen) {
        await renderStaticHero();
        if (livePreview && !isExporting && !inLegalView) {
          startPreviewPass({ fromUserGesture: false, resume: false });
        }
      }
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
      clearPending();
      isExporting = true;
      exportPct = 0;
      stopCtaWordCycle();
      const genBtn = $("generateBtn");
      genBtn.disabled = true;
      if (formatBtn) formatBtn.disabled = true;
      updateGenerateBtnUi();
      setTimelineState({ kind: "exporting", pct: 0 });
      window.gtag && gtag("event", "export_start", {
        format: (formatSelect.value || "").includes("webm") ? "webm" : "mp4",
        lang: uiLang
      });

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
          downloadBtn.download = `typepin.${ext}`;
          downloadBtn.click();
        }
        window.gtag && gtag("event", "export_video", { format: ext, lang: uiLang });
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
    descBuilder,
    renderCut,
    lensBlur,
    RANDOM_KEYWORDS,
    FONT_CATALOG,
    FONT_LOAD_SPECS,
    MAST_FAMILY,
    PAPER_KINDS,
  };
}
