// b_path:: src/handlers/transition/__tests__/transition.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("transition collapse", () => {
  it("collapses transition simple", () => {
    const result = collapse({
      "transition-property": "opacity",
      "transition-duration": "400ms",
    });
    expect(result.result).toEqual({ transition: "opacity 400ms" });
  });

  it("collapses transition with all properties", () => {
    const result = collapse({
      "transition-property": "transform",
      "transition-duration": "300ms",
      "transition-timing-function": "ease-in",
      "transition-delay": "150ms",
    });
    expect(result.result).toEqual({ transition: "transform 300ms ease-in 150ms" });
  });

  it("collapses transition multi-layer", () => {
    const result = collapse({
      "transition-property": "opacity, transform",
      "transition-duration": "200ms, 300ms",
      "transition-timing-function": "linear, ease-out",
    });
    expect(result.result).toEqual({
      transition: "opacity 200ms linear, transform 300ms ease-out",
    });
  });

  it("collapses transition omitting defaults", () => {
    const result = collapse({
      "transition-property": "opacity",
      "transition-duration": "300ms",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
    expect(result.result).toEqual({ transition: "opacity 300ms" });
  });
});
