import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("gap collapse", () => {
  it("collapses grid with custom gaps", () => {
    const result = collapse({
      "grid-template-rows": "100px",
      "grid-template-columns": "1fr",
      "grid-template-areas": "none",
      "grid-auto-rows": "auto",
      "grid-auto-columns": "auto",
      "grid-auto-flow": "row",
    });
    expect(result.result).toMatchObject({
      grid: "100px / 1fr",
    });
  });
});
