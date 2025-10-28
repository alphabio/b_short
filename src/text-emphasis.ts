// b_path:: src/text-emphasis.ts
import { sortProperties } from "./index";
import isColor from "./is-color";
import normalizeColor from "./normalize-color";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const FILL = /^(filled|open)$/i;
const SHAPE = /^(dot|circle|double-circle|triangle|sesame)$/i;
const STRING_VALUE = /^["'].*["']$/;

export default function textEmphasis(value: string): Record<string, string> | undefined {
  const values = normalizeColor(value).split(/\s+/);

  if (values.length === 1 && KEYWORD.test(values[0])) {
    return sortProperties({
      "text-emphasis-style": values[0],
      "text-emphasis-color": values[0],
    });
  }

  const parsed: { style?: string; color?: string } = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (v === "none") {
      if (parsed.style) return;
      parsed.style = v;
    } else if (STRING_VALUE.test(v)) {
      if (parsed.style) return;
      parsed.style = v;
    } else if (FILL.test(v)) {
      if (parsed.style) return;
      if (i + 1 < values.length && SHAPE.test(values[i + 1])) {
        parsed.style = `${v} ${values[i + 1]}`;
        i++;
      } else {
        parsed.style = v;
      }
    } else if (SHAPE.test(v)) {
      if (parsed.style) return;
      if (i + 1 < values.length && FILL.test(values[i + 1])) {
        parsed.style = `${values[i + 1]} ${v}`;
        i++;
      } else {
        parsed.style = v;
      }
    } else if (isColor(v)) {
      if (parsed.color) return;
      parsed.color = v;
    } else {
      return;
    }
  }

  // CSS spec: text-emphasis shorthand always sets style and color
  // Use defaults for missing properties
  return sortProperties({
    "text-emphasis-style": parsed.style || "none",
    "text-emphasis-color": parsed.color || "currentcolor",
  });
}
