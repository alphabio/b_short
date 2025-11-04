// b_path:: test/collapse.test.ts

import { describe, expect, test } from "vitest";
import { collapse, collapseRegistry, getCollapsibleShorthands } from "../src";

describe("Collapse API", () => {
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

    test("has flex handler", () => {
      expect(collapseRegistry.has("flex")).toBe(true);
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
