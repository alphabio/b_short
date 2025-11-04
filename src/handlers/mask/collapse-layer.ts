// b_path:: src/handlers/mask/collapse-layer.ts

import type { MaskLayer } from "@/core/schema";
import { isDefault, MASK_DEFAULTS } from "./collapse-constants";

/**
 * Collapses a single mask layer into shorthand notation.
 *
 * Rules:
 * - Default values can be omitted
 * - Size must follow position with / separator
 * - Order matters for some properties
 * - Empty layers return undefined
 */
export function collapseSingleLayer(layer: MaskLayer): string | undefined {
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
    const position = layer.position || MASK_DEFAULTS.position;
    const positionPart = hasNonDefaultSize ? `${position} / ${layer.size}` : position;
    parts.push(positionPart);
  }

  // Add repeat if not default
  if (layer.repeat && !isDefault("repeat", layer.repeat)) {
    parts.push(layer.repeat);
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
    parts.push(MASK_DEFAULTS.origin);
    parts.push(layer.clip!);
  }

  // Add mode if not default
  if (layer.mode && !isDefault("mode", layer.mode)) {
    parts.push(layer.mode);
  }

  // Add composite if not default
  if (layer.composite && !isDefault("composite", layer.composite)) {
    parts.push(layer.composite);
  }

  // If nothing was added, return undefined (all defaults)
  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(" ");
}
