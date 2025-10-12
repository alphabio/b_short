// b_path:: test/invalid-cases.test.ts
import { describe, expect, it } from "vitest";
import expand from "../src/index";
import { assertNoDuplicateProperties } from "./helpers/assertions";

describe("grid (invalid cases)", () => {
  it("should pass through invalid auto-flow position in explicit rows", () => {
    const { result } = expand("grid: 100px / 200px auto-flow;", { format: "js" });
    assertNoDuplicateProperties(
      result,
      "should pass through invalid auto-flow position in explicit rows"
    );
    expect(result).toEqual({ grid: "100px / 200px auto-flow" });
  });

  it("should pass through invalid auto-flow position in explicit columns", () => {
    const { result } = expand("grid: 200px auto-flow / 100px;", { format: "js" });
    assertNoDuplicateProperties(
      result,
      "should pass through invalid auto-flow position in explicit columns"
    );
    expect(result).toEqual({ grid: "200px auto-flow / 100px" });
  });
});

describe("overflow (invalid cases)", () => {
  it("overflow: invalid token", () => {
    const { result } = expand("overflow: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "overflow: invalid token");
    expect(result).toEqual({ overflow: "foo" });
  });
});

describe("columns (invalid cases)", () => {
  it("columns: invalid token", () => {
    const { result } = expand("columns: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "columns: invalid token");
    expect(result).toEqual({ columns: "foo" });
  });
});

describe("inset (invalid cases)", () => {
  it("inset: invalid token", () => {
    const { result } = expand("inset: foo bar baz baz baz;", { format: "js" });
    assertNoDuplicateProperties(result, "inset: invalid token");
    expect(result).toEqual({ inset: "foo bar baz baz baz" });
  });
});

describe("flex-flow (invalid cases)", () => {
  it("should pass through invalid token", () => {
    const { result } = expand("flex-flow: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid token");
    expect(result).toEqual({ "flex-flow": "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("flex-flow: row wrap nowrap;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through too many values");
    expect(result).toEqual({ "flex-flow": "row wrap nowrap" });
  });

  it("should pass through duplicate direction", () => {
    const { result } = expand("flex-flow: row column;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through duplicate direction");
    expect(result).toEqual({ "flex-flow": "row column" });
  });
});

describe("flex (invalid cases)", () => {
  it("should pass through invalid token", () => {
    const { result } = expand("flex: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid token");
    expect(result).toEqual({ flex: "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("flex: 1 1 100px auto;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through too many values");
    expect(result).toEqual({ flex: "1 1 100px auto" });
  });

  it("should expand basis number order correctly", () => {
    const { result } = expand("flex: 100px 1;", { format: "js" });
    assertNoDuplicateProperties(result, "should expand basis number order correctly");
    expect(result).toEqual({
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "100px",
    });
  });

  it("should pass through two basis values", () => {
    const { result } = expand("flex: 100px 50%;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through two basis values");
    expect(result).toEqual({ flex: "100px 50%" });
  });
});

describe("text-decoration (invalid cases)", () => {
  it("text-decoration: foo", () => {
    const { result } = expand("text-decoration: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "text-decoration: foo");
    expect(result).toEqual({ "text-decoration": "foo" });
  });

  it("text-decoration: underline underline", () => {
    const { result } = expand("text-decoration: underline underline;", { format: "js" });
    assertNoDuplicateProperties(result, "text-decoration: underline underline");
    expect(result).toEqual({ "text-decoration": "underline underline" });
  });

  it("text-decoration: solid dotted", () => {
    const { result } = expand("text-decoration: solid dotted;", { format: "js" });
    assertNoDuplicateProperties(result, "text-decoration: solid dotted");
    expect(result).toEqual({ "text-decoration": "solid dotted" });
  });

  it("text-decoration: none underline", () => {
    const { result } = expand("text-decoration: none underline;", { format: "js" });
    assertNoDuplicateProperties(result, "text-decoration: none underline");
    expect(result).toEqual({ "text-decoration": "none underline" });
  });

  it("text-decoration: overline none", () => {
    const { result } = expand("text-decoration: overline none;", { format: "js" });
    assertNoDuplicateProperties(result, "text-decoration: overline none");
    expect(result).toEqual({ "text-decoration": "overline none" });
  });
});

describe("text-emphasis (invalid cases)", () => {
  it("text-emphasis: foo", () => {
    const { result } = expand("text-emphasis: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "text-emphasis: foo");
    expect(result).toEqual({ "text-emphasis": "foo" });
  });

  it("text-emphasis: red blue", () => {
    const { result } = expand("text-emphasis: red blue;", { format: "js" });
    assertNoDuplicateProperties(result, "text-emphasis: red blue");
    expect(result).toEqual({ "text-emphasis": "red blue" });
  });

  it("text-emphasis: filled open", () => {
    const { result } = expand("text-emphasis: filled open;", { format: "js" });
    assertNoDuplicateProperties(result, "text-emphasis: filled open");
    expect(result).toEqual({ "text-emphasis": "filled open" });
  });

  it('text-emphasis: "※" dot', () => {
    const { result } = expand('text-emphasis: "※" dot;', { format: "js" });
    assertNoDuplicateProperties(result, 'text-emphasis: "※" dot');
    expect(result).toEqual({ "text-emphasis": '"※" dot' });
  });
});

describe("list-style (invalid cases)", () => {
  it("list-style: foo", () => {
    const { result } = expand("list-style: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "list-style: foo");
    expect(result).toEqual({
      "list-style-type": "foo",
      "list-style-position": "outside",
      "list-style-image": "none",
    });
  });

  it("list-style: inside outside", () => {
    const { result } = expand("list-style: inside outside;", { format: "js" });
    assertNoDuplicateProperties(result, "list-style: inside outside");
    expect(result).toEqual({ "list-style": "inside outside" });
  });

  it("list-style: url(a.png) url(b.png)", () => {
    const { result } = expand("list-style: url(a.png) url(b.png);", { format: "js" });
    assertNoDuplicateProperties(result, "list-style: url(a.png) url(b.png)");
    expect(result).toEqual({ "list-style": "url(a.png) url(b.png)" });
  });

  it("list-style: disc none", () => {
    const { result } = expand("list-style: disc none;", { format: "js" });
    assertNoDuplicateProperties(result, "list-style: disc none");
    expect(result).toEqual({ "list-style": "disc none" });
  });
});

describe("place-content (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-content: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid keyword");
    expect(result).toEqual({ "place-content": "foo" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-content: center start end;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through too many values");
    expect(result).toEqual({ "place-content": "center start end" });
  });

  it("should pass through invalid compound keyword", () => {
    const { result } = expand("place-content: safe;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid compound keyword");
    expect(result).toEqual({ "place-content": "safe" });
  });
});

describe("place-items (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-items: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid keyword");
    expect(result).toEqual({ "place-items": "foo" });
  });

  it("should pass through left/right as single value", () => {
    const { result } = expand("place-items: left;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through left/right as single value");
    expect(result).toEqual({ "place-items": "left" });
  });

  it("should pass through left/right as first value", () => {
    const { result } = expand("place-items: left center;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through left/right as first value");
    expect(result).toEqual({ "place-items": "left center" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-items: center start end;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through too many values");
    expect(result).toEqual({ "place-items": "center start end" });
  });
});

describe("place-self (invalid cases)", () => {
  it("should pass through invalid keyword", () => {
    const { result } = expand("place-self: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through invalid keyword");
    expect(result).toEqual({ "place-self": "foo" });
  });

  it("should pass through left/right as single value", () => {
    const { result } = expand("place-self: right;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through left/right as single value");
    expect(result).toEqual({ "place-self": "right" });
  });

  it("should pass through left/right as first value", () => {
    const { result } = expand("place-self: right center;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through left/right as first value");
    expect(result).toEqual({ "place-self": "right center" });
  });

  it("should pass through too many values", () => {
    const { result } = expand("place-self: auto center start;", { format: "js" });
    assertNoDuplicateProperties(result, "should pass through too many values");
    expect(result).toEqual({ "place-self": "auto center start" });
  });
});

describe("column-rule (invalid cases)", () => {
  it("column-rule: foo", () => {
    const { result } = expand("column-rule: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "column-rule: foo");
    expect(result).toEqual({ "column-rule": "foo" });
  });

  it("column-rule: 1px solid red blue", () => {
    const { result } = expand("column-rule: 1px solid red blue;", { format: "js" });
    assertNoDuplicateProperties(result, "column-rule: 1px solid red blue");
    expect(result).toEqual({ "column-rule": "1px solid red blue" });
  });

  it("column-rule: 1px 2px", () => {
    const { result } = expand("column-rule: 1px 2px;", { format: "js" });
    assertNoDuplicateProperties(result, "column-rule: 1px 2px");
    expect(result).toEqual({ "column-rule": "1px 2px" });
  });

  it("column-rule: solid dotted", () => {
    const { result } = expand("column-rule: solid dotted;", { format: "js" });
    assertNoDuplicateProperties(result, "column-rule: solid dotted");
    expect(result).toEqual({ "column-rule": "solid dotted" });
  });

  it("column-rule: red blue", () => {
    const { result } = expand("column-rule: red blue;", { format: "js" });
    assertNoDuplicateProperties(result, "column-rule: red blue");
    expect(result).toEqual({ "column-rule": "red blue" });
  });
});

describe("contain-intrinsic-size (invalid cases)", () => {
  it("contain-intrinsic-size: foo", () => {
    const { result } = expand("contain-intrinsic-size: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "contain-intrinsic-size: foo");
    expect(result).toEqual({ "contain-intrinsic-size": "foo" });
  });

  it("contain-intrinsic-size: 100px 200px 300px", () => {
    const { result } = expand("contain-intrinsic-size: 100px 200px 300px;", { format: "js" });
    assertNoDuplicateProperties(result, "contain-intrinsic-size: 100px 200px 300px");
    expect(result).toEqual({ "contain-intrinsic-size": "100px 200px 300px" });
  });

  it("contain-intrinsic-size: auto", () => {
    const { result } = expand("contain-intrinsic-size: auto;", { format: "js" });
    assertNoDuplicateProperties(result, "contain-intrinsic-size: auto");
    expect(result).toEqual({ "contain-intrinsic-size": "auto" });
  });

  it("contain-intrinsic-size: auto auto", () => {
    const { result } = expand("contain-intrinsic-size: auto auto;", { format: "js" });
    assertNoDuplicateProperties(result, "contain-intrinsic-size: auto auto");
    expect(result).toEqual({ "contain-intrinsic-size": "auto auto" });
  });
});

describe("offset (invalid cases)", () => {
  it("offset: foo", () => {
    const { result } = expand("offset: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "offset: foo");
    expect(result).toEqual({ offset: "foo" });
  });

  it("offset: path('test') path('test2')", () => {
    const { result } = expand("offset: path('test') path('test2');", { format: "js" });
    assertNoDuplicateProperties(result, "offset: path('test') path('test2')");
    expect(result).toEqual({ offset: "path('test') path('test2')" });
  });

  it("offset: 100px 200px / 300px / 400px", () => {
    const { result } = expand("offset: 100px 200px / 300px / 400px;", { format: "js" });
    assertNoDuplicateProperties(result, "offset: 100px 200px / 300px / 400px");
    expect(result).toEqual({ offset: "100px 200px / 300px / 400px" });
  });

  it("offset: invalid-path(45deg)", () => {
    const { result } = expand("offset: invalid-path(45deg);", { format: "js" });
    assertNoDuplicateProperties(result, "offset: invalid-path(45deg)");
    expect(result).toEqual({ offset: "invalid-path(45deg)" });
  });
});

describe("background (invalid cases)", () => {
  it("should pass through invalid CSS syntax", () => {
    const out = expand("background: @invalid;", { format: "js" });
    assertNoDuplicateProperties(out.result, "should pass through invalid CSS syntax");
    expect(out.result).toEqual({ background: "@invalid" });
    expect(
      out.issues.some((i) => i.name === "expansion-failed" && i.property === "background")
    ).toBe(true);
  });

  it("should parse URL with semicolon and extract color", () => {
    const { result } = expand("background: url(image.png; background-color: red;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "should parse URL with semicolon and extract color");
    expect(result).toEqual({
      "background-image": "url(image.png)",
      "background-color": "red",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    });
  });

  it("should parse multi-layer background with extra token", () => {
    const { result } = expand("background: url(image1.png), url(image2.png) invalid;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "should parse multi-layer background with extra token");
    expect(result).toEqual({
      "background-image": "url(image1.png), url(image2.png)",
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
    });
  });

  it("should pass through multiple layers with invalid syntax", () => {
    const out = expand("background: url(test.png) 10px, @invalid;", { format: "js" });
    assertNoDuplicateProperties(
      out.result,
      "should pass through multiple layers with invalid syntax"
    );
    expect(out.result).toEqual({ background: "url(test.png) 10px, @invalid" });
    expect(
      out.issues.some((i) => i.name === "expansion-failed" && i.property === "background")
    ).toBe(true);
  });

  it("should parse bracketed identifier as color", () => {
    const { result } = expand("background: [unclosed;", { format: "js" });
    assertNoDuplicateProperties(result, "should parse bracketed identifier as color");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    });
  });

  it("should pass through unparseable shorthand with following valid longhand", () => {
    const out = expand("background: @invalid; background-color: red;", { format: "js" });
    assertNoDuplicateProperties(
      out.result,
      "should pass through unparseable shorthand with following valid longhand"
    );
    expect(out.result).toEqual({
      background: "@invalid",
      "background-color": "red",
    });
    expect(
      out.issues.some((i) => i.name === "expansion-failed" && i.property === "background")
    ).toBe(true);
  });

  it("should pass through background with !important and warn", () => {
    const out = expand("background: complex-value !important;", { format: "js" });
    assertNoDuplicateProperties(out.result, "background with !important");
    expect(out.result).toEqual({ background: "complex-value !important" });
    expect(
      out.issues.some((i) => i.name === "important-detected" && i.property === "background")
    ).toBe(true);
  });
});

describe("transition (invalid cases)", () => {
  it("transition: 100px", () => {
    const { result } = expand("transition: 100px;", { format: "js" });
    assertNoDuplicateProperties(result, "transition: 100px");
    expect(result).toEqual({ transition: "100px" });
  });

  it("transition: opacity transform", () => {
    const { result } = expand("transition: opacity transform;", { format: "js" });
    assertNoDuplicateProperties(result, "transition: opacity transform");
    expect(result).toEqual({ transition: "opacity transform" });
  });

  it("transition: 300ms 400ms 500ms", () => {
    const { result } = expand("transition: 300ms 400ms 500ms;", { format: "js" });
    assertNoDuplicateProperties(result, "transition: 300ms 400ms 500ms");
    expect(result).toEqual({ transition: "300ms 400ms 500ms" });
  });

  it("transition: foo", () => {
    const { result } = expand("transition: foo;", { format: "js" });
    assertNoDuplicateProperties(result, "transition: foo");
    expect(result).toEqual({
      "transition-property": "foo",
      "transition-duration": "0s",
      "transition-timing-function": "ease",
      "transition-delay": "0s",
    });
  });

  it("transition: opacity 300ms ease 100ms 50ms", () => {
    const { result } = expand("transition: opacity 300ms ease 100ms 50ms;", { format: "js" });
    assertNoDuplicateProperties(result, "transition: opacity 300ms ease 100ms 50ms");
    expect(result).toEqual({ transition: "opacity 300ms ease 100ms 50ms" });
  });

  it("transition: 300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms", () => {
    const { result } = expand("transition: 300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms;", {
      format: "js",
    });
    assertNoDuplicateProperties(result, "transition: 300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms");
    expect(result).toEqual({ transition: "300ms cubic-bezier(0.4,0,0.2,1) 400ms 500ms" });
  });
});

describe("animation (invalid cases)", () => {
  it("animation: 100px", () => {
    const { result } = expand("animation: 100px;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: 100px");
    expect(result).toEqual({ animation: "100px" });
  });

  it("animation: spin bounce", () => {
    const { result } = expand("animation: spin bounce;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: spin bounce");
    expect(result).toEqual({ animation: "spin bounce" });
  });

  it("animation: 1s 2s 3s", () => {
    const { result } = expand("animation: 1s 2s 3s;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: 1s 2s 3s");
    expect(result).toEqual({ animation: "1s 2s 3s" });
  });

  it("animation: alternate reverse", () => {
    const { result } = expand("animation: alternate reverse;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: alternate reverse");
    expect(result).toEqual({ animation: "alternate reverse" });
  });

  it("animation: forwards backwards", () => {
    const { result } = expand("animation: forwards backwards;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: forwards backwards");
    expect(result).toEqual({ animation: "forwards backwards" });
  });

  it("animation: running paused", () => {
    const { result } = expand("animation: running paused;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: running paused");
    expect(result).toEqual({ animation: "running paused" });
  });

  it("animation: infinite infinite", () => {
    const { result } = expand("animation: infinite infinite;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: infinite infinite");
    expect(result).toEqual({ animation: "infinite infinite" });
  });

  it("animation: 1s ease steps(2)", () => {
    const { result } = expand("animation: 1s ease steps(2);", { format: "js" });
    assertNoDuplicateProperties(result, "animation: 1s ease steps(2)");
    expect(result).toEqual({ animation: "1s ease steps(2)" });
  });

  it("animation: steps(2) ease", () => {
    const { result } = expand("animation: steps(2) ease;", { format: "js" });
    assertNoDuplicateProperties(result, "animation: steps(2) ease");
    expect(result).toEqual({ animation: "steps(2) ease" });
  });
});
