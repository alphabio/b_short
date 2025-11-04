// b_path:: TMP/fixtures/shorthand.ts
interface TestCase {
  input: string;
  expected: Record<string, string> | undefined;
  name?: string; // Optional name for better test descriptions
}

const _backgroundTestFixtures: TestCase[] = [
  // --- Basic Single Layer Tests ---
  {
    name: "single color",
    input: "background: red;",
    expected: {
      "background-color": "red",
    },
  },
  {
    name: "single image",
    input: "background: url(image.png);",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and color",
    input: "background: url(image.png) red;",
    expected: {
      "background-image": "url(image.png)",
      "background-color": "red",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "image and repeat",
    input: "background: url(image.png) no-repeat;",
    expected: {
      "background-image": "url(image.png)",
      "background-repeat": "no-repeat",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and repeat-x",
    input: "background: url(image.png) repeat-x;",
    expected: {
      "background-image": "url(image.png)",
      "background-repeat": "repeat-x",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and repeat (two keywords)",
    input: "background: url(image.png) space round;",
    expected: {
      "background-image": "url(image.png)",
      "background-repeat": "space round",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and position (keywords)",
    input: "background: url(image.png) center top;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "center top",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and position (length)",
    input: "background: url(image.png) 10px 20%;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "10px 20%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image and position (one value)",
    input: "background: url(image.png) 10px;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "10px", // Should default to center for the second value
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image, position, and size (cover)",
    input: "background: url(image.png) center / cover;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "center",
      "background-size": "cover",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image, position, and size (lengths)",
    input: "background: url(image.png) 50% 50% / 100px 50px;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "50% 50%",
      "background-size": "100px 50px",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image, position, and size (one auto)",
    input: "background: url(image.png) left / 50px auto;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "left",
      "background-size": "50px auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "image, position, and size (one value)",
    input: "background: url(image.png) 10% / 50%;",
    expected: {
      "background-image": "url(image.png)",
      "background-position": "10%",
      "background-size": "50%",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "full single layer",
    input:
      "background: url('image.gif') no-repeat fixed right top / 50% auto padding-box border-box red;",
    expected: {
      "background-image": "url('image.gif')",
      "background-repeat": "no-repeat",
      "background-attachment": "fixed",
      "background-position": "right top",
      "background-size": "50% auto",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "red",
    },
  },
  {
    name: "image, origin, clip",
    input: "background: url(a.png) content-box padding-box;",
    expected: {
      "background-image": "url(a.png)",
      "background-origin": "content-box",
      "background-clip": "padding-box",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-color": "transparent",
    },
  },
  {
    name: "image, origin only (origin and clip become same)",
    input: "background: url(a.png) content-box;",
    expected: {
      "background-image": "url(a.png)",
      "background-origin": "content-box",
      "background-clip": "content-box",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-color": "transparent",
    },
  },
  {
    name: "image, attachment",
    input: "background: url(a.png) local;",
    expected: {
      "background-image": "url(a.png)",
      "background-attachment": "local",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "background-image none with color",
    input: "background: none blue;",
    expected: {
      "background-image": "none",
      "background-color": "blue",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },

  // --- Multiple Layer Tests ---
  {
    name: "two images, single repeat for both",
    input: "background: url(a.png) no-repeat, url(b.png);",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat", // no-repeat applies to first, default for second
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "two images, individual repeats",
    input: "background: url(a.png) no-repeat, url(b.png) repeat-x;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat-x",
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "two images, individual positions",
    input: "background: url(a.png) center top, url(b.png) 10px 20px;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center top, 10px 20px",
      "background-size": "auto auto, auto auto",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "three images, alternating positions and sizes",
    input:
      "background: url(a.png) 0 0 / 100px, url(b.png) center / 50%, url(c.png) bottom right / auto 200px;",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-position": "0 0, center, bottom right",
      "background-size": "100px, 50%, auto 200px",
      "background-repeat": "repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "multiple layers with one color at the end",
    input: "background: url(a.png) no-repeat, url(b.png) fixed, blue;",
    expected: {
      "background-image": "url(a.png), url(b.png), none", // Note: The 'blue' layer technically has no image
      "background-repeat": "no-repeat, repeat, repeat",
      "background-attachment": "scroll, fixed, scroll",
      "background-color": "blue",
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
    },
  },
  {
    name: "multiple layers, multiple box keywords",
    input: "background: url(a.png) border-box, url(b.png) content-box padding-box;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-origin": "border-box, content-box",
      "background-clip": "border-box, padding-box",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-position": "0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto",
      "background-color": "transparent",
    },
  },
  {
    name: "multiple layers, repeating values - repeat",
    input: "background: url(a.png), url(b.png), url(c.png); background-repeat: no-repeat;", // This needs to be tested via the expander's final combined output
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-repeat": "repeat, repeat, repeat", // Shorthand 'background' without explicit repeat on individual layers defaults to 'repeat'
      "background-position": "0% 0%, 0% 0%, 0% 0%",
      "background-size": "auto auto, auto auto, auto auto",
      "background-attachment": "scroll, scroll, scroll",
      "background-origin": "padding-box, padding-box, padding-box",
      "background-clip": "border-box, border-box, border-box",
      "background-color": "transparent",
    },
    // Note: The above `background-repeat: no-repeat;` is a separate declaration,
    // the 'background' shorthand will *not* inherit it unless it's explicitly
    // written into the shorthand for each layer. The test above for `background`
    // shorthand will use the default 'repeat' for each layer.
    // If the input was `background: url(a.png) no-repeat, url(b.png) no-repeat, url(c.png) no-repeat;`
    // then background-repeat would be "no-repeat, no-repeat, no-repeat".
    // Or if the input was `background: no-repeat url(a.png), url(b.png), url(c.png);`
    // it would still be 'no-repeat, repeat, repeat' as 'no-repeat' applies only to the first layer it encounters.
  },
  {
    name: "background-image with space in url",
    input: "background: url('image with spaces.png');",
    expected: {
      "background-image": "url('image with spaces.png')",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "background-image with escaped quote in url",
    input: 'background: url("image\\".png");',
    expected: {
      "background-image": 'url("image\\".png")',
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "background-color transparent",
    input: "background: transparent;",
    expected: {
      "background-color": "transparent",
    },
  },
  {
    name: "background with currentColor",
    input: "background: url(a.png) currentColor;",
    expected: {
      "background-image": "url(a.png)",
      "background-color": "currentcolor",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },

  // --- Keywords ---
  {
    name: "background: initial",
    input: "background: initial;",
    expected: {
      "background-attachment": "initial",
      "background-clip": "initial",
      "background-color": "initial",
      "background-image": "initial",
      "background-origin": "initial",
      "background-position": "initial",
      "background-repeat": "initial",
      "background-size": "initial",
    },
  },
  {
    name: "background: inherit",
    input: "background: inherit;",
    expected: {
      "background-attachment": "inherit",
      "background-clip": "inherit",
      "background-color": "inherit",
      "background-image": "inherit",
      "background-origin": "inherit",
      "background-position": "inherit",
      "background-repeat": "inherit",
      "background-size": "inherit",
    },
  },

  // --- !important modifier ---
  {
    name: "single color !important",
    input: "background: red !important;",
    expected: {
      "background-color": "red !important",
    },
  },
  {
    name: "full single layer !important",
    input:
      "background: url('image.gif') no-repeat fixed right top / 50% auto padding-box border-box red !important;",
    expected: {
      "background-image": "url('image.gif') !important",
      "background-repeat": "no-repeat !important",
      "background-attachment": "fixed !important",
      "background-position": "right top !important",
      "background-size": "50% auto !important",
      "background-origin": "padding-box !important",
      "background-clip": "border-box !important",
      "background-color": "red !important",
    },
  },
  {
    name: "multiple layers !important",
    input: "background: url(a.png) no-repeat, url(b.png) fixed, blue !important;",
    expected: {
      "background-image": "url(a.png) !important, url(b.png) !important, none !important",
      "background-repeat": "no-repeat !important, repeat !important, repeat !important",
      "background-attachment": "scroll !important, fixed !important, scroll !important",
      "background-color": "blue !important",
      "background-position": "0% 0% !important, 0% 0% !important, 0% 0% !important",
      "background-size": "auto auto !important, auto auto !important, auto auto !important",
      "background-origin": "padding-box !important, padding-box !important, padding-box !important",
      "background-clip": "border-box !important, border-box !important, border-box !important",
    },
  },

  // --- Invalid Cases (should return undefined) ---
  {
    name: "invalid property value",
    input: "background: 123px;", // a length on its own is not a valid background shorthand
    expected: undefined,
  },
  {
    name: "color followed by image in same layer", // Order matters
    input: "background: red url(a.png);",
    expected: undefined,
  },
  {
    name: "two origins in same layer",
    input: "background: url(a.png) padding-box content-box border-box;",
    expected: undefined,
  },
  {
    name: "two attachments in same layer",
    input: "background: url(a.png) fixed local;",
    expected: undefined,
  },
  {
    name: "malformed url",
    input: "background: url(a.png;)",
    expected: undefined,
  },
  {
    name: "too many position values",
    input: "background: url(a.png) 10px 20px 30px;",
    expected: undefined,
  },
  {
    name: "too many size values",
    input: "background: url(a.png) / 10px 20px 30px;",
    expected: undefined,
  },
  {
    name: "size without position separator",
    input: "background: url(a.png) 100px;", // Ambiguous, 100px could be position. If meant as size, needs '/'
    expected: {
      "background-image": "url(a.png)",
      "background-position": "100px",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    },
  },
  {
    name: "size without position and without image",
    input: "background: / 100px red;", // Invalid way to specify size
    expected: undefined,
  },
  {
    name: "invalid position",
    input: "background: url(a.png) not-a-position;",
    expected: undefined,
  },
  {
    name: "invalid repeat",
    input: "background: url(a.png) not-a-repeat;",
    expected: undefined,
  },
];

// Example usage in a test file:
/*
import { expand } from './index'; // Assuming expand is your default export

describe('background shorthand expander', () => {
  backgroundTestFixtures.forEach(({ name, input, expected }) => {
    it(`should correctly expand: ${name || input}`, () => {
      const result = expand(input);
      expect(result).toEqual(expected);
    });
  });
});
*/
