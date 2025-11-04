// b_path:: src/handlers/background/collapse-layer.ts

import type { BackgroundLayer } from "@/core/schema";
import { BACKGROUND_DEFAULTS, isDefault } from "./collapse-constants";

/**
 * Collapses a single background layer into shorthand notation.
 *
 * Rules:
 * - Default values can be omitted
 * - Size must follow position with / separator
 * - Order matters for some properties
 * - Empty layers return undefined
 */
export function collapseSingleLayer(layer: BackgroundLayer): string | undefined {
  const parts: string[] = [];

  // Add image if not default
  if (layer.image && !isDefault("image", layer.image)) {
    parts.push(layer.image);
  }

  // Add position (and size if present)
  const hasNonDefaultPosition = layer.position && !isDefault("position", layer.position);
  const hasNonDefaultSize = layer.size && !isDefault("size", layer.size);

  if (hasNonDefaultPosition || hasNonDefaultSize) {
    // Position/size must be together if either is non-default
    const position = layer.position || BACKGROUND_DEFAULTS.position;
    const positionPart = hasNonDefaultSize ? `${position} / ${layer.size}` : position;
    parts.push(positionPart);
  }

  // Add repeat if not default
  if (layer.repeat && !isDefault("repeat", layer.repeat)) {
    parts.push(layer.repeat);
  }

  // Add attachment if not default
  if (layer.attachment && !isDefault("attachment", layer.attachment)) {
    parts.push(layer.attachment);
  }

  // Add origin/clip (special handling - they can be the same value)
  const hasNonDefaultOrigin = layer.origin && !isDefault("origin", layer.origin);
  const hasNonDefaultClip = layer.clip && !isDefault("clip", layer.clip);

  if (hasNonDefaultOrigin && hasNonDefaultClip) {
    // Both specified - check if same
    if (layer.origin === layer.clip) {
      parts.push(layer.origin!);
    } else {
      parts.push(layer.origin!);
      parts.push(layer.clip!);
    }
  } else if (hasNonDefaultOrigin) {
    parts.push(layer.origin!);
  } else if (hasNonDefaultClip) {
    // Clip alone needs both values
    parts.push(BACKGROUND_DEFAULTS.origin);
    parts.push(layer.clip!);
  }

  // If nothing was added, return undefined (all defaults)
  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(" ");
}
