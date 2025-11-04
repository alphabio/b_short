// b_path:: src/handlers/animation/collapse-parser.ts

import type { AnimationLayer } from "@/core/schema";

/**
 * Parses animation longhand properties into layer structure.
 * Properties with multiple comma-separated values are split into layers.
 */
export function parseAnimationProperties(properties: Record<string, string>): {
  layers: AnimationLayer[];
} {
  const name = properties["animation-name"];
  const duration = properties["animation-duration"];
  const timingFunction = properties["animation-timing-function"];
  const delay = properties["animation-delay"];
  const iterationCount = properties["animation-iteration-count"];
  const direction = properties["animation-direction"];
  const fillMode = properties["animation-fill-mode"];
  const playState = properties["animation-play-state"];

  // If no properties, return empty
  if (
    !name &&
    !duration &&
    !timingFunction &&
    !delay &&
    !iterationCount &&
    !direction &&
    !fillMode &&
    !playState
  ) {
    return { layers: [] };
  }

  // Split each property by commas to get layers
  const nameLayers = splitLayers(name);
  const durationLayers = splitLayers(duration);
  const timingFunctionLayers = splitLayers(timingFunction);
  const delayLayers = splitLayers(delay);
  const iterationCountLayers = splitLayers(iterationCount);
  const directionLayers = splitLayers(direction);
  const fillModeLayers = splitLayers(fillMode);
  const playStateLayers = splitLayers(playState);

  // Number of layers is the maximum of all properties
  const layerCount = Math.max(
    nameLayers.length,
    durationLayers.length,
    timingFunctionLayers.length,
    delayLayers.length,
    iterationCountLayers.length,
    directionLayers.length,
    fillModeLayers.length,
    playStateLayers.length
  );

  // Build layer objects
  const layers: AnimationLayer[] = [];
  for (let i = 0; i < layerCount; i++) {
    const layer: AnimationLayer = {};

    if (nameLayers[i]) layer.name = nameLayers[i];
    if (durationLayers[i]) layer.duration = durationLayers[i];
    if (timingFunctionLayers[i]) layer.timingFunction = timingFunctionLayers[i];
    if (delayLayers[i]) layer.delay = delayLayers[i];
    if (iterationCountLayers[i]) layer.iterationCount = iterationCountLayers[i];
    if (directionLayers[i]) layer.direction = directionLayers[i];
    if (fillModeLayers[i]) layer.fillMode = fillModeLayers[i];
    if (playStateLayers[i]) layer.playState = playStateLayers[i];

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
