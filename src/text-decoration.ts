// b_path:: src/text-decoration.ts
import { sortProperties } from "./index";
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
    return sortProperties({
      "text-decoration-line": values[0],
      "text-decoration-style": values[0],
      "text-decoration-color": values[0],
      "text-decoration-thickness": values[0],
    });
  }

  // Initialize with defaults - text-decoration shorthand resets all properties
  const result: Record<string, string> = {
    "text-decoration-line": "none",
    "text-decoration-style": "solid",
    "text-decoration-color": "currentColor",
    "text-decoration-thickness": "auto",
  };

  const lines: string[] = [];
  let hasStyle = false;
  let hasColor = false;
  let hasThickness = false;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (LINE.test(v)) {
      lines.push(v);
    } else if (STYLE.test(v)) {
      if (hasStyle) return; // Duplicate style
      result["text-decoration-style"] = v;
      hasStyle = true;
    } else if (isColor(v)) {
      if (hasColor) return; // Duplicate color
      result["text-decoration-color"] = v;
      hasColor = true;
    } else if (THICKNESS.test(v) || isLength(v)) {
      if (hasThickness) return; // Duplicate thickness
      result["text-decoration-thickness"] = v;
      hasThickness = true;
    } else {
      return;
    }
  }

  if (lines.length > 1 && lines.includes("none")) return;

  if (lines.length > 0) {
    if (lines.length !== new Set(lines).size) return; // Duplicate lines
    result["text-decoration-line"] = lines.join(" ");
  }

  return sortProperties(result);
}
