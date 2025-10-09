// b_path:: src/directional.ts
export default function directional(value: string): Record<string, string> | undefined {
  const values = value.split(/\s+/);

  if (values.length === 1) values.splice(0, 1, ...Array.from({ length: 4 }, () => values[0]));
  else if (values.length === 2) values.push(...values);
  else if (values.length === 3) values.push(values[1]);
  else if (values.length > 4) return;

  return ["top", "right", "bottom", "left"].reduce(
    (acc: Record<string, string>, direction: string, i: number) => {
      acc[direction] = values[i];
      return acc;
    },
    {}
  );
}
