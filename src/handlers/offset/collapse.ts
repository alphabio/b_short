// b_path:: src/handlers/offset/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Default values for offset properties per CSS specification.
 */
const OFFSET_DEFAULTS = {
  position: "normal",
  path: "none",
  distance: "0",
  rotate: "auto",
  anchor: "auto",
} as const;

/**
 * Collapse handler for the offset shorthand property.
 *
 * Reconstructs `offset` from its 5 longhand properties.
 *
 * Rules:
 * - Default values can be omitted
 * - Syntax: [position]? [path]? [distance]? [rotate]? [/ anchor]?
 * - position must come first if present
 * - path must come before distance and rotate
 * - anchor is separated by / and comes at the end
 */
export const offsetCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "offset",
    longhands: [
      "offset-position",
      "offset-path",
      "offset-distance",
      "offset-rotate",
      "offset-anchor",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const position = properties["offset-position"];
    const path = properties["offset-path"];
    const distance = properties["offset-distance"];
    const rotate = properties["offset-rotate"];
    const anchor = properties["offset-anchor"];

    // Need at least one property
    if (!position && !path && !distance && !rotate && !anchor) {
      return undefined;
    }

    const mainParts: string[] = [];

    // Add position if not default
    if (position && position !== OFFSET_DEFAULTS.position) {
      mainParts.push(position);
    }

    // Add path if not default
    if (path && path !== OFFSET_DEFAULTS.path) {
      mainParts.push(path);
    }

    // Add distance if not default
    if (distance && distance !== OFFSET_DEFAULTS.distance) {
      mainParts.push(distance);
    }

    // Add rotate if not default
    if (rotate && rotate !== OFFSET_DEFAULTS.rotate) {
      mainParts.push(rotate);
    }

    // Build final value with anchor if present
    let result = mainParts.join(" ");

    // Add anchor if not default
    if (anchor && anchor !== OFFSET_DEFAULTS.anchor) {
      if (result) {
        result += ` / ${anchor}`;
      } else {
        // Anchor only is unusual but valid
        result = `/ ${anchor}`;
      }
    }

    // If nothing was added, return undefined
    if (!result) {
      return undefined;
    }

    return result;
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Need at least one offset property
    return !!(
      properties["offset-position"] ||
      properties["offset-path"] ||
      properties["offset-distance"] ||
      properties["offset-rotate"] ||
      properties["offset-anchor"]
    );
  },
});
