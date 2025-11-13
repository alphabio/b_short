// b_path:: src/internal/__tests__/position-parser.test.ts

import { describe, expect, it } from "vitest";
import { parsePosition } from "../position-parser";

describe("position-parser", () => {
  describe("1-value syntax", () => {
    it("parses horizontal keywords", () => {
      expect(parsePosition("left")).toEqual({ x: "left", y: "center" });
      expect(parsePosition("center")).toEqual({ x: "center", y: "center" });
      expect(parsePosition("right")).toEqual({ x: "right", y: "center" });
    });

    it("parses vertical keywords", () => {
      expect(parsePosition("top")).toEqual({ x: "center", y: "top" });
      expect(parsePosition("bottom")).toEqual({ x: "center", y: "bottom" });
    });

    it("parses length/percentage", () => {
      expect(parsePosition("10px")).toEqual({ x: "10px", y: "center" });
      expect(parsePosition("50%")).toEqual({ x: "50%", y: "center" });
      expect(parsePosition("0")).toEqual({ x: "0", y: "center" });
    });
  });

  describe("2-value syntax", () => {
    it("parses keyword pairs", () => {
      expect(parsePosition("left top")).toEqual({ x: "left", y: "top" });
      expect(parsePosition("center center")).toEqual({ x: "center", y: "center" });
      expect(parsePosition("right bottom")).toEqual({ x: "right", y: "bottom" });
    });

    it("parses swapped vertical-first syntax", () => {
      expect(parsePosition("top left")).toEqual({ x: "left", y: "top" });
      expect(parsePosition("bottom right")).toEqual({ x: "right", y: "bottom" });
      expect(parsePosition("top center")).toEqual({ x: "center", y: "top" });
    });

    it("parses mixed keyword and length", () => {
      expect(parsePosition("left 10px")).toEqual({ x: "left", y: "10px" });
      expect(parsePosition("50% center")).toEqual({ x: "50%", y: "center" });
      expect(parsePosition("center 25%")).toEqual({ x: "center", y: "25%" });
    });

    it("parses two lengths", () => {
      expect(parsePosition("10px 20px")).toEqual({ x: "10px", y: "20px" });
      expect(parsePosition("50% 75%")).toEqual({ x: "50%", y: "75%" });
      expect(parsePosition("0 0")).toEqual({ x: "0", y: "0" });
    });
  });

  describe("3-value syntax (edge-offset)", () => {
    it("parses left edge-offset", () => {
      expect(parsePosition("left 10px center")).toEqual({ x: "left 10px", y: "center" });
      expect(parsePosition("left 20% top")).toEqual({ x: "left 20%", y: "top" });
    });

    it("parses right edge-offset", () => {
      expect(parsePosition("right 10px center")).toEqual({ x: "right 10px", y: "center" });
      expect(parsePosition("right 5% bottom")).toEqual({ x: "right 5%", y: "bottom" });
    });

    it("parses top edge-offset", () => {
      expect(parsePosition("center top 10px")).toEqual({ x: "center", y: "top 10px" });
      expect(parsePosition("left top 20%")).toEqual({ x: "left", y: "top 20%" });
    });

    it("parses bottom edge-offset", () => {
      expect(parsePosition("center bottom 10px")).toEqual({ x: "center", y: "bottom 10px" });
      expect(parsePosition("right bottom 5%")).toEqual({ x: "right", y: "bottom 5%" });
    });
  });

  describe("4-value syntax (full edge-offset)", () => {
    it("parses both edge-offsets - horizontal first", () => {
      expect(parsePosition("left 10px top 20px")).toEqual({ x: "left 10px", y: "top 20px" });
      expect(parsePosition("right 5% bottom 10%")).toEqual({ x: "right 5%", y: "bottom 10%" });
      expect(parsePosition("left 0 top 0")).toEqual({ x: "left 0", y: "top 0" });
    });

    it("parses both edge-offsets - vertical first", () => {
      expect(parsePosition("top 20px left 15%")).toEqual({ x: "left 15%", y: "top 20px" });
      expect(parsePosition("bottom 10% right 5%")).toEqual({ x: "right 5%", y: "bottom 10%" });
      expect(parsePosition("top 0 left 0")).toEqual({ x: "left 0", y: "top 0" });
    });
  });

  describe("calc() and var() support", () => {
    it("preserves calc() in single value", () => {
      expect(parsePosition("calc(50% - 10px)")).toEqual({ x: "calc(50% - 10px)", y: "center" });
    });

    it("preserves calc() in two values", () => {
      expect(parsePosition("calc(50% + 10px) calc(25% - 5px)")).toEqual({
        x: "calc(50% + 10px)",
        y: "calc(25% - 5px)",
      });
    });

    it("preserves var()", () => {
      expect(parsePosition("var(--x-pos)")).toEqual({ x: "var(--x-pos)", y: "center" });
      expect(parsePosition("var(--x) var(--y)")).toEqual({ x: "var(--x)", y: "var(--y)" });
    });

    it("preserves complex functions", () => {
      expect(parsePosition("min(50%, 100px) max(25%, 50px)")).toEqual({
        x: "min(50%, 100px)",
        y: "max(25%, 50px)",
      });
    });

    it("handles calc in edge-offset", () => {
      expect(parsePosition("left calc(50% - 10px) top")).toEqual({
        x: "left calc(50% - 10px)",
        y: "top",
      });
    });
  });

  describe("global values", () => {
    it("handles inherit", () => {
      expect(parsePosition("inherit")).toEqual({ x: "inherit", y: "inherit" });
    });

    it("handles initial", () => {
      expect(parsePosition("initial")).toEqual({ x: "initial", y: "initial" });
    });

    it("handles unset", () => {
      expect(parsePosition("unset")).toEqual({ x: "unset", y: "unset" });
    });

    it("handles revert", () => {
      expect(parsePosition("revert")).toEqual({ x: "revert", y: "revert" });
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(parsePosition("")).toEqual({ x: "0%", y: "0%" });
    });

    it("handles whitespace", () => {
      expect(parsePosition("  left   top  ")).toEqual({ x: "left", y: "top" });
    });

    it("handles zero values", () => {
      expect(parsePosition("0")).toEqual({ x: "0", y: "center" });
      expect(parsePosition("0 0")).toEqual({ x: "0", y: "0" });
    });
  });
});
