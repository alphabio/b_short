import { describe, expect, it } from "vitest";
import { borderRadiusHandler } from "../expand";

describe("border-radius expand", () => {
  it("1px", () => {
    const result = borderRadiusHandler.expand("1px");
    expect(result).toEqual({
      "border-top-left-radius": "1px",
      "border-top-right-radius": "1px",
      "border-bottom-right-radius": "1px",
      "border-bottom-left-radius": "1px",
    });
  });

  it("1px 2px", () => {
    const result = borderRadiusHandler.expand("1px 2px");
    expect(result).toEqual({
      "border-top-left-radius": "1px",
      "border-top-right-radius": "2px",
      "border-bottom-right-radius": "1px",
      "border-bottom-left-radius": "2px",
    });
  });

  it("1px 2px 3px", () => {
    const result = borderRadiusHandler.expand("1px 2px 3px");
    expect(result).toEqual({
      "border-top-left-radius": "1px",
      "border-top-right-radius": "2px",
      "border-bottom-right-radius": "3px",
      "border-bottom-left-radius": "2px",
    });
  });

  it("1px 2px 3px 4px", () => {
    const result = borderRadiusHandler.expand("1px 2px 3px 4px");
    expect(result).toEqual({
      "border-top-left-radius": "1px",
      "border-top-right-radius": "2px",
      "border-bottom-right-radius": "3px",
      "border-bottom-left-radius": "4px",
    });
  });

  it("10px / 5px", () => {
    const result = borderRadiusHandler.expand("10px / 5px");
    expect(result).toEqual({
      "border-top-left-radius": "10px 5px",
      "border-top-right-radius": "10px 5px",
      "border-bottom-right-radius": "10px 5px",
      "border-bottom-left-radius": "10px 5px",
    });
  });

  it("10px 20px / 5px 15px", () => {
    const result = borderRadiusHandler.expand("10px 20px / 5px 15px");
    expect(result).toEqual({
      "border-top-left-radius": "10px 5px",
      "border-top-right-radius": "20px 15px",
      "border-bottom-right-radius": "10px 5px",
      "border-bottom-left-radius": "20px 15px",
    });
  });

  it("10px 20px 30px / 5px 15px 25px", () => {
    const result = borderRadiusHandler.expand("10px 20px 30px / 5px 15px 25px");
    expect(result).toEqual({
      "border-top-left-radius": "10px 5px",
      "border-top-right-radius": "20px 15px",
      "border-bottom-right-radius": "30px 25px",
      "border-bottom-left-radius": "20px 15px",
    });
  });

  it("10px 20px 30px 40px / 5px 15px 25px 35px", () => {
    const result = borderRadiusHandler.expand("10px 20px 30px 40px / 5px 15px 25px 35px");
    expect(result).toEqual({
      "border-top-left-radius": "10px 5px",
      "border-top-right-radius": "20px 15px",
      "border-bottom-right-radius": "30px 25px",
      "border-bottom-left-radius": "40px 35px",
    });
  });

  it("inherit", () => {
    const result = borderRadiusHandler.expand("inherit");
    expect(result).toEqual({
      "border-top-left-radius": "inherit",
      "border-top-right-radius": "inherit",
      "border-bottom-right-radius": "inherit",
      "border-bottom-left-radius": "inherit",
    });
  });
});
