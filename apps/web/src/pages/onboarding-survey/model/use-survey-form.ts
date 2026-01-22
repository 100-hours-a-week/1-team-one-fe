import { useMemo, useState } from 'react';

import { OnboardingSurveyFormProps, SurveyQuestion } from '@/src/features/onboarding-survey';

type SurveyAnswers = Record<number, number>;

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function useSurveyForm({
  onBack,
  onComplete,
  data,
}: OnboardingSurveyFormProps & { data: { questions: SurveyQuestion[] } | undefined }) {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0); //현재 질문 인덱스

  const questions = useMemo(() => {
    if (!data) {
      return [] as SurveyQuestion[];
    }

    return sortByOrder(data.questions).map((question) => ({
      ...question,
      options: sortByOrder(question.options),
    }));
  }, [data]);

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.questionId] : undefined;
  const hasSelection = selectedOptionId !== undefined;

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleBackClick = () => {
    if (currentIndex === 0) {
      onBack();
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!hasSelection) {
      return;
    }

    const isLast = currentIndex === questions.length - 1;

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    onComplete();
  };

  const selectedValue = selectedOptionId !== undefined ? String(selectedOptionId) : '';

  const options =
    currentQuestion?.options.map((option) => ({
      label: option.content,
      value: String(option.optionId),
    })) ?? [];

  const handleChoiceChange = (value: string) => {
    if (!currentQuestion) {
      return;
    }

    const optionId = Number(value);

    if (Number.isNaN(optionId)) {
      return;
    }

    handleSelect(currentQuestion.questionId, optionId);
  };

  return {
    currentQuestion,
    selectedValue,
    options,
    hasSelection,
    handleChoiceChange,
    handleBackClick,
    handleNext,
  };
}
