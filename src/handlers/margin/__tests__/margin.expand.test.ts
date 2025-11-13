// b_path:: src/handlers/margin/__tests__/margin.expand.test.ts

import { describe, expect, it } from "vitest";
import { expandMargin } from "../expand";

describe("margin expand", () => {
  describe("1-value syntax", () => {
    it("expands single value to all sides", () => {
      expect(expandMargin("10px")).toEqual({
        "margin-top": "10px",
        "margin-right": "10px",
        "margin-bottom": "10px",
        "margin-left": "10px",
      });
    });

    it("handles auto", () => {
      expect(expandMargin("auto")).toEqual({
        "margin-top": "auto",
        "margin-right": "auto",
        "margin-bottom": "auto",
        "margin-left": "auto",
      });
    });

    it("handles zero", () => {
      expect(expandMargin("0")).toEqual({
        "margin-top": "0",
        "margin-right": "0",
        "margin-bottom": "0",
        "margin-left": "0",
      });
    });
  });

  describe("2-value syntax", () => {
    it("expands vertical horizontal", () => {
      expect(expandMargin("10px 20px")).toEqual({
        "margin-top": "10px",
        "margin-right": "20px",
        "margin-bottom": "10px",
        "margin-left": "20px",
      });
    });

    it("handles auto centering", () => {
      expect(expandMargin("0 auto")).toEqual({
        "margin-top": "0",
        "margin-right": "auto",
        "margin-bottom": "0",
        "margin-left": "auto",
      });
    });
  });

  describe("3-value syntax", () => {
    it("expands top horizontal bottom", () => {
      expect(expandMargin("10px 20px 30px")).toEqual({
        "margin-top": "10px",
        "margin-right": "20px",
        "margin-bottom": "30px",
        "margin-left": "20px",
      });
    });
  });

  describe("4-value syntax", () => {
    it("expands all sides", () => {
      expect(expandMargin("10px 20px 30px 40px")).toEqual({
        "margin-top": "10px",
        "margin-right": "20px",
        "margin-bottom": "30px",
        "margin-left": "40px",
      });
    });

    it("handles negative margins", () => {
      expect(expandMargin("-10px -5px 0 5px")).toEqual({
        "margin-top": "-10px",
        "margin-right": "-5px",
        "margin-bottom": "0",
        "margin-left": "5px",
      });
    });
  });

  describe("calc() support", () => {
    it("handles calc", () => {
      expect(expandMargin("calc(100% - 10px)")).toEqual({
        "margin-top": "calc(100% - 10px)",
        "margin-right": "calc(100% - 10px)",
        "margin-bottom": "calc(100% - 10px)",
        "margin-left": "calc(100% - 10px)",
      });
    });

    it("handles multiple calc", () => {
      expect(expandMargin("calc(1em + 5px) calc(50% - 10px)")).toEqual({
        "margin-top": "calc(1em + 5px)",
        "margin-right": "calc(50% - 10px)",
        "margin-bottom": "calc(1em + 5px)",
        "margin-left": "calc(50% - 10px)",
      });
    });
  });

  describe("var() support", () => {
    it("handles var", () => {
      expect(expandMargin("var(--spacing)")).toEqual({
        "margin-top": "var(--spacing)",
        "margin-right": "var(--spacing)",
        "margin-bottom": "var(--spacing)",
        "margin-left": "var(--spacing)",
      });
    });

    it("handles var with fallback", () => {
      expect(expandMargin("var(--m, 10px) 20px")).toEqual({
        "margin-top": "var(--m, 10px)",
        "margin-right": "20px",
        "margin-bottom": "var(--m, 10px)",
        "margin-left": "20px",
      });
    });
  });

  describe("global values", () => {
    it("handles inherit", () => {
      expect(expandMargin("inherit")).toEqual({
        "margin-top": "inherit",
        "margin-right": "inherit",
        "margin-bottom": "inherit",
        "margin-left": "inherit",
      });
    });

    it("handles initial", () => {
      expect(expandMargin("initial")).toEqual({
        "margin-top": "initial",
        "margin-right": "initial",
        "margin-bottom": "initial",
        "margin-left": "initial",
      });
    });
  });
});
