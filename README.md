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

- **🚀 Fast**: Zero-dependency core, optimized for performance
- **📦 Lightweight**: ~15KB minified
- **🎨 Complete**: Supports 35+ CSS shorthands including modern features
- **🔒 Type-Safe**: Full TypeScript support with comprehensive type definitions
- **✅ Reliable**: 738 tests ensuring 100% accuracy
- **🎛️ Flexible**: Multiple output formats and property ordering strategies

## ✨ Features

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
//   'background-image': 'url(bg.png)',
//   'background-repeat': 'no-repeat',
//   'background-position': 'center'
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
  /** Output format */
  format?: 'js' | 'css';  // default: 'css'

  /** Indentation level for CSS format */
  indent?: number;  // default: 0

  /** Separator between CSS declarations */
  separator?: string;  // default: '\n'

  /** Property ordering strategy */
  propertyGrouping?: 'by-property' | 'by-side';  // default: 'by-property'
}
```

##### Property Grouping Strategies

Control how properties are ordered in the output:

**`by-property`** (default) - CSS specification order, groups by property type:

```javascript
{
  'border-top-width': '10px',
  'border-right-width': '10px',
  'border-bottom-width': '10px',
  'border-left-width': '10px',
  'margin-top': '5px',
  'margin-right': '5px',
  'margin-bottom': '5px',
  'margin-left': '5px'
}
```

**`by-side`** - Directional order, groups by box model side (useful for debugging):

```javascript
{
  'border-top-width': '10px',
  'margin-top': '5px',
  'border-right-width': '10px',
  'margin-right': '5px',
  'border-bottom-width': '10px',
  'margin-bottom': '5px',
  'border-left-width': '10px',
  'margin-left': '5px'
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

// Margin expansion
expand('margin: 10px 20px 30px 40px;');
// → margin-top: 10px; margin-right: 20px; margin-bottom: 30px; margin-left: 40px;

// Padding with JavaScript object output
expand('padding: 1rem;', { format: 'js' });
// → { 'padding-top': '1rem', 'padding-right': '1rem', 'padding-bottom': '1rem', 'padding-left': '1rem' }
```

### Complex Backgrounds

```typescript
// Multi-layer backgrounds
import { expand } from 'b_short';

expand('background: url(img1.png) top left no-repeat, linear-gradient(to bottom, #000, #fff);', {
  format: 'js'
});
// → {
//   'background-image': 'url(img1.png), linear-gradient(to bottom, #000, #fff)',
//   'background-position': 'top left, 0% 0%',
//   'background-repeat': 'no-repeat, repeat'
// }
```

### Flexbox & Grid

```typescript
import { expand } from 'b_short';

// Flexbox
expand('flex: 1 1 auto; flex-flow: row wrap;', { format: 'js' });
// → { 'flex-grow': '1', 'flex-shrink': '1', 'flex-basis': 'auto', 'flex-direction': 'row', 'flex-wrap': 'wrap' }

// Grid
expand('grid: repeat(3, 1fr) / auto-flow 100px;', { format: 'js' });
// → { 'grid-template-rows': 'repeat(3, 1fr)', 'grid-auto-flow': 'column', 'grid-auto-columns': '100px' }
```

### Animation & Transitions

```typescript
import { expand } from 'b_short';

// Multi-layer animations
expand('animation: spin 1s linear infinite, fade 2s ease-in-out;', { format: 'js' });
// → {
//   'animation-name': 'spin, fade',
//   'animation-duration': '1s, 2s',
//   'animation-timing-function': 'linear, ease-in-out',
//   'animation-iteration-count': 'infinite, 1'
// }

// Transitions
expand('transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);', { format: 'js' });
```

### Modern CSS Features

```typescript
import { expand } from 'b_short';

// CSS Motion Path (offset)
expand('offset: path("M 0 0 L 100 100") 50% / center;', { format: 'js' });
// → { 'offset-path': 'path("M 0 0 L 100 100")', 'offset-distance': '50%', 'offset-anchor': 'center' }

// Mask with multiple layers
expand('mask: url(mask.svg) center / contain, linear-gradient(black, transparent);', { format: 'js' });
```

### Property Overrides

```typescript
import { expand } from 'b_short';

// Later properties override earlier ones (CSS cascade)
expand('margin: 10px; margin-top: 20px;', { format: 'js' });
// → { 'margin-top': '20px', 'margin-right': '10px', 'margin-bottom': '10px', 'margin-left': '10px' }

// Shorthand after longhand
expand('margin-top: 20px; margin: 10px;', { format: 'js' });
// → { 'margin-top': '10px', 'margin-right': '10px', 'margin-bottom': '10px', 'margin-left': '10px' }
```

### Error Handling

```typescript
import { expand } from 'b_short';

// Validation errors
const { ok, result, issues } = expand('margin: ;');
console.log(ok);  // false
console.log(issues);  // [{ name: 'css-syntax-error', property: 'margin', ... }]

// Warnings (processing continues)
const { ok, result, issues } = expand('margin: 10px !important;');
console.log(ok);  // true
console.log(result);  // { margin: '10px !important' }
console.log(issues);  // [{ name: 'important-detected', property: 'margin' }]
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
- **Small**: ~15KB minified, ~5KB gzipped
- **Efficient**: LRU caching for frequently-used values
- **Tested**: 750 comprehensive tests ensuring correctness

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm type-check

# Lint
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Build
pnpm build

# Build in watch mode
pnpm dev

# Run benchmarks
pnpm bench

# Check bundle size
pnpm size

# Check for outdated dependencies
pnpm outdated

# Update dependencies
pnpm update

# Audit dependencies for vulnerabilities
pnpm audit

# Fix audit issues automatically
pnpm audit:fix
```

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
