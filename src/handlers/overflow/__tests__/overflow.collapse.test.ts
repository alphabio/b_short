import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("overflow collapse", () => {
  it("collapses overflow with same values", () => {
    const result = collapse({
      "overflow-x": "hidden",
      "overflow-y": "hidden",
    });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ overflow: "hidden" });
    expect(result.issues).toEqual([]);
  });

  it("collapses overflow with different values", () => {
    const result = collapse({
      "overflow-x": "hidden",
      "overflow-y": "auto",
    });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ overflow: "hidden auto" });
    expect(result.issues).toEqual([]);
  });
});
