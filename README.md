# b_short

<div align="center">

[![CI](https://github.com/alphabio/b_short/actions/workflows/ci.yml/badge.svg)](https://github.com/alphabio/b_short/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/b_short.svg)](https://www.npmjs.com/package/b_short)
[![npm downloads](https://img.shields.io/npm/dm/b_short.svg)](https://www.npmjs.com/package/b_short)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/b_short)](https://bundlephobia.com/package/b_short)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Lightning-fast CSS shorthand expansion to longhand properties**

[Features](#-features) •
[Installation](#-installation) •
[Quick Start](#-quick-start) •
[API](#-api) •
[Examples](#-examples) •
[Contributing](#-contributing)

</div>

## 🎯 Overview

b_short is a TypeScript-first library that expands CSS shorthand properties into their individual longhand equivalents. Designed for CSS-in-JS libraries, build tools, and any application requiring CSS property normalization.

### Why b_short?

- **🚀 Fast**: Optimized for performance with efficient parsing
- **📦 Lightweight**: ~65KB minified (~18KB gzipped)
- **🎨 Complete**: Supports 35+ CSS shorthands including modern features
- **🔒 Type-Safe**: Full TypeScript support with comprehensive type definitions
- **✅ Reliable**: 808 tests ensuring 100% accuracy
- **🎛️ Flexible**: Multiple output formats (CSS string or JS object with camelCase)
- **⚛️ React-Ready**: JS format returns camelCase properties perfect for inline styles
- **🎯 Smart**: Optional partial longhand expansion with CSS defaults (36 directional properties)

## ✨ Features

### Output Formats

- **CSS Format** (default): Returns kebab-case strings ready for stylesheets
- **JavaScript Format**: Returns camelCase objects perfect for React inline styles, CSS-in-JS libraries, and JavaScript style manipulation

```typescript
// CSS format - kebab-case string
expand('text-decoration: underline;', { format: 'css' })
// → "text-decoration-line: underline;\ntext-decoration-style: solid;..."

// JS format - camelCase object
expand('text-decoration: underline;', { format: 'js' })
// → { textDecorationLine: 'underline', textDecorationStyle: 'solid', ... }
```

### Supported CSS Shorthands

<details>
<summary><strong>Box Model & Layout (13 shorthands)</strong></summary>

- `margin`, `padding` - Directional spacing
- `border`, `border-width`, `border-style`, `border-color` - All border variations
- `border-top`, `border-right`, `border-bottom`, `border-left` - Individual sides
- `border-radius` - Corner rounding
- `inset` - Positioning shorthand
- `overflow` - Overflow behavior

</details>

<details>
<summary><strong>Visual Effects (5 shorthands)</strong></summary>

- `background` - Complete background expansion with multi-layer support
- `mask` - Multi-layer masking with all properties
- `outline` - Outline styling
- `text-decoration` - Text decoration with color and thickness
- `text-emphasis` - Text emphasis marks

</details>

<details>
<summary><strong>Layout Systems (9 shorthands)</strong></summary>

- `grid`, `grid-area`, `grid-column`, `grid-row` - CSS Grid
- `flex`, `flex-flow` - Flexbox
- `place-content`, `place-items`, `place-self` - Alignment
- `columns`, `column-rule` - Multi-column

</details>

<details>
<summary><strong>Animation & Motion (4 shorthands)</strong></summary>

- `animation` - Multi-layer animations
- `transition` - Multi-layer transitions
- `offset` - CSS Motion Path (offset-path)
- `contain-intrinsic-size` - Size containment

</details>

<details>
<summary><strong>Typography (2 shorthands)</strong></summary>

- `font` - Complete font properties
- `list-style` - List styling

</details>

## 📦 Installation

```bash
npm install b_short
```

```bash
pnpm add b_short
```

```bash
yarn add b_short
```

## 🚀 Quick Start

```typescript
import { expand } from 'b_short';

// Basic expansion
const { result } = expand('margin: 10px 20px;');
console.log(result);
// Output: "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 10px;\nmargin-left: 20px;"

// JavaScript object format
const { result: obj } = expand('background: url(bg.png) no-repeat center;', { format: 'js' });
console.log(obj);
// Output: {
//   backgroundImage: 'url(bg.png)',
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'center',
//   backgroundSize: 'auto auto',
//   backgroundAttachment: 'scroll',
//   backgroundOrigin: 'padding-box',
//   backgroundClip: 'border-box'
// }
```

## 📚 API

### `expand(css, options?): ExpandResult`

Expands CSS shorthand properties to their longhand equivalents.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `css` | `string` | CSS declaration(s) to expand |
| `options` | `ExpandOptions` | Optional configuration object |

#### Options

```typescript
interface ExpandOptions {
  /** Output format: 'css' returns kebab-case string, 'js' returns camelCase object */
  format?: 'js' | 'css';  // default: 'css'

  /** Indentation level for CSS format */
  indent?: number;  // default: 0

  /** Separator between CSS declarations */
  separator?: string;  // default: '\n'

  /** Property ordering strategy */
  propertyGrouping?: 'by-property' | 'by-side';  // default: 'by-property'

  /** Expand partial directional longhands with CSS defaults (e.g., margin-top → all 4 sides) */
  expandPartialLonghand?: boolean;  // default: false
}
```

##### Property Grouping Strategies

Control how properties are ordered in the output:

**`by-property`** (default) - CSS specification order, groups by property type:

```javascript
// CSS format
'border-top-width: 10px;\nborder-right-width: 10px;\n...'

// JS format
{
  borderTopWidth: '10px',
  borderRightWidth: '10px',
  borderBottomWidth: '10px',
  borderLeftWidth: '10px',
  marginTop: '5px',
  marginRight: '5px',
  marginBottom: '5px',
  marginLeft: '5px'
}
```

**`by-side`** - Directional order, groups by box model side (useful for debugging):

```javascript
// JS format
{
  borderTopWidth: '10px',
  marginTop: '5px',
  borderRightWidth: '10px',
  marginRight: '5px',
  borderBottomWidth: '10px',
  marginBottom: '5px',
  borderLeftWidth: '10px',
  marginLeft: '5px'
}
```

#### Returns

```typescript
interface ExpandResult {
  /** true if no CSS validation errors occurred */
  ok: boolean;

  /** Expanded CSS (format determined by options.format) */
  result: string | Record<string, string> | undefined;

  /** Array of warnings and errors */
  issues: Array<{
    property: string;
    name: string;
    formattedWarning?: string;
  }>;
}
```

---

### `validate(css): ValidationResult`

Validates CSS declarations for syntax errors and property value correctness without expanding shorthands.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `css` | `string` | CSS declaration(s) to validate |

#### Returns

```typescript
interface ValidationResult {
  /** true if no syntax errors were found */
  ok: boolean;

  /** Array of syntax parsing errors */
  errors: Array<{
    name: string;
    message: string;
    line: number;
    column: number;
    property?: string;
  }>;

  /** Array of property validation warnings */
  warnings: Array<{
    property: string;
    name: string;
    formattedWarning?: string;
  }>;
}
```

#### Example

```typescript
import { validate } from 'b_short';

// Valid CSS
const valid = validate('margin: 10px; padding: 20px;');
console.log(valid.ok);  // true
console.log(valid.errors);  // []

// Invalid CSS syntax
const invalid = validate('margin: ; padding: 20px;');
console.log(invalid.ok);  // false
console.log(invalid.errors);  // [{ name: 'css-syntax-error', property: 'margin', ... }]

// Valid syntax but invalid property value
const warning = validate('color: notacolor;');
console.log(warning.ok);  // true (no syntax errors)
console.log(warning.warnings);  // [{ property: 'color', name: 'invalid-value', ... }]
```

**Use Cases:**

- Pre-validation before expansion
- CSS linting and validation tools
- Build-time CSS checks
- Editor integrations

---

## 💡 Examples

### Basic Usage

```typescript
import { expand } from 'b_short';

// CSS format (default)
expand('margin: 10px 20px 30px 40px;');
// → "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 30px;\nmargin-left: 40px;"

// JavaScript format
expand('padding: 1rem;', { format: 'js' });
// → { paddingTop: '1rem', paddingRight: '1rem', paddingBottom: '1rem', paddingLeft: '1rem' }

// Text decoration with all properties
expand('text-decoration: underline wavy red;', { format: 'js' });
// → {
//   textDecorationLine: 'underline',
//   textDecorationStyle: 'wavy',
//   textDecorationColor: 'red',
//   textDecorationThickness: 'auto'
// }
```

### Complex Backgrounds

```typescript
// Multi-layer backgrounds
import { expand } from 'b_short';

expand('background: url(img1.png) top left no-repeat, linear-gradient(to bottom, #000, #fff);', {
  format: 'js'
});
// → {
//   backgroundImage: 'url(img1.png), linear-gradient(to bottom, #000, #fff)',
//   backgroundPosition: 'top left, 0% 0%',
//   backgroundRepeat: 'no-repeat, repeat',
//   backgroundSize: 'auto auto, auto auto',
//   backgroundAttachment: 'scroll, scroll',
//   backgroundOrigin: 'padding-box, padding-box',
//   backgroundClip: 'border-box, border-box'
// }
```

### Flexbox & Grid

```typescript
import { expand } from 'b_short';

// Flexbox
expand('flex: 1 1 auto; flex-flow: row wrap;', { format: 'js' });
// → {
//   flexGrow: '1',
//   flexShrink: '1',
//   flexBasis: 'auto',
//   flexDirection: 'row',
//   flexWrap: 'wrap'
// }

// Grid
expand('grid: repeat(3, 1fr) / auto-flow 100px;', { format: 'js' });
// → {
//   gridTemplateRows: 'repeat(3, 1fr)',
//   gridAutoFlow: 'column',
//   gridAutoColumns: '100px'
// }
```

### Animation & Transitions

```typescript
import { expand } from 'b_short';

// Multi-layer animations
expand('animation: spin 1s linear infinite, fade 2s ease-in-out;', { format: 'js' });
// → {
//   animationName: 'spin, fade',
//   animationDuration: '1s, 2s',
//   animationTimingFunction: 'linear, ease-in-out',
//   animationIterationCount: 'infinite, 1',
//   animationDelay: '0s, 0s',
//   animationDirection: 'normal, normal',
//   animationFillMode: 'none, none',
//   animationPlayState: 'running, running'
// }

// Transitions
expand('transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);', { format: 'js' });
// → {
//   transitionProperty: 'opacity, transform',
//   transitionDuration: '0.3s, 0.5s',
//   transitionTimingFunction: 'ease, cubic-bezier(0.4, 0, 0.2, 1)',
//   transitionDelay: '0s, 0s'
// }
```

### Modern CSS Features

```typescript
import { expand } from 'b_short';

// CSS Motion Path (offset)
expand('offset: path("M 0 0 L 100 100") 50% / center;', { format: 'js' });
// → {
//   offsetPath: 'path("M 0 0 L 100 100")',
//   offsetDistance: '50%',
//   offsetAnchor: 'center'
// }

// Mask with multiple layers
expand('mask: url(mask.svg) center / contain, linear-gradient(black, transparent);', { format: 'js' });
// → {
//   maskImage: 'url(mask.svg), linear-gradient(black, transparent)',
//   maskPosition: 'center, 0% 0%',
//   maskSize: 'contain, auto',
//   // ... other mask properties
// }
```

### Partial Longhand Expansion

Optionally expand partial directional properties to show their complete state with CSS defaults:

```typescript
import { expand } from 'b_short';

// Default behavior - passes through unchanged
expand('margin-top: 10px;', { format: 'js' });
// → { marginTop: '10px' }

// With expansion enabled - fills in missing sides with CSS defaults
expand('margin-top: 10px;', { format: 'js', expandPartialLonghand: true });
// → {
//   marginTop: '10px',
//   marginRight: '0',
//   marginBottom: '0',
//   marginLeft: '0'
// }

// Works with border properties
expand('border-top-width: 1px;', { format: 'js', expandPartialLonghand: true });
// → {
//   borderTopWidth: '1px',
//   borderRightWidth: 'medium',  // CSS default
//   borderBottomWidth: 'medium',
//   borderLeftWidth: 'medium'
// }

// Multiple partial properties
expand('padding-top: 5px; margin-left: 10px;', { format: 'js', expandPartialLonghand: true });
// → {
//   paddingTop: '5px',
//   paddingRight: '0',
//   paddingBottom: '0',
//   paddingLeft: '0',
//   marginTop: '0',
//   marginRight: '0',
//   marginBottom: '0',
//   marginLeft: '10px'
// }
```

**Supported Properties (36 total):**

- Border properties: `border-{top|right|bottom|left}-{width|style|color}` (12)
- Spacing: `margin-*`, `padding-*` (8)
- Border radius: `border-{top-left|top-right|bottom-right|bottom-left}-radius` (4)
- Positioning: `top`, `right`, `bottom`, `left` (4)
- Scroll: `scroll-margin-*`, `scroll-padding-*` (8)

**Use Cases:**

- Design system normalization - generate complete token sets
- Static analysis - identify which sides are explicitly set vs defaults
- CSS debugging - visualize complete property state
- Documentation generation - show full property expansion

### Property Overrides

```typescript
import { expand } from 'b_short';

// Later properties override earlier ones (CSS cascade)
expand('margin: 10px; margin-top: 20px;', { format: 'js' });
// → {
//   marginTop: '20px',
//   marginRight: '10px',
//   marginBottom: '10px',
//   marginLeft: '10px'
// }

// Shorthand after longhand
expand('margin-top: 20px; margin: 10px;', { format: 'js' });
// → {
//   marginTop: '10px',
//   marginRight: '10px',
//   marginBottom: '10px',
//   marginLeft: '10px'
// }
```

### Error Handling

```typescript
import { expand } from 'b_short';

// Validation errors
const result1 = expand('margin: ;');
console.log(result1.ok);  // false
console.log(result1.issues);
// → [
//   {
//     name: 'css-syntax-error',
//     property: 'margin',
//     message: '...',
//     ...
//   }
// ]

// Warnings (processing continues)
const result2 = expand('margin: 10px !important;');
console.log(result2.ok);  // true
console.log(result2.result);  // { margin: '10px !important' }
console.log(result2.issues);
// → [
//   {
//     name: 'important-detected',
//     property: 'margin'
//   }
// ]

// Invalid property value with detailed error
const result3 = expand("background: url('image.png') no-repeat center/cover invalid;");
console.log(result3);
// → {
//   ok: true,
//   result: 'background-image: url(image.png);\n' +
//     'background-position: center;\n' +
//     'background-size: cover;\n' +
//     'background-repeat: no-repeat;\n' +
//     'background-attachment: scroll;\n' +
//     'background-origin: padding-box;\n' +
//     'background-clip: border-box;',
//   issues: [
//     {
//       property: 'background',
//       name: 'SyntaxMatchError',
//       syntax: '[ <bg-layer> , ]* <final-bg-layer>',
//       formattedWarning: 'Errors found in: background\n' +
//         "   1 |background: url('image.png') no-repeat center/cover invalid;\n" +
//         '      ----------------------------------------------------^^^^^^^'
//     }
//   ]
// }
```

## 🎨 Use Cases

### CSS-in-JS Libraries

```typescript
import { expand } from 'b_short';

// Perfect for styled-components, emotion, etc.
const styles = expand('margin: 1rem; padding: 0.5rem; border: 1px solid #ccc;', { format: 'js' });
// Use expanded styles in your CSS-in-JS library
```

### Build Tools & Bundlers

```typescript
import { expand } from 'b_short';

// PostCSS plugin, webpack loader, or vite plugin
function processCss(css) {
  const { result } = expand(css, { format: 'css' });
  return result;
}
```

### Static Analysis Tools

```typescript
import { expand } from 'b_short';

// Analyze CSS for linting, optimization, or documentation
const { result } = expand(rawCSS, { format: 'js' });
const properties = Object.keys(result);
// Analyze expanded properties
```

### Design Systems

```typescript
import { expand } from 'b_short';

// Normalize and validate design tokens
const tokens = {
  spacing: expand('margin: var(--spacing-md);', { format: 'js' }),
  layout: expand('flex: 1 1 0%; place-items: center;', { format: 'js' })
};
```

## ⚡ Performance

- **Fast**: Optimized TypeScript with memoization for repeated calls
- **Small**: ~65KB minified, ~18KB gzipped
- **Efficient**: LRU caching for frequently-used values
- **Tested**: 808 comprehensive tests ensuring correctness

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Lint and format
pnpm lint
pnpm lint:fix
```

For a complete list of available scripts, see `package.json`.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

- Write tests for new features
- Follow existing code style (enforced by Biome)
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

MIT © [alphabio](https://github.com/alphabio)

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- CSS parsing powered by [css-tree](https://github.com/csstree/csstree)
- Testing with [Vitest](https://vitest.dev/)
- Code quality with [Biome](https://biomejs.dev/)

---

<div align="center">

**[⭐ Star on GitHub](https://github.com/alphabio/b_short)** • **[📖 Documentation](https://github.com/alphabio/b_short#readme)** • **[🐛 Report Issues](https://github.com/alphabio/b_short/issues)**

Made with ❤️ by [alphabio](https://alphab.io)

</div>
