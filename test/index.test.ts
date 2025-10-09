// b_path:: test/index.test.ts
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

// Multi-layer background test fixtures
interface TestCase {
  input: string;
  expected: Record<string, string> | undefined;
  name?: string;
}

const backgroundLayerTestFixtures: TestCase[] = [
  // --- Property Distribution Rules: Multiple Layers, Varying Values ---

  {
    name: "Test defaults with single layer",
    input: "background: red;",
    expected: {
      "background-color": "red",
    },
  },
  {
    name: "Two layers: image, position (single value for both)",
    input: "background: url(a.png) center, url(b.png) 10px;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center, 10px",
      "background-size": "auto auto, auto auto",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
    },
  },
  {
    name: "Three layers: image, repeat (two values, less than layers)",
    input: "background: url(a.png) no-repeat, url(b.png) repeat-x, url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-repeat": "no-repeat, repeat-x, repeat",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, position (one value, less than layers)",
    input: "background: url(a.png) 10px, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-position": "10px, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, size (one value for first, others default)",
    input: "background: url(a.png) / 50%, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-size": "50%, auto auto, auto auto",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, attachment (one value for first, others default)",
    input: "background: url(a.png) fixed, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-attachment": "fixed, scroll, scroll",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, origin (one value for first, others default)",
    input: "background: url(a.png) content-box, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-origin": "content-box, padding-box, padding-box",
      "background-clip": "content-box, border-box, border-box",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
    },
  },
  {
    name: "Four layers: image, two repeats, two positions, one size",
    input:
      "background: url(a.png) no-repeat 10px 10px / 50%, url(b.png) repeat-x 20px, url(c.png), url(d.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png), url(d.png)",
      "background-repeat": "no-repeat, repeat-x, repeat, repeat",
      "background-position": "10px 10px, 20px, 0% 0%, 0% 0%",
      "background-size": "50%, auto auto, auto auto, auto auto",
      "background-attachment": "scroll, scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box, border-box",
    },
  },
  {
    name: "Two layers: image, full properties for first, minimal for second",
    input:
      "background: url(a.png) no-repeat fixed 10% 20% / cover padding-box border-box red, url(b.png) center;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat",
      "background-attachment": "fixed, scroll",
      "background-position": "10% 20%, center",
      "background-size": "cover, auto auto",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "red",
    },
  },
  {
    name: "Two layers: image, color in second layer",
    input: "background: url(a.png) no-repeat, url(b.png) blue;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "blue",
    },
  },
  {
    name: "Two layers: image, color in first layer, then another layer (color from first should be global)",
    input: "background: url(a.png) red, url(b.png) no-repeat;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "repeat, no-repeat",
      "background-attachment": "scroll, scroll",
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "red",
    },
  },
  {
    name: "Three layers: no images, just color, none, transparent",
    input: "background: none, transparent, red;",
    expected: {
      "background-image": "none, none, none",
      "background-color": "red",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: position values (two provided for three layers)",
    input: "background: url(a.png) 10% 20%, url(b.png) 30% 40%, url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-position": "10% 20%, 30% 40%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: size values (one provided for three layers)",
    input: "background: url(a.png) / cover, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-size": "cover, auto auto, auto auto",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: origin values (two provided for three layers)",
    input: "background: url(a.png) border-box, url(b.png) content-box, url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-origin": "border-box, content-box, padding-box",
      "background-clip": "border-box, content-box, border-box",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
    },
  },
  {
    name: "Three layers: clip values (one explicit, one implicit for origin, one default)",
    input: "background: url(a.png) padding-box content-box, url(b.png) border-box, url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-origin": "padding-box, border-box, padding-box",
      "background-clip": "content-box, border-box, border-box",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
    },
  },
  {
    name: "Multiple layers, same properties (all default for first, then specific for second)",
    input: "background: url(a.png), url(b.png) 10px 20px no-repeat;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "0% 0%, 10px 20px",
      "background-repeat": "repeat, no-repeat",
      "background-size": "auto auto, auto auto",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
    },
  },
  {
    name: "Multiple layers, mixed values for position and size",
    input: "background: url(a.png) left / 100px, url(b.png) center top / contain;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "left, center top",
      "background-size": "100px, contain",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
    },
  },
];

const testProperty = (name: string, fixture: Record<string, Record<string, string>>) => {
  describe(name, () => {
    Object.keys(fixture).forEach((key: string) => {
      it(`should expand "${key}"`, () => {
        const declaration = `${name}: ${key};`;
        const { result } = expand(declaration, { format: "js" });
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

describe("grid (invalid cases)", () => {
  it("should pass through invalid auto-flow position in explicit rows", () => {
    const { result } = expand("grid: 100px / 200px auto-flow;", { format: "js" });
    expect(result).toEqual({ grid: "100px / 200px auto-flow" });
  });

  it("should pass through invalid auto-flow position in explicit columns", () => {
    const { result } = expand("grid: 200px auto-flow / 100px;", { format: "js" });
    expect(result).toEqual({ grid: "200px auto-flow / 100px" });
  });
});

describe("overflow (invalid cases)", () => {
  it("overflow: invalid token", () => {
    const { result } = expand("overflow: foo;", { format: "js" });
    expect(result).toEqual({ overflow: "foo" });
  });
});

describe("columns (invalid cases)", () => {
  it("columns: invalid token", () => {
    const { result } = expand("columns: foo;", { format: "js" });
    expect(result).toEqual({ columns: "foo" });
  });

  it("columns: 0", () => {
    const { result } = expand("columns: 0;", { format: "js" });
    expect(result).toEqual({ columns: "0" });
  });
});

describe("inset (invalid cases)", () => {
  it("inset: invalid token", () => {
    const { result } = expand("inset: foo bar baz baz baz;", { format: "js" });
    expect(result).toEqual({ inset: "foo bar baz baz baz" });
  });
});

describe("flex-flow (invalid cases)", () => {
  it("should pass through invalid token", () => {
    const { result } = expand("flex-flow: foo;", { format: "js" });
    expect(result).toEqual({ "flex-flow": "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("flex-flow: row wrap nowrap;", { format: "js" });
    expect(result).toEqual({ "flex-flow": "row wrap nowrap" });
  });

  it("should pass through duplicate direction", () => {
    const { result } = expand("flex-flow: row column;", { format: "js" });
    expect(result).toEqual({ "flex-flow": "row column" });
  });
});

describe("flex (invalid cases)", () => {
  it("should pass through invalid token", () => {
    const { result } = expand("flex: foo;", { format: "js" });
    expect(result).toEqual({ flex: "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("flex: 1 1 100px auto;", { format: "js" });
    expect(result).toEqual({ flex: "1 1 100px auto" });
  });

  it("should pass through wrong order", () => {
    const { result } = expand("flex: 100px 1;", { format: "js" });
    expect(result).toEqual({ flex: "100px 1" });
  });

  it("should pass through two basis values", () => {
    const { result } = expand("flex: 100px 50%;", { format: "js" });
    expect(result).toEqual({ flex: "100px 50%" });
  });
});

describe("text-decoration (invalid cases)", () => {
  it("text-decoration: foo", () => {
    const { result } = expand("text-decoration: foo;", { format: "js" });
    expect(result).toEqual({ "text-decoration": "foo" });
  });

  it("text-decoration: underline underline", () => {
    const { result } = expand("text-decoration: underline underline;", { format: "js" });
    expect(result).toEqual({ "text-decoration": "underline underline" });
  });

  it("text-decoration: solid dotted", () => {
    const { result } = expand("text-decoration: solid dotted;", { format: "js" });
    expect(result).toEqual({ "text-decoration": "solid dotted" });
  });

  it("text-decoration: none underline", () => {
    const { result } = expand("text-decoration: none underline;", { format: "js" });
    expect(result).toEqual({ "text-decoration": "none underline" });
  });

  it("text-decoration: overline none", () => {
    const { result } = expand("text-decoration: overline none;", { format: "js" });
    expect(result).toEqual({ "text-decoration": "overline none" });
  });
});

describe("text-emphasis (invalid cases)", () => {
  it("text-emphasis: foo", () => {
    const { result } = expand("text-emphasis: foo;", { format: "js" });
    expect(result).toEqual({ "text-emphasis": "foo" });
  });

  it("text-emphasis: red blue", () => {
    const { result } = expand("text-emphasis: red blue;", { format: "js" });
    expect(result).toEqual({ "text-emphasis": "red blue" });
  });

  it("text-emphasis: filled open", () => {
    const { result } = expand("text-emphasis: filled open;", { format: "js" });
    expect(result).toEqual({ "text-emphasis": "filled open" });
  });

  it('text-emphasis: "※" dot', () => {
    const { result } = expand('text-emphasis: "※" dot;', { format: "js" });
    expect(result).toEqual({ "text-emphasis": '"※" dot' });
  });

  it("text-emphasis: dot filled", () => {
    const { result } = expand("text-emphasis: dot filled;", { format: "js" });
    expect(result).toEqual({ "text-emphasis": "dot filled" });
  });
});

describe("list-style (invalid cases)", () => {
  it("list-style: foo", () => {
    const { result } = expand("list-style: foo;", { format: "js" });
    expect(result).toEqual({ "list-style-type": "foo" });
  });

  it("list-style: inside outside", () => {
    const { result } = expand("list-style: inside outside;", { format: "js" });
    expect(result).toEqual({ "list-style": "inside outside" });
  });

  it("list-style: url(a.png) url(b.png)", () => {
    const { result } = expand("list-style: url(a.png) url(b.png);", { format: "js" });
    expect(result).toEqual({ "list-style": "url(a.png) url(b.png)" });
  });

  it("list-style: disc none", () => {
    const { result } = expand("list-style: disc none;", { format: "js" });
    expect(result).toEqual({ "list-style": "disc none" });
  });
});

describe("place-content (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-content: foo;", { format: "js" });
    expect(result).toEqual({ "place-content": "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-content: center start end;", { format: "js" });
    expect(result).toEqual({ "place-content": "center start end" });
  });

  it("should pass through invalid compound keyword", () => {
    const { result } = expand("place-content: safe;", { format: "js" });
    expect(result).toEqual({ "place-content": "safe" });
  });
});

describe("place-items (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-items: foo;", { format: "js" });
    expect(result).toEqual({ "place-items": "foo" });
  });

  it("should pass through left/right as single value", () => {
    const { result } = expand("place-items: left;", { format: "js" });
    expect(result).toEqual({ "place-items": "left" });
  });

  it("should pass through left/right as first value", () => {
    const { result } = expand("place-items: left center;", { format: "js" });
    expect(result).toEqual({ "place-items": "left center" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-items: center start end;", { format: "js" });
    expect(result).toEqual({ "place-items": "center start end" });
  });
});

describe("place-self (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-self: foo;", { format: "js" });
    expect(result).toEqual({ "place-self": "foo" });
  });

  it("should pass through left/right as single value", () => {
    const { result } = expand("place-self: right;", { format: "js" });
    expect(result).toEqual({ "place-self": "right" });
  });

  it("should pass through left/right as first value", () => {
    const { result } = expand("place-self: right center;", { format: "js" });
    expect(result).toEqual({ "place-self": "right center" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-self: auto center start;", { format: "js" });
    expect(result).toEqual({ "place-self": "auto center start" });
  });
});

describe("column-rule (invalid cases)", () => {
  it("column-rule: foo", () => {
    const { result } = expand("column-rule: foo;", { format: "js" });
    expect(result).toEqual({ "column-rule": "foo" });
  });

  it("column-rule: 1px solid red blue", () => {
    const { result } = expand("column-rule: 1px solid red blue;", { format: "js" });
    expect(result).toEqual({ "column-rule": "1px solid red blue" });
  });

  it("column-rule: 1px 2px", () => {
    const { result } = expand("column-rule: 1px 2px;", { format: "js" });
    expect(result).toEqual({ "column-rule": "1px 2px" });
  });

  it("column-rule: solid dotted", () => {
    const { result } = expand("column-rule: solid dotted;", { format: "js" });
    expect(result).toEqual({ "column-rule": "solid dotted" });
  });

  it("column-rule: red blue", () => {
    const { result } = expand("column-rule: red blue;", { format: "js" });
    expect(result).toEqual({ "column-rule": "red blue" });
  });
});

describe("contain-intrinsic-size (invalid cases)", () => {
  it("contain-intrinsic-size: foo", () => {
    const { result } = expand("contain-intrinsic-size: foo;", { format: "js" });
    expect(result).toEqual({ "contain-intrinsic-size": "foo" });
  });

  it("contain-intrinsic-size: 100px 200px 300px", () => {
    const { result } = expand("contain-intrinsic-size: 100px 200px 300px;", { format: "js" });
    expect(result).toEqual({ "contain-intrinsic-size": "100px 200px 300px" });
  });

  it("contain-intrinsic-size: auto", () => {
    const { result } = expand("contain-intrinsic-size: auto;", { format: "js" });
    expect(result).toEqual({ "contain-intrinsic-size": "auto" });
  });

  it("contain-intrinsic-size: auto auto", () => {
    const { result } = expand("contain-intrinsic-size: auto auto;", { format: "js" });
    expect(result).toEqual({ "contain-intrinsic-size": "auto auto" });
  });
});

describe("offset (invalid cases)", () => {
  it("offset: foo", () => {
    const { result } = expand("offset: foo;", { format: "js" });
    expect(result).toEqual({ offset: "foo" });
  });

  it("offset: path('test') path('test2')", () => {
    const { result } = expand("offset: path('test') path('test2');", { format: "js" });
    expect(result).toEqual({ offset: "path('test') path('test2')" });
  });

  it("offset: 100px 200px / 300px / 400px", () => {
    const { result } = expand("offset: 100px 200px / 300px / 400px;", { format: "js" });
    expect(result).toEqual({ offset: "100px 200px / 300px / 400px" });
  });

  it("offset: invalid-path(45deg)", () => {
    const { result } = expand("offset: invalid-path(45deg);", { format: "js" });
    expect(result).toEqual({ offset: "invalid-path(45deg)" });
  });
});

describe("transition (invalid cases)", () => {
  it("transition: 100px", () => {
    const { result } = expand("transition: 100px;", { format: "js" });
    expect(result).toEqual({ transition: "100px" });
  });

  it("transition: opacity transform", () => {
    const { result } = expand("transition: opacity transform;", { format: "js" });
    expect(result).toEqual({ transition: "opacity transform" });
  });

  it("transition: 300ms 400ms 500ms", () => {
    const { result } = expand("transition: 300ms 400ms 500ms;", { format: "js" });
    expect(result).toEqual({ transition: "300ms 400ms 500ms" });
  });

  it("transition: foo", () => {
    const { result } = expand("transition: foo;", { format: "js" });
    expect(result).toEqual({
      "transition-property": "foo",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("transition: opacity 300ms ease 100ms 50ms", () => {
    const { result } = expand("transition: opacity 300ms ease 100ms 50ms;", { format: "js" });
    expect(result).toEqual({ transition: "opacity 300ms ease 100ms 50ms" });
  });

  it("transition: 300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms", () => {
    const { result } = expand("transition: 300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms;", {
      format: "js",
    });
    expect(result).toEqual({ transition: "300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms" });
  });
});

describe("animation (invalid cases)", () => {
  it("animation: 100px", () => {
    const { result } = expand("animation: 100px;", { format: "js" });
    expect(result).toEqual({ animation: "100px" });
  });

  it("animation: spin bounce", () => {
    const { result } = expand("animation: spin bounce;", { format: "js" });
    expect(result).toEqual({ animation: "spin bounce" });
  });

  it("animation: 1s 2s 3s", () => {
    const { result } = expand("animation: 1s 2s 3s;", { format: "js" });
    expect(result).toEqual({ animation: "1s 2s 3s" });
  });

  it("animation: alternate reverse", () => {
    const { result } = expand("animation: alternate reverse;", { format: "js" });
    expect(result).toEqual({ animation: "alternate reverse" });
  });

  it("animation: forwards backwards", () => {
    const { result } = expand("animation: forwards backwards;", { format: "js" });
    expect(result).toEqual({ animation: "forwards backwards" });
  });

  it("animation: running paused", () => {
    const { result } = expand("animation: running paused;", { format: "js" });
    expect(result).toEqual({ animation: "running paused" });
  });

  it("animation: infinite infinite", () => {
    const { result } = expand("animation: infinite infinite;", { format: "js" });
    expect(result).toEqual({ animation: "infinite infinite" });
  });

  it("animation: 1s ease steps(2)", () => {
    const { result } = expand("animation: 1s ease steps(2);", { format: "js" });
    expect(result).toEqual({ animation: "1s ease steps(2)" });
  });

  it("animation: steps(2) ease", () => {
    const { result } = expand("animation: steps(2) ease;", { format: "js" });
    expect(result).toEqual({ animation: "steps(2) ease" });
  });
});

// Multi-layer background tests
describe("background (multi-layer)", () => {
  backgroundLayerTestFixtures.forEach((testCase) => {
    it(`should expand "${testCase.name || testCase.input}"`, () => {
      const { result } = expand(testCase.input, { format: "js" });
      expect(result).toEqual(testCase.expected);
    });
  });
});

describe("non-shorthand property", () => {
  it("should return the property as-is for valid non-shorthand properties", () => {
    const { result } = expand("color: #00f;", { format: "js" });
    expect(result).toEqual({ color: "#00f" });
  });

  it("should return the property for unknown properties (validation will catch them)", () => {
    const { result } = expand("unknown-property: value;", { format: "js" });
    expect(result).toEqual({ "unknown-property": "value" });
  });
});

describe("format options", () => {
  it("should return CSS string when format is css", () => {
    const { result } = expand("margin: 10px;", { format: "css" });
    expect(result).toBe(
      "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"
    );
  });

  it("should use custom indent and separator", () => {
    const { result } = expand("margin: 10px;", { format: "css", indent: 0, separator: " " });
    expect(result).toBe(
      "margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px;"
    );
  });

  it("should return object when format is js", () => {
    const { result } = expand("margin: 10px;", { format: "js" });
    expect(result).toEqual({
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px",
    });
  });

  it("should handle multiple declarations", () => {
    const { result } = expand(
      `
      margin: 10px;
      padding: 5px;
    `,
      { format: "css" }
    );
    expect(result).toBe(
      "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;\npadding-top: 5px;\npadding-right: 5px;\npadding-bottom: 5px;\npadding-left: 5px;"
    );
  });
});
