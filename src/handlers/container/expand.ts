// b_path:: src/handlers/container/expand.ts

export function expandContainer(value: string): Record<string, string> {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return {
      "container-name": trimmed,
      "container-type": trimmed,
    };
  }

  // Split on /
  const parts = trimmed.split("/").map((p) => p.trim());

  if (parts.length === 1) {
    // Just name, or just type if it's a type keyword
    const val = parts[0];
    if (val === "none" || val === "size" || val === "inline-size" || val === "normal") {
      return {
        "container-name": "none",
        "container-type": val,
      };
    }
    return {
      "container-name": val,
      "container-type": "normal",
    };
  }

  // name / type
  return {
    "container-name": parts[0],
    "container-type": parts[1],
  };
}
