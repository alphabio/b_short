// b_path:: src/handlers/animation/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import { collapseSingleLayer } from "./collapse-layer";
import { parseAnimationProperties } from "./collapse-parser";

/**
 * Collapse handler for the animation shorthand property.
 *
 * Reconstructs `animation` from its 8 longhand properties.
 *
 * Rules:
 * - Supports multi-layer animations (comma-separated)
 * - Order is flexible per spec, but we use: name duration timing-function delay iteration-count direction fill-mode play-state
 * - Two time values: first is duration, second is delay
 * - Default values are omitted where possible
 */
export const animationCollapser: CollapseHandler = createCollapseHandler({
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
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Parse longhands into layer structure
    const { layers } = parseAnimationProperties(properties);

    // Need at least one layer
    if (layers.length === 0) {
      return undefined;
    }

    // Collapse each layer
    const layerStrings: string[] = [];

    for (const layer of layers) {
      const collapsed = collapseSingleLayer(layer);
      if (collapsed) {
        layerStrings.push(collapsed);
      }
    }

    // If no layers collapsed, return undefined
    if (layerStrings.length === 0) {
      return undefined;
    }

    // Join layers with comma separator
    return layerStrings.join(", ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Need at least one animation property
    return !!(
      properties["animation-name"] ||
      properties["animation-duration"] ||
      properties["animation-timing-function"] ||
      properties["animation-delay"] ||
      properties["animation-iteration-count"] ||
      properties["animation-direction"] ||
      properties["animation-fill-mode"] ||
      properties["animation-play-state"]
    );
  },
});
