// b_path:: src/handlers/font/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the font shorthand property.
 *
 * Reconstructs `font` from font-style, font-variant, font-weight, font-stretch,
 * font-size, line-height, and font-family.
 *
 * Rules:
 * - font-size and font-family are required
 * - Order: [style] [variant] [weight] [stretch] size[/line-height] family
 * - Optional values default to 'normal' when omitted
 * - System fonts (caption, icon, menu, etc.) are handled as single keywords
 */
export const fontCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "font",
    longhands: [
      "font-style",
      "font-variant",
      "font-weight",
      "font-stretch",
      "font-size",
      "line-height",
      "font-family",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const size = properties["font-size"];
    const family = properties["font-family"];

    // font-size and font-family are required
    if (!size || !family) return undefined;

    // Check for system fonts or CSS-wide keywords
    if (
      /^(caption|icon|menu|message-box|small-caption|status-bar|inherit|initial|unset|revert)$/.test(
        size
      )
    ) {
      return size;
    }

    const style = properties["font-style"];
    const variant = properties["font-variant"];
    const weight = properties["font-weight"];
    const stretch = properties["font-stretch"];
    const lineHeight = properties["line-height"];

    const parts: string[] = [];

    // Add optional values only if they differ from normal
    if (style && style !== "normal") parts.push(style);
    if (variant && variant !== "normal") parts.push(variant);
    if (weight && weight !== "normal") parts.push(weight);
    if (stretch && stretch !== "normal") parts.push(stretch);

    // Add required font-size with optional line-height
    if (lineHeight && lineHeight !== "normal") {
      parts.push(`${size}/${lineHeight}`);
    } else {
      parts.push(size);
    }

    // Add required font-family (remove quotes if present for cleaner output)
    // Keep quotes for families with spaces or special characters
    const cleanFamily = family.replace(/^["']|["']$/g, "");
    if (/[\s,]/.test(cleanFamily) && !family.startsWith('"') && !family.startsWith("'")) {
      parts.push(`"${cleanFamily}"`);
    } else {
      parts.push(family);
    }

    return parts.join(" ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Only font-size and font-family are required
    return !!(properties["font-size"] && properties["font-family"]);
  },
});
