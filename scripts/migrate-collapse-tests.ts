#!/usr/bin/env tsx
// Script to migrate test/collapse.test.ts to co-located collapse tests

import fs from "node:fs";
import path from "node:path";

const COLLAPSE_TEST_FILE = "test/collapse.test.ts";
const HANDLERS_DIR = "src/handlers";

// Property name mapping from test description
const PROPERTY_MAP: Record<string, string> = {
  overflow: "overflow",
  "flex-flow": "flex-flow",
  flex: "flex",
  "place-content": "place-content",
  background: "background",
  transition: "transition",
  animation: "animation",
  mask: "mask",
  border: "border",
  gap: "gap",
  grid: "grid",
};

interface TestCase {
  property: string;
  name: string;
  code: string;
  startLine: number;
  endLine: number;
}

function extractPropertyFromTest(testName: string): string | null {
  // Extract property from test name like "collapses overflow with same values"
  for (const [keyword, property] of Object.entries(PROPERTY_MAP)) {
    if (testName.includes(keyword)) {
      return property;
    }
  }
  return null;
}

function parseCollapseTests(): Map<string, TestCase[]> {
  const content = fs.readFileSync(COLLAPSE_TEST_FILE, "utf-8");
  const lines = content.split("\n");

  const tests = new Map<string, TestCase[]>();
  tests.set("api", []); // For general API tests

  let inTest = false;
  let currentTest: { name: string; code: string; startLine: number } | null = null;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect test start
    const testMatch = line.match(/test\("([^"]+)"/);
    if (testMatch && !inTest) {
      inTest = true;
      currentTest = {
        name: testMatch[1],
        code: "",
        startLine: i,
      };
      braceDepth = 0;
    }

    if (inTest && currentTest) {
      currentTest.code += `${line}\n`;

      // Track brace depth to find test end
      for (const char of line) {
        if (char === "{") braceDepth++;
        if (char === "}") braceDepth--;
      }

      // Test ends when braces balance after initial opening
      if (braceDepth === 0 && currentTest.code.includes("{")) {
        const property = extractPropertyFromTest(currentTest.name);
        const testCase: TestCase = {
          property: property || "api",
          name: currentTest.name,
          code: currentTest.code.trim(),
          startLine: currentTest.startLine,
          endLine: i,
        };

        const key = property || "api";
        if (!tests.has(key)) {
          tests.set(key, []);
        }
        tests.get(key)!.push(testCase);

        inTest = false;
        currentTest = null;
      }
    }
  }

  return tests;
}

function formatTestForCoLocation(test: TestCase): string {
  // Convert test() to it() and adjust formatting
  let code = test.code;

  // Replace test( with it(
  code = code.replace(/test\(/g, "it(");

  // Clean up indentation (remove 4 spaces from beginning of each line)
  code = code
    .split("\n")
    .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
    .join("\n");

  return code;
}

function createCollapseTestFile(property: string, tests: TestCase[]): string {
  const testCode = tests.map((t) => formatTestForCoLocation(t)).join("\n\n");

  return `import { describe, expect, it } from "vitest";
import { collapse } from "@/core/collapse";

describe("${property} collapse", () => {
${testCode}
});
`;
}

function main() {
  console.log("🔍 Parsing test/collapse.test.ts...\n");

  const testsByProperty = parseCollapseTests();

  console.log("📊 Found tests by property:");
  for (const [property, tests] of testsByProperty.entries()) {
    console.log(`  ${property.padEnd(20)} ${tests.length} tests`);
  }
  console.log();

  // Generate test files
  let created = 0;
  for (const [property, tests] of testsByProperty.entries()) {
    if (property === "api") {
      console.log(`⏭️  Skipping 'api' tests (keep in test/collapse.test.ts)`);
      continue;
    }

    const handlerDir = path.join(HANDLERS_DIR, property);
    const testsDir = path.join(handlerDir, "__tests__");
    const outputFile = path.join(testsDir, `${property}.collapse.test.ts`);

    // Check if handler directory exists
    if (!fs.existsSync(handlerDir)) {
      console.log(`⚠️  Handler directory not found: ${handlerDir}`);
      continue;
    }

    // Create __tests__ directory if needed
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
    }

    // Generate and write test file
    const testContent = createCollapseTestFile(property, tests);
    fs.writeFileSync(outputFile, testContent);

    console.log(`✅ Created ${outputFile}`);
    created++;
  }

  console.log(`\n✨ Done! Created ${created} collapse test files.`);
  console.log(
    "\n📝 Next steps:",
    "\n  1. Review the generated files",
    "\n  2. Run: npm test",
    "\n  3. Delete property-specific tests from test/collapse.test.ts",
    "\n  4. Keep only general API tests in test/collapse.test.ts"
  );
}

main();
