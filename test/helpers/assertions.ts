// Helper function to detect duplicate CSS properties in expand() results
import { PROPERTY_ORDER_MAP } from "../../src/index";

// Helper function to map property names to fixture file names
function getFixtureFileName(propertyName: string): string {
  const fixtureMap: Record<string, string> = {
    animation: "animation.json",
    background: "background.json",
    border: "border.json",
    "border-radius": "border-radius.json",
    "column-rule": "column-rule.json",
    columns: "columns.json",
    "contain-intrinsic-size": "contain-intrinsic-size.json",
    flex: "flex.json",
    "flex-flow": "flex-flow.json",
    font: "font.json",
    grid: "grid.json",
    "grid-area": "grid-area.json",
    "grid-column": "grid-column.json",
    "grid-row": "grid-row.json",
    inset: "inset.json",
    "list-style": "list-style.json",
    margin: "margin.json",
    offset: "offset.json",
    outline: "outline.json",
    overflow: "overflow.json",
    padding: "padding.json",
    "place-content": "place-content.json",
    "place-items": "place-items.json",
    "place-self": "place-self.json",
    "text-decoration": "text-decoration.json",
    "text-emphasis": "text-emphasis.json",
    transition: "transition.json",
  };

  return fixtureMap[propertyName] || `${propertyName}.json`;
}

export function assertNoDuplicateProperties(
  result: Record<string, string> | string | (Record<string, string> | string)[] | undefined,
  testContext: string
): void {
  if (result === undefined) {
    return;
  }

  const propertyNames: string[] = [];

  // Handle different result types
  if (typeof result === "string") {
    // CSS string format - extract property names from declarations
    const declarations = result.split(/[;\n]/).filter((decl) => decl.trim().length > 0);
    for (const declaration of declarations) {
      const match = declaration.trim().match(/^\s*([a-z-]+)\s*:/);
      if (match) {
        propertyNames.push(match[1]);
      }
    }
  } else if (Array.isArray(result)) {
    // Array format - handle each item
    for (const item of result) {
      if (typeof item === "string") {
        // CSS string in array
        const declarations = item.split(/[;\n]/).filter((decl) => decl.trim().length > 0);
        for (const declaration of declarations) {
          const match = declaration.trim().match(/^\s*([a-z-]+)\s*:/);
          if (match) {
            propertyNames.push(match[1]);
          }
        }
      } else if (typeof item === "object" && item !== null) {
        // Object in array
        propertyNames.push(...Object.keys(item));
      }
    }
  } else if (typeof result === "object" && result !== null) {
    // Single object format
    propertyNames.push(...Object.keys(result));
  }

  // Check for duplicates
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const prop of propertyNames) {
    if (seen.has(prop)) {
      duplicates.push(prop);
    } else {
      seen.add(prop);
    }
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate CSS properties found in test '${testContext}': ${duplicates.join(", ")}`
    );
  }
}

// Helper function to validate CSS property order against the spec-defined ordering
export function assertCorrectPropertyOrder(
  result: Record<string, string> | string | (Record<string, string> | string)[] | undefined,
  testContext: string,
  expected?: Record<string, string>
): void {
  if (result === undefined) {
    return;
  }

  const validatePropertyOrder = (propertyNames: string[], label: string) => {
    // Filter to only include properties that exist in PROPERTY_ORDER_MAP
    const orderedProperties = propertyNames.filter((prop) => prop in PROPERTY_ORDER_MAP);

    // Sort properties by their PROPERTY_ORDER_MAP indices to get the correct CSS spec order
    const sortedProperties = [...orderedProperties].sort(
      (a, b) => PROPERTY_ORDER_MAP[a] - PROPERTY_ORDER_MAP[b]
    );

    // Check if properties appear in ascending order based on their PROPERTY_ORDER_MAP indices
    for (let i = 0; i < orderedProperties.length - 1; i++) {
      const currentProp = orderedProperties[i];
      const nextProp = orderedProperties[i + 1];
      const currentIndex = PROPERTY_ORDER_MAP[currentProp];
      const nextIndex = PROPERTY_ORDER_MAP[nextProp];

      if (currentIndex > nextIndex) {
        // Extract property name from test context and get fixture file name
        const propertyName = testContext.split(": ")[0];
        const fixtureFile = getFixtureFileName(propertyName);

        throw new Error(
          `Property order violation in ${label} for test '${testContext}':\n` +
            `Current Order:\n` +
            `${orderedProperties.map((p) => `- ${p} (${PROPERTY_ORDER_MAP[p]})`).join(",\n")}\n` +
            `\n` +
            `Expected order:\n` +
            `${sortedProperties.map((p) => `- ${p} (${PROPERTY_ORDER_MAP[p]})`).join("\n")}\n` +
            `\n` +
            `Violation: '${nextProp}' (index ${nextIndex}) should come before '${currentProp}' (index ${currentIndex})'\n` +
            `Fix: Update test/fixtures/${fixtureFile} to match the expected order above.`
        );
      }
    }
  };

  const propertyNames: string[] = [];

  // Handle different result types
  if (typeof result === "string") {
    // CSS string format - extract property names from declarations
    const declarations = result.split(/[;\n]/).filter((decl) => decl.trim().length > 0);
    for (const declaration of declarations) {
      const match = declaration.trim().match(/^\s*([a-z-]+)\s*:/);
      if (match) {
        propertyNames.push(match[1]);
      }
    }
  } else if (Array.isArray(result)) {
    // Array format - handle each item
    for (const item of result) {
      if (typeof item === "string") {
        // CSS string in array
        const declarations = item.split(/[;\n]/).filter((decl) => decl.trim().length > 0);
        for (const declaration of declarations) {
          const match = declaration.trim().match(/^\s*([a-z-]+)\s*:/);
          if (match) {
            propertyNames.push(match[1]);
          }
        }
      } else if (typeof item === "object" && item !== null) {
        // Object in array
        propertyNames.push(...Object.keys(item));
      }
    }
  } else if (typeof result === "object" && result !== null) {
    // Single object format
    propertyNames.push(...Object.keys(result));
  }

  // Validate the actual result ordering
  validatePropertyOrder(propertyNames, "actual result");

  // Validate the expected fixture ordering if provided
  if (expected && typeof expected === "object") {
    const expectedPropertyNames = Object.keys(expected);
    validatePropertyOrder(expectedPropertyNames, "expected fixture");
  }
}
