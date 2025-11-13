// b_path:: src/internal/css-defaults.ts

/**
 * CSS default values for directional properties (kebab-case).
 * Used for partial longhand expansion when expandPartialLonghand option is enabled.
 */
export const CSS_DEFAULTS: Record<string, string> = {
  // Border width
  "border-top-width": "medium",
  "border-right-width": "medium",
  "border-bottom-width": "medium",
  "border-left-width": "medium",

  // Border style
  "border-top-style": "none",
  "border-right-style": "none",
  "border-bottom-style": "none",
  "border-left-style": "none",

  // Border color
  "border-top-color": "currentcolor",
  "border-right-color": "currentcolor",
  "border-bottom-color": "currentcolor",
  "border-left-color": "currentcolor",

  // Border radius
  "border-top-left-radius": "0",
  "border-top-right-radius": "0",
  "border-bottom-right-radius": "0",
  "border-bottom-left-radius": "0",

  // Margin
  "margin-top": "0",
  "margin-right": "0",
  "margin-bottom": "0",
  "margin-left": "0",

  // Padding
  "padding-top": "0",
  "padding-right": "0",
  "padding-bottom": "0",
  "padding-left": "0",

  // Positioning
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto",

  // Background position
  "background-position-x": "0%",
  "background-position-y": "0%",

  // Mask position
  "mask-position-x": "0%",
  "mask-position-y": "0%",

  // Object position
  "object-position-x": "50%",
  "object-position-y": "50%",

  // Scroll margin
  "scroll-margin-top": "0",
  "scroll-margin-right": "0",
  "scroll-margin-bottom": "0",
  "scroll-margin-left": "0",

  // Scroll padding
  "scroll-padding-top": "auto",
  "scroll-padding-right": "auto",
  "scroll-padding-bottom": "auto",
  "scroll-padding-left": "auto",
};
