import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("animation collapse", () => {
  it("collapses animation simple", () => {
    const result = collapse({
      "animation-name": "spin",
      "animation-duration": "2s",
    });
    expect(result.result).toEqual({ animation: "spin 2s" });
  });

  it("collapses animation with all properties", () => {
    const result = collapse({
      "animation-name": "fadeIn",
      "animation-duration": "1s",
      "animation-timing-function": "ease-in-out",
      "animation-delay": "500ms",
      "animation-iteration-count": "infinite",
      "animation-direction": "alternate",
    });
    expect(result.result).toEqual({
      animation: "fadeIn 1s ease-in-out 500ms infinite alternate",
    });
  });

  it("collapses animation multi-layer", () => {
    const result = collapse({
      "animation-name": "spin, fadeIn",
      "animation-duration": "2s, 1s",
      "animation-iteration-count": "infinite, 1",
    });
    expect(result.result).toEqual({ animation: "spin 2s infinite, fadeIn 1s" });
  });

  it("collapses animation omitting defaults", () => {
    const result = collapse({
      "animation-name": "bounce",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
    expect(result.result).toEqual({ animation: "bounce 1s" });
  });
});
