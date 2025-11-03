// b_path:: test/flex-collapse-roundtrip.test.ts

import { describe, expect, test } from "vitest";
import { collapse, expand } from "../src";

describe("flex expand-collapse roundtrip", () => {
  // Map of input values to their expected collapsed forms
  const testCases: Array<{ input: string; expected: string }> = [
    { input: "1", expected: "1" },
    { input: "2", expected: "2" },
    { input: "0", expected: "0" },
    { input: "none", expected: "none" },
    { input: "auto", expected: "auto" },
    { input: "initial", expected: "initial" },
    { input: "1 0", expected: "1 0" },
    { input: "1 1", expected: "1" }, // Collapses to single value
    { input: "2 1", expected: "2" }, // Collapses to single value
    { input: "0 1", expected: "0" }, // Collapses to single value
    { input: "1 100px", expected: "1 100px" },
    { input: "2 50%", expected: "2 50%" },
    { input: "1 1 auto", expected: "auto" }, // Collapses to keyword
    { input: "2 1 100px", expected: "2 100px" }, // Shrink=1 is default
    { input: "0 0 auto", expected: "none" }, // Collapses to keyword
    { input: "1 0 50%", expected: "1 0 50%" },
    { input: "2 2 10em", expected: "2 2 10em" },
    { input: "inherit", expected: "inherit" },
    { input: "unset", expected: "unset" },
    { input: "revert", expected: "revert" },
  ];

  testCases.forEach(({ input, expected }) => {
    test(`roundtrip: ${input} -> ${expected}`, () => {
      // Expand shorthand to longhands (CSS string format)
      const expanded = expand(`flex: ${input}`, { format: "css" });
      expect(expanded.ok).toBe(true);

      // Collapse longhands back to shorthand
      const collapsed = collapse(expanded.result);
      expect(collapsed.ok).toBe(true);

      // Should get the optimized collapsed form
      const expectedOutput = `flex: ${expected};`;
      expect(collapsed.result).toBe(expectedOutput);
    });
  });

  test("roundtrip with CSS string format", () => {
    const input = `
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 100px;
    `;

    const collapsed = collapse(input);
    expect(collapsed.ok).toBe(true);
    expect(collapsed.result).toContain("flex: 1 100px;");

    // Expand it back
    const expanded = expand(collapsed.result, { format: "js" });
    expect(expanded.ok).toBe(true);
    expect(expanded.result).toEqual({
      flexGrow: "1",
      flexShrink: "1",
      flexBasis: "100px",
    });
  });
});
