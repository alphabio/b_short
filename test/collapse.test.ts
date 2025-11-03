// b_path:: test/collapse.test.ts

import { describe, expect, test } from "vitest";
import { collapse, collapseRegistry, getCollapsibleShorthands } from "../src";

describe("Collapse API", () => {
  describe("collapse()", () => {
    test("collapses overflow with same values", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "hidden",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ overflow: "hidden" });
      expect(result.issues).toEqual([]);
    });

    test("collapses overflow with different values", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ overflow: "hidden auto" });
      expect(result.issues).toEqual([]);
    });

    test("keeps longhands if incomplete with warning", () => {
      const result = collapse({
        "overflow-x": "hidden",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ "overflow-x": "hidden" });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].name).toBe("incomplete-longhands");
      expect(result.issues[0].property).toBe("overflow");
    });

    test("mixes collapsed and non-collapsed properties", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "hidden",
        "margin-top": "10px",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        overflow: "hidden",
        "margin-top": "10px",
      });
      expect(result.issues).toEqual([]);
    });

    test("returns empty object for empty input", () => {
      const result = collapse({});
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({});
      expect(result.issues).toEqual([]);
    });

    test("collapses flex-flow with both values", () => {
      const result = collapse({
        "flex-direction": "column",
        "flex-wrap": "wrap",
      });
      expect(result.result).toEqual({ "flex-flow": "column wrap" });
    });

    test("collapses flex-flow with single value", () => {
      const result = collapse({
        "flex-direction": "row-reverse",
      });
      expect(result.result).toEqual({ "flex-flow": "row-reverse" });
    });

    test("collapses place-content with same values", () => {
      const result = collapse({
        "align-content": "center",
        "justify-content": "center",
      });
      expect(result.result).toEqual({ "place-content": "center" });
    });

    test("collapses place-content with different values", () => {
      const result = collapse({
        "align-content": "start",
        "justify-content": "space-between",
      });
      expect(result.result).toEqual({ "place-content": "start space-between" });
    });

    test("collapses place-items with same values", () => {
      const result = collapse({
        "align-items": "center",
        "justify-items": "center",
      });
      expect(result.result).toEqual({ "place-items": "center" });
    });

    test("collapses place-items with different values", () => {
      const result = collapse({
        "align-items": "start",
        "justify-items": "end",
      });
      expect(result.result).toEqual({ "place-items": "start end" });
    });

    test("collapses place-self with same values", () => {
      const result = collapse({
        "align-self": "center",
        "justify-self": "center",
      });
      expect(result.result).toEqual({ "place-self": "center" });
    });

    test("collapses place-self with different values", () => {
      const result = collapse({
        "align-self": "start",
        "justify-self": "end",
      });
      expect(result.result).toEqual({ "place-self": "start end" });
    });

    test("collapses columns with both values", () => {
      const result = collapse({
        "column-width": "12em",
        "column-count": "5",
      });
      expect(result.result).toEqual({ columns: "12em 5" });
    });

    test("collapses columns with auto", () => {
      const result = collapse({
        "column-width": "auto",
        "column-count": "auto",
      });
      expect(result.result).toEqual({ columns: "auto" });
    });

    test("collapses contain-intrinsic-size with same values", () => {
      const result = collapse({
        "contain-intrinsic-width": "100px",
        "contain-intrinsic-height": "100px",
      });
      expect(result.result).toEqual({ "contain-intrinsic-size": "100px" });
    });

    test("collapses list-style with defaults", () => {
      const result = collapse({
        "list-style-type": "disc",
        "list-style-position": "outside",
        "list-style-image": "none",
      });
      expect(result.result).toEqual({ "list-style": "disc" });
    });

    test("collapses list-style with none", () => {
      const result = collapse({
        "list-style-type": "none",
        "list-style-position": "outside",
        "list-style-image": "none",
      });
      expect(result.result).toEqual({ "list-style": "none" });
    });

    test("collapses text-emphasis with default color", () => {
      const result = collapse({
        "text-emphasis-style": "filled dot",
        "text-emphasis-color": "currentcolor",
      });
      expect(result.result).toEqual({ "text-emphasis": "filled dot" });
    });

    test("collapses text-decoration with line only", () => {
      const result = collapse({
        "text-decoration-line": "underline",
        "text-decoration-style": "solid",
        "text-decoration-color": "currentColor",
        "text-decoration-thickness": "auto",
      });
      expect(result.result).toEqual({ "text-decoration": "underline" });
    });

    test("collapses border-radius with all same", () => {
      const result = collapse({
        "border-top-left-radius": "10px",
        "border-top-right-radius": "10px",
        "border-bottom-right-radius": "10px",
        "border-bottom-left-radius": "10px",
      });
      expect(result.result).toEqual({ "border-radius": "10px" });
    });

    test("collapses outline with non-defaults", () => {
      const result = collapse({
        "outline-width": "2px",
        "outline-style": "solid",
        "outline-color": "red",
      });
      expect(result.result).toEqual({ outline: "2px solid red" });
    });

    test("collapses column-rule with defaults", () => {
      const result = collapse({
        "column-rule-width": "medium",
        "column-rule-style": "none",
        "column-rule-color": "currentcolor",
      });
      expect(result.result).toEqual({ "column-rule": "none" });
    });

    test("collapses grid-column with auto end", () => {
      const result = collapse({
        "grid-column-start": "2",
        "grid-column-end": "auto",
      });
      expect(result.result).toEqual({ "grid-column": "2" });
    });

    test("collapses grid-row with start and end", () => {
      const result = collapse({
        "grid-row-start": "2",
        "grid-row-end": "4",
      });
      expect(result.result).toEqual({ "grid-row": "2 / 4" });
    });

    test("collapses grid-area named area", () => {
      const result = collapse({
        "grid-row-start": "header",
        "grid-column-start": "header",
        "grid-row-end": "header",
        "grid-column-end": "header",
      });
      expect(result.result).toEqual({ "grid-area": "header" });
    });

    test("collapses CSS string input", () => {
      const result = collapse(`
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 10px;
      `);
      expect(result.result).toContain("overflow: hidden auto");
      expect(result.result).toContain("margin-top: 10px");
    });

    test("collapses CSS string with same values", () => {
      const result = collapse(`
        overflow-x: hidden;
        overflow-y: hidden;
      `);
      expect(result.result).toContain("overflow: hidden");
      expect(result.result).not.toContain("overflow-x");
      expect(result.result).not.toContain("overflow-y");
    });

    test("collapses CSS string with multiple shorthands", () => {
      const result = collapse(`
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        justify-items: center;
      `);
      expect(result.result).toContain("flex-flow: column wrap");
      expect(result.result).toContain("place-items: center");
    });

    test("keeps longhand CSS string when cannot collapse", () => {
      const result = collapse(`
        overflow-x: hidden;
        margin-top: 10px;
      `);
      expect(result.result).toContain("overflow-x: hidden");
      expect(result.result).toContain("margin-top: 10px");
    });
  });

  describe("getCollapsibleShorthands()", () => {
    test("returns shorthands that can be collapsed", () => {
      const shorthands = getCollapsibleShorthands({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
      expect(shorthands).toEqual(["overflow"]);
    });

    test("returns empty array if cannot collapse", () => {
      const shorthands = getCollapsibleShorthands({
        "overflow-x": "hidden",
      });
      expect(shorthands).toEqual([]);
    });
  });

  describe("collapseRegistry", () => {
    test("has overflow handler", () => {
      expect(collapseRegistry.has("overflow")).toBe(true);
    });

    test("get returns overflow handler", () => {
      const handler = collapseRegistry.get("overflow");
      expect(handler).toBeDefined();
      expect(handler?.meta.shorthand).toBe("overflow");
    });

    test("getAllShorthands includes overflow", () => {
      const shorthands = collapseRegistry.getAllShorthands();
      expect(shorthands).toContain("overflow");
    });

    test("has flex-flow handler", () => {
      expect(collapseRegistry.has("flex-flow")).toBe(true);
    });

    test("has place-content handler", () => {
      expect(collapseRegistry.has("place-content")).toBe(true);
    });

    test("has place-items handler", () => {
      expect(collapseRegistry.has("place-items")).toBe(true);
    });

    test("has place-self handler", () => {
      expect(collapseRegistry.has("place-self")).toBe(true);
    });

    test("getAllShorthands returns all registered handlers", () => {
      const shorthands = collapseRegistry.getAllShorthands();
      expect(shorthands).toContain("overflow");
      expect(shorthands).toContain("flex-flow");
      expect(shorthands).toContain("place-content");
      expect(shorthands).toContain("place-items");
      expect(shorthands).toContain("place-self");
      expect(shorthands.length).toBeGreaterThanOrEqual(5);
    });
  });
});
