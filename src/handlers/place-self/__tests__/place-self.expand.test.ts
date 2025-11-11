// b_path:: src/handlers/place-self/__tests__/place-self.expand.test.ts
import { describe, expect, it } from "vitest";
import { placeSelfHandler } from "../expand";

describe("place-self expand", () => {
  it("auto", () => {
    const result = placeSelfHandler.expand("auto");
    expect(result).toEqual({
      "align-self": "auto",
      "justify-self": "auto",
    });
  });

  it("normal", () => {
    const result = placeSelfHandler.expand("normal");
    expect(result).toEqual({
      "align-self": "normal",
      "justify-self": "normal",
    });
  });

  it("stretch", () => {
    const result = placeSelfHandler.expand("stretch");
    expect(result).toEqual({
      "align-self": "stretch",
      "justify-self": "stretch",
    });
  });

  it("center", () => {
    const result = placeSelfHandler.expand("center");
    expect(result).toEqual({
      "align-self": "center",
      "justify-self": "center",
    });
  });

  it("start", () => {
    const result = placeSelfHandler.expand("start");
    expect(result).toEqual({
      "align-self": "start",
      "justify-self": "start",
    });
  });

  it("end", () => {
    const result = placeSelfHandler.expand("end");
    expect(result).toEqual({
      "align-self": "end",
      "justify-self": "end",
    });
  });

  it("self-start", () => {
    const result = placeSelfHandler.expand("self-start");
    expect(result).toEqual({
      "align-self": "self-start",
      "justify-self": "self-start",
    });
  });

  it("self-end", () => {
    const result = placeSelfHandler.expand("self-end");
    expect(result).toEqual({
      "align-self": "self-end",
      "justify-self": "self-end",
    });
  });

  it("flex-start", () => {
    const result = placeSelfHandler.expand("flex-start");
    expect(result).toEqual({
      "align-self": "flex-start",
      "justify-self": "flex-start",
    });
  });

  it("flex-end", () => {
    const result = placeSelfHandler.expand("flex-end");
    expect(result).toEqual({
      "align-self": "flex-end",
      "justify-self": "flex-end",
    });
  });

  it("baseline", () => {
    const result = placeSelfHandler.expand("baseline");
    expect(result).toEqual({
      "align-self": "baseline",
      "justify-self": "baseline",
    });
  });

  it("first baseline", () => {
    const result = placeSelfHandler.expand("first baseline");
    expect(result).toEqual({
      "align-self": "first baseline",
      "justify-self": "first baseline",
    });
  });

  it("last baseline", () => {
    const result = placeSelfHandler.expand("last baseline");
    expect(result).toEqual({
      "align-self": "last baseline",
      "justify-self": "last baseline",
    });
  });

  it("anchor-center", () => {
    const result = placeSelfHandler.expand("anchor-center");
    expect(result).toEqual({
      "align-self": "anchor-center",
      "justify-self": "anchor-center",
    });
  });

  it("auto center", () => {
    const result = placeSelfHandler.expand("auto center");
    expect(result).toEqual({
      "align-self": "auto",
      "justify-self": "center",
    });
  });

  it("center start", () => {
    const result = placeSelfHandler.expand("center start");
    expect(result).toEqual({
      "align-self": "center",
      "justify-self": "start",
    });
  });

  it("stretch center", () => {
    const result = placeSelfHandler.expand("stretch center");
    expect(result).toEqual({
      "align-self": "stretch",
      "justify-self": "center",
    });
  });

  it("self-start self-end", () => {
    const result = placeSelfHandler.expand("self-start self-end");
    expect(result).toEqual({
      "align-self": "self-start",
      "justify-self": "self-end",
    });
  });

  it("baseline center", () => {
    const result = placeSelfHandler.expand("baseline center");
    expect(result).toEqual({
      "align-self": "baseline",
      "justify-self": "center",
    });
  });

  it("first baseline end", () => {
    const result = placeSelfHandler.expand("first baseline end");
    expect(result).toEqual({
      "align-self": "first baseline",
      "justify-self": "end",
    });
  });

  it("normal normal", () => {
    const result = placeSelfHandler.expand("normal normal");
    expect(result).toEqual({
      "align-self": "normal",
      "justify-self": "normal",
    });
  });

  it("anchor-center center", () => {
    const result = placeSelfHandler.expand("anchor-center center");
    expect(result).toEqual({
      "align-self": "anchor-center",
      "justify-self": "center",
    });
  });

  it("center left", () => {
    const result = placeSelfHandler.expand("center left");
    expect(result).toEqual({
      "align-self": "center",
      "justify-self": "left",
    });
  });

  it("stretch right", () => {
    const result = placeSelfHandler.expand("stretch right");
    expect(result).toEqual({
      "align-self": "stretch",
      "justify-self": "right",
    });
  });

  it("auto left", () => {
    const result = placeSelfHandler.expand("auto left");
    expect(result).toEqual({
      "align-self": "auto",
      "justify-self": "left",
    });
  });

  it("safe center", () => {
    const result = placeSelfHandler.expand("safe center");
    expect(result).toEqual({
      "align-self": "safe center",
      "justify-self": "safe center",
    });
  });

  it("unsafe self-start", () => {
    const result = placeSelfHandler.expand("unsafe self-start");
    expect(result).toEqual({
      "align-self": "unsafe self-start",
      "justify-self": "unsafe self-start",
    });
  });

  it("safe center end", () => {
    const result = placeSelfHandler.expand("safe center end");
    expect(result).toEqual({
      "align-self": "safe center",
      "justify-self": "end",
    });
  });

  it("inherit", () => {
    const result = placeSelfHandler.expand("inherit");
    expect(result).toEqual({
      "align-self": "inherit",
      "justify-self": "inherit",
    });
  });

  it("initial", () => {
    const result = placeSelfHandler.expand("initial");
    expect(result).toEqual({
      "align-self": "initial",
      "justify-self": "initial",
    });
  });

  it("unset", () => {
    const result = placeSelfHandler.expand("unset");
    expect(result).toEqual({
      "align-self": "unset",
      "justify-self": "unset",
    });
  });

  it("revert", () => {
    const result = placeSelfHandler.expand("revert");
    expect(result).toEqual({
      "align-self": "revert",
      "justify-self": "revert",
    });
  });

  it("First Baseline", () => {
    const result = placeSelfHandler.expand("First Baseline");
    expect(result).toEqual({
      "align-self": "First Baseline",
      "justify-self": "First Baseline",
    });
  });

  it("SAFE center", () => {
    const result = placeSelfHandler.expand("SAFE center");
    expect(result).toEqual({
      "align-self": "SAFE center",
      "justify-self": "SAFE center",
    });
  });

  it("SAFE Center End", () => {
    const result = placeSelfHandler.expand("SAFE Center End");
    expect(result).toEqual({
      "align-self": "SAFE Center",
      "justify-self": "End",
    });
  });
});
