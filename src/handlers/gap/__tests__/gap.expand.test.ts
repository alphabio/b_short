// b_path:: src/handlers/gap/__tests__/gap.expand.test.ts
import { describe, expect, it } from "vitest";
import { gapHandler } from "../expand";

describe("gap expand", () => {
  it("inherit", () => {
    const result = gapHandler.expand("inherit");
    expect(result).toEqual({
      "row-gap": "inherit",
      "column-gap": "inherit",
    });
  });

  it("initial", () => {
    const result = gapHandler.expand("initial");
    expect(result).toEqual({
      "row-gap": "initial",
      "column-gap": "initial",
    });
  });

  it("unset", () => {
    const result = gapHandler.expand("unset");
    expect(result).toEqual({
      "row-gap": "unset",
      "column-gap": "unset",
    });
  });

  it("revert", () => {
    const result = gapHandler.expand("revert");
    expect(result).toEqual({
      "row-gap": "revert",
      "column-gap": "revert",
    });
  });
});
