// b_path:: test/fixtures/layers.ts
interface TestCase {
  input: string;
  expected: Record<string, string> | undefined;
  name?: string; // Optional name for better test descriptions
}

const backgroundLayerTestFixtures: TestCase[] = [
  // --- Property Distribution Rules: Multiple Layers, Varying Values ---

  {
    name: "Test defaults with single layer",
    input: "background: red;",
    expected: {
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "red",
    },
  },
  {
    name: "Two layers: image, position (single value for both)",
    input: "background: url(a.png) center, url(b.png) 10px;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center, 10px", // Each layer gets its specified position
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
      "background-repeat": "no-repeat, repeat-x, repeat", // Default 'repeat' for the third layer
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
      "background-position": "10px, 0% 0%, 0% 0%", // Default '0% 0%' for 2nd and 3rd layers
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
      "background-size": "50%, auto auto, auto auto", // Default 'auto auto' for 2nd and 3rd layers
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
      "background-attachment": "fixed, scroll, scroll", // Default 'scroll' for 2nd and 3rd layers
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
      "background-origin": "content-box, padding-box, padding-box", // Default 'padding-box' for 2nd and 3rd
      "background-clip": "content-box, border-box, border-box", // Default 'border-box' for 2nd and 3rd (because origin set clip also)
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
      "background-position": "10px 10px, 20px, 0% 0%, 0% 0%", // Default for 3rd and 4th
      "background-size": "50%, auto auto, auto auto, auto auto", // Default for 2nd, 3rd, 4th
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
      "background-color": "red", // Only the last color counts, even if it's in the first layer
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
      "background-color": "blue", // Last color found
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
      "background-color": "red", // Last color found globally (which is red)
    },
  },
  {
    name: "Three layers: no images, just color, none, transparent",
    input: "background: none, transparent, red;",
    expected: {
      "background-image": "none, none, none", // Explicit 'none' for the first layer, implicit for the color layers
      "background-color": "red", // The last color wins
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
      "background-position": "10% 20%, 30% 40%, 0% 0%", // Default for 3rd layer
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
      "background-size": "cover, auto auto, auto auto", // Default for 2nd and 3rd
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
      "background-origin": "border-box, content-box, padding-box", // Default for 3rd
      "background-clip": "border-box, content-box, border-box", // Default for 3rd
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
      "background-origin": "padding-box, border-box, padding-box", // Default for 3rd
      "background-clip": "content-box, border-box, border-box", // Default for 3rd
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

const maskLayerTestFixtures: TestCase[] = [
  {
    name: "Two layers with different images",
    input: "mask: url(a.png), url(b.png);",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "0% 0%, 0% 0%",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, border-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Two layers with position variations",
    input: "mask: url(a.png) center, url(b.png) 10px 20px;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "center, 10px 20px",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, border-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Three layers with size variations",
    input: "mask: url(a.png) / cover, url(b.png) / 100px, url(c.png);",
    expected: {
      "mask-image": "url(a.png), url(b.png), url(c.png)",
      "mask-mode": "match-source, match-source, match-source",
      "mask-position": "0% 0%, 0% 0%, 0% 0%",
      "mask-size": "cover, 100px, auto",
      "mask-repeat": "repeat, repeat, repeat",
      "mask-origin": "border-box, border-box, border-box",
      "mask-clip": "border-box, border-box, border-box",
      "mask-composite": "add, add, add",
    },
  },
  {
    name: "Two layers with mode variations",
    input: "mask: url(a.png) alpha, url(b.png) luminance;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "alpha, luminance",
      "mask-position": "0% 0%, 0% 0%",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, border-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Three layers with repeat variations",
    input: "mask: url(a.png) no-repeat, url(b.png) repeat-x, url(c.png);",
    expected: {
      "mask-image": "url(a.png), url(b.png), url(c.png)",
      "mask-mode": "match-source, match-source, match-source",
      "mask-position": "0% 0%, 0% 0%, 0% 0%",
      "mask-size": "auto, auto, auto",
      "mask-repeat": "no-repeat, repeat-x, repeat",
      "mask-origin": "border-box, border-box, border-box",
      "mask-clip": "border-box, border-box, border-box",
      "mask-composite": "add, add, add",
    },
  },
  {
    name: "Two layers with composite variations",
    input: "mask: url(a.png) add, url(b.png) subtract;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "0% 0%, 0% 0%",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, border-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, subtract",
    },
  },
  {
    name: "Two layers with geometry-box variations",
    input: "mask: url(a.png) border-box, url(b.png) padding-box content-box;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "0% 0%, 0% 0%",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, padding-box",
      "mask-clip": "border-box, content-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Three layers with mixed properties",
    input:
      "mask: url(a.png) alpha center / cover no-repeat add border-box, url(b.png) luminance 10px / contain, url(c.png);",
    expected: {
      "mask-image": "url(a.png), url(b.png), url(c.png)",
      "mask-mode": "alpha, luminance, match-source",
      "mask-position": "center, 10px, 0% 0%",
      "mask-size": "cover, contain, auto",
      "mask-repeat": "no-repeat, repeat, repeat",
      "mask-origin": "border-box, border-box, border-box",
      "mask-clip": "border-box, border-box, border-box",
      "mask-composite": "add, add, add",
    },
  },
  {
    name: "Two layers with position/size slash syntax",
    input: "mask: url(a.png) left top / 100px 200px, url(b.png) center / contain;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "left top, center",
      "mask-size": "100px 200px, contain",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, border-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Multiple layers with no-clip",
    input: "mask: url(a.png) border-box no-clip, url(b.png) padding-box;",
    expected: {
      "mask-image": "url(a.png), url(b.png)",
      "mask-mode": "match-source, match-source",
      "mask-position": "0% 0%, 0% 0%",
      "mask-size": "auto, auto",
      "mask-repeat": "repeat, repeat",
      "mask-origin": "border-box, padding-box",
      "mask-clip": "border-box, border-box",
      "mask-composite": "add, add",
    },
  },
  {
    name: "Three layers with mixed SVG, gradient, and image masks",
    input:
      "mask: url(#mySVGMask) alpha repeat-x 50% 50% / contain, linear-gradient(to top, black, transparent) round left 20px, url('https://example.com/mask-overlay.png') luminance 10px 10px / 50px 50px;",
    expected: {
      "mask-clip": "border-box, border-box, border-box",
      "mask-composite": "add, add, add",
      "mask-image":
        "url(#mySVGMask), linear-gradient(to top,black,transparent), url(https://example.com/mask-overlay.png)",
      "mask-mode": "alpha, match-source, luminance",
      "mask-origin": "border-box, border-box, border-box",
      "mask-position": "50% 50%, left 20px, 10px 10px",
      "mask-repeat": "repeat-x, round, repeat",
      "mask-size": "contain, auto, 50px 50px",
    },
  },
];

export { backgroundLayerTestFixtures, maskLayerTestFixtures };
