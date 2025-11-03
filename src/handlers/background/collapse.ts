// b_path:: src/handlers/background/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import { BACKGROUND_DEFAULTS } from "./collapse-constants";
import { collapseSingleLayer } from "./collapse-layer";
import { parseBackgroundProperties } from "./collapse-parser";

/**
 * Collapse handler for the background shorthand property.
 *
 * Reconstructs `background` from its 8 longhand properties + color.
 *
 * Rules:
 * - Supports multi-layer backgrounds (comma-separated)
 * - background-color only appears in final layer
 * - Default values are omitted where possible
 * - Special handling for position/size (size needs / separator)
 * - origin and clip can share a value if identical
 */
export const backgroundCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "background",
    longhands: [
      "background-image",
      "background-position",
      "background-size",
      "background-repeat",
      "background-attachment",
      "background-origin",
      "background-clip",
      "background-color",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Parse longhands into layer structure
    const { layers, color } = parseBackgroundProperties(properties);

    // Need at least one layer or color
    if (layers.length === 0 && !color) {
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

    // If no layers collapsed and color is default, return undefined
    if (layerStrings.length === 0 && (!color || color === BACKGROUND_DEFAULTS.color)) {
      return undefined;
    }

    // Add color to final layer if not default
    if (color && color !== BACKGROUND_DEFAULTS.color) {
      if (layerStrings.length > 0) {
        // Append to last layer
        layerStrings[layerStrings.length - 1] += ` ${color}`;
      } else {
        // Color only
        return color;
      }
    }

    // If still no output, return undefined
    if (layerStrings.length === 0) {
      return undefined;
    }

    // Join layers with comma separator
    return layerStrings.join(", ");
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Need at least one background property
    return !!(
      properties["background-image"] ||
      properties["background-position"] ||
      properties["background-size"] ||
      properties["background-repeat"] ||
      properties["background-attachment"] ||
      properties["background-origin"] ||
      properties["background-clip"] ||
      properties["background-color"]
    );
  },
});
