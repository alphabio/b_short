// b_path:: src/index.ts

import animation from "./animation";
import background from "./background";
import border from "./border";
import borderRadius from "./border-radius";
import columnRule from "./column-rule";
import columns from "./columns";
import containIntrinsicSize from "./contain-intrinsic-size";
import directional from "./directional";
import { expandDirectionalProperties } from "./expand-directional";
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
import type { BStyleWarning, ExpandOptions, ExpandResult } from "./schema";
import textDecoration from "./text-decoration";
import textEmphasis from "./text-emphasis";
import transition from "./transition";
import { validate } from "./validate";

/**
 * Removes all CSS comments from the input string.
 * Uses a character-by-character scanning approach that safely handles multi-line comments.
 */
function stripComments(css: string): string {
  // Remove all CSS comments /* ... */
  // This function scans character-by-character to handle multi-line comments safely
  let result = "";
  let i = 0;

  while (i < css.length) {
    // Check for comment start
    if (css[i] === "/" && css[i + 1] === "*") {
      // Find comment end
      let j = i + 2;
      while (j < css.length) {
        if (css[j] === "*" && css[j + 1] === "/") {
          // Skip the comment, replace with a space to preserve token boundaries
          result += " ";
          i = j + 2;
          break;
        }
        j++;
      }
      // If we didn't find a closing */, treat rest of string as comment and stop
      if (j >= css.length) {
        i = css.length;
      }
    } else {
      result += css[i];
      i++;
    }
  }

  return result;
}

function parseInputString(input: string): string[] {
  const declarations: string[] = [];
  let current = "";
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    // Handle escaped characters
    if (char === "\\" && nextChar) {
      current += char + nextChar;
      i += 2;
      continue;
    }

    // Track context
    if (char === '"' || char === "'") {
      // Find the closing quote, handling escaped quotes
      let quoteEnd = i + 1;
      while (quoteEnd < input.length) {
        if (input[quoteEnd] === char && input[quoteEnd - 1] !== "\\") {
          break;
        }
        quoteEnd++;
      }
      if (quoteEnd < input.length) {
        current += input.substring(i, quoteEnd + 1);
        i = quoteEnd + 1;
        continue;
      }
    }

    // Handle parentheses (for functions like url(), calc(), etc.)
    if (char === "(") {
      let parenCount = 1;
      let parenEnd = i + 1;
      while (parenEnd < input.length && parenCount > 0) {
        if (input[parenEnd] === "(") parenCount++;
        if (input[parenEnd] === ")") parenCount--;
        parenEnd++;
      }
      if (parenCount === 0) {
        current += input.substring(i, parenEnd);
        i = parenEnd;
        continue;
      }
    }

    // Handle square brackets (for attribute selectors, etc.)
    if (char === "[") {
      const bracketEnd = input.indexOf("]", i + 1);
      if (bracketEnd !== -1) {
        current += input.substring(i, bracketEnd + 1);
        i = bracketEnd + 1;
        continue;
      }
    }

    // Split on semicolons only when not in any special context
    if (char === ";") {
      declarations.push(current.trim());
      current = "";
    } else {
      current += char;
    }

    i++;
  }

  // Add the last declaration if it exists
  if (current.trim()) {
    declarations.push(current.trim());
  }

  // Filter out empty declarations
  return declarations.filter((decl) => decl.length > 0);
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

const PROPERTY_ORDER_MAP: Record<string, number> = {
  // Grid properties (indices 0-11)
  "grid-row-start": 0,
  "grid-row-end": 1,
  "grid-column-start": 2,
  "grid-column-end": 3,
  "grid-template-rows": 4,
  "grid-template-columns": 5,
  "grid-template-areas": 6,
  "grid-auto-rows": 7,
  "grid-auto-columns": 8,
  "grid-auto-flow": 9,
  "row-gap": 10,
  "column-gap": 11,

  // Animation properties (indices 20-27)
  "animation-name": 20,
  "animation-duration": 21,
  "animation-timing-function": 22,
  "animation-delay": 23,
  "animation-iteration-count": 24,
  "animation-direction": 25,
  "animation-fill-mode": 26,
  "animation-play-state": 27,

  // Transition properties (indices 30-33)
  "transition-property": 30,
  "transition-duration": 31,
  "transition-timing-function": 32,
  "transition-delay": 33,

  // Background properties (indices 40-47)
  "background-image": 40,
  "background-position": 41,
  "background-size": 42,
  "background-repeat": 43,
  "background-attachment": 44,
  "background-origin": 45,
  "background-clip": 46,
  "background-color": 47,

  // Font properties (indices 50-56)
  "font-style": 50,
  "font-variant": 51,
  "font-weight": 52,
  "font-stretch": 53,
  "font-size": 54,
  "line-height": 55,
  "font-family": 56,

  // Flex properties (indices 60-64)
  "flex-grow": 60,
  "flex-shrink": 61,
  "flex-basis": 62,
  "flex-direction": 63,
  "flex-wrap": 64,

  // Border directional properties (indices 70-84)
  "border-top-width": 70,
  "border-top-style": 71,
  "border-top-color": 72,
  "border-right-width": 73,
  "border-right-style": 74,
  "border-right-color": 75,
  "border-bottom-width": 76,
  "border-bottom-style": 77,
  "border-bottom-color": 78,
  "border-left-width": 79,
  "border-left-style": 80,
  "border-left-color": 81,
  "border-width": 82,
  "border-style": 83,
  "border-color": 84,

  // Border-radius properties (indices 90-93)
  "border-top-left-radius": 90,
  "border-top-right-radius": 91,
  "border-bottom-right-radius": 92,
  "border-bottom-left-radius": 93,

  // Outline properties (indices 100-102)
  "outline-width": 100,
  "outline-style": 101,
  "outline-color": 102,

  // Column-rule properties (indices 110-112)
  "column-rule-width": 110,
  "column-rule-style": 111,
  "column-rule-color": 112,

  // Columns properties (indices 115-116)
  "column-width": 115,
  "column-count": 116,

  // List-style properties (indices 120-122)
  "list-style-type": 120,
  "list-style-position": 121,
  "list-style-image": 122,

  // Text-decoration properties (indices 130-133)
  "text-decoration-line": 130,
  "text-decoration-style": 131,
  "text-decoration-color": 132,
  "text-decoration-thickness": 133,

  // Overflow properties (indices 140-141)
  "overflow-x": 140,
  "overflow-y": 141,

  // Place properties (indices 150-155)
  "align-items": 150,
  "justify-items": 151,
  "align-content": 152,
  "justify-content": 153,
  "align-self": 154,
  "justify-self": 155,

  // Directional properties - margin (indices 200-203)
  "margin-top": 200,
  "margin-right": 201,
  "margin-bottom": 202,
  "margin-left": 203,

  // Directional properties - padding (indices 210-213)
  "padding-top": 210,
  "padding-right": 211,
  "padding-bottom": 212,
  "padding-left": 213,

  // Directional properties - inset (indices 220-223)
  top: 220,
  right: 221,
  bottom: 222,
  left: 223,

  // Mask properties (indices 230-237)
  "mask-image": 230,
  "mask-mode": 231,
  "mask-position": 232,
  "mask-size": 233,
  "mask-repeat": 234,
  "mask-origin": 235,
  "mask-clip": 236,
  "mask-composite": 237,

  // Offset properties (indices 240-244)
  "offset-position": 240,
  "offset-path": 241,
  "offset-distance": 242,
  "offset-rotate": 243,
  "offset-anchor": 244,

  // Text-emphasis properties (indices 250-252)
  "text-emphasis-style": 250,
  "text-emphasis-color": 251,
  "text-emphasis-position": 252,

  // Contain-intrinsic-size properties (indices 260-261)
  "contain-intrinsic-width": 260,
  "contain-intrinsic-height": 261,
};

/**
 * Converts a kebab-case CSS property name to camelCase for JavaScript.
 *
 * @param property - CSS property name in kebab-case (e.g., "margin-top")
 * @returns Property name in camelCase (e.g., "marginTop")
 *
 * @example
 * kebabToCamelCase('margin-top') // → 'marginTop'
 * kebabToCamelCase('text-decoration-line') // → 'textDecorationLine'
 */
function kebabToCamelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Sorts an object's properties according to CSS specification order defined in PROPERTY_ORDER_MAP.
 *
 * @param obj - Object with CSS properties to sort
 * @param grouping - Grouping strategy: "by-property" (default) or "by-side"
 * @returns New object with properties sorted according to the specified strategy
 *
 * @example
 * // by-property: groups all properties of same type together
 * sortProperties({ 'margin-top': '5px', 'border-top-width': '1px' })
 * // → { 'border-top-width': '1px', 'margin-top': '5px' }
 *
 * @example
 * // by-side: groups all properties of same side together
 * sortProperties({ 'margin-bottom': '5px', 'border-top-width': '1px' }, 'by-side')
 * // → { 'border-top-width': '1px', 'margin-bottom': '5px' } (top before bottom)
 */
function sortProperties(
  obj: Record<string, string>,
  grouping: "by-property" | "by-side" = "by-property"
): Record<string, string> {
  if (grouping === "by-side") {
    return sortPropertiesBySide(obj);
  }
  return sortPropertiesByProperty(obj);
}

/**
 * Helper to extract property metadata for directional grouping.
 * Identifies the side (top/right/bottom/left) and base property name.
 *
 * @param prop - CSS property name to analyze
 * @returns Metadata object with side, sideIndex, and base property
 *
 * @example
 * getPropertyMetadata('border-top-width')
 * // → { side: 'top', sideIndex: 0, base: 'border' }
 *
 * @example
 * getPropertyMetadata('font-size')
 * // → { side: null, sideIndex: -1, base: 'font' }
 */
function getPropertyMetadata(prop: string): {
  side: string | null;
  sideIndex: number;
  base: string;
} {
  const parts = prop.split("-");
  const sides = ["top", "right", "bottom", "left"];
  const side = parts.find((p) => sides.includes(p)) || null;
  const sideIndex = side ? sides.indexOf(side) : -1;
  const base = parts[0];

  return { side, sideIndex, base };
}

/**
 * Sort properties by property type (default CSS spec order).
 * Groups all properties of the same type together (e.g., all margins, then all borders).
 *
 * @param obj - Object with CSS properties to sort
 * @returns New object with properties sorted by type
 */
function sortPropertiesByProperty(obj: Record<string, string>): Record<string, string> {
  const sortedEntries = Object.entries(obj).sort(([a], [b]) => {
    const orderA = PROPERTY_ORDER_MAP[a];
    const orderB = PROPERTY_ORDER_MAP[b];

    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;
    return a.localeCompare(b);
  });

  return Object.fromEntries(sortedEntries);
}

/**
 * Sort properties by directional side.
 * Groups all properties of the same side together (e.g., all top properties, then all right properties).
 * Useful for debugging and understanding box model relationships.
 *
 * @param obj - Object with CSS properties to sort
 * @returns New object with properties sorted by side
 */
function sortPropertiesBySide(obj: Record<string, string>): Record<string, string> {
  const sortedEntries = Object.entries(obj).sort(([a], [b]) => {
    const metaA = getPropertyMetadata(a);
    const metaB = getPropertyMetadata(b);

    // Both have sides - sort by side first, then by property order within that side
    if (metaA.side && metaB.side) {
      if (metaA.sideIndex !== metaB.sideIndex) {
        return metaA.sideIndex - metaB.sideIndex;
      }
      // Same side - sort by CSS spec order to maintain proper ordering within the side
      const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
      const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
      return orderA - orderB;
    }

    // If only one has a side, non-directional properties come first (by their spec order)
    // This handles mixed cases like font-size mixed with margin-top
    if (!metaA.side && metaB.side) {
      const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
      // Put non-directional before directional if they have lower spec order
      if (orderA < 200) return -1; // Most non-directional properties are < 200
      return 1;
    }
    if (metaA.side && !metaB.side) {
      const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
      if (orderB < 200) return 1;
      return -1;
    }

    // Neither has sides - use normal property order
    const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
    const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  return Object.fromEntries(sortedEntries);
}

function objectToCss(
  obj: Record<string, string>,
  indent: number,
  separator: string,
  propertyGrouping: "by-property" | "by-side" = "by-property"
): string {
  const indentStr = "  ".repeat(indent);

  // Sort properties using the specified grouping strategy
  const sorted = sortProperties(obj, propertyGrouping);
  const sortedEntries = Object.entries(sorted);

  return sortedEntries.map(([key, value]) => `${indentStr}${key}: ${value};`).join(separator);
}

/**
 * Expands CSS shorthand properties into their longhand equivalents.
 *
 * @param input - CSS declaration(s) to expand (e.g., "margin: 10px 20px;")
 * @param options - Configuration options for expansion behavior
 * @returns Object containing expansion result, success status, and any issues
 *
 * @example
 * // Basic expansion
 * expand('margin: 10px 20px;')
 * // → { ok: true, result: 'margin-top: 10px;\nmargin-right: 20px;...', issues: [] }
 *
 * // JavaScript object format
 * expand('padding: 1rem;', { format: 'js' })
 * // → { ok: true, result: { 'padding-top': '1rem', ... }, issues: [] }
 *
 * // Multiple declarations with conflict resolution
 * expand('margin: 10px; margin-top: 20px;', { format: 'js' })
 * // → { ok: true, result: { 'margin-top': '20px', 'margin-right': '10px', ... }, issues: [] }
 */
function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  // Strip comments first to avoid parsing issues
  const cleanedInput = stripComments(input);

  // Merge partial options with defaults from schema
  const {
    format = "css",
    indent = 0,
    separator = "\n",
    propertyGrouping = "by-property",
    expandPartialLonghand = false,
  } = options;

  // Validate the input CSS directly (assume it's valid CSS)
  const validation = validate(cleanedInput);

  const inputs = parseInputString(cleanedInput);
  const results: (Record<string, string> | string)[] = [];
  const issues: BStyleWarning[] = [];
  const resultMetadata: Array<{ isShorthand: boolean; properties: Set<string> }> = [];

  for (const item of inputs) {
    const parsed = parseCssDeclaration(item);
    if (!parsed) {
      continue; // Skip invalid declarations
    }

    const { property, value } = parsed;
    const normalized = value.trim();
    // Safe check for !important without ReDoS vulnerability
    const important = normalized.endsWith("!important") && /\s/.test(normalized.slice(-11, -10));

    // Handle !important detection and warning
    if (important) {
      issues.push({
        property,
        name: "important-detected",
        formattedWarning: `!important flag detected in '${property}' and has been ignored. Shorthand expansion does not support !important.`,
      });

      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(result);
      resultMetadata.push({ isShorthand: false, properties: new Set([property]) });
      continue;
    }

    const parse = shorthand[property];
    const longhand = parse?.(normalized);

    if (!longhand) {
      // For non-shorthand properties, still include them in the result
      // but as-is (no expansion needed) - validation will catch invalid ones

      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(result);
      resultMetadata.push({ isShorthand: false, properties: new Set([property]) });

      // Add warning for unparseable shorthands only if CSS is actually invalid
      if (property in shorthand) {
        issues.push({
          property,
          name: "expansion-failed",
          formattedWarning: `Could not expand shorthand property '${property}' with value '${normalized}'. Returning original shorthand.`,
        });
      }
      continue;
    }

    const result: Record<string, string> = longhand;
    results.push(result);
    resultMetadata.push({ isShorthand: true, properties: new Set(Object.keys(result)) });
  }

  /**
   * Resolves conflicts between shorthand and longhand properties according to CSS cascade rules.
   *
   * When a longhand property (e.g., margin-top) appears after a shorthand (e.g., margin),
   * the longhand overrides that specific property from the shorthand expansion.
   * When a shorthand appears after a longhand, the shorthand replaces all related longhands.
   *
   * @param results - Array of CSS declaration objects (either objects or strings)
   * @param metadata - Array of metadata describing each result (shorthand vs longhand, properties affected)
   * @returns Cleaned array with conflicts resolved
   *
   * @example
   * // Input: ['margin: 10px', 'margin-top: 20px']
   * // Output: margin-top from the shorthand is removed, replaced by explicit margin-top: 20px
   *
   * @example
   * // Input: ['margin-top: 20px', 'margin: 10px']
   * // Output: margin-top: 20px is removed, replaced by margin: 10px expansion
   */
  function removeConflictingProperties(
    results: (Record<string, string> | string)[],
    metadata: Array<{ isShorthand: boolean; properties: Set<string> }>
  ): (Record<string, string> | string)[] {
    const cleanedResults: (Record<string, string> | string)[] = [];
    // Maintain a running map of property name to the index of the last setting result
    const propertyToResultIndex = new Map<string, number>();

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const meta = metadata[i];

      // For CSS strings, we need to convert them back to objects for conflict resolution
      let resultObj: Record<string, string>;
      if (typeof result === "string") {
        // Parse CSS string back to object for conflict resolution
        resultObj = {};
        const cssLines = result.split(";").filter((line) => line.trim());
        for (const line of cssLines) {
          const colonIndex = line.indexOf(":");
          if (colonIndex !== -1) {
            const prop = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            resultObj[prop] = value;
          }
        }
      } else {
        resultObj = { ...result };
      }

      // Handle conflicts based on whether current result is from shorthand expansion
      if (!meta.isShorthand) {
        // Current result is NOT from shorthand expansion - check for conflicts with earlier shorthand results
        for (const prop of meta.properties) {
          const earlierIndex = propertyToResultIndex.get(prop);
          if (earlierIndex !== undefined) {
            const earlierResult = cleanedResults[earlierIndex];
            const earlierMeta = metadata[earlierIndex];

            // Only check earlier shorthand results for conflicts
            if (earlierMeta.isShorthand && earlierMeta.properties.has(prop)) {
              // Remove the conflicting property from the earlier shorthand result
              if (typeof earlierResult === "string") {
                // Parse, remove property, and convert back to CSS string
                const earlierObj: Record<string, string> = {};
                const cssLines = earlierResult.split(";").filter((line) => line.trim());
                for (const line of cssLines) {
                  const colonIndex = line.indexOf(":");
                  if (colonIndex !== -1) {
                    const earlierProp = line.slice(0, colonIndex).trim();
                    const value = line.slice(colonIndex + 1).trim();
                    if (earlierProp !== prop) {
                      earlierObj[earlierProp] = value;
                    }
                  }
                }
                cleanedResults[earlierIndex] = objectToCss(
                  earlierObj,
                  indent,
                  separator,
                  propertyGrouping
                );
              } else {
                delete earlierResult[prop];
              }
              // Update metadata to remove the property
              earlierMeta.properties.delete(prop);
            }
          }
        }
      } else {
        // Current result IS from shorthand expansion - check for conflicts with earlier non-shorthand results
        // Gate this behind CSS format only to mirror JS merge behavior
        if (format === "css") {
          for (const prop of meta.properties) {
            const earlierIndex = propertyToResultIndex.get(prop);
            if (earlierIndex !== undefined) {
              const earlierResult = cleanedResults[earlierIndex];
              const earlierMeta = metadata[earlierIndex];

              // Only check earlier non-shorthand results for conflicts
              if (!earlierMeta.isShorthand && earlierMeta.properties.has(prop)) {
                // Remove the conflicting property from the earlier non-shorthand result
                if (typeof earlierResult === "string") {
                  // Parse, remove property, and convert back to CSS string
                  const earlierObj: Record<string, string> = {};
                  const cssLines = earlierResult.split(";").filter((line) => line.trim());
                  for (const line of cssLines) {
                    const colonIndex = line.indexOf(":");
                    if (colonIndex !== -1) {
                      const earlierProp = line.slice(0, colonIndex).trim();
                      const value = line.slice(colonIndex + 1).trim();
                      if (earlierProp !== prop) {
                        earlierObj[earlierProp] = value;
                      }
                    }
                  }
                  cleanedResults[earlierIndex] = objectToCss(
                    earlierObj,
                    indent,
                    separator,
                    propertyGrouping
                  );
                } else {
                  delete earlierResult[prop];
                }
                // Update metadata to remove the property
                earlierMeta.properties.delete(prop);
              }
            }
          }
        }
      }

      // Add the current result (CSS string or object)
      cleanedResults.push(result);

      // Update the property map with the current result index for all properties in this result
      for (const prop of meta.properties) {
        propertyToResultIndex.set(prop, cleanedResults.length - 1);
      }
    }

    return cleanedResults;
  }

  /**
   * Helper to apply partial longhand expansion if enabled.
   */
  const applyPartialExpansion = (obj: Record<string, string>): Record<string, string> => {
    return expandPartialLonghand ? expandDirectionalProperties(obj) : obj;
  };

  let finalResult: Record<string, string> | string | undefined;

  // Apply conflict resolution for shorthand/longhand property overrides
  const cleanedResults = removeConflictingProperties(results, resultMetadata);

  if (cleanedResults.length === 0) {
    finalResult = undefined;
  } else if (cleanedResults.length === 1) {
    const result = cleanedResults[0];
    if (format === "css" && typeof result === "object") {
      const resultToProcess = applyPartialExpansion(result);
      finalResult = objectToCss(resultToProcess, indent, separator, propertyGrouping);
    } else if (format === "js" && typeof result === "object") {
      const resultToProcess = applyPartialExpansion(result);
      // Sort and convert to camelCase for JS format
      const sorted = sortProperties(resultToProcess, propertyGrouping);
      const camelCased: Record<string, string> = {};
      for (const [key, value] of Object.entries(sorted)) {
        camelCased[kebabToCamelCase(key)] = value;
      }
      finalResult = camelCased;
    } else {
      finalResult = result;
    }
  } else {
    if (format === "css") {
      // For CSS format with multiple declarations, we need to merge objects first
      // then convert to CSS to respect property grouping across declarations
      const mergedObject: Record<string, string> = {};

      for (const result of cleanedResults) {
        if (typeof result === "object" && result) {
          Object.assign(mergedObject, result);
        }
      }

      // If we have a merged object, convert it to CSS with proper grouping
      if (Object.keys(mergedObject).length > 0) {
        const resultToProcess = applyPartialExpansion(mergedObject);
        finalResult = objectToCss(resultToProcess, indent, separator, propertyGrouping);
      } else {
        // Fallback for non-object results (shouldn't normally happen)
        const cssResults = cleanedResults.map((result) =>
          typeof result === "object"
            ? objectToCss(result, indent, separator, propertyGrouping)
            : result
        );
        finalResult = cssResults.join(separator);
      }
    } else {
      // format === "js" - merge objects with simple "later wins" logic
      const mergedResult: Record<string, string> = {};
      for (const result of cleanedResults) {
        if (typeof result === "object" && result) {
          Object.assign(mergedResult, result);
        }
      }

      const resultToProcess = applyPartialExpansion(mergedResult);

      // Sort the merged result according to the specified grouping strategy
      const sorted = sortProperties(resultToProcess, propertyGrouping);

      // Convert property names to camelCase for JavaScript
      const camelCased: Record<string, string> = {};
      for (const [key, value] of Object.entries(sorted)) {
        camelCased[kebabToCamelCase(key)] = value;
      }

      finalResult = camelCased;
    }
  }

  // Determine ok status: false if errors, true if warnings only or no issues
  const ok = validation.errors.length === 0;

  // Combine errors, warnings, and our custom issues
  const allIssues = [...validation.errors, ...validation.warnings, ...issues];

  return {
    ok,
    result: finalResult,
    issues: allIssues,
  };
}

// Export named functions only (no default export to avoid CJS/ESM ambiguity)
export { expand, validate, sortProperties, PROPERTY_ORDER_MAP };

// Re-export types for convenience
export type {
  AnimationLayer,
  AnimationResult,
  BackgroundLayer,
  BackgroundResult,
  BStyleWarning,
  ExpandOptions,
  ExpandResult,
  MaskLayer,
  MaskResult,
  StylesheetValidation,
  TransitionLayer,
  TransitionResult,
} from "./schema";
