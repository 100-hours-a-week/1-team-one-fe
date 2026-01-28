const padTime = (value: number): string => {
  if (value < 10) return `0${value}`;
  return String(value);
};

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${padTime(minutes)}:${padTime(remainingSeconds)}`;
}
