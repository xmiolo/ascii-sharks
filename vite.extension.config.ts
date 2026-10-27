import { defineConfig } from "vite";

// Bundles the content script as a single IIFE (content scripts can't be ES modules)
// and copies extension/public (manifest) next to it. Load dist-extension/ unpacked.
export default defineConfig({
  publicDir: "extension/public",
  build: {
    outDir: "dist-extension",
    emptyOutDir: true,
    lib: {
      entry: "extension/content.ts",
      name: "AsciiSharks",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
});
