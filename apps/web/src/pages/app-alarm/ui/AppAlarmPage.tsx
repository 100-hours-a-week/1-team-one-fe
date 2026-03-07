import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { toAlarmSettingsValues } from '@/src/entities/alarm-settings';
import {
  alarmSettingsQueryOptions,
  type AlarmSettingsValuesType,
  NotificationSettingsForm,
  toAlarmSettingsRequest,
  useAlarmSettingsMutation,
  useAlarmSettingsQuery,
} from '@/src/features/alarm-settings';
import {
  DEFAULT_WEEKDAYS,
  INTERVAL_CONFIG,
  TIME_CONFIG,
} from '@/src/features/alarm-settings/config';
import {
  PushPermissionBottomSheet,
  usePushPermissionSheet,
} from '@/src/features/push-notifications';
import { APP_ALARM_MESSAGES } from '@/src/pages/app-alarm/config/messages';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';

import { AppAlarmPageSkeleton } from './AppAlarmPage.skeleton';

const fallbackValues: AlarmSettingsValuesType = {
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
  const { open, setOpen, permission, platform, isRequesting, openSheet, requestPermission } =
    pushPermissionSheet;
  const {
    data: alarmSettings,
    isLoading,
    error,
  } = useAlarmSettingsQuery({
    refetchOnMount: 'always',
  });
  const { mutateAsync } = useAlarmSettingsMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alarmSettingsQueryOptions().queryKey });
    },
  });

  const handleSubmit = async (values: AlarmSettingsValuesType) => {
    await mutateAsync(toAlarmSettingsRequest(values));
  };

  useEffect(() => {
    if (permission === 'granted') return;
    openSheet();
  }, [openSheet, permission]);

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
            open={open}
            onOpenChange={setOpen}
            permission={permission}
            platform={platform}
            isRequesting={isRequesting}
            onRequestPermission={requestPermission}
          />
        </>
      )}
    </LoadableBoundary>
  );
}
