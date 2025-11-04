// b_path:: src/handlers/mask/expand.ts

// NOTE: This handler contains complex multi-layer parsing logic that is a candidate
// for future refactoring. Masking syntax parsing could be simplified with better abstractions.

import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { needsAdvancedParser, parseMaskLayers, reconstructLayers } from "./mask-layers";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;

function parseMaskValue(value: string): Record<string, string> | undefined {
  // Trim the input value
  const trimmedValue = value.trim();

  // Handle global keywords first
  if (KEYWORD.test(trimmedValue)) {
    return {
      "mask-image": trimmedValue,
      "mask-mode": trimmedValue,
      "mask-position": trimmedValue,
      "mask-size": trimmedValue,
      "mask-repeat": trimmedValue,
      "mask-origin": trimmedValue,
      "mask-clip": trimmedValue,
      "mask-composite": trimmedValue,
    };
  }

  // Check for multi-layer syntax
  if (needsAdvancedParser(trimmedValue)) {
    const result = parseMaskLayers(trimmedValue);
    if (result) {
      return reconstructLayers(result.layers);
    }
    return undefined;
  }

  // For single-layer cases, use the advanced parser as well
  // since mask syntax is complex and the parser handles it well
  const result = parseMaskLayers(trimmedValue);
  if (result) {
    return reconstructLayers(result.layers);
  }

  return undefined;
}

/**
 * Property handler for the 'mask' CSS shorthand property
 *
 * Expands mask into mask-image, mask-mode, mask-position, mask-size,
 * mask-repeat, mask-origin, mask-clip, and mask-composite.
 *
 * @example
 * ```typescript
 * maskHandler.expand('url(mask.svg)');
 * maskHandler.expand('linear-gradient(black, transparent) center / contain');
 * ```
 */
export const maskHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "mask",
    longhands: [
      "mask-image",
      "mask-mode",
      "mask-position",
      "mask-size",
      "mask-repeat",
      "mask-origin",
      "mask-clip",
      "mask-composite",
    ],
    category: "visual",
  },

  expand: (value: string): Record<string, string> | undefined => {
    return parseMaskValue(value);
  },

  validate: (value: string): boolean => {
    return maskHandler.expand(value) !== undefined;
  },
});

export default function mask(value: string): Record<string, string> | undefined {
  return maskHandler.expand(value);
}
