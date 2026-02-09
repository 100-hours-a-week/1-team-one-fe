import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
import {
  PushPermissionBottomSheet,
  usePushPermissionSheet,
} from '@/src/features/push-notifications';
import { APP_ALARM_MESSAGES } from '@/src/pages/app-alarm/config/messages';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';

import { AppAlarmPageSkeleton } from './AppAlarmPage.skeleton';

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
  const pushPermissionSheet = usePushPermissionSheet();
  const {
    data: alarmSettings,
    isLoading,
    error,
  } = useAlarmSettingsQuery({
    refetchOnMount: 'always',
  });
  const { mutateAsync } = useAlarmSettingsMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ALARM_SETTINGS_QUERY_KEYS.detail() });
    },
  });

  const handleSubmit = async (values: AlarmSettingsValues) => {
    await mutateAsync(toAlarmSettingsRequest(values));
  };

  useEffect(() => {
    if (pushPermissionSheet.permission === 'granted') {
      return;
    }
    pushPermissionSheet.openSheet();
  }, [pushPermissionSheet.openSheet, pushPermissionSheet.permission]);

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={alarmSettings}
      renderLoading={() => <AppAlarmPageSkeleton />}
      renderError={() => <ErrorScreen variant="unexpected" />}
    >
      {(alarmSettingsData) => (
        <>
          <NotificationSettingsForm
            defaultValues={toAlarmSettingsValues(alarmSettingsData, fallbackValues)}
            onSubmit={handleSubmit}
            submitLabel={APP_ALARM_MESSAGES.SUBMIT_DEFAULT}
          />
          <PushPermissionBottomSheet
            open={pushPermissionSheet.open}
            onOpenChange={pushPermissionSheet.setOpen}
            permission={pushPermissionSheet.permission}
            platform={pushPermissionSheet.platform}
            isRequesting={pushPermissionSheet.isRequesting}
            onRequestPermission={pushPermissionSheet.requestPermission}
          />
        </>
      )}
    </LoadableBoundary>
  );
}
