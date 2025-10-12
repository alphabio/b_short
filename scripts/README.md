# Release Scripts

This directory contains automation scripts for the b_short project.

## Release Script

The `release.js` script automates the entire release process:

### Usage

```bash
# Patch release (1.2.2 -> 1.2.3) - for bug fixes
npm run release
# or
npm run release:patch

# Minor release (1.2.2 -> 1.3.0) - for new features
npm run release:minor

# Major release (1.2.2 -> 2.0.0) - for breaking changes
npm run release:major
```

### What it does

1. ✅ Checks you're on the `develop` branch
2. ✅ Checks working directory is clean
3. ✅ Runs all tests
4. ✅ Runs linter
5. ✅ Builds the project
6. ✅ Updates `package.json` version
7. ✅ Updates `CHANGELOG.md` (changes `[Unreleased]` to `[version] - date`)
8. ✅ Commits the changes
9. ✅ Creates a git tag
10. ✅ Pushes to GitHub

### After the script runs

The GitHub Actions workflow (`.github/workflows/release.yml`) will automatically:

- Build the project
- Run tests and linting
- Publish to npm
- Create a GitHub release

### Manual steps

After the automated release:

1. Create a PR to merge `develop` into `main`
2. Review and merge the PR
3. The GitHub release will be created automatically when the tag is pushed

### Prerequisites

- You must be on the `develop` branch
- Working directory must be clean (no uncommitted changes)
- All tests must pass
- You must have push access to the repository

### Example

```bash
# Currently on version 1.2.2, need to release bug fix for text-decoration
npm run release:patch

# Output:
# 🚀 Starting automated release process...
# 📋 Checking preconditions...
# 📦 Current version: 1.2.2
# 📦 New version: 1.2.3
# 🧪 Running tests...
# 🔍 Running linter...
# 🔨 Building...
# 📝 Updating version files...
# ✅ Updated package.json to version 1.2.3
# ✅ Updated CHANGELOG.md with version 1.2.3
# 💾 Committing changes...
# 🏷️  Creating and pushing tag...
# ✨ Release process completed!
```

## Other Scripts

### fix-fixture-ordering.js

Utility script to ensure test fixtures are properly ordered.
