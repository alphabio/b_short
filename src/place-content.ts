// b_path:: src/place-content.ts
import { consolidatePlaceTokens } from "./place-utils";

export default (value: string): Record<string, string> | undefined => {
  // Handle global CSS keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "align-content": value,
      "justify-content": value,
    };
  }

  // Process tokens with lookahead for compound keywords
  const processedValues = consolidatePlaceTokens(
    value,
    /^(center|start|end|flex-start|flex-end)$/i
  );
  if (!processedValues) {
    return undefined;
  }

  // Validate processed values
  const validValuePattern =
    /^(normal|space-between|space-around|space-evenly|stretch|center|start|end|flex-start|flex-end|baseline|first baseline|last baseline|safe center|safe start|safe end|safe flex-start|safe flex-end|unsafe center|unsafe start|unsafe end|unsafe flex-start|unsafe flex-end)$/i;

  for (const val of processedValues) {
    if (!validValuePattern.test(val)) {
      return undefined;
    }
  }

  // Handle single value - both properties get the same value
  if (processedValues.length === 1) {
    return {
      "align-content": processedValues[0],
      "justify-content": processedValues[0],
    };
  }

  // Handle two values - first=align-content, second=justify-content
  if (processedValues.length === 2) {
    return {
      "align-content": processedValues[0],
      "justify-content": processedValues[1],
    };
  }

  return undefined;
};
