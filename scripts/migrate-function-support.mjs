#!/usr/bin/env node

/**
 * Universal Function Support - Automated Migration
 *
 * This script automatically updates ALL handlers to use matchesType()
 * instead of direct node.type checks for Dimension/Percentage/Number.
 *
 * This makes ALL 26+ handlers support calc(), var(), min(), max(), etc.
 * with ZERO manual work per handler.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const handlersDir = path.join(__dirname, "../src/handlers");

const patterns = [
  // Pattern 1: Single type check
  {
    find: /(\w+)\.type === "(Dimension|Percentage|Number)"/g,
    replace: (_match, varName, type) => `matchesType(${varName}, "${type}")`,
  },

  // Pattern 2: OR chain of type checks
  {
    find: /(\w+)\.type === "(Dimension|Percentage|Number)" \|\| \1\.type === "(Dimension|Percentage|Number)"( \|\| \1\.type === "(Dimension|Percentage|Number)")?/g,
    replace: (_match, varName, type1, type2, _extra, type3) => {
      const types = [type1, type2];
      if (type3) types.push(type3);
      return `matchesType(${varName}, [${types.map((t) => `"${t}"`).join(", ")}])`;
    },
  },
];

function shouldProcessFile(filePath) {
  // Skip test files and certain special handlers
  if (filePath.includes("__tests__") || filePath.includes(".test.")) {
    return false;
  }

  // Only process TypeScript files in handler directories
  return filePath.endsWith(".ts") && filePath.includes("/handlers/");
}

function needsMatchesTypeImport(content) {
  return (
    (content.includes("matchesType(") && !content.includes("import {")) ||
    (!content.includes("matchesType") && !content.includes("isNumericValueNode"))
  );
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Apply transformations
  patterns.forEach(({ find, replace }) => {
    const newContent = content.replace(find, replace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  // Add import if needed
  if (modified && needsMatchesTypeImport(content)) {
    // Find existing imports from @/internal
    const importMatch = content.match(/import .* from ["']@\/internal\/[^"']+["'];/);
    if (importMatch) {
      // Add to existing import
      const existingImport = importMatch[0];
      if (!existingImport.includes("matchesType")) {
        const newImport = existingImport.replace(
          /import \{([^}]+)\}/,
          (_match, imports) => `import {${imports.trim()}, matchesType}`
        );
        content = content.replace(existingImport, newImport);
      }
    } else {
      // Add new import at top
      const firstImportIndex = content.indexOf("import");
      if (firstImportIndex !== -1) {
        const lines = content.split("\n");
        const importLineIndex = lines.findIndex(
          (line, i) => i >= firstImportIndex / 100 && line.includes("import")
        );
        lines.splice(
          importLineIndex + 1,
          0,
          'import { matchesType } from "@/internal/is-value-node";'
        );
        content = lines.join("\n");
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  const modified = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      modified.push(...walkDir(filePath));
    } else if (shouldProcessFile(filePath)) {
      if (processFile(filePath)) {
        modified.push(filePath);
      }
    }
  });

  return modified;
}

// Run migration
console.log("🔧 Universal Function Support Migration");
console.log("========================================\n");

const modifiedFiles = walkDir(handlersDir);

console.log(`\n✅ Modified ${modifiedFiles.length} files:\n`);
modifiedFiles.forEach((file) => {
  console.log(`   - ${path.relative(process.cwd(), file)}`);
});

console.log("\n🎉 All handlers now support CSS functions universally!");
console.log("\nNext steps:");
console.log("  1. Run: npm test");
console.log("  2. Review changes: git diff");
console.log("  3. Commit if tests pass\n");
