// b_path:: src/handlers/place-content/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the place-content shorthand property.
 *
 * Reconstructs `place-content` from `align-content` and `justify-content`.
 *
 * Rules:
 * - If both values are the same: use single value
 * - If values differ: use two values (align justify)
 * - If either is missing: cannot collapse
 */
export const placeContentCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "place-content",
    longhands: ["align-content", "justify-content"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const align = properties["align-content"];
    const justify = properties["justify-content"];

    // Both must be present
    if (!align || !justify) return undefined;

    // Same value - use single value syntax
    if (align === justify) return align;

    // Different values - use two value syntax
    return `${align} ${justify}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["align-content"] && properties["justify-content"]);
  },
});
