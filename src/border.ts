// b_path:: src/border.ts
import directional from "./directional";
import { sortProperties } from "./index";
import isColor from "./is-color";
import isLength from "./is-length";
import normalizeColor from "./normalize-color";

const WIDTH = /^(thin|medium|thick)$/;
const STYLE = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i;
const KEYWORD = /^(inherit|initial|unset|revert)$/i;

interface BorderProperties {
  width?: string;
  style?: string;
  color?: string;
}

interface BorderResult extends BorderProperties {
  boxSizing?: string;
}

type BorderFunction = {
  (value: string): Record<string, string> | undefined;
  width: (value: string) => Record<string, string> | undefined;
  style: (value: string) => Record<string, string> | undefined;
  color: (value: string) => Record<string, string> | undefined;
  top: (value: string) => Record<string, string> | undefined;
  right: (value: string) => Record<string, string> | undefined;
  bottom: (value: string) => Record<string, string> | undefined;
  left: (value: string) => Record<string, string> | undefined;
};

const suffix =
  (suffix: string) =>
  (value: string): Record<string, string> | undefined => {
    const longhand = directional(value);

    if (!longhand) return;

    const result: Record<string, string> = {};
    for (const key in longhand) {
      result[`border-${key}-${suffix}`] = longhand[key];
    }
    return sortProperties(result);
  };

const direction =
  (direction: string) =>
  (value: string): Record<string, string> | undefined => {
    const longhand = all(value);

    if (!longhand) return;

    const filtered: Record<string, string> = {};
    for (const key in longhand) {
      if (key === "boxSizing" && longhand[key]) {
        filtered[key] = longhand[key];
      } else if (longhand[key as keyof BorderProperties]) {
        filtered[`border-${direction}-${key}`] = longhand[key as keyof BorderProperties] as string;
      }
    }
    return sortProperties(filtered);
  };

const all = (value: string): BorderResult | undefined => {
  const values = normalizeColor(value).split(/\s+/);
  const first = values[0];

  // Handle special case: border values with box-sizing
  if (values.length === 4) {
    const [width, style, color, boxSizing] = values;

    // Check if first 3 values are valid border values and 4th is valid box-sizing
    if (
      (WIDTH.test(width) || isLength(width)) &&
      STYLE.test(style) &&
      isColor(color) &&
      (boxSizing === "border-box" || boxSizing === "content-box")
    ) {
      return {
        width,
        style,
        color,
        boxSizing,
      };
    }
  }

  if (values.length > 3) return;
  if (values.length === 1 && KEYWORD.test(first)) {
    return {
      width: first,
      style: first,
      color: first,
    };
  }

  const result: BorderProperties = {};
  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (WIDTH.test(v) || isLength(v)) {
      if (result.width) return;
      result.width = v;
    } else if (STYLE.test(v)) {
      if (result.style) return;
      result.style = v;
    } else if (isColor(v)) {
      if (result.color) return;
      result.color = v;
    } else {
      return;
    }
  }

  return result;
};

const border: BorderFunction = (value: string): Record<string, string> | undefined => {
  const longhand = all(value);

  if (!longhand) return;

  const result: Record<string, string> = {};

  // Handle box-sizing separately
  if (longhand.boxSizing) {
    result["box-sizing"] = longhand.boxSizing;
  }

  // Handle border properties
  for (const key in longhand) {
    if (key === "boxSizing") continue; // Already handled above

    const propValue = longhand[key as keyof BorderProperties];
    if (propValue) {
      const propFunction = border[key as keyof BorderFunction] as (
        value: string
      ) => Record<string, string> | undefined;
      const props = propFunction(propValue);
      if (props) {
        Object.assign(result, props);
      }
    }
  }
  return sortProperties(result);
};

border.width = suffix("width");
border.style = suffix("style");
border.color = suffix("color");
border.top = direction("top");
border.right = direction("right");
border.bottom = direction("bottom");
border.left = direction("left");

export default border;
