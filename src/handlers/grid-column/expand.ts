// b_path:: src/handlers/grid-column/expand.ts

import { getDefaultEnd, parseGridLine } from "@/internal/grid-line";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";

/**
 * Property handler for the 'grid-column' CSS shorthand property
 *
 * Expands grid-column into grid-column-start and grid-column-end.
 *
 * @example
 * ```typescript
 * gridColumnHandler.expand('2'); // { 'grid-column-start': '2', 'grid-column-end': 'auto' }
 * gridColumnHandler.expand('2 / 4'); // { 'grid-column-start': '2', 'grid-column-end': '4' }
 * gridColumnHandler.expand('span 3'); // { 'grid-column-start': 'span 3', 'grid-column-end': 'auto' }
 * ```
 */
export const gridColumnHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "grid-column",
    longhands: ["grid-column-start", "grid-column-end"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "grid-column-start": value,
        "grid-column-end": value,
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
        "grid-column-start": startValue,
        "grid-column-end": endValue,
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
        "grid-column-start": startValue,
        "grid-column-end": endValue,
      };
    }

    return undefined;
  },

  validate: (value: string): boolean => {
    return gridColumnHandler.expand(value) !== undefined;
  },
});

export default (value: string): Record<string, string> | undefined => {
  return gridColumnHandler.expand(value);
};
