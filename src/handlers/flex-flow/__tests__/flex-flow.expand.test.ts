// b_path:: src/handlers/flex-flow/__tests__/flex-flow.expand.test.ts
import { describe, expect, it } from "vitest";
import { flexFlowHandler } from "../expand";

describe("flex-flow expand", () => {
  it("row", () => {
    const result = flexFlowHandler.expand("row");
    expect(result).toEqual({
      "flex-direction": "row",
    });
  });

  it("row-reverse", () => {
    const result = flexFlowHandler.expand("row-reverse");
    expect(result).toEqual({
      "flex-direction": "row-reverse",
    });
  });

  it("column", () => {
    const result = flexFlowHandler.expand("column");
    expect(result).toEqual({
      "flex-direction": "column",
    });
  });

  it("column-reverse", () => {
    const result = flexFlowHandler.expand("column-reverse");
    expect(result).toEqual({
      "flex-direction": "column-reverse",
    });
  });

  it("nowrap", () => {
    const result = flexFlowHandler.expand("nowrap");
    expect(result).toEqual({
      "flex-wrap": "nowrap",
    });
  });

  it("wrap", () => {
    const result = flexFlowHandler.expand("wrap");
    expect(result).toEqual({
      "flex-wrap": "wrap",
    });
  });

  it("wrap-reverse", () => {
    const result = flexFlowHandler.expand("wrap-reverse");
    expect(result).toEqual({
      "flex-wrap": "wrap-reverse",
    });
  });

  it("row nowrap", () => {
    const result = flexFlowHandler.expand("row nowrap");
    expect(result).toEqual({
      "flex-direction": "row",
      "flex-wrap": "nowrap",
    });
  });

  it("nowrap row", () => {
    const result = flexFlowHandler.expand("nowrap row");
    expect(result).toEqual({
      "flex-direction": "row",
      "flex-wrap": "nowrap",
    });
  });

  it("column wrap", () => {
    const result = flexFlowHandler.expand("column wrap");
    expect(result).toEqual({
      "flex-direction": "column",
      "flex-wrap": "wrap",
    });
  });

  it("wrap column", () => {
    const result = flexFlowHandler.expand("wrap column");
    expect(result).toEqual({
      "flex-direction": "column",
      "flex-wrap": "wrap",
    });
  });

  it("row-reverse wrap-reverse", () => {
    const result = flexFlowHandler.expand("row-reverse wrap-reverse");
    expect(result).toEqual({
      "flex-direction": "row-reverse",
      "flex-wrap": "wrap-reverse",
    });
  });

  it("wrap-reverse column-reverse", () => {
    const result = flexFlowHandler.expand("wrap-reverse column-reverse");
    expect(result).toEqual({
      "flex-direction": "column-reverse",
      "flex-wrap": "wrap-reverse",
    });
  });

  it("inherit", () => {
    const result = flexFlowHandler.expand("inherit");
    expect(result).toEqual({
      "flex-direction": "inherit",
      "flex-wrap": "inherit",
    });
  });

  it("initial", () => {
    const result = flexFlowHandler.expand("initial");
    expect(result).toEqual({
      "flex-direction": "initial",
      "flex-wrap": "initial",
    });
  });

  it("unset", () => {
    const result = flexFlowHandler.expand("unset");
    expect(result).toEqual({
      "flex-direction": "unset",
      "flex-wrap": "unset",
    });
  });

  it("revert", () => {
    const result = flexFlowHandler.expand("revert");
    expect(result).toEqual({
      "flex-direction": "revert",
      "flex-wrap": "revert",
    });
  });
});
