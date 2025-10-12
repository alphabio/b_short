# Rules for Collapsing Repeating Layer Values

For any longhand property that can accept a comma-separated list of values (e.g., `background-image`, `background-position`, `background-size`, `background-repeat`, `background-attachment`, `background-origin`, `background-clip`):

1.  **Count the Layers (M):** Determine the total number of distinct background layers. This is usually the maximum number of items in any of the expanded longhand lists (e.g., if `background-image` has 3 values and `background-position` has 2, there are 3 layers, and the `background-position` will effectively repeat).

2.  **Count Unique Values (N) for Each Property:** For each longhand property (e.g., `background-repeat`), count the number of *unique* values in its comma-separated list, considering the repetition rules.

3.  **Check for Effective Repetition:**
    *   **If N = 1:** If all `M` layers effectively resolve to the *same single value* for that property, then the output for that longhand property can be collapsed to just that single value.
        *   Example: `background-repeat: repeat, repeat, repeat;` should collapse to `background-repeat: repeat;`
    *   **If N > 1:** If there are multiple distinct values, or if the pattern of values would change if collapsed, it cannot be collapsed. The full comma-separated list must be maintained.
        *   Example: `background-repeat: no-repeat, repeat, repeat;` cannot collapse.
        *   Example: `background-position: 0 0, 0 0, 10px 10px;` cannot collapse.

**Crucial Nuance: The "Recycling" or "Padding" Rule for Longhands**

When you have, for example, 3 layers but only 1 `background-repeat` value in the CSS (e.g., `background-repeat: no-repeat;`), CSS *effectively* recycles that value: `no-repeat, no-repeat, no-repeat`. Your expander should first produce this "recycled" list, and *then* apply the collapsing rule.

However, your `expand` function is receiving a single shorthand `background: ...` value. The output of your `expand` function *should already reflect this recycling*. For instance, `background: url(a.png), url(b.png), url(c.png);` implies:

*   `background-image: url(a.png), url(b.png), url(c.png)` (3 layers)
*   `background-repeat: repeat, repeat, repeat` (default for each layer)
*   `background-position: 0% 0%, 0% 0%, 0% 0%` (default for each layer)

So, your collapsing logic will work on these fully "padded" longhand values.

## Test Fixtures for Collapsing Repeating Layers

These fixtures assume your parser *first* expands all defaults and repetitions, and *then* applies the collapsing rule to the generated comma-separated longhand strings.

```typescript
interface TestCase {
  input: string;
  expected: Record<string, string> | undefined;
  name?: string; // Optional name for better test descriptions
}

const backgroundCollapsingTestFixtures: TestCase[] = [
  // --- Simple Collapsing Scenarios ---

  {
    name: "Collapsible: Two images, both default repeat",
    input: "background: url(a.png), url(b.png);",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "0% 0%", // Collapsed from "0% 0%, 0% 0%"
      "background-size": "auto auto", // Collapsed from "auto auto, auto auto"
      "background-repeat": "repeat", // Collapsed from "repeat, repeat"
      "background-attachment": "scroll", // Collapsed from "scroll, scroll"
      "background-origin": "padding-box", // Collapsed from "padding-box, padding-box"
      "background-clip": "border-box", // Collapsed from "border-box, border-box"
    },
  },
  {
    name: "Collapsible: Three images, all explicit 'no-repeat'",
    input: "background: url(a.png) no-repeat, url(b.png) no-repeat, url(c.png) no-repeat;",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-repeat": "no-repeat", // Collapsed from "no-repeat, no-repeat, no-repeat"
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Collapsible: Two images, explicit same position",
    input: "background: url(a.png) center, url(b.png) center;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center", // Collapsed from "center, center"
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Collapsible: Three images, explicit same size",
    input: "background: url(a.png) / cover, url(b.png) / cover, url(c.png) / cover;",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-size": "cover", // Collapsed from "cover, cover, cover"
      "background-position": "0% 0%",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Collapsible: Two images, same origin/clip combination",
    input: "background: url(a.png) padding-box content-box, url(b.png) padding-box content-box;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-origin": "padding-box", // Collapsed
      "background-clip": "content-box", // Collapsed
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
    },
  },
  {
    name: "Collapsible: Three images, all origin/clip default (one box keyword)",
    input: "background: url(a.png) border-box, url(b.png) border-box, url(c.png) border-box;",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-origin": "border-box", // Collapsed
      "background-clip": "border-box", // Collapsed
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
    },
  },

  // --- Non-Collapsing Scenarios (Edge Cases) ---

  {
    name: "Non-collapsible: Two images, different repeats",
    input: "background: url(a.png) no-repeat, url(b.png) repeat-x;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-repeat": "no-repeat, repeat-x", // Different values, no collapse
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: Two images, position values differ",
    input: "background: url(a.png) center, url(b.png) left;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center, left", // Different values, no collapse
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: Three images, one different repeat",
    input: "background: url(a.png) no-repeat, url(b.png), url(c.png);",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-repeat": "no-repeat, repeat, repeat", // Not all same, no collapse
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: Three images, last attachment differs",
    input: "background: url(a.png) fixed, url(b.png) fixed, url(c.png) scroll;",
    expected: {
      "background-image": "url(a.png), url(b.png), url(c.png)",
      "background-attachment": "fixed, fixed, scroll", // Not all same, no collapse
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: Two images, different origin/clip combinations",
    input: "background: url(a.png) padding-box content-box, url(b.png) border-box;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-origin": "padding-box, border-box", // Different values, no collapse
      "background-clip": "content-box, border-box", // Different values, no collapse
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
    },
  },
  {
    name: "Non-collapsible: Position with varying 1 vs 2 values per layer",
    input: "background: url(a.png) 10px, url(b.png) 20px 30px;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-position": "10px, 20px 30px", // Not all same, no collapse
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: Size with varying 1 vs 2 values per layer",
    input: "background: url(a.png) / 50%, url(b.png) / 20px auto;",
    expected: {
      "background-image": "url(a.png), url(b.png)",
      "background-size": "50%, 20px auto", // Not all same, no collapse
      "background-position": "0% 0%",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
    },
  },
  {
    name: "Non-collapsible: mixed with background-color",
    input: "background: url(a.png) no-repeat, url(b.png) repeat-x, red;",
    expected: {
      "background-image": "url(a.png), url(b.png), none",
      "background-repeat": "no-repeat, repeat-x, repeat", // Not all same, no collapse
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "red",
    },
  },
];
```

### Implementation Strategy for Collapsing

After you've successfully generated the *full* comma-separated string for each longhand property (e.g., `"repeat, repeat, repeat"`), you'll need an additional step:

1.  **Split the comma-separated string** for a given longhand property into an array of individual values (e.g., `["repeat", "repeat", "repeat"]`).
2.  **Check if all elements in the array are identical.**
3.  **If they are identical**, join them back into a single string (e.g., `"repeat"`) and assign that to the result object.
4.  **If they are not identical**, keep the original comma-separated string.

This post-processing step ensures that your output is as concise as possible while accurately reflecting the CSS.
