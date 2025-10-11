// b_path:: test/valid-expansions.test.ts
import { describe, expect, it } from "vitest";
import expand from "../src/index";
import animation from "./fixtures/animation.json";
import background from "./fixtures/background.json";
import border from "./fixtures/border.json";
import borderRadius from "./fixtures/border-radius.json";
import columnRule from "./fixtures/column-rule.json";
import columns from "./fixtures/columns.json";
import containIntrinsicSize from "./fixtures/contain-intrinsic-size.json";
import flex from "./fixtures/flex.json";
import flexFlow from "./fixtures/flex-flow.json";
import font from "./fixtures/font.json";
import grid from "./fixtures/grid.json";
import inset from "./fixtures/inset.json";
import listStyle from "./fixtures/list-style.json";
import margin from "./fixtures/margin.json";
import offset from "./fixtures/offset.json";
import outline from "./fixtures/outline.json";
import overflow from "./fixtures/overflow.json";
import padding from "./fixtures/padding.json";
import placeContent from "./fixtures/place-content.json";
import placeItems from "./fixtures/place-items.json";
import placeSelf from "./fixtures/place-self.json";
import textDecoration from "./fixtures/text-decoration.json";
import textEmphasis from "./fixtures/text-emphasis.json";
import transition from "./fixtures/transition.json";
import { assertNoDuplicateProperties } from "./helpers/assertions";

const testProperty = (name: string, fixture: Record<string, Record<string, string>>) => {
  describe(name, () => {
    Object.keys(fixture).forEach((key: string) => {
      it(`should expand "${key}"`, () => {
        const declaration = `${name}: ${key};`;
        const { result } = expand(declaration, { format: "js" });
        assertNoDuplicateProperties(result, `${name}: ${key}`);
        expect(result).toEqual(fixture[key]);
      });
    });
  });
};

testProperty("animation", animation);
testProperty("margin", margin);
testProperty("padding", padding);
testProperty("background", background);
testProperty("font", font);
testProperty("grid", grid);
testProperty("border", border);
testProperty("border-radius", borderRadius);
testProperty("offset", offset);
testProperty("outline", outline);
testProperty("column-rule", columnRule);
testProperty("contain-intrinsic-size", containIntrinsicSize);
testProperty("overflow", overflow);
testProperty("columns", columns);
testProperty("flex", flex);
testProperty("flex-flow", flexFlow);
testProperty("text-decoration", textDecoration);
testProperty("text-emphasis", textEmphasis);
testProperty("inset", inset);
testProperty("list-style", listStyle);
testProperty("place-content", placeContent);
testProperty("place-items", placeItems);
testProperty("place-self", placeSelf);
testProperty("transition", transition);
