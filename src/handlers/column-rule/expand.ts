// b_path:: src/handlers/column-rule/expand.ts

import isColor from "@/internal/is-color";
import isLength from "@/internal/is-length";
import normalizeColor from "@/internal/normalize-color";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { sortProperties } from "@/internal/property-sorter";

const WIDTH = /^(thin|medium|thick)$/;
const STYLE = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i;
const KEYWORD = /^(inherit|initial|unset|revert)$/i;

/**
 * Property handler for the 'column-rule' CSS shorthand property
 *
 * Expands column-rule into column-rule-width, column-rule-style, and column-rule-color.
 *
 * @example
 * ```typescript
 * columnRuleHandler.expand('medium'); // { 'column-rule-width': 'medium', 'column-rule-style': 'none', 'column-rule-color': 'currentcolor' }
 * columnRuleHandler.expand('3px solid red'); // { 'column-rule-width': '3px', 'column-rule-style': 'solid', 'column-rule-color': 'red' }
 * columnRuleHandler.expand('dotted blue'); // { 'column-rule-width': 'medium', 'column-rule-style': 'dotted', 'column-rule-color': 'blue' }
 * ```
 */
export const columnRuleHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "column-rule",
    longhands: ["column-rule-width", "column-rule-style", "column-rule-color"],
    defaults: {
      "column-rule-width": "medium",
      "column-rule-style": "none",
      "column-rule-color": "currentcolor",
    },
    category: "visual",
  },

  expand: (value: string): Record<string, string> | undefined => {
    const values = normalizeColor(value).split(/\s+/);

    if (values.length > 3) return;
    if (values.length === 1 && KEYWORD.test(values[0])) {
      return sortProperties({
        "column-rule-width": values[0],
        "column-rule-style": values[0],
        "column-rule-color": values[0],
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
    // Per CSS spec, the default values for column-rule shorthand are:
    //   width: 'medium', style: 'none', color: 'currentcolor'
    // See: https://drafts.csswg.org/css-multicol-1/#propdef-column-rule
    return sortProperties({
      "column-rule-width": parsed.width || "medium",
      "column-rule-style": parsed.style || "none",
      "column-rule-color": parsed.color || "currentcolor",
    });
  },

  validate: (value: string): boolean => {
    return columnRuleHandler.expand(value) !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default function columnRule(value: string): Record<string, string> | undefined {
  return columnRuleHandler.expand(value);
}
