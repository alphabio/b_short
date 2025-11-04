import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("grid collapse", () => {
  it("collapses grid-column with auto end", () => {
    const result = collapse({
      "grid-column-start": "2",
      "grid-column-end": "auto",
    });
    expect(result.result).toEqual({ "grid-column": "2" });
  });

  it("collapses grid-row with start and end", () => {
    const result = collapse({
      "grid-row-start": "2",
      "grid-row-end": "4",
    });
    expect(result.result).toEqual({ "grid-row": "2 / 4" });
  });

  it("collapses grid to none when all defaults", () => {
    const result = collapse({
      "grid-template-rows": "none",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toEqual({
      grid: "none",
    });
  });

  it("collapses grid simple template", () => {
    const result = collapse({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toEqual({
      grid: "100px 200px / 1fr 2fr",
    });
  });

  it("collapses grid auto-flow columns", () => {
    const result = collapse({
      "grid-template-rows": "100px 200px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toMatchObject({ grid: "100px 200px / auto-flow" });
  });

  it("collapses grid auto-flow columns with dense", () => {
    const result = collapse({
      "grid-template-rows": "100px",
      "grid-template-columns": "none",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "50px",
      "grid-auto-flow": "row dense",
    });
    expect(result.result).toMatchObject({ grid: "100px / auto-flow dense 50px" });
  });

  it("collapses grid auto-flow rows", () => {
    const result = collapse({
      "grid-template-rows": "none",
      "grid-template-columns": "100px 200px",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column",
    });
    expect(result.result).toMatchObject({ grid: "auto-flow / 100px 200px" });
  });

  it("collapses grid auto-flow rows with auto-rows", () => {
    const result = collapse({
      "grid-template-rows": "none",
      "grid-template-columns": "1fr 2fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "minmax(100px, auto)",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "column",
    });
    expect(result.result).toMatchObject({ grid: "auto-flow minmax(100px, auto) / 1fr 2fr" });
  });

  it("collapses grid with template areas", () => {
    const result = collapse({
      "grid-template-rows": "100px",
      "grid-template-columns": "1fr",
      "grid-template-areas": '"header"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toMatchObject({ grid: '"header" 100px / 1fr' });
  });

  it("collapses grid with multi-row template areas", () => {
    const result = collapse({
      "grid-template-rows": "100px 1fr",
      "grid-template-columns": "200px 1fr",
      "grid-template-areas": '"header header" "sidebar content"',
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toMatchObject({
      grid: '"header header" 100px "sidebar content" 1fr / 200px 1fr',
    });
  });

  it("collapses grid-area named area", () => {
    const result = collapse({
      "grid-row-start": "header",
      "grid-column-start": "header",
      "grid-row-end": "header",
      "grid-column-end": "header",
    });
    expect(result.result).toEqual({ "grid-area": "header" });
  });
});
