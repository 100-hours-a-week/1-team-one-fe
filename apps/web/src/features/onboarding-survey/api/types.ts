import type { ApiResponse } from '@/src/shared/api';

export interface SurveyOption {
  optionId: number;
  sortOrder: number;
  content: string;
}

export interface SurveyQuestion {
  questionId: number;
  sortOrder: number;
  content: string;
  options: SurveyOption[];
}

export interface SurveyData {
  surveyId: number;
  questions: SurveyQuestion[];
}

export type SurveyResponse = ApiResponse<SurveyData>;
