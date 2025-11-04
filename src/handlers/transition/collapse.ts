// b_path:: src/handlers/transition/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import { collapseSingleLayer } from "./collapse-layer";
import { parseTransitionProperties } from "./collapse-parser";

/**
 * Collapse handler for the transition shorthand property.
 *
 * Reconstructs `transition` from its 4 longhand properties.
 *
 * Rules:
 * - Supports multi-layer transitions (comma-separated)
 * - Order: property duration timing-function delay
 * - Default values are omitted where possible
 * - Duration is most commonly specified
 */
export const transitionCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "transition",
    longhands: [
      "transition-property",
      "transition-duration",
      "transition-timing-function",
      "transition-delay",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Parse longhands into layer structure
    const { layers } = parseTransitionProperties(properties);

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
    // Need at least one transition property
    return !!(
      properties["transition-property"] ||
      properties["transition-duration"] ||
      properties["transition-timing-function"] ||
      properties["transition-delay"]
    );
  },
});
