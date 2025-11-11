// b_path:: src/handlers/grid-area/__tests__/grid-area.expand.test.ts
import { describe, expect, it } from "vitest";
import { gridAreaHandler } from "../expand";

describe("grid-area expand", () => {
  it("1", () => {
    const result = gridAreaHandler.expand("1");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "auto",
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("inherit", () => {
    const result = gridAreaHandler.expand("inherit");
    expect(result).toEqual({
      "grid-row-start": "inherit",
      "grid-row-end": "inherit",
      "grid-column-start": "inherit",
      "grid-column-end": "inherit",
    });
  });

  it("initial", () => {
    const result = gridAreaHandler.expand("initial");
    expect(result).toEqual({
      "grid-row-start": "initial",
      "grid-row-end": "initial",
      "grid-column-start": "initial",
      "grid-column-end": "initial",
    });
  });

  it("unset", () => {
    const result = gridAreaHandler.expand("unset");
    expect(result).toEqual({
      "grid-row-start": "unset",
      "grid-row-end": "unset",
      "grid-column-start": "unset",
      "grid-column-end": "unset",
    });
  });

  it("revert", () => {
    const result = gridAreaHandler.expand("revert");
    expect(result).toEqual({
      "grid-row-start": "revert",
      "grid-row-end": "revert",
      "grid-column-start": "revert",
      "grid-column-end": "revert",
    });
  });

  it("auto", () => {
    const result = gridAreaHandler.expand("auto");
    expect(result).toEqual({
      "grid-row-start": "auto",
      "grid-row-end": "auto",
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("header", () => {
    const result = gridAreaHandler.expand("header");
    expect(result).toEqual({
      "grid-row-start": "header",
      "grid-row-end": "header",
      "grid-column-start": "header",
      "grid-column-end": "header",
    });
  });

  it("main", () => {
    const result = gridAreaHandler.expand("main");
    expect(result).toEqual({
      "grid-row-start": "main",
      "grid-row-end": "main",
      "grid-column-start": "main",
      "grid-column-end": "main",
    });
  });

  it("span 2", () => {
    const result = gridAreaHandler.expand("span 2");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "auto",
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("1 / 2", () => {
    const result = gridAreaHandler.expand("1 / 2");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "auto",
      "grid-column-start": "2",
      "grid-column-end": "auto",
    });
  });

  it("header / sidebar", () => {
    const result = gridAreaHandler.expand("header / sidebar");
    expect(result).toEqual({
      "grid-row-start": "header",
      "grid-row-end": "header",
      "grid-column-start": "sidebar",
      "grid-column-end": "sidebar",
    });
  });

  it("1 / main", () => {
    const result = gridAreaHandler.expand("1 / main");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "auto",
      "grid-column-start": "main",
      "grid-column-end": "main",
    });
  });

  it("span 2 / 3", () => {
    const result = gridAreaHandler.expand("span 2 / 3");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "auto",
      "grid-column-start": "3",
      "grid-column-end": "auto",
    });
  });

  it("1 / 2 / 3", () => {
    const result = gridAreaHandler.expand("1 / 2 / 3");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "3",
      "grid-column-start": "2",
      "grid-column-end": "auto",
    });
  });

  it("header / sidebar / footer", () => {
    const result = gridAreaHandler.expand("header / sidebar / footer");
    expect(result).toEqual({
      "grid-row-start": "header",
      "grid-row-end": "footer",
      "grid-column-start": "sidebar",
      "grid-column-end": "sidebar",
    });
  });

  it("1 / main / 4", () => {
    const result = gridAreaHandler.expand("1 / main / 4");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "4",
      "grid-column-start": "main",
      "grid-column-end": "main",
    });
  });

  it("span 2 / 3 / 5", () => {
    const result = gridAreaHandler.expand("span 2 / 3 / 5");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "5",
      "grid-column-start": "3",
      "grid-column-end": "auto",
    });
  });

  it("1 / 2 / 3 / 4", () => {
    const result = gridAreaHandler.expand("1 / 2 / 3 / 4");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "3",
      "grid-column-start": "2",
      "grid-column-end": "4",
    });
  });

  it("1 / 2 / span 2 / span 3", () => {
    const result = gridAreaHandler.expand("1 / 2 / span 2 / span 3");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "span 2",
      "grid-column-start": "2",
      "grid-column-end": "span 3",
    });
  });

  it("header / sidebar / footer / main", () => {
    const result = gridAreaHandler.expand("header / sidebar / footer / main");
    expect(result).toEqual({
      "grid-row-start": "header",
      "grid-row-end": "footer",
      "grid-column-start": "sidebar",
      "grid-column-end": "main",
    });
  });

  it("auto / auto / auto / auto", () => {
    const result = gridAreaHandler.expand("auto / auto / auto / auto");
    expect(result).toEqual({
      "grid-row-start": "auto",
      "grid-row-end": "auto",
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("2 main-start / 3 / 4 main-end / 5", () => {
    const result = gridAreaHandler.expand("2 main-start / 3 / 4 main-end / 5");
    expect(result).toEqual({
      "grid-row-start": "2 main-start",
      "grid-row-end": "4 main-end",
      "grid-column-start": "3",
      "grid-column-end": "5",
    });
  });

  it("1  /  2  /  3  /  4", () => {
    const result = gridAreaHandler.expand("1  /  2  /  3  /  4");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "3",
      "grid-column-start": "2",
      "grid-column-end": "4",
    });
  });

  it("-1 / -2 / -3 / -4", () => {
    const result = gridAreaHandler.expand("-1 / -2 / -3 / -4");
    expect(result).toEqual({
      "grid-row-start": "-1",
      "grid-row-end": "-3",
      "grid-column-start": "-2",
      "grid-column-end": "-4",
    });
  });

  it("span 2 / span 3 / 5 / 6", () => {
    const result = gridAreaHandler.expand("span 2 / span 3 / 5 / 6");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "5",
      "grid-column-start": "span 3",
      "grid-column-end": "6",
    });
  });
});
