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

  const result: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (isLength(v) || WIDTH.test(v)) {
      if (result["outline-width"]) return;
      result["outline-width"] = v;
    } else if (STYLE.test(v)) {
      if (result["outline-style"]) return;
      result["outline-style"] = v;
    } else if (isColor(v)) {
      if (result["outline-color"]) return;
      result["outline-color"] = v;
    } else {
      return;
    }
  }

  return sortProperties(result);
}
