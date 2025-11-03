// b_path:: src/handlers/flex-flow/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the flex-flow shorthand property.
 *
 * Reconstructs `flex-flow` from `flex-direction` and `flex-wrap`.
 *
 * Rules:
 * - Single value: just direction if wrap is default (nowrap), or just wrap if direction is default (row)
 * - Two values: direction wrap
 * - If both are missing: cannot collapse
 */
export const flexFlowCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "flex-flow",
    longhands: ["flex-direction", "flex-wrap"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const direction = properties["flex-direction"];
    const wrap = properties["flex-wrap"];

    // At least one must be present
    if (!direction && !wrap) return undefined;

    // Both present
    if (direction && wrap) {
      return `${direction} ${wrap}`;
    }

    // Only one present
    return direction || wrap;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["flex-direction"] || properties["flex-wrap"]);
  },
});
