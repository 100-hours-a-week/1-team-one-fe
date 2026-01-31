import { Spinner } from '@repo/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { toAlarmSettingsValues } from '@/src/entities/alarm-settings';
import { useAlarmSettingsQuery } from '@/src/features/alarm-settings';
import { ALARM_SETTINGS_QUERY_KEYS } from '@/src/features/alarm-settings/config/query-keys';
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
import { APP_ALARM_MESSAGES } from '@/src/pages/app-alarm/config/messages';

const fallbackValues: AlarmSettingsValues = {
  intervalMinutes: INTERVAL_CONFIG.DEFAULT_MINUTES,
  activeStart: TIME_CONFIG.DEFAULT_ACTIVE_START,
  activeEnd: TIME_CONFIG.DEFAULT_ACTIVE_END,
  focusStart: TIME_CONFIG.DEFAULT_FOCUS_START,
  focusEnd: TIME_CONFIG.DEFAULT_FOCUS_END,
  weekdays: [...DEFAULT_WEEKDAYS],
};

export function AppAlarmPage() {
  const queryClient = useQueryClient();
  const {
    data: alarmSettings,
    isLoading,
    isError,
  } = useAlarmSettingsQuery({
    refetchOnMount: 'always',
  });
  const { mutateAsync } = useAlarmSettingsMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ALARM_SETTINGS_QUERY_KEYS.detail() });
    },
  });

  const defaultValues = useMemo(
    () => toAlarmSettingsValues(alarmSettings, fallbackValues),
    [alarmSettings],
  );

  const handleSubmit = async (values: AlarmSettingsValues) => {
    await mutateAsync(toAlarmSettingsRequest(values));
  };

  if (isError) {
    throw new Error('app-alarm:alarm-settings');
  }

  if (isLoading && !alarmSettings) {
    return (
      <div className="bg-bg text-text flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner size="md" />
          <span className="text-text-muted text-sm font-medium">{APP_ALARM_MESSAGES.LOADING}</span>
        </div>
      </div>
    );
  }

  return (
    <NotificationSettingsForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel={APP_ALARM_MESSAGES.SUBMIT_DEFAULT}
    />
  );
}
