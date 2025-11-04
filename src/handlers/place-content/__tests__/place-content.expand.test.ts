// b_path:: src/handlers/place-content/__tests__/place-content.expand.test.ts
import { describe, expect, it } from "vitest";
import { placeContentHandler } from "../expand";

describe("place-content expand", () => {
  it("normal", () => {
    const result = placeContentHandler.expand("normal");
    expect(result).toEqual({
      "align-content": "normal",
      "justify-content": "normal",
    });
  });

  it("center", () => {
    const result = placeContentHandler.expand("center");
    expect(result).toEqual({
      "align-content": "center",
      "justify-content": "center",
    });
  });

  it("start", () => {
    const result = placeContentHandler.expand("start");
    expect(result).toEqual({
      "align-content": "start",
      "justify-content": "start",
    });
  });

  it("end", () => {
    const result = placeContentHandler.expand("end");
    expect(result).toEqual({
      "align-content": "end",
      "justify-content": "end",
    });
  });

  it("flex-start", () => {
    const result = placeContentHandler.expand("flex-start");
    expect(result).toEqual({
      "align-content": "flex-start",
      "justify-content": "flex-start",
    });
  });

  it("flex-end", () => {
    const result = placeContentHandler.expand("flex-end");
    expect(result).toEqual({
      "align-content": "flex-end",
      "justify-content": "flex-end",
    });
  });

  it("space-between", () => {
    const result = placeContentHandler.expand("space-between");
    expect(result).toEqual({
      "align-content": "space-between",
      "justify-content": "space-between",
    });
  });

  it("space-around", () => {
    const result = placeContentHandler.expand("space-around");
    expect(result).toEqual({
      "align-content": "space-around",
      "justify-content": "space-around",
    });
  });

  it("space-evenly", () => {
    const result = placeContentHandler.expand("space-evenly");
    expect(result).toEqual({
      "align-content": "space-evenly",
      "justify-content": "space-evenly",
    });
  });

  it("stretch", () => {
    const result = placeContentHandler.expand("stretch");
    expect(result).toEqual({
      "align-content": "stretch",
      "justify-content": "stretch",
    });
  });

  it("baseline", () => {
    const result = placeContentHandler.expand("baseline");
    expect(result).toEqual({
      "align-content": "baseline",
      "justify-content": "baseline",
    });
  });

  it("first baseline", () => {
    const result = placeContentHandler.expand("first baseline");
    expect(result).toEqual({
      "align-content": "first baseline",
      "justify-content": "first baseline",
    });
  });

  it("last baseline", () => {
    const result = placeContentHandler.expand("last baseline");
    expect(result).toEqual({
      "align-content": "last baseline",
      "justify-content": "last baseline",
    });
  });

  it("center start", () => {
    const result = placeContentHandler.expand("center start");
    expect(result).toEqual({
      "align-content": "center",
      "justify-content": "start",
    });
  });

  it("start center", () => {
    const result = placeContentHandler.expand("start center");
    expect(result).toEqual({
      "align-content": "start",
      "justify-content": "center",
    });
  });

  it("space-between center", () => {
    const result = placeContentHandler.expand("space-between center");
    expect(result).toEqual({
      "align-content": "space-between",
      "justify-content": "center",
    });
  });

  it("flex-start flex-end", () => {
    const result = placeContentHandler.expand("flex-start flex-end");
    expect(result).toEqual({
      "align-content": "flex-start",
      "justify-content": "flex-end",
    });
  });

  it("baseline center", () => {
    const result = placeContentHandler.expand("baseline center");
    expect(result).toEqual({
      "align-content": "baseline",
      "justify-content": "center",
    });
  });

  it("first baseline end", () => {
    const result = placeContentHandler.expand("first baseline end");
    expect(result).toEqual({
      "align-content": "first baseline",
      "justify-content": "end",
    });
  });

  it("stretch space-evenly", () => {
    const result = placeContentHandler.expand("stretch space-evenly");
    expect(result).toEqual({
      "align-content": "stretch",
      "justify-content": "space-evenly",
    });
  });

  it("normal normal", () => {
    const result = placeContentHandler.expand("normal normal");
    expect(result).toEqual({
      "align-content": "normal",
      "justify-content": "normal",
    });
  });

  it("safe center", () => {
    const result = placeContentHandler.expand("safe center");
    expect(result).toEqual({
      "align-content": "safe center",
      "justify-content": "safe center",
    });
  });

  it("unsafe start", () => {
    const result = placeContentHandler.expand("unsafe start");
    expect(result).toEqual({
      "align-content": "unsafe start",
      "justify-content": "unsafe start",
    });
  });

  it("safe center end", () => {
    const result = placeContentHandler.expand("safe center end");
    expect(result).toEqual({
      "align-content": "safe center",
      "justify-content": "end",
    });
  });

  it("start unsafe flex-end", () => {
    const result = placeContentHandler.expand("start unsafe flex-end");
    expect(result).toEqual({
      "align-content": "start",
      "justify-content": "unsafe flex-end",
    });
  });

  it("inherit", () => {
    const result = placeContentHandler.expand("inherit");
    expect(result).toEqual({
      "align-content": "inherit",
      "justify-content": "inherit",
    });
  });

  it("initial", () => {
    const result = placeContentHandler.expand("initial");
    expect(result).toEqual({
      "align-content": "initial",
      "justify-content": "initial",
    });
  });

  it("unset", () => {
    const result = placeContentHandler.expand("unset");
    expect(result).toEqual({
      "align-content": "unset",
      "justify-content": "unset",
    });
  });

  it("revert", () => {
    const result = placeContentHandler.expand("revert");
    expect(result).toEqual({
      "align-content": "revert",
      "justify-content": "revert",
    });
  });

  it("First Baseline", () => {
    const result = placeContentHandler.expand("First Baseline");
    expect(result).toEqual({
      "align-content": "First Baseline",
      "justify-content": "First Baseline",
    });
  });

  it("SAFE center", () => {
    const result = placeContentHandler.expand("SAFE center");
    expect(result).toEqual({
      "align-content": "SAFE center",
      "justify-content": "SAFE center",
    });
  });

  it("SAFE Center End", () => {
    const result = placeContentHandler.expand("SAFE Center End");
    expect(result).toEqual({
      "align-content": "SAFE Center",
      "justify-content": "End",
    });
  });
});
