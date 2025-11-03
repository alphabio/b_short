// b_path:: src/handlers/columns/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the columns shorthand property.
 *
 * Reconstructs `columns` from `column-width` and `column-count`.
 *
 * Rules:
 * - If both are auto: return 'auto'
 * - If one is auto: return the non-auto value
 * - If both are set: return 'width count'
 * - At least one must be present
 */
export const columnsCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "columns",
    longhands: ["column-width", "column-count"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const width = properties["column-width"];
    const count = properties["column-count"];

    // At least one must be present
    if (!width && !count) return undefined;

    // Both present
    if (width && count) {
      // Both auto
      if (width === "auto" && count === "auto") return "auto";
      // One is auto
      if (width === "auto") return count;
      if (count === "auto") return width;
      // Both specific values
      return `${width} ${count}`;
    }

    // Only one present
    return width || count;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["column-width"] || properties["column-count"]);
  },
});
