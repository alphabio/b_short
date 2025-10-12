// b_path:: benchmarks/expand.bench.ts
import { Bench } from "tinybench";
import { expand } from "../src/index";

/**
 * Performance benchmark suite for b_short CSS expansion.
 *
 * Tests various CSS shorthands to track performance regressions:
 * - Simple shorthands (margin, padding, border)
 * - Complex shorthands (background, font, animation)
 * - Multi-layer properties (backgrounds, animations)
 * - Property grouping strategies
 * - Output format variations
 */
async function runBenchmarks() {
  const bench = new Bench({ time: 1000 });

  // Simple shorthands
  bench
    .add("margin: 10px", () => {
      expand("margin: 10px", { format: "js" });
    })
    .add("padding: 5px 10px", () => {
      expand("padding: 5px 10px", { format: "js" });
    })
    .add("border: 1px solid red", () => {
      expand("border: 1px solid red", { format: "js" });
    });

  // Complex shorthands
  bench
    .add("background: url(img.png) center / cover no-repeat", () => {
      expand("background: url(img.png) center / cover no-repeat", { format: "js" });
    })
    .add("font: italic bold 16px/1.5 Arial, sans-serif", () => {
      expand("font: italic bold 16px/1.5 Arial, sans-serif", { format: "js" });
    })
    .add("animation: spin 1s ease-in-out infinite", () => {
      expand("animation: spin 1s ease-in-out infinite", { format: "js" });
    });

  // Multi-layer
  bench
    .add("background: multi-layer (2 layers)", () => {
      expand("background: url(a.png) top left, url(b.png) center", { format: "js" });
    })
    .add("animation: multi-layer (3 animations)", () => {
      expand("animation: spin 1s, fade 2s, slide 3s", { format: "js" });
    });

  // Property grouping
  bench
    .add("margin + border (by-property)", () => {
      expand("margin: 5px; border-width: 10px", { format: "js", propertyGrouping: "by-property" });
    })
    .add("margin + border (by-side)", () => {
      expand("margin: 5px; border-width: 10px", { format: "js", propertyGrouping: "by-side" });
    });

  // CSS format
  bench
    .add("margin: 10px (CSS output)", () => {
      expand("margin: 10px", { format: "css" });
    })
    .add("border: 1px solid red (CSS output)", () => {
      expand("border: 1px solid red", { format: "css" });
    });

  await bench.run();

  console.log("\n📊 Benchmark Results\n");
  console.log("═".repeat(80));
  console.table(
    bench.tasks.map((task) => ({
      "Test Case": task.name,
      "ops/sec": task.result ? Math.round(task.result.hz).toLocaleString() : "N/A",
      "avg (ms)": task.result ? (task.result.mean * 1000).toFixed(4) : "N/A",
      "min (ms)": task.result ? (task.result.min * 1000).toFixed(4) : "N/A",
      "max (ms)": task.result ? (task.result.max * 1000).toFixed(4) : "N/A",
    }))
  );
  console.log("═".repeat(80));
  console.log("\n✅ Benchmarks complete!\n");
}

runBenchmarks().catch(console.error);
