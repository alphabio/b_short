import { describe, expect, it } from "vitest";
import { placeItemsHandler } from "../expand";

describe("place-items expand", () => {
  it("normal", () => {
    const result = placeItemsHandler.expand("normal");
    expect(result).toEqual({
      "align-items": "normal",
      "justify-items": "normal",
    });
  });

  it("stretch", () => {
    const result = placeItemsHandler.expand("stretch");
    expect(result).toEqual({
      "align-items": "stretch",
      "justify-items": "stretch",
    });
  });

  it("center", () => {
    const result = placeItemsHandler.expand("center");
    expect(result).toEqual({
      "align-items": "center",
      "justify-items": "center",
    });
  });

  it("start", () => {
    const result = placeItemsHandler.expand("start");
    expect(result).toEqual({
      "align-items": "start",
      "justify-items": "start",
    });
  });

  it("end", () => {
    const result = placeItemsHandler.expand("end");
    expect(result).toEqual({
      "align-items": "end",
      "justify-items": "end",
    });
  });

  it("self-start", () => {
    const result = placeItemsHandler.expand("self-start");
    expect(result).toEqual({
      "align-items": "self-start",
      "justify-items": "self-start",
    });
  });

  it("self-end", () => {
    const result = placeItemsHandler.expand("self-end");
    expect(result).toEqual({
      "align-items": "self-end",
      "justify-items": "self-end",
    });
  });

  it("flex-start", () => {
    const result = placeItemsHandler.expand("flex-start");
    expect(result).toEqual({
      "align-items": "flex-start",
      "justify-items": "flex-start",
    });
  });

  it("flex-end", () => {
    const result = placeItemsHandler.expand("flex-end");
    expect(result).toEqual({
      "align-items": "flex-end",
      "justify-items": "flex-end",
    });
  });

  it("baseline", () => {
    const result = placeItemsHandler.expand("baseline");
    expect(result).toEqual({
      "align-items": "baseline",
      "justify-items": "baseline",
    });
  });

  it("first baseline", () => {
    const result = placeItemsHandler.expand("first baseline");
    expect(result).toEqual({
      "align-items": "first baseline",
      "justify-items": "first baseline",
    });
  });

  it("last baseline", () => {
    const result = placeItemsHandler.expand("last baseline");
    expect(result).toEqual({
      "align-items": "last baseline",
      "justify-items": "last baseline",
    });
  });

  it("center start", () => {
    const result = placeItemsHandler.expand("center start");
    expect(result).toEqual({
      "align-items": "center",
      "justify-items": "start",
    });
  });

  it("stretch center", () => {
    const result = placeItemsHandler.expand("stretch center");
    expect(result).toEqual({
      "align-items": "stretch",
      "justify-items": "center",
    });
  });

  it("self-start self-end", () => {
    const result = placeItemsHandler.expand("self-start self-end");
    expect(result).toEqual({
      "align-items": "self-start",
      "justify-items": "self-end",
    });
  });

  it("baseline center", () => {
    const result = placeItemsHandler.expand("baseline center");
    expect(result).toEqual({
      "align-items": "baseline",
      "justify-items": "center",
    });
  });

  it("first baseline end", () => {
    const result = placeItemsHandler.expand("first baseline end");
    expect(result).toEqual({
      "align-items": "first baseline",
      "justify-items": "end",
    });
  });

  it("normal normal", () => {
    const result = placeItemsHandler.expand("normal normal");
    expect(result).toEqual({
      "align-items": "normal",
      "justify-items": "normal",
    });
  });

  it("center left", () => {
    const result = placeItemsHandler.expand("center left");
    expect(result).toEqual({
      "align-items": "center",
      "justify-items": "left",
    });
  });

  it("stretch right", () => {
    const result = placeItemsHandler.expand("stretch right");
    expect(result).toEqual({
      "align-items": "stretch",
      "justify-items": "right",
    });
  });

  it("start left", () => {
    const result = placeItemsHandler.expand("start left");
    expect(result).toEqual({
      "align-items": "start",
      "justify-items": "left",
    });
  });

  it("safe center", () => {
    const result = placeItemsHandler.expand("safe center");
    expect(result).toEqual({
      "align-items": "safe center",
      "justify-items": "safe center",
    });
  });

  it("unsafe self-start", () => {
    const result = placeItemsHandler.expand("unsafe self-start");
    expect(result).toEqual({
      "align-items": "unsafe self-start",
      "justify-items": "unsafe self-start",
    });
  });

  it("safe center end", () => {
    const result = placeItemsHandler.expand("safe center end");
    expect(result).toEqual({
      "align-items": "safe center",
      "justify-items": "end",
    });
  });

  it("inherit", () => {
    const result = placeItemsHandler.expand("inherit");
    expect(result).toEqual({
      "align-items": "inherit",
      "justify-items": "inherit",
    });
  });

  it("initial", () => {
    const result = placeItemsHandler.expand("initial");
    expect(result).toEqual({
      "align-items": "initial",
      "justify-items": "initial",
    });
  });

  it("unset", () => {
    const result = placeItemsHandler.expand("unset");
    expect(result).toEqual({
      "align-items": "unset",
      "justify-items": "unset",
    });
  });

  it("revert", () => {
    const result = placeItemsHandler.expand("revert");
    expect(result).toEqual({
      "align-items": "revert",
      "justify-items": "revert",
    });
  });

  it("First Baseline", () => {
    const result = placeItemsHandler.expand("First Baseline");
    expect(result).toEqual({
      "align-items": "First Baseline",
      "justify-items": "First Baseline",
    });
  });

  it("SAFE center", () => {
    const result = placeItemsHandler.expand("SAFE center");
    expect(result).toEqual({
      "align-items": "SAFE center",
      "justify-items": "SAFE center",
    });
  });

  it("SAFE Center End", () => {
    const result = placeItemsHandler.expand("SAFE Center End");
    expect(result).toEqual({
      "align-items": "SAFE Center",
      "justify-items": "End",
    });
  });
});
