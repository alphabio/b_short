// b_path:: src/handlers/columns/expand.ts

import isLength from "@/internal/is-length";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";
import { sortProperties } from "@/internal/property-sorter";

/**
 * Property handler for the 'columns' CSS shorthand property
 *
 * Expands columns into column-width and column-count.
 *
 * @example
 * ```typescript
 * columnsHandler.expand('auto'); // { 'column-width': 'auto', 'column-count': 'auto' }
 * columnsHandler.expand('12em'); // { 'column-width': '12em', 'column-count': 'auto' }
 * columnsHandler.expand('auto 12'); // { 'column-width': 'auto', 'column-count': '12' }
 * columnsHandler.expand('12em 5'); // { 'column-width': '12em', 'column-count': '5' }
 * ```
 */
export const columnsHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "columns",
    longhands: ["column-width", "column-count"],
    category: "layout",
  },

  expand: (value: string): Record<string, string> | undefined => {
    // Handle global CSS keywords
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return sortProperties({
        "column-width": value,
        "column-count": value,
      });
    }

    // Split values on whitespace
    const values = value.trim().split(/\s+/);

    // Validate value count - max 2 values
    if (values.length > 2) {
      return undefined;
    }

    // Regex patterns for type detection
    const INTEGER = /^[0-9]+$/;
    const KEYWORD = /^(auto)$/i;

    const result: Record<string, string> = {};

    // Separate specific values from auto values
    const specificValues: Array<{ value: string; type: "width" | "count" }> = [];
    const autoValues: string[] = [];

    for (const val of values) {
      if (KEYWORD.test(val)) {
        autoValues.push(val);
      } else if (isLength(val)) {
        specificValues.push({ value: val, type: "width" });
      } else if (INTEGER.test(val)) {
        specificValues.push({ value: val, type: "count" });
      } else {
        return undefined; // Invalid value
      }
    }

    // Check for conflicts in specific values
    if (
      specificValues.filter((v) => v.type === "width").length > 1 ||
      specificValues.filter((v) => v.type === "count").length > 1
    ) {
      return undefined; // Multiple values for same property
    }

    // Assign specific values first
    for (const { value, type } of specificValues) {
      result[`column-${type}`] = value;
    }

    // Assign auto values to remaining properties
    for (const autoValue of autoValues) {
      if (!result["column-width"]) {
        result["column-width"] = autoValue;
      } else if (!result["column-count"]) {
        result["column-count"] = autoValue;
      } else {
        return undefined; // No available property for auto
      }
    }

    return sortProperties(result);
  },

  validate: (value: string): boolean => {
    return columnsHandler.expand(value) !== undefined;
  },
});

// Export default for backward compatibility with existing code
export default (value: string): Record<string, string> | undefined => {
  return columnsHandler.expand(value);
};
