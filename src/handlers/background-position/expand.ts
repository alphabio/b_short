// b_path:: src/handlers/background-position/expand.ts

import { splitLayers } from "../../internal/layer-parser-utils";
import { parsePosition } from "../../internal/position-parser";

/**
 * Expand background-position shorthand to longhand properties
 *
 * background-position → background-position-x, background-position-y
 *
 * Handles both single and multi-layer values:
 * - "center" → { x: "center", y: "center" }
 * - "center, left top" → { x: "center, left", y: "center, top" }
 */
export function expandBackgroundPosition(value: string): Record<string, string> {
  // Check if we have multiple layers (comma-separated)
  const layers = splitLayers(value);

  if (layers.length === 1) {
    // Single layer - simple case
    const { x, y } = parsePosition(value);
    return {
      "background-position-x": x,
      "background-position-y": y,
    };
  }

  // Multi-layer - expand each layer and rejoin
  const xValues: string[] = [];
  const yValues: string[] = [];

  for (const layer of layers) {
    const { x, y } = parsePosition(layer);
    xValues.push(x);
    yValues.push(y);
  }

  return {
    "background-position-x": xValues.join(", "),
    "background-position-y": yValues.join(", "),
  };
}
