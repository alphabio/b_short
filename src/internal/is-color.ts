// b_path:: src/internal/is-color.ts
import {
  CSS_COLOR_NAMES,
  hexColorRegex,
  hslaRegex,
  hslRegex,
  rgbaRegex,
  rgbRegex,
} from "./color-utils";

const HEX = new RegExp(`^${hexColorRegex().source}$`, "i");
const HSLA = hslaRegex({ exact: true });
const HSL = hslRegex({ exact: true });
const RGB = rgbRegex({ exact: true });
const RGBA = rgbaRegex({ exact: true });

/**
 * Cache for color validation results.
 * Improves performance for repeated color checks.
 */
const colorCache = new Map<string, boolean>();
const MAX_CACHE_SIZE = 500;

/**
 * Checks if a string value represents a valid CSS color.
 * Supports named colors, hex, rgb, rgba, hsl, hsla, and CSS custom properties.
 * Results are cached for performance.
 *
 * @param value - The CSS value to check
 * @returns true if the value is a valid color, false otherwise
 *
 * @example
 * isColor('red') // true
 * isColor('#ff0000') // true
 * isColor('rgb(255, 0, 0)') // true
 * isColor('var(--primary-color)') // true
 * isColor('10px') // false
 */
export default function isColor(value: string): boolean {
  // Check cache first
  const cached = colorCache.get(value);
  if (cached !== undefined) return cached;

  const lowerValue = value.toLowerCase();

  // Support CSS custom property (var name)
  if (/^var\(\s*--[a-zA-Z0-9-_]+\s*\)$/.test(lowerValue)) {
    colorCache.set(value, true);
    return true;
  }

  const result =
    !!CSS_COLOR_NAMES[lowerValue] ||
    lowerValue === "currentcolor" ||
    lowerValue === "transparent" ||
    HEX.test(lowerValue) ||
    HSLA.test(lowerValue) ||
    HSL.test(lowerValue) ||
    RGB.test(lowerValue) ||
    RGBA.test(lowerValue);

  // Cache result with size limit
  if (colorCache.size >= MAX_CACHE_SIZE) {
    const firstKey = colorCache.keys().next().value;
    if (firstKey !== undefined) {
      colorCache.delete(firstKey);
    }
  }
  colorCache.set(value, result);

  return result;
}
