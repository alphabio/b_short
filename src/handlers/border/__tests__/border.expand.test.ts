// b_path:: src/handlers/border/__tests__/border.expand.test.ts
import { describe, expect, it } from "vitest";
import { borderHandler } from "../expand";

describe("border expand", () => {
  it("1px", () => {
    const result = borderHandler.expand("1px");
    expect(result).toEqual({
      "border-top-width": "1px",
      "border-top-style": "none",
      "border-top-color": "currentcolor",
      "border-right-width": "1px",
      "border-right-style": "none",
      "border-right-color": "currentcolor",
      "border-bottom-width": "1px",
      "border-bottom-style": "none",
      "border-bottom-color": "currentcolor",
      "border-left-width": "1px",
      "border-left-style": "none",
      "border-left-color": "currentcolor",
    });
  });

  it("solid", () => {
    const result = borderHandler.expand("solid");
    expect(result).toEqual({
      "border-top-width": "medium",
      "border-top-style": "solid",
      "border-top-color": "currentcolor",
      "border-right-width": "medium",
      "border-right-style": "solid",
      "border-right-color": "currentcolor",
      "border-bottom-width": "medium",
      "border-bottom-style": "solid",
      "border-bottom-color": "currentcolor",
      "border-left-width": "medium",
      "border-left-style": "solid",
      "border-left-color": "currentcolor",
    });
  });

  it("#ff0", () => {
    const result = borderHandler.expand("#ff0");
    expect(result).toEqual({
      "border-top-width": "medium",
      "border-top-style": "none",
      "border-top-color": "#ff0",
      "border-right-width": "medium",
      "border-right-style": "none",
      "border-right-color": "#ff0",
      "border-bottom-width": "medium",
      "border-bottom-style": "none",
      "border-bottom-color": "#ff0",
      "border-left-width": "medium",
      "border-left-style": "none",
      "border-left-color": "#ff0",
    });
  });

  it("dashed 1em", () => {
    const result = borderHandler.expand("dashed 1em");
    expect(result).toEqual({
      "border-top-width": "1em",
      "border-top-style": "dashed",
      "border-top-color": "currentcolor",
      "border-right-width": "1em",
      "border-right-style": "dashed",
      "border-right-color": "currentcolor",
      "border-bottom-width": "1em",
      "border-bottom-style": "dashed",
      "border-bottom-color": "currentcolor",
      "border-left-width": "1em",
      "border-left-style": "dashed",
      "border-left-color": "currentcolor",
    });
  });

  it("rgb(0, 0, 0) dashed", () => {
    const result = borderHandler.expand("rgb(0, 0, 0) dashed");
    expect(result).toEqual({
      "border-top-width": "medium",
      "border-top-style": "dashed",
      "border-top-color": "rgb(0,0,0)",
      "border-right-width": "medium",
      "border-right-style": "dashed",
      "border-right-color": "rgb(0,0,0)",
      "border-bottom-width": "medium",
      "border-bottom-style": "dashed",
      "border-bottom-color": "rgb(0,0,0)",
      "border-left-width": "medium",
      "border-left-style": "dashed",
      "border-left-color": "rgb(0,0,0)",
    });
  });

  it("1em rgb(0, 0, 0)", () => {
    const result = borderHandler.expand("1em rgb(0, 0, 0)");
    expect(result).toEqual({
      "border-top-width": "1em",
      "border-top-style": "none",
      "border-top-color": "rgb(0,0,0)",
      "border-right-width": "1em",
      "border-right-style": "none",
      "border-right-color": "rgb(0,0,0)",
      "border-bottom-width": "1em",
      "border-bottom-style": "none",
      "border-bottom-color": "rgb(0,0,0)",
      "border-left-width": "1em",
      "border-left-style": "none",
      "border-left-color": "rgb(0,0,0)",
    });
  });

  it("thin dotted hsl(120, 100%, 50%)", () => {
    const result = borderHandler.expand("thin dotted hsl(120, 100%, 50%)");
    expect(result).toEqual({
      "border-top-width": "thin",
      "border-top-style": "dotted",
      "border-top-color": "hsl(120,100%,50%)",
      "border-right-width": "thin",
      "border-right-style": "dotted",
      "border-right-color": "hsl(120,100%,50%)",
      "border-bottom-width": "thin",
      "border-bottom-style": "dotted",
      "border-bottom-color": "hsl(120,100%,50%)",
      "border-left-width": "thin",
      "border-left-style": "dotted",
      "border-left-color": "hsl(120,100%,50%)",
    });
  });

  it("inherit", () => {
    const result = borderHandler.expand("inherit");
    expect(result).toEqual({
      "border-top-width": "inherit",
      "border-top-style": "inherit",
      "border-top-color": "inherit",
      "border-right-width": "inherit",
      "border-right-style": "inherit",
      "border-right-color": "inherit",
      "border-bottom-width": "inherit",
      "border-bottom-style": "inherit",
      "border-bottom-color": "inherit",
      "border-left-width": "inherit",
      "border-left-style": "inherit",
      "border-left-color": "inherit",
    });
  });

  it("initial", () => {
    const result = borderHandler.expand("initial");
    expect(result).toEqual({
      "border-top-width": "initial",
      "border-top-style": "initial",
      "border-top-color": "initial",
      "border-right-width": "initial",
      "border-right-style": "initial",
      "border-right-color": "initial",
      "border-bottom-width": "initial",
      "border-bottom-style": "initial",
      "border-bottom-color": "initial",
      "border-left-width": "initial",
      "border-left-style": "initial",
      "border-left-color": "initial",
    });
  });

  it("unset", () => {
    const result = borderHandler.expand("unset");
    expect(result).toEqual({
      "border-top-width": "unset",
      "border-top-style": "unset",
      "border-top-color": "unset",
      "border-right-width": "unset",
      "border-right-style": "unset",
      "border-right-color": "unset",
      "border-bottom-width": "unset",
      "border-bottom-style": "unset",
      "border-bottom-color": "unset",
      "border-left-width": "unset",
      "border-left-style": "unset",
      "border-left-color": "unset",
    });
  });

  it("revert", () => {
    const result = borderHandler.expand("revert");
    expect(result).toEqual({
      "border-top-width": "revert",
      "border-top-style": "revert",
      "border-top-color": "revert",
      "border-right-width": "revert",
      "border-right-style": "revert",
      "border-right-color": "revert",
      "border-bottom-width": "revert",
      "border-bottom-style": "revert",
      "border-bottom-color": "revert",
      "border-left-width": "revert",
      "border-left-style": "revert",
      "border-left-color": "revert",
    });
  });

  it("var(--my-color)", () => {
    const result = borderHandler.expand("var(--my-color)");
    expect(result).toEqual({
      "border-top-width": "medium",
      "border-top-style": "none",
      "border-top-color": "var(--my-color)",
      "border-right-width": "medium",
      "border-right-style": "none",
      "border-right-color": "var(--my-color)",
      "border-bottom-width": "medium",
      "border-bottom-style": "none",
      "border-bottom-color": "var(--my-color)",
      "border-left-width": "medium",
      "border-left-style": "none",
      "border-left-color": "var(--my-color)",
    });
  });

  it("1px solid var(--my-color)", () => {
    const result = borderHandler.expand("1px solid var(--my-color)");
    expect(result).toEqual({
      "border-top-width": "1px",
      "border-top-style": "solid",
      "border-top-color": "var(--my-color)",
      "border-right-width": "1px",
      "border-right-style": "solid",
      "border-right-color": "var(--my-color)",
      "border-bottom-width": "1px",
      "border-bottom-style": "solid",
      "border-bottom-color": "var(--my-color)",
      "border-left-width": "1px",
      "border-left-style": "solid",
      "border-left-color": "var(--my-color)",
    });
  });

  it("5px double #333 border-box", () => {
    const result = borderHandler.expand("5px double #333 border-box");
    expect(result).toEqual({
      "border-top-width": "5px",
      "border-top-style": "double",
      "border-top-color": "#333",
      "border-right-width": "5px",
      "border-right-style": "double",
      "border-right-color": "#333",
      "border-bottom-width": "5px",
      "border-bottom-style": "double",
      "border-bottom-color": "#333",
      "border-left-width": "5px",
      "border-left-style": "double",
      "border-left-color": "#333",
      "box-sizing": "border-box",
    });
  });
});
