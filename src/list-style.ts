// b_path:: src/list-style.ts
import { cssUrlRegex } from "./color-utils";
import { sortProperties } from "./index";
import normalizeColor from "./normalize-color";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const POSITION = /^(inside|outside)$/i;
const IMAGE = new RegExp(`^(${cssUrlRegex().source})$`, "i");
const COMMON_TYPE =
  /^(disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-alpha|lower-latin|upper-alpha|upper-latin|armenian|georgian|none)$/i;
const IDENT = /^[-_a-zA-Z][-_a-zA-Z0-9]*$/;
const STRING_VALUE = /^["'].*["']$/;

export default function listStyle(value: string): Record<string, string> | undefined {
  const normalizedValue = normalizeColor(value);

  // Special case: "none" alone sets both type and image to none
  if (normalizedValue === "none") {
    return sortProperties({
      "list-style-type": "none",
      "list-style-image": "none",
    });
  }

  const values = normalizedValue.split(/\s+/);

  if (values.length === 1 && KEYWORD.test(values[0])) {
    return sortProperties({
      "list-style-type": values[0],
      "list-style-position": values[0],
      "list-style-image": values[0],
    });
  }

  const result: Record<string, string> = {};

  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (POSITION.test(v)) {
      if (result["list-style-position"]) return;
      result["list-style-position"] = v;
    } else if (IMAGE.test(v)) {
      if (result["list-style-image"]) return;
      result["list-style-image"] = v;
    } else if (COMMON_TYPE.test(v)) {
      if (result["list-style-type"]) return;
      result["list-style-type"] = v;
    } else {
      // Custom counter-style identifier or string value
      if (IDENT.test(v) || STRING_VALUE.test(v)) {
        if (result["list-style-type"]) return;
        result["list-style-type"] = v;
      } else {
        return;
      }
    }
  }

  return sortProperties(result);
}
