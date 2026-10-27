// Bundles the extension into dist/: each entry becomes one classic script
// (content scripts can't be ES modules), next to the files in static/.
import { build } from "esbuild";
import { cpSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
cpSync("static", "dist", { recursive: true });

await build({
  entryPoints: ["src/background.ts", "src/content.ts", "src/options.ts"],
  outdir: "dist",
  bundle: true,
  format: "iife",
  target: "chrome110",
  minify: false,
  logLevel: "info",
});
