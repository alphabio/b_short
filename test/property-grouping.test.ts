// b_path:: test/property-grouping.test.ts
import { describe, expect, it } from "vitest";
import { expand } from "../src/index";

// Helper functions for test assertions
const filterKeysByPrefix = (keys: string[], prefix: string) =>
  keys.filter((k) => k.startsWith(prefix));

const getDirectionalIndices = (keys: string[], direction: string) =>
  keys.map((k, i) => (k.includes(direction) ? i : -1)).filter((i) => i >= 0);

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
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
      ]);
    });

    it("should work without specifying the option (default)", () => {
      const { result } = expand("margin: 5px; border-width: 10px;", {
        format: "js",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Should default to by-property
      expect(keys).toEqual([
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
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
        "borderTopWidth",
        "borderTopStyle",
        "borderTopColor",
        "borderRightWidth",
        "borderRightStyle",
        "borderRightColor",
        "borderBottomWidth",
        "borderBottomStyle",
        "borderBottomColor",
        "borderLeftWidth",
        "borderLeftStyle",
        "borderLeftColor",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
      ]);
    });
  });

  describe("bySide", () => {
    it("should group all properties of the same side together", () => {
      const { result } = expand("margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // All top properties, then all right properties, etc.
      expect(keys).toEqual([
        "borderTopWidth",
        "marginTop",
        "borderRightWidth",
        "marginRight",
        "borderBottomWidth",
        "marginBottom",
        "borderLeftWidth",
        "marginLeft",
      ]);
    });

    it("should maintain side grouping with border shorthand", () => {
      const { result } = expand("margin: 5px; border: 1px solid red;", {
        format: "js",
        propertyGrouping: "by-side",
      });

      const keys = Object.keys(result as Record<string, string>);

      // Check that all directional properties are grouped by side
      const topIndices = getDirectionalIndices(keys, "Top");
      const rightIndices = getDirectionalIndices(keys, "Right");
      const bottomIndices = getDirectionalIndices(keys, "Bottom");
      const leftIndices = getDirectionalIndices(keys, "Left");

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
        "borderTopStyle",
        "paddingTop",
        "borderRightStyle",
        "paddingRight",
        "borderBottomStyle",
        "paddingBottom",
        "borderLeftStyle",
        "paddingLeft",
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
        "border-top-style: none;",
        "border-top-color: currentcolor;",
        "border-right-width: 2px;",
        "border-right-style: none;",
        "border-right-color: currentcolor;",
        "border-bottom-width: 2px;",
        "border-bottom-style: none;",
        "border-bottom-color: currentcolor;",
        "border-left-width: 2px;",
        "border-left-style: none;",
        "border-left-color: currentcolor;",
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
        "border-top-style: none;",
        "border-top-color: currentcolor;",
        "margin-top: 2px;",
        "border-right-width: 2px;",
        "border-right-style: none;",
        "border-right-color: currentcolor;",
        "margin-right: 2px;",
        "border-bottom-width: 2px;",
        "border-bottom-style: none;",
        "border-bottom-color: currentcolor;",
        "margin-bottom: 2px;",
        "border-left-width: 2px;",
        "border-left-style: none;",
        "border-left-color: currentcolor;",
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
        "border-top-style: none;",
        "border-top-color: currentcolor;",
        "border-right-width: 2px;",
        "border-right-style: none;",
        "border-right-color: currentcolor;",
        "border-bottom-width: 2px;",
        "border-bottom-style: none;",
        "border-bottom-color: currentcolor;",
        "border-left-width: 2px;",
        "border-left-style: none;",
        "border-left-color: currentcolor;",
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
      const borderKeys = filterKeysByPrefix(keys, "border");
      const marginKeys = filterKeysByPrefix(keys, "margin");
      const paddingKeys = filterKeysByPrefix(keys, "padding");

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
      const topIndices = getDirectionalIndices(keys, "Top");

      // All top properties should be consecutive
      const minTop = Math.min(...topIndices);
      const maxTop = Math.max(...topIndices);
      expect(maxTop - minTop).toBe(topIndices.length - 1);
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
      expect(keys[0]).toBe("fontSize");

      // Then directional properties grouped by side
      const remainingKeys = keys.slice(1);
      expect(remainingKeys).toEqual([
        "borderTopWidth",
        "marginTop",
        "borderRightWidth",
        "marginRight",
        "borderBottomWidth",
        "marginBottom",
        "borderLeftWidth",
        "marginLeft",
      ]);
    });

    it("should handle non-directional properties correctly with by-property grouping", () => {
      const { result } = expand("font-size: 16px; margin: 5px; border-width: 10px;", {
        format: "js",
        propertyGrouping: "by-property",
      });

      const keys = Object.keys(result as Record<string, string>);

      // font-size should come before directional properties (lower spec index)
      expect(keys[0]).toBe("fontSize");

      // Then directional properties grouped by property type
      const remainingKeys = keys.slice(1);
      expect(remainingKeys).toEqual([
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
      ]);
    });
  });

  describe("complex multi-property CSS with comments", () => {
    it("should handle a complex CSS string with multiple shorthands, comments, and invalid properties", () => {
      const css = `/* This is a comment */
margin: 10px auto 5px;
padding-left: 20px;
background: url(bg.png) no-repeat center/cover #eee content-box;
font: italic small-caps bold 1.2em/1.5 "Helvetica Neue", sans-serif;
border-top: 2px dashed blue;
flex: 1 1 auto;
text-align: center;
color: #333;
width: 100%;
height: calc(100vh - 50px);
z-index: 99;
display: flex;
invalid-property: some-value; /* An invalid property to see if it's flagged */
transition: opacity 0.3s ease-in, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;

      const result = expand(css, { format: "css", propertyGrouping: "by-side" });

      expect(result.ok).toBe(true);
      expect(result.result).toBe(
        `transition-property: opacity, transform;
transition-duration: 0.3s, 0.5s;
transition-timing-function: ease-in, cubic-bezier(0.175, 0.885, 0.32, 1.275);
transition-delay: 0s, 0s;
background-image: url(bg.png);
background-position-x: center;
background-position-y: center;
background-size: cover;
background-repeat: no-repeat;
background-attachment: scroll;
background-origin: content-box;
background-clip: content-box;
background-color: #eee;
font-style: italic;
font-variant: small-caps;
font-weight: bold;
font-stretch: normal;
font-size: 1.2em;
line-height: 1.5;
font-family: "Helvetica Neue", sans-serif;
flex-grow: 1;
flex-shrink: 1;
flex-basis: auto;
border-top-width: 2px;
border-top-style: dashed;
border-top-color: blue;
margin-top: 10px;
margin-right: auto;
margin-bottom: 5px;
margin-left: auto;
padding-left: 20px;
color: #333;
display: flex;
height: calc(100vh - 50px);
invalid-property: some-value;
text-align: center;
width: 100%;
z-index: 99;`
      );

      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].property).toBe("invalid-property");
      expect(result.issues[0].name).toBe("SyntaxReferenceError");
    });
  });
});
