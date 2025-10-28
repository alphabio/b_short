// b_path:: src/outline.ts
import { sortProperties } from "./index";
import isColor from "./is-color";
import isLength from "./is-length";
import normalizeColor from "./normalize-color";

const WIDTH = /^(thin|medium|thick)$/;
const STYLE = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i;
const KEYWORD = /^(inherit|initial|unset|revert)$/i;

export default function outline(value: string): Record<string, string> | undefined {
  const values = normalizeColor(value).split(/\s+/);

  if (values.length > 3) return;
  if (values.length === 1 && KEYWORD.test(values[0])) {
    return sortProperties({
      "outline-width": values[0],
      "outline-style": values[0],
      "outline-color": values[0],
    });
  }

  const parsed: { width?: string; style?: string; color?: string } = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (isLength(v) || WIDTH.test(v)) {
      if (parsed.width) return;
      parsed.width = v;
    } else if (STYLE.test(v)) {
      if (parsed.style) return;
      parsed.style = v;
    } else if (isColor(v)) {
      if (parsed.color) return;
      parsed.color = v;
    } else {
      return;
    }
  }

  // CSS spec: outline shorthand always sets width, style, and color
  // Use defaults for missing properties
  return sortProperties({
    "outline-width": parsed.width || "medium",
    "outline-style": parsed.style || "none",
    "outline-color": parsed.color || "currentcolor",
  });
}
