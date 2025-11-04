// b_path:: src/handlers/flex/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the flex shorthand property.
 *
 * Reconstructs `flex` from `flex-grow`, `flex-shrink`, and `flex-basis`.
 *
 * Rules:
 * - Special keywords: `none`, `auto`, `initial`
 * - Single number: grow (when shrink=1, basis=0%)
 * - Two numbers: grow shrink (when basis=0%)
 * - Number + basis: grow basis (when shrink=1)
 * - Three values: grow shrink basis
 */
export const flexCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "flex",
    longhands: ["flex-grow", "flex-shrink", "flex-basis"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const grow = properties["flex-grow"];
    const shrink = properties["flex-shrink"];
    const basis = properties["flex-basis"];

    // All three must be present
    if (!grow || !shrink || !basis) return undefined;

    // Handle special keyword combinations
    // none: 0 0 auto
    if (grow === "0" && shrink === "0" && basis === "auto") {
      return "none";
    }

    // auto: 1 1 auto
    if (grow === "1" && shrink === "1" && basis === "auto") {
      return "auto";
    }

    // initial: 0 1 auto
    if (grow === "0" && shrink === "1" && basis === "auto") {
      return "initial";
    }

    // Global keywords - all must match
    if (grow === shrink && shrink === basis) {
      if (/^(inherit|unset|revert)$/i.test(grow)) {
        return grow;
      }
    }

    // Single number form: grow (when shrink=1, basis=0%)
    if (shrink === "1" && basis === "0%") {
      return grow;
    }

    // Two number form: grow shrink (when basis=0%)
    if (basis === "0%") {
      return `${grow} ${shrink}`;
    }

    // Number + basis form: grow basis (when shrink=1)
    if (shrink === "1") {
      return `${grow} ${basis}`;
    }

    // Three value form: grow shrink basis
    return `${grow} ${shrink} ${basis}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["flex-grow"] && properties["flex-shrink"] && properties["flex-basis"]);
  },
});
