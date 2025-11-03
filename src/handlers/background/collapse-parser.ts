// b_path:: src/handlers/background/collapse-parser.ts

import type { BackgroundLayer } from "@/core/schema";

/**
 * Parses background longhand properties into layer structure.
 * Properties with multiple comma-separated values are split into layers.
 */
export function parseBackgroundProperties(properties: Record<string, string>): {
  layers: BackgroundLayer[];
  color?: string;
} {
  const color = properties["background-color"];

  // Get all layer properties
  const image = properties["background-image"];
  const position = properties["background-position"];
  const size = properties["background-size"];
  const repeat = properties["background-repeat"];
  const attachment = properties["background-attachment"];
  const origin = properties["background-origin"];
  const clip = properties["background-clip"];

  // If no properties, return empty
  if (!image && !position && !size && !repeat && !attachment && !origin && !clip) {
    return { layers: [], color };
  }

  // Split each property by commas to get layers
  const imageLayers = splitLayers(image);
  const positionLayers = splitLayers(position);
  const sizeLayers = splitLayers(size);
  const repeatLayers = splitLayers(repeat);
  const attachmentLayers = splitLayers(attachment);
  const originLayers = splitLayers(origin);
  const clipLayers = splitLayers(clip);

  // Number of layers is the maximum of all properties
  const layerCount = Math.max(
    imageLayers.length,
    positionLayers.length,
    sizeLayers.length,
    repeatLayers.length,
    attachmentLayers.length,
    originLayers.length,
    clipLayers.length
  );

  // Build layer objects
  const layers: BackgroundLayer[] = [];
  for (let i = 0; i < layerCount; i++) {
    const layer: BackgroundLayer = {};

    if (imageLayers[i]) layer.image = imageLayers[i];
    if (positionLayers[i]) layer.position = positionLayers[i];
    if (sizeLayers[i]) layer.size = sizeLayers[i];
    if (repeatLayers[i]) layer.repeat = repeatLayers[i];
    if (attachmentLayers[i]) layer.attachment = attachmentLayers[i];
    if (originLayers[i]) layer.origin = originLayers[i];
    if (clipLayers[i]) layer.clip = clipLayers[i];

    layers.push(layer);
  }

  return { layers, color };
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
