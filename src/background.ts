// b_path:: src/background.ts

// NOTE: This handler contains complex multi-layer parsing logic that is a candidate
// for future refactoring. The position/size parsing could be simplified with better
// abstractions for coordinate and dimension handling.

import { parseBackgroundLayers, reconstructLayers } from "./background-layers";
import { cssUrlRegex } from "./internal/color-utils";
import isColor from "./internal/is-color";
import isLength from "./internal/is-length";
import normalizeColor from "./internal/normalize-color";
import { createPropertyHandler, type PropertyHandler } from "./internal/property-handler";

const ATTACHMENT = /^(fixed|local|scroll)$/;
const BOX = /^(border-box|padding-box|content-box)$/;
const IMAGE = new RegExp(`^(none|${cssUrlRegex().source})$`, "i");
const REPEAT_SINGLE = /^(repeat-x|repeat-y)$/i;
const REPEAT_DOUBLE = /^(repeat|space|round|no-repeat)$/i;
const POSITION_HORIZONTAL = /^(left|center|right)$/;
const POSITION_VERTICAL = /^(top|center|bottom)$/;
const SIZE_SINGLE = /^(cover|contain)$/;
const KEYWORD = /^(inherit|initial)$/i;

interface BackgroundResult {
  attachment?: string;
  clip?: string;
  image?: string;
  repeat?: string;
  color?: string;
  position?: string;
  size?: string;
}

const normalizeUrl = (value: string): string =>
  value.replace(cssUrlRegex(), (match: string) =>
    match.replace(/^url\(\s+/, "url(").replace(/\s+\)$/, ")")
  );

function parseBackgroundValue(value: string): Record<string, string> | undefined {
  // Use advanced parsing for all cases - it handles both simple and complex syntax better
  const layeredResult = parseBackgroundLayers(value);
  if (layeredResult) {
    return reconstructLayers(layeredResult.layers, layeredResult.color);
  }

  // Fallback to simple parsing if advanced parsing fails
  return simpleBackgroundParser(value);
}

function simpleBackgroundParser(value: string): Record<string, string> | undefined {
  // Use existing single-layer parsing logic as fallback
  const result: BackgroundResult = {};
  const values = normalizeUrl(normalizeColor(value))
    .replace(/\(.*\/.*\)|(\/)+/g, (match: string, group1: string) => (!group1 ? match : " / "))
    .split(/\s+/);

  const first = values[0];

  if (values.length === 1 && KEYWORD.test(first)) {
    return {
      "background-attachment": first,
      "background-clip": first,
      "background-image": first,
      "background-repeat": first,
      "background-color": first,
      "background-position": first,
      "background-size": first,
    };
  }

  for (let i = 0; i < values.length; i++) {
    let v = values[i];

    if (ATTACHMENT.test(v)) {
      if (result.attachment) return;
      result.attachment = v;
    } else if (BOX.test(v)) {
      if (result.clip) return;
      result.clip = v;
    } else if (IMAGE.test(v)) {
      if (result.image) return;
      result.image = v;
    } else if (REPEAT_SINGLE.test(v)) {
      if (result.repeat) return;
      result.repeat = v;
    } else if (REPEAT_DOUBLE.test(v)) {
      if (result.repeat) return;

      const n = values[i + 1];

      if (n && REPEAT_DOUBLE.test(n)) {
        v += ` ${n}`;
        i++;
      }

      result.repeat = v;
    } else if (isColor(v)) {
      if (result.color) return;
      result.color = v;
    } else if (POSITION_HORIZONTAL.test(v) || POSITION_VERTICAL.test(v) || isLength(v)) {
      if (result.position) return;

      const n = values[i + 1];
      const isHorizontal = POSITION_HORIZONTAL.test(v) || isLength(v);
      const isVertical = n && (POSITION_VERTICAL.test(n) || isLength(n));

      if (isHorizontal && isVertical) {
        result.position = `${v} ${n}`;
        i++;
      } else {
        result.position = v;
      }

      const nextV = values[i + 1];

      if (nextV === "/") {
        i += 2;
        const sizeV = values[i];

        if (SIZE_SINGLE.test(sizeV)) {
          result.size = sizeV;
        } else if (sizeV === "auto" || isLength(sizeV)) {
          let sizeValue = sizeV;
          const sizeN = values[i + 1];

          if (sizeN === "auto" || isLength(sizeN)) {
            sizeValue += ` ${sizeN}`;
            i++;
          }

          result.size = sizeValue;
        } else {
          return;
        }
      }
    } else {
      return;
    }
  }

  const finalResult: Record<string, string> = {};
  for (const key in result) {
    if (result[key as keyof BackgroundResult]) {
      finalResult[`background-${key}`] = result[key as keyof BackgroundResult] as string;
    }
  }
  return finalResult;
}

/**
 * Property handler for the 'background' CSS shorthand property
 *
 * Expands background into background-image, background-position, background-size,
 * background-repeat, background-attachment, background-origin, background-clip,
 * and background-color.
 *
 * @example
 * ```typescript
 * backgroundHandler.expand('red');
 * backgroundHandler.expand('url(bg.png) center / cover no-repeat');
 * ```
 */
export const backgroundHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "background",
    longhands: [
      "background-image",
      "background-position",
      "background-size",
      "background-repeat",
      "background-attachment",
      "background-clip",
      "background-color",
    ],
    category: "visual",
  },

  expand: (value: string): Record<string, string> | undefined => {
    return parseBackgroundValue(value);
  },

  validate: (value: string): boolean => {
    return backgroundHandler.expand(value) !== undefined;
  },
});

export default function background(value: string): Record<string, string> | undefined {
  return backgroundHandler.expand(value);
}
