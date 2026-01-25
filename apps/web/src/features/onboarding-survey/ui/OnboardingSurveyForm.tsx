import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { SingleChoiceGroup } from '@repo/ui/single-choice-group';

import { useSubmitSurveyMutation } from '../api/submit-survey-mutation';
import { useSurveyQuery } from '../api/survey-query';
import { SURVEY_MESSAGES } from '../config/messages';
import { useSurveyForm } from '../lib/use-survey-form';

export interface OnboardingSurveyFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function OnboardingSurveyForm({ onBack, onComplete }: OnboardingSurveyFormProps) {
  const { data, isPending, isError } = useSurveyQuery();
  const { mutateAsync, isPending: isSubmitting } = useSubmitSurveyMutation();

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

  //TODO : 에러바운더리 및 suspense 연결
  if (isPending) {
    return <p className="text-sm text-neutral-600">{SURVEY_MESSAGES.LOADING}</p>;
  }

  if (isError || !data || !currentQuestion) {
    return <p className="text-error-600 text-sm">{SURVEY_MESSAGES.ERROR}</p>;
  }

  const handleSubmit = async () => {
    const shouldSubmit = handleNext();
    if (!shouldSubmit) return;

    const hasAllResponses = responses.length === data.questions.length;
    if (!hasAllResponses) return;

    await mutateAsync({
      surveyId: data.surveyId,
      responses,
    });
    onComplete();
  };

  return (
    <section className="flex flex-col justify-between gap-20">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">{SURVEY_MESSAGES.TITLE}</h1>
        <p className="text-sm text-neutral-600">{SURVEY_MESSAGES.DESCRIPTION}</p>
      </header>

      <div className="flex flex-col gap-4">
        {/* TODO: 분리 */}
        <Card>
          <CardHeader className="pb-5">
            <CardTitle>{currentQuestion.content}</CardTitle>
          </CardHeader>
          <CardContent>아래 항목 중 하나만 선택해주세요</CardContent>
        </Card>
        <SingleChoiceGroup
          options={options}
          value={selectedValue}
          onChange={handleChoiceChange}
          name={`question-${currentQuestion.questionId}`}
        />
      </div>

      <div className="flex flex-col items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleBackClick} fullWidth>
          {SURVEY_MESSAGES.BACK}
        </Button>
        <Button disabled={!hasSelection || isSubmitting} onClick={handleSubmit} fullWidth>
          {SURVEY_MESSAGES.NEXT}
        </Button>
      </div>
    </section>
  );
}
