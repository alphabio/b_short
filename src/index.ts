// b_path:: src/index.ts

import animation from "./animation";
import background from "./background";
import border from "./border";
import borderRadius from "./border-radius";
import columnRule from "./column-rule";
import columns from "./columns";
import containIntrinsicSize from "./contain-intrinsic-size";
import directional from "./directional";
import flex from "./flex";
import flexFlow from "./flex-flow";
import font from "./font";
import grid from "./grid";
import gridArea from "./grid-area";
import gridColumn from "./grid-column";
import gridRow from "./grid-row";
import listStyle from "./list-style";
import mask from "./mask";
import offset from "./offset";
import outline from "./outline";
import overflow from "./overflow";
import placeContent from "./place-content";
import placeItems from "./place-items";
import placeSelf from "./place-self";
import type { ExpandOptions, ExpandResult } from "./schema";
import textDecoration from "./text-decoration";
import textEmphasis from "./text-emphasis";
import transition from "./transition";
import { validateStylesheet } from "./validate";

function parseInputString(input: string): string[] {
  // Split on semicolons and filter out empty declarations
  return input
    .split(";")
    .map((decl) => decl.trim())
    .filter((decl) => decl.length > 0);
}

function parseCssDeclaration(declaration: string): { property: string; value: string } | null {
  const trimmed = declaration.trim();
  const colonIndex = trimmed.indexOf(":");

  if (colonIndex === -1) return null;

  const property = trimmed.slice(0, colonIndex).trim();
  const value = trimmed.slice(colonIndex + 1).trim();

  if (!property || !value) return null;

  return { property, value };
}

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

const shorthand: Record<string, (value: string) => Record<string, string> | undefined> = {
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

function objectToCss(obj: Record<string, string>, indent: number, separator: string): string {
  const indentStr = " ".repeat(indent);
  return Object.entries(obj)
    .map(([key, value]) => `${indentStr}${key}: ${value};`)
    .join(separator);
}

export default function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  // Merge partial options with defaults from schema
  const { format = "css", indent = 0, separator = "\n" } = options;

  // Validate the input CSS directly (assume it's valid CSS)
  const validation = validateStylesheet(input);

  const inputs = parseInputString(input);
  const results: (Record<string, string> | string)[] = [];

  for (const item of inputs) {
    const parsed = parseCssDeclaration(item);
    if (!parsed) {
      continue; // Skip invalid declarations
    }

    const { property, value } = parsed;
    const normalized = value.trim();
    const important = /\s+!important$/.test(normalized);
    const cleanValue = normalized.replace(/\s+!important$/, "");

    const parse = shorthand[property];
    const longhand = parse?.(cleanValue);

    if (!longhand) {
      // For non-shorthand properties, still include them in the result
      // but as-is (no expansion needed) - validation will catch invalid ones
      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(format === "css" ? objectToCss(result, indent, separator) : result);
      continue;
    }

    let result: Record<string, string>;
    if (important) {
      result = {};
      for (const key in longhand) {
        result[key] = `${longhand[key]} !important`;
      }
    } else {
      result = longhand;
    }

    if (format === "css") {
      results.push(objectToCss(result, indent, separator));
    } else {
      results.push(result);
    }
  }

  let finalResult:
    | Record<string, string>
    | string
    | (Record<string, string> | string)[]
    | undefined;

  if (results.length === 0) {
    finalResult = undefined;
  } else if (results.length === 1) {
    finalResult = results[0];
  } else {
    // For CSS format, join multiple results into a single string
    if (format === "css") {
      finalResult = results.join(separator);
    } else {
      finalResult = results;
    }
  }

  // Determine ok status: false if errors, true if warnings only or no issues
  const ok = validation.errors.length === 0;

  // Combine errors and warnings into issues - use proper typing from schemas
  const issues = [...validation.errors, ...validation.warnings];

  return {
    ok,
    result: finalResult,
    issues,
  };
}
