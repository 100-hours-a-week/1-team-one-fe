import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { SingleChoiceGroup } from '@repo/ui/single-choice-group';
import { Spinner } from '@repo/ui/spinner';
import { toast } from '@repo/ui/toast';

import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { TOAST_MESSAGES } from '@/src/shared/config/toast-messages';
import { LoadableBoundary } from '@/src/shared/ui/boundary';

import { useSubmitSurveyMutation } from '../api/submit-survey-mutation';
import { useSurveyQuery } from '../api/survey-query';
import type { SurveySubmissionData } from '../api/types';
import { SURVEY_MESSAGES } from '../config/messages';
import { useSurveyForm } from '../lib/use-survey-form';
import { OnboardingSurveyFormSkeleton } from './OnboardingSurveyForm.skeleton';

export interface OnboardingSurveyFormProps {
  onBack: () => void;
  onComplete: (data: SurveySubmissionData) => void;
}

function OnboardingSurveySubmittingOverlay() {
  return (
    <div className="bg-bg absolute inset-0 z-20 flex items-center justify-center opacity-80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span className="text-text-muted text-center text-sm whitespace-pre">
          {SURVEY_MESSAGES.SUBMITTING}
        </span>
      </div>
    </div>
  );
}

export function OnboardingSurveyForm({ onBack, onComplete }: OnboardingSurveyFormProps) {
  const { data, isPending, error } = useSurveyQuery();
  const { mutateAsync, isPending: isSubmitting } = useSubmitSurveyMutation({
    meta: { disableToast: true },
  });

  const {
    currentQuestion,
    selectedValue,
    options,
    responses,
    hasSelection,
    handleChoiceChange,
    handleBackClick,
    handleNext,
  } = useSurveyForm({ onBack, data });

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const shouldSubmit = handleNext();
    if (!shouldSubmit) return;
    if (!data) return;

    const hasAllResponses = responses.length === data.questions.length;
    if (!hasAllResponses) return;

    try {
      const result = await mutateAsync({
        surveyId: data.surveyId,
        responses,
      });
      toast({
        title: SURVEY_MESSAGES.TOAST.SUBMIT_SUCCESS,
        variant: 'success',
      });
      onComplete(result);
    } catch (error) {
      if (isApiError(error) && error.status === HTTP_STATUS.SERVICE_UNAVAILABLE) {
        toast({
          title: SURVEY_MESSAGES.TOAST.SERVER_ERROR,
          variant: 'error',
        });
        return;
      }

      const message = isApiError(error) ? error.message : TOAST_MESSAGES.ERROR_FALLBACK;
      toast({ title: message, variant: 'error' });
    }
  };

  return (
    <LoadableBoundary
      isLoading={isPending}
      error={error}
      data={data}
      isEmpty={Boolean(data && data.questions.length === 0)}
      renderLoading={() => <OnboardingSurveyFormSkeleton />}
      renderError={() => <p className="text-error-600 text-sm">{SURVEY_MESSAGES.ERROR}</p>}
      renderEmpty={() => <p className="text-text-muted text-sm">{SURVEY_MESSAGES.EMPTY}</p>}
    >
      {() => (
        <div className="relative flex h-full flex-col justify-evenly gap-20 p-6">
          <header className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">{SURVEY_MESSAGES.TITLE}</h1>
            <p className="text-sm text-neutral-600">{SURVEY_MESSAGES.DESCRIPTION}</p>
          </header>

          <div className="flex flex-col gap-4">
            {/* TODO: 분리 */}
            <Card>
              <CardHeader className="pb-5">
                <CardTitle>{currentQuestion?.content ?? ''}</CardTitle>
              </CardHeader>
              <CardContent>{SURVEY_MESSAGES.QUESTION_HELPER}</CardContent>
            </Card>
            <SingleChoiceGroup
              options={options}
              value={selectedValue}
              onChange={handleChoiceChange}
              name={`question-${currentQuestion?.questionId ?? 0}`}
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBackClick} disabled={isSubmitting} fullWidth>
              {SURVEY_MESSAGES.BACK}
            </Button>
            <Button
              disabled={!hasSelection || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleSubmit}
              fullWidth
            >
              {SURVEY_MESSAGES.NEXT}
            </Button>
          </div>

          {isSubmitting && <OnboardingSurveySubmittingOverlay />}
        </div>
      )}
    </LoadableBoundary>
  );
}
