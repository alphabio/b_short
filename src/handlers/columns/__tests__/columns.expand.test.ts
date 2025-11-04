// b_path:: src/handlers/columns/__tests__/columns.expand.test.ts
import { describe, expect, it } from "vitest";
import { columnsHandler } from "../expand";

describe("columns expand", () => {
  it("0", () => {
    const result = columnsHandler.expand("0");
    expect(result).toEqual({
      "column-width": "0",
    });
  });

  it("2", () => {
    const result = columnsHandler.expand("2");
    expect(result).toEqual({
      "column-count": "2",
    });
  });

  it("3", () => {
    const result = columnsHandler.expand("3");
    expect(result).toEqual({
      "column-count": "3",
    });
  });

  it("5", () => {
    const result = columnsHandler.expand("5");
    expect(result).toEqual({
      "column-count": "5",
    });
  });

  it("100px", () => {
    const result = columnsHandler.expand("100px");
    expect(result).toEqual({
      "column-width": "100px",
    });
  });

  it("10em", () => {
    const result = columnsHandler.expand("10em");
    expect(result).toEqual({
      "column-width": "10em",
    });
  });

  it("5rem", () => {
    const result = columnsHandler.expand("5rem");
    expect(result).toEqual({
      "column-width": "5rem",
    });
  });

  it("auto", () => {
    const result = columnsHandler.expand("auto");
    expect(result).toEqual({
      "column-width": "auto",
    });
  });

  it("100px 3", () => {
    const result = columnsHandler.expand("100px 3");
    expect(result).toEqual({
      "column-width": "100px",
      "column-count": "3",
    });
  });

  it("3 100px", () => {
    const result = columnsHandler.expand("3 100px");
    expect(result).toEqual({
      "column-width": "100px",
      "column-count": "3",
    });
  });

  it("10em 2", () => {
    const result = columnsHandler.expand("10em 2");
    expect(result).toEqual({
      "column-width": "10em",
      "column-count": "2",
    });
  });

  it("4 5rem", () => {
    const result = columnsHandler.expand("4 5rem");
    expect(result).toEqual({
      "column-width": "5rem",
      "column-count": "4",
    });
  });

  it("auto 3", () => {
    const result = columnsHandler.expand("auto 3");
    expect(result).toEqual({
      "column-width": "auto",
      "column-count": "3",
    });
  });

  it("2 auto", () => {
    const result = columnsHandler.expand("2 auto");
    expect(result).toEqual({
      "column-width": "auto",
      "column-count": "2",
    });
  });

  it("100px auto", () => {
    const result = columnsHandler.expand("100px auto");
    expect(result).toEqual({
      "column-width": "100px",
      "column-count": "auto",
    });
  });

  it("auto 10em", () => {
    const result = columnsHandler.expand("auto 10em");
    expect(result).toEqual({
      "column-width": "10em",
      "column-count": "auto",
    });
  });

  it("inherit", () => {
    const result = columnsHandler.expand("inherit");
    expect(result).toEqual({
      "column-width": "inherit",
      "column-count": "inherit",
    });
  });

  it("initial", () => {
    const result = columnsHandler.expand("initial");
    expect(result).toEqual({
      "column-width": "initial",
      "column-count": "initial",
    });
  });

  it("unset", () => {
    const result = columnsHandler.expand("unset");
    expect(result).toEqual({
      "column-width": "unset",
      "column-count": "unset",
    });
  });

  it("revert", () => {
    const result = columnsHandler.expand("revert");
    expect(result).toEqual({
      "column-width": "revert",
      "column-count": "revert",
    });
  });
});
