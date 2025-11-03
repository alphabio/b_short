// b_path:: src/grid-area.ts

import { getDefaultEnd, parseGridLine } from "./grid-line";
import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";

/**
 * Property handler for the 'grid-area' CSS shorthand property
 *
 * Expands grid-area into grid-row-start, grid-column-start, grid-row-end, and grid-column-end.
 *
 * @example
 * ```typescript
 * gridAreaHandler.expand('header'); // Named grid area
 * gridAreaHandler.expand('1 / 2'); // { 'grid-row-start': '1', 'grid-column-start': '2', ... }
 * gridAreaHandler.expand('1 / 2 / 3 / 4'); // All four values specified
 * ```
 */
export const gridAreaHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "grid-area",
    longhands: ["grid-row-start", "grid-column-start", "grid-row-end", "grid-column-end"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "grid-row-start": value,
        "grid-column-start": value,
        "grid-row-end": value,
        "grid-column-end": value,
      };
    }

    // Split values on slash
    const parts = value.trim().split(/\s*\/\s*/);

    // Validate part count - max 4 parts
    if (parts.length > 4) {
      return undefined;
    }

    // Validate all parts
    for (const part of parts) {
      if (!parseGridLine(part.trim())) {
        return undefined;
      }
    }

    let rowStart: string, columnStart: string, rowEnd: string, columnEnd: string;

    if (parts.length === 1) {
      // 1 value: row-start (or all if custom-ident)
      const val = parts[0].trim();
      if (/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(val) && !/^(auto|span|\d)/i.test(val)) {
        // Custom-ident: all four get the same value
        rowStart = columnStart = rowEnd = columnEnd = val;
      } else {
        // Otherwise: row-start gets value, others auto
        rowStart = val;
        columnStart = "auto";
        rowEnd = "auto";
        columnEnd = "auto";
      }
    } else if (parts.length === 2) {
      // 2 values: row-start / column-start
      rowStart = parts[0].trim();
      columnStart = parts[1].trim();
      rowEnd = getDefaultEnd(rowStart);
      columnEnd = getDefaultEnd(columnStart);
    } else if (parts.length === 3) {
      // 3 values: row-start / column-start / row-end
      rowStart = parts[0].trim();
      columnStart = parts[1].trim();
      rowEnd = parts[2].trim();
      columnEnd = getDefaultEnd(columnStart);
    } else {
      // 4 values: row-start / column-start / row-end / column-end
      rowStart = parts[0].trim();
      columnStart = parts[1].trim();
      rowEnd = parts[2].trim();
      columnEnd = parts[3].trim();
    }

    return {
      "grid-row-start": rowStart,
      "grid-column-start": columnStart,
      "grid-row-end": rowEnd,
      "grid-column-end": columnEnd,
    };
  },

  validate: (value: string): boolean => {
    return gridAreaHandler.expand(value) !== undefined;
  },
});

export default (value: string): Record<string, string> | undefined => {
  return gridAreaHandler.expand(value);
};
