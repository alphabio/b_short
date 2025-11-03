// b_path:: src/handlers/gap/expand.ts

import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { sortProperties } from "@/internal/property-sorter";

/**
 * Parses gap shorthand value
 * Syntax: gap = <'row-gap'> <'column-gap'>?
 *
 * If one value: both row-gap and column-gap use that value
 * If two values: first is row-gap, second is column-gap
 */
function parseGapValue(value: string): Record<string, string> | undefined {
  const trimmed = value.trim();

  // Handle CSS-wide keywords
  if (/^(inherit|initial|unset|revert)$/i.test(trimmed)) {
    return sortProperties({
      "row-gap": trimmed,
      "column-gap": trimmed,
    });
  }

  // Split by whitespace
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0 || parts.length > 2) {
    return undefined;
  }

  if (parts.length === 1) {
    // Single value - applies to both
    return sortProperties({
      "row-gap": parts[0],
      "column-gap": parts[0],
    });
  }

  // Two values - row then column
  return sortProperties({
    "row-gap": parts[0],
    "column-gap": parts[1],
  });
}

/**
 * Property handler for the 'gap' CSS shorthand property
 *
 * Expands gap into row-gap and column-gap.
 *
 * @example
 * ```typescript
 * gapHandler.expand('10px');          // row-gap: 10px; column-gap: 10px
 * gapHandler.expand('10px 20px');     // row-gap: 10px; column-gap: 20px
 * gapHandler.expand('normal');        // row-gap: normal; column-gap: normal
 * ```
 */
export const gapHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "gap",
    longhands: ["row-gap", "column-gap"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    return parseGapValue(value);
  },

  validate: (value: string): boolean => {
    return gapHandler.expand(value) !== undefined;
  },
});

export default function gap(value: string): Record<string, string> | undefined {
  return gapHandler.expand(value);
}
