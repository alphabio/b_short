import { describe, expect, it } from "vitest";
import { overflowHandler } from "../expand";

describe("overflow expand", () => {
  it("visible", () => {
    const result = overflowHandler.expand("visible");
    expect(result).toEqual({
      "overflow-x": "visible",
      "overflow-y": "visible",
    });
  });

  it("hidden", () => {
    const result = overflowHandler.expand("hidden");
    expect(result).toEqual({
      "overflow-x": "hidden",
      "overflow-y": "hidden",
    });
  });

  it("scroll", () => {
    const result = overflowHandler.expand("scroll");
    expect(result).toEqual({
      "overflow-x": "scroll",
      "overflow-y": "scroll",
    });
  });

  it("auto", () => {
    const result = overflowHandler.expand("auto");
    expect(result).toEqual({
      "overflow-x": "auto",
      "overflow-y": "auto",
    });
  });

  it("clip", () => {
    const result = overflowHandler.expand("clip");
    expect(result).toEqual({
      "overflow-x": "clip",
      "overflow-y": "clip",
    });
  });

  it("visible hidden", () => {
    const result = overflowHandler.expand("visible hidden");
    expect(result).toEqual({
      "overflow-x": "visible",
      "overflow-y": "hidden",
    });
  });

  it("hidden scroll", () => {
    const result = overflowHandler.expand("hidden scroll");
    expect(result).toEqual({
      "overflow-x": "hidden",
      "overflow-y": "scroll",
    });
  });

  it("scroll auto", () => {
    const result = overflowHandler.expand("scroll auto");
    expect(result).toEqual({
      "overflow-x": "scroll",
      "overflow-y": "auto",
    });
  });

  it("auto visible", () => {
    const result = overflowHandler.expand("auto visible");
    expect(result).toEqual({
      "overflow-x": "auto",
      "overflow-y": "visible",
    });
  });

  it("clip hidden", () => {
    const result = overflowHandler.expand("clip hidden");
    expect(result).toEqual({
      "overflow-x": "clip",
      "overflow-y": "hidden",
    });
  });

  it("inherit", () => {
    const result = overflowHandler.expand("inherit");
    expect(result).toEqual({
      "overflow-x": "inherit",
      "overflow-y": "inherit",
    });
  });

  it("initial", () => {
    const result = overflowHandler.expand("initial");
    expect(result).toEqual({
      "overflow-x": "initial",
      "overflow-y": "initial",
    });
  });

  it("unset", () => {
    const result = overflowHandler.expand("unset");
    expect(result).toEqual({
      "overflow-x": "unset",
      "overflow-y": "unset",
    });
  });

  it("revert", () => {
    const result = overflowHandler.expand("revert");
    expect(result).toEqual({
      "overflow-x": "revert",
      "overflow-y": "revert",
    });
  });
});
