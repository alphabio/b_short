# Contributing to b_short

Thank you for your interest in contributing to b_short! 🎉

We welcome contributions from everyone. This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Install** dependencies: `pnpm install`
4. **Create** a feature branch: `git checkout -b feature/your-feature-name`
5. **Make** your changes
6. **Test** your changes: `just test`
7. **Check** code quality: `just check`
8. **Commit** your changes following conventional commits
9. **Push** to your fork and submit a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 14+
- pnpm (recommended) or npm/yarn

### Commands
```bash
# Install dependencies
pnpm install

# Run tests
just test

# Run tests in watch mode
just test-watch

# Check code quality (linting + formatting + type checking)
just check

# Build the project
just build

# Format code
just format

# Fix linting issues
just fix
```

## 📝 Code Style

This project uses:
- **Biome** for linting and formatting
- **TypeScript** with strict settings
- **Conventional commits** for commit messages

### Key Principles
- **Zero dependencies** for runtime (dev dependencies are OK)
- **TypeScript first** - all code must be typed
- **Performance focused** - optimize for speed and bundle size
- **Test coverage** - comprehensive test suite required

## 🧪 Testing

### Running Tests
```bash
# Run all tests
just test

# Run tests in watch mode
just test-watch

# Run specific test file
pnpm test src/some-file.test.ts
```

### Writing Tests
- Tests are located in `test/` directory
- Use Vitest framework
- Follow existing patterns for fixture-based testing
- Test fixtures are in `test/fixtures/` as JSON files

### Test Coverage
- Aim for high test coverage
- Test both success and failure cases
- Include edge cases and invalid inputs

## 📋 Pull Request Process

1. **Update documentation** if needed (README, API docs)
2. **Add tests** for new functionality
3. **Update CHANGELOG.md** for user-facing changes
4. **Ensure CI passes** - all checks must pass
5. **Squash commits** if needed for clean history

### PR Title Format
Follow [Conventional Commits](https://conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## 🎯 Adding New CSS Properties

To add support for a new CSS property:

1. **Research** the CSS specification for the property
2. **Create** test fixtures in `test/fixtures/` (JSON format)
3. **Implement** the parser in `src/` following existing patterns
4. **Add** the property to the main index file
5. **Update** README.md supported properties list
6. **Add** comprehensive tests

### Example: Adding a new property

```typescript
// 1. Create test fixtures (test/fixtures/new-property.json)
{
  "value1": { "expanded": "properties" },
  "value2": { "expanded": "properties" }
}

// 2. Implement parser (src/new-property.ts)
export default (value: string): Record<string, string> | undefined => {
  // Implementation here
  return { 'property': value };
};

// 3. Export from index (src/index.ts)
export { default as newProperty } from './new-property.js';

// 4. Add to test suite (test/index.test.ts)
testProperty("new-property", newPropertyFixtures);
```

## 🔍 Code Review Process

- All PRs require review before merging
- CI must pass (tests, linting, type checking)
- At least one maintainer approval required
- Reviews focus on:
  - Code quality and style
  - Test coverage
  - Performance implications
  - API consistency
  - Documentation updates

## 📚 Documentation

- Keep README.md up to date
- Update API documentation for public changes
- Add JSDoc comments for new functions
- Update CHANGELOG.md for releases

## 🐛 Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Provide clear reproduction steps
- Include browser/CSS environment details
- Check existing issues first

## 📄 License

By contributing to b_short, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors are recognized in CHANGELOG.md and GitHub's contributor insights. Thank you for helping make b_short better! 🚀