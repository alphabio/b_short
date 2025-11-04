#!/usr/bin/env tsx
/**
 * Generate expand test files from fixtures
 * DRY RUN - just prints what would be generated
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, "../test/fixtures");
const HANDLERS_DIR = path.join(__dirname, "../src/handlers");

// Map fixture names to handler directory names
const FIXTURE_TO_HANDLER: Record<string, string> = {
  animation: "animation",
  background: "background",
  border: "border",
  "border-radius": "border-radius",
  "column-rule": "column-rule",
  columns: "columns",
  "contain-intrinsic-size": "contain-intrinsic-size",
  flex: "flex",
  "flex-flow": "flex-flow",
  font: "font",
  gap: "gap",
  grid: "grid",
  "grid-area": "grid-area",
  "grid-column": "grid-column",
  "grid-row": "grid-row",
  // inset: "offset", // Skip - no insetHandler exists
  "list-style": "list-style",
  // margin: "offset", // Skip - no marginHandler exists
  mask: "mask",
  offset: "offset",
  outline: "outline",
  overflow: "overflow",
  // padding: "offset", // Skip - no paddingHandler exists
  "place-content": "place-content",
  "place-items": "place-items",
  "place-self": "place-self",
  "text-decoration": "text-decoration",
  "text-emphasis": "text-emphasis",
  transition: "transition",
};

function generateExpandTest(
  propertyName: string,
  testCases: Record<string, Record<string, string>>
): string {
  const tests: string[] = [];
  const handlerName = `${propertyName.replace(/-./g, (x) => x[1].toUpperCase())}Handler`;

  for (const [inputValue, expectedOutput] of Object.entries(testCases)) {
    // Skip test cases with semicolons (these are override tests, not value tests)
    if (inputValue.includes(";")) {
      continue;
    }

    // Escape quotes and backslashes in strings for valid JavaScript
    const escapeString = (str: string) => str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    const testName = escapeString(inputValue);
    const escapedInput = escapeString(inputValue);

    // Convert camelCase keys to kebab-case for handler output
    const kebabOutput: Record<string, string> = {};
    for (const [key, value] of Object.entries(expectedOutput)) {
      const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      kebabOutput[kebabKey] = value;
    }

    tests.push(`
	it("${testName}", () => {
		const result = ${handlerName}.expand("${escapedInput}");
		expect(result).toEqual(${JSON.stringify(kebabOutput, null, "\t\t")});
	});`);
  }

  return `import { describe, expect, it } from "vitest";
import { ${handlerName} } from "../expand";

describe("${propertyName} expand", () => {${tests.join("\n")}
});
`;
}

function main() {
  const args = process.argv.slice(2);
  const writeMode = args.includes("--write");
  const tmpMode = args.includes("--tmp");
  const singleProperty = args.find((arg) => !arg.startsWith("--"));

  if (singleProperty && !FIXTURE_TO_HANDLER[singleProperty]) {
    console.error(`❌ Unknown property: ${singleProperty}`);
    console.error(`Available: ${Object.keys(FIXTURE_TO_HANDLER).sort().join(", ")}`);
    process.exit(1);
  }

  console.log(
    writeMode
      ? "✍️  WRITE MODE - Generating files...\n"
      : tmpMode
        ? "📄 TMP MODE - Generating sample file...\n"
        : singleProperty
          ? `🎯 SINGLE PROPERTY MODE - ${singleProperty}\n`
          : "🔍 DRY RUN - Scanning fixtures...\n"
  );

  const fixtureFiles = fs
    .readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !singleProperty || f === `${singleProperty}.json`)
    .sort();

  console.log(`Found ${fixtureFiles.length} fixture files:\n`);

  const stats = {
    total: 0,
    mapped: 0,
    unmapped: 0,
    tests: 0,
  };

  const handlerTestCounts = new Map<string, number>();

  for (const fixtureFile of fixtureFiles) {
    const propertyName = path.basename(fixtureFile, ".json");
    const handlerName = FIXTURE_TO_HANDLER[propertyName];

    stats.total++;

    if (!handlerName) {
      console.log(`⚠️  ${propertyName} - NO HANDLER MAPPING`);
      stats.unmapped++;
      continue;
    }

    stats.mapped++;

    const fixturePath = path.join(FIXTURES_DIR, fixtureFile);
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
    const testCount = Object.keys(fixture).length;
    stats.tests += testCount;

    const currentCount = handlerTestCounts.get(handlerName) || 0;
    handlerTestCounts.set(handlerName, currentCount + testCount);

    const handlerDir = path.join(HANDLERS_DIR, handlerName);
    const testsDir = path.join(handlerDir, "__tests__");
    const outputFile = path.join(testsDir, `expand.${propertyName}.test.ts`);

    const exists = fs.existsSync(handlerDir);
    const testDirExists = fs.existsSync(testsDir);

    console.log(`✅ ${propertyName.padEnd(25)} → ${handlerName.padEnd(25)} (${testCount} tests)`);
    console.log(`   Handler dir: ${exists ? "✅" : "❌"} ${handlerDir}`);
    console.log(`   Tests dir:   ${testDirExists ? "✅" : "❌"} ${testsDir}`);
    console.log(`   Output:      ${outputFile}\n`);

    if (writeMode) {
      if (!testDirExists) {
        fs.mkdirSync(testsDir, { recursive: true });
      }
      const code = generateExpandTest(propertyName, fixture);
      fs.writeFileSync(outputFile, code);
      console.log(`   ✍️  Written!\n`);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Total fixtures:    ${stats.total}`);
  console.log(`   Mapped:            ${stats.mapped}`);
  console.log(`   Unmapped:          ${stats.unmapped}`);
  console.log(`   Total tests:       ${stats.tests}`);

  console.log("\n📦 Tests per handler:");
  const sorted = Array.from(handlerTestCounts.entries()).sort((a, b) => b[1] - a[1]);
  for (const [handler, count] of sorted) {
    console.log(`   ${handler.padEnd(30)} ${count} tests`);
  }

  if (tmpMode) {
    console.log("\n📝 Generating sample file to /tmp/overflow-expand.test.ts...\n");
    const overflowFixture = JSON.parse(
      fs.readFileSync(path.join(FIXTURES_DIR, "overflow.json"), "utf-8")
    );
    const exampleCode = generateExpandTest("overflow", overflowFixture);
    fs.writeFileSync("/tmp/overflow-expand.test.ts", exampleCode);
    console.log("✅ Sample written to /tmp/overflow-expand.test.ts");
  }

  if (!writeMode && !tmpMode) {
    console.log("\n✨ Dry run complete! Run with --write to generate files or --tmp for sample.");
  }
}

main();
