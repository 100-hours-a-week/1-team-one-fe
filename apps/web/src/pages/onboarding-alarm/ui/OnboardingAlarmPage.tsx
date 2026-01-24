import { useRouter } from 'next/router';

import {
  type AlarmSettingsValues,
  NotificationSettingsForm,
  toAlarmSettingsRequest,
  useAlarmSettingsMutation,
} from '@/src/features/onboarding-alarm-settings';
import {
  DEFAULT_WEEKDAYS,
  INTERVAL_CONFIG,
  TIME_CONFIG,
} from '@/src/features/onboarding-alarm-settings/config';
import { ROUTES } from '@/src/shared/routes/routes';

export function OnboardingAlarmPage() {
  const router = useRouter();
  const { mutateAsync } = useAlarmSettingsMutation({
    onSuccess: () => {
      router.push(ROUTES.ONBOARDING_TUTORIAL);
    },
  });

  const handleSubmit = async (values: AlarmSettingsValues) => {
    await mutateAsync(toAlarmSettingsRequest(values));
  };

  return (
    <div className="bg-bg min-h-screen px-4 py-8">
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
    </div>
  );
}
