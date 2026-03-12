import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import type { LucideIcon } from 'lucide-react';
import { Eye, Repeat2, Timer } from 'lucide-react';
import { useRouter } from 'next/router';

import {
  type ExerciseSessionReportExerciseType,
  type ExerciseSessionReportExerciseTypeValue,
  type ExerciseSessionReportStatus,
  type ExerciseSessionReportStatusValue,
} from '@/src/entities/exercise-session-report';
import { useExerciseSessionReportDetailQuery } from '@/src/features/exercise-session-report';
import { isApiError } from '@/src/shared/api';
import { formatDateTimeLabel } from '@/src/shared/lib/date/display-date';
import { ROUTES } from '@/src/shared/routes';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';

import {
  EXERCISE_STATUS_CHIP_CLASSNAME,
  ROUTINE_COMPLETED_CARD_CLASSNAME,
  UNKNOWN_EXERCISE_STATUS_CHIP_CLASSNAME,
} from '../config/chip-styles';
import { APP_REPORT_DETAIL_PAGE_MESSAGES } from '../config/messages';
import { REWARD_VALUE_TONE_CLASSNAME } from '../config/reward-value';
import { AppReportDetailPageSkeleton } from './AppReportDetailPage.skeleton';

const EXERCISE_TYPE_LABELS: Record<ExerciseSessionReportExerciseType, string> = {
  REPS: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.TYPE.REPS,
  DURATION: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.TYPE.DURATION,
  EYES: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.TYPE.EYES,
};

const EXERCISE_TYPE_ICONS: Record<ExerciseSessionReportExerciseType, LucideIcon> = {
  REPS: Repeat2,
  DURATION: Timer,
  EYES: Eye,
};

const EXERCISE_STATUS_LABELS: Record<ExerciseSessionReportStatus, string> = {
  PENDING: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.STATUS.PENDING,
  COMPLETED: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.STATUS.COMPLETED,
  FAILED: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.STATUS.FAILED,
  SKIPPED: APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.STATUS.SKIPPED,
};

function parseReportId(rawReportId: string | string[] | undefined): number | null {
  if (typeof rawReportId !== 'string') {
    return null;
  }

  const parsedReportId = Number(rawReportId);
  if (!Number.isInteger(parsedReportId)) {
    return null;
  }

  if (parsedReportId <= 0) {
    return null;
  }

  return parsedReportId;
}

function resolveExerciseTypeLabel(type: ExerciseSessionReportExerciseTypeValue): React.ReactNode {
  if (Object.hasOwn(EXERCISE_TYPE_LABELS, type) && Object.hasOwn(EXERCISE_TYPE_ICONS, type)) {
    const normalizedType = type as ExerciseSessionReportExerciseType;
    const Icon = EXERCISE_TYPE_ICONS[normalizedType];

    return (
      <span className="inline-flex items-center gap-1">
        <Icon className="size-3.5" aria-hidden />
        <span>{EXERCISE_TYPE_LABELS[normalizedType]}</span>
      </span>
    );
  }

  console.warn('[exercise-session-report] unknown exercise type', { type });
  return APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.TYPE_UNKNOWN;
}

function resolveExerciseStatusLabel(status: ExerciseSessionReportStatusValue): string {
  if (Object.hasOwn(EXERCISE_STATUS_LABELS, status)) {
    return EXERCISE_STATUS_LABELS[status as ExerciseSessionReportStatus];
  }

  console.warn('[exercise-session-report] unknown exercise status', { status });
  return APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.STATUS_UNKNOWN;
}

function resolveExerciseStatusChipClassName(status: ExerciseSessionReportStatusValue): string {
  if (Object.hasOwn(EXERCISE_STATUS_CHIP_CLASSNAME, status)) {
    return EXERCISE_STATUS_CHIP_CLASSNAME[status as ExerciseSessionReportStatus];
  }

  return UNKNOWN_EXERCISE_STATUS_CHIP_CLASSNAME;
}

function formatSignedValue(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}

function getRewardValueClassName(value: number): string {
  if (value > 0) {
    return REWARD_VALUE_TONE_CLASSNAME.POSITIVE;
  }

  if (value < 0) {
    return REWARD_VALUE_TONE_CLASSNAME.NEGATIVE;
  }

  return REWARD_VALUE_TONE_CLASSNAME.NEUTRAL;
}

export function AppReportDetailPage() {
  const router = useRouter();
  const reportId = parseReportId(router.query.reportId);

  const { data, isLoading, error } = useExerciseSessionReportDetailQuery(reportId ?? 0, {
    enabled: reportId !== null,
  });

  if (reportId === null) {
    return <ErrorScreen variant="not-found" actionHref={ROUTES.REPORTS} />;
  }

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      renderLoading={() => <AppReportDetailPageSkeleton />}
      renderError={(currentError) => {
        if (isApiError(currentError) && currentError.code === 'EXERCISE_SESSION_REPORT_NOT_FOUND') {
          return <ErrorScreen variant="not-found" actionHref={ROUTES.REPORTS} />;
        }

        if (isApiError(currentError) && currentError.status === 404) {
          return <ErrorScreen variant="not-found" actionHref={ROUTES.REPORTS} />;
        }

        return <ErrorScreen variant="unexpected" actionHref={ROUTES.REPORTS} />;
      }}
    >
      {(report) => {
        const createdAtLabel = formatDateTimeLabel(report.createdAt);
        const sectionCardClassName = report.isRoutineCompleted
          ? ROUTINE_COMPLETED_CARD_CLASSNAME.COMPLETED
          : ROUTINE_COMPLETED_CARD_CLASSNAME.INCOMPLETE;
        const routineStatusChipClassName = report.isRoutineCompleted
          ? EXERCISE_STATUS_CHIP_CLASSNAME.COMPLETED
          : EXERCISE_STATUS_CHIP_CLASSNAME.FAILED;

        return (
          <div className="flex flex-col gap-3 p-4 pb-6">
            <Card variant="elevated" padding="none" className={sectionCardClassName}>
              <CardHeader className="space-y-0 px-4 pt-4 pb-0">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.TITLE}
                  </CardTitle>
                  <Chip
                    label={
                      report.isRoutineCompleted
                        ? APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.ROUTINE_COMPLETED
                        : APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.ROUTINE_INCOMPLETE
                    }
                    size="sm"
                    variant="default"
                    className={routineStatusChipClassName}
                  />
                </div>
              </CardHeader>

              <CardContent className="px-4 py-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.REPORT_ID_LABEL}
                  </dt>
                  <dd className="text-text">{report.sessionReportId}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.CREATED_AT_LABEL}
                  </dt>
                  <dd className="text-text">{createdAtLabel}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.ROUTINE_COMPLETED_LABEL}
                  </dt>
                  <dd className="text-text">
                    {report.isRoutineCompleted
                      ? APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.ROUTINE_COMPLETED
                      : APP_REPORT_DETAIL_PAGE_MESSAGES.SESSION.ROUTINE_INCOMPLETE}
                  </dd>
                </dl>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="none" className={sectionCardClassName}>
              <CardHeader className="space-y-0 px-4 pt-4 pb-0">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.TITLE}
                  </CardTitle>
                  <Chip
                    label={`${APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.COUNT_LABEL}: ${report.exercises.length}`}
                    size="sm"
                    variant="default"
                  />
                </div>
              </CardHeader>

              <CardContent className="px-4 py-4">
                {report.exercises.length === 0 && (
                  <p className="text-text-muted text-sm">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.EMPTY}
                  </p>
                )}

                {report.exercises.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {report.exercises.map((exercise) => (
                      <Card
                        key={`${exercise.exerciseId}-${exercise.stepOrder}`}
                        variant="elevated"
                        padding="none"
                        className="bg-surface shadow-none"
                      >
                        <CardHeader className="space-y-0 px-3 pt-3 pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm tracking-normal">
                              {exercise.exerciseName}
                            </CardTitle>
                            <div className="flex shrink-0 items-center gap-2">
                              <Chip
                                label={resolveExerciseTypeLabel(exercise.exerciseType)}
                                size="sm"
                                variant="default"
                              />
                              <Chip
                                label={resolveExerciseStatusLabel(exercise.status)}
                                size="sm"
                                variant="default"
                                className={resolveExerciseStatusChipClassName(exercise.status)}
                              />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-3 py-3">
                          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                            <dt className="text-text-muted">
                              {APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.ORDER_LABEL}
                            </dt>
                            <dd className="text-text">{exercise.stepOrder}</dd>

                            <dt className="text-text-muted">
                              {APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.ACCURACY_LABEL}
                            </dt>
                            <dd className="text-text">
                              {exercise.accuracy === null
                                ? APP_REPORT_DETAIL_PAGE_MESSAGES.EXERCISE.ACCURACY_EMPTY
                                : `${exercise.accuracy}%`}
                            </dd>
                          </dl>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated" padding="none" className={sectionCardClassName}>
              <CardHeader className="space-y-0 px-4 pt-4 pb-0">
                <CardTitle className="text-base">
                  {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.TITLE}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.LEVEL_LABEL}
                  </dt>
                  <dd className="text-text">{report.rewards.level}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.PREVIOUS_EXP_LABEL}
                  </dt>
                  <dd className="text-text">{report.rewards.previousExp}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.EARNED_EXP_LABEL}
                  </dt>
                  <dd className={getRewardValueClassName(report.rewards.earnedExp)}>
                    {formatSignedValue(report.rewards.earnedExp)}
                  </dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.STREAK_LABEL}
                  </dt>
                  <dd className="text-text">{report.rewards.streak}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.PREVIOUS_STATUS_SCORE_LABEL}
                  </dt>
                  <dd className="text-text">{report.rewards.previousStatusScore}</dd>

                  <dt className="text-text-muted">
                    {APP_REPORT_DETAIL_PAGE_MESSAGES.REWARD.EARNED_STATUS_SCORE_LABEL}
                  </dt>
                  <dd className={getRewardValueClassName(report.rewards.earnedStatusScore)}>
                    {formatSignedValue(report.rewards.earnedStatusScore)}
                  </dd>
                </dl>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </LoadableBoundary>
  );
}
