export const DND_MESSAGES = {
  TITLE: '방해금지 모드',
  DESCRIPTION: '알림을 잠시 멈추고 싶은 시간을 선택해주세요.',
  TOGGLE_LABEL: '방해금지 모드',
  STATUS: '방해금지 종료: {label}',
  OPTIONS: {
    MINUTES_15: '15분',
    HOURS_1: '1시간',
    HOURS_8: '8시간',
    HOURS_24: '24시간',
    DAYS_3: '3일',
    INFINITE: '무기한',
  },
  UNTIL_TODAY: '오늘 {time} 까지',
  UNTIL_DATE: '{month}월 {day}일 {hour}시 {minute}분까지',
} as const;
