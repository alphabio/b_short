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
      backgroundImage: "none",
      backgroundPosition: "0% 0%",
      backgroundSize: "auto auto",
      backgroundRepeat: "repeat",
      backgroundAttachment: "scroll",
      backgroundOrigin: "padding-box",
      backgroundClip: "border-box",
      backgroundColor: "red",
    },
  },
  {
    name: "Two layers: image, position (single value for both)",
    input: "background: url(a.png) center, url(b.png) 10px;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundPosition: "center, 10px", // Each layer gets its specified position
      backgroundSize: "auto auto, auto auto",
      backgroundRepeat: "repeat, repeat",
      backgroundAttachment: "scroll, scroll",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
    },
  },
  {
    name: "Three layers: image, repeat (two values, less than layers)",
    input: "background: url(a.png) no-repeat, url(b.png) repeat-x, url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundRepeat: "no-repeat, repeat-x, repeat", // Default 'repeat' for the third layer
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, position (one value, less than layers)",
    input: "background: url(a.png) 10px, url(b.png), url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundPosition: "10px, 0% 0%, 0% 0%", // Default '0% 0%' for 2nd and 3rd layers
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, size (one value for first, others default)",
    input: "background: url(a.png) / 50%, url(b.png), url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundSize: "50%, auto auto, auto auto", // Default 'auto auto' for 2nd and 3rd layers
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, attachment (one value for first, others default)",
    input: "background: url(a.png) fixed, url(b.png), url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundAttachment: "fixed, scroll, scroll", // Default 'scroll' for 2nd and 3rd layers
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: image, origin (one value for first, others default)",
    input: "background: url(a.png) content-box, url(b.png), url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundOrigin: "content-box, padding-box, padding-box", // Default 'padding-box' for 2nd and 3rd
      backgroundClip: "content-box, border-box, border-box", // Default 'border-box' for 2nd and 3rd (because origin set clip also)
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
    },
  },
  {
    name: "Four layers: image, two repeats, two positions, one size",
    input:
      "background: url(a.png) no-repeat 10px 10px / 50%, url(b.png) repeat-x 20px, url(c.png), url(d.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png), url(d.png)",
      backgroundRepeat: "no-repeat, repeat-x, repeat, repeat",
      backgroundPosition: "10px 10px, 20px, 0% 0%, 0% 0%", // Default for 3rd and 4th
      backgroundSize: "50%, auto auto, auto auto, auto auto", // Default for 2nd, 3rd, 4th
      backgroundAttachment: "scroll, scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box, border-box",
    },
  },
  {
    name: "Two layers: image, full properties for first, minimal for second",
    input:
      "background: url(a.png) no-repeat fixed 10% 20% / cover padding-box border-box red, url(b.png) center;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundRepeat: "no-repeat, repeat",
      backgroundAttachment: "fixed, scroll",
      backgroundPosition: "10% 20%, center",
      backgroundSize: "cover, auto auto",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
      backgroundColor: "red", // Only the last color counts, even if it's in the first layer
    },
  },
  {
    name: "Two layers: image, color in second layer",
    input: "background: url(a.png) no-repeat, url(b.png) blue;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundRepeat: "no-repeat, repeat",
      backgroundAttachment: "scroll, scroll",
      backgroundPosition: "0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
      backgroundColor: "blue", // Last color found
    },
  },
  {
    name: "Two layers: image, color in first layer, then another layer (color from first should be global)",
    input: "background: url(a.png) red, url(b.png) no-repeat;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundRepeat: "repeat, no-repeat",
      backgroundAttachment: "scroll, scroll",
      backgroundPosition: "0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
      backgroundColor: "red", // Last color found globally (which is red)
    },
  },
  {
    name: "Three layers: no images, just color, none, transparent",
    input: "background: none, transparent, red;",
    expected: {
      backgroundImage: "none, none, none", // Explicit 'none' for the first layer, implicit for the color layers
      backgroundColor: "red", // The last color wins
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: position values (two provided for three layers)",
    input: "background: url(a.png) 10% 20%, url(b.png) 30% 40%, url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundPosition: "10% 20%, 30% 40%, 0% 0%", // Default for 3rd layer
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: size values (one provided for three layers)",
    input: "background: url(a.png) / cover, url(b.png), url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundSize: "cover, auto auto, auto auto", // Default for 2nd and 3rd
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
      backgroundOrigin: "padding-box, padding-box, padding-box",
      backgroundClip: "border-box, border-box, border-box",
    },
  },
  {
    name: "Three layers: origin values (two provided for three layers)",
    input: "background: url(a.png) border-box, url(b.png) content-box, url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundOrigin: "border-box, content-box, padding-box", // Default for 3rd
      backgroundClip: "border-box, content-box, border-box", // Default for 3rd
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
    },
  },
  {
    name: "Three layers: clip values (one explicit, one implicit for origin, one default)",
    input: "background: url(a.png) padding-box content-box, url(b.png) border-box, url(c.png);",
    expected: {
      backgroundImage: "url(a.png), url(b.png), url(c.png)",
      backgroundOrigin: "padding-box, border-box, padding-box", // Default for 3rd
      backgroundClip: "content-box, border-box, border-box", // Default for 3rd
      backgroundPosition: "0% 0%, 0% 0%, 0% 0%",
      backgroundSize: "auto auto, auto auto, auto auto",
      backgroundRepeat: "repeat, repeat, repeat",
      backgroundAttachment: "scroll, scroll, scroll",
    },
  },
  {
    name: "Multiple layers, same properties (all default for first, then specific for second)",
    input: "background: url(a.png), url(b.png) 10px 20px no-repeat;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundPosition: "0% 0%, 10px 20px",
      backgroundRepeat: "repeat, no-repeat",
      backgroundSize: "auto auto, auto auto",
      backgroundAttachment: "scroll, scroll",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
    },
  },
  {
    name: "Multiple layers, mixed values for position and size",
    input: "background: url(a.png) left / 100px, url(b.png) center top / contain;",
    expected: {
      backgroundImage: "url(a.png), url(b.png)",
      backgroundPosition: "left, center top",
      backgroundSize: "100px, contain",
      backgroundRepeat: "repeat, repeat",
      backgroundAttachment: "scroll, scroll",
      backgroundOrigin: "padding-box, padding-box",
      backgroundClip: "border-box, border-box",
    },
  },
];

const maskLayerTestFixtures: TestCase[] = [
  {
    name: "Two layers with different images",
    input: "mask: url(a.png), url(b.png);",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "0% 0%, 0% 0%",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, border-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Two layers with position variations",
    input: "mask: url(a.png) center, url(b.png) 10px 20px;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "center, 10px 20px",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, border-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Three layers with size variations",
    input: "mask: url(a.png) / cover, url(b.png) / 100px, url(c.png);",
    expected: {
      maskImage: "url(a.png), url(b.png), url(c.png)",
      maskMode: "match-source, match-source, match-source",
      maskPosition: "0% 0%, 0% 0%, 0% 0%",
      maskSize: "cover, 100px, auto",
      maskRepeat: "repeat, repeat, repeat",
      maskOrigin: "border-box, border-box, border-box",
      maskClip: "border-box, border-box, border-box",
      maskComposite: "add, add, add",
    },
  },
  {
    name: "Two layers with mode variations",
    input: "mask: url(a.png) alpha, url(b.png) luminance;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "alpha, luminance",
      maskPosition: "0% 0%, 0% 0%",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, border-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Three layers with repeat variations",
    input: "mask: url(a.png) no-repeat, url(b.png) repeat-x, url(c.png);",
    expected: {
      maskImage: "url(a.png), url(b.png), url(c.png)",
      maskMode: "match-source, match-source, match-source",
      maskPosition: "0% 0%, 0% 0%, 0% 0%",
      maskSize: "auto, auto, auto",
      maskRepeat: "no-repeat, repeat-x, repeat",
      maskOrigin: "border-box, border-box, border-box",
      maskClip: "border-box, border-box, border-box",
      maskComposite: "add, add, add",
    },
  },
  {
    name: "Two layers with composite variations",
    input: "mask: url(a.png) add, url(b.png) subtract;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "0% 0%, 0% 0%",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, border-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, subtract",
    },
  },
  {
    name: "Two layers with geometry-box variations",
    input: "mask: url(a.png) border-box, url(b.png) padding-box content-box;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "0% 0%, 0% 0%",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, padding-box",
      maskClip: "border-box, content-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Three layers with mixed properties",
    input:
      "mask: url(a.png) alpha center / cover no-repeat add border-box, url(b.png) luminance 10px / contain, url(c.png);",
    expected: {
      maskImage: "url(a.png), url(b.png), url(c.png)",
      maskMode: "alpha, luminance, match-source",
      maskPosition: "center, 10px, 0% 0%",
      maskSize: "cover, contain, auto",
      maskRepeat: "no-repeat, repeat, repeat",
      maskOrigin: "border-box, border-box, border-box",
      maskClip: "border-box, border-box, border-box",
      maskComposite: "add, add, add",
    },
  },
  {
    name: "Two layers with position/size slash syntax",
    input: "mask: url(a.png) left top / 100px 200px, url(b.png) center / contain;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "left top, center",
      maskSize: "100px 200px, contain",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, border-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Multiple layers with no-clip",
    input: "mask: url(a.png) border-box no-clip, url(b.png) padding-box;",
    expected: {
      maskImage: "url(a.png), url(b.png)",
      maskMode: "match-source, match-source",
      maskPosition: "0% 0%, 0% 0%",
      maskSize: "auto, auto",
      maskRepeat: "repeat, repeat",
      maskOrigin: "border-box, padding-box",
      maskClip: "border-box, border-box",
      maskComposite: "add, add",
    },
  },
  {
    name: "Three layers with mixed SVG, gradient, and image masks",
    input:
      "mask: url(#mySVGMask) alpha repeat-x 50% 50% / contain, linear-gradient(to top, black, transparent) round left 20px, url('https://example.com/mask-overlay.png') luminance 10px 10px / 50px 50px;",
    expected: {
      maskClip: "border-box, border-box, border-box",
      maskComposite: "add, add, add",
      maskImage:
        "url(#mySVGMask), linear-gradient(to top,black,transparent), url(https://example.com/mask-overlay.png)",
      maskMode: "alpha, match-source, luminance",
      maskOrigin: "border-box, border-box, border-box",
      maskPosition: "50% 50%, left 20px, 10px 10px",
      maskRepeat: "repeat-x, round, repeat",
      maskSize: "contain, auto, 50px 50px",
    },
  },
];

export { backgroundLayerTestFixtures, maskLayerTestFixtures };
