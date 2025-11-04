import { describe, expect, it } from "vitest";
import { outlineHandler } from "../expand";

describe("outline expand", () => {
  it("1px solid #000", () => {
    const result = outlineHandler.expand("1px solid #000");
    expect(result).toEqual({
      "outline-width": "1px",
      "outline-style": "solid",
      "outline-color": "#000",
    });
  });

  it("solid 1px #000", () => {
    const result = outlineHandler.expand("solid 1px #000");
    expect(result).toEqual({
      "outline-width": "1px",
      "outline-style": "solid",
      "outline-color": "#000",
    });
  });

  it("solid #000000 1px", () => {
    const result = outlineHandler.expand("solid #000000 1px");
    expect(result).toEqual({
      "outline-width": "1px",
      "outline-style": "solid",
      "outline-color": "#000000",
    });
  });

  it("solid", () => {
    const result = outlineHandler.expand("solid");
    expect(result).toEqual({
      "outline-width": "medium",
      "outline-style": "solid",
      "outline-color": "currentcolor",
    });
  });

  it("black", () => {
    const result = outlineHandler.expand("black");
    expect(result).toEqual({
      "outline-width": "medium",
      "outline-style": "none",
      "outline-color": "black",
    });
  });

  it("1px", () => {
    const result = outlineHandler.expand("1px");
    expect(result).toEqual({
      "outline-width": "1px",
      "outline-style": "none",
      "outline-color": "currentcolor",
    });
  });

  it("inherit", () => {
    const result = outlineHandler.expand("inherit");
    expect(result).toEqual({
      "outline-width": "inherit",
      "outline-style": "inherit",
      "outline-color": "inherit",
    });
  });

  it("initial", () => {
    const result = outlineHandler.expand("initial");
    expect(result).toEqual({
      "outline-width": "initial",
      "outline-style": "initial",
      "outline-color": "initial",
    });
  });

  it("unset", () => {
    const result = outlineHandler.expand("unset");
    expect(result).toEqual({
      "outline-width": "unset",
      "outline-style": "unset",
      "outline-color": "unset",
    });
  });

  it("revert", () => {
    const result = outlineHandler.expand("revert");
    expect(result).toEqual({
      "outline-width": "revert",
      "outline-style": "revert",
      "outline-color": "revert",
    });
  });
});
