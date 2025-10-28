// b_path:: test/overrides.test.ts
import { describe, expect, it } from "vitest";
import { expand } from "../src/index";
import { assertNoDuplicateProperties } from "./helpers/assertions";

describe("property override behavior", () => {
  it("should allow longhand to override shorthand-generated property", () => {
    const { result } = expand("margin: 10px; margin-top: 20px;", { format: "js" });
    assertNoDuplicateProperties(result, "margin override test");
    expect(result).toEqual({
      marginTop: "20px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "10px",
    });
  });

  it("should allow multiple longhand overrides of shorthand-generated properties", () => {
    const { result } = expand("padding: 5px; padding-top: 10px; padding-bottom: 15px;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "padding multiple override test");
    expect(result).toEqual({
      paddingTop: "10px",
      paddingRight: "5px",
      paddingBottom: "15px",
      paddingLeft: "5px",
    });
  });

  it("should handle background shorthand with size override", () => {
    const { result } = expand("background: url(a.png); background-size: cover;", { format: "js" });
    assertNoDuplicateProperties(result, "background size override test");
    expect(result).toEqual({
      backgroundImage: "url(a.png)",
      backgroundPosition: "0% 0%",
      backgroundSize: "cover",
      backgroundRepeat: "repeat",
      backgroundAttachment: "scroll",
      backgroundOrigin: "padding-box",
      backgroundClip: "border-box",
      backgroundColor: "transparent",
    });
  });

  it("should handle multiple shorthands without conflict", () => {
    const { result } = expand("margin: 10px; padding: 5px;", { format: "js" });
    assertNoDuplicateProperties(result, "multiple shorthands no conflict test");
    expect(result).toEqual({
      marginTop: "10px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "10px",
      paddingTop: "5px",
      paddingRight: "5px",
      paddingBottom: "5px",
      paddingLeft: "5px",
    });
  });

  it("should allow shorthand to override earlier longhand (standard CSS cascade)", () => {
    const { result } = expand("margin-top: 20px; margin: 10px;", { format: "js" });
    assertNoDuplicateProperties(result, "shorthand overrides longhand test");
    expect(result).toEqual({
      marginTop: "10px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "10px",
    });
  });

  it("should handle complex background with multiple overrides", () => {
    const { result } = expand(
      "background: url(a.png) no-repeat; background-size: cover; background-position: center;",
      { format: "js" }
    );
    assertNoDuplicateProperties(result, "complex background multiple overrides test");
    expect(result).toEqual({
      backgroundImage: "url(a.png)",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
      backgroundOrigin: "padding-box",
      backgroundClip: "border-box",
      backgroundColor: "transparent",
    });
  });

  it("should handle border shorthand with color override", () => {
    const { result } = expand("border: 1px solid red; border-top-color: blue;", { format: "js" });
    assertNoDuplicateProperties(result, "border color override test");
    expect(result).toEqual({
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderTopColor: "blue",
      borderRightWidth: "1px",
      borderRightStyle: "solid",
      borderRightColor: "red",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "red",
      borderLeftWidth: "1px",
      borderLeftStyle: "solid",
      borderLeftColor: "red",
    });
  });

  it("should handle CSS format output with conflict resolution", () => {
    const { result } = expand("margin: 10px; margin-top: 20px;", { format: "css" });
    assertNoDuplicateProperties(result, "CSS format conflict resolution test");
    // Properties should be sorted by CSS specification order (margin-top comes first)
    expect(result).toBe(
      "margin-top: 20px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"
    );
  });

  it("should handle animation with duration override", () => {
    const { result } = expand("animation: spin 1s ease-in; animation-duration: 2s;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "animation duration override test");
    expect(result).toEqual({
      animationName: "spin",
      animationDuration: "2s",
      animationTimingFunction: "ease-in",
      animationDelay: "0s",
      animationDirection: "normal",
      animationIterationCount: "1",
      animationFillMode: "none",
      animationPlayState: "running",
    });
  });
});
