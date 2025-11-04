// b_path:: src/handlers/grid-row/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the grid-row shorthand property.
 *
 * Reconstructs `grid-row` from `grid-row-start` and `grid-row-end`.
 *
 * Rules:
 * - Both must be present
 * - If end is auto or default, can use just start
 * - Otherwise use start / end
 */
export const gridRowCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "grid-row",
    longhands: ["grid-row-start", "grid-row-end"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const start = properties["grid-row-start"];
    const end = properties["grid-row-end"];

    // Both must be present
    if (!start || !end) return undefined;

    // If end is auto, can omit it
    if (end === "auto") return start;

    // Check if end is the same as start
    if (end === start) return start;

    // Both values needed
    return `${start} / ${end}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["grid-row-start"] && properties["grid-row-end"]);
  },
});
