// b_path:: src/handlers/transition/expand.ts

// NOTE: This handler contains complex multi-layer parsing logic that is a candidate
// for future refactoring. Property name handling and timing parsing could be simplified.

import isTime from "@/internal/is-time";
import isTimingFunction from "@/internal/is-timing-function";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { needsAdvancedParser, parseTransitionLayers, reconstructLayers } from "./transition-layers";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const PROPERTY_KEYWORD = /^(none|all)$/i;

function parseTransitionValue(value: string): Record<string, string> | undefined {
  // Handle global keywords first
  if (KEYWORD.test(value.trim())) {
    return {
      "transition-property": value.trim(),
      "transition-duration": value.trim(),
      "transition-timing-function": value.trim(),
      "transition-delay": value.trim(),
    };
  }

  // Check for multi-layer syntax
  if (needsAdvancedParser(value)) {
    const layeredResult = parseTransitionLayers(value);
    if (layeredResult) {
      return reconstructLayers(layeredResult.layers);
    }
    return undefined; // Advanced parsing failed
  }

  // Simple single-layer fallback parser
  const result: Record<string, string> = {};
  const tokens = value.trim().split(/\s+/);
  let timeCount = 0; // Track first vs second time value

  for (const token of tokens) {
    // Handle time values first (duration and delay) - CSS allows flexible ordering
    if (isTime(token) || token.startsWith("var(")) {
      if (timeCount === 0) {
        result["transition-duration"] = token;
      } else if (timeCount === 1) {
        result["transition-delay"] = token;
      } else {
        // More than 2 time values is invalid
        return undefined;
      }
      timeCount++;
      continue;
    }

    // Handle timing functions
    if (!result["transition-timing-function"] && isTimingFunction(token)) {
      result["transition-timing-function"] = token;
      continue;
    }

    // Handle transition-property (none, all, or CSS property names)
    // Only if we haven't set it yet, and it's not a timing function
    if (!result["transition-property"]) {
      if (PROPERTY_KEYWORD.test(token)) {
        result["transition-property"] = token;
        continue;
      }
      // Check if it looks like a CSS property name (not a timing function)
      // Allow vendor-prefixed properties starting with hyphen
      if (/^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(token) && !isTimingFunction(token)) {
        result["transition-property"] = token;
        continue;
      }
    }

    // If token doesn't match any category, it's invalid
    return undefined;
  }

  // Accept single-token property values - they will expand to defaults

  // Build final result with defaults
  return {
    "transition-property": result["transition-property"] || "all",
    "transition-duration": result["transition-duration"] || "0s",
    "transition-timing-function": result["transition-timing-function"] || "ease",
    "transition-delay": result["transition-delay"] || "0s",
  };
}

/**
 * Property handler for the 'transition' CSS shorthand property
 *
 * Expands transition into transition-property, transition-duration,
 * transition-timing-function, and transition-delay.
 *
 * @example
 * ```typescript
 * transitionHandler.expand('opacity 300ms ease-in');
 * transitionHandler.expand('all 1s');
 * ```
 */
export const transitionHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "transition",
    longhands: [
      "transition-property",
      "transition-duration",
      "transition-timing-function",
      "transition-delay",
    ],
    defaults: {
      "transition-property": "all",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    },
    category: "animation",
  },

  expand: (value: string): Record<string, string> | undefined => {
    return parseTransitionValue(value);
  },

  validate: (value: string): boolean => {
    return transitionHandler.expand(value) !== undefined;
  },
});

export default function transition(value: string): Record<string, string> | undefined {
  return transitionHandler.expand(value);
}
