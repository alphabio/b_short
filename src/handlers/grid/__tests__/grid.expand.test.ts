import { describe, expect, it } from "vitest";
import { gridHandler } from "../expand";

describe("grid expand", () => {
  it("inherit", () => {
    const result = gridHandler.expand("inherit");
    expect(result).toEqual({
      "grid-template-rows": "inherit",
      "grid-template-columns": "inherit",
      "grid-template-areas": "inherit",
      "grid-auto-rows": "inherit",
      "grid-auto-columns": "inherit",
      "grid-auto-flow": "inherit",
    });
  });

  it("initial", () => {
    const result = gridHandler.expand("initial");
    expect(result).toEqual({
      "grid-template-rows": "initial",
      "grid-template-columns": "initial",
      "grid-template-areas": "initial",
      "grid-auto-rows": "initial",
      "grid-auto-columns": "initial",
      "grid-auto-flow": "initial",
    });
  });

  it("unset", () => {
    const result = gridHandler.expand("unset");
    expect(result).toEqual({
      "grid-template-rows": "unset",
      "grid-template-columns": "unset",
      "grid-template-areas": "unset",
      "grid-auto-rows": "unset",
      "grid-auto-columns": "unset",
      "grid-auto-flow": "unset",
    });
  });

  it("revert", () => {
    const result = gridHandler.expand("revert");
    expect(result).toEqual({
      "grid-template-rows": "revert",
      "grid-template-columns": "revert",
      "grid-template-areas": "revert",
      "grid-auto-rows": "revert",
      "grid-auto-columns": "revert",
      "grid-auto-flow": "revert",
    });
  });

  it("none", () => {
    const result = gridHandler.expand("none");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("100px / 200px", () => {
    const result = gridHandler.expand("100px / 200px");
    expect(result).toEqual({
      "grid-template-rows": "100px",
      "grid-template-columns": "200px",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("100px 200px / 1fr 2fr", () => {
    const result = gridHandler.expand("100px 200px / 1fr 2fr");
    expect(result).toEqual({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("repeat(3, 1fr) / auto", () => {
    const result = gridHandler.expand("repeat(3, 1fr) / auto");
    expect(result).toEqual({
      "grid-template-rows": "repeat(3,1fr)",
      "grid-template-columns": "auto",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("minmax(100px, 1fr) / minmax(200px, 2fr)", () => {
    const result = gridHandler.expand("minmax(100px, 1fr) / minmax(200px, 2fr)");
    expect(result).toEqual({
      "grid-template-rows": "minmax(100px,1fr)",
      "grid-template-columns": "minmax(200px,2fr)",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("auto 1fr auto / 100px 200px", () => {
    const result = gridHandler.expand("auto 1fr auto / 100px 200px");
    expect(result).toEqual({
      "grid-template-rows": "auto 1fr auto",
      "grid-template-columns": "100px 200px",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("[line1] 100px [line2] 200px / 1fr 2fr", () => {
    const result = gridHandler.expand("[line1] 100px [line2] 200px / 1fr 2fr");
    expect(result).toEqual({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("fit-content(300px) / 1fr", () => {
    const result = gridHandler.expand("fit-content(300px) / 1fr");
    expect(result).toEqual({
      "grid-template-rows": "fit-content(300px)",
      "grid-template-columns": "1fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it('"header header" 100px "sidebar content" 200px / 1fr 2fr', () => {
    const result = gridHandler.expand('"header header" 100px "sidebar content" 200px / 1fr 2fr');
    expect(result).toEqual({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": '"header header" "sidebar content"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it('"a a" "b c" / 1fr 1fr', () => {
    const result = gridHandler.expand('"a a" "b c" / 1fr 1fr');
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "1fr 1fr",
      "grid-template-areas": '"a a" "b c"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it('"header" "main" "footer" / 100%', () => {
    const result = gridHandler.expand('"header" "main" "footer" / 100%');
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "100%",
      "grid-template-areas": '"header" "main" "footer"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it('"nav header header" "nav main aside" "nav footer footer" / 150px 1fr 200px', () => {
    const result = gridHandler.expand(
      '"nav header header" "nav main aside" "nav footer footer" / 150px 1fr 200px'
    );
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "150px 1fr 200px",
      "grid-template-areas": '"nav header header" "nav main aside" "nav footer footer"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("100px / auto-flow", () => {
    const result = gridHandler.expand("100px / auto-flow");
    expect(result).toEqual({
      "grid-template-rows": "100px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column",
    });
  });

  it("100px 200px / auto-flow", () => {
    const result = gridHandler.expand("100px 200px / auto-flow");
    expect(result).toEqual({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column",
    });
  });

  it("1fr 2fr / auto-flow dense", () => {
    const result = gridHandler.expand("1fr 2fr / auto-flow dense");
    expect(result).toEqual({
      "grid-template-rows": "1fr 2fr",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column dense",
    });
  });

  it("100px / auto-flow 200px", () => {
    const result = gridHandler.expand("100px / auto-flow 200px");
    expect(result).toEqual({
      "grid-template-rows": "100px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "200px",
      "grid-auto-flow": "column",
    });
  });

  it("100px / auto-flow dense 150px", () => {
    const result = gridHandler.expand("100px / auto-flow dense 150px");
    expect(result).toEqual({
      "grid-template-rows": "100px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "150px",
      "grid-auto-flow": "column dense",
    });
  });

  it("repeat(3, 100px) / auto-flow minmax(100px, 1fr)", () => {
    const result = gridHandler.expand("repeat(3, 100px) / auto-flow minmax(100px, 1fr)");
    expect(result).toEqual({
      "grid-template-rows": "repeat(3,100px)",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "minmax(100px,1fr)",
      "grid-auto-flow": "column",
    });
  });

  it("minmax(100px, auto) / auto-flow dense", () => {
    const result = gridHandler.expand("minmax(100px, auto) / auto-flow dense");
    expect(result).toEqual({
      "grid-template-rows": "minmax(100px,auto)",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column dense",
    });
  });

  it("auto-flow / 100px", () => {
    const result = gridHandler.expand("auto-flow / 100px");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "100px",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("auto-flow / 100px 200px", () => {
    const result = gridHandler.expand("auto-flow / 100px 200px");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "100px 200px",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("auto-flow dense / 1fr 2fr", () => {
    const result = gridHandler.expand("auto-flow dense / 1fr 2fr");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row dense",
    });
  });

  it("auto-flow 200px / 100px", () => {
    const result = gridHandler.expand("auto-flow 200px / 100px");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "100px",
      "grid-template-areas": "none",
      "grid-auto-rows": "200px",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("auto-flow dense 150px / 100px", () => {
    const result = gridHandler.expand("auto-flow dense 150px / 100px");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "100px",
      "grid-template-areas": "none",
      "grid-auto-rows": "150px",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row dense",
    });
  });

  it("auto-flow minmax(100px, 1fr) / repeat(3, 100px)", () => {
    const result = gridHandler.expand("auto-flow minmax(100px, 1fr) / repeat(3, 100px)");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "repeat(3,100px)",
      "grid-template-areas": "none",
      "grid-auto-rows": "minmax(100px,1fr)",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("auto-flow dense / minmax(100px, auto)", () => {
    const result = gridHandler.expand("auto-flow dense / minmax(100px, auto)");
    expect(result).toEqual({
      "grid-template-rows": "none",
      "grid-template-columns": "minmax(100px,auto)",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row dense",
    });
  });

  it("auto / auto", () => {
    const result = gridHandler.expand("auto / auto");
    expect(result).toEqual({
      "grid-template-rows": "auto",
      "grid-template-columns": "auto",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("1fr / 1fr", () => {
    const result = gridHandler.expand("1fr / 1fr");
    expect(result).toEqual({
      "grid-template-rows": "1fr",
      "grid-template-columns": "1fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("100% / 100%", () => {
    const result = gridHandler.expand("100% / 100%");
    expect(result).toEqual({
      "grid-template-rows": "100%",
      "grid-template-columns": "100%",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });

  it("min-content / max-content", () => {
    const result = gridHandler.expand("min-content / max-content");
    expect(result).toEqual({
      "grid-template-rows": "min-content",
      "grid-template-columns": "max-content",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
  });
});
