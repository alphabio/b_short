// b_path:: src/text-emphasis.ts
import isColor from "./is-color";
import normalizeColor from "./normalize-color";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const FILL = /^(filled|open)$/i;
const SHAPE = /^(dot|circle|double-circle|triangle|sesame)$/i;
const STRING_VALUE = /^["'].*["']$/;

export default function textEmphasis(value: string): Record<string, string> | undefined {
  const values = normalizeColor(value).split(/\s+/);

  if (values.length === 1 && KEYWORD.test(values[0])) {
    return {
      "text-emphasis-style": values[0],
      "text-emphasis-color": values[0],
    };
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (v === "none") {
      if (result["text-emphasis-style"]) return;
      result["text-emphasis-style"] = v;
    } else if (STRING_VALUE.test(v)) {
      if (result["text-emphasis-style"]) return;
      result["text-emphasis-style"] = v;
    } else if (FILL.test(v)) {
      if (result["text-emphasis-style"]) return;
      if (i + 1 < values.length && SHAPE.test(values[i + 1])) {
        result["text-emphasis-style"] = `${v} ${values[i + 1]}`;
        i++;
      } else {
        result["text-emphasis-style"] = v;
      }
    } else if (SHAPE.test(v)) {
      if (result["text-emphasis-style"]) return;
      result["text-emphasis-style"] = v;
    } else if (isColor(v)) {
      if (result["text-emphasis-color"]) return;
      result["text-emphasis-color"] = v;
    } else {
      return;
    }
  }

  return result;
}
