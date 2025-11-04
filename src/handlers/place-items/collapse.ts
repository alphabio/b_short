// b_path:: src/handlers/place-items/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the place-items shorthand property.
 *
 * Reconstructs `place-items` from `align-items` and `justify-items`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (align justify)
 * - If either is missing: cannot collapse
 */
export const placeItemsCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "place-items",
    longhands: ["align-items", "justify-items"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const align = properties["align-items"];
    const justify = properties["justify-items"];

    // Both must be present
    if (!align || !justify) return undefined;

    // Same value - use single value syntax
    if (align === justify) return align;

    // Different values - use two value syntax
    return `${align} ${justify}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["align-items"] && properties["justify-items"]);
  },
});
