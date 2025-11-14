// b_path:: src/core/expand.ts

import { hasTopLevelCommas } from "../internal/layer-parser-utils";
import { parseCssDeclaration, parseInputString, stripComments } from "../internal/parsers";
import { kebabToCamelCase, objectToCss, sortProperties } from "../internal/property-sorter";
import { shorthand } from "../internal/shorthand-registry";
import type { BStyleWarning, ExpandOptions, ExpandResult } from "./schema";
import { DEFAULT_EXPAND_OPTIONS, FORMAT_CSS } from "./schema";
import { validate } from "./validate";

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
 * @example
 * // JavaScript object format
 * expand('padding: 1rem;', { format: 'js' })
 * // → { ok: true, result: { paddingTop: '1rem', ... }, issues: [] }
 *
 * @example
 * // Multiple declarations with conflict resolution
 * expand('margin: 10px; margin-top: 20px;', { format: 'js' })
 * // → { ok: true, result: { marginTop: '20px', marginRight: '10px', ... }, issues: [] }
 */
export function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  const cleanedInput = stripComments(input);

  // Apply defaults using DEFAULT_EXPAND_OPTIONS
  const {
    format = DEFAULT_EXPAND_OPTIONS.format,
    indent = DEFAULT_EXPAND_OPTIONS.indent,
    separator = DEFAULT_EXPAND_OPTIONS.separator,
    propertyGrouping = DEFAULT_EXPAND_OPTIONS.propertyGrouping,
  } = options;

  const validation = validate(cleanedInput);

  const inputs = parseInputString(cleanedInput);
  const finalProperties: Record<string, string> = {};
  const issues: BStyleWarning[] = [];

  for (const item of inputs) {
    const parsed = parseCssDeclaration(item);
    if (!parsed) {
      continue;
    }

    const { property, value } = parsed;
    const normalized = value.trim();
    const important = normalized.endsWith("!important") && /\s/.test(normalized.slice(-11, -10));

    if (important) {
      issues.push({
        property,
        name: "important-detected",
        formattedWarning: `!important flag detected in '${property}' and has been ignored. Shorthand expansion does not support !important.`,
      });
      finalProperties[property] = normalized;
      continue;
    }

    const parse = shorthand[property];
    const longhand = parse?.(normalized);

    if (longhand) {
      // Recursively expand any longhands that are themselves shorthands
      // e.g., background → background-position → background-position-x/y
      // Note: Skip recursive expansion for multi-layer values (e.g., "0% 0%, 0% 0%")
      // as they need layer-aware splitting first
      for (const [prop, val] of Object.entries(longhand)) {
        const nestedParse = shorthand[prop];
        const isMultiLayer = hasTopLevelCommas(val);

        if (nestedParse && !isMultiLayer) {
          const nestedLonghand = nestedParse(val);
          if (nestedLonghand) {
            Object.assign(finalProperties, nestedLonghand);
            continue;
          }
        }
        finalProperties[prop] = val;
      }
    } else {
      finalProperties[property] = normalized;

      if (property in shorthand) {
        issues.push({
          property,
          name: "expansion-failed",
          formattedWarning: `Could not expand shorthand property '${property}' with value '${normalized}'. Returning original shorthand.`,
        });
      }
    }
  }

  let finalResult: Record<string, string> | string | undefined;

  if (Object.keys(finalProperties).length === 0) {
    finalResult = undefined;
  } else if (format === FORMAT_CSS) {
    finalResult = objectToCss(finalProperties, indent, separator, propertyGrouping);
  } else {
    const sorted = sortProperties(finalProperties, propertyGrouping);
    const camelCased: Record<string, string> = {};
    for (const [key, value] of Object.entries(sorted)) {
      camelCased[kebabToCamelCase(key)] = value;
    }
    finalResult = camelCased;
  }

  const ok = validation.errors.length === 0;
  const allIssues = [...validation.errors, ...validation.warnings, ...issues];

  return {
    ok,
    result: finalResult,
    issues: allIssues,
  };
}
