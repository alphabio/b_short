#!/bin/bash

# Ready-to-use commit command for v2.0.0 enhancements

echo "📋 Staging all changes..."
git add .

echo ""
echo "📝 Creating commit with proper semver formatting..."
git commit -m "feat!: v2.0.0 - named exports, performance improvements, and developer tooling

BREAKING CHANGE: Removed default export. Use named imports: import { expand } from 'b_short'

Highlights:
- Performance: Memoization for directional() and isColor() functions
- Testing: 5 new performance regression tests (750 total passing)
- DX: Husky pre-commit hooks + npm scripts (outdated, update, audit)
- Docs: Comprehensive JSDoc comments for better IDE support

See CHANGELOG.md and ENHANCEMENTS.md for complete details."

echo ""
echo "✅ Commit created successfully!"
echo ""
echo "Next steps:"
echo "  1. Review: git show"
echo "  2. Push: git push origin main"
echo "  3. Update package.json version to 2.0.0"
echo "  4. Tag: git tag v2.0.0 && git push --tags"
