// b_path:: src/handlers/column-rule/__tests__/column-rule.expand.test.ts
import { describe, expect, it } from "vitest";
import { columnRuleHandler } from "../expand";

describe("column-rule expand", () => {
  it("1px solid #000", () => {
    const result = columnRuleHandler.expand("1px solid #000");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "#000",
    });
  });

  it("solid 1px #000", () => {
    const result = columnRuleHandler.expand("solid 1px #000");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "#000",
    });
  });

  it("solid #000000 1px", () => {
    const result = columnRuleHandler.expand("solid #000000 1px");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "#000000",
    });
  });

  it("solid", () => {
    const result = columnRuleHandler.expand("solid");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "solid",
      "column-rule-color": "currentcolor",
    });
  });

  it("black", () => {
    const result = columnRuleHandler.expand("black");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "black",
    });
  });

  it("1px", () => {
    const result = columnRuleHandler.expand("1px");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("inherit", () => {
    const result = columnRuleHandler.expand("inherit");
    expect(result).toEqual({
      "column-rule-width": "inherit",
      "column-rule-style": "inherit",
      "column-rule-color": "inherit",
    });
  });

  it("initial", () => {
    const result = columnRuleHandler.expand("initial");
    expect(result).toEqual({
      "column-rule-width": "initial",
      "column-rule-style": "initial",
      "column-rule-color": "initial",
    });
  });

  it("unset", () => {
    const result = columnRuleHandler.expand("unset");
    expect(result).toEqual({
      "column-rule-width": "unset",
      "column-rule-style": "unset",
      "column-rule-color": "unset",
    });
  });

  it("revert", () => {
    const result = columnRuleHandler.expand("revert");
    expect(result).toEqual({
      "column-rule-width": "revert",
      "column-rule-style": "revert",
      "column-rule-color": "revert",
    });
  });

  it("2em", () => {
    const result = columnRuleHandler.expand("2em");
    expect(result).toEqual({
      "column-rule-width": "2em",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("thin", () => {
    const result = columnRuleHandler.expand("thin");
    expect(result).toEqual({
      "column-rule-width": "thin",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("medium", () => {
    const result = columnRuleHandler.expand("medium");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("thick", () => {
    const result = columnRuleHandler.expand("thick");
    expect(result).toEqual({
      "column-rule-width": "thick",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("dotted", () => {
    const result = columnRuleHandler.expand("dotted");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "dotted",
      "column-rule-color": "currentcolor",
    });
  });

  it("dashed", () => {
    const result = columnRuleHandler.expand("dashed");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "dashed",
      "column-rule-color": "currentcolor",
    });
  });

  it("double", () => {
    const result = columnRuleHandler.expand("double");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "double",
      "column-rule-color": "currentcolor",
    });
  });

  it("groove", () => {
    const result = columnRuleHandler.expand("groove");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "groove",
      "column-rule-color": "currentcolor",
    });
  });

  it("ridge", () => {
    const result = columnRuleHandler.expand("ridge");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "ridge",
      "column-rule-color": "currentcolor",
    });
  });

  it("inset", () => {
    const result = columnRuleHandler.expand("inset");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "inset",
      "column-rule-color": "currentcolor",
    });
  });

  it("outset", () => {
    const result = columnRuleHandler.expand("outset");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "outset",
      "column-rule-color": "currentcolor",
    });
  });

  it("none", () => {
    const result = columnRuleHandler.expand("none");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    });
  });

  it("hidden", () => {
    const result = columnRuleHandler.expand("hidden");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "hidden",
      "column-rule-color": "currentcolor",
    });
  });

  it("red", () => {
    const result = columnRuleHandler.expand("red");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "red",
    });
  });

  it("#ff0000", () => {
    const result = columnRuleHandler.expand("#ff0000");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "#ff0000",
    });
  });

  it("rgb(255, 0, 0)", () => {
    const result = columnRuleHandler.expand("rgb(255, 0, 0)");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "rgb(255,0,0)",
    });
  });

  it("hsl(0, 100%, 50%)", () => {
    const result = columnRuleHandler.expand("hsl(0, 100%, 50%)");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "hsl(0,100%,50%)",
    });
  });

  it("1px solid", () => {
    const result = columnRuleHandler.expand("1px solid");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "currentcolor",
    });
  });

  it("solid 1px", () => {
    const result = columnRuleHandler.expand("solid 1px");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "currentcolor",
    });
  });

  it("1px red", () => {
    const result = columnRuleHandler.expand("1px red");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "none",
      "column-rule-color": "red",
    });
  });

  it("red 1px", () => {
    const result = columnRuleHandler.expand("red 1px");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "none",
      "column-rule-color": "red",
    });
  });

  it("solid red", () => {
    const result = columnRuleHandler.expand("solid red");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "solid",
      "column-rule-color": "red",
    });
  });

  it("red solid", () => {
    const result = columnRuleHandler.expand("red solid");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "solid",
      "column-rule-color": "red",
    });
  });

  it("thin dotted #ff0000", () => {
    const result = columnRuleHandler.expand("thin dotted #ff0000");
    expect(result).toEqual({
      "column-rule-width": "thin",
      "column-rule-style": "dotted",
      "column-rule-color": "#ff0000",
    });
  });

  it("medium dashed rgb(0, 0, 0)", () => {
    const result = columnRuleHandler.expand("medium dashed rgb(0, 0, 0)");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "dashed",
      "column-rule-color": "rgb(0,0,0)",
    });
  });

  it("var(--my-color)", () => {
    const result = columnRuleHandler.expand("var(--my-color)");
    expect(result).toEqual({
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "var(--my-color)",
    });
  });

  it("1px solid var(--my-color)", () => {
    const result = columnRuleHandler.expand("1px solid var(--my-color)");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "var(--my-color)",
    });
  });

  it("#000 1px solid", () => {
    const result = columnRuleHandler.expand("#000 1px solid");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "#000",
    });
  });

  it("1px #000 solid", () => {
    const result = columnRuleHandler.expand("1px #000 solid");
    expect(result).toEqual({
      "column-rule-width": "1px",
      "column-rule-style": "solid",
      "column-rule-color": "#000",
    });
  });
});
