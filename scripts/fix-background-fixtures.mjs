#!/usr/bin/env node

/**
 * Script to add backgroundColor: "transparent" to background test fixtures
 * that are missing this property (multi-layer backgrounds without explicit color)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const files = ["test/fixtures/layers.ts", "test/fixtures/shorthand.ts"];

function updateFixture(content) {
  const lines = content.split("\n");
  const updatedLines = [];
  let changeCount = 0;

  let inExpectedBlock = false;
  let _blockStartLine = -1;
  let blockLines = [];
  let _blockIndent = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start of expected block
    if (/expected:\s*{/.test(line)) {
      inExpectedBlock = true;
      _blockStartLine = i;
      blockLines = [line];
      _blockIndent = line.match(/^(\s*)/)?.[1] || "";
      continue;
    }

    // If in block, collect lines
    if (inExpectedBlock) {
      blockLines.push(line);

      // Detect end of expected block (closing brace at same indent level)
      if (line.trim() === "}," || line.trim() === "}") {
        // Process this block
        const blockContent = blockLines.join("\n");

        // Check if this is a background-related fixture (supports both camelCase and kebab-case)
        const hasBackgroundProps =
          /background(-|[A-Z])(image|Image|position|Position|size|Size|repeat|Repeat|attachment|Attachment|origin|Origin|clip|Clip)/.test(
            blockContent
          );
        const hasBackgroundColor = /(backgroundColor|"background-color")/.test(blockContent);

        // If it has background properties but no backgroundColor, add it
        if (hasBackgroundProps && !hasBackgroundColor) {
          // Detect format: camelCase or kebab-case
          const isCamelCase = /background[A-Z]/.test(blockContent);
          const colorProp = isCamelCase
            ? 'backgroundColor: "transparent",'
            : '"background-color": "transparent",';

          // Get the indent of properties (usually 2 or 4 more spaces than block indent)
          const propertyLine = blockLines.find(
            (l) => /background/.test(l) && l.trim() !== "expected: {"
          );
          const propertyIndent = propertyLine
            ? propertyLine.match(/^(\s*)/)?.[1] || "      "
            : "      ";

          // Insert backgroundColor before the closing brace
          const closingBraceLine = blockLines[blockLines.length - 1];
          blockLines.splice(blockLines.length - 1, 0, `${propertyIndent}${colorProp}`);
          blockLines[blockLines.length - 1] = closingBraceLine;

          changeCount++;
        }

        // Add all block lines to output
        updatedLines.push(...blockLines);

        // Reset state
        inExpectedBlock = false;
        blockLines = [];
      }
    } else {
      // Not in a block, just add the line
      updatedLines.push(line);
    }
  }

  return { updated: updatedLines.join("\n"), changeCount };
}

function main() {
  let totalChanges = 0;

  for (const file of files) {
    const filePath = resolve(process.cwd(), file);
    console.log(`\n📝 Processing ${file}...`);

    try {
      const content = readFileSync(filePath, "utf-8");
      const { updated, changeCount } = updateFixture(content);

      if (changeCount > 0) {
        writeFileSync(filePath, updated, "utf-8");
        console.log(`✅ Updated ${changeCount} fixture(s) in ${file}`);
        totalChanges += changeCount;
      } else {
        console.log(`⏭️  No changes needed in ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`\n🎉 Total fixtures updated: ${totalChanges}`);
}

main();
