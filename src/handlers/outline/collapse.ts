// b_path:: src/handlers/outline/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the outline shorthand property.
 *
 * Reconstructs `outline` from `outline-width`, `outline-style`, and `outline-color`.
 *
 * Rules:
 * - All three must be present
 * - Can omit defaults when appropriate
 * - Order: width style color
 */
export const outlineCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "outline",
    longhands: ["outline-width", "outline-style", "outline-color"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const width = properties["outline-width"];
    const style = properties["outline-style"];
    const color = properties["outline-color"];

    // All three must be present
    if (!width || !style || !color) return undefined;

    const parts: string[] = [];

    // Add non-default values
    if (width !== "medium") parts.push(width);
    if (style !== "none") parts.push(style);
    if (color.toLowerCase() !== "currentcolor") parts.push(color);

    // If all were defaults, we need at least one - use style
    if (parts.length === 0) return style;

    return parts.join(" ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(
      properties["outline-width"] &&
      properties["outline-style"] &&
      properties["outline-color"]
    );
  },
});
