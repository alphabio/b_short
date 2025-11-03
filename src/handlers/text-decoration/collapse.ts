// b_path:: src/handlers/text-decoration/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the text-decoration shorthand property.
 *
 * Reconstructs `text-decoration` from text-decoration-line, style, color, and thickness.
 *
 * Rules:
 * - All four must be present
 * - Can omit defaults when appropriate
 * - Order: line style color thickness
 */
export const textDecorationCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "text-decoration",
    longhands: [
      "text-decoration-line",
      "text-decoration-style",
      "text-decoration-color",
      "text-decoration-thickness",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const line = properties["text-decoration-line"];
    const style = properties["text-decoration-style"];
    const color = properties["text-decoration-color"];
    const thickness = properties["text-decoration-thickness"];

    // All four must be present
    if (!line || !style || !color || !thickness) return undefined;

    const parts: string[] = [line];

    // Add non-default values
    if (style !== "solid") parts.push(style);
    if (color.toLowerCase() !== "currentcolor") parts.push(color);
    if (thickness !== "auto") parts.push(thickness);

    return parts.join(" ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(
      properties["text-decoration-line"] &&
      properties["text-decoration-style"] &&
      properties["text-decoration-color"] &&
      properties["text-decoration-thickness"]
    );
  },
});
