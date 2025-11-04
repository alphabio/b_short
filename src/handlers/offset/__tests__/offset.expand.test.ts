import { describe, expect, it } from "vitest";
import { offsetHandler } from "../expand";

describe("offset expand", () => {
  it("inherit", () => {
    const result = offsetHandler.expand("inherit");
    expect(result).toEqual({
      "offset-position": "inherit",
      "offset-path": "inherit",
      "offset-distance": "inherit",
      "offset-rotate": "inherit",
      "offset-anchor": "inherit",
    });
  });

  it("initial", () => {
    const result = offsetHandler.expand("initial");
    expect(result).toEqual({
      "offset-position": "initial",
      "offset-path": "initial",
      "offset-distance": "initial",
      "offset-rotate": "initial",
      "offset-anchor": "initial",
    });
  });

  it("unset", () => {
    const result = offsetHandler.expand("unset");
    expect(result).toEqual({
      "offset-position": "unset",
      "offset-path": "unset",
      "offset-distance": "unset",
      "offset-rotate": "unset",
      "offset-anchor": "unset",
    });
  });

  it("revert", () => {
    const result = offsetHandler.expand("revert");
    expect(result).toEqual({
      "offset-position": "revert",
      "offset-path": "revert",
      "offset-distance": "revert",
      "offset-rotate": "revert",
      "offset-anchor": "revert",
    });
  });

  it("auto", () => {
    const result = offsetHandler.expand("auto");
    expect(result).toEqual({
      "offset-position": "auto",
    });
  });

  it("normal", () => {
    const result = offsetHandler.expand("normal");
    expect(result).toEqual({
      "offset-position": "normal",
    });
  });

  it("10px 30px", () => {
    const result = offsetHandler.expand("10px 30px");
    expect(result).toEqual({
      "offset-position": "10px 30px",
    });
  });

  it("left top", () => {
    const result = offsetHandler.expand("left top");
    expect(result).toEqual({
      "offset-position": "left top",
    });
  });

  it("center", () => {
    const result = offsetHandler.expand("center");
    expect(result).toEqual({
      "offset-position": "center",
    });
  });

  it("none", () => {
    const result = offsetHandler.expand("none");
    expect(result).toEqual({
      "offset-path": "none",
    });
  });

  it("path('M 100 100 L 300 100 L 200 300 z')", () => {
    const result = offsetHandler.expand("path('M 100 100 L 300 100 L 200 300 z')");
    expect(result).toEqual({
      "offset-path": "path('M 100 100 L 300 100 L 200 300 z')",
    });
  });

  it("url('arc.svg')", () => {
    const result = offsetHandler.expand("url('arc.svg')");
    expect(result).toEqual({
      "offset-path": "url('arc.svg')",
    });
  });

  it("ray(45deg closest-side)", () => {
    const result = offsetHandler.expand("ray(45deg closest-side)");
    expect(result).toEqual({
      "offset-path": "ray(45deg closest-side)",
    });
  });

  it("url('circle.svg') 100px", () => {
    const result = offsetHandler.expand("url('circle.svg') 100px");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-distance": "100px",
    });
  });

  it("url('circle.svg') 40%", () => {
    const result = offsetHandler.expand("url('circle.svg') 40%");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-distance": "40%",
    });
  });

  it("path('M 20 60 L 120 60') 50%", () => {
    const result = offsetHandler.expand("path('M 20 60 L 120 60') 50%");
    expect(result).toEqual({
      "offset-path": "path('M 20 60 L 120 60')",
      "offset-distance": "50%",
    });
  });

  it("url('circle.svg') 30deg", () => {
    const result = offsetHandler.expand("url('circle.svg') 30deg");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-rotate": "30deg",
    });
  });

  it("url('circle.svg') auto", () => {
    const result = offsetHandler.expand("url('circle.svg') auto");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-rotate": "auto",
    });
  });

  it("ray(45deg) reverse", () => {
    const result = offsetHandler.expand("ray(45deg) reverse");
    expect(result).toEqual({
      "offset-path": "ray(45deg)",
      "offset-rotate": "reverse",
    });
  });

  it("path('M 0 0 L 100 100') auto 90deg", () => {
    const result = offsetHandler.expand("path('M 0 0 L 100 100') auto 90deg");
    expect(result).toEqual({
      "offset-path": "path('M 0 0 L 100 100')",
      "offset-rotate": "auto 90deg",
    });
  });

  it("url('circle.svg') 50px 20deg", () => {
    const result = offsetHandler.expand("url('circle.svg') 50px 20deg");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-distance": "50px",
      "offset-rotate": "20deg",
    });
  });

  it("url('circle.svg') 40% auto", () => {
    const result = offsetHandler.expand("url('circle.svg') 40% auto");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-distance": "40%",
      "offset-rotate": "auto",
    });
  });

  it("path('M 0 0 L 100 100') 100px auto 45deg", () => {
    const result = offsetHandler.expand("path('M 0 0 L 100 100') 100px auto 45deg");
    expect(result).toEqual({
      "offset-path": "path('M 0 0 L 100 100')",
      "offset-distance": "100px",
      "offset-rotate": "auto 45deg",
    });
  });

  it("ray(45deg closest-side) / 40px 20px", () => {
    const result = offsetHandler.expand("ray(45deg closest-side) / 40px 20px");
    expect(result).toEqual({
      "offset-path": "ray(45deg closest-side)",
      "offset-anchor": "40px 20px",
    });
  });

  it("url('arc.svg') 2cm / 0.5cm 3cm", () => {
    const result = offsetHandler.expand("url('arc.svg') 2cm / 0.5cm 3cm");
    expect(result).toEqual({
      "offset-path": "url('arc.svg')",
      "offset-distance": "2cm",
      "offset-anchor": "0.5cm 3cm",
    });
  });

  it("url('arc.svg') 30deg / 50px 100px", () => {
    const result = offsetHandler.expand("url('arc.svg') 30deg / 50px 100px");
    expect(result).toEqual({
      "offset-path": "url('arc.svg')",
      "offset-rotate": "30deg",
      "offset-anchor": "50px 100px",
    });
  });

  it("path('M 20 60 L 120 60') 0% auto / 50% 50%", () => {
    const result = offsetHandler.expand("path('M 20 60 L 120 60') 0% auto / 50% 50%");
    expect(result).toEqual({
      "offset-path": "path('M 20 60 L 120 60')",
      "offset-distance": "0%",
      "offset-rotate": "auto",
      "offset-anchor": "50% 50%",
    });
  });

  it("url('circle.svg') / center", () => {
    const result = offsetHandler.expand("url('circle.svg') / center");
    expect(result).toEqual({
      "offset-path": "url('circle.svg')",
      "offset-anchor": "center",
    });
  });

  it("10px 30px path('M 0 0 L 100 100')", () => {
    const result = offsetHandler.expand("10px 30px path('M 0 0 L 100 100')");
    expect(result).toEqual({
      "offset-position": "10px 30px",
      "offset-path": "path('M 0 0 L 100 100')",
    });
  });

  it("center url('arc.svg')", () => {
    const result = offsetHandler.expand("center url('arc.svg')");
    expect(result).toEqual({
      "offset-position": "center",
      "offset-path": "url('arc.svg')",
    });
  });

  it("10px 30px url('arc.svg') 100px auto 45deg / center", () => {
    const result = offsetHandler.expand("10px 30px url('arc.svg') 100px auto 45deg / center");
    expect(result).toEqual({
      "offset-position": "10px 30px",
      "offset-path": "url('arc.svg')",
      "offset-distance": "100px",
      "offset-rotate": "auto 45deg",
      "offset-anchor": "center",
    });
  });

  it("left top path('M 0 0 L 100 100') 50% / 40px 20px", () => {
    const result = offsetHandler.expand("left top path('M 0 0 L 100 100') 50% / 40px 20px");
    expect(result).toEqual({
      "offset-position": "left top",
      "offset-path": "path('M 0 0 L 100 100')",
      "offset-distance": "50%",
      "offset-anchor": "40px 20px",
    });
  });
});
