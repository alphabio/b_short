// b_path:: src/handlers/mask/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import { collapseSingleLayer } from "./collapse-layer";
import { parseMaskProperties } from "./collapse-parser";

/**
 * Collapse handler for the mask shorthand property.
 *
 * Reconstructs `mask` from its 8 longhand properties.
 *
 * Rules:
 * - Supports multi-layer masks (comma-separated)
 * - Default values are omitted where possible
 * - Special handling for position/size (size needs / separator)
 * - origin and clip can share a value if identical
 */
export const maskCollapser: CollapseHandler = createCollapseHandler({
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
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Parse longhands into layer structure
    const { layers } = parseMaskProperties(properties);

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
    // Need at least one mask property
    return !!(
      properties["mask-image"] ||
      properties["mask-mode"] ||
      properties["mask-position"] ||
      properties["mask-size"] ||
      properties["mask-repeat"] ||
      properties["mask-origin"] ||
      properties["mask-clip"] ||
      properties["mask-composite"]
    );
  },
});
