// b_path:: src/internal/shorthand-registry.ts

import animation from "../handlers/animation";
import background from "../handlers/background";
import { backgroundPositionHandler } from "../handlers/background-position";
import border from "../handlers/border";
import borderRadius from "../handlers/border-radius";
import columnRule from "../handlers/column-rule";
import columns from "../handlers/columns";
import containIntrinsicSize from "../handlers/contain-intrinsic-size";
import flex from "../handlers/flex";
import flexFlow from "../handlers/flex-flow";
import font from "../handlers/font";
import grid from "../handlers/grid";
import gridArea from "../handlers/grid-area";
import gridColumn from "../handlers/grid-column";
import gridRow from "../handlers/grid-row";
import listStyle from "../handlers/list-style";
import mask from "../handlers/mask";
import offset from "../handlers/offset";
import outline from "../handlers/outline";
import overflow from "../handlers/overflow";
import placeContent from "../handlers/place-content";
import placeItems from "../handlers/place-items";
import placeSelf from "../handlers/place-self";
import textDecoration from "../handlers/text-decoration";
import textEmphasis from "../handlers/text-emphasis";
import transition from "../handlers/transition";
import directional from "./directional";

/**
 * Internal shorthand property handler registry.
 * @internal
 */

const prefix =
  (prefix: string) =>
  (value: string): Record<string, string> | undefined => {
    const longhand = directional(value);

    if (!longhand) return;

    const result: Record<string, string> = {};
    for (const key in longhand) {
      result[`${prefix}-${key}`] = longhand[key];
    }
    return result;
  };

/**
 * Central registry mapping shorthand property names to their expansion handlers.
 * @internal
 */
export const shorthand: Record<string, (value: string) => Record<string, string> | undefined> = {
  animation: animation,
  background: background,
  "background-position": (value: string) => backgroundPositionHandler.expand(value),
  border: border,
  "border-bottom": border.bottom,
  "border-color": border.color,
  "border-left": border.left,
  "border-radius": borderRadius,
  "border-right": border.right,
  "border-style": border.style,
  "border-top": border.top,
  "border-width": border.width,
  columns: columns,
  "column-rule": columnRule,
  "contain-intrinsic-size": containIntrinsicSize,
  flex: flex,
  "flex-flow": flexFlow,
  font: font,
  grid: grid,
  "grid-area": gridArea,
  "grid-column": gridColumn,
  "grid-row": gridRow,
  inset: directional,
  "list-style": listStyle,
  mask: mask,
  margin: prefix("margin"),
  offset: offset,
  outline: outline,
  overflow: overflow,
  padding: prefix("padding"),
  "place-content": placeContent,
  "place-items": placeItems,
  "place-self": placeSelf,
  "text-decoration": textDecoration,
  "text-emphasis": textEmphasis,
  transition: transition,
};
