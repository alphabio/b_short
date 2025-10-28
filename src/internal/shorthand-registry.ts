// b_path:: src/internal/shorthand-registry.ts

import animation from "../animation";
import background from "../background";
import border from "../border";
import borderRadius from "../border-radius";
import columnRule from "../column-rule";
import columns from "../columns";
import containIntrinsicSize from "../contain-intrinsic-size";
import flex from "../flex";
import flexFlow from "../flex-flow";
import font from "../font";
import grid from "../grid";
import gridArea from "../grid-area";
import gridColumn from "../grid-column";
import gridRow from "../grid-row";
import listStyle from "../list-style";
import mask from "../mask";
import offset from "../offset";
import outline from "../outline";
import overflow from "../overflow";
import placeContent from "../place-content";
import placeItems from "../place-items";
import placeSelf from "../place-self";
import textDecoration from "../text-decoration";
import textEmphasis from "../text-emphasis";
import transition from "../transition";
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
