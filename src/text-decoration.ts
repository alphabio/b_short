// b_path:: src/text-decoration.ts

import isColor from "./internal/is-color";
import isLength from "./internal/is-length";
import normalizeColor from "./internal/normalize-color";
import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";
import { sortProperties } from "./internal/property-sorter";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const LINE = /^(none|underline|overline|line-through|blink|spelling-error|grammar-error)$/i;
const STYLE = /^(solid|double|dotted|dashed|wavy)$/i;
const THICKNESS = /^(auto|from-font)$/i;

/**
 * Property handler for the 'text-decoration' CSS shorthand property
 *
 * Expands text-decoration into text-decoration-line, text-decoration-style,
 * text-decoration-color, and text-decoration-thickness.
 *
 * @example
 * ```typescript
 * textDecorationHandler.expand('underline'); // { 'text-decoration-line': 'underline', 'text-decoration-style': 'solid', 'text-decoration-color': 'currentColor', 'text-decoration-thickness': 'auto' }
 * textDecorationHandler.expand('underline dotted red'); // { 'text-decoration-line': 'underline', 'text-decoration-style': 'dotted', 'text-decoration-color': 'red', 'text-decoration-thickness': 'auto' }
 * textDecorationHandler.expand('overline line-through wavy'); // { 'text-decoration-line': 'overline line-through', 'text-decoration-style': 'wavy', 'text-decoration-color': 'currentColor', 'text-decoration-thickness': 'auto' }
 * ```
 */
export const textDecorationHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "text-decoration",
    longhands: [
      "text-decoration-line",
      "text-decoration-style",
      "text-decoration-color",
      "text-decoration-thickness",
    ],
    defaults: {
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    },
    category: "typography",
  },

  expand: (value: string): Record<string, string> | undefined => {
    const values = normalizeColor(value).split(/\s+/);

    if (values.length === 1 && KEYWORD.test(values[0])) {
      return sortProperties({
        "text-decoration-line": values[0],
        "text-decoration-style": values[0],
        "text-decoration-color": values[0],
        "text-decoration-thickness": values[0],
      });
    }

    // Initialize with defaults - text-decoration shorthand resets all properties
    const result: Record<string, string> = {
      "text-decoration-line": "none",
      "text-decoration-style": "solid",
      "text-decoration-color": "currentColor",
      "text-decoration-thickness": "auto",
    };

    const lines: string[] = [];
    let hasStyle = false;
    let hasColor = false;
    let hasThickness = false;

    for (let i = 0; i < values.length; i++) {
      const v = values[i];

      if (LINE.test(v)) {
        lines.push(v);
      } else if (STYLE.test(v)) {
        if (hasStyle) return; // Duplicate style
        result["text-decoration-style"] = v;
        hasStyle = true;
      } else if (isColor(v)) {
        if (hasColor) return; // Duplicate color
        result["text-decoration-color"] = v;
        hasColor = true;
      } else if (THICKNESS.test(v) || isLength(v)) {
        if (hasThickness) return; // Duplicate thickness
        result["text-decoration-thickness"] = v;
        hasThickness = true;
      } else {
        return;
      }
    }

    if (lines.length > 1 && lines.includes("none")) return;

    if (lines.length > 0) {
      if (lines.length !== new Set(lines).size) return; // Duplicate lines
      result["text-decoration-line"] = lines.join(" ");
    }

    return sortProperties(result);
  },

  validate: (value: string): boolean => {
    return textDecorationHandler.expand(value) !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default function textDecoration(value: string): Record<string, string> | undefined {
  return textDecorationHandler.expand(value);
}
