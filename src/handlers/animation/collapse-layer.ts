// b_path:: src/handlers/animation/collapse-layer.ts

import type { AnimationLayer } from "@/core/schema";
import { isDefault } from "./collapse-constants";

/**
 * Collapses a single animation layer into shorthand notation.
 *
 * Rules per CSS spec:
 * - Order is flexible (|| in grammar)
 * - Two time values: first is duration, second is delay
 * - Name should come first or last for clarity
 * - Default values can be omitted
 *
 * We use a sensible order: name duration timing-function delay iteration-count direction fill-mode play-state
 */
export function collapseSingleLayer(layer: AnimationLayer): string | undefined {
  const parts: string[] = [];

  // Check which values are non-default
  const hasNonDefaultName = layer.name && !isDefault("name", layer.name);
  const hasNonDefaultDuration = layer.duration && !isDefault("duration", layer.duration);
  const hasNonDefaultTimingFunction =
    layer.timingFunction && !isDefault("timingFunction", layer.timingFunction);
  const hasNonDefaultDelay = layer.delay && !isDefault("delay", layer.delay);
  const hasNonDefaultIterationCount =
    layer.iterationCount && !isDefault("iterationCount", layer.iterationCount);
  const hasNonDefaultDirection = layer.direction && !isDefault("direction", layer.direction);
  const hasNonDefaultFillMode = layer.fillMode && !isDefault("fillMode", layer.fillMode);
  const hasNonDefaultPlayState = layer.playState && !isDefault("playState", layer.playState);

  // Need at least one non-default value
  if (
    !hasNonDefaultName &&
    !hasNonDefaultDuration &&
    !hasNonDefaultTimingFunction &&
    !hasNonDefaultDelay &&
    !hasNonDefaultIterationCount &&
    !hasNonDefaultDirection &&
    !hasNonDefaultFillMode &&
    !hasNonDefaultPlayState
  ) {
    return undefined;
  }

  // Build output in a sensible order
  // Name first (or can be last, but first is clearer)
  if (hasNonDefaultName) {
    parts.push(layer.name!);
  }

  // Duration (first time value)
  if (hasNonDefaultDuration) {
    parts.push(layer.duration!);
  }

  // Timing function
  if (hasNonDefaultTimingFunction) {
    parts.push(layer.timingFunction!);
  }

  // Delay (second time value - must come after duration if both present)
  if (hasNonDefaultDelay) {
    parts.push(layer.delay!);
  }

  // Iteration count
  if (hasNonDefaultIterationCount) {
    parts.push(layer.iterationCount!);
  }

  // Direction
  if (hasNonDefaultDirection) {
    parts.push(layer.direction!);
  }

  // Fill mode
  if (hasNonDefaultFillMode) {
    parts.push(layer.fillMode!);
  }

  // Play state
  if (hasNonDefaultPlayState) {
    parts.push(layer.playState!);
  }

  return parts.join(" ");
}
