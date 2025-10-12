// Helper function to detect duplicate CSS properties in expand() results
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
