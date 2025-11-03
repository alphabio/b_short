// b_path:: test/collapse.test.ts

import { describe, expect, test } from "vitest";
import { collapse, collapseRegistry, getCollapsibleShorthands } from "../src";

describe("Collapse API", () => {
  describe("collapse()", () => {
    test("collapses overflow with same values", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "hidden",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ overflow: "hidden" });
      expect(result.issues).toEqual([]);
    });

    test("collapses overflow with different values", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ overflow: "hidden auto" });
      expect(result.issues).toEqual([]);
    });

    test("keeps longhands if incomplete with warning", () => {
      const result = collapse({
        "overflow-x": "hidden",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ "overflow-x": "hidden" });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].name).toBe("incomplete-longhands");
      expect(result.issues[0].property).toBe("overflow");
    });

    test("mixes collapsed and non-collapsed properties", () => {
      const result = collapse({
        "overflow-x": "hidden",
        "overflow-y": "hidden",
        "margin-top": "10px",
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        overflow: "hidden",
        "margin-top": "10px",
      });
      expect(result.issues).toEqual([]);
    });

    test("returns empty object for empty input", () => {
      const result = collapse({});
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({});
      expect(result.issues).toEqual([]);
    });

    test("collapses flex-flow with both values", () => {
      const result = collapse({
        "flex-direction": "column",
        "flex-wrap": "wrap",
      });
      expect(result.result).toEqual({ "flex-flow": "column wrap" });
    });

    test("collapses flex-flow with single value", () => {
      const result = collapse({
        "flex-direction": "row-reverse",
      });
      expect(result.result).toEqual({ "flex-flow": "row-reverse" });
    });

    test("collapses flex to single number", () => {
      const result = collapse({
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": "0%",
      });
      expect(result.result).toEqual({ flex: "1" });
    });

    test("collapses flex to 'none'", () => {
      const result = collapse({
        "flex-grow": "0",
        "flex-shrink": "0",
        "flex-basis": "auto",
      });
      expect(result.result).toEqual({ flex: "none" });
    });

    test("collapses flex to 'auto'", () => {
      const result = collapse({
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": "auto",
      });
      expect(result.result).toEqual({ flex: "auto" });
    });

    test("collapses flex to 'initial'", () => {
      const result = collapse({
        "flex-grow": "0",
        "flex-shrink": "1",
        "flex-basis": "auto",
      });
      expect(result.result).toEqual({ flex: "initial" });
    });

    test("collapses flex to two numbers", () => {
      const result = collapse({
        "flex-grow": "1",
        "flex-shrink": "0",
        "flex-basis": "0%",
      });
      expect(result.result).toEqual({ flex: "1 0" });
    });

    test("collapses flex with number and basis", () => {
      const result = collapse({
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": "100px",
      });
      expect(result.result).toEqual({ flex: "1 100px" });
    });

    test("collapses flex to three values", () => {
      const result = collapse({
        "flex-grow": "2",
        "flex-shrink": "2",
        "flex-basis": "10em",
      });
      expect(result.result).toEqual({ flex: "2 2 10em" });
    });

    test("collapses flex with global keyword", () => {
      const result = collapse({
        "flex-grow": "inherit",
        "flex-shrink": "inherit",
        "flex-basis": "inherit",
      });
      expect(result.result).toEqual({ flex: "inherit" });
    });

    test("keeps flex longhands if incomplete", () => {
      const result = collapse({
        "flex-grow": "1",
        "flex-shrink": "1",
      });
      expect(result.result).toEqual({
        "flex-grow": "1",
        "flex-shrink": "1",
      });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].property).toBe("flex");
    });

    test("collapses place-content with same values", () => {
      const result = collapse({
        "align-content": "center",
        "justify-content": "center",
      });
      expect(result.result).toEqual({ "place-content": "center" });
    });

    test("collapses background with single image", () => {
      const result = collapse({
        "background-image": "url(test.png)",
        "background-color": "red",
      });
      expect(result.result).toEqual({ background: "url(test.png) red" });
    });

    test("collapses background with all defaults", () => {
      const result = collapse({
        "background-image": "url(test.png)",
        "background-position": "0% 0%",
        "background-size": "auto auto",
        "background-repeat": "repeat",
        "background-attachment": "scroll",
        "background-origin": "padding-box",
        "background-clip": "border-box",
        "background-color": "transparent",
      });
      expect(result.result).toEqual({ background: "url(test.png)" });
    });

    test("collapses background with position and size", () => {
      const result = collapse({
        "background-image": "url(test.png)",
        "background-position": "center center",
        "background-size": "cover",
      });
      expect(result.result).toEqual({ background: "url(test.png) center center / cover" });
    });

    test("collapses background multi-layer", () => {
      const result = collapse({
        "background-image": "url(a.png), url(b.png)",
        "background-repeat": "no-repeat, repeat-x",
        "background-color": "white",
      });
      expect(result.result).toEqual({
        background: "url(a.png) no-repeat, url(b.png) repeat-x white",
      });
    });

    test("collapses background color only", () => {
      const result = collapse({
        "background-color": "blue",
      });
      expect(result.result).toEqual({ background: "blue" });
    });

    test("keeps background longhands if incomplete", () => {
      const result = collapse({
        "background-image": "url(test.png)",
      });
      expect(result.result).toHaveProperty("background");
    });

    test("collapses transition simple", () => {
      const result = collapse({
        "transition-property": "opacity",
        "transition-duration": "400ms",
      });
      expect(result.result).toEqual({ transition: "opacity 400ms" });
    });

    test("collapses transition with all properties", () => {
      const result = collapse({
        "transition-property": "transform",
        "transition-duration": "300ms",
        "transition-timing-function": "ease-in",
        "transition-delay": "150ms",
      });
      expect(result.result).toEqual({ transition: "transform 300ms ease-in 150ms" });
    });

    test("collapses transition multi-layer", () => {
      const result = collapse({
        "transition-property": "opacity, transform",
        "transition-duration": "200ms, 300ms",
        "transition-timing-function": "linear, ease-out",
      });
      expect(result.result).toEqual({
        transition: "opacity 200ms linear, transform 300ms ease-out",
      });
    });

    test("collapses transition omitting defaults", () => {
      const result = collapse({
        "transition-property": "opacity",
        "transition-duration": "300ms",
        "transition-timing-function": "ease",
        "transition-delay": "0s",
      });
      expect(result.result).toEqual({ transition: "opacity 300ms" });
    });

    test("collapses place-content with different values", () => {
      const result = collapse({
        "align-content": "start",
        "justify-content": "space-between",
      });
      expect(result.result).toEqual({ "place-content": "start space-between" });
    });

    test("collapses place-items with same values", () => {
      const result = collapse({
        "align-items": "center",
        "justify-items": "center",
      });
      expect(result.result).toEqual({ "place-items": "center" });
    });

    test("collapses place-items with different values", () => {
      const result = collapse({
        "align-items": "start",
        "justify-items": "end",
      });
      expect(result.result).toEqual({ "place-items": "start end" });
    });

    test("collapses place-self with same values", () => {
      const result = collapse({
        "align-self": "center",
        "justify-self": "center",
      });
      expect(result.result).toEqual({ "place-self": "center" });
    });

    test("collapses place-self with different values", () => {
      const result = collapse({
        "align-self": "start",
        "justify-self": "end",
      });
      expect(result.result).toEqual({ "place-self": "start end" });
    });

    test("collapses columns with both values", () => {
      const result = collapse({
        "column-width": "12em",
        "column-count": "5",
      });
      expect(result.result).toEqual({ columns: "12em 5" });
    });

    test("collapses columns with auto", () => {
      const result = collapse({
        "column-width": "auto",
        "column-count": "auto",
      });
      expect(result.result).toEqual({ columns: "auto" });
    });

    test("collapses contain-intrinsic-size with same values", () => {
      const result = collapse({
        "contain-intrinsic-width": "100px",
        "contain-intrinsic-height": "100px",
      });
      expect(result.result).toEqual({ "contain-intrinsic-size": "100px" });
    });

    test("collapses list-style with defaults", () => {
      const result = collapse({
        "list-style-type": "disc",
        "list-style-position": "outside",
        "list-style-image": "none",
      });
      expect(result.result).toEqual({ "list-style": "disc" });
    });

    test("collapses list-style with none", () => {
      const result = collapse({
        "list-style-type": "none",
        "list-style-position": "outside",
        "list-style-image": "none",
      });
      expect(result.result).toEqual({ "list-style": "none" });
    });

    test("collapses text-emphasis with default color", () => {
      const result = collapse({
        "text-emphasis-style": "filled dot",
        "text-emphasis-color": "currentcolor",
      });
      expect(result.result).toEqual({ "text-emphasis": "filled dot" });
    });

    test("collapses text-decoration with line only", () => {
      const result = collapse({
        "text-decoration-line": "underline",
        "text-decoration-style": "solid",
        "text-decoration-color": "currentColor",
        "text-decoration-thickness": "auto",
      });
      expect(result.result).toEqual({ "text-decoration": "underline" });
    });

    test("collapses border-radius with all same", () => {
      const result = collapse({
        "border-top-left-radius": "10px",
        "border-top-right-radius": "10px",
        "border-bottom-right-radius": "10px",
        "border-bottom-left-radius": "10px",
      });
      expect(result.result).toEqual({ "border-radius": "10px" });
    });

    test("collapses outline with non-defaults", () => {
      const result = collapse({
        "outline-width": "2px",
        "outline-style": "solid",
        "outline-color": "red",
      });
      expect(result.result).toEqual({ outline: "2px solid red" });
    });

    test("collapses column-rule with defaults", () => {
      const result = collapse({
        "column-rule-width": "medium",
        "column-rule-style": "none",
        "column-rule-color": "currentcolor",
      });
      expect(result.result).toEqual({ "column-rule": "none" });
    });

    test("collapses grid-column with auto end", () => {
      const result = collapse({
        "grid-column-start": "2",
        "grid-column-end": "auto",
      });
      expect(result.result).toEqual({ "grid-column": "2" });
    });

    test("collapses grid-row with start and end", () => {
      const result = collapse({
        "grid-row-start": "2",
        "grid-row-end": "4",
      });
      expect(result.result).toEqual({ "grid-row": "2 / 4" });
    });

    test("collapses font with minimal values", () => {
      const result = collapse({
        "font-size": "16px",
        "font-family": "Arial",
      });
      expect(result.result).toEqual({ font: "16px Arial" });
    });

    test("collapses font with all optional values", () => {
      const result = collapse({
        "font-style": "italic",
        "font-variant": "small-caps",
        "font-weight": "bold",
        "font-stretch": "condensed",
        "font-size": "16px",
        "line-height": "1.5",
        "font-family": "Arial",
      });
      expect(result.result).toEqual({ font: "italic small-caps bold condensed 16px/1.5 Arial" });
    });

    test("collapses font omitting normal values", () => {
      const result = collapse({
        "font-style": "normal",
        "font-variant": "normal",
        "font-weight": "bold",
        "font-stretch": "normal",
        "font-size": "14px",
        "font-family": '"Helvetica Neue"',
      });
      expect(result.result).toEqual({ font: 'bold 14px "Helvetica Neue"' });
    });

    test("collapses font with line-height", () => {
      const result = collapse({
        "font-size": "12px",
        "line-height": "1.5",
        "font-family": "monospace",
      });
      expect(result.result).toEqual({ font: "12px/1.5 monospace" });
    });

    test("does not collapse font without size", () => {
      const result = collapse({
        "font-family": "Arial",
        "font-weight": "bold",
      });
      expect(result.result).toEqual({
        "font-family": "Arial",
        "font-weight": "bold",
      });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].property).toBe("font");
    });

    test("does not collapse font without family", () => {
      const result = collapse({
        "font-size": "16px",
        "font-weight": "bold",
      });
      expect(result.result).toEqual({
        "font-size": "16px",
        "font-weight": "bold",
      });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].property).toBe("font");
    });

    test("collapses grid to none when all defaults", () => {
      const result = collapse({
        "grid-template-rows": "none",
        "grid-template-columns": "none",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toEqual({
        grid: "none",
      });
    });

    test("collapses grid simple template", () => {
      const result = collapse({
        "grid-template-rows": "100px 200px",
        "grid-template-columns": "1fr 2fr",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toEqual({
        grid: "100px 200px / 1fr 2fr",
      });
    });

    test("collapses grid auto-flow columns", () => {
      const result = collapse({
        "grid-template-rows": "100px 200px",
        "grid-template-columns": "none",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toMatchObject({ grid: "100px 200px / auto-flow" });
    });

    test("collapses grid auto-flow columns with dense", () => {
      const result = collapse({
        "grid-template-rows": "100px",
        "grid-template-columns": "none",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "50px",
        "grid-auto-flow": "row dense",
      });
      expect(result.result).toMatchObject({ grid: "100px / auto-flow dense 50px" });
    });

    test("collapses grid auto-flow rows", () => {
      const result = collapse({
        "grid-template-rows": "none",
        "grid-template-columns": "100px 200px",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "column",
      });
      expect(result.result).toMatchObject({ grid: "auto-flow / 100px 200px" });
    });

    test("collapses grid auto-flow rows with auto-rows", () => {
      const result = collapse({
        "grid-template-rows": "none",
        "grid-template-columns": "1fr 2fr",
        "grid-template-areas": "none",
        "grid-auto-rows": "minmax(100px, auto)",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "column",
      });
      expect(result.result).toMatchObject({ grid: "auto-flow minmax(100px, auto) / 1fr 2fr" });
    });

    test("collapses grid with template areas", () => {
      const result = collapse({
        "grid-template-rows": "100px",
        "grid-template-columns": "1fr",
        "grid-template-areas": '"header"',
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toMatchObject({ grid: '"header" 100px / 1fr' });
    });

    test("collapses grid with multi-row template areas", () => {
      const result = collapse({
        "grid-template-rows": "100px 1fr",
        "grid-template-columns": "200px 1fr",
        "grid-template-areas": '"header header" "sidebar content"',
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toMatchObject({
        grid: '"header header" 100px "sidebar content" 1fr / 200px 1fr',
      });
    });

    test("collapses grid with custom gaps", () => {
      const result = collapse({
        "grid-template-rows": "100px",
        "grid-template-columns": "1fr",
        "grid-template-areas": "none",
        "grid-auto-rows": "auto",
        "grid-auto-columns": "auto",
        "grid-auto-flow": "row",
      });
      expect(result.result).toMatchObject({
        grid: "100px / 1fr",
      });
    });

    test("collapses grid-area named area", () => {
      const result = collapse({
        "grid-row-start": "header",
        "grid-column-start": "header",
        "grid-row-end": "header",
        "grid-column-end": "header",
      });
      expect(result.result).toEqual({ "grid-area": "header" });
    });

    test("collapses CSS string input", () => {
      const result = collapse(`
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 10px;
      `);
      expect(result.result).toContain("overflow: hidden auto");
      expect(result.result).toContain("margin-top: 10px");
    });

    test("collapses CSS string with same values", () => {
      const result = collapse(`
        overflow-x: hidden;
        overflow-y: hidden;
      `);
      expect(result.result).toContain("overflow: hidden");
      expect(result.result).not.toContain("overflow-x");
      expect(result.result).not.toContain("overflow-y");
    });

    test("collapses CSS string with multiple shorthands", () => {
      const result = collapse(`
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        justify-items: center;
      `);
      expect(result.result).toContain("flex-flow: column wrap");
      expect(result.result).toContain("place-items: center");
    });

    test("keeps longhand CSS string when cannot collapse", () => {
      const result = collapse(`
        overflow-x: hidden;
        margin-top: 10px;
      `);
      expect(result.result).toContain("overflow-x: hidden");
      expect(result.result).toContain("margin-top: 10px");
    });

    test("collapses CSS string with default indent (0)", () => {
      const result = collapse(`
        font-size: 16px;
        font-family: Arial;
      `);
      expect(result.result).toBe("font: 16px Arial;");
    });

    test("collapses CSS string with custom indent", () => {
      const result = collapse(
        `
        font-size: 16px;
        font-family: Arial;
      `,
        { indent: 2 }
      );
      expect(result.result).toBe("    font: 16px Arial;");
    });

    test("collapses CSS string with indent 1", () => {
      const result = collapse(
        `
        overflow-x: hidden;
        overflow-y: auto;
      `,
        { indent: 1 }
      );
      expect(result.result).toBe("  overflow: hidden auto;");
    });
  });

  describe("getCollapsibleShorthands()", () => {
    test("returns shorthands that can be collapsed", () => {
      const shorthands = getCollapsibleShorthands({
        "overflow-x": "hidden",
        "overflow-y": "auto",
      });
      expect(shorthands).toEqual(["overflow"]);
    });

    test("returns empty array if cannot collapse", () => {
      const shorthands = getCollapsibleShorthands({
        "overflow-x": "hidden",
      });
      expect(shorthands).toEqual([]);
    });
  });

  describe("collapseRegistry", () => {
    test("has overflow handler", () => {
      expect(collapseRegistry.has("overflow")).toBe(true);
    });

    test("get returns overflow handler", () => {
      const handler = collapseRegistry.get("overflow");
      expect(handler).toBeDefined();
      expect(handler?.meta.shorthand).toBe("overflow");
    });

    test("getAllShorthands includes overflow", () => {
      const shorthands = collapseRegistry.getAllShorthands();
      expect(shorthands).toContain("overflow");
    });

    test("has flex-flow handler", () => {
      expect(collapseRegistry.has("flex-flow")).toBe(true);
    });

    test("has flex handler", () => {
      expect(collapseRegistry.has("flex")).toBe(true);
    });

    test("has place-content handler", () => {
      expect(collapseRegistry.has("place-content")).toBe(true);
    });

    test("has place-items handler", () => {
      expect(collapseRegistry.has("place-items")).toBe(true);
    });

    test("has place-self handler", () => {
      expect(collapseRegistry.has("place-self")).toBe(true);
    });

    test("getAllShorthands returns all registered handlers", () => {
      const shorthands = collapseRegistry.getAllShorthands();
      expect(shorthands).toContain("overflow");
      expect(shorthands).toContain("flex-flow");
      expect(shorthands).toContain("place-content");
      expect(shorthands).toContain("place-items");
      expect(shorthands).toContain("place-self");
      expect(shorthands.length).toBeGreaterThanOrEqual(5);
    });
  });
});
