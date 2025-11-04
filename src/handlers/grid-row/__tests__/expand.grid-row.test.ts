import { describe, expect, it } from "vitest";
import { gridRowHandler } from "../expand";

describe("grid-row expand", () => {
  it("1", () => {
    const result = gridRowHandler.expand("1");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "auto",
    });
  });

  it("2", () => {
    const result = gridRowHandler.expand("2");
    expect(result).toEqual({
      "grid-row-start": "2",
      "grid-row-end": "auto",
    });
  });

  it("inherit", () => {
    const result = gridRowHandler.expand("inherit");
    expect(result).toEqual({
      "grid-row-start": "inherit",
      "grid-row-end": "inherit",
    });
  });

  it("initial", () => {
    const result = gridRowHandler.expand("initial");
    expect(result).toEqual({
      "grid-row-start": "initial",
      "grid-row-end": "initial",
    });
  });

  it("unset", () => {
    const result = gridRowHandler.expand("unset");
    expect(result).toEqual({
      "grid-row-start": "unset",
      "grid-row-end": "unset",
    });
  });

  it("revert", () => {
    const result = gridRowHandler.expand("revert");
    expect(result).toEqual({
      "grid-row-start": "revert",
      "grid-row-end": "revert",
    });
  });

  it("auto", () => {
    const result = gridRowHandler.expand("auto");
    expect(result).toEqual({
      "grid-row-start": "auto",
      "grid-row-end": "auto",
    });
  });

  it("-1", () => {
    const result = gridRowHandler.expand("-1");
    expect(result).toEqual({
      "grid-row-start": "-1",
      "grid-row-end": "auto",
    });
  });

  it("main-start", () => {
    const result = gridRowHandler.expand("main-start");
    expect(result).toEqual({
      "grid-row-start": "main-start",
      "grid-row-end": "main-start",
    });
  });

  it("sidebar", () => {
    const result = gridRowHandler.expand("sidebar");
    expect(result).toEqual({
      "grid-row-start": "sidebar",
      "grid-row-end": "sidebar",
    });
  });

  it("span 2", () => {
    const result = gridRowHandler.expand("span 2");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "auto",
    });
  });

  it("span 3", () => {
    const result = gridRowHandler.expand("span 3");
    expect(result).toEqual({
      "grid-row-start": "span 3",
      "grid-row-end": "auto",
    });
  });

  it("span main", () => {
    const result = gridRowHandler.expand("span main");
    expect(result).toEqual({
      "grid-row-start": "span main",
      "grid-row-end": "auto",
    });
  });

  it("span 2 main", () => {
    const result = gridRowHandler.expand("span 2 main");
    expect(result).toEqual({
      "grid-row-start": "span 2 main",
      "grid-row-end": "auto",
    });
  });

  it("2 main-start", () => {
    const result = gridRowHandler.expand("2 main-start");
    expect(result).toEqual({
      "grid-row-start": "2 main-start",
      "grid-row-end": "auto",
    });
  });

  it("1 / 3", () => {
    const result = gridRowHandler.expand("1 / 3");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "3",
    });
  });

  it("1 / -1", () => {
    const result = gridRowHandler.expand("1 / -1");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "-1",
    });
  });

  it("2 / span 2", () => {
    const result = gridRowHandler.expand("2 / span 2");
    expect(result).toEqual({
      "grid-row-start": "2",
      "grid-row-end": "span 2",
    });
  });

  it("span 2 / 4", () => {
    const result = gridRowHandler.expand("span 2 / 4");
    expect(result).toEqual({
      "grid-row-start": "span 2",
      "grid-row-end": "4",
    });
  });

  it("main-start / main-end", () => {
    const result = gridRowHandler.expand("main-start / main-end");
    expect(result).toEqual({
      "grid-row-start": "main-start",
      "grid-row-end": "main-end",
    });
  });

  it("1 / span 3", () => {
    const result = gridRowHandler.expand("1 / span 3");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "span 3",
    });
  });

  it("auto / auto", () => {
    const result = gridRowHandler.expand("auto / auto");
    expect(result).toEqual({
      "grid-row-start": "auto",
      "grid-row-end": "auto",
    });
  });

  it("span 2 main / 5", () => {
    const result = gridRowHandler.expand("span 2 main / 5");
    expect(result).toEqual({
      "grid-row-start": "span 2 main",
      "grid-row-end": "5",
    });
  });

  it("2 main-start / 4 main-end", () => {
    const result = gridRowHandler.expand("2 main-start / 4 main-end");
    expect(result).toEqual({
      "grid-row-start": "2 main-start",
      "grid-row-end": "4 main-end",
    });
  });

  it("1  /  3", () => {
    const result = gridRowHandler.expand("1  /  3");
    expect(result).toEqual({
      "grid-row-start": "1",
      "grid-row-end": "3",
    });
  });

  it("-1 / -2", () => {
    const result = gridRowHandler.expand("-1 / -2");
    expect(result).toEqual({
      "grid-row-start": "-1",
      "grid-row-end": "-2",
    });
  });

  it("main-start 2", () => {
    const result = gridRowHandler.expand("main-start 2");
    expect(result).toEqual({
      "grid-row-start": "main-start 2",
      "grid-row-end": "auto",
    });
  });

  it("header 3", () => {
    const result = gridRowHandler.expand("header 3");
    expect(result).toEqual({
      "grid-row-start": "header 3",
      "grid-row-end": "auto",
    });
  });

  it("main-start 2 / -1", () => {
    const result = gridRowHandler.expand("main-start 2 / -1");
    expect(result).toEqual({
      "grid-row-start": "main-start 2",
      "grid-row-end": "-1",
    });
  });
});
