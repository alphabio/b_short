import { describe, expect, it } from "vitest";
import { gridColumnHandler } from "../expand";

describe("grid-column expand", () => {
  it("1", () => {
    const result = gridColumnHandler.expand("1");
    expect(result).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "auto",
    });
  });

  it("2", () => {
    const result = gridColumnHandler.expand("2");
    expect(result).toEqual({
      "grid-column-start": "2",
      "grid-column-end": "auto",
    });
  });

  it("inherit", () => {
    const result = gridColumnHandler.expand("inherit");
    expect(result).toEqual({
      "grid-column-start": "inherit",
      "grid-column-end": "inherit",
    });
  });

  it("initial", () => {
    const result = gridColumnHandler.expand("initial");
    expect(result).toEqual({
      "grid-column-start": "initial",
      "grid-column-end": "initial",
    });
  });

  it("unset", () => {
    const result = gridColumnHandler.expand("unset");
    expect(result).toEqual({
      "grid-column-start": "unset",
      "grid-column-end": "unset",
    });
  });

  it("revert", () => {
    const result = gridColumnHandler.expand("revert");
    expect(result).toEqual({
      "grid-column-start": "revert",
      "grid-column-end": "revert",
    });
  });

  it("auto", () => {
    const result = gridColumnHandler.expand("auto");
    expect(result).toEqual({
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("-1", () => {
    const result = gridColumnHandler.expand("-1");
    expect(result).toEqual({
      "grid-column-start": "-1",
      "grid-column-end": "-1",
    });
  });

  it("main-start", () => {
    const result = gridColumnHandler.expand("main-start");
    expect(result).toEqual({
      "grid-column-start": "main-start",
      "grid-column-end": "main-start",
    });
  });

  it("sidebar", () => {
    const result = gridColumnHandler.expand("sidebar");
    expect(result).toEqual({
      "grid-column-start": "sidebar",
      "grid-column-end": "sidebar",
    });
  });

  it("span 2", () => {
    const result = gridColumnHandler.expand("span 2");
    expect(result).toEqual({
      "grid-column-start": "span 2",
      "grid-column-end": "auto",
    });
  });

  it("span 3", () => {
    const result = gridColumnHandler.expand("span 3");
    expect(result).toEqual({
      "grid-column-start": "span 3",
      "grid-column-end": "auto",
    });
  });

  it("span main", () => {
    const result = gridColumnHandler.expand("span main");
    expect(result).toEqual({
      "grid-column-start": "span main",
      "grid-column-end": "auto",
    });
  });

  it("span 2 main", () => {
    const result = gridColumnHandler.expand("span 2 main");
    expect(result).toEqual({
      "grid-column-start": "span 2 main",
      "grid-column-end": "auto",
    });
  });

  it("2 main-start", () => {
    const result = gridColumnHandler.expand("2 main-start");
    expect(result).toEqual({
      "grid-column-start": "2 main-start",
      "grid-column-end": "auto",
    });
  });

  it("1 / 3", () => {
    const result = gridColumnHandler.expand("1 / 3");
    expect(result).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "3",
    });
  });

  it("1 / -1", () => {
    const result = gridColumnHandler.expand("1 / -1");
    expect(result).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "-1",
    });
  });

  it("2 / span 2", () => {
    const result = gridColumnHandler.expand("2 / span 2");
    expect(result).toEqual({
      "grid-column-start": "2",
      "grid-column-end": "span 2",
    });
  });

  it("span 2 / 4", () => {
    const result = gridColumnHandler.expand("span 2 / 4");
    expect(result).toEqual({
      "grid-column-start": "span 2",
      "grid-column-end": "4",
    });
  });

  it("main-start / main-end", () => {
    const result = gridColumnHandler.expand("main-start / main-end");
    expect(result).toEqual({
      "grid-column-start": "main-start",
      "grid-column-end": "main-end",
    });
  });

  it("1 / span 3", () => {
    const result = gridColumnHandler.expand("1 / span 3");
    expect(result).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "span 3",
    });
  });

  it("auto / auto", () => {
    const result = gridColumnHandler.expand("auto / auto");
    expect(result).toEqual({
      "grid-column-start": "auto",
      "grid-column-end": "auto",
    });
  });

  it("span 2 main / 5", () => {
    const result = gridColumnHandler.expand("span 2 main / 5");
    expect(result).toEqual({
      "grid-column-start": "span 2 main",
      "grid-column-end": "5",
    });
  });

  it("2 main-start / 4 main-end", () => {
    const result = gridColumnHandler.expand("2 main-start / 4 main-end");
    expect(result).toEqual({
      "grid-column-start": "2 main-start",
      "grid-column-end": "4 main-end",
    });
  });

  it("1  /  3", () => {
    const result = gridColumnHandler.expand("1  /  3");
    expect(result).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "3",
    });
  });

  it("-1 / -2", () => {
    const result = gridColumnHandler.expand("-1 / -2");
    expect(result).toEqual({
      "grid-column-start": "-1",
      "grid-column-end": "-2",
    });
  });

  it("main-start 2", () => {
    const result = gridColumnHandler.expand("main-start 2");
    expect(result).toEqual({
      "grid-column-start": "main-start 2",
      "grid-column-end": "auto",
    });
  });

  it("header 3", () => {
    const result = gridColumnHandler.expand("header 3");
    expect(result).toEqual({
      "grid-column-start": "header 3",
      "grid-column-end": "auto",
    });
  });

  it("main-start 2 / -1", () => {
    const result = gridColumnHandler.expand("main-start 2 / -1");
    expect(result).toEqual({
      "grid-column-start": "main-start 2",
      "grid-column-end": "-1",
    });
  });
});
