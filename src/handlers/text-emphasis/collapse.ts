// b_path:: src/handlers/text-emphasis/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the text-emphasis shorthand property.
 *
 * Reconstructs `text-emphasis` from `text-emphasis-style` and `text-emphasis-color`.
 *
 * Rules:
 * - Both must be present
 * - Can omit default color (currentcolor)
 * - Order: style color
 */
export const textEmphasisCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "text-emphasis",
    longhands: ["text-emphasis-style", "text-emphasis-color"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const style = properties["text-emphasis-style"];
    const color = properties["text-emphasis-color"];

    // Both must be present
    if (!style || !color) return undefined;

    // If color is default (currentcolor), can omit it
    if (color.toLowerCase() === "currentcolor") {
      return style;
    }

    // Both values
    return `${style} ${color}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["text-emphasis-style"] && properties["text-emphasis-color"]);
  },
});
