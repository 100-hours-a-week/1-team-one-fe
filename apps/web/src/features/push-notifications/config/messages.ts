export const PUSH_PERMISSION_MESSAGES = {
  SHEET: {
    TITLE: '알림 권한이 필요해요',
    DESCRIPTION_DEFAULT: '알림 권한을 허용해야 스트레칭 알림을 받을 수 있습니다.',
    DESCRIPTION_DENIED:
      '알림 권한이 막혀있습니다. 알림 권한을 허용해야 스트레칭 알림을 받을 수 있습니다.',
    CTA_REQUEST: '알림 권한 요청',
    CTA_CLOSE: '나중에',
  },
  DENIED_GUIDE: {
    TITLE: '알림 권한 다시 켜는 법',
    IOS_STEPS: ['설정 앱을 열어주세요.', 'Safari > 알림으로 이동해 허용해주세요.'],
    ANDROID_STEPS: [
      'Chrome > 설정 > 사이트 설정 > 알림으로 이동해주세요.',
      '해당 사이트를 허용으로 변경해주세요.',
    ],
    DESKTOP_STEPS: [
      '주소창 왼쪽의 잠금 아이콘을 클릭해주세요.',
      '알림 권한을 허용으로 변경해주세요.',
    ],
  },
} as const;
