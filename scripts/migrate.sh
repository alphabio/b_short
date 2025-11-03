#!/bin/bash
# b_path:: scripts/migrate.sh
# Simple migration: flat handlers -> co-located structure

set -e

HANDLERS=(animation background border border-radius column-rule columns contain-intrinsic-size flex flex-flow font grid grid-area grid-column grid-row list-style mask offset outline overflow place-content place-items place-self text-decoration text-emphasis transition)

echo "Creating src/handlers/ and moving files..."
mkdir -p src/handlers

for h in "${HANDLERS[@]}"; do
  echo "  $h"
  mkdir -p "src/handlers/$h"
  mv "src/$h.ts" "src/handlers/$h/expand.ts"
  echo 'export * from "./expand";' > "src/handlers/$h/index.ts"
done

echo "Updating imports in handler-registry.ts..."
sed -i '' 's|from "\.\./|from "../handlers/|g' src/internal/handler-registry.ts

echo "Updating imports in shorthand-registry.ts..."
sed -i '' 's|from "\.\./|from "../handlers/|g' src/internal/shorthand-registry.ts

echo "Done! Run: pnpm test && pnpm build"
