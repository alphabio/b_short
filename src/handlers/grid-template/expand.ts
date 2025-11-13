// b_path:: src/handlers/grid-template/expand.ts

/**
 * Grid-template is complex - supports multiple syntaxes:
 * 1. none
 * 2. grid-template-rows / grid-template-columns
 * 3. [ line-names ] "grid-area-strings" track-size [ line-names ]
 *
 * For v2.0.0, we'll handle the common cases correctly
 */

export function expandGridTemplate(value: string): Record<string, string> {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert" ||
    trimmed === "none"
  ) {
    return {
      "grid-template-rows": trimmed,
      "grid-template-columns": trimmed,
      "grid-template-areas": trimmed === "none" ? "none" : trimmed,
    };
  }

  // Check for / separator (rows / columns syntax)
  if (trimmed.includes(" / ")) {
    const [rows, columns] = trimmed.split(" / ").map((p) => p.trim());
    return {
      "grid-template-rows": rows,
      "grid-template-columns": columns,
      "grid-template-areas": "none",
    };
  }

  // Check for grid-area syntax (contains quotes)
  if (trimmed.includes('"') || trimmed.includes("'")) {
    // Complex grid-areas syntax
    // Extract area strings and optional track sizes
    const areaMatches = trimmed.match(/["'][^"']+["']/g);
    if (areaMatches) {
      const areas = areaMatches.join(" ");
      // Remove area strings to get track sizes
      let remaining = trimmed;
      for (const area of areaMatches) {
        remaining = remaining.replace(area, "");
      }
      const trackSize = remaining.trim() || "auto";

      return {
        "grid-template-rows": trackSize,
        "grid-template-columns": "none",
        "grid-template-areas": areas,
      };
    }
  }

  // Fallback: treat as rows
  return {
    "grid-template-rows": trimmed,
    "grid-template-columns": "none",
    "grid-template-areas": "none",
  };
}
