// b_path:: src/handlers/background/__tests__/background.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("background collapse", () => {
  it("collapses background with single image", () => {
    const result = collapse({
      "background-image": "url(test.png)",
      "background-color": "red",
    });
    expect(result.result).toEqual({ background: "url(test.png) red" });
  });

  it("collapses background with all defaults", () => {
    const result = collapse({
      "background-image": "url(test.png)",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
    expect(result.result).toEqual({ background: "url(test.png)" });
  });

  it("collapses background with position and size", () => {
    const result = collapse({
      "background-image": "url(test.png)",
      "background-position": "center center",
      "background-size": "cover",
    });
    expect(result.result).toEqual({ background: "url(test.png) center center / cover" });
  });

  it("collapses background multi-layer", () => {
    const result = collapse({
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat-x",
      "background-color": "white",
    });
    expect(result.result).toEqual({
      background: "url(a.png) no-repeat, url(b.png) repeat-x white",
    });
  });

  it("collapses background color only", () => {
    const result = collapse({
      "background-color": "blue",
    });
    expect(result.result).toEqual({ background: "blue" });
  });

  it("keeps background longhands if incomplete", () => {
    const result = collapse({
      "background-image": "url(test.png)",
    });
    expect(result.result).toHaveProperty("background");
  });
});
