// b_path:: test/multi-layer.test.ts
import { describe, expect, it } from "vitest";
import expand from "../src/index";
import { backgroundLayerTestFixtures, maskLayerTestFixtures } from "./fixtures/layers";
import { assertNoDuplicateProperties } from "./helpers/assertions";

describe("background (multi-layer)", () => {
  backgroundLayerTestFixtures.forEach((testCase) => {
    it(`should expand "${testCase.name || testCase.input}"`, () => {
      const { result } = expand(testCase.input, { format: "js" });
      assertNoDuplicateProperties(result, testCase.name || testCase.input);
      expect(result).toEqual(testCase.expected);
    });
  });
});

describe("mask (multi-layer)", () => {
  maskLayerTestFixtures.forEach((testCase) => {
    it(`should expand "${testCase.name || testCase.input}"`, () => {
      const { result } = expand(testCase.input, { format: "js" });
      assertNoDuplicateProperties(result, testCase.name || testCase.input);
      expect(result).toEqual(testCase.expected);
    });
  });
});
