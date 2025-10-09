// b_path:: src/border-radius.ts
const directional = (value: string): Record<string, string> | undefined => {
  const values = value.split(/\s+/);

  if (values.length === 1) values.splice(0, 1, ...Array.from({ length: 4 }, () => values[0]));
  else if (values.length === 2) values.push(...values);
  else if (values.length === 3) values.push(values[1]);
  else if (values.length > 4) return;

  return ["top-left", "top-right", "bottom-right", "bottom-left"].reduce(
    (acc: Record<string, string>, direction: string, i: number) => {
      acc[direction] = values[i];
      return acc;
    },
    {}
  );
};

const borderRadius = (value: string): Record<string, string> | undefined => {
  const longhand = directional(value);

  if (!longhand) return;

  const result: Record<string, string> = {};
  for (const key in longhand) {
    result[`border-${key}-radius`] = longhand[key];
  }
  return result;
};

export default borderRadius;
