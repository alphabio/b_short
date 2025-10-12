import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist",
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".js" : ".mjs",
    };
  },
  esbuildOptions(options) {
    options.logOverride = {
      ...options.logOverride,
      "this-is-undefined-in-esm": "silent",
    };
  },
  onSuccess: async () => {
    // Suppress the Rollup warning about mixed exports - this is intentional
    // Users can use: import expand from 'b_short' OR import { expand } from 'b_short'
  },
});
