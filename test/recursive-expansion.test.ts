// b_path:: test/recursive-expansion.test.ts

import { describe, expect, it } from "vitest";
import { expand } from "../src";

describe("Recursive shorthand expansion", () => {
  it("should recursively expand background-position to -x and -y", () => {
    const result = expand("background: url(bg.png) center center / 50% 50%", {
      format: "css",
    });

    expect(result.ok).toBe(true);
    expect(result.result).toContain("background-position-x");
    expect(result.result).toContain("background-position-y");
    expect(result.result).not.toContain("background-position:");
  });

  it("should handle complex multi-layer backgrounds with position expansion", () => {
    const css = `
      background:
        linear-gradient(45deg, rgba(255, 0, 0, 0.7), rgba(0, 0, 255, 0.7)),
        url('pattern.svg') no-repeat center center / 50% 50%,
        repeating-radial-gradient(circle, rgba(0, 255, 0, 0.5) 0, rgba(0, 255, 0, 0.5) 10px, transparent 10px, transparent 20px),
        #333;
    `;

    const result = expand(css, { format: "css" });

    expect(result.ok).toBe(true);
    // Multi-layer background-position values are NOT recursively expanded
    // They stay as background-position (composite longhand) because layer-aware
    // splitting is needed first before per-layer expansion
    expect(result.result).toContain("background-position:");
    expect(result.result).not.toContain("background-position-x");
    expect(result.result).not.toContain("background-position-y");
  });

  it("should expand background-position when used directly", () => {
    const result = expand("background-position: left 10px top 20px", {
      format: "css",
    });

    expect(result.ok).toBe(true);
    expect(result.result).toContain("background-position-x");
    expect(result.result).toContain("background-position-y");
  });

  it("should handle background with only position value", () => {
    const result = expand("background: center top", { format: "css" });

    expect(result.ok).toBe(true);
    expect(result.result).toContain("background-position-x");
    expect(result.result).toContain("background-position-y");
  });

  it("should work in JS format too", () => {
    const result = expand("background: url(bg.png) right bottom", {
      format: "js",
    });

    expect(result.ok).toBe(true);
    expect(result.result).toHaveProperty("backgroundPositionX");
    expect(result.result).toHaveProperty("backgroundPositionY");
    expect(result.result).not.toHaveProperty("backgroundPosition");
  });

  it("should not break single-level expansion", () => {
    const result = expand("margin: 10px 20px", { format: "css" });

    expect(result.ok).toBe(true);
    expect(result.result).toContain("margin-top");
    expect(result.result).toContain("margin-right");
    expect(result.result).toContain("margin-bottom");
    expect(result.result).toContain("margin-left");
  });
});
