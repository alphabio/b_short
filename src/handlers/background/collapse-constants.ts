// b_path:: src/handlers/background/collapse-constants.ts

/**
 * Default values for background properties per CSS specification.
 * These values can be omitted when collapsing.
 */
export const BACKGROUND_DEFAULTS = {
  image: "none",
  position: "0% 0%",
  size: "auto auto",
  repeat: "repeat",
  attachment: "scroll",
  origin: "padding-box",
  clip: "border-box",
  color: "transparent",
} as const;

/**
 * Checks if a value is the default for a given property
 */
export function isDefault(property: keyof typeof BACKGROUND_DEFAULTS, value: string): boolean {
  return BACKGROUND_DEFAULTS[property] === value;
}

/**
 * Checks if all properties in a layer are at their defaults
 */
export function isDefaultLayer(layer: {
  image?: string;
  position?: string;
  size?: string;
  repeat?: string;
  attachment?: string;
  origin?: string;
  clip?: string;
}): boolean {
  return (
    (!layer.image || isDefault("image", layer.image)) &&
    (!layer.position || isDefault("position", layer.position)) &&
    (!layer.size || isDefault("size", layer.size)) &&
    (!layer.repeat || isDefault("repeat", layer.repeat)) &&
    (!layer.attachment || isDefault("attachment", layer.attachment)) &&
    (!layer.origin || isDefault("origin", layer.origin)) &&
    (!layer.clip || isDefault("clip", layer.clip))
  );
}
