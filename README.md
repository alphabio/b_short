# b_short

<div align="center">

[![CI](https://github.com/alphabio/b_short/actions/workflows/ci.yml/badge.svg)](https://github.com/alphabio/b_short/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/b_short.svg)](https://www.npmjs.com/package/b_short)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/b_short)](https://bundlephobia.com/package/b_short)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Lightning-fast CSS shorthand expansion to longhand properties**

</div>

## Why b_short?

- **📦 Tiny**: ~16KB compressed
- **⚡ Fast**: Optimized TypeScript with smart caching
- **🎯 Complete**: 35+ CSS shorthands including modern features
- **🔒 Type-Safe**: Full TypeScript support
- **✅ Tested**: 808 tests ensuring 100% accuracy
- **🎨 Flexible**: CSS strings or JS objects (camelCase for React)

## Quick Start

```bash
npm install b_short css-tree
```

```typescript
import { expand } from 'b_short';

// CSS format (default)
expand('margin: 10px 20px');
// → "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 10px;\nmargin-left: 20px;"

// JavaScript format (camelCase for React/styled-components)
expand('background: red url(img.png)', { format: 'js' });
// → {
//   backgroundImage: 'url(img.png)',
//   backgroundColor: 'red',
//   backgroundPosition: '0% 0%',
//   ...
// }
```

## API

### `expand(css, options?)`

```typescript
import * as b from 'b_short';

const result = b.expand('background: red', {
  format: b.ExpandOptions.Format.CSS,              // 'css' | 'js'
  indent: b.ExpandOptions.Indent.TWO_SPACES,       // 0 | 2 | 4 | 8
  separator: b.ExpandOptions.Separator.NEWLINE,    // '\n' | ' ' | '; ' | ''
  propertyGrouping: b.ExpandOptions.PropertyGrouping.BY_PROPERTY,  // 'by-property' | 'by-side'
  expandPartialLonghand: false                     // expand partial shorthands
});
```

### Default Options

```typescript
import { expand, DEFAULT_EXPAND_OPTIONS } from 'b_short';

const customOptions = {
  ...DEFAULT_EXPAND_OPTIONS,
  indent: 2,
  format: 'js'
};
```

### Result Format

```typescript
interface ExpandResult {
  ok: boolean;                    // true if no syntax errors
  result?: string | object;       // expanded CSS or undefined if invalid
  issues: Array<Error | Warning>; // syntax errors and warnings
}
```

## Supported Shorthands (35+)

### Box Model & Layout

`margin` • `padding` • `border` • `border-width` • `border-style` • `border-color` • `border-top/right/bottom/left` • `border-radius` • `inset` • `overflow`

### Visual

`background` (multi-layer) • `mask` (multi-layer) • `outline` • `text-decoration` • `text-emphasis`

### Layout Systems

`flex` • `flex-flow` • `grid` • `grid-area` • `grid-column` • `grid-row` • `place-content` • `place-items` • `place-self` • `columns` • `column-rule`

### Animation & Motion

`animation` (multi-layer) • `transition` (multi-layer) • `offset` (motion path) • `contain-intrinsic-size`

### Typography

`font` • `list-style`

## Use Cases

**CSS-in-JS Libraries** - Perfect for styled-components, emotion, etc.

```typescript
const styles = expand('margin: 1rem; padding: 0.5rem;', { format: 'js' });
```

**Build Tools** - PostCSS plugins, webpack loaders, vite plugins

```typescript
const normalized = expand(rawCSS, { format: 'css' });
```

**Static Analysis** - Linting, optimization, documentation

```typescript
const { result } = expand(css, { format: 'js' });
const properties = Object.keys(result);
```

**React Inline Styles** - Direct camelCase output

```typescript
const { result } = expand('margin: 1rem', { format: 'js' });
return <div style={result}>Content</div>;
```

## Advanced Features

### Multi-layer Support

```typescript
expand('background: url(1.png), url(2.png) repeat-x');
// Correctly handles multiple background layers
```

### Property Grouping

```typescript
// by-property (default): CSS spec order
expand('border: 1px solid red; margin: 10px', {
  propertyGrouping: 'by-property'
});

// by-side: Directional grouping
expand('border: 1px solid red; margin: 10px', {
  propertyGrouping: 'by-side'
});
```

### Partial Longhand Expansion

```typescript
// Expand margin-top to all 4 sides with CSS defaults
expand('margin-top: 10px', {
  expandPartialLonghand: true
});
// → margin-top: 10px; margin-right: 0; margin-bottom: 0; margin-left: 0;
```

### Error Handling

```typescript
const result = expand('margin: invalid');
if (!result.ok) {
  console.log(result.issues); // Detailed error messages with line numbers
}
```

## Performance

- **Fast**: Optimized for performance with LRU caching
- **Small**: ~16KB compressed (brotli)
- **Efficient**: Handles 808 test cases in <1 second

## TypeScript Support

Full type definitions included:

```typescript
import type {
  ExpandOptions,
  ExpandResult,
  Format,
  PropertyGrouping
} from 'b_short';
```

## Development

```bash
pnpm install      # Install dependencies
pnpm test         # Run tests
pnpm build        # Build for production
pnpm lint         # Lint code
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [alphabio](https://github.com/alphabio)

## Acknowledgments

- [TypeScript](https://www.typescriptlang.org/)
- [css-tree](https://github.com/csstree/csstree) - CSS parsing
- [Vitest](https://vitest.dev/) - Testing
- [Biome](https://biomejs.dev/) - Code quality

---

<div align="center">

**[⭐ Star on GitHub](https://github.com/alphabio/b_short)** • **[📖 Docs](https://github.com/alphabio/b_short#readme)** • **[🐛 Issues](https://github.com/alphabio/b_short/issues)**

⚡ [alphabio](https://alphab.io)

</div>
