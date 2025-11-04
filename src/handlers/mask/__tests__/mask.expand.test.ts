// b_path:: src/handlers/mask/__tests__/mask.expand.test.ts
import { describe, expect, it } from "vitest";
import { maskHandler } from "../expand";

describe("mask expand", () => {
  it("inherit", () => {
    const result = maskHandler.expand("inherit");
    expect(result).toEqual({
      "mask-image": "inherit",
      "mask-mode": "inherit",
      "mask-position": "inherit",
      "mask-size": "inherit",
      "mask-repeat": "inherit",
      "mask-origin": "inherit",
      "mask-clip": "inherit",
      "mask-composite": "inherit",
    });
  });

  it("initial", () => {
    const result = maskHandler.expand("initial");
    expect(result).toEqual({
      "mask-image": "initial",
      "mask-mode": "initial",
      "mask-position": "initial",
      "mask-size": "initial",
      "mask-repeat": "initial",
      "mask-origin": "initial",
      "mask-clip": "initial",
      "mask-composite": "initial",
    });
  });

  it("unset", () => {
    const result = maskHandler.expand("unset");
    expect(result).toEqual({
      "mask-image": "unset",
      "mask-mode": "unset",
      "mask-position": "unset",
      "mask-size": "unset",
      "mask-repeat": "unset",
      "mask-origin": "unset",
      "mask-clip": "unset",
      "mask-composite": "unset",
    });
  });

  it("revert", () => {
    const result = maskHandler.expand("revert");
    expect(result).toEqual({
      "mask-image": "revert",
      "mask-mode": "revert",
      "mask-position": "revert",
      "mask-size": "revert",
      "mask-repeat": "revert",
      "mask-origin": "revert",
      "mask-clip": "revert",
      "mask-composite": "revert",
    });
  });

  it("url(mask.png)", () => {
    const result = maskHandler.expand("url(mask.png)");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("none", () => {
    const result = maskHandler.expand("none");
    expect(result).toEqual({
      "mask-image": "none",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("linear-gradient(black, transparent)", () => {
    const result = maskHandler.expand("linear-gradient(black, transparent)");
    expect(result).toEqual({
      "mask-image": "linear-gradient(black,transparent)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) center", () => {
    const result = maskHandler.expand("url(mask.png) center");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "center",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) 10px 20px", () => {
    const result = maskHandler.expand("url(mask.png) 10px 20px");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "10px 20px",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) left top", () => {
    const result = maskHandler.expand("url(mask.png) left top");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "left top",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) center / cover", () => {
    const result = maskHandler.expand("url(mask.png) center / cover");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "center",
      "mask-size": "cover",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) 0% 0% / 100px 200px", () => {
    const result = maskHandler.expand("url(mask.png) 0% 0% / 100px 200px");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "100px 200px",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) / contain", () => {
    const result = maskHandler.expand("url(mask.png) / contain");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "contain",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) no-repeat", () => {
    const result = maskHandler.expand("url(mask.png) no-repeat");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "no-repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) repeat-x", () => {
    const result = maskHandler.expand("url(mask.png) repeat-x");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat-x",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) repeat space", () => {
    const result = maskHandler.expand("url(mask.png) repeat space");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat space",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) alpha", () => {
    const result = maskHandler.expand("url(mask.png) alpha");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "alpha",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) luminance", () => {
    const result = maskHandler.expand("url(mask.png) luminance");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "luminance",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) match-source", () => {
    const result = maskHandler.expand("url(mask.png) match-source");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) add", () => {
    const result = maskHandler.expand("url(mask.png) add");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) subtract", () => {
    const result = maskHandler.expand("url(mask.png) subtract");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "subtract",
    });
  });

  it("url(mask.png) intersect", () => {
    const result = maskHandler.expand("url(mask.png) intersect");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "intersect",
    });
  });

  it("url(mask.png) exclude", () => {
    const result = maskHandler.expand("url(mask.png) exclude");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "exclude",
    });
  });

  it("url(mask.png) border-box", () => {
    const result = maskHandler.expand("url(mask.png) border-box");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) padding-box content-box", () => {
    const result = maskHandler.expand("url(mask.png) padding-box content-box");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "padding-box",
      "mask-clip": "content-box",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) content-box no-clip", () => {
    const result = maskHandler.expand("url(mask.png) content-box no-clip");
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "match-source",
      "mask-position": "0% 0%",
      "mask-size": "auto",
      "mask-repeat": "repeat",
      "mask-origin": "content-box",
      "mask-clip": "no-clip",
      "mask-composite": "add",
    });
  });

  it("url(mask.png) luminance 10px 20px / cover no-repeat add border-box", () => {
    const result = maskHandler.expand(
      "url(mask.png) luminance 10px 20px / cover no-repeat add border-box"
    );
    expect(result).toEqual({
      "mask-image": "url(mask.png)",
      "mask-mode": "luminance",
      "mask-position": "10px 20px",
      "mask-size": "cover",
      "mask-repeat": "no-repeat",
      "mask-origin": "border-box",
      "mask-clip": "border-box",
      "mask-composite": "add",
    });
  });

  it("linear-gradient(black, transparent) alpha center / contain repeat-x padding-box content-box subtract", () => {
    const result = maskHandler.expand(
      "linear-gradient(black, transparent) alpha center / contain repeat-x padding-box content-box subtract"
    );
    expect(result).toEqual({
      "mask-image": "linear-gradient(black,transparent)",
      "mask-mode": "alpha",
      "mask-position": "center",
      "mask-size": "contain",
      "mask-repeat": "repeat-x",
      "mask-origin": "padding-box",
      "mask-clip": "content-box",
      "mask-composite": "subtract",
    });
  });
});
