// b_path:: src/handlers/place-content/__tests__/place-content.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("place-content collapse", () => {
  it("collapses place-content with same values", () => {
    const result = collapse({
      "align-content": "center",
      "justify-content": "center",
    });
    expect(result.result).toEqual({ "place-content": "center" });
  });

  it("collapses place-content with different values", () => {
    const result = collapse({
      "align-content": "start",
      "justify-content": "space-between",
    });
    expect(result.result).toEqual({ "place-content": "start space-between" });
  });
});
