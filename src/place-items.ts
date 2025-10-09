// b_path:: src/place-items.ts
import { consolidatePlaceTokens } from "./place-utils";

export default (value: string): Record<string, string> | undefined => {
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
      return undefined; // Cannot apply left/right to both properties
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
      return undefined; // left/right cannot be used for align-items
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
};
