// b_path:: src/handlers/border/__tests__/border.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("border collapse", () => {
  it("collapses border with all sides same", () => {
    const result = collapse({
      "border-top-width": "2px",
      "border-right-width": "2px",
      "border-bottom-width": "2px",
      "border-left-width": "2px",
      "border-top-style": "solid",
      "border-right-style": "solid",
      "border-bottom-style": "solid",
      "border-left-style": "solid",
      "border-top-color": "red",
      "border-right-color": "red",
      "border-bottom-color": "red",
      "border-left-color": "red",
    });
    expect(result.result).toEqual({ border: "2px solid red" });
  });

  it("collapses border omitting defaults", () => {
    const result = collapse({
      "border-top-width": "medium",
      "border-right-width": "medium",
      "border-bottom-width": "medium",
      "border-left-width": "medium",
      "border-top-style": "solid",
      "border-right-style": "solid",
      "border-bottom-style": "solid",
      "border-left-style": "solid",
      "border-top-color": "currentcolor",
      "border-right-color": "currentcolor",
      "border-bottom-color": "currentcolor",
      "border-left-color": "currentcolor",
    });
    expect(result.result).toEqual({ border: "solid" });
  });

  it("does not collapse border with different sides", () => {
    const result = collapse({
      "border-top-width": "2px",
      "border-right-width": "3px",
      "border-bottom-width": "2px",
      "border-left-width": "2px",
      "border-top-style": "solid",
      "border-right-style": "solid",
      "border-bottom-style": "solid",
      "border-left-style": "solid",
    });
    expect(result.result).toEqual({
      "border-top-width": "2px",
      "border-right-width": "3px",
      "border-bottom-width": "2px",
      "border-left-width": "2px",
      "border-top-style": "solid",
      "border-right-style": "solid",
      "border-bottom-style": "solid",
      "border-left-style": "solid",
    });
  });

  it("collapses border-radius with all same", () => {
    const result = collapse({
      "border-top-left-radius": "10px",
      "border-top-right-radius": "10px",
      "border-bottom-right-radius": "10px",
      "border-bottom-left-radius": "10px",
    });
    expect(result.result).toEqual({ "border-radius": "10px" });
  });
});
