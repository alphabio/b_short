// b_path:: src/column-rule.ts
import isColor from "./is-color";
import isLength from "./is-length";
import normalizeColor from "./normalize-color";

const WIDTH = /^(thin|medium|thick)$/;
const STYLE = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i;
const KEYWORD = /^(inherit|initial|unset|revert)$/i;

export default function columnRule(value: string): Record<string, string> | undefined {
  const values = normalizeColor(value).split(/\s+/);

  if (values.length > 3) return;
  if (values.length === 1 && KEYWORD.test(values[0])) {
    return {
      "column-rule-width": values[0],
      "column-rule-style": values[0],
      "column-rule-color": values[0],
    };
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (isLength(v) || WIDTH.test(v)) {
      if (result["column-rule-width"]) return;
      result["column-rule-width"] = v;
    } else if (STYLE.test(v)) {
      if (result["column-rule-style"]) return;
      result["column-rule-style"] = v;
    } else if (isColor(v)) {
      if (result["column-rule-color"]) return;
      result["column-rule-color"] = v;
    } else {
      return;
    }
  }

  return result;
}
