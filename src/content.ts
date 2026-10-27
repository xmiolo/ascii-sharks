import { OceanEngine } from "./ocean/engine";
import { loadUrls, parsePattern, type PagePattern } from "./patterns";

let patterns: PagePattern[] = [];
let canvas: HTMLCanvasElement | null = null;
let engine: OceanEngine | null = null;

/** Walks up from body to the first opaque background; falls back to the OS theme. */
function pageIsDark() {
  for (const el of [document.body, document.documentElement]) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (!m || (m.length === 4 && Number(m[3]) === 0)) continue;
    const [r, g, b] = m.map(Number);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Overlay that never takes clicks. On dark pages "screen" drops the ocean's black
// background; on light pages the canvas is inverted and "multiply" drops the white.
function applyTheme(c: HTMLCanvasElement) {
  const dark = pageIsDark();
  c.style.mixBlendMode = dark ? "screen" : "multiply";
  c.style.filter = dark ? "none" : "invert(1)";
  c.style.opacity = dark ? "0.55" : "0.35";
}

function mount() {
  if (engine) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "0",
    fontFamily: 'ui-monospace, "Geist Mono", Menlo, monospace',
  });
  applyTheme(canvas);
  document.body.appendChild(canvas);
  engine = new OceanEngine(canvas);
}

function unmount() {
  engine?.destroy();
  canvas?.remove();
  engine = null;
  canvas = null;
}

function setUrls(urls: string[]) {
  patterns = urls.map(parsePattern).filter((p): p is PagePattern => p !== null);
}

loadUrls().then((urls) => {
  setUrls(urls);
  // Content scripts can't hook the page's history.pushState, so poll the URL
  // (and the theme, which these sites can switch without a reload).
  setInterval(() => {
    const url = new URL(location.href);
    if (patterns.some((p) => p.test(url))) mount();
    else unmount();
    if (canvas) applyTheme(canvas);
  }, 400);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.urls) loadUrls().then(setUrls);
});
