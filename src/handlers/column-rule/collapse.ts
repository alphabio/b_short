// b_path:: src/handlers/column-rule/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the column-rule shorthand property.
 *
 * Reconstructs `column-rule` from `column-rule-width`, `column-rule-style`, and `column-rule-color`.
 *
 * Rules:
 * - All three must be present
 * - Can omit defaults when appropriate
 * - Order: width style color
 */
export const columnRuleCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "column-rule",
    longhands: ["column-rule-width", "column-rule-style", "column-rule-color"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const width = properties["column-rule-width"];
    const style = properties["column-rule-style"];
    const color = properties["column-rule-color"];

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
      properties["column-rule-width"] &&
      properties["column-rule-style"] &&
      properties["column-rule-color"]
    );
  },
});
