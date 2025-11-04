// b_path:: src/handlers/animation/__tests__/animation.expand.test.ts
import { describe, expect, it } from "vitest";
import { animationHandler } from "../expand";

describe("animation expand", () => {
  it("inherit", () => {
    const result = animationHandler.expand("inherit");
    expect(result).toEqual({
      "animation-name": "inherit",
      "animation-duration": "inherit",
      "animation-timing-function": "inherit",
      "animation-delay": "inherit",
      "animation-iteration-count": "inherit",
      "animation-direction": "inherit",
      "animation-fill-mode": "inherit",
      "animation-play-state": "inherit",
    });
  });

  it("initial", () => {
    const result = animationHandler.expand("initial");
    expect(result).toEqual({
      "animation-name": "initial",
      "animation-duration": "initial",
      "animation-timing-function": "initial",
      "animation-delay": "initial",
      "animation-iteration-count": "initial",
      "animation-direction": "initial",
      "animation-fill-mode": "initial",
      "animation-play-state": "initial",
    });
  });

  it("unset", () => {
    const result = animationHandler.expand("unset");
    expect(result).toEqual({
      "animation-name": "unset",
      "animation-duration": "unset",
      "animation-timing-function": "unset",
      "animation-delay": "unset",
      "animation-iteration-count": "unset",
      "animation-direction": "unset",
      "animation-fill-mode": "unset",
      "animation-play-state": "unset",
    });
  });

  it("revert", () => {
    const result = animationHandler.expand("revert");
    expect(result).toEqual({
      "animation-name": "revert",
      "animation-duration": "revert",
      "animation-timing-function": "revert",
      "animation-delay": "revert",
      "animation-iteration-count": "revert",
      "animation-direction": "revert",
      "animation-fill-mode": "revert",
      "animation-play-state": "revert",
    });
  });

  it("spin", () => {
    const result = animationHandler.expand("spin");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("slideIn", () => {
    const result = animationHandler.expand("slideIn");
    expect(result).toEqual({
      "animation-name": "slideIn",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("none", () => {
    const result = animationHandler.expand("none");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 1s", () => {
    const result = animationHandler.expand("spin 1s");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("fadeIn 300ms", () => {
    const result = animationHandler.expand("fadeIn 300ms");
    expect(result).toEqual({
      "animation-name": "fadeIn",
      "animation-duration": "300ms",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 1s ease-in", () => {
    const result = animationHandler.expand("spin 1s ease-in");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease-in",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("bounce 500ms linear", () => {
    const result = animationHandler.expand("bounce 500ms linear");
    expect(result).toEqual({
      "animation-name": "bounce",
      "animation-duration": "500ms",
      "animation-timing-function": "linear",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 1s ease-in 500ms", () => {
    const result = animationHandler.expand("spin 1s ease-in 500ms");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease-in",
      "animation-delay": "500ms",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("fadeOut 2s cubic-bezier(0.4, 0, 0.2, 1) 1s", () => {
    const result = animationHandler.expand("fadeOut 2s cubic-bezier(0.4, 0, 0.2, 1) 1s");
    expect(result).toEqual({
      "animation-name": "fadeOut",
      "animation-duration": "2s",
      "animation-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
      "animation-delay": "1s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 1s infinite", () => {
    const result = animationHandler.expand("spin 1s infinite");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "infinite",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("pulse 500ms 3", () => {
    const result = animationHandler.expand("pulse 500ms 3");
    expect(result).toEqual({
      "animation-name": "pulse",
      "animation-duration": "500ms",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "3",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 1s alternate", () => {
    const result = animationHandler.expand("spin 1s alternate");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "alternate",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("slide 2s reverse", () => {
    const result = animationHandler.expand("slide 2s reverse");
    expect(result).toEqual({
      "animation-name": "slide",
      "animation-duration": "2s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "reverse",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("bounce 1s alternate-reverse", () => {
    const result = animationHandler.expand("bounce 1s alternate-reverse");
    expect(result).toEqual({
      "animation-name": "bounce",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "alternate-reverse",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("fadeIn 1s forwards", () => {
    const result = animationHandler.expand("fadeIn 1s forwards");
    expect(result).toEqual({
      "animation-name": "fadeIn",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "forwards",
      "animation-play-state": "running",
    });
  });

  it("slideOut 500ms backwards", () => {
    const result = animationHandler.expand("slideOut 500ms backwards");
    expect(result).toEqual({
      "animation-name": "slideOut",
      "animation-duration": "500ms",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "backwards",
      "animation-play-state": "running",
    });
  });

  it("zoom 1s both", () => {
    const result = animationHandler.expand("zoom 1s both");
    expect(result).toEqual({
      "animation-name": "zoom",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "both",
      "animation-play-state": "running",
    });
  });

  it("spin 1s paused", () => {
    const result = animationHandler.expand("spin 1s paused");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "paused",
    });
  });

  it("rotate 2s running", () => {
    const result = animationHandler.expand("rotate 2s running");
    expect(result).toEqual({
      "animation-name": "rotate",
      "animation-duration": "2s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("spin 2s ease-in-out 500ms infinite alternate forwards paused", () => {
    const result = animationHandler.expand(
      "spin 2s ease-in-out 500ms infinite alternate forwards paused"
    );
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "2s",
      "animation-timing-function": "ease-in-out",
      "animation-delay": "500ms",
      "animation-iteration-count": "infinite",
      "animation-direction": "alternate",
      "animation-fill-mode": "forwards",
      "animation-play-state": "paused",
    });
  });

  it("bounce 1s linear 0s 3 normal both running", () => {
    const result = animationHandler.expand("bounce 1s linear 0s 3 normal both running");
    expect(result).toEqual({
      "animation-name": "bounce",
      "animation-duration": "1s",
      "animation-timing-function": "linear",
      "animation-delay": "0s",
      "animation-iteration-count": "3",
      "animation-direction": "normal",
      "animation-fill-mode": "both",
      "animation-play-state": "running",
    });
  });

  it("spin 1s cubic-bezier(0.4, 0, 0.2, 1)", () => {
    const result = animationHandler.expand("spin 1s cubic-bezier(0.4, 0, 0.2, 1)");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("pulse 500ms steps(4)", () => {
    const result = animationHandler.expand("pulse 500ms steps(4)");
    expect(result).toEqual({
      "animation-name": "pulse",
      "animation-duration": "500ms",
      "animation-timing-function": "steps(4)",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("fade 1s steps(10, end)", () => {
    const result = animationHandler.expand("fade 1s steps(10, end)");
    expect(result).toEqual({
      "animation-name": "fade",
      "animation-duration": "1s",
      "animation-timing-function": "steps(10, end)",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("1s spin", () => {
    const result = animationHandler.expand("1s spin");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("ease-in 500ms rotate", () => {
    const result = animationHandler.expand("ease-in 500ms rotate");
    expect(result).toEqual({
      "animation-name": "rotate",
      "animation-duration": "500ms",
      "animation-timing-function": "ease-in",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("infinite 1s spin alternate", () => {
    const result = animationHandler.expand("infinite 1s spin alternate");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "infinite",
      "animation-direction": "alternate",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("0s", () => {
    const result = animationHandler.expand("0s");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("ease", () => {
    const result = animationHandler.expand("ease");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("infinite", () => {
    const result = animationHandler.expand("infinite");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "infinite",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("alternate", () => {
    const result = animationHandler.expand("alternate");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "alternate",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("forwards", () => {
    const result = animationHandler.expand("forwards");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "forwards",
      "animation-play-state": "running",
    });
  });

  it("paused", () => {
    const result = animationHandler.expand("paused");
    expect(result).toEqual({
      "animation-name": "none",
      "animation-duration": "0s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "paused",
    });
  });

  it("spin 1s, fadeIn 2s", () => {
    const result = animationHandler.expand("spin 1s, fadeIn 2s");
    expect(result).toEqual({
      "animation-name": "spin, fadeIn",
      "animation-duration": "1s, 2s",
      "animation-timing-function": "ease, ease",
      "animation-delay": "0s, 0s",
      "animation-iteration-count": "1, 1",
      "animation-direction": "normal, normal",
      "animation-fill-mode": "none, none",
      "animation-play-state": "running, running",
    });
  });

  it("rotate 1s infinite, pulse 500ms 3", () => {
    const result = animationHandler.expand("rotate 1s infinite, pulse 500ms 3");
    expect(result).toEqual({
      "animation-name": "rotate, pulse",
      "animation-duration": "1s, 500ms",
      "animation-timing-function": "ease, ease",
      "animation-delay": "0s, 0s",
      "animation-iteration-count": "infinite, 3",
      "animation-direction": "normal, normal",
      "animation-fill-mode": "none, none",
      "animation-play-state": "running, running",
    });
  });

  it("slideIn 1s ease-in, slideOut 1s ease-out 2s", () => {
    const result = animationHandler.expand("slideIn 1s ease-in, slideOut 1s ease-out 2s");
    expect(result).toEqual({
      "animation-name": "slideIn, slideOut",
      "animation-duration": "1s, 1s",
      "animation-timing-function": "ease-in, ease-out",
      "animation-delay": "0s, 2s",
      "animation-iteration-count": "1, 1",
      "animation-direction": "normal, normal",
      "animation-fill-mode": "none, none",
      "animation-play-state": "running, running",
    });
  });

  it("spin 2s, bounce 1s, fade 3s", () => {
    const result = animationHandler.expand("spin 2s, bounce 1s, fade 3s");
    expect(result).toEqual({
      "animation-name": "spin, bounce, fade",
      "animation-duration": "2s, 1s, 3s",
      "animation-timing-function": "ease, ease, ease",
      "animation-delay": "0s, 0s, 0s",
      "animation-iteration-count": "1, 1, 1",
      "animation-direction": "normal, normal, normal",
      "animation-fill-mode": "none, none, none",
      "animation-play-state": "running, running, running",
    });
  });

  it("spin 1s infinite alternate, pulse 500ms 3 ease-in 100ms forwards", () => {
    const result = animationHandler.expand(
      "spin 1s infinite alternate, pulse 500ms 3 ease-in 100ms forwards"
    );
    expect(result).toEqual({
      "animation-name": "spin, pulse",
      "animation-duration": "1s, 500ms",
      "animation-timing-function": "ease, ease-in",
      "animation-delay": "0s, 100ms",
      "animation-iteration-count": "infinite, 3",
      "animation-direction": "alternate, normal",
      "animation-fill-mode": "none, forwards",
      "animation-play-state": "running, running",
    });
  });

  it("spin var(--duration)", () => {
    const result = animationHandler.expand("spin var(--duration)");
    expect(result).toEqual({
      "animation-name": "spin",
      "animation-duration": "var(--duration)",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("var(--name) 1s", () => {
    const result = animationHandler.expand("var(--name) 1s");
    expect(result).toEqual({
      "animation-name": "var(--name)",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it("bounce 1s 2.5", () => {
    const result = animationHandler.expand("bounce 1s 2.5");
    expect(result).toEqual({
      "animation-name": "bounce",
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "2.5",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });

  it('"spin" 1s', () => {
    const result = animationHandler.expand('"spin" 1s');
    expect(result).toEqual({
      "animation-name": '"spin"',
      "animation-duration": "1s",
      "animation-timing-function": "ease",
      "animation-delay": "0s",
      "animation-iteration-count": "1",
      "animation-direction": "normal",
      "animation-fill-mode": "none",
      "animation-play-state": "running",
    });
  });
});
