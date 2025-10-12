#!/usr/bin/env node

// Script to fix property ordering in test fixture files
const fs = require("node:fs");
const path = require("node:path");
const { sortProperties } = require("../lib/index.js");

const fixturesDir = path.join(__dirname, "../test/fixtures");

// Get all JSON fixture files
const fixtureFiles = fs.readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));

console.log(`Found ${fixtureFiles.length} fixture files to process\n`);

let totalFixed = 0;

for (const filename of fixtureFiles) {
  const filepath = path.join(fixturesDir, filename);
  const content = fs.readFileSync(filepath, "utf-8");
  const fixtures = JSON.parse(content);

  let fixedCount = 0;

  // Process each test case in the fixture
  for (const [key, value] of Object.entries(fixtures)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Sort the properties
      const sorted = sortProperties(value);

      // Check if order changed
      const originalKeys = Object.keys(value);
      const sortedKeys = Object.keys(sorted);
      const orderChanged = JSON.stringify(originalKeys) !== JSON.stringify(sortedKeys);

      if (orderChanged) {
        fixtures[key] = sorted;
        fixedCount++;
        console.log(`  Fixed: "${key}"`);
        console.log(`    Before: ${originalKeys.join(", ")}`);
        console.log(`    After:  ${sortedKeys.join(", ")}`);
      }
    }
  }

  if (fixedCount > 0) {
    // Write back the fixed fixture
    fs.writeFileSync(filepath, `${JSON.stringify(fixtures, null, 2)}\n`);
    console.log(`✓ Fixed ${fixedCount} test case(s) in ${filename}\n`);
    totalFixed += fixedCount;
  }
}

console.log(`\nTotal: Fixed ${totalFixed} test cases across all fixtures`);
