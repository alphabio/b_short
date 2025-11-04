import { describe, expect, it } from "vitest";
import { listStyleHandler } from "../expand";

describe("list-style expand", () => {
  it("disc", () => {
    const result = listStyleHandler.expand("disc");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("circle", () => {
    const result = listStyleHandler.expand("circle");
    expect(result).toEqual({
      "list-style-type": "circle",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("square", () => {
    const result = listStyleHandler.expand("square");
    expect(result).toEqual({
      "list-style-type": "square",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("decimal", () => {
    const result = listStyleHandler.expand("decimal");
    expect(result).toEqual({
      "list-style-type": "decimal",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("lower-roman", () => {
    const result = listStyleHandler.expand("lower-roman");
    expect(result).toEqual({
      "list-style-type": "lower-roman",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("upper-alpha", () => {
    const result = listStyleHandler.expand("upper-alpha");
    expect(result).toEqual({
      "list-style-type": "upper-alpha",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("georgian", () => {
    const result = listStyleHandler.expand("georgian");
    expect(result).toEqual({
      "list-style-type": "georgian",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("inside", () => {
    const result = listStyleHandler.expand("inside");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("outside", () => {
    const result = listStyleHandler.expand("outside");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("url(bullet.png)", () => {
    const result = listStyleHandler.expand("url(bullet.png)");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "url(bullet.png)",
    });
  });

  it('url("icons/bullet.svg")', () => {
    const result = listStyleHandler.expand('url("icons/bullet.svg")');
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": 'url("icons/bullet.svg")',
    });
  });

  it("url('icons/bullet.svg')", () => {
    const result = listStyleHandler.expand("url('icons/bullet.svg')");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "url('icons/bullet.svg')",
    });
  });

  it("none", () => {
    const result = listStyleHandler.expand("none");
    expect(result).toEqual({
      "list-style-type": "none",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("square inside", () => {
    const result = listStyleHandler.expand("square inside");
    expect(result).toEqual({
      "list-style-type": "square",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("inside square", () => {
    const result = listStyleHandler.expand("inside square");
    expect(result).toEqual({
      "list-style-type": "square",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("url(bullet.png) inside", () => {
    const result = listStyleHandler.expand("url(bullet.png) inside");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "inside",
      "list-style-image": "url(bullet.png)",
    });
  });

  it("inside url(bullet.png)", () => {
    const result = listStyleHandler.expand("inside url(bullet.png)");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "inside",
      "list-style-image": "url(bullet.png)",
    });
  });

  it("georgian outside", () => {
    const result = listStyleHandler.expand("georgian outside");
    expect(result).toEqual({
      "list-style-type": "georgian",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it('lower-roman url("icons/bullet.svg") outside', () => {
    const result = listStyleHandler.expand('lower-roman url("icons/bullet.svg") outside');
    expect(result).toEqual({
      "list-style-type": "lower-roman",
      "list-style-position": "outside",
      "list-style-image": 'url("icons/bullet.svg")',
    });
  });

  it('url("icons/bullet.svg") inside square', () => {
    const result = listStyleHandler.expand('url("icons/bullet.svg") inside square');
    expect(result).toEqual({
      "list-style-type": "square",
      "list-style-position": "inside",
      "list-style-image": 'url("icons/bullet.svg")',
    });
  });

  it("custom-counter", () => {
    const result = listStyleHandler.expand("custom-counter");
    expect(result).toEqual({
      "list-style-type": "custom-counter",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("my-style inside", () => {
    const result = listStyleHandler.expand("my-style inside");
    expect(result).toEqual({
      "list-style-type": "my-style",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it('"→"', () => {
    const result = listStyleHandler.expand('"→"');
    expect(result).toEqual({
      "list-style-type": '"→"',
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("'※' inside", () => {
    const result = listStyleHandler.expand("'※' inside");
    expect(result).toEqual({
      "list-style-type": "'※'",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("inherit", () => {
    const result = listStyleHandler.expand("inherit");
    expect(result).toEqual({
      "list-style-type": "inherit",
      "list-style-position": "inherit",
      "list-style-image": "inherit",
    });
  });

  it("initial", () => {
    const result = listStyleHandler.expand("initial");
    expect(result).toEqual({
      "list-style-type": "initial",
      "list-style-position": "initial",
      "list-style-image": "initial",
    });
  });

  it("unset", () => {
    const result = listStyleHandler.expand("unset");
    expect(result).toEqual({
      "list-style-type": "unset",
      "list-style-position": "unset",
      "list-style-image": "unset",
    });
  });

  it("revert", () => {
    const result = listStyleHandler.expand("revert");
    expect(result).toEqual({
      "list-style-type": "revert",
      "list-style-position": "revert",
      "list-style-image": "revert",
    });
  });

  it("disc url(bullet.png)", () => {
    const result = listStyleHandler.expand("disc url(bullet.png)");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "url(bullet.png)",
    });
  });

  it("url(bullet.png) disc outside", () => {
    const result = listStyleHandler.expand("url(bullet.png) disc outside");
    expect(result).toEqual({
      "list-style-type": "disc",
      "list-style-position": "outside",
      "list-style-image": "url(bullet.png)",
    });
  });

  it("emoji", () => {
    const result = listStyleHandler.expand("emoji");
    expect(result).toEqual({
      "list-style-type": "emoji",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("emoji inside", () => {
    const result = listStyleHandler.expand("emoji inside");
    expect(result).toEqual({
      "list-style-type": "emoji",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("none outside", () => {
    const result = listStyleHandler.expand("none outside");
    expect(result).toEqual({
      "list-style-type": "none",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("inside none", () => {
    const result = listStyleHandler.expand("inside none");
    expect(result).toEqual({
      "list-style-type": "none",
      "list-style-position": "inside",
      "list-style-image": "none",
    });
  });

  it("none url(a.png)", () => {
    const result = listStyleHandler.expand("none url(a.png)");
    expect(result).toEqual({
      "list-style-type": "none",
      "list-style-position": "outside",
      "list-style-image": "url(a.png)",
    });
  });
});
