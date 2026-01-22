import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { SingleChoiceGroup } from '@repo/ui/single-choice-group';

import { useSurveyForm } from '@/src/pages/onboarding-survey/model/use-survey-form';

import { useSurveyQuery } from '../api/survey-query';
import { SURVEY_MESSAGES } from '../config/messages';

export interface OnboardingSurveyFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function OnboardingSurveyForm({ onBack, onComplete }: OnboardingSurveyFormProps) {
  const { data } = useSurveyQuery();

  const {
    currentQuestion,
    selectedValue,
    options,
    hasSelection,
    handleChoiceChange,
    handleBackClick,
    handleNext,
  } = useSurveyForm({ onBack, onComplete, data });

  return (
    <section className="flex flex-col justify-between gap-20">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">{SURVEY_MESSAGES.TITLE}</h1>
        <p className="text-sm text-neutral-600">{SURVEY_MESSAGES.DESCRIPTION}</p>
      </header>

      {currentQuestion && (
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
      )}

      <div className="flex flex-col items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleBackClick} fullWidth>
          {SURVEY_MESSAGES.BACK}
        </Button>
        <Button disabled={!hasSelection} onClick={handleNext} fullWidth>
          {SURVEY_MESSAGES.NEXT}
        </Button>
      </div>
    </section>
  );
}
