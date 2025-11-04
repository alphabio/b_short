import { describe, expect, it } from "vitest";
import { containIntrinsicSizeHandler } from "../expand";

describe("contain-intrinsic-size expand", () => {
  it("1000px", () => {
    const result = containIntrinsicSizeHandler.expand("1000px");
    expect(result).toEqual({
      "contain-intrinsic-width": "1000px",
      "contain-intrinsic-height": "1000px",
    });
  });

  it("10rem", () => {
    const result = containIntrinsicSizeHandler.expand("10rem");
    expect(result).toEqual({
      "contain-intrinsic-width": "10rem",
      "contain-intrinsic-height": "10rem",
    });
  });

  it("1.5em", () => {
    const result = containIntrinsicSizeHandler.expand("1.5em");
    expect(result).toEqual({
      "contain-intrinsic-width": "1.5em",
      "contain-intrinsic-height": "1.5em",
    });
  });

  it("1000px 1.5em", () => {
    const result = containIntrinsicSizeHandler.expand("1000px 1.5em");
    expect(result).toEqual({
      "contain-intrinsic-width": "1000px",
      "contain-intrinsic-height": "1.5em",
    });
  });

  it("500px 800px", () => {
    const result = containIntrinsicSizeHandler.expand("500px 800px");
    expect(result).toEqual({
      "contain-intrinsic-width": "500px",
      "contain-intrinsic-height": "800px",
    });
  });

  it("10rem 20rem", () => {
    const result = containIntrinsicSizeHandler.expand("10rem 20rem");
    expect(result).toEqual({
      "contain-intrinsic-width": "10rem",
      "contain-intrinsic-height": "20rem",
    });
  });

  it("none", () => {
    const result = containIntrinsicSizeHandler.expand("none");
    expect(result).toEqual({
      "contain-intrinsic-width": "none",
      "contain-intrinsic-height": "none",
    });
  });

  it("auto 300px", () => {
    const result = containIntrinsicSizeHandler.expand("auto 300px");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto 300px",
      "contain-intrinsic-height": "auto 300px",
    });
  });

  it("auto 10rem", () => {
    const result = containIntrinsicSizeHandler.expand("auto 10rem");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto 10rem",
      "contain-intrinsic-height": "auto 10rem",
    });
  });

  it("auto none", () => {
    const result = containIntrinsicSizeHandler.expand("auto none");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto none",
      "contain-intrinsic-height": "auto none",
    });
  });

  it("auto 300px auto 4rem", () => {
    const result = containIntrinsicSizeHandler.expand("auto 300px auto 4rem");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto 300px",
      "contain-intrinsic-height": "auto 4rem",
    });
  });

  it("auto 100px auto 200px", () => {
    const result = containIntrinsicSizeHandler.expand("auto 100px auto 200px");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto 100px",
      "contain-intrinsic-height": "auto 200px",
    });
  });

  it("none 100px", () => {
    const result = containIntrinsicSizeHandler.expand("none 100px");
    expect(result).toEqual({
      "contain-intrinsic-width": "none",
      "contain-intrinsic-height": "100px",
    });
  });

  it("100px none", () => {
    const result = containIntrinsicSizeHandler.expand("100px none");
    expect(result).toEqual({
      "contain-intrinsic-width": "100px",
      "contain-intrinsic-height": "none",
    });
  });

  it("auto 300px 500px", () => {
    const result = containIntrinsicSizeHandler.expand("auto 300px 500px");
    expect(result).toEqual({
      "contain-intrinsic-width": "auto 300px",
      "contain-intrinsic-height": "500px",
    });
  });

  it("200px auto 400px", () => {
    const result = containIntrinsicSizeHandler.expand("200px auto 400px");
    expect(result).toEqual({
      "contain-intrinsic-width": "200px",
      "contain-intrinsic-height": "auto 400px",
    });
  });

  it("inherit", () => {
    const result = containIntrinsicSizeHandler.expand("inherit");
    expect(result).toEqual({
      "contain-intrinsic-width": "inherit",
      "contain-intrinsic-height": "inherit",
    });
  });

  it("initial", () => {
    const result = containIntrinsicSizeHandler.expand("initial");
    expect(result).toEqual({
      "contain-intrinsic-width": "initial",
      "contain-intrinsic-height": "initial",
    });
  });

  it("unset", () => {
    const result = containIntrinsicSizeHandler.expand("unset");
    expect(result).toEqual({
      "contain-intrinsic-width": "unset",
      "contain-intrinsic-height": "unset",
    });
  });

  it("revert", () => {
    const result = containIntrinsicSizeHandler.expand("revert");
    expect(result).toEqual({
      "contain-intrinsic-width": "revert",
      "contain-intrinsic-height": "revert",
    });
  });
});
