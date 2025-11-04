// b_path:: src/handlers/text-emphasis/expand.ts

import isColor from "@/internal/is-color";
import normalizeColor from "@/internal/normalize-color";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { sortProperties } from "@/internal/property-sorter";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const FILL = /^(filled|open)$/i;
const SHAPE = /^(dot|circle|double-circle|triangle|sesame)$/i;
const STRING_VALUE = /^["'].*["']$/;

/**
 * Property handler for the 'text-emphasis' CSS shorthand property
 *
 * Expands text-emphasis into text-emphasis-style and text-emphasis-color.
 *
 * @example
 * ```typescript
 * textEmphasisHandler.expand('filled dot'); // { 'text-emphasis-style': 'filled dot', 'text-emphasis-color': 'currentcolor' }
 * textEmphasisHandler.expand('circle red'); // { 'text-emphasis-style': 'circle', 'text-emphasis-color': 'red' }
 * textEmphasisHandler.expand('"x"'); // { 'text-emphasis-style': '"x"', 'text-emphasis-color': 'currentcolor' }
 * ```
 */
export const textEmphasisHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "text-emphasis",
    longhands: ["text-emphasis-style", "text-emphasis-color"],
    defaults: {
      "text-emphasis-style": "none",
      "text-emphasis-color": "currentcolor",
    },
    category: "typography",
  },

  expand: (value: string): Record<string, string> | undefined => {
    const values = normalizeColor(value).split(/\s+/);

    if (values.length === 1 && KEYWORD.test(values[0])) {
      return sortProperties({
        "text-emphasis-style": values[0],
        "text-emphasis-color": values[0],
      });
    }

    const parsed: { style?: string; color?: string } = {};
    for (let i = 0; i < values.length; i++) {
      const v = values[i];

      if (v === "none") {
        if (parsed.style) return;
        parsed.style = v;
      } else if (STRING_VALUE.test(v)) {
        if (parsed.style) return;
        parsed.style = v;
      } else if (FILL.test(v)) {
        if (parsed.style) return;
        if (i + 1 < values.length && SHAPE.test(values[i + 1])) {
          parsed.style = `${v} ${values[i + 1]}`;
          i++;
        } else {
          parsed.style = v;
        }
      } else if (SHAPE.test(v)) {
        if (parsed.style) return;
        if (i + 1 < values.length && FILL.test(values[i + 1])) {
          parsed.style = `${values[i + 1]} ${v}`;
          i++;
        } else {
          parsed.style = v;
        }
      } else if (isColor(v)) {
        if (parsed.color) return;
        parsed.color = v;
      } else {
        return;
      }
    }

    // Use defaults for missing properties
    // Per CSS spec, the default values for text-emphasis shorthand are:
    //   style: 'none', color: 'currentcolor'
    // See: https://www.w3.org/TR/css-text-decor-3/#propdef-text-emphasis
    return sortProperties({
      "text-emphasis-style": parsed.style || "none",
      "text-emphasis-color": parsed.color || "currentcolor",
    });
  },

  validate: (value: string): boolean => {
    return textEmphasisHandler.expand(value) !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default function textEmphasis(value: string): Record<string, string> | undefined {
  return textEmphasisHandler.expand(value);
}
