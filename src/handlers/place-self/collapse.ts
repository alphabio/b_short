// b_path:: src/handlers/place-self/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the place-self shorthand property.
 *
 * Reconstructs `place-self` from `align-self` and `justify-self`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (align justify)
 * - If either is missing: cannot collapse
 */
export const placeSelfCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "place-self",
    longhands: ["align-self", "justify-self"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const align = properties["align-self"];
    const justify = properties["justify-self"];

    // Both must be present
    if (!align || !justify) return undefined;

    // Same value - use single value syntax
    if (align === justify) return align;

    // Different values - use two value syntax
    return `${align} ${justify}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["align-self"] && properties["justify-self"]);
  },
});
