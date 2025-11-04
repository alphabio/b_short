// b_path:: src/handlers/transition/collapse-constants.ts

/**
 * Default values for transition properties per CSS specification.
 */
export const TRANSITION_DEFAULTS = {
  property: "all",
  duration: "0s",
  timingFunction: "ease",
  delay: "0s",
} as const;

/**
 * Checks if a value is the default for a given property
 */
export function isDefault(property: keyof typeof TRANSITION_DEFAULTS, value: string): boolean {
  return TRANSITION_DEFAULTS[property] === value;
}

/**
 * Checks if all properties in a layer are at their defaults
 */
export function isDefaultLayer(layer: {
  property?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
}): boolean {
  return (
    (!layer.property || isDefault("property", layer.property)) &&
    (!layer.duration || isDefault("duration", layer.duration)) &&
    (!layer.timingFunction || isDefault("timingFunction", layer.timingFunction)) &&
    (!layer.delay || isDefault("delay", layer.delay))
  );
}
