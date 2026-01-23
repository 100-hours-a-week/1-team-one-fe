import { useEffect, useMemo, useState } from 'react';

import type { SurveyData, SurveyQuestion, SurveySubmissionResponseItem } from '../api/types';

interface UseSurveyFormOptions {
  data?: SurveyData;
  onBack: () => void;
}

type SurveyAnswers = Record<number, number>;

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function useSurveyForm({ data, onBack }: UseSurveyFormOptions) {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const questions = useMemo(() => {
    if (!data) {
      return [] as SurveyQuestion[];
    }

    return sortByOrder(data.questions).map((question) => ({
      ...question,
      options: sortByOrder(question.options),
    }));
  }, [data]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [questions.length]);

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.questionId] : undefined;
  const hasSelection = selectedOptionId !== undefined;
  const isLast = currentIndex === questions.length - 1;

  const responses = useMemo(() => {
    return questions
      .map<SurveySubmissionResponseItem | null>((question) => {
        const optionId = answers[question.questionId];

        if (optionId === undefined) {
          return null;
        }

        return {
          questionId: question.questionId,
          optionId,
        };
      })
      .filter((item): item is SurveySubmissionResponseItem => item !== null);
  }, [answers, questions]);

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
      return false;
    }

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      return false;
    }

    return true;
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
    responses,
    hasSelection,
    isLast,
    handleChoiceChange,
    handleBackClick,
    handleNext,
  };
}
