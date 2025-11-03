// b_path:: src/handlers/grid-column/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the grid-column shorthand property.
 *
 * Reconstructs `grid-column` from `grid-column-start` and `grid-column-end`.
 *
 * Rules:
 * - Both must be present
 * - If end is auto or default, can use just start
 * - Otherwise use start / end
 */
export const gridColumnCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "grid-column",
    longhands: ["grid-column-start", "grid-column-end"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const start = properties["grid-column-start"];
    const end = properties["grid-column-end"];

    // Both must be present
    if (!start || !end) return undefined;

    // If end is auto, can omit it
    if (end === "auto") return start;

    // Check if end is the default based on start
    // If start is a span, default end is auto
    // If start is a named line, default end would be auto
    // For now, simplify: if end is auto or same as start, omit it
    if (end === start) return start;

    // Both values needed
    return `${start} / ${end}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["grid-column-start"] && properties["grid-column-end"]);
  },
});
