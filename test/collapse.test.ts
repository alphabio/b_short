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
      expect(result).toEqual({ overflow: "hidden" });
    });

    test("collapses overflow with different values", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
      expect(result).toEqual({ overflow: "hidden auto" });
    });

    test("keeps longhands if incomplete", () => {
      const result = collapse({
        "overflow-x": "hidden",
      });
      expect(result).toEqual({ "overflow-x": "hidden" });
    });

    test("mixes collapsed and non-collapsed properties", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "hidden",
        "margin-top": "10px",
      });
      expect(result).toEqual({
        overflow: "hidden",
        "margin-top": "10px",
      });
    });

    test("returns empty object for empty input", () => {
      const result = collapse({});
      expect(result).toEqual({});
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
  });
});
