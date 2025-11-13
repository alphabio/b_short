// b_path:: src/handlers/background-position/__tests__/background-position.expand.test.ts

import { describe, expect, it } from "vitest";
import { expandBackgroundPosition } from "../expand";

describe("background-position expand", () => {
  describe("1-value syntax", () => {
    it("expands horizontal keywords", () => {
      expect(expandBackgroundPosition("left")).toEqual({
        "background-position-x": "left",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("center")).toEqual({
        "background-position-x": "center",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("right")).toEqual({
        "background-position-x": "right",
        "background-position-y": "center",
      });
    });

    it("expands vertical keywords", () => {
      expect(expandBackgroundPosition("top")).toEqual({
        "background-position-x": "center",
        "background-position-y": "top",
      });

      expect(expandBackgroundPosition("bottom")).toEqual({
        "background-position-x": "center",
        "background-position-y": "bottom",
      });
    });

    it("expands length/percentage", () => {
      expect(expandBackgroundPosition("10px")).toEqual({
        "background-position-x": "10px",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("50%")).toEqual({
        "background-position-x": "50%",
        "background-position-y": "center",
      });
    });
  });

  describe("2-value syntax", () => {
    it("expands keyword pairs", () => {
      expect(expandBackgroundPosition("left top")).toEqual({
        "background-position-x": "left",
        "background-position-y": "top",
      });

      expect(expandBackgroundPosition("right bottom")).toEqual({
        "background-position-x": "right",
        "background-position-y": "bottom",
      });
    });

    it("expands swapped vertical-first syntax", () => {
      expect(expandBackgroundPosition("top left")).toEqual({
        "background-position-x": "left",
        "background-position-y": "top",
      });

      expect(expandBackgroundPosition("bottom right")).toEqual({
        "background-position-x": "right",
        "background-position-y": "bottom",
      });
    });

    it("expands mixed keyword and length", () => {
      expect(expandBackgroundPosition("left 10px")).toEqual({
        "background-position-x": "left",
        "background-position-y": "10px",
      });

      expect(expandBackgroundPosition("50% center")).toEqual({
        "background-position-x": "50%",
        "background-position-y": "center",
      });
    });

    it("expands two lengths", () => {
      expect(expandBackgroundPosition("10px 20px")).toEqual({
        "background-position-x": "10px",
        "background-position-y": "20px",
      });

      expect(expandBackgroundPosition("25% 75%")).toEqual({
        "background-position-x": "25%",
        "background-position-y": "75%",
      });
    });
  });

  describe("3-value syntax (edge-offset)", () => {
    it("expands left edge-offset", () => {
      expect(expandBackgroundPosition("left 10px center")).toEqual({
        "background-position-x": "left 10px",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("left 20% top")).toEqual({
        "background-position-x": "left 20%",
        "background-position-y": "top",
      });
    });

    it("expands right edge-offset", () => {
      expect(expandBackgroundPosition("right 10px bottom")).toEqual({
        "background-position-x": "right 10px",
        "background-position-y": "bottom",
      });
    });

    it("expands vertical edge-offset", () => {
      expect(expandBackgroundPosition("center top 10px")).toEqual({
        "background-position-x": "center",
        "background-position-y": "top 10px",
      });

      expect(expandBackgroundPosition("left bottom 20%")).toEqual({
        "background-position-x": "left",
        "background-position-y": "bottom 20%",
      });
    });
  });

  describe("4-value syntax (full edge-offset)", () => {
    it("expands both edge-offsets", () => {
      expect(expandBackgroundPosition("left 10px top 20px")).toEqual({
        "background-position-x": "left 10px",
        "background-position-y": "top 20px",
      });

      expect(expandBackgroundPosition("right 5% bottom 10%")).toEqual({
        "background-position-x": "right 5%",
        "background-position-y": "bottom 10%",
      });
    });
  });

  describe("calc() and var() support", () => {
    it("handles calc()", () => {
      expect(expandBackgroundPosition("calc(50% - 10px)")).toEqual({
        "background-position-x": "calc(50% - 10px)",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("calc(50% + 10px) calc(25% - 5px)")).toEqual({
        "background-position-x": "calc(50% + 10px)",
        "background-position-y": "calc(25% - 5px)",
      });
    });

    it("handles var()", () => {
      expect(expandBackgroundPosition("var(--x-pos)")).toEqual({
        "background-position-x": "var(--x-pos)",
        "background-position-y": "center",
      });

      expect(expandBackgroundPosition("var(--x) var(--y)")).toEqual({
        "background-position-x": "var(--x)",
        "background-position-y": "var(--y)",
      });
    });
  });

  describe("global values", () => {
    it("handles inherit", () => {
      expect(expandBackgroundPosition("inherit")).toEqual({
        "background-position-x": "inherit",
        "background-position-y": "inherit",
      });
    });

    it("handles initial", () => {
      expect(expandBackgroundPosition("initial")).toEqual({
        "background-position-x": "initial",
        "background-position-y": "initial",
      });
    });

    it("handles unset", () => {
      expect(expandBackgroundPosition("unset")).toEqual({
        "background-position-x": "unset",
        "background-position-y": "unset",
      });
    });
  });
});
