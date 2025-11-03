// b_path:: src/handlers/animation/collapse-constants.ts

/**
 * Default values for animation properties per CSS specification.
 */
export const ANIMATION_DEFAULTS = {
  name: "none",
  duration: "0s",
  timingFunction: "ease",
  delay: "0s",
  iterationCount: "1",
  direction: "normal",
  fillMode: "none",
  playState: "running",
} as const;

/**
 * Checks if a value is the default for a given property
 */
export function isDefault(property: keyof typeof ANIMATION_DEFAULTS, value: string): boolean {
  return ANIMATION_DEFAULTS[property] === value;
}

/**
 * Checks if all properties in a layer are at their defaults
 */
export function isDefaultLayer(layer: {
  name?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
  playState?: string;
}): boolean {
  return (
    (!layer.name || isDefault("name", layer.name)) &&
    (!layer.duration || isDefault("duration", layer.duration)) &&
    (!layer.timingFunction || isDefault("timingFunction", layer.timingFunction)) &&
    (!layer.delay || isDefault("delay", layer.delay)) &&
    (!layer.iterationCount || isDefault("iterationCount", layer.iterationCount)) &&
    (!layer.direction || isDefault("direction", layer.direction)) &&
    (!layer.fillMode || isDefault("fillMode", layer.fillMode)) &&
    (!layer.playState || isDefault("playState", layer.playState))
  );
}
