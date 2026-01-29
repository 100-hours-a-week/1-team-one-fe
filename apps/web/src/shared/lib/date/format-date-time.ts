const pad2 = (value: number) => String(value).padStart(2, '0');

export function formatDateTime(value: Date | number): string {
  const date = typeof value === 'number' ? new Date(value) : value;

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
