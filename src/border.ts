// b_path:: src/border.ts
import directional from "./directional";
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
    return result;
  };

const direction =
  (direction: string) =>
  (value: string): Record<string, string> | undefined => {
    const longhand = all(value);

    if (!longhand) return;

    const filtered: Record<string, string> = {};
    for (const key in longhand) {
      if (longhand[key as keyof BorderProperties]) {
        filtered[`border-${direction}-${key}`] = longhand[key as keyof BorderProperties] as string;
      }
    }
    return filtered;
  };

const all = (value: string): BorderProperties | undefined => {
  const values = normalizeColor(value).split(/\s+/);
  const first = values[0];

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
  for (const key of Object.keys(longhand) as (keyof BorderProperties)[]) {
    const propFunction = border[key as keyof BorderFunction] as (
      value: string
    ) => Record<string, string> | undefined;
    const propValue = longhand[key];
    if (propValue) {
      const props = propFunction(propValue);
      if (props) {
        Object.assign(result, props);
      }
    }
  }
  return result;
};

border.width = suffix("width");
border.style = suffix("style");
border.color = suffix("color");
border.top = direction("top");
border.right = direction("right");
border.bottom = direction("bottom");
border.left = direction("left");

export default border;
