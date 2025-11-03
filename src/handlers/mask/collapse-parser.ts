// b_path:: src/handlers/mask/collapse-parser.ts

import type { MaskLayer } from "@/core/schema";

/**
 * Parses mask longhand properties into layer structure.
 * Properties with multiple comma-separated values are split into layers.
 */
export function parseMaskProperties(properties: Record<string, string>): {
  layers: MaskLayer[];
} {
  // Get all layer properties
  const image = properties["mask-image"];
  const mode = properties["mask-mode"];
  const position = properties["mask-position"];
  const size = properties["mask-size"];
  const repeat = properties["mask-repeat"];
  const origin = properties["mask-origin"];
  const clip = properties["mask-clip"];
  const composite = properties["mask-composite"];

  // If no properties, return empty
  if (!image && !mode && !position && !size && !repeat && !origin && !clip && !composite) {
    return { layers: [] };
  }

  // Split each property by commas to get layers
  const imageLayers = splitLayers(image);
  const modeLayers = splitLayers(mode);
  const positionLayers = splitLayers(position);
  const sizeLayers = splitLayers(size);
  const repeatLayers = splitLayers(repeat);
  const originLayers = splitLayers(origin);
  const clipLayers = splitLayers(clip);
  const compositeLayers = splitLayers(composite);

  // Number of layers is the maximum of all properties
  const layerCount = Math.max(
    imageLayers.length,
    modeLayers.length,
    positionLayers.length,
    sizeLayers.length,
    repeatLayers.length,
    originLayers.length,
    clipLayers.length,
    compositeLayers.length
  );

  // Build layer objects
  const layers: MaskLayer[] = [];
  for (let i = 0; i < layerCount; i++) {
    const layer: MaskLayer = {};

    if (imageLayers[i]) layer.image = imageLayers[i];
    if (modeLayers[i]) layer.mode = modeLayers[i];
    if (positionLayers[i]) layer.position = positionLayers[i];
    if (sizeLayers[i]) layer.size = sizeLayers[i];
    if (repeatLayers[i]) layer.repeat = repeatLayers[i];
    if (originLayers[i]) layer.origin = originLayers[i];
    if (clipLayers[i]) layer.clip = clipLayers[i];
    if (compositeLayers[i]) layer.composite = compositeLayers[i];

    layers.push(layer);
  }

  return { layers };
}

/**
 * Splits a property value by commas, handling nested functions.
 * Returns empty array if value is undefined.
 */
function splitLayers(value: string | undefined): string[] {
  if (!value) return [];

  const layers: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    layers.push(current.trim());
  }

  return layers;
}
