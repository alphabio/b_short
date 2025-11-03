// b_path:: src/outline.ts

import isColor from "./internal/is-color";
import isLength from "./internal/is-length";
import normalizeColor from "./internal/normalize-color";
import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";
import { sortProperties } from "./internal/property-sorter";

const WIDTH = /^(thin|medium|thick)$/;
const STYLE = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i;
const KEYWORD = /^(inherit|initial|unset|revert)$/i;

/**
 * Property handler for the 'outline' CSS shorthand property
 *
 * Expands outline into outline-width, outline-style, and outline-color.
 *
 * @example
 * ```typescript
 * outlineHandler.expand('2px solid red'); // { 'outline-width': '2px', 'outline-style': 'solid', 'outline-color': 'red' }
 * outlineHandler.expand('dashed'); // { 'outline-width': 'medium', 'outline-style': 'dashed', 'outline-color': 'currentcolor' }
 * ```
 */
export const outlineHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "outline",
    longhands: ["outline-width", "outline-style", "outline-color"],
    defaults: {
      "outline-width": "medium",
      "outline-style": "none",
      "outline-color": "currentcolor",
    },
    category: "visual",
  },

  expand: (value: string): Record<string, string> | undefined => {
    const values = normalizeColor(value).split(/\s+/);

    if (values.length > 3) return;
    if (values.length === 1 && KEYWORD.test(values[0])) {
      return sortProperties({
        "outline-width": values[0],
        "outline-style": values[0],
        "outline-color": values[0],
      });
    }

    const parsed: { width?: string; style?: string; color?: string } = {};
    for (let i = 0; i < values.length; i++) {
      const v = values[i];

      if (isLength(v) || WIDTH.test(v)) {
        if (parsed.width) return;
        parsed.width = v;
      } else if (STYLE.test(v)) {
        if (parsed.style) return;
        parsed.style = v;
      } else if (isColor(v)) {
        if (parsed.color) return;
        parsed.color = v;
      } else {
        return;
      }
    }

    // Use defaults for missing properties
    // Per CSS spec, the default values for outline shorthand are:
    //   width: 'medium', style: 'none', color: 'currentcolor'
    // See: https://drafts.csswg.org/css-ui-4/#propdef-outline
    return sortProperties({
      "outline-width": parsed.width || "medium",
      "outline-style": parsed.style || "none",
      "outline-color": parsed.color || "currentcolor",
    });
  },

  validate: (value: string): boolean => {
    return outlineHandler.expand(value) !== undefined;
  },
});

export default function outline(value: string): Record<string, string> | undefined {
  return outlineHandler.expand(value);
}
