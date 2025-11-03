// b_path:: src/animation.ts

// NOTE: This handler contains complex multi-layer parsing logic that is a candidate
// for future refactoring. The current implementation works correctly but could be
// simplified with better abstractions for timing/iteration/direction parsing.

import {
  ANIMATION_DEFAULTS,
  needsAdvancedParser,
  parseAnimationLayers,
  reconstructLayers,
} from "./animation-layers";
import isTime from "./internal/is-time";
import isTimingFunction from "./internal/is-timing-function";
import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const ITERATION_COUNT = /^(infinite|[0-9]+(\.[0-9]+)?)$/;
const DIRECTION = /^(normal|reverse|alternate|alternate-reverse)$/i;
const FILL_MODE = /^(none|forwards|backwards|both)$/i;
const PLAY_STATE = /^(running|paused)$/i;

function parseAnimationValue(value: string): Record<string, string> | undefined {
  // Handle global keywords first
  if (KEYWORD.test(value.trim())) {
    return {
      "animation-name": value.trim(),
      "animation-duration": value.trim(),
      "animation-timing-function": value.trim(),
      "animation-delay": value.trim(),
      "animation-iteration-count": value.trim(),
      "animation-direction": value.trim(),
      "animation-fill-mode": value.trim(),
      "animation-play-state": value.trim(),
    };
  }

  // Check for multi-layer syntax
  if (needsAdvancedParser(value)) {
    const layeredResult = parseAnimationLayers(value);
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
    // Handle animation name first (can be any identifier including var() or quoted strings)
    if (!result["animation-name"]) {
      if (token === "none") {
        result["animation-name"] = "none";
        continue;
      }
      // Check if it looks like a valid animation name identifier
      // Allow custom identifiers matching pattern, var() functions, quoted strings, but exclude timing functions and other keywords
      if (
        (/^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(token) ||
          token.startsWith("var(") ||
          (token.startsWith('"') && token.endsWith('"')) ||
          (token.startsWith("'") && token.endsWith("'"))) &&
        !isTimingFunction(token) &&
        !DIRECTION.test(token) &&
        !FILL_MODE.test(token) &&
        !PLAY_STATE.test(token) &&
        !ITERATION_COUNT.test(token)
      ) {
        result["animation-name"] = token;
        continue;
      }
    }

    // Handle time values (duration and delay) - CSS allows flexible ordering
    if (isTime(token)) {
      if (timeCount === 0) {
        result["animation-duration"] = token;
      } else if (timeCount === 1) {
        result["animation-delay"] = token;
      } else {
        // More than 2 time values is invalid
        return undefined;
      }
      timeCount++;
      continue;
    }

    // Handle timing functions
    if (!result["animation-timing-function"] && isTimingFunction(token)) {
      result["animation-timing-function"] = token;
      continue;
    }

    // Handle iteration count
    if (!result["animation-iteration-count"] && ITERATION_COUNT.test(token)) {
      result["animation-iteration-count"] = token;
      continue;
    }

    // Handle direction keywords
    if (!result["animation-direction"] && DIRECTION.test(token)) {
      result["animation-direction"] = token;
      continue;
    }

    // Handle fill mode keywords
    if (!result["animation-fill-mode"] && FILL_MODE.test(token)) {
      result["animation-fill-mode"] = token;
      continue;
    }

    // Handle play state keywords
    if (!result["animation-play-state"] && PLAY_STATE.test(token)) {
      result["animation-play-state"] = token;
      continue;
    }

    // If token doesn't match any category, it's invalid
    return undefined;
  }

  // Accept single-token property values - they will expand to defaults

  // Build final result with defaults
  return {
    "animation-name": result["animation-name"] || ANIMATION_DEFAULTS.name,
    "animation-duration": result["animation-duration"] || ANIMATION_DEFAULTS.duration,
    "animation-timing-function":
      result["animation-timing-function"] || ANIMATION_DEFAULTS.timingFunction,
    "animation-delay": result["animation-delay"] || ANIMATION_DEFAULTS.delay,
    "animation-iteration-count":
      result["animation-iteration-count"] || ANIMATION_DEFAULTS.iterationCount,
    "animation-direction": result["animation-direction"] || ANIMATION_DEFAULTS.direction,
    "animation-fill-mode": result["animation-fill-mode"] || ANIMATION_DEFAULTS.fillMode,
    "animation-play-state": result["animation-play-state"] || ANIMATION_DEFAULTS.playState,
  };
}

/**
 * Property handler for the 'animation' CSS shorthand property
 *
 * Expands animation into animation-name, animation-duration, animation-timing-function,
 * animation-delay, animation-iteration-count, animation-direction, animation-fill-mode,
 * and animation-play-state.
 *
 * @example
 * ```typescript
 * animationHandler.expand('slide 300ms ease-in');
 * animationHandler.expand('bounce 1s infinite');
 * ```
 */
export const animationHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "animation",
    longhands: [
      "animation-name",
      "animation-duration",
      "animation-timing-function",
      "animation-delay",
      "animation-iteration-count",
      "animation-direction",
      "animation-fill-mode",
      "animation-play-state",
    ],
    defaults: {
      "animation-name": ANIMATION_DEFAULTS.name,
      "animation-duration": ANIMATION_DEFAULTS.duration,
      "animation-timing-function": ANIMATION_DEFAULTS.timingFunction,
      "animation-delay": ANIMATION_DEFAULTS.delay,
      "animation-iteration-count": ANIMATION_DEFAULTS.iterationCount,
      "animation-direction": ANIMATION_DEFAULTS.direction,
      "animation-fill-mode": ANIMATION_DEFAULTS.fillMode,
      "animation-play-state": ANIMATION_DEFAULTS.playState,
    },
    category: "animation",
  },

  expand: (value: string): Record<string, string> | undefined => {
    return parseAnimationValue(value);
  },

  validate: (value: string): boolean => {
    return animationHandler.expand(value) !== undefined;
  },
});

export default function animation(value: string): Record<string, string> | undefined {
  return animationHandler.expand(value);
}
