// b_path:: src/handlers/border/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Default values for border properties per CSS specification.
 */
const BORDER_DEFAULTS = {
  width: "medium",
  style: "none",
  color: "currentcolor",
} as const;

/**
 * Collapse handler for the border shorthand property.
 *
 * Reconstructs `border` from its 12 longhand properties (4 sides × 3 properties).
 *
 * Rules:
 * - Only collapses if all 4 sides have the same values for each property
 * - Default values can be omitted
 * - Values can appear in any order: width, style, color
 * - If not all sides match, keeps longhands unchanged
 */
export const borderCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "border",
    longhands: [
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
      "border-top-style",
      "border-right-style",
      "border-bottom-style",
      "border-left-style",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Extract all border properties
    const topWidth = properties["border-top-width"];
    const rightWidth = properties["border-right-width"];
    const bottomWidth = properties["border-bottom-width"];
    const leftWidth = properties["border-left-width"];

    const topStyle = properties["border-top-style"];
    const rightStyle = properties["border-right-style"];
    const bottomStyle = properties["border-bottom-style"];
    const leftStyle = properties["border-left-style"];

    const topColor = properties["border-top-color"];
    const rightColor = properties["border-right-color"];
    const bottomColor = properties["border-bottom-color"];
    const leftColor = properties["border-left-color"];

    // Need at least one property
    if (
      !topWidth &&
      !rightWidth &&
      !bottomWidth &&
      !leftWidth &&
      !topStyle &&
      !rightStyle &&
      !bottomStyle &&
      !leftStyle &&
      !topColor &&
      !rightColor &&
      !bottomColor &&
      !leftColor
    ) {
      return undefined;
    }

    // Check if all sides match for each property
    const widthsMatch =
      topWidth === rightWidth && topWidth === bottomWidth && topWidth === leftWidth;
    const stylesMatch =
      topStyle === rightStyle && topStyle === bottomStyle && topStyle === leftStyle;
    const colorsMatch =
      topColor === rightColor && topColor === bottomColor && topColor === leftColor;

    // Only collapse if all properties match across all sides
    if (!widthsMatch || !stylesMatch || !colorsMatch) {
      return undefined;
    }

    // Build shorthand value
    const parts: string[] = [];

    // Add width if not default
    if (topWidth && topWidth !== BORDER_DEFAULTS.width) {
      parts.push(topWidth);
    }

    // Add style if not default
    if (topStyle && topStyle !== BORDER_DEFAULTS.style) {
      parts.push(topStyle);
    }

    // Add color if not default
    if (topColor && topColor !== BORDER_DEFAULTS.color) {
      parts.push(topColor);
    }

    // If all are defaults, return undefined
    if (parts.length === 0) {
      return undefined;
    }

    return parts.join(" ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Need at least one border property
    return !!(
      properties["border-top-width"] ||
      properties["border-right-width"] ||
      properties["border-bottom-width"] ||
      properties["border-left-width"] ||
      properties["border-top-style"] ||
      properties["border-right-style"] ||
      properties["border-bottom-style"] ||
      properties["border-left-style"] ||
      properties["border-top-color"] ||
      properties["border-right-color"] ||
      properties["border-bottom-color"] ||
      properties["border-left-color"]
    );
  },
});
