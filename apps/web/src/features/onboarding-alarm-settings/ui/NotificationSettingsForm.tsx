import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { TimeInput } from '@repo/ui/time-input';
import { Controller, useForm } from 'react-hook-form';

import { isApiError } from '@/src/shared/api';

import { FORM_MESSAGES, INTERVAL_CONFIG } from '../config';
import { ALARM_SETTINGS_FIELD_MAP } from '../config/field-map';
import { alarmSettingsSchema, type AlarmSettingsValues } from '../lib';
import { IntervalStepper } from './IntervalStepper';
import { WeekdaySelector } from './WeekdaySelector';

export interface NotificationSettingsFormProps {
  defaultValues: AlarmSettingsValues;
  onSubmit: (values: AlarmSettingsValues) => Promise<void>;
  submitLabel: string;
}

export function NotificationSettingsForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: NotificationSettingsFormProps) {
  const { control, handleSubmit, formState, setError } = useForm<AlarmSettingsValues>({
    resolver: zodResolver(alarmSettingsSchema),
    mode: 'onBlur',
    defaultValues,
  });

  //TODO: 리팩토링
  //TODO: key 상수화
  const handleFormSubmit = async (values: AlarmSettingsValues) => {
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      if (isApiError(error) && error.errors) {
        error.errors.forEach((err) => {
          const fieldKey =
            err.field &&
            ALARM_SETTINGS_FIELD_MAP[err.field as keyof typeof ALARM_SETTINGS_FIELD_MAP];

          if (fieldKey) {
            setError(fieldKey, {
              type: 'server',
              message: err.reason,
            });
            return;
          }

          setError('root.serverError', {
            type: 'server',
            message: err.reason,
          });
        });
        return;
      }

      setError('root.serverError', {
        type: 'server',
        message: FORM_MESSAGES.ERROR.SUBMIT_FAILED,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card padding="sm">
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {formState.errors.root?.serverError && (
            <div className="bg-error-50 rounded-md p-4">
              <p className="text-error-600 text-sm">{formState.errors.root.serverError.message}</p>
            </div>
          )}

          <Controller
            name="intervalMinutes"
            control={control}
            render={({ field }) => (
              <IntervalStepper
                value={field.value}
                onChange={field.onChange}
                min={INTERVAL_CONFIG.MIN_MINUTES}
                max={INTERVAL_CONFIG.MAX_MINUTES}
                step={INTERVAL_CONFIG.STEP_MINUTES}
                disabled={formState.isSubmitting}
                label="알림 간격"
                helperText="스트레칭 알림을 받을 시간 간격을 설정해주세요."
              />
            )}
          />

          <div className="space-y-4">
            <h3 className="text-text text-sm font-medium">활동 시간</h3>
            <p className="text-fg-muted text-sm">알림을 받을 시간대를 설정해주세요.</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="activeStart"
                control={control}
                render={({ field, fieldState }) => (
                  <TimeInput.Root
                    error={fieldState.invalid}
                    disabled={formState.isSubmitting}
                    required
                  >
                    <TimeInput.Label>시작 시간</TimeInput.Label>
                    <TimeInput.Control>
                      <TimeInput.Field {...field} />
                    </TimeInput.Control>
                    {fieldState.error && (
                      <TimeInput.HelperText type="error">
                        {fieldState.error.message}
                      </TimeInput.HelperText>
                    )}
                  </TimeInput.Root>
                )}
              />

              <Controller
                name="activeEnd"
                control={control}
                render={({ field, fieldState }) => (
                  <TimeInput.Root
                    error={fieldState.invalid}
                    disabled={formState.isSubmitting}
                    required
                  >
                    <TimeInput.Label>종료 시간</TimeInput.Label>
                    <TimeInput.Control>
                      <TimeInput.Field {...field} />
                    </TimeInput.Control>
                    {fieldState.error && (
                      <TimeInput.HelperText type="error">
                        {fieldState.error.message}
                      </TimeInput.HelperText>
                    )}
                  </TimeInput.Root>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-text text-sm font-medium">집중 시간</h3>
            <p className="text-fg-muted text-sm">
              집중 모드로 알림을 받지 않을 시간을 설정해주세요.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="focusStart"
                control={control}
                render={({ field, fieldState }) => (
                  <TimeInput.Root error={fieldState.invalid} disabled={formState.isSubmitting}>
                    <TimeInput.Label>집중 시작</TimeInput.Label>
                    <TimeInput.Control>
                      <TimeInput.Field {...field} />
                    </TimeInput.Control>
                    {fieldState.error && (
                      <TimeInput.HelperText type="error">
                        {fieldState.error.message}
                      </TimeInput.HelperText>
                    )}
                  </TimeInput.Root>
                )}
              />

              <Controller
                name="focusEnd"
                control={control}
                render={({ field, fieldState }) => (
                  <TimeInput.Root error={fieldState.invalid} disabled={formState.isSubmitting}>
                    <TimeInput.Label>집중 종료</TimeInput.Label>
                    <TimeInput.Control>
                      <TimeInput.Field {...field} />
                    </TimeInput.Control>
                    {fieldState.error && (
                      <TimeInput.HelperText type="error">
                        {fieldState.error.message}
                      </TimeInput.HelperText>
                    )}
                  </TimeInput.Root>
                )}
              />
            </div>
          </div>

          <Controller
            name="weekdays"
            control={control}
            render={({ field, fieldState }) => (
              <WeekdaySelector
                value={field.value}
                onChange={field.onChange}
                error={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                label="반복 요일"
                helperText="알림을 받을 요일을 선택해주세요."
              />
            )}
          />
        </CardContent>
      </Card>
      <Button type="submit" disabled={formState.isSubmitting} fullWidth>
        {formState.isSubmitting ? '저장 중...' : submitLabel}
      </Button>
    </form>
  );
}
