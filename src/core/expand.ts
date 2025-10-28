// b_path:: src/core/expand.ts

import { expandDirectionalProperties } from "../internal/expand-directional";
import { parseCssDeclaration, parseInputString, stripComments } from "../internal/parsers";
import { kebabToCamelCase, objectToCss, sortProperties } from "../internal/property-sorter";
import { shorthand } from "../internal/shorthand-registry";
import type { BStyleWarning, ExpandOptions, ExpandResult } from "./schema";
import { DEFAULT_EXPAND_OPTIONS, FORMAT_CSS, FORMAT_JS } from "./schema";
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
    expandPartialLonghand = DEFAULT_EXPAND_OPTIONS.expandPartialLonghand,
  } = options;

  const validation = validate(cleanedInput);

  const inputs = parseInputString(cleanedInput);
  const results: (Record<string, string> | string)[] = [];
  const issues: BStyleWarning[] = [];
  const resultMetadata: Array<{ isShorthand: boolean; properties: Set<string> }> = [];

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

      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(result);
      resultMetadata.push({ isShorthand: false, properties: new Set([property]) });
      continue;
    }

    const parse = shorthand[property];
    const longhand = parse?.(normalized);

    if (!longhand) {
      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(result);
      resultMetadata.push({ isShorthand: false, properties: new Set([property]) });

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
   */
  function removeConflictingProperties(
    results: (Record<string, string> | string)[],
    metadata: Array<{ isShorthand: boolean; properties: Set<string> }>
  ): (Record<string, string> | string)[] {
    const cleanedResults: (Record<string, string> | string)[] = [];
    const propertyToResultIndex = new Map<string, number>();

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const meta = metadata[i];

      let resultObj: Record<string, string>;
      if (typeof result === "string") {
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

      if (!meta.isShorthand) {
        for (const prop of meta.properties) {
          const earlierIndex = propertyToResultIndex.get(prop);
          if (earlierIndex !== undefined) {
            const earlierResult = cleanedResults[earlierIndex];
            const earlierMeta = metadata[earlierIndex];

            if (earlierMeta.isShorthand && earlierMeta.properties.has(prop)) {
              if (typeof earlierResult === "string") {
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
              earlierMeta.properties.delete(prop);
            }
          }
        }
      } else {
        if (format === FORMAT_CSS) {
          for (const prop of meta.properties) {
            const earlierIndex = propertyToResultIndex.get(prop);
            if (earlierIndex !== undefined) {
              const earlierResult = cleanedResults[earlierIndex];
              const earlierMeta = metadata[earlierIndex];

              if (!earlierMeta.isShorthand && earlierMeta.properties.has(prop)) {
                if (typeof earlierResult === "string") {
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
                earlierMeta.properties.delete(prop);
              }
            }
          }
        }
      }

      cleanedResults.push(result);

      for (const prop of meta.properties) {
        propertyToResultIndex.set(prop, cleanedResults.length - 1);
      }
    }

    return cleanedResults;
  }

  const applyPartialExpansion = (obj: Record<string, string>): Record<string, string> => {
    return expandPartialLonghand ? expandDirectionalProperties(obj) : obj;
  };

  let finalResult: Record<string, string> | string | undefined;

  const cleanedResults = removeConflictingProperties(results, resultMetadata);

  if (cleanedResults.length === 0) {
    finalResult = undefined;
  } else if (cleanedResults.length === 1) {
    const result = cleanedResults[0];
    if (format === FORMAT_CSS && typeof result === "object") {
      const resultToProcess = applyPartialExpansion(result);
      finalResult = objectToCss(resultToProcess, indent, separator, propertyGrouping);
    } else if (format === FORMAT_JS && typeof result === "object") {
      const resultToProcess = applyPartialExpansion(result);
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
    if (format === FORMAT_CSS) {
      const mergedObject: Record<string, string> = {};

      for (const result of cleanedResults) {
        if (typeof result === "object" && result) {
          Object.assign(mergedObject, result);
        }
      }

      if (Object.keys(mergedObject).length > 0) {
        const resultToProcess = applyPartialExpansion(mergedObject);
        finalResult = objectToCss(resultToProcess, indent, separator, propertyGrouping);
      } else {
        const cssResults = cleanedResults.map((result) =>
          typeof result === "object"
            ? objectToCss(result, indent, separator, propertyGrouping)
            : result
        );
        finalResult = cssResults.join(separator);
      }
    } else {
      const mergedResult: Record<string, string> = {};
      for (const result of cleanedResults) {
        if (typeof result === "object" && result) {
          Object.assign(mergedResult, result);
        }
      }

      const resultToProcess = applyPartialExpansion(mergedResult);
      const sorted = sortProperties(resultToProcess, propertyGrouping);
      const camelCased: Record<string, string> = {};
      for (const [key, value] of Object.entries(sorted)) {
        camelCased[kebabToCamelCase(key)] = value;
      }

      finalResult = camelCased;
    }
  }

  const ok = validation.errors.length === 0;
  const allIssues = [...validation.errors, ...validation.warnings, ...issues];

  return {
    ok,
    result: finalResult,
    issues: allIssues,
  };
}
