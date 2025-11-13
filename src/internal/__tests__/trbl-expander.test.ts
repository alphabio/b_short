// b_path:: src/internal/__tests__/trbl-expander.test.ts

import { describe, expect, it } from "vitest";
import { createTRBLExpander, expandTRBL } from "../trbl-expander";

describe("trbl-expander", () => {
  describe("expandTRBL", () => {
    describe("1-value syntax", () => {
      it("expands single value to all sides", () => {
        expect(expandTRBL("10px")).toEqual({
          top: "10px",
          right: "10px",
          bottom: "10px",
          left: "10px",
        });
      });

      it("handles percentage", () => {
        expect(expandTRBL("50%")).toEqual({
          top: "50%",
          right: "50%",
          bottom: "50%",
          left: "50%",
        });
      });

      it("handles zero", () => {
        expect(expandTRBL("0")).toEqual({
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        });
      });

      it("handles keyword", () => {
        expect(expandTRBL("auto")).toEqual({
          top: "auto",
          right: "auto",
          bottom: "auto",
          left: "auto",
        });
      });
    });

    describe("2-value syntax", () => {
      it("expands vertical horizontal", () => {
        expect(expandTRBL("10px 20px")).toEqual({
          top: "10px",
          right: "20px",
          bottom: "10px",
          left: "20px",
        });
      });

      it("handles different units", () => {
        expect(expandTRBL("1em 50%")).toEqual({
          top: "1em",
          right: "50%",
          bottom: "1em",
          left: "50%",
        });
      });

      it("handles zero and auto", () => {
        expect(expandTRBL("0 auto")).toEqual({
          top: "0",
          right: "auto",
          bottom: "0",
          left: "auto",
        });
      });
    });

    describe("3-value syntax", () => {
      it("expands top horizontal bottom", () => {
        expect(expandTRBL("10px 20px 30px")).toEqual({
          top: "10px",
          right: "20px",
          bottom: "30px",
          left: "20px",
        });
      });

      it("handles mixed units", () => {
        expect(expandTRBL("1em 50% 2rem")).toEqual({
          top: "1em",
          right: "50%",
          bottom: "2rem",
          left: "50%",
        });
      });
    });

    describe("4-value syntax", () => {
      it("expands top right bottom left", () => {
        expect(expandTRBL("10px 20px 30px 40px")).toEqual({
          top: "10px",
          right: "20px",
          bottom: "30px",
          left: "40px",
        });
      });

      it("handles all different units", () => {
        expect(expandTRBL("10px 1em 50% 2rem")).toEqual({
          top: "10px",
          right: "1em",
          bottom: "50%",
          left: "2rem",
        });
      });

      it("handles zeros and keywords", () => {
        expect(expandTRBL("0 auto 10px 5%")).toEqual({
          top: "0",
          right: "auto",
          bottom: "10px",
          left: "5%",
        });
      });
    });

    describe("calc() support", () => {
      it("handles calc in single value", () => {
        expect(expandTRBL("calc(100% - 10px)")).toEqual({
          top: "calc(100% - 10px)",
          right: "calc(100% - 10px)",
          bottom: "calc(100% - 10px)",
          left: "calc(100% - 10px)",
        });
      });

      it("handles calc in 2 values", () => {
        expect(expandTRBL("calc(50% - 5px) 10px")).toEqual({
          top: "calc(50% - 5px)",
          right: "10px",
          bottom: "calc(50% - 5px)",
          left: "10px",
        });
      });

      it("handles multiple calc", () => {
        expect(expandTRBL("calc(1em + 5px) calc(100% / 2) 0 auto")).toEqual({
          top: "calc(1em + 5px)",
          right: "calc(100% / 2)",
          bottom: "0",
          left: "auto",
        });
      });
    });

    describe("var() support", () => {
      it("handles var in single value", () => {
        expect(expandTRBL("var(--spacing)")).toEqual({
          top: "var(--spacing)",
          right: "var(--spacing)",
          bottom: "var(--spacing)",
          left: "var(--spacing)",
        });
      });

      it("handles var in multiple values", () => {
        expect(expandTRBL("var(--top) var(--horizontal)")).toEqual({
          top: "var(--top)",
          right: "var(--horizontal)",
          bottom: "var(--top)",
          left: "var(--horizontal)",
        });
      });

      it("handles var with fallback", () => {
        expect(expandTRBL("var(--spacing, 10px) 20px")).toEqual({
          top: "var(--spacing, 10px)",
          right: "20px",
          bottom: "var(--spacing, 10px)",
          left: "20px",
        });
      });
    });

    describe("global values", () => {
      it("handles inherit", () => {
        expect(expandTRBL("inherit")).toEqual({
          top: "inherit",
          right: "inherit",
          bottom: "inherit",
          left: "inherit",
        });
      });

      it("handles initial", () => {
        expect(expandTRBL("initial")).toEqual({
          top: "initial",
          right: "initial",
          bottom: "initial",
          left: "initial",
        });
      });

      it("handles unset", () => {
        expect(expandTRBL("unset")).toEqual({
          top: "unset",
          right: "unset",
          bottom: "unset",
          left: "unset",
        });
      });

      it("handles revert", () => {
        expect(expandTRBL("revert")).toEqual({
          top: "revert",
          right: "revert",
          bottom: "revert",
          left: "revert",
        });
      });
    });

    describe("edge cases", () => {
      it("handles whitespace", () => {
        expect(expandTRBL("  10px   20px  ")).toEqual({
          top: "10px",
          right: "20px",
          bottom: "10px",
          left: "20px",
        });
      });

      it("handles negative values", () => {
        expect(expandTRBL("-10px -5px")).toEqual({
          top: "-10px",
          right: "-5px",
          bottom: "-10px",
          left: "-5px",
        });
      });
    });
  });

  describe("createTRBLExpander", () => {
    it("creates expander for margin", () => {
      const expandMargin = createTRBLExpander("margin");
      expect(expandMargin("10px 20px")).toEqual({
        "margin-top": "10px",
        "margin-right": "20px",
        "margin-bottom": "10px",
        "margin-left": "20px",
      });
    });

    it("creates expander for padding", () => {
      const expandPadding = createTRBLExpander("padding");
      expect(expandPadding("5px")).toEqual({
        "padding-top": "5px",
        "padding-right": "5px",
        "padding-bottom": "5px",
        "padding-left": "5px",
      });
    });

    it("creates expander for border-width", () => {
      const expandBorderWidth = createTRBLExpander("border-width");
      expect(expandBorderWidth("1px 2px 3px 4px")).toEqual({
        "border-width-top": "1px",
        "border-width-right": "2px",
        "border-width-bottom": "3px",
        "border-width-left": "4px",
      });
    });

    it("creates expander for inset", () => {
      const expandInset = createTRBLExpander("inset");
      expect(expandInset("0 auto")).toEqual({
        "inset-top": "0",
        "inset-right": "auto",
        "inset-bottom": "0",
        "inset-left": "auto",
      });
    });
  });
});
