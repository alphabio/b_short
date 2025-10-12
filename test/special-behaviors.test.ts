// b_path:: test/special-behaviors.test.ts
import { describe, expect, it } from "vitest";
import { expand } from "../src/index";
import { assertNoDuplicateProperties } from "./helpers/assertions";

describe("!important handling", () => {
  it("should preserve !important and add warning", () => {
    const result = expand("margin: 10px !important;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      margin: "10px !important",
    });
    expect(result.issues.some((issue) => issue.name === "important-detected")).toBe(true);
  });

  it("should preserve !important declaration and process later declarations normally", () => {
    const result = expand("margin: 10px !important; margin-top: 5px;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      margin: "10px !important",
      "margin-top": "5px",
    });
    expect(
      result.issues.some(
        (issue) => issue.name === "important-detected" && issue.property === "margin"
      )
    ).toBe(true);
  });

  it("should expand shorthand and preserve !important in longhand", () => {
    const result = expand("margin: 10px; margin-top: 20px !important;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      "margin-top": "20px !important",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
    expect(
      result.issues.some(
        (issue) => issue.name === "important-detected" && issue.property === "margin-top"
      )
    ).toBe(true);
  });

  it("should not emit duplicate !important warning for failed shorthand parses", () => {
    const result = expand("grid: invalid-value !important;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ grid: "invalid-value !important" });

    // Count how many !important warnings are emitted
    const importantWarnings = result.issues.filter(
      (issue) => issue.name === "important-detected" && issue.property === "grid"
    );

    // Should only have one warning, not two (this was the bug we fixed)
    expect(importantWarnings).toHaveLength(1);
  });

  it("should preserve !important in CSS format output", () => {
    const result = expand("margin: 10px !important;", { format: "css" });
    expect(result.ok).toBe(true);
    expect(result.result).toBe("margin: 10px !important;");
    expect(result.issues.some((issue) => issue.name === "important-detected")).toBe(true);
  });
});

describe("expansion failure warnings", () => {
  it("should return original shorthand with warning when expansion fails", () => {
    const result = expand("grid: 100px / 200px auto-flow;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ grid: "100px / 200px auto-flow" });
    expect(
      result.issues.some((issue) => issue.name === "expansion-failed" && issue.property === "grid")
    ).toBe(true);
  });

  it("should expand valid declarations and preserve invalid ones with warnings", () => {
    const result = expand("grid: invalid-syntax; margin: 10px;", { format: "js" });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      grid: "invalid-syntax",
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
    expect(
      result.issues.some((issue) => issue.name === "expansion-failed" && issue.property === "grid")
    ).toBe(true);
  });
});

describe("non-shorthand property", () => {
  it("should return the property as-is for valid non-shorthand properties", () => {
    const { result } = expand("color: #00f;", { format: "js" });
    assertNoDuplicateProperties(
      result,
      "should return the property as-is for valid non-shorthand properties"
    );
    expect(result).toEqual({ color: "#00f" });
  });

  it("should return the property for unknown properties (validation will catch them)", () => {
    const { result } = expand("unknown-property: value;", { format: "js" });
    assertNoDuplicateProperties(
      result,
      "should return the property for unknown properties (validation will catch them)"
    );
    expect(result).toEqual({ "unknown-property": "value" });
  });
});

describe("format options", () => {
  it("should return CSS string when format is css", () => {
    const { result } = expand("margin: 10px;", { format: "css" });
    assertNoDuplicateProperties(result, "should return CSS string when format is css");
    expect(result).toBe(
      "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"
    );
  });

  it("should use custom indent and separator", () => {
    const { result } = expand("margin: 10px;", { format: "css", indent: 0, separator: " " });
    assertNoDuplicateProperties(result, "should use custom indent and separator");
    expect(result).toBe(
      "margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px;"
    );
  });

  it("should return object when format is js", () => {
    const { result } = expand("margin: 10px;", { format: "js" });
    assertNoDuplicateProperties(result, "should return object when format is js");
    expect(result).toEqual({
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
  });

  it("should handle multiple declarations", () => {
    const { result } = expand(
      `
      margin: 10px;
      padding: 5px;
    `,
      { format: "css" }
    );
    assertNoDuplicateProperties(result, "should handle multiple declarations");
    expect(result).toBe(
      "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;\npadding-top: 5px;\npadding-right: 5px;\npadding-bottom: 5px;\npadding-left: 5px;"
    );
  });
});
