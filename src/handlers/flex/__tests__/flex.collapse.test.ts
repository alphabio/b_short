// b_path:: src/handlers/flex/__tests__/flex.collapse.test.ts
import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("flex collapse", () => {
  it("collapses flex to single number", () => {
    const result = collapse({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "0%",
    });
    expect(result.result).toEqual({ flex: "1" });
  });

  it("collapses flex to 'none'", () => {
    const result = collapse({
      "flex-grow": "0",
      "flex-shrink": "0",
      "flex-basis": "auto",
    });
    expect(result.result).toEqual({ flex: "none" });
  });

  it("collapses flex to 'auto'", () => {
    const result = collapse({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
    expect(result.result).toEqual({ flex: "auto" });
  });

  it("collapses flex to 'initial'", () => {
    const result = collapse({
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
    });
    expect(result.result).toEqual({ flex: "initial" });
  });

  it("collapses flex to two numbers", () => {
    const result = collapse({
      "flex-grow": "1",
      "flex-shrink": "0",
      "flex-basis": "0%",
    });
    expect(result.result).toEqual({ flex: "1 0" });
  });

  it("collapses flex with number and basis", () => {
    const result = collapse({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
    expect(result.result).toEqual({ flex: "1 100px" });
  });

  it("collapses flex to three values", () => {
    const result = collapse({
      "flex-grow": "2",
      "flex-shrink": "2",
      "flex-basis": "10em",
    });
    expect(result.result).toEqual({ flex: "2 2 10em" });
  });

  it("collapses flex with global keyword", () => {
    const result = collapse({
      "flex-grow": "inherit",
      "flex-shrink": "inherit",
      "flex-basis": "inherit",
    });
    expect(result.result).toEqual({ flex: "inherit" });
  });

  it("keeps flex longhands if incomplete", () => {
    const result = collapse({
      "flex-grow": "1",
      "flex-shrink": "1",
    });
    expect(result.result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
    });
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].property).toBe("flex");
  });
});
