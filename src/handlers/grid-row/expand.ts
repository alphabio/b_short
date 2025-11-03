// b_path:: src/handlers/grid-row/expand.ts

import { getDefaultEnd, parseGridLine } from "@/internal/grid-line";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";

/**
 * Property handler for the 'grid-row' CSS shorthand property
 *
 * Expands grid-row into grid-row-start and grid-row-end.
 *
 * @example
 * ```typescript
 * gridRowHandler.expand('2'); // { 'grid-row-start': '2', 'grid-row-end': 'auto' }
 * gridRowHandler.expand('2 / 4'); // { 'grid-row-start': '2', 'grid-row-end': '4' }
 * gridRowHandler.expand('span 3'); // { 'grid-row-start': 'span 3', 'grid-row-end': 'auto' }
 * ```
 */
export const gridRowHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "grid-row",
    longhands: ["grid-row-start", "grid-row-end"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "grid-row-start": value,
        "grid-row-end": value,
      };
    }

    // Split values on slash
    const parts = value.trim().split(/\s*\/\s*/);

    // Validate part count - max 2 parts
    if (parts.length > 2) {
      return undefined;
    }

    // Handle single value
    if (parts.length === 1) {
      const startValue = parts[0].trim();
      if (!parseGridLine(startValue)) {
        return undefined;
      }
      const endValue = getDefaultEnd(startValue);
      return {
        "grid-row-start": startValue,
        "grid-row-end": endValue,
      };
    }

    // Handle two values
    if (parts.length === 2) {
      const startValue = parts[0].trim();
      const endValue = parts[1].trim();
      if (!parseGridLine(startValue) || !parseGridLine(endValue)) {
        return undefined;
      }
      return {
        "grid-row-start": startValue,
        "grid-row-end": endValue,
      };
    }

    return undefined;
  },

  validate: (value: string): boolean => {
    return gridRowHandler.expand(value) !== undefined;
  },
});

export default (value: string): Record<string, string> | undefined => {
  return gridRowHandler.expand(value);
};
