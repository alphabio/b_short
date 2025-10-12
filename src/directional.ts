// b_path:: src/directional.ts

/**
 * Cache for directional property expansion results.
 * Improves performance for repeated calls with same values.
 */
const directionalCache = new Map<string, Record<string, string>>();
const MAX_CACHE_SIZE = 1000;

/**
 * Expands directional values (top, right, bottom, left) from CSS shorthand notation.
 * Supports 1-4 value syntax and caches results for performance.
 *
 * @param value - CSS value string with 1-4 space-separated values
 * @returns Object with top, right, bottom, left properties, or undefined if invalid
 *
 * @example
 * directional('10px') // { top: '10px', right: '10px', bottom: '10px', left: '10px' }
 * directional('10px 20px') // { top: '10px', right: '20px', bottom: '10px', left: '20px' }
 * directional('10px 20px 30px') // { top: '10px', right: '20px', bottom: '30px', left: '20px' }
 * directional('10px 20px 30px 40px') // { top: '10px', right: '20px', bottom: '30px', left: '40px' }
 */
export default function directional(value: string): Record<string, string> | undefined {
  // Check cache first
  const cached = directionalCache.get(value);
  if (cached) return cached;

  const values = value.split(/\s+/);

  if (values.length === 1) values.splice(0, 1, ...Array.from({ length: 4 }, () => values[0]));
  else if (values.length === 2) values.push(...values);
  else if (values.length === 3) values.push(values[1]);
  else if (values.length > 4) return;

  const result = ["top", "right", "bottom", "left"].reduce(
    (acc: Record<string, string>, direction: string, i: number) => {
      acc[direction] = values[i];
      return acc;
    },
    {}
  );

  // Cache result with size limit
  if (directionalCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry (first key)
    const firstKey = directionalCache.keys().next().value;
    if (firstKey !== undefined) {
      directionalCache.delete(firstKey);
    }
  }
  directionalCache.set(value, result);

  return result;
}
