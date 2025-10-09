// b_path:: src/mask.ts

import { needsAdvancedParser, parseMaskLayers, reconstructLayers } from "./mask-layers";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;

export default function mask(value: string): Record<string, string> | undefined {
  // Trim the input value
  const trimmedValue = value.trim();

  // Handle global keywords first
  if (KEYWORD.test(trimmedValue)) {
    return {
      "mask-image": trimmedValue,
      "mask-mode": trimmedValue,
      "mask-position": trimmedValue,
      "mask-size": trimmedValue,
      "mask-repeat": trimmedValue,
      "mask-origin": trimmedValue,
      "mask-clip": trimmedValue,
      "mask-composite": trimmedValue,
    };
  }

  // Check for multi-layer syntax
  if (needsAdvancedParser(trimmedValue)) {
    const result = parseMaskLayers(trimmedValue);
    if (result) {
      return reconstructLayers(result.layers);
    }
    return undefined;
  }

  // For single-layer cases, use the advanced parser as well
  // since mask syntax is complex and the parser handles it well
  const result = parseMaskLayers(trimmedValue);
  if (result) {
    return reconstructLayers(result.layers);
  }

  return undefined;
}
