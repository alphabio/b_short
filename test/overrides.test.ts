// b_path:: test/overrides.test.ts
import { describe, expect, it } from "vitest";
import expand from "../src/index";
import { assertNoDuplicateProperties } from "./helpers/assertions";

describe("property override behavior", () => {
  it("should allow longhand to override shorthand-generated property", () => {
    const { result } = expand("margin: 10px; margin-top: 20px;", { format: "js" });
    assertNoDuplicateProperties(result, "margin override test");
    expect(result).toEqual({
      "margin-top": "20px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
  });

  it("should allow multiple longhand overrides of shorthand-generated properties", () => {
    const { result } = expand("padding: 5px; padding-top: 10px; padding-bottom: 15px;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "padding multiple override test");
    expect(result).toEqual({
      "padding-top": "10px",
      "padding-right": "5px",
      "padding-bottom": "15px",
      "padding-left": "5px",
    });
  });

  it("should handle background shorthand with size override", () => {
    const { result } = expand("background: url(a.png); background-size: cover;", { format: "js" });
    assertNoDuplicateProperties(result, "background size override test");
    expect(result).toEqual({
      "background-image": "url(a.png)",
      "background-position": "0% 0%",
      "background-size": "cover",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    });
  });

  it("should handle multiple shorthands without conflict", () => {
    const { result } = expand("margin: 10px; padding: 5px;", { format: "js" });
    assertNoDuplicateProperties(result, "multiple shorthands no conflict test");
    expect(result).toEqual({
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
      "padding-top": "5px",
      "padding-right": "5px",
      "padding-bottom": "5px",
      "padding-left": "5px",
    });
  });

  it("should allow shorthand to override earlier longhand (standard CSS cascade)", () => {
    const { result } = expand("margin-top: 20px; margin: 10px;", { format: "js" });
    assertNoDuplicateProperties(result, "shorthand overrides longhand test");
    expect(result).toEqual({
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
  });

  it("should handle complex background with multiple overrides", () => {
    const { result } = expand(
      "background: url(a.png) no-repeat; background-size: cover; background-position: center;",
      { format: "js" }
    );
    assertNoDuplicateProperties(result, "complex background multiple overrides test");
    expect(result).toEqual({
      "background-image": "url(a.png)",
      "background-position": "center",
      "background-size": "cover",
      "background-repeat": "no-repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    });
  });

  it("should handle border shorthand with color override", () => {
    const { result } = expand("border: 1px solid red; border-top-color: blue;", { format: "js" });
    assertNoDuplicateProperties(result, "border color override test");
    expect(result).toEqual({
      "border-top-width": "1px",
      "border-top-style": "solid",
      "border-top-color": "blue",
      "border-right-width": "1px",
      "border-right-style": "solid",
      "border-right-color": "red",
      "border-bottom-width": "1px",
      "border-bottom-style": "solid",
      "border-bottom-color": "red",
      "border-left-width": "1px",
      "border-left-style": "solid",
      "border-left-color": "red",
    });
  });

  it("should handle CSS format output with conflict resolution", () => {
    const { result } = expand("margin: 10px; margin-top: 20px;", { format: "css" });
    assertNoDuplicateProperties(result, "CSS format conflict resolution test");
    expect(result).toBe(
      "margin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;\nmargin-top: 20px;"
    );
  });

  it("should handle animation with duration override", () => {
    const { result } = expand("animation: spin 1s ease-in; animation-duration: 2s;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "animation duration override test");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "2s",
      "animation-timing-function": "ease-in",
      "animation-delay": "0s",
      "animation-direction": "normal",
      "animation-iteration-count": "1",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });
});
