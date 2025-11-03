// b_path:: src/handlers/transition/collapse-layer.ts

import type { TransitionLayer } from "@/core/schema";
import { isDefault } from "./collapse-constants";

/**
 * Collapses a single transition layer into shorthand notation.
 *
 * Rules:
 * - Order: property duration timing-function delay
 * - Duration is required (or defaults to 0s)
 * - Default values can be omitted if all other values after are also defaults
 * - Property must be first if present
 */
export function collapseSingleLayer(layer: TransitionLayer): string | undefined {
  const parts: string[] = [];

  // Property (optional, but goes first if present)
  const hasNonDefaultProperty = layer.property && !isDefault("property", layer.property);
  const hasNonDefaultDuration = layer.duration && !isDefault("duration", layer.duration);
  const hasNonDefaultTimingFunction =
    layer.timingFunction && !isDefault("timingFunction", layer.timingFunction);
  const hasNonDefaultDelay = layer.delay && !isDefault("delay", layer.delay);

  // Need at least one non-default value
  if (
    !hasNonDefaultProperty &&
    !hasNonDefaultDuration &&
    !hasNonDefaultTimingFunction &&
    !hasNonDefaultDelay
  ) {
    return undefined;
  }

  // Add property if not default
  if (hasNonDefaultProperty) {
    parts.push(layer.property!);
  }

  // Add duration if not default
  if (hasNonDefaultDuration) {
    parts.push(layer.duration!);
  }

  // Add timing function if not default
  if (hasNonDefaultTimingFunction) {
    parts.push(layer.timingFunction!);
  }

  // Add delay if not default
  if (hasNonDefaultDelay) {
    parts.push(layer.delay!);
  }

  return parts.join(" ");
}
