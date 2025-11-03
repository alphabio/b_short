// b_path:: src/handlers/contain-intrinsic-size/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the contain-intrinsic-size shorthand property.
 *
 * Reconstructs `contain-intrinsic-size` from `contain-intrinsic-width` and `contain-intrinsic-height`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (width height)
 * - Both must be present
 */
export const containIntrinsicSizeCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "contain-intrinsic-size",
    longhands: ["contain-intrinsic-width", "contain-intrinsic-height"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const width = properties["contain-intrinsic-width"];
    const height = properties["contain-intrinsic-height"];

    // Both must be present
    if (!width || !height) return undefined;

    // Same value - use single value syntax
    if (width === height) return width;

    // Different values - use two value syntax
    return `${width} ${height}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["contain-intrinsic-width"] && properties["contain-intrinsic-height"]);
  },
});
