// b_path:: src/handlers/overflow/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the overflow shorthand property.
 *
 * Reconstructs `overflow` from `overflow-x` and `overflow-y`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (x y)
 * - If either is missing: cannot collapse
 */
export const overflowCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "overflow",
    longhands: ["overflow-x", "overflow-y"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const x = properties["overflow-x"];
    const y = properties["overflow-y"];

    // Both must be present
    if (!x || !y) return undefined;

    // Same value - use single value syntax
    if (x === y) return x;

    // Different values - use two value syntax
    return `${x} ${y}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["overflow-x"] && properties["overflow-y"]);
  },
});
