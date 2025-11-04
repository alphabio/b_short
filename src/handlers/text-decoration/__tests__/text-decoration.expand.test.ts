// b_path:: src/handlers/text-decoration/__tests__/text-decoration.expand.test.ts
import { describe, expect, it } from "vitest";
import { textDecorationHandler } from "../expand";

describe("text-decoration expand", () => {
  it("none", () => {
    const result = textDecorationHandler.expand("none");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline", () => {
    const result = textDecorationHandler.expand("underline");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("overline", () => {
    const result = textDecorationHandler.expand("overline");
    expect(result).toEqual({
      "text-decoration-line": "overline",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("line-through", () => {
    const result = textDecorationHandler.expand("line-through");
    expect(result).toEqual({
      "text-decoration-line": "line-through",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline overline", () => {
    const result = textDecorationHandler.expand("underline overline");
    expect(result).toEqual({
      "text-decoration-line": "underline overline",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline line-through", () => {
    const result = textDecorationHandler.expand("underline line-through");
    expect(result).toEqual({
      "text-decoration-line": "underline line-through",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("overline line-through", () => {
    const result = textDecorationHandler.expand("overline line-through");
    expect(result).toEqual({
      "text-decoration-line": "overline line-through",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("solid", () => {
    const result = textDecorationHandler.expand("solid");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("double", () => {
    const result = textDecorationHandler.expand("double");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "double",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("dotted", () => {
    const result = textDecorationHandler.expand("dotted");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "dotted",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("dashed", () => {
    const result = textDecorationHandler.expand("dashed");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "dashed",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("wavy", () => {
    const result = textDecorationHandler.expand("wavy");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "wavy",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("red", () => {
    const result = textDecorationHandler.expand("red");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("#ff0000", () => {
    const result = textDecorationHandler.expand("#ff0000");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "#ff0000",
      "text-decoration-thickness": "auto",
    });
  });

  it("rgb(255, 0, 0)", () => {
    const result = textDecorationHandler.expand("rgb(255, 0, 0)");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "rgb(255,0,0)",
      "text-decoration-thickness": "auto",
    });
  });

  it("auto", () => {
    const result = textDecorationHandler.expand("auto");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("from-font", () => {
    const result = textDecorationHandler.expand("from-font");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "from-font",
    });
  });

  it("2px", () => {
    const result = textDecorationHandler.expand("2px");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "2px",
    });
  });

  it("0.1em", () => {
    const result = textDecorationHandler.expand("0.1em");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "0.1em",
    });
  });

  it("10%", () => {
    const result = textDecorationHandler.expand("10%");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "10%",
    });
  });

  it("underline solid", () => {
    const result = textDecorationHandler.expand("underline solid");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline red", () => {
    const result = textDecorationHandler.expand("underline red");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline 2px", () => {
    const result = textDecorationHandler.expand("underline 2px");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "2px",
    });
  });

  it("solid red", () => {
    const result = textDecorationHandler.expand("solid red");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("red solid", () => {
    const result = textDecorationHandler.expand("red solid");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline dotted red", () => {
    const result = textDecorationHandler.expand("underline dotted red");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "dotted",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("red dotted underline", () => {
    const result = textDecorationHandler.expand("red dotted underline");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "dotted",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline wavy #ff3028", () => {
    const result = textDecorationHandler.expand("underline wavy #ff3028");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "wavy",
      "text-decoration-color": "#ff3028",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline solid red 5px", () => {
    const result = textDecorationHandler.expand("underline solid red 5px");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "5px",
    });
  });

  it("5px red solid underline", () => {
    const result = textDecorationHandler.expand("5px red solid underline");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "5px",
    });
  });

  it("underline overline dotted", () => {
    const result = textDecorationHandler.expand("underline overline dotted");
    expect(result).toEqual({
      "text-decoration-line": "underline overline",
      "text-decoration-style": "dotted",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline overline red", () => {
    const result = textDecorationHandler.expand("underline overline red");
    expect(result).toEqual({
      "text-decoration-line": "underline overline",
      "text-decoration-style": "solid",
      "text-decoration-color": "red",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline overline wavy red 2px", () => {
    const result = textDecorationHandler.expand("underline overline wavy red 2px");
    expect(result).toEqual({
      "text-decoration-line": "underline overline",
      "text-decoration-style": "wavy",
      "text-decoration-color": "red",
      "text-decoration-thickness": "2px",
    });
  });

  it("inherit", () => {
    const result = textDecorationHandler.expand("inherit");
    expect(result).toEqual({
      "text-decoration-line": "inherit",
      "text-decoration-style": "inherit",
      "text-decoration-color": "inherit",
      "text-decoration-thickness": "inherit",
    });
  });

  it("initial", () => {
    const result = textDecorationHandler.expand("initial");
    expect(result).toEqual({
      "text-decoration-line": "initial",
      "text-decoration-style": "initial",
      "text-decoration-color": "initial",
      "text-decoration-thickness": "initial",
    });
  });

  it("unset", () => {
    const result = textDecorationHandler.expand("unset");
    expect(result).toEqual({
      "text-decoration-line": "unset",
      "text-decoration-style": "unset",
      "text-decoration-color": "unset",
      "text-decoration-thickness": "unset",
    });
  });

  it("revert", () => {
    const result = textDecorationHandler.expand("revert");
    expect(result).toEqual({
      "text-decoration-line": "revert",
      "text-decoration-style": "revert",
      "text-decoration-color": "revert",
      "text-decoration-thickness": "revert",
    });
  });

  it("var(--my-color)", () => {
    const result = textDecorationHandler.expand("var(--my-color)");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "var(--my-color)",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline var(--my-color)", () => {
    const result = textDecorationHandler.expand("underline var(--my-color)");
    expect(result).toEqual({
      "text-decoration-line": "underline",
      "text-decoration-style": "solid",
      "text-decoration-color": "var(--my-color)",
      "text-decoration-thickness": "auto",
    });
  });

  it("hsl(210 100% 50%)", () => {
    const result = textDecorationHandler.expand("hsl(210 100% 50%)");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "hsl(210,100%,50%)",
      "text-decoration-thickness": "auto",
    });
  });

  it("hsl(210 100% 50% / 0.8)", () => {
    const result = textDecorationHandler.expand("hsl(210 100% 50% / 0.8)");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "hsl(210,100%,50%/0.8)",
      "text-decoration-thickness": "auto",
    });
  });

  it("rgb(255 0 0 / 50%)", () => {
    const result = textDecorationHandler.expand("rgb(255 0 0 / 50%)");
    expect(result).toEqual({
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "rgb(255,0,0/50%)",
      "text-decoration-thickness": "auto",
    });
  });

  it("underline overline wavy hsl(210 100% 50% / 0.8) 0.1em", () => {
    const result = textDecorationHandler.expand(
      "underline overline wavy hsl(210 100% 50% / 0.8) 0.1em"
    );
    expect(result).toEqual({
      "text-decoration-line": "underline overline",
      "text-decoration-style": "wavy",
      "text-decoration-color": "hsl(210,100%,50%/0.8)",
      "text-decoration-thickness": "0.1em",
    });
  });
});
