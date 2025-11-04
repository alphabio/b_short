import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("mask collapse", () => {
  it("collapses mask with single image", () => {
    const result = collapse({
      "mask-image": "url(mask.svg)",
    });
    expect(result.result).toEqual({ mask: "url(mask.svg)" });
  });

  it("collapses mask with all defaults", () => {
    const result = collapse({
      "mask-image": "url(mask.svg)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
    expect(result.result).toEqual({ mask: "url(mask.svg)" });
  });

  it("collapses mask with position and size", () => {
    const result = collapse({
      "mask-image": "url(mask.svg)",
      "mask-position": "center",
      "mask-size": "contain",
    });
    expect(result.result).toEqual({ mask: "url(mask.svg) center / contain" });
  });

  it("collapses mask multi-layer", () => {
    const result = collapse({
      "mask-image": "url(a.svg), url(b.svg)",
      "mask-repeat": "no-repeat, repeat",
      "mask-mode": "alpha, luminance",
    });
    expect(result.result).toEqual({ mask: "url(a.svg) no-repeat alpha, url(b.svg) luminance" });
  });
});
