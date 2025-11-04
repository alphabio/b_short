// b_path:: src/handlers/mask/collapse-constants.ts

import { MASK_DEFAULTS as MASK_EXPAND_DEFAULTS } from "./mask-layers";

/**
 * Default values for mask properties per CSS specification.
 * These values can be omitted when collapsing.
 */
export const MASK_DEFAULTS = {
  image: MASK_EXPAND_DEFAULTS.image,
  mode: MASK_EXPAND_DEFAULTS.mode,
  position: MASK_EXPAND_DEFAULTS.position,
  size: MASK_EXPAND_DEFAULTS.size,
  repeat: MASK_EXPAND_DEFAULTS.repeat,
  origin: MASK_EXPAND_DEFAULTS.origin,
  clip: MASK_EXPAND_DEFAULTS.clip,
  composite: MASK_EXPAND_DEFAULTS.composite,
} as const;

/**
 * Checks if a value is the default for a given property
 */
export function isDefault(property: keyof typeof MASK_DEFAULTS, value: string): boolean {
  return MASK_DEFAULTS[property] === value;
}

/**
 * Checks if all properties in a layer are at their defaults
 */
export function isDefaultLayer(layer: {
  image?: string;
  mode?: string;
  position?: string;
  size?: string;
  repeat?: string;
  origin?: string;
  clip?: string;
  composite?: string;
}): boolean {
  return (
    (!layer.image || isDefault("image", layer.image)) &&
    (!layer.mode || isDefault("mode", layer.mode)) &&
    (!layer.position || isDefault("position", layer.position)) &&
    (!layer.size || isDefault("size", layer.size)) &&
    (!layer.repeat || isDefault("repeat", layer.repeat)) &&
    (!layer.origin || isDefault("origin", layer.origin)) &&
    (!layer.clip || isDefault("clip", layer.clip)) &&
    (!layer.composite || isDefault("composite", layer.composite))
  );
}
