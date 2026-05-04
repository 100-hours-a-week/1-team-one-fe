export function normalizeStringList(
  values: ReadonlyArray<string> | string | null | undefined,
): string[] {
  if (!values) return [];

  const rawValues = Array.isArray(values) ? values : [values];
  const normalizedValues = rawValues.map((value) => value.trim()).filter(Boolean);

  return Array.from(new Set(normalizedValues));
}
