import { describe, expect, it } from "vitest";
import expand from "../src/index";

describe("propertyGrouping option", () => {
  describe("by-property (default)", () => {
    it("should group all properties of the same type together", () => {
      const { result } = expand("margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-property",
      });

      const keys = Object.keys(result as Record<string, string>);

      // All border properties should come before margin properties (lower indices)
      expect(keys).toEqual([
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
      ]);
    });

    it("should work without specifying the option (default)", () => {
      const { result } = expand("margin: 5px; border-width: 10px;", {
        format: "js",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Should default to by-property
      expect(keys).toEqual([
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
      ]);
    });

    it("should maintain property type grouping with border shorthand", () => {
      const { result } = expand("margin: 5px; border: 1px solid red;", {
        format: "js",
        propertyGrouping: "by-property",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Border properties are already grouped by side in spec order (top, right, bottom, left)
      // Within each side: width, style, color
      // This is the CSS spec order for border properties
      expect(keys).toEqual([
        "border-top-width",
        "border-top-style",
        "border-top-color",
        "border-right-width",
        "border-right-style",
        "border-right-color",
        "border-bottom-width",
        "border-bottom-style",
        "border-bottom-color",
        "border-left-width",
        "border-left-style",
        "border-left-color",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
      ]);
    });
  });

  describe("by-side", () => {
    it("should group all properties of the same side together", () => {
      const { result } = expand("margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // All top properties, then all right properties, etc.
      expect(keys).toEqual([
        "border-top-width",
        "margin-top",
        "border-right-width",
        "margin-right",
        "border-bottom-width",
        "margin-bottom",
        "border-left-width",
        "margin-left",
      ]);
    });

    it("should maintain side grouping with border shorthand", () => {
      const { result } = expand("margin: 5px; border: 1px solid red;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Check that all "top" properties come together
      const topIndices = keys
        .map((k, i) => (k.includes("-top-") || k === "margin-top" ? i : -1))
        .filter((i) => i >= 0);
      const rightIndices = keys
        .map((k, i) => (k.includes("-right-") || k === "margin-right" ? i : -1))
        .filter((i) => i >= 0);
      const bottomIndices = keys
        .map((k, i) => (k.includes("-bottom-") || k === "margin-bottom" ? i : -1))
        .filter((i) => i >= 0);
      const leftIndices = keys
        .map((k, i) => (k.includes("-left-") || k === "margin-left" ? i : -1))
        .filter((i) => i >= 0);

      // Each side's properties should be contiguous
      expect(topIndices).toEqual([0, 1, 2, 3]);
      expect(rightIndices).toEqual([4, 5, 6, 7]);
      expect(bottomIndices).toEqual([8, 9, 10, 11]);
      expect(leftIndices).toEqual([12, 13, 14, 15]);
    });

    it("should group padding and border by side", () => {
      const { result } = expand("padding: 10px; border-style: solid;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Top properties together, right properties together, etc.
      expect(keys).toEqual([
        "border-top-style",
        "padding-top",
        "border-right-style",
        "padding-right",
        "border-bottom-style",
        "padding-bottom",
        "border-left-style",
        "padding-left",
      ]);
    });
  });

  describe("CSS format", () => {
    it("should apply by-property grouping to CSS string output", () => {
      const { result } = expand("border: 2px; margin: 2px;", {
        format: "css",
        propertyGrouping: "by-property",
      });

      // Border properties should all come before margin properties
      const lines = (result as string).split("\n");
      expect(lines).toEqual([
        "border-top-width: 2px;",
        "border-right-width: 2px;",
        "border-bottom-width: 2px;",
        "border-left-width: 2px;",
        "margin-top: 2px;",
        "margin-right: 2px;",
        "margin-bottom: 2px;",
        "margin-left: 2px;",
      ]);
    });

    it("should apply by-side grouping to CSS string output", () => {
      const { result } = expand("border: 2px; margin: 2px;", {
        format: "css",
        propertyGrouping: "by-side",
      });

      // Properties should be grouped by directional side
      const lines = (result as string).split("\n");
      expect(lines).toEqual([
        "border-top-width: 2px;",
        "margin-top: 2px;",
        "border-right-width: 2px;",
        "margin-right: 2px;",
        "border-bottom-width: 2px;",
        "margin-bottom: 2px;",
        "border-left-width: 2px;",
        "margin-left: 2px;",
      ]);
    });

    it("should default to by-property for CSS format", () => {
      const { result } = expand("border: 2px; margin: 2px;", {
        format: "css",
      });

      // Should default to by-property grouping
      const lines = (result as string).split("\n");
      expect(lines).toEqual([
        "border-top-width: 2px;",
        "border-right-width: 2px;",
        "border-bottom-width: 2px;",
        "border-left-width: 2px;",
        "margin-top: 2px;",
        "margin-right: 2px;",
        "margin-bottom: 2px;",
        "margin-left: 2px;",
      ]);
    });

    it("should apply by-property grouping when merging JS format", () => {
      // In CSS format, each shorthand is processed separately
      // To test grouping, we need to use JS format to see merged results
      const { result } = expand("margin: 5px; padding: 10px; border-width: 2px;", {
        format: "js",
        propertyGrouping: "by-property",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Border properties first (indices 70-81), then padding (210-213), then margin (200-203)
      const borderKeys = keys.filter((k) => k.startsWith("border-"));
      const marginKeys = keys.filter((k) => k.startsWith("margin-"));
      const paddingKeys = keys.filter((k) => k.startsWith("padding-"));

      // Border should come first (lower indices)
      expect(keys.indexOf(borderKeys[0])).toBeLessThan(keys.indexOf(marginKeys[0]));
      expect(keys.indexOf(borderKeys[0])).toBeLessThan(keys.indexOf(paddingKeys[0]));

      // Margin should come before padding (200-203 < 210-213)
      expect(keys.indexOf(marginKeys[0])).toBeLessThan(keys.indexOf(paddingKeys[0]));
    });

    it("should apply by-side grouping when merging JS format", () => {
      const { result } = expand("margin: 5px; padding: 10px; border-width: 2px;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Check that all "top" properties are together
      const topKeys = keys.filter((k) => k.includes("-top"));
      const topIndices = topKeys.map((k) => keys.indexOf(k));

      // All top properties should be consecutive
      const minTop = Math.min(...topIndices);
      const maxTop = Math.max(...topIndices);
      expect(maxTop - minTop).toBe(topKeys.length - 1);
    });
  });

  describe("mixed directional and non-directional properties", () => {
    it("should handle non-directional properties correctly with by-side grouping", () => {
      const { result } = expand("font-size: 16px; margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // font-size should come before directional properties (lower spec index)
      expect(keys[0]).toBe("font-size");

      // Then directional properties grouped by side
      const remainingKeys = keys.slice(1);
      expect(remainingKeys).toEqual([
        "border-top-width",
        "margin-top",
        "border-right-width",
        "margin-right",
        "border-bottom-width",
        "margin-bottom",
        "border-left-width",
        "margin-left",
      ]);
    });

    it("should handle non-directional properties correctly with by-property grouping", () => {
      const { result } = expand("font-size: 16px; margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-property",
      });

      const keys = Object.keys(result as Record<string, string>);

      // font-size should come before directional properties (lower spec index)
      expect(keys[0]).toBe("font-size");

      // Then directional properties grouped by property type
      const remainingKeys = keys.slice(1);
      expect(remainingKeys).toEqual([
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
      ]);
    });
  });
});
