// b_path:: src/handlers/flex-flow/__tests__/flex-flow.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("flex-flow collapse", () => {
  it("collapses flex-flow with both values", () => {
    const result = collapse({
      "flex-direction": "column",
      "flex-wrap": "wrap",
    });
    expect(result.result).toEqual({ "flex-flow": "column wrap" });
  });

  it("collapses flex-flow with single value", () => {
    const result = collapse({
      "flex-direction": "row-reverse",
    });
    expect(result.result).toEqual({ "flex-flow": "row-reverse" });
  });
});
