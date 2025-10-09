// b_path:: src/text-decoration.ts
import isColor from "./is-color";
import isLength from "./is-length";
import normalizeColor from "./normalize-color";

const KEYWORD = /^(inherit|initial|unset|revert)$/i;
const LINE = /^(none|underline|overline|line-through|blink|spelling-error|grammar-error)$/i;
const STYLE = /^(solid|double|dotted|dashed|wavy)$/i;
const THICKNESS = /^(auto|from-font)$/i;

export default function textDecoration(value: string): Record<string, string> | undefined {
  const values = normalizeColor(value).split(/\s+/);

  if (values.length === 1 && KEYWORD.test(values[0])) {
    return {
      "text-decoration-line": values[0],
      "text-decoration-style": values[0],
      "text-decoration-color": values[0],
      "text-decoration-thickness": values[0],
    };
  }

  const result: Record<string, string> = {};
  const lines: string[] = [];

  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (LINE.test(v)) {
      lines.push(v);
    } else if (STYLE.test(v)) {
      if (result["text-decoration-style"]) return;
      result["text-decoration-style"] = v;
    } else if (isColor(v)) {
      if (result["text-decoration-color"]) return;
      result["text-decoration-color"] = v;
    } else if (THICKNESS.test(v) || isLength(v)) {
      if (result["text-decoration-thickness"]) return;
      result["text-decoration-thickness"] = v;
    } else {
      return;
    }
  }

  if (lines.length > 1 && lines.includes("none")) return;

  if (lines.length > 0) {
    if (lines.length !== new Set(lines).size) return; // Duplicate lines
    result["text-decoration-line"] = lines.join(" ");
  }

  return result;
}
