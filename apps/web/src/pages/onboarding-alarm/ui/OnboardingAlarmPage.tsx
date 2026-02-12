import { useRouter } from 'next/router';

import {
  type AlarmSettingsValuesType,
  NotificationSettingsForm,
  toAlarmSettingsRequest,
  useAlarmSettingsMutation,
} from '@/src/features/alarm-settings';
import {
  DEFAULT_WEEKDAYS,
  INTERVAL_CONFIG,
  TIME_CONFIG,
} from '@/src/features/alarm-settings/config';
import { enablePushNotifications, usePutFcmTokenMutation } from '@/src/features/push-notifications';
import { ROUTES } from '@/src/shared/routes/routes';

export function OnboardingAlarmPage() {
  const router = useRouter();
  const { mutateAsync: putFcmToken } = usePutFcmTokenMutation();
  const { mutateAsync } = useAlarmSettingsMutation();

  const handleSubmit = async (values: AlarmSettingsValuesType) => {
    await mutateAsync(toAlarmSettingsRequest(values));
    await enablePushNotifications(putFcmToken);
    void router.push(ROUTES.ONBOARDING_CHARACTER);
  };

  return (
    <NotificationSettingsForm
      defaultValues={{
        intervalMinutes: INTERVAL_CONFIG.DEFAULT_MINUTES,
        activeStart: TIME_CONFIG.DEFAULT_ACTIVE_START,
        activeEnd: TIME_CONFIG.DEFAULT_ACTIVE_END,
        focusStart: TIME_CONFIG.DEFAULT_FOCUS_START,
        focusEnd: TIME_CONFIG.DEFAULT_FOCUS_END,
        weekdays: [...DEFAULT_WEEKDAYS],
      }}
      onSubmit={handleSubmit}
      submitLabel="캐릭터 생성하기"
    />
  );
}
