// b_path:: src/handlers/list-style/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the list-style shorthand property.
 *
 * Reconstructs `list-style` from `list-style-type`, `list-style-position`, and `list-style-image`.
 *
 * Rules:
 * - All three must be present
 * - If all are defaults, can use just type or omit values matching defaults
 * - Order: type position image (standard order)
 * - Special case: if type=none and image=none, can just output 'none'
 */
export const listStyleCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "list-style",
    longhands: ["list-style-type", "list-style-position", "list-style-image"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const type = properties["list-style-type"];
    const position = properties["list-style-position"];
    const image = properties["list-style-image"];

    // All three must be present
    if (!type || !position || !image) return undefined;

    // Special case: both type and image are 'none' with default position
    if (type === "none" && image === "none" && position === "outside") {
      return "none";
    }

    // Build the collapsed value, omitting defaults when possible
    const parts: string[] = [];
    const isDefaultType = type === "disc";
    const isDefaultPosition = position === "outside";
    const isDefaultImage = image === "none";

    // Include non-default values, or if all are defaults, include type
    if (!isDefaultType) parts.push(type);
    if (!isDefaultPosition) parts.push(position);
    if (!isDefaultImage) parts.push(image);

    // If all were defaults, we need at least one value - use type
    if (parts.length === 0) parts.push(type);

    return parts.join(" ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(
      properties["list-style-type"] &&
      properties["list-style-position"] &&
      properties["list-style-image"]
    );
  },
});
