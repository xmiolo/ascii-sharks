import { OceanEngine } from "../src";

// Paths of each site's empty "home" screen. All three are SPAs (or close to it),
// so the path is re-checked while the tab lives.
const HOME_PATHS: Record<string, Set<string>> = {
  "claude.ai": new Set(["/", "/new"]),
  "chatgpt.com": new Set(["/"]),
  "www.google.com": new Set(["/", "/webhp"]),
  "www.google.com.br": new Set(["/", "/webhp"]),
};

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

// Content scripts can't hook the page's history.pushState, so poll the path
// (and the theme, which these sites can switch without a reload).
const homePaths = HOME_PATHS[location.hostname];
if (homePaths) {
  setInterval(() => {
    if (homePaths.has(location.pathname)) mount();
    else unmount();
    if (canvas) applyTheme(canvas);
  }, 400);
}
