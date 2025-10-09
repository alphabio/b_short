// b_path:: src/is-color.ts
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

export default function isColor(value: string): boolean {
  value = value.toLowerCase();

  // Support CSS custom property (var name)
  if (/^var\(\s*--[a-zA-Z0-9-_]+\s*\)$/.test(value)) {
    return true;
  }

  return (
    !!CSS_COLOR_NAMES[value] ||
    value === "currentcolor" ||
    value === "transparent" ||
    HEX.test(value) ||
    HSLA.test(value) ||
    HSL.test(value) ||
    RGB.test(value) ||
    RGBA.test(value)
  );
}
