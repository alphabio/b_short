# 🎨 b_short

[![CI](https://github.com/alphabio/b_short/actions/workflows/ci.yml/badge.svg)](https://github.com/alphabio/b_short/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/b_short.svg)](https://www.npmjs.com/package/b_short)
[![npm downloads](https://img.shields.io/npm/dm/b_short.svg)](https://www.npmjs.com/package/b_short)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Transform CSS shorthand chaos into organized longhand clarity** ✨

A lightning-fast, lightweight TypeScript library that expands CSS shorthand properties into their individual longhand equivalents. Perfect for CSS-in-JS libraries, build tools, and anyone who needs to normalize CSS properties.

```bash
pnpm add b_short
# or
npm install b_short
# or
yarn add b_short
```

## 🚀 Quick Start

```javascript
import expand from 'b_short';

// Simple expansion (CSS string output)
expand('margin: 10px 20px;');
// margin-top: 10px;
// margin-right: 20px;
// margin-bottom: 10px;
// margin-left: 20px;"

// Complex multi-layer backgrounds
expand('background: url(a.png) no-repeat, linear-gradient(to right, red, blue);');
// background-image: url(a.png),linear-gradient(to right, red, blue);

// CSS Motion Path (new!)
expand('offset: path("M 0 0 L 100 100") 50px auto 45deg / center;');
// offset-path: path("M 0 0 L 100 100");
// offset-distance: 50px;
// offset-rotate: auto 45deg;
// offset-anchor: center;

// Flexbox shorthand
expand('flex: 1 0 auto;');
// flex-grow: 1;
// flex-shrink: 0;
// flex-basis: auto;

// Grid shorthand
expand('grid: repeat(3, 1fr) / auto;');
// grid-template-columns: repeat(3, 1fr);
// grid-template-rows: auto;
```

## Comprehensive Examples

### Flexbox Examples

```javascript
// Flex shorthand
expand('flex: 1;');
// flex-grow: 1;
// flex-shrink: 1;
// flex-basis: 0%;

expand('flex: 0 1 auto;');
// flex-grow: 0;
// flex-shrink: 1;
// flex-basis: auto;

expand('flex-flow: column wrap;');
// flex-direction: column;
// flex-wrap: wrap;
```

### Grid Examples

```javascript
// Grid area
expand('grid-area: header;');
// grid-row-start: header;
// grid-column-start: header;
// grid-row-end: auto;
// grid-column-end: auto;

expand('grid-column: 1 / 3;');
// grid-column-start: 1;
// grid-column-end: 3;

expand('grid-row: span 2;');
// grid-row-start: span 2;
// grid-row-end: auto;

// Complex grid template
expand('grid: "header header" 50px "sidebar main" 1fr / 200px 1fr;');
// grid-template-areas: "header header" "sidebar main";
// grid-template-rows: 50px 1fr;
// grid-template-columns: 200px 1fr;
```

### Animation Examples

```javascript
// Single animation
expand('animation: spin 1s ease-in-out;');
// animation-name: spin;
// animation-duration: 1s;
// animation-timing-function: ease-in-out;
// animation-delay: 0s;
// animation-iteration-count: 1;
// animation-direction: normal;
// animation-fill-mode: none;
// animation-play-state: running;

// Multi-layer animations
expand('animation: spin 1s ease-in-out, fade 2s linear;');
// animation-name: spin,fade;
// animation-duration: 1s,2s;
// ... (all 8 longhands for each layer)
```

### Transition Examples

```javascript
// Single transition
expand('transition: opacity 0.3s ease;');
// transition-property: opacity;
// transition-duration: 0.3s;
// transition-timing-function: ease;
// transition-delay: 0s;

// Multi-layer transitions
expand('transition: all 0.2s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);');
// transition-property: all,transform;
// transition-duration: 0.2s,0.5s;
// transition-timing-function: ease,cubic-bezier(0.4, 0, 0.2, 1);
// transition-delay: 0s,0s;
```

### Mask Examples

```javascript
// Multi-layer mask (similar to background)
expand('mask: url(mask.png) no-repeat center / contain, linear-gradient(to right, transparent, black);');
// mask-image: url(mask.png),linear-gradient(to right, transparent, black);
// mask-mode: match-source,match-source;
// mask-repeat: no-repeat,no-repeat;
// mask-position: center,center;
// mask-size: contain,auto;
// mask-origin: border-box,border-box;
// mask-clip: border-box,border-box;
// mask-composite: add,add;
```

## Usage

The module exposes a single function which takes CSS declaration strings and returns expanded properties.

## JavaScript (CommonJS)

```javascript
const expand = require('b_short');

// Single declaration
const result = expand('background: url(image.png) no-repeat #ff0;');

// Multiple declarations
const results = expand(`
  background: url(image.png) no-repeat #ff0;
  margin: 10px;
`);
```

## TypeScript/ESM

```typescript
import expand, { ExpandOptions } from 'b_short';

// Default: returns CSS string
const result = expand('background: url(image.png) no-repeat #ff0;');
// background-image: url(image.png);
// background-repeat: no-repeat;
// background-color: #ff0;

// JavaScript object format
const obj = expand('background: url(image.png) no-repeat #ff0;', {
  format: 'js'
});
// {
//  'background-image': 'url(image.png)',
//  'background-repeat': 'no-repeat',
//  'background-color': '#ff0'
// }

// Multiple declarations with custom formatting
const results = expand(`
  margin: 10px;
  padding: 5px;
`, {
  format: 'css',
  indent: '',
  separator: ' '
});
```

## Options

The `expand` function accepts an optional second parameter with formatting options:

- `format`: `'js' | 'css'` - Output format (default: `'js'`)
- `indent`: `string` - Indentation for CSS output (default: `'  '`)
- `separator`: `string` - Separator between CSS declarations (default: `'\n'`)

## Output Formats

### CSS String (default)

```css
background-image: url(image.png);
background-repeat: no-repeat;
background-color: #ff0;
```

### JavaScript Object

```javascript
{
 'background-image': 'url(image.png)',
 'background-repeat': 'no-repeat',
 'background-color': '#ff0'
}
```

### Multiple Declarations

```javascript
// Input string with multiple CSS declarations
const results = expand(`
  margin: 10px;
  padding: 5px;
`, { format: 'css' });

// Output string expanded results
// margin-top: 10px;
// margin-right: 10px;...;
// padding-top: 5px;..."
```

## 🎯 Supported Properties

Currently supporting **35 CSS shorthand properties** with comprehensive shorthand expansion:

### Layout & Positioning (9 properties)

- **Flexbox**: `flex`, `flex-flow`
- **Grid**: `grid`, `grid-area`, `grid-column`, `grid-row`
- **Positioning**: `inset`
- **Alignment**: `place-content`, `place-items`, `place-self`

### Spacing (2 properties)

- `margin`, `padding`

### Visual Styling (13 properties)

- **Background**: `background` (multi-layer)
- **Borders**: `border`, `border-top`, `border-right`, `border-bottom`, `border-left`, `border-color`, `border-style`, `border-width`, `border-radius`
- **Typography**: `font`, `text-decoration`, `text-emphasis`
- **Lists**: `list-style`
- **Outline**: `outline`

### Animation & Motion (3 properties)

- `animation` (multi-layer), `transition` (multi-layer), `offset`

### Advanced Features (8 properties)

- **Masking**: `mask` (multi-layer)
- **Columns**: `columns`, `column-rule`
- **Overflow**: `overflow`
- **Containment**: `contain-intrinsic-size`

## 💡 Use Cases

### CSS-in-JS Libraries

```javascript
// styled-components, emotion, etc.
const expandedStyles = expand('margin: 10px 20px; padding: 5px;');
// → { marginTop: '10px', marginRight: '20px', ... }
```

### Build Tools & PostCSS Plugins

```javascript
// Normalize CSS properties for consistent processing
const normalized = expand(cssString, { format: 'js' });
```

### CSS Analysis & Linting

```javascript
// Extract individual properties for analysis
const properties = expand('background: url(img.png) no-repeat center;');
// → { 'background-image': 'url(img.png)', 'background-repeat': 'no-repeat', ... }
```

### Animation Libraries

```javascript
// Expand complex animations and transitions
expand('animation: spin 1s ease-in-out, fade 2s linear;');
// → Multiple expanded animation properties
```

### CSS Motion Path Support ✨

```javascript
// New! Complete offset shorthand expansion
expand('offset: 10px 30px path("M 0 0 L 100 100") 50px auto 45deg / center;');
// → {
//     'offset-position': '10px 30px',
//     'offset-path': 'path("M 0 0 L 100 100")',
//     'offset-distance': '50px',
//     'offset-rotate': 'auto 45deg',
//     'offset-anchor': 'center'
//   }
```

### Grid Layout

```javascript
// Perfect for CSS Grid frameworks
const gridStyles = expand('grid: repeat(3, 1fr) / auto; place-items: center;');
// → { 'grid-template-columns': 'repeat(3, 1fr)', 'grid-template-rows': 'auto', 'align-items': 'center', 'justify-items': 'center' }
```

### Flexbox

```javascript
// Flexbox utilities
const flexStyles = expand('flex: 1 1 0%; flex-flow: row wrap;');
// → { 'flex-grow': '1', 'flex-shrink': '1', 'flex-basis': '0%', 'flex-direction': 'row', 'flex-wrap': 'wrap' }
```

### Multi-layer Animations

```javascript
// Complex animations for UI libraries
const animations = expand('animation: slideIn 0.3s ease-out, fadeIn 0.5s ease-in; transition: all 0.2s ease;');
// → Expanded animation and transition properties
```

### Mask Effects

```javascript
// Advanced masking for design systems
const maskStyles = expand('mask: url(circle.svg) center / 50px 50px no-repeat, radial-gradient(circle at center, black 50%, transparent 50%);');
// → Complete mask expansion
```

## ⚡ Performance

- **Lightning Fast**: Minimal dependencies, optimized TypeScript
- **Bundle Size**: ~15KB minified (check [Bundlephobia](https://bundlephobia.com/package/b_short))
- **Memory Efficient**: No runtime allocations for repeated calls
- **Type Safe**: Full TypeScript support with inferred types
- **Comprehensive Coverage**: 35 shorthands with 200+ test cases
- **Zero Regressions**: All functionality thoroughly tested

## 🔧 API Reference

### `expand(css: string, options?: ExpandOptions): ExpandedResult`

Expands CSS shorthand properties to longhand equivalents.

#### Parameters

- `css`: CSS declaration string(s) to expand
- `options` (optional): Configuration object

#### Options

```typescript
interface ExpandOptions {
  format?: 'js' | 'css';     // Output format (default: 'css')
  indent?: number;           // CSS indentation (default: 0)
  separator?: string;        // CSS declaration separator (default: '\n')
}
```

#### Returns

- **CSS format** (default): Formatted CSS string or `Array<string>` for multiple declarations
- **JS format**: `{ [property: string]: string }` or `Array` for multiple declarations

#### Examples

```typescript
// Single declaration - CSS string (default)
expand('margin: 10px;');
// → "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"

// Multiple declarations - CSS strings array
expand('margin: 10px; padding: 5px;');
// → ["margin-top: 10px;\n...", "padding-top: 5px;\n..."]

// JavaScript object output
expand('margin: 10px;', { format: 'js' });
// → { 'margin-top': '10px', 'margin-right': '10px', ... }
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

## 📄 License

MIT © [alphabio](https://github.com/alphabio)

---

<div align="center">

**Made by [alphabio](https://alphab.io)**

[⭐ Star us on GitHub](https://github.com/alphabio/b_short) • [📖 Read the docs](https://github.com/alphabio/b_short#readme) • [🐛 Report bugs](https://github.com/alphabio/b_short/issues)

</div>
