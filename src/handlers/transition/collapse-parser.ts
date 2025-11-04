// b_path:: src/handlers/transition/collapse-parser.ts

import type { TransitionLayer } from "@/core/schema";

/**
 * Parses transition longhand properties into layer structure.
 * Properties with multiple comma-separated values are split into layers.
 */
export function parseTransitionProperties(properties: Record<string, string>): {
  layers: TransitionLayer[];
} {
  const property = properties["transition-property"];
  const duration = properties["transition-duration"];
  const timingFunction = properties["transition-timing-function"];
  const delay = properties["transition-delay"];

  // If no properties, return empty
  if (!property && !duration && !timingFunction && !delay) {
    return { layers: [] };
  }

  // Split each property by commas to get layers
  const propertyLayers = splitLayers(property);
  const durationLayers = splitLayers(duration);
  const timingFunctionLayers = splitLayers(timingFunction);
  const delayLayers = splitLayers(delay);

  // Number of layers is the maximum of all properties
  const layerCount = Math.max(
    propertyLayers.length,
    durationLayers.length,
    timingFunctionLayers.length,
    delayLayers.length
  );

  // Build layer objects
  const layers: TransitionLayer[] = [];
  for (let i = 0; i < layerCount; i++) {
    const layer: TransitionLayer = {};

    if (propertyLayers[i]) layer.property = propertyLayers[i];
    if (durationLayers[i]) layer.duration = durationLayers[i];
    if (timingFunctionLayers[i]) layer.timingFunction = timingFunctionLayers[i];
    if (delayLayers[i]) layer.delay = delayLayers[i];

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
