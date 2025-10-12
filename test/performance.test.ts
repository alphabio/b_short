/**
 * Performance regression tests for b_short.
 * Ensures that performance stays within acceptable bounds.
 */

import { describe, expect, it } from "vitest";
import { expand } from "../src/index";

describe("Performance", () => {
  const PERFORMANCE_THRESHOLD_MS = 10; // Maximum acceptable time per operation

  it("should expand simple margin within threshold", () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      expand("margin: 10px", { format: "js" });
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
  });

  it("should expand complex background within threshold", () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      expand("background: url(img.png) center / cover no-repeat red", { format: "js" });
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
  });

  it("should expand multi-layer animation within threshold", () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      expand("animation: spin 1s linear infinite, fade 2s ease-in-out", { format: "js" });
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
  });

  it("should expand with property grouping within threshold", () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      expand("margin: 5px; border-width: 10px; padding: 8px", {
        format: "js",
        propertyGrouping: "by-side",
      });
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
  });

  it("should handle repeated identical values efficiently (cache test)", () => {
    const start = performance.now();
    const iterations = 5000;

    // Same value repeated - should benefit from caching
    for (let i = 0; i < iterations; i++) {
      expand("margin: 10px", { format: "js" });
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    // Cached operations should be significantly faster
    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS / 2);
  });
});
