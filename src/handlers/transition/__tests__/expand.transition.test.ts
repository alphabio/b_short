import { describe, expect, it } from "vitest";
import { transitionHandler } from "../expand";

describe("transition expand", () => {
  it("inherit", () => {
    const result = transitionHandler.expand("inherit");
    expect(result).toEqual({
      "transition-property": "inherit",
      "transition-duration": "inherit",
      "transition-timing-function": "inherit",
      "transition-delay": "inherit",
    });
  });

  it("initial", () => {
    const result = transitionHandler.expand("initial");
    expect(result).toEqual({
      "transition-property": "initial",
      "transition-duration": "initial",
      "transition-timing-function": "initial",
      "transition-delay": "initial",
    });
  });

  it("unset", () => {
    const result = transitionHandler.expand("unset");
    expect(result).toEqual({
      "transition-property": "unset",
      "transition-duration": "unset",
      "transition-timing-function": "unset",
      "transition-delay": "unset",
    });
  });

  it("revert", () => {
    const result = transitionHandler.expand("revert");
    expect(result).toEqual({
      "transition-property": "revert",
      "transition-duration": "revert",
      "transition-timing-function": "revert",
      "transition-delay": "revert",
    });
  });

  it("opacity 400ms", () => {
    const result = transitionHandler.expand("opacity 400ms");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "400ms",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("all 0.5s", () => {
    const result = transitionHandler.expand("all 0.5s");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0.5s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("transform 300ms ease-in", () => {
    const result = transitionHandler.expand("transform 300ms ease-in");
    expect(result).toEqual({
      "transition-property": "transform",
      "transition-duration": "300ms",
      "transition-timing-function": "ease-in",
      "transition-delay": "0s",
    });
  });

  it("opacity 200ms linear", () => {
    const result = transitionHandler.expand("opacity 200ms linear");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "200ms",
      "transition-timing-function": "linear",
      "transition-delay": "0s",
    });
  });

  it("transform 300ms ease-in 150ms", () => {
    const result = transitionHandler.expand("transform 300ms ease-in 150ms");
    expect(result).toEqual({
      "transition-property": "transform",
      "transition-duration": "300ms",
      "transition-timing-function": "ease-in",
      "transition-delay": "150ms",
    });
  });

  it("opacity 1s ease-out 500ms", () => {
    const result = transitionHandler.expand("opacity 1s ease-out 500ms");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "1s",
      "transition-timing-function": "ease-out",
      "transition-delay": "500ms",
    });
  });

  it("ease", () => {
    const result = transitionHandler.expand("ease");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("linear", () => {
    const result = transitionHandler.expand("linear");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "linear",
      "transition-delay": "0s",
    });
  });

  it("ease-in", () => {
    const result = transitionHandler.expand("ease-in");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease-in",
      "transition-delay": "0s",
    });
  });

  it("ease-out", () => {
    const result = transitionHandler.expand("ease-out");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease-out",
      "transition-delay": "0s",
    });
  });

  it("ease-in-out", () => {
    const result = transitionHandler.expand("ease-in-out");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease-in-out",
      "transition-delay": "0s",
    });
  });

  it("step-start", () => {
    const result = transitionHandler.expand("step-start");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "step-start",
      "transition-delay": "0s",
    });
  });

  it("step-end", () => {
    const result = transitionHandler.expand("step-end");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "step-end",
      "transition-delay": "0s",
    });
  });

  it("all 300ms cubic-bezier(0.4, 0, 0.2, 1)", () => {
    const result = transitionHandler.expand("all 300ms cubic-bezier(0.4, 0, 0.2, 1)");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "300ms",
      "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
      "transition-delay": "0s",
    });
  });

  it("transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)", () => {
    const result = transitionHandler.expand(
      "transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    );
    expect(result).toEqual({
      "transition-property": "transform",
      "transition-duration": "500ms",
      "transition-timing-function": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      "transition-delay": "0s",
    });
  });

  it("opacity 1s steps(4)", () => {
    const result = transitionHandler.expand("opacity 1s steps(4)");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "1s",
      "transition-timing-function": "steps(4)",
      "transition-delay": "0s",
    });
  });

  it("width 500ms steps(10, end)", () => {
    const result = transitionHandler.expand("width 500ms steps(10, end)");
    expect(result).toEqual({
      "transition-property": "width",
      "transition-duration": "500ms",
      "transition-timing-function": "steps(10, end)",
      "transition-delay": "0s",
    });
  });

  it("300ms opacity", () => {
    const result = transitionHandler.expand("300ms opacity");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "300ms",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("ease-in 200ms transform", () => {
    const result = transitionHandler.expand("ease-in 200ms transform");
    expect(result).toEqual({
      "transition-property": "transform",
      "transition-duration": "200ms",
      "transition-timing-function": "ease-in",
      "transition-delay": "0s",
    });
  });

  it("500ms ease opacity 100ms", () => {
    const result = transitionHandler.expand("500ms ease opacity 100ms");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "500ms",
      "transition-timing-function": "ease",
      "transition-delay": "100ms",
    });
  });

  it("all 0s", () => {
    const result = transitionHandler.expand("all 0s");
    expect(result).toEqual({
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("none", () => {
    const result = transitionHandler.expand("none");
    expect(result).toEqual({
      "transition-property": "none",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("opacity 0s 0s", () => {
    const result = transitionHandler.expand("opacity 0s 0s");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("opacity 400ms, transform 300ms", () => {
    const result = transitionHandler.expand("opacity 400ms, transform 300ms");
    expect(result).toEqual({
      "transition-property": "opacity, transform",
      "transition-duration": "400ms, 300ms",
      "transition-timing-function": "ease, ease",
      "transition-delay": "0s, 0s",
    });
  });

  it("all 200ms linear, opacity 400ms", () => {
    const result = transitionHandler.expand("all 200ms linear, opacity 400ms");
    expect(result).toEqual({
      "transition-property": "all, opacity",
      "transition-duration": "200ms, 400ms",
      "transition-timing-function": "linear, ease",
      "transition-delay": "0s, 0s",
    });
  });

  it("transform 300ms ease-in 150ms, opacity 500ms", () => {
    const result = transitionHandler.expand("transform 300ms ease-in 150ms, opacity 500ms");
    expect(result).toEqual({
      "transition-property": "transform, opacity",
      "transition-duration": "300ms, 500ms",
      "transition-timing-function": "ease-in, ease",
      "transition-delay": "150ms, 0s",
    });
  });

  it("width 1s, height 1s, opacity 2s ease-in", () => {
    const result = transitionHandler.expand("width 1s, height 1s, opacity 2s ease-in");
    expect(result).toEqual({
      "transition-property": "width, height, opacity",
      "transition-duration": "1s, 1s, 2s",
      "transition-timing-function": "ease, ease, ease-in",
      "transition-delay": "0s, 0s, 0s",
    });
  });

  it("opacity", () => {
    const result = transitionHandler.expand("opacity");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("-webkit-transform 300ms", () => {
    const result = transitionHandler.expand("-webkit-transform 300ms");
    expect(result).toEqual({
      "transition-property": "-webkit-transform",
      "transition-duration": "300ms",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("-moz-transform 200ms ease", () => {
    const result = transitionHandler.expand("-moz-transform 200ms ease");
    expect(result).toEqual({
      "transition-property": "-moz-transform",
      "transition-duration": "200ms",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("opacity var(--t) ease", () => {
    const result = transitionHandler.expand("opacity var(--t) ease");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "var(--t)",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("var(--d) opacity var(--delay)", () => {
    const result = transitionHandler.expand("var(--d) opacity var(--delay)");
    expect(result).toEqual({
      "transition-property": "opacity",
      "transition-duration": "var(--d)",
      "transition-timing-function": "ease",
      "transition-delay": "var(--delay)",
    });
  });
});
