// b_path:: test/partial-longhand-expansion.test.ts

import { describe, expect, it } from "vitest";
import { expand } from "../src/index";

describe("Partial Longhand Expansion", () => {
  describe("Disabled by default", () => {
    it("should not expand when flag is false", () => {
      const result = expand("border-top-width: 1px;", { format: "js" });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ borderTopWidth: "1px" });
    });

    it("should not expand when flag is omitted", () => {
      const result = expand("margin-top: 10px;", { format: "js" });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ marginTop: "10px" });
    });

    it("should not expand with explicit false", () => {
      const result = expand("padding-left: 5px;", {
        format: "js",
        expandPartialLonghand: false,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ paddingLeft: "5px" });
    });
  });

  describe("Border Width Properties", () => {
    it("should expand border-top-width", () => {
      const result = expand("border-top-width: 1px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "1px",
        borderRightWidth: "medium",
        borderBottomWidth: "medium",
        borderLeftWidth: "medium",
      });
    });

    it("should expand border-right-width", () => {
      const result = expand("border-right-width: 2em;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "medium",
        borderRightWidth: "2em",
        borderBottomWidth: "medium",
        borderLeftWidth: "medium",
      });
    });

    it("should expand border-bottom-width", () => {
      const result = expand("border-bottom-width: thick;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "medium",
        borderRightWidth: "medium",
        borderBottomWidth: "thick",
        borderLeftWidth: "medium",
      });
    });

    it("should expand border-left-width", () => {
      const result = expand("border-left-width: 0;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "medium",
        borderRightWidth: "medium",
        borderBottomWidth: "medium",
        borderLeftWidth: "0",
      });
    });
  });

  describe("Border Style Properties", () => {
    it("should expand border-top-style", () => {
      const result = expand("border-top-style: solid;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: "solid",
        borderRightStyle: "none",
        borderBottomStyle: "none",
        borderLeftStyle: "none",
      });
    });

    it("should expand border-right-style", () => {
      const result = expand("border-right-style: dashed;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: "none",
        borderRightStyle: "dashed",
        borderBottomStyle: "none",
        borderLeftStyle: "none",
      });
    });

    it("should expand border-bottom-style", () => {
      const result = expand("border-bottom-style: dotted;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: "none",
        borderRightStyle: "none",
        borderBottomStyle: "dotted",
        borderLeftStyle: "none",
      });
    });

    it("should expand border-left-style", () => {
      const result = expand("border-left-style: double;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: "none",
        borderRightStyle: "none",
        borderBottomStyle: "none",
        borderLeftStyle: "double",
      });
    });
  });

  describe("Border Color Properties", () => {
    it("should expand border-top-color", () => {
      const result = expand("border-top-color: red;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopColor: "red",
        borderRightColor: "currentcolor",
        borderBottomColor: "currentcolor",
        borderLeftColor: "currentcolor",
      });
    });

    it("should expand border-right-color", () => {
      const result = expand("border-right-color: #ff0;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopColor: "currentcolor",
        borderRightColor: "#ff0",
        borderBottomColor: "currentcolor",
        borderLeftColor: "currentcolor",
      });
    });

    it("should expand border-bottom-color with rgb", () => {
      const result = expand("border-bottom-color: rgb(0, 0, 0);", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      const res = result.result as Record<string, string>;
      expect(res.borderTopColor).toBe("currentcolor");
      expect(res.borderRightColor).toBe("currentcolor");
      expect(res.borderBottomColor).toContain("rgb(0");
      expect(res.borderLeftColor).toBe("currentcolor");
    });

    it("should expand border-left-color with hsl", () => {
      const result = expand("border-left-color: hsl(120, 100%, 50%);", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      const res = result.result as Record<string, string>;
      expect(res.borderTopColor).toBe("currentcolor");
      expect(res.borderRightColor).toBe("currentcolor");
      expect(res.borderBottomColor).toBe("currentcolor");
      expect(res.borderLeftColor).toContain("hsl(120");
    });
  });

  describe("Margin Properties", () => {
    it("should expand margin-top", () => {
      const result = expand("margin-top: 10px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "10px",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
      });
    });

    it("should expand margin-right", () => {
      const result = expand("margin-right: 20px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "0",
        marginRight: "20px",
        marginBottom: "0",
        marginLeft: "0",
      });
    });

    it("should expand margin-bottom", () => {
      const result = expand("margin-bottom: 1em;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "0",
        marginRight: "0",
        marginBottom: "1em",
        marginLeft: "0",
      });
    });

    it("should expand margin-left", () => {
      const result = expand("margin-left: auto;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "0",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "auto",
      });
    });
  });

  describe("Padding Properties", () => {
    it("should expand padding-top", () => {
      const result = expand("padding-top: 5px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "5px",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "0",
      });
    });

    it("should expand padding-right", () => {
      const result = expand("padding-right: 15px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "0",
        paddingRight: "15px",
        paddingBottom: "0",
        paddingLeft: "0",
      });
    });

    it("should expand padding-bottom", () => {
      const result = expand("padding-bottom: 2rem;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "2rem",
        paddingLeft: "0",
      });
    });

    it("should expand padding-left", () => {
      const result = expand("padding-left: 10%;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "10%",
      });
    });
  });

  describe("Positioning Properties", () => {
    it("should expand top", () => {
      const result = expand("top: 0;", { format: "js", expandPartialLonghand: true });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        top: "0",
        right: "auto",
        bottom: "auto",
        left: "auto",
      });
    });

    it("should expand right", () => {
      const result = expand("right: 10px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        top: "auto",
        right: "10px",
        bottom: "auto",
        left: "auto",
      });
    });

    it("should expand bottom", () => {
      const result = expand("bottom: 20%;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        top: "auto",
        right: "auto",
        bottom: "20%",
        left: "auto",
      });
    });

    it("should expand left", () => {
      const result = expand("left: 5em;", { format: "js", expandPartialLonghand: true });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "5em",
      });
    });
  });

  describe("Multiple Properties", () => {
    it("should expand multiple partial directional properties", () => {
      const result = expand("margin-top: 10px; padding-left: 5px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "10px",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "5px",
      });
    });

    it("should expand multiple border properties", () => {
      const result = expand("border-top-width: 1px; border-left-style: dashed;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "1px",
        borderRightWidth: "medium",
        borderBottomWidth: "medium",
        borderLeftWidth: "medium",
        borderTopStyle: "none",
        borderRightStyle: "none",
        borderBottomStyle: "none",
        borderLeftStyle: "dashed",
      });
    });

    it("should not expand already complete directional sets", () => {
      const result = expand("margin: 10px; padding-top: 5px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "10px",
        marginRight: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
        paddingTop: "5px",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "0",
      });
    });
  });

  describe("CSS Format Output", () => {
    it("should work with CSS format for border-top-width", () => {
      const result = expand("border-top-width: 1px;", {
        format: "css",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toBe(
        "border-top-width: 1px;\nborder-right-width: medium;\nborder-bottom-width: medium;\nborder-left-width: medium;"
      );
    });

    it("should work with CSS format for margin-top", () => {
      const result = expand("margin-top: 10px;", {
        format: "css",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toBe(
        "margin-top: 10px;\nmargin-right: 0;\nmargin-bottom: 0;\nmargin-left: 0;"
      );
    });

    it("should work with CSS format and custom separator", () => {
      const result = expand("padding-left: 5px;", {
        format: "css",
        expandPartialLonghand: true,
        separator: " ",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toBe(
        "padding-top: 0; padding-right: 0; padding-bottom: 0; padding-left: 5px;"
      );
    });
  });

  describe("Property Grouping", () => {
    it("should respect by-property grouping", () => {
      const result = expand("border-top-width: 1px;", {
        format: "js",
        expandPartialLonghand: true,
        propertyGrouping: "by-property",
      });
      expect(result.ok).toBe(true);
      const keys = Object.keys(result.result as Record<string, string>);
      expect(keys).toEqual([
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
      ]);
    });

    it("should respect by-side grouping", () => {
      const result = expand("margin-top: 10px;", {
        format: "js",
        expandPartialLonghand: true,
        propertyGrouping: "by-side",
      });
      expect(result.ok).toBe(true);
      const keys = Object.keys(result.result as Record<string, string>);
      expect(keys).toEqual(["marginTop", "marginRight", "marginBottom", "marginLeft"]);
    });
  });

  describe("Conflict Resolution", () => {
    it("should handle partial longhand followed by shorthand", () => {
      const result = expand("border-top-width: 5px; border-width: 1px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      // border-width should override the expanded border-top-width
      expect(result.result).toEqual({
        borderTopWidth: "1px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderLeftWidth: "1px",
      });
    });

    it("should handle shorthand followed by partial longhand", () => {
      const result = expand("border-width: 1px; border-top-width: 5px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      // Explicit border-top-width should override
      expect(result.result).toEqual({
        borderTopWidth: "5px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderLeftWidth: "1px",
      });
    });

    it("should handle margin shorthand followed by partial", () => {
      const result = expand("margin: 10px; margin-top: 20px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "20px",
        marginRight: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should not affect non-directional properties", () => {
      const result = expand("font-size: 16px; margin-top: 10px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        fontSize: "16px",
        marginTop: "10px",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
      });
    });

    it("should work with inherit keyword", () => {
      const result = expand("margin-top: inherit;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "inherit",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
      });
    });

    it("should work with initial keyword", () => {
      const result = expand("border-top-style: initial;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: "initial",
        borderRightStyle: "none",
        borderBottomStyle: "none",
        borderLeftStyle: "none",
      });
    });

    it("should work with unset keyword", () => {
      const result = expand("padding-bottom: unset;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "unset",
        paddingLeft: "0",
      });
    });

    it("should handle calc() values", () => {
      const result = expand("margin-left: calc(100% - 20px);", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "0",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "calc(100% - 20px)",
      });
    });

    it("should handle negative values", () => {
      const result = expand("margin-top: -10px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "-10px",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
      });
    });
  });

  describe("Scroll Properties", () => {
    it("should expand scroll-margin-top", () => {
      const result = expand("scroll-margin-top: 10px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        scrollMarginTop: "10px",
        scrollMarginRight: "0",
        scrollMarginBottom: "0",
        scrollMarginLeft: "0",
      });
    });

    it("should expand scroll-padding-bottom", () => {
      const result = expand("scroll-padding-bottom: 20px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        scrollPaddingTop: "auto",
        scrollPaddingRight: "auto",
        scrollPaddingBottom: "20px",
        scrollPaddingLeft: "auto",
      });
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle mix of expanded and non-expanded properties", () => {
      const result = expand(
        "border-top-width: 1px; color: red; margin-left: 10px; display: block;",
        {
          format: "js",
          expandPartialLonghand: true,
        }
      );
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: "1px",
        borderRightWidth: "medium",
        borderBottomWidth: "medium",
        borderLeftWidth: "medium",
        color: "red",
        marginTop: "0",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "10px",
        display: "block",
      });
    });

    it("should handle two partial sides of same property type", () => {
      const result = expand("margin-top: 10px; margin-bottom: 20px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        marginTop: "10px",
        marginRight: "0",
        marginBottom: "20px",
        marginLeft: "0",
      });
    });

    it("should handle three partial sides of same property type", () => {
      const result = expand("padding-top: 5px; padding-right: 10px; padding-bottom: 15px;", {
        format: "js",
        expandPartialLonghand: true,
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        paddingTop: "5px",
        paddingRight: "10px",
        paddingBottom: "15px",
        paddingLeft: "0",
      });
    });

    it("should not expand when all four sides are already specified", () => {
      const result = expand(
        "margin-top: 1px; margin-right: 2px; margin-bottom: 3px; margin-left: 4px;",
        {
          format: "js",
          expandPartialLonghand: true,
        }
      );
      expect(result.ok).toBe(true);
      // Should have exactly 4 properties, no extras
      expect(Object.keys(result.result as Record<string, string>)).toHaveLength(4);
      expect(result.result).toEqual({
        marginTop: "1px",
        marginRight: "2px",
        marginBottom: "3px",
        marginLeft: "4px",
      });
    });
  });
});
