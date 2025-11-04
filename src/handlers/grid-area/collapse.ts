// b_path:: src/handlers/grid-area/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the grid-area shorthand property.
 *
 * Reconstructs `grid-area` from grid-row-start, grid-column-start, grid-row-end, and grid-column-end.
 *
 * Rules:
 * - All four must be present
 * - If all are the same custom-ident, use single value
 * - Simplify to 1-3 values when possible
 * - Otherwise use row-start / column-start / row-end / column-end
 */
export const gridAreaCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "grid-area",
    longhands: ["grid-row-start", "grid-column-start", "grid-row-end", "grid-column-end"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const rowStart = properties["grid-row-start"];
    const columnStart = properties["grid-column-start"];
    const rowEnd = properties["grid-row-end"];
    const columnEnd = properties["grid-column-end"];

    // All four must be present
    if (!rowStart || !columnStart || !rowEnd || !columnEnd) return undefined;

    // Check if all are the same (named grid area)
    if (
      rowStart === columnStart &&
      columnStart === rowEnd &&
      rowEnd === columnEnd &&
      /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(rowStart) &&
      !/^(auto|span|\d)/i.test(rowStart)
    ) {
      return rowStart;
    }

    // Check if we can omit trailing values
    const parts: string[] = [rowStart];

    // Add column-start if not auto or if row-end/column-end are specified
    if (columnStart !== "auto" || rowEnd !== "auto" || columnEnd !== "auto") {
      parts.push(columnStart);
    }

    // Add row-end if not auto or if column-end is specified
    if (rowEnd !== "auto" || columnEnd !== "auto") {
      if (parts.length === 1) parts.push("auto"); // Need column-start
      parts.push(rowEnd);
    }

    // Add column-end if not auto
    if (columnEnd !== "auto") {
      if (parts.length === 1) parts.push("auto"); // Need column-start
      if (parts.length === 2) parts.push("auto"); // Need row-end
      parts.push(columnEnd);
    }

    return parts.join(" / ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(
      properties["grid-row-start"] &&
      properties["grid-column-start"] &&
      properties["grid-row-end"] &&
      properties["grid-column-end"]
    );
  },
});
