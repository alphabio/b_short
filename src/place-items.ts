// b_path:: src/place-items.ts

import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";
import { consolidatePlaceTokens } from "./place-utils";

/**
 * Property handler for the 'place-items' CSS shorthand property
 *
 * Expands place-items into align-items and justify-items.
 *
 * @example
 * ```typescript
 * placeItemsHandler.expand('center'); // { 'align-items': 'center', 'justify-items': 'center' }
 * placeItemsHandler.expand('start end'); // { 'align-items': 'start', 'justify-items': 'end' }
 * ```
 */
export const placeItemsHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "place-items",
    longhands: ["align-items", "justify-items"],
    defaults: {
      "align-items": "normal",
      "justify-items": "legacy",
    },
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "align-items": value,
        "justify-items": value,
      };
    }

    // Process tokens with lookahead for compound keywords
    const processedValues = consolidatePlaceTokens(
      value,
      /^(center|start|end|self-start|self-end|flex-start|flex-end)$/i
    );
    if (!processedValues) {
      return undefined;
    }

    // Helper functions for validation
    const isValidAlignItemsValue = (val: string): boolean => {
      return /^(normal|stretch|center|start|end|self-start|self-end|flex-start|flex-end|baseline|first baseline|last baseline|safe center|safe start|safe end|safe self-start|safe self-end|safe flex-start|safe flex-end|unsafe center|unsafe start|unsafe end|unsafe self-start|unsafe self-end|unsafe flex-start|unsafe flex-end)$/i.test(
        val
      );
    };

    const isValidJustifyItemsValue = (val: string): boolean => {
      return /^(normal|stretch|center|start|end|self-start|self-end|flex-start|flex-end|baseline|first baseline|last baseline|left|right|safe center|safe start|safe end|safe self-start|safe self-end|safe flex-start|safe flex-end|unsafe center|unsafe start|unsafe end|unsafe self-start|unsafe self-end|unsafe flex-start|unsafe flex-end)$/i.test(
        val
      );
    };

    // Validate processed values
    for (const val of processedValues) {
      if (!isValidAlignItemsValue(val) && !isValidJustifyItemsValue(val)) {
        return undefined;
      }
    }

    // Handle single value - both properties get the same value, but left/right are invalid for single value
    if (processedValues.length === 1) {
      const val = processedValues[0];
      if (val === "left" || val === "right") {
        return undefined;
      }
      if (!isValidAlignItemsValue(val)) {
        return undefined;
      }
      return {
        "align-items": val,
        "justify-items": val,
      };
    }

    // Handle two values - first=align-items, second=justify-items
    if (processedValues.length === 2) {
      const [alignVal, justifyVal] = processedValues;
      if (!isValidAlignItemsValue(alignVal) || alignVal === "left" || alignVal === "right") {
        return undefined;
      }
      if (!isValidJustifyItemsValue(justifyVal)) {
        return undefined;
      }
      return {
        "align-items": alignVal,
        "justify-items": justifyVal,
      };
    }

    return undefined;
  },

  validate: (value: string): boolean => {
    const result = placeItemsHandler.expand(value);
    return result !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default (value: string): Record<string, string> | undefined => {
  return placeItemsHandler.expand(value);
};
