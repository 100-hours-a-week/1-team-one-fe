type DateTimeParts = {
  datePart: string;
  timePart: string;
};

const splitDateTime = (value: string): DateTimeParts => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { datePart: '', timePart: '' };
  }

  const tIndex = trimmed.indexOf('T');
  if (tIndex >= 0) {
    return {
      datePart: trimmed.slice(0, tIndex),
      timePart: trimmed.slice(tIndex + 1),
    };
  }

  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex >= 0) {
    return {
      datePart: trimmed.slice(0, spaceIndex),
      timePart: trimmed.slice(spaceIndex + 1),
    };
  }

  return { datePart: trimmed, timePart: '' };
};

export const getNotificationDateKey = (value: string): string => {
  const { datePart } = splitDateTime(value);
  return datePart || value;
};

export const formatNotificationDateLabel = (value: string): string => {
  const dateKey = getNotificationDateKey(value);
  const parts = dateKey.split('-');
  if (parts.length !== 3) return dateKey;

  const [year, month, day] = parts;
  if (!year || !month || !day) return dateKey;
  return `${year}.${month}.${day}`;
};

export const formatNotificationTimeLabel = (value: string): string => {
  const { timePart } = splitDateTime(value);
  if (!timePart) return value;

  const withoutTimezone = timePart.split('Z')[0]?.split('+')[0]?.split('-')[0] ?? timePart;
  const withoutMillis = withoutTimezone.split('.')[0] ?? withoutTimezone;
  const [hour, minute] = withoutMillis.split(':');
  if (!hour || !minute) return withoutMillis;

  return `${hour}:${minute}`;
};
