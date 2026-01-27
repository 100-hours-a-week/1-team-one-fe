export function parseCookie(header?: string): Record<string, string> {
  if (!header) {
    return {};
  }

  return header.split(';').reduce<Record<string, string>>((accumulator, part) => {
    const [rawKey, ...rawValue] = part.split('=');
    const key = rawKey?.trim();

    if (!key) {
      return accumulator;
    }

    const value = rawValue.join('=').trim();
    accumulator[key] = decodeURIComponent(value);
    return accumulator;
  }, {});
}
