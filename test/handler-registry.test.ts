// b_path:: test/handler-registry.test.ts

import { describe, expect, test } from "vitest";
import { expandProperty, isShorthandProperty, registry, validateProperty } from "../src/index";

describe("Handler Registry", () => {
  describe("registry.getAllShorthands()", () => {
    test("returns all 52 handlers", () => {
      const shorthands = registry.getAllShorthands();
      expect(shorthands).toHaveLength(52);
    });

    test("includes expected shorthands", () => {
      const shorthands = registry.getAllShorthands();
      expect(shorthands).toContain("overflow");
      expect(shorthands).toContain("flex");
      expect(shorthands).toContain("grid");
      expect(shorthands).toContain("border");
      expect(shorthands).toContain("animation");
    });
  });

  describe("registry.get()", () => {
    test("returns handler for valid shorthand", () => {
      const handler = registry.get("overflow");
      expect(handler).toBeDefined();
      expect(handler?.meta.shorthand).toBe("overflow");
    });

    test("returns undefined for unknown shorthand", () => {
      const handler = registry.get("unknown-property");
      expect(handler).toBeUndefined();
    });

    test("handler has required metadata", () => {
      const handler = registry.get("overflow");
      expect(handler?.meta).toMatchObject({
        shorthand: "overflow",
        longhands: ["overflow-x", "overflow-y"],
        category: "visual",
      });
    });
  });

  describe("registry.has()", () => {
    test("returns true for registered shorthand", () => {
      expect(registry.has("overflow")).toBe(true);
      expect(registry.has("flex-flow")).toBe(true);
      expect(registry.has("border")).toBe(true);
    });

    test("returns false for unknown shorthand", () => {
      expect(registry.has("unknown")).toBe(false);
      expect(registry.has("overflow-x")).toBe(false);
    });
  });

  describe("registry.getByCategory()", () => {
    test("filters handlers by layout category", () => {
      const handlers = registry.getByCategory("layout");
      expect(handlers.length).toBeGreaterThan(0);
      expect(handlers.every((h) => h.meta.category === "layout")).toBe(true);
    });

    test("filters handlers by animation category", () => {
      const handlers = registry.getByCategory("animation");
      expect(handlers.length).toBeGreaterThan(0);
      expect(handlers.every((h) => h.meta.category === "animation")).toBe(true);
    });

    test("filters handlers by box-model category", () => {
      const handlers = registry.getByCategory("box-model");
      expect(handlers.length).toBeGreaterThan(0);
      expect(handlers.every((h) => h.meta.category === "box-model")).toBe(true);
    });

    test("returns empty array for category with no handlers", () => {
      const handlers = registry.getByCategory("other");
      expect(handlers).toEqual([]);
    });
  });

  describe("registry.getLonghands()", () => {
    test("returns longhands for overflow", () => {
      const longhands = registry.getLonghands("overflow");
      expect(longhands).toEqual(["overflow-x", "overflow-y"]);
    });

    test("returns longhands for flex-flow", () => {
      const longhands = registry.getLonghands("flex-flow");
      expect(longhands).toEqual(["flex-direction", "flex-wrap"]);
    });

    test("returns longhands for border", () => {
      const longhands = registry.getLonghands("border");
      expect(longhands).toEqual([
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "border-top-style",
        "border-right-style",
        "border-bottom-style",
        "border-left-style",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
      ]);
    });

    test("returns undefined for unknown shorthand", () => {
      const longhands = registry.getLonghands("unknown");
      expect(longhands).toBeUndefined();
    });
  });

  describe("registry.getShorthandsForLonghand()", () => {
    test("returns shorthands for overflow-x", () => {
      const shorthands = registry.getShorthandsForLonghand("overflow-x");
      expect(shorthands).toContain("overflow");
    });

    test("returns shorthands for flex-direction", () => {
      const shorthands = registry.getShorthandsForLonghand("flex-direction");
      expect(shorthands).toContain("flex-flow");
    });

    test("returns multiple shorthands for border-top-width", () => {
      const shorthands = registry.getShorthandsForLonghand("border-top-width");
      expect(shorthands).toContain("border");
    });

    test("returns empty array for unknown longhand", () => {
      const shorthands = registry.getShorthandsForLonghand("unknown-property");
      expect(shorthands).toEqual([]);
    });
  });

  describe("expandProperty()", () => {
    test("expands overflow shorthand", () => {
      const result = expandProperty("overflow", "hidden auto");
      expect(result).toEqual({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
    });

    test("expands single value to both properties", () => {
      const result = expandProperty("overflow", "scroll");
      expect(result).toEqual({
        "overflow-x": "scroll",
        "overflow-y": "scroll",
      });
    });

    test("expands flex-flow shorthand", () => {
      const result = expandProperty("flex-flow", "column wrap");
      expect(result).toEqual({
        "flex-direction": "column",
        "flex-wrap": "wrap",
      });
    });

    test("returns undefined for invalid value", () => {
      const result = expandProperty("overflow", "invalid-value");
      expect(result).toBeUndefined();
    });

    test("returns undefined for unknown property", () => {
      const result = expandProperty("unknown-property", "value");
      expect(result).toBeUndefined();
    });

    test("expands border shorthand", () => {
      const result = expandProperty("border", "1px solid red");
      expect(result).toBeDefined();
      expect(result?.["border-top-width"]).toBe("1px");
      expect(result?.["border-top-style"]).toBe("solid");
      expect(result?.["border-top-color"]).toBe("red");
    });
  });

  describe("validateProperty()", () => {
    test("validates overflow value", () => {
      expect(validateProperty("overflow", "hidden")).toBe(true);
      expect(validateProperty("overflow", "hidden auto")).toBe(true);
      expect(validateProperty("overflow", "scroll")).toBe(true);
    });

    test("rejects invalid overflow value", () => {
      expect(validateProperty("overflow", "invalid-value")).toBe(false);
      expect(validateProperty("overflow", "foo bar baz")).toBe(false);
    });

    test("validates flex-flow value", () => {
      expect(validateProperty("flex-flow", "row")).toBe(true);
      expect(validateProperty("flex-flow", "column wrap")).toBe(true);
    });

    test("returns false for unknown property", () => {
      expect(validateProperty("unknown-property", "value")).toBe(false);
    });

    test("validates complex border value", () => {
      expect(validateProperty("border", "1px solid red")).toBe(true);
      expect(validateProperty("border", "thin")).toBe(true);
      expect(validateProperty("border", "none")).toBe(true);
    });
  });

  describe("isShorthandProperty()", () => {
    test("returns true for registered shorthands", () => {
      expect(isShorthandProperty("overflow")).toBe(true);
      expect(isShorthandProperty("flex-flow")).toBe(true);
      expect(isShorthandProperty("border")).toBe(true);
      expect(isShorthandProperty("grid")).toBe(true);
    });

    test("returns false for longhands", () => {
      expect(isShorthandProperty("overflow-x")).toBe(false);
      expect(isShorthandProperty("flex-direction")).toBe(false);
      expect(isShorthandProperty("border-top-width")).toBe(false);
    });

    test("returns false for unknown properties", () => {
      expect(isShorthandProperty("unknown")).toBe(false);
      expect(isShorthandProperty("not-a-property")).toBe(false);
    });
  });

  describe("registry.handlers", () => {
    test("is read-only map", () => {
      expect(registry.handlers).toBeInstanceOf(Map);
      expect(registry.handlers.size).toBe(52);
    });

    test("contains all handlers", () => {
      const handlerNames = Array.from(registry.handlers.keys());
      expect(handlerNames).toContain("overflow");
      expect(handlerNames).toContain("animation");
      expect(handlerNames).toContain("border");
    });

    test("each handler has complete metadata", () => {
      for (const [name, handler] of registry.handlers) {
        expect(handler.meta.shorthand).toBe(name);
        expect(handler.meta.longhands).toBeDefined();
        expect(Array.isArray(handler.meta.longhands)).toBe(true);
        expect(handler.meta.longhands.length).toBeGreaterThan(0);
        expect(handler.meta.category).toBeDefined();
        expect(handler.expand).toBeDefined();
      }
    });
  });

  describe("Integration: Real-world usage", () => {
    test("can query handler capabilities", () => {
      const handler = registry.get("overflow");
      expect(handler?.meta.shorthand).toBe("overflow");
      expect(handler?.meta.longhands).toEqual(["overflow-x", "overflow-y"]);
      expect(handler?.validate).toBeDefined();
    });

    test("can discover handlers by category", () => {
      const layoutHandlers = registry.getByCategory("layout");
      const layoutNames = layoutHandlers.map((h) => h.meta.shorthand);
      expect(layoutNames).toContain("flex");
      expect(layoutNames).toContain("grid");

      const visualHandlers = registry.getByCategory("visual");
      const visualNames = visualHandlers.map((h) => h.meta.shorthand);
      expect(visualNames).toContain("overflow");
    });

    test("can find which shorthands affect a longhand", () => {
      const affectedBy = registry.getShorthandsForLonghand("overflow-x");
      expect(affectedBy).toContain("overflow");
    });

    test("can dynamically expand properties", () => {
      const properties = ["overflow", "flex-flow", "border"];
      const values = ["hidden auto", "column wrap", "1px solid red"];

      for (let i = 0; i < properties.length; i++) {
        const result = expandProperty(properties[i], values[i]);
        expect(result).toBeDefined();
      }
    });
  });
});
