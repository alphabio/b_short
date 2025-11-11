// b_path:: src/handlers/text-emphasis/__tests__/text-emphasis.expand.test.ts
import { describe, expect, it } from "vitest";
import { textEmphasisHandler } from "../expand";

describe("text-emphasis expand", () => {
  it("none", () => {
    const result = textEmphasisHandler.expand("none");
    expect(result).toEqual({
      "text-emphasis-style": "none",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("filled", () => {
    const result = textEmphasisHandler.expand("filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("open", () => {
    const result = textEmphasisHandler.expand("open");
    expect(result).toEqual({
      "text-emphasis-style": "open",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("red", () => {
    const result = textEmphasisHandler.expand("red");
    expect(result).toEqual({
      "text-emphasis-style": "none",
      "text-emphasis-color": "red",
    });
  });

  it("#ff0000", () => {
    const result = textEmphasisHandler.expand("#ff0000");
    expect(result).toEqual({
      "text-emphasis-style": "none",
      "text-emphasis-color": "#ff0000",
    });
  });

  it("filled dot", () => {
    const result = textEmphasisHandler.expand("filled dot");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("open circle", () => {
    const result = textEmphasisHandler.expand("open circle");
    expect(result).toEqual({
      "text-emphasis-style": "open circle",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("filled triangle", () => {
    const result = textEmphasisHandler.expand("filled triangle");
    expect(result).toEqual({
      "text-emphasis-style": "filled triangle",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("open sesame", () => {
    const result = textEmphasisHandler.expand("open sesame");
    expect(result).toEqual({
      "text-emphasis-style": "open sesame",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("dot filled", () => {
    const result = textEmphasisHandler.expand("dot filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("circle open", () => {
    const result = textEmphasisHandler.expand("circle open");
    expect(result).toEqual({
      "text-emphasis-style": "open circle",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("triangle filled", () => {
    const result = textEmphasisHandler.expand("triangle filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled triangle",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("sesame open", () => {
    const result = textEmphasisHandler.expand("sesame open");
    expect(result).toEqual({
      "text-emphasis-style": "open sesame",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("double-circle filled", () => {
    const result = textEmphasisHandler.expand("double-circle filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled double-circle",
      "text-emphasis-color": "currentcolor",
    });
  });

  it("filled red", () => {
    const result = textEmphasisHandler.expand("filled red");
    expect(result).toEqual({
      "text-emphasis-style": "filled",
      "text-emphasis-color": "red",
    });
  });

  it("red filled", () => {
    const result = textEmphasisHandler.expand("red filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled",
      "text-emphasis-color": "red",
    });
  });

  it("filled dot #555", () => {
    const result = textEmphasisHandler.expand("filled dot #555");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "#555",
    });
  });

  it("#555 filled dot", () => {
    const result = textEmphasisHandler.expand("#555 filled dot");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "#555",
    });
  });

  it("dot filled #555", () => {
    const result = textEmphasisHandler.expand("dot filled #555");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "#555",
    });
  });

  it("#555 dot filled", () => {
    const result = textEmphasisHandler.expand("#555 dot filled");
    expect(result).toEqual({
      "text-emphasis-style": "filled dot",
      "text-emphasis-color": "#555",
    });
  });

  it("triangle rgb(255, 0, 0)", () => {
    const result = textEmphasisHandler.expand("triangle rgb(255, 0, 0)");
    expect(result).toEqual({
      "text-emphasis-style": "triangle",
      "text-emphasis-color": "rgb(255,0,0)",
    });
  });

  it('"*"', () => {
    const result = textEmphasisHandler.expand('"*"');
    expect(result).toEqual({
      "text-emphasis-style": '"*"',
      "text-emphasis-color": "currentcolor",
    });
  });

  it("'※'", () => {
    const result = textEmphasisHandler.expand("'※'");
    expect(result).toEqual({
      "text-emphasis-style": "'※'",
      "text-emphasis-color": "currentcolor",
    });
  });

  it('"※" red', () => {
    const result = textEmphasisHandler.expand('"※" red');
    expect(result).toEqual({
      "text-emphasis-style": '"※"',
      "text-emphasis-color": "red",
    });
  });

  it("inherit", () => {
    const result = textEmphasisHandler.expand("inherit");
    expect(result).toEqual({
      "text-emphasis-style": "inherit",
      "text-emphasis-color": "inherit",
    });
  });

  it("initial", () => {
    const result = textEmphasisHandler.expand("initial");
    expect(result).toEqual({
      "text-emphasis-style": "initial",
      "text-emphasis-color": "initial",
    });
  });

  it("unset", () => {
    const result = textEmphasisHandler.expand("unset");
    expect(result).toEqual({
      "text-emphasis-style": "unset",
      "text-emphasis-color": "unset",
    });
  });

  it("revert", () => {
    const result = textEmphasisHandler.expand("revert");
    expect(result).toEqual({
      "text-emphasis-style": "revert",
      "text-emphasis-color": "revert",
    });
  });

  it("var(--my-color)", () => {
    const result = textEmphasisHandler.expand("var(--my-color)");
    expect(result).toEqual({
      "text-emphasis-style": "none",
      "text-emphasis-color": "var(--my-color)",
    });
  });

  it("filled var(--my-color)", () => {
    const result = textEmphasisHandler.expand("filled var(--my-color)");
    expect(result).toEqual({
      "text-emphasis-style": "filled",
      "text-emphasis-color": "var(--my-color)",
    });
  });
});
