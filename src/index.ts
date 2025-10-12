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
import type { BStyleWarning, ExpandOptions, ExpandResult } from "./schema";
import textDecoration from "./text-decoration";
import textEmphasis from "./text-emphasis";
import transition from "./transition";
import { validateStylesheet } from "./validate";

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

function objectToCss(obj: Record<string, string>, indent: number, separator: string): string {
  const indentStr = " ".repeat(indent);

  // Sort properties in a consistent CSS-like order
  const sortedEntries = Object.entries(obj).sort(([a], [b]) => {
    // Define property order groups (CSS-like ordering)
    const orderGroups = [
      // Positioning and layout
      /^(position|z-index|display|float|clear)$/,
      // Box model - directional properties first (top, right, bottom, left)
      /^(top|right|bottom|left)$/,
      // Box model - margin and padding (full properties)
      /^(margin|padding)$/,
      // Box model - margin and padding (directional)
      /^(margin|padding)-(top|right|bottom|left)$/,
      // Box model - border, width, height
      /^(border|width|height|min-|max-)/,
      // Typography
      /^(font|text-|letter-|word-|line-)/,
      // Visual
      /^(color|background|opacity|visibility|overflow)/,
      // Animation and transition
      /^(animation|transition|transform)/,
      // Other properties
      /^.*/,
    ];

    // Find the group index for each property
    const getGroupIndex = (prop: string) => {
      for (let i = 0; i < orderGroups.length; i++) {
        if (orderGroups[i].test(prop)) {
          return i;
        }
      }
      return orderGroups.length;
    };

    const groupA = getGroupIndex(a);
    const groupB = getGroupIndex(b);

    // First sort by group
    if (groupA !== groupB) {
      return groupA - groupB;
    }

    // Within directional properties group, sort by direction (top, right, bottom, left)
    if (groupA === 1) {
      const directionOrder = { top: 0, right: 1, bottom: 2, left: 3 };
      const dirA = directionOrder[a as keyof typeof directionOrder] ?? 4;
      const dirB = directionOrder[b as keyof typeof directionOrder] ?? 4;
      if (dirA !== dirB) {
        return dirA - dirB;
      }
    }

    // Within margin/padding directional group, prioritize top if it was explicitly overridden
    if (groupA === 3) {
      const directionOrder = { top: 0, right: 1, bottom: 2, left: 3 };
      const dirA = directionOrder[a.split("-")[1] as keyof typeof directionOrder] ?? 4;
      const dirB = directionOrder[b.split("-")[1] as keyof typeof directionOrder] ?? 4;

      // If one is margin-top or padding-top, prioritize it (it might be explicitly overridden)
      if (a === "margin-top" || a === "padding-top") return -1;
      if (b === "margin-top" || b === "padding-top") return 1;

      if (dirA !== dirB) {
        return dirA - dirB;
      }
    }

    // Within the same group, sort alphabetically
    return a.localeCompare(b);
  });

  return sortedEntries.map(([key, value]) => `${indentStr}${key}: ${value};`).join(separator);
}

export default function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  // Merge partial options with defaults from schema
  const { format = "css", indent = 0, separator = "\n" } = options;

  // Validate the input CSS directly (assume it's valid CSS)
  const validation = validateStylesheet(input);

  const inputs = parseInputString(input);
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
    const important = /\s+!important$/.test(normalized);

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

  // Conflict resolution function to handle shorthand/longhand property overrides
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
                cleanedResults[earlierIndex] = objectToCss(earlierObj, indent, separator);
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
                  cleanedResults[earlierIndex] = objectToCss(earlierObj, indent, separator);
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

  let finalResult: Record<string, string> | string | undefined;

  // Apply conflict resolution for shorthand/longhand property overrides
  const cleanedResults = removeConflictingProperties(results, resultMetadata);

  if (cleanedResults.length === 0) {
    finalResult = undefined;
  } else if (cleanedResults.length === 1) {
    const result = cleanedResults[0];
    finalResult =
      format === "css" && typeof result === "object"
        ? objectToCss(result, indent, separator)
        : result;
  } else {
    if (format === "css") {
      // Convert all objects to CSS strings and join them
      const cssResults = cleanedResults.map((result) =>
        typeof result === "object" ? objectToCss(result, indent, separator) : result
      );
      finalResult = cssResults.join(separator);
    } else {
      // format === "js" - merge objects with simple "later wins" logic
      const mergedResult: Record<string, string> = {};
      for (const result of cleanedResults) {
        if (typeof result === "object" && result) {
          Object.assign(mergedResult, result);
        }
      }
      finalResult = mergedResult;
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

export { expand, validateStylesheet };
