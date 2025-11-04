// b_path:: src/handlers/font/__tests__/font.expand.test.ts
import { describe, expect, it } from "vitest";
import { fontHandler } from "../expand";

describe("font expand", () => {
  it("16px sans-serif", () => {
    const result = fontHandler.expand("16px sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it('16px sans-serif, "Times New Roman"', () => {
    const result = fontHandler.expand('16px sans-serif, "Times New Roman"');
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": 'sans-serif, "Times New Roman"',
    });
  });

  it("16px / 1.2 sans-serif", () => {
    const result = fontHandler.expand("16px / 1.2 sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "line-height": "1.2",
      "font-family": "sans-serif",
    });
  });

  it("bold 16px sans-serif", () => {
    const result = fontHandler.expand("bold 16px sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "bold",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it("normal 16px sans-serif", () => {
    const result = fontHandler.expand("normal 16px sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it("italic 16px sans-serif", () => {
    const result = fontHandler.expand("italic 16px sans-serif");
    expect(result).toEqual({
      "font-style": "italic",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it("small-caps 16px sans-serif", () => {
    const result = fontHandler.expand("small-caps 16px sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "small-caps",
      "font-weight": "normal",
      "font-stretch": "normal",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it("ultra-condensed 16px sans-serif", () => {
    const result = fontHandler.expand("ultra-condensed 16px sans-serif");
    expect(result).toEqual({
      "font-style": "normal",
      "font-variant": "normal",
      "font-weight": "normal",
      "font-stretch": "ultra-condensed",
      "font-size": "16px",
      "font-family": "sans-serif",
    });
  });

  it('oblique 500 small-caps semi-expanded 20% / 2em monospace, "Times New Roman", Helvetica', () => {
    const result = fontHandler.expand(
      'oblique 500 small-caps semi-expanded 20% / 2em monospace, "Times New Roman", Helvetica'
    );
    expect(result).toEqual({
      "font-style": "oblique",
      "font-variant": "small-caps",
      "font-weight": "500",
      "font-stretch": "semi-expanded",
      "font-size": "20%",
      "line-height": "2em",
      "font-family": 'monospace, "Times New Roman", "Helvetica"',
    });
  });

  it("inherit", () => {
    const result = fontHandler.expand("inherit");
    expect(result).toEqual({
      "font-style": "inherit",
      "font-variant": "inherit",
      "font-weight": "inherit",
      "font-stretch": "inherit",
      "font-size": "inherit",
      "line-height": "inherit",
      "font-family": "inherit",
    });
  });
});
