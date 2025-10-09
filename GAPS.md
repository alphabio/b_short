Okay, a gap analysis for 100% shorthand to longhand CSS property expansion support.

Based on the provided code, here's an analysis of what's currently supported and what common CSS shorthands are *not* explicitly handled, representing the gaps.

---

### Current Support (from `src/index.ts` `shorthand` object)

The library currently supports the following CSS shorthand properties:

1.  **`font`**: Expands into `font-family`, `font-size`, `line-height`, `font-style`, `font-weight`, `font-variant`, `font-stretch`.
2.  **`padding`**: Expands into `padding-top`, `padding-right`, `padding-bottom`, `padding-left`.
3.  **`margin`**: Expands into `margin-top`, `margin-right`, `margin-bottom`, `margin-left`.
4.  **`border`**: Expands into `border-width`, `border-style`, `border-color` (for all four sides).
    *   **`border-width`**: Expands into `border-top-width`, `border-right-width`, `border-bottom-width`, `border-left-width`.
    *   **`border-style`**: Expands into `border-top-style`, `border-right-style`, `border-bottom-style`, `border-left-style`.
    *   **`border-color`**: Expands into `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color`.
    *   **`border-top`**: Expands into `border-top-width`, `border-top-style`, `border-top-color`.
    *   **`border-right`**: Expands into `border-right-width`, `border-right-style`, `border-right-color`.
    *   **`border-bottom`**: Expands into `border-bottom-width`, `border-bottom-style`, `border-bottom-color`.
    *   **`border-left`**: Expands into `border-left-width`, `border-left-style`, `border-left-color`.
5.  **`border-radius`**: Expands into `border-top-left-radius`, `border-top-right-radius`, `border-bottom-right-radius`, `border-bottom-left-radius`.
6.  **`background`**: Expands into `background-image`, `background-position`, `background-size`, `background-repeat`, `background-attachment`, `background-origin`, `background-clip`, and `background-color`. Crucially, it handles *multi-layer backgrounds*.
7.  **`outline`**: Expands into `outline-width`, `outline-style`, `outline-color`.

---

### Gap Analysis: Common CSS Shorthands NOT Supported

To achieve "100% support," you would need to implement parsers for a significant number of other CSS shorthand properties. Here's a list of common and important ones missing from your `shorthand` object:

1.  **`animation`**:
    *   Longhands: `animation-name`, `animation-duration`, `animation-timing-function`, `animation-delay`, `animation-iteration-count`, `animation-direction`, `animation-fill-mode`, `animation-play-state`.
    *   *Complexity:* High. Similar to `background` in that it can be multi-layer (comma-separated for multiple animations).

2.  **`columns`**:
    *   Longhands: `column-width`, `column-count`.
    *   *Complexity:* Low to Medium.

3.  **`flex`**:
    *   Longhands: `flex-grow`, `flex-shrink`, `flex-basis`.
    *   *Complexity:* Medium. `flex-basis` can be a length, `auto`, or `content`.

4.  **`flex-flow`**:
    *   Longhands: `flex-direction`, `flex-wrap`.
    *   *Complexity:* Low.

5.  **`grid`**: (and related `grid-template`, `grid-area`, etc.)
    *   Longhands: `grid-template-rows`, `grid-template-columns`, `grid-template-areas`, `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`, `grid-column-gap`, `grid-row-gap`.
    *   *Complexity:* Very High. This is one of the most complex shorthands, often involving ASCII art for `grid-template-areas` and various track sizing functions (`minmax`, `fit-content`, `repeat`, `fr` unit).

6.  **`grid-area`**:
    *   Longhands: `grid-row-start`, `grid-column-start`, `grid-row-end`, `grid-column-end`. Can also refer to a named `grid-area`.
    *   *Complexity:* Medium.

7.  **`grid-column`**:
    *   Longhands: `grid-column-start`, `grid-column-end`.
    *   *Complexity:* Low.

8.  **`grid-row`**:
    *   Longhands: `grid-row-start`, `grid-row-end`.
    *   *Complexity:* Low.

9.  **`list-style`**:
    *   Longhands: `list-style-type`, `list-style-position`, `list-style-image`.
    *   *Complexity:* Low to Medium. `list-style-image` involves `url()`.

10. **`mask`**:
    *   Longhands: `mask-image`, `mask-mode`, `mask-repeat`, `mask-position`, `mask-size`, `mask-origin`, `mask-clip`, `mask-composite`.
    *   *Complexity:* High. Very similar to `background` in its structure and potential for multiple layers.

11. **`offset`** (motion path):
    *   Longhands: `offset-path`, `offset-distance`, `offset-position`, `offset-rotate`, `offset-anchor`.
    *   *Complexity:* Medium to High.

12. **`overflow`**:
    *   Longhands: `overflow-x`, `overflow-y`.
    *   *Complexity:* Low.

13. **`place-content`**:
    *   Longhands: `align-content`, `justify-content`.
    *   *Complexity:* Low.

14. **`place-items`**:
    *   Longhands: `align-items`, `justify-items`.
    *   *Complexity:* Low.

15. **`place-self`**:
    *   Longhands: `align-self`, `justify-self`.
    *   *Complexity:* Low.

16. **`text-decoration`**:
    *   Longhands: `text-decoration-line`, `text-decoration-color`, `text-decoration-style`, `text-decoration-thickness`.
    *   *Complexity:* Medium.

17. **`text-emphasis`**:
    *   Longhands: `text-emphasis-style`, `text-emphasis-color`.
    *   *Complexity:* Low.

18. **`transition`**:
    *   Longhands: `transition-property`, `transition-duration`, `transition-timing-function`, `transition-delay`.
    *   *Complexity:* High. Similar to `animation` and `background`, it can be multi-layer.

19. **`contain`**:
    *   Longhands: `content-visibility`, `contain-intrinsic-size`, `contain-intrinsic-width`, `contain-intrinsic-height`.
    *   *Complexity:* Medium.

20. **`column-rule`**:
    *   Longhands: `column-rule-width`, `column-rule-style`, `column-rule-color`.
    *   *Complexity:* Similar to `border` or `outline`.

21. **`inset`**:
    *   Longhands: `top`, `right`, `bottom`, `left`.
    *   *Complexity:* Low. (Similar to padding/margin, but for positioned elements)

---

### General Observations & Areas for Improvement

*   **Robustness of Parsing:** While `background-layers.ts` shows good effort in handling nested functions and commas, some of the simpler parsers (e.g., in `background.ts` for single layers) use `split(/\s+/)` which might be too simplistic for all edge cases or future CSS syntax. For true 100% robustness, using a proper CSS parser library (like `css-tree` which was mentioned but not used in `parseBackgroundLayers`) would be ideal, but that goes against the current self-contained approach.
*   **Keyword Handling:** Many properties can accept `inherit`, `initial`, `unset`, `revert`. Your `background.ts`, `border.ts`, `font.ts`, and `outline.ts` handle `inherit` and `initial` for the full shorthand. Ensure this is consistent for all new shorthands.
*   **Edge Cases:** CSS parsing can be notoriously tricky due to various value types, function notations, and vendor prefixes (though vendor prefixes are usually handled by other tools or runtime). Thorough unit testing for each new shorthand with diverse valid and invalid inputs will be crucial.
*   **Order of Values:** For many shorthands (like `border`, `font`), the order of values matters, but for some (like `background`), it's more flexible. Your parsers need to correctly identify and assign values regardless of their order if the CSS spec allows for it.
*   **Implicit Values:** Some shorthands have implicit values when parts are omitted (e.g., `flex: 1` implies `flex-grow: 1, flex-shrink: 1, flex-basis: 0%`). This requires careful handling in the parsing logic.

---

### Conclusion for 100% Support

Achieving 100% support for CSS shorthand-to-longhand expansion is a significant undertaking. Your current codebase has a good foundation, especially with the advanced multi-layer parsing for `background`.

The biggest gaps are the **`animation`**, **`transition`**, **`grid`**, and **`mask`** shorthands, which are complex and can involve multiple layers. Implementing these will likely require similar sophisticated parsing logic as developed for `background`. Many other shorthands are simpler and can likely be handled with extensions of the `directional` or `all` (like in `border.ts`) patterns.

To visually represent this, imagine a spectrum of CSS shorthands. Your current library covers a good segment, particularly for box model and basic styling. The "gaps" are primarily in areas related to animations, transitions, and layout (Flexbox/Grid advanced usage), which often have more intricate syntax.

Here's a conceptual image to illustrate the current coverage and the remaining gaps:
