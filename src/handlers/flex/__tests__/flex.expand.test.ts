// b_path:: src/handlers/flex/__tests__/flex.expand.test.ts
import { describe, expect, it } from "vitest";
import { flexHandler } from "../expand";

describe("flex expand", () => {
  it("0", () => {
    const result = flexHandler.expand("0");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("1", () => {
    const result = flexHandler.expand("1");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("2", () => {
    const result = flexHandler.expand("2");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("none", () => {
    const result = flexHandler.expand("none");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "0",
      "flex-basis": "auto",
    });
  });

  it("auto", () => {
    const result = flexHandler.expand("auto");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
  });

  it("initial", () => {
    const result = flexHandler.expand("initial");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
  });

  it("0.5", () => {
    const result = flexHandler.expand("0.5");
    expect(result).toEqual({
      "flex-grow": "0.5",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("3.14", () => {
    const result = flexHandler.expand("3.14");
    expect(result).toEqual({
      "flex-grow": "3.14",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("100px", () => {
    const result = flexHandler.expand("100px");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
  });

  it("10em", () => {
    const result = flexHandler.expand("10em");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "10em",
    });
  });

  it("50%", () => {
    const result = flexHandler.expand("50%");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "50%",
    });
  });

  it("20rem", () => {
    const result = flexHandler.expand("20rem");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "20rem",
    });
  });

  it("content", () => {
    const result = flexHandler.expand("content");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "content",
    });
  });

  it("max-content", () => {
    const result = flexHandler.expand("max-content");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "max-content",
    });
  });

  it("min-content", () => {
    const result = flexHandler.expand("min-content");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "min-content",
    });
  });

  it("1 1", () => {
    const result = flexHandler.expand("1 1");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("2 1", () => {
    const result = flexHandler.expand("2 1");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("1 0", () => {
    const result = flexHandler.expand("1 0");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "0",
      "flex-basis": "0%",
    });
  });

  it("0 1", () => {
    const result = flexHandler.expand("0 1");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
  });

  it("2 2", () => {
    const result = flexHandler.expand("2 2");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "2",
      "flex-basis": "0%",
    });
  });

  it("1 100px", () => {
    const result = flexHandler.expand("1 100px");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
  });

  it("2 50%", () => {
    const result = flexHandler.expand("2 50%");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "1",
      "flex-basis": "50%",
    });
  });

  it("0 auto", () => {
    const result = flexHandler.expand("0 auto");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
  });

  it("3 10em", () => {
    const result = flexHandler.expand("3 10em");
    expect(result).toEqual({
      "flex-grow": "3",
      "flex-shrink": "1",
      "flex-basis": "10em",
    });
  });

  it("1 content", () => {
    const result = flexHandler.expand("1 content");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "content",
    });
  });

  it("100px 1", () => {
    const result = flexHandler.expand("100px 1");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
  });

  it("50% 2", () => {
    const result = flexHandler.expand("50% 2");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "1",
      "flex-basis": "50%",
    });
  });

  it("10em 3", () => {
    const result = flexHandler.expand("10em 3");
    expect(result).toEqual({
      "flex-grow": "3",
      "flex-shrink": "1",
      "flex-basis": "10em",
    });
  });

  it("auto 0", () => {
    const result = flexHandler.expand("auto 0");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
  });

  it("content 1", () => {
    const result = flexHandler.expand("content 1");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "content",
    });
  });

  it("20rem 0.5", () => {
    const result = flexHandler.expand("20rem 0.5");
    expect(result).toEqual({
      "flex-grow": "0.5",
      "flex-shrink": "1",
      "flex-basis": "20rem",
    });
  });

  it("1 1 auto", () => {
    const result = flexHandler.expand("1 1 auto");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
  });

  it("2 1 100px", () => {
    const result = flexHandler.expand("2 1 100px");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
  });

  it("0 0 auto", () => {
    const result = flexHandler.expand("0 0 auto");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "0",
      "flex-basis": "auto",
    });
  });

  it("1 0 50%", () => {
    const result = flexHandler.expand("1 0 50%");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "0",
      "flex-basis": "50%",
    });
  });

  it("2 2 10em", () => {
    const result = flexHandler.expand("2 2 10em");
    expect(result).toEqual({
      "flex-grow": "2",
      "flex-shrink": "2",
      "flex-basis": "10em",
    });
  });

  it("0.5 1.5 200px", () => {
    const result = flexHandler.expand("0.5 1.5 200px");
    expect(result).toEqual({
      "flex-grow": "0.5",
      "flex-shrink": "1.5",
      "flex-basis": "200px",
    });
  });

  it("inherit", () => {
    const result = flexHandler.expand("inherit");
    expect(result).toEqual({
      "flex-grow": "inherit",
      "flex-shrink": "inherit",
      "flex-basis": "inherit",
    });
  });

  it("unset", () => {
    const result = flexHandler.expand("unset");
    expect(result).toEqual({
      "flex-grow": "unset",
      "flex-shrink": "unset",
      "flex-basis": "unset",
    });
  });

  it("revert", () => {
    const result = flexHandler.expand("revert");
    expect(result).toEqual({
      "flex-grow": "revert",
      "flex-shrink": "revert",
      "flex-basis": "revert",
    });
  });

  it("1 1 0", () => {
    const result = flexHandler.expand("1 1 0");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "0",
    });
  });

  it("0 0 0", () => {
    const result = flexHandler.expand("0 0 0");
    expect(result).toEqual({
      "flex-grow": "0",
      "flex-shrink": "0",
      "flex-basis": "0",
    });
  });

  it("1 fit-content(200px)", () => {
    const result = flexHandler.expand("1 fit-content(200px)");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "fit-content(200px)",
    });
  });

  it("1 1 fit-content(50%)", () => {
    const result = flexHandler.expand("1 1 fit-content(50%)");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "fit-content(50%)",
    });
  });
});
