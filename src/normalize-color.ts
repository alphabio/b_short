// b_path:: src/normalize-color.ts
import { hslaRegex, hslRegex, rgbaRegex, rgbRegex } from "./color-utils";

const FUNCTIONS = [hslaRegex(), hslRegex(), rgbRegex(), rgbaRegex()];

export default function normalizeColor(value: string): string {
  return FUNCTIONS.reduce(
    (acc: string, func: RegExp) => acc.replace(func, (match: string) => match.replace(/\s+/g, "")),
    value
  );
}
