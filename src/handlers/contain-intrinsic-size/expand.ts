// b_path:: src/handlers/contain-intrinsic-size/expand.ts

import isLength from "@/internal/is-length";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";

/**
 * Property handler for the 'contain-intrinsic-size' CSS shorthand property
 *
 * Expands contain-intrinsic-size into contain-intrinsic-width and contain-intrinsic-height.
 *
 * @example
 * ```typescript
 * containIntrinsicSizeHandler.expand('auto 100px'); // { 'contain-intrinsic-width': 'auto 100px', 'contain-intrinsic-height': 'auto 100px' }
 * containIntrinsicSizeHandler.expand('100px auto 200px'); // { 'contain-intrinsic-width': '100px', 'contain-intrinsic-height': 'auto 200px' }
 * containIntrinsicSizeHandler.expand('none'); // { 'contain-intrinsic-width': 'none', 'contain-intrinsic-height': 'none' }
 * ```
 */
export const containIntrinsicSizeHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "contain-intrinsic-size",
    longhands: ["contain-intrinsic-width", "contain-intrinsic-height"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "contain-intrinsic-width": value,
        "contain-intrinsic-height": value,
      };
    }

    // Split values on whitespace
    const tokens = value.trim().split(/\s+/);

    // Validate token count - max 4 tokens (for two auto pairs)
    if (tokens.length > 4 || tokens.length === 0) {
      return undefined;
    }

    const result: Record<string, string> = {};

    // Parse tokens into width and height values
    let i = 0;
    const parseValue = (): string | undefined => {
      if (i >= tokens.length) return undefined;

      const token = tokens[i++];
      if (token.toLowerCase() === "auto") {
        if (i >= tokens.length) return undefined; // auto must be followed by something
        const nextToken = tokens[i++];
        if (nextToken.toLowerCase() === "none") {
          return "auto none";
        } else if (isLength(nextToken)) {
          return `auto ${nextToken}`;
        } else {
          return undefined; // invalid after auto
        }
      } else if (token.toLowerCase() === "none") {
        return "none";
      } else if (isLength(token)) {
        return token;
      } else {
        return undefined; // invalid token
      }
    };

    // Parse width value
    const widthValue = parseValue();
    if (widthValue === undefined) return undefined;

    // Parse height value (if present)
    const heightValue = parseValue();

    // If only one value provided, apply to both
    if (heightValue === undefined) {
      result["contain-intrinsic-width"] = widthValue;
      result["contain-intrinsic-height"] = widthValue;
    } else {
      // Two values provided
      result["contain-intrinsic-width"] = widthValue;
      result["contain-intrinsic-height"] = heightValue;
    }

    // Ensure no extra tokens
    if (i !== tokens.length) return undefined;

    return result;
  },

  validate: (value: string): boolean => {
    return containIntrinsicSizeHandler.expand(value) !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default (value: string): Record<string, string> | undefined => {
  return containIntrinsicSizeHandler.expand(value);
};
