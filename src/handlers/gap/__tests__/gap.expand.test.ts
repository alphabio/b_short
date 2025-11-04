import { describe, expect, it } from "vitest";
import { gapHandler } from "../expand";

describe("gap expand", () => {
  it("inherit", () => {
    const result = gapHandler.expand("inherit");
    expect(result).toEqual({
      "gap: inherit": {
        "row-gap": "inherit",
        "column-gap": "inherit",
      },
    });
  });

  it("initial", () => {
    const result = gapHandler.expand("initial");
    expect(result).toEqual({
      "gap: initial": {
        "row-gap": "initial",
        "column-gap": "initial",
      },
    });
  });

  it("unset", () => {
    const result = gapHandler.expand("unset");
    expect(result).toEqual({
      "gap: unset": {
        "row-gap": "unset",
        "column-gap": "unset",
      },
    });
  });

  it("revert", () => {
    const result = gapHandler.expand("revert");
    expect(result).toEqual({
      "gap: revert": {
        "row-gap": "revert",
        "column-gap": "revert",
      },
    });
  });

  it("single-value", () => {
    const result = gapHandler.expand("single-value");
    expect(result).toEqual({
      "gap: 10px": {
        "row-gap": "10px",
        "column-gap": "10px",
      },
      "gap: normal": {
        "row-gap": "normal",
        "column-gap": "normal",
      },
      "gap: 1rem": {
        "row-gap": "1rem",
        "column-gap": "1rem",
      },
    });
  });

  it("two-values", () => {
    const result = gapHandler.expand("two-values");
    expect(result).toEqual({
      "gap: 10px 20px": {
        "row-gap": "10px",
        "column-gap": "20px",
      },
      "gap: 1rem 2rem": {
        "row-gap": "1rem",
        "column-gap": "2rem",
      },
      "gap: normal 10px": {
        "row-gap": "normal",
        "column-gap": "10px",
      },
      "gap: 5% 10%": {
        "row-gap": "5%",
        "column-gap": "10%",
      },
    });
  });
});
