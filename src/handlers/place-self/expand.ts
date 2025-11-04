// b_path:: src/handlers/place-self/expand.ts

import { consolidatePlaceTokens } from "@/internal/place-utils";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";

/**
 * Property handler for the 'place-self' CSS shorthand property
 *
 * Expands place-self into align-self and justify-self.
 *
 * @example
 * ```typescript
 * placeSelfHandler.expand('center'); // { 'align-self': 'center', 'justify-self': 'center' }
 * placeSelfHandler.expand('start end'); // { 'align-self': 'start', 'justify-self': 'end' }
 * ```
 */
export const placeSelfHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "place-self",
    longhands: ["align-self", "justify-self"],
    defaults: {
      "align-self": "auto",
      "justify-self": "auto",
    },
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "align-self": value,
        "justify-self": value,
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
    const isValidAlignSelfValue = (val: string): boolean => {
      return /^(auto|normal|stretch|center|start|end|self-start|self-end|flex-start|flex-end|baseline|first baseline|last baseline|anchor-center|safe center|safe start|safe end|safe self-start|safe self-end|safe flex-start|safe flex-end|unsafe center|unsafe start|unsafe end|unsafe self-start|unsafe self-end|unsafe flex-start|unsafe flex-end)$/i.test(
        val
      );
    };

    const isValidJustifySelfValue = (val: string): boolean => {
      return /^(auto|normal|stretch|center|start|end|self-start|self-end|flex-start|flex-end|baseline|first baseline|last baseline|left|right|safe center|safe start|safe end|safe self-start|safe self-end|safe flex-start|safe flex-end|unsafe center|unsafe start|unsafe end|unsafe self-start|unsafe self-end|unsafe flex-start|unsafe flex-end)$/i.test(
        val
      );
    };

    // Validate processed values
    for (const val of processedValues) {
      if (!isValidAlignSelfValue(val) && !isValidJustifySelfValue(val)) {
        return undefined;
      }
    }

    // Handle single value - both properties get the same value, but left/right are invalid for single value
    if (processedValues.length === 1) {
      const val = processedValues[0];
      if (val === "left" || val === "right") {
        return undefined;
      }
      if (!isValidAlignSelfValue(val)) {
        return undefined;
      }
      return {
        "align-self": val,
        "justify-self": val,
      };
    }

    // Handle two values - first=align-self, second=justify-self
    if (processedValues.length === 2) {
      const [alignVal, justifyVal] = processedValues;
      if (!isValidAlignSelfValue(alignVal) || alignVal === "left" || alignVal === "right") {
        return undefined;
      }
      if (!isValidJustifySelfValue(justifyVal)) {
        return undefined;
      }
      return {
        "align-self": alignVal,
        "justify-self": justifyVal,
      };
    }

    return undefined;
  },

  validate: (value: string): boolean => {
    const result = placeSelfHandler.expand(value);
    return result !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default (value: string): Record<string, string> | undefined => {
  return placeSelfHandler.expand(value);
};
