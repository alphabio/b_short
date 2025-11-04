// b_path:: src/handlers/gap/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the gap shorthand property.
 *
 * Reconstructs `gap` from `row-gap` and `column-gap`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (row column)
 * - If either is missing: cannot collapse
 */
export const gapCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "gap",
    longhands: ["row-gap", "column-gap"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const row = properties["row-gap"];
    const column = properties["column-gap"];

    // Both must be present
    if (!row || !column) return undefined;

    // Same value - use single value syntax
    if (row === column) return row;

    // Different values - use two value syntax
    return `${row} ${column}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["row-gap"] && properties["column-gap"]);
  },
});
