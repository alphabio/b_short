// b_path:: src/internal/normalize-color.ts
import { hslaRegex, hslRegex, rgbaRegex, rgbRegex } from "./color-utils";

const FUNCTIONS = [hslaRegex(), hslRegex(), rgbRegex(), rgbaRegex()];

export default function normalizeColor(value: string): string {
  return FUNCTIONS.reduce((acc: string, func: RegExp) => {
    return acc.replace(func, (match: string) => {
      // Normalize both modern (space-separated) and legacy (comma-separated) syntax
      // Convert space-separated to comma-separated for consistent handling
      return match
        .replace(/\(\s+/g, "(") // Remove space after opening paren
        .replace(/\s+\)/g, ")") // Remove space before closing paren
        .replace(/\s*,\s*/g, ",") // Normalize commas (remove spaces around them)
        .replace(/\s*\/\s*/g, "/") // Normalize slash (remove spaces around it)
        .replace(/\s+/g, ","); // Convert remaining spaces (separators) to commas
    });
  }, value);
}
