import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { SURVEY_QUERY_KEYS } from '../config/query-keys';
import type { SurveyData, SurveyResponse } from './types';

const mockSurveyData: SurveyResponse = {
  code: 'GET_SURVEY_SUCCESS',
  data: {
    surveyId: 1,
    questions: [
      {
        questionId: 1,
        sortOrder: 1,
        content: '최근 1주일 동안, 목 부위의 불편함이나 통증은 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '전혀 불편하지 않았다' },
          { optionId: 2, sortOrder: 2, content: '약간 불편했다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '많이 불편했다' },
          { optionId: 5, sortOrder: 5, content: '매우 불편했다' },
        ],
      },
      {
        questionId: 2,
        sortOrder: 2,
        content: '최근 1주일 동안, 어깨 부위에 뻐근함이나 통증을 느낀 정도는 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '전혀 느끼지 않았다' },
          { optionId: 2, sortOrder: 2, content: '가끔 느꼈다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '자주 느꼈다' },
          { optionId: 5, sortOrder: 5, content: '거의 항상 느꼈다' },
        ],
      },
      {
        questionId: 3,
        sortOrder: 3,
        content: '최근 1주일 동안, 허리(요추) 부위의 불편함이나 통증은 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '전혀 없었다' },
          { optionId: 2, sortOrder: 2, content: '약간 있었다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '많이 있었다' },
          { optionId: 5, sortOrder: 5, content: '매우 심했다' },
        ],
      },
      {
        questionId: 4,
        sortOrder: 4,
        content: '최근 1주일 동안, 손목 사용 시 불편함이나 부담을 느낀 정도는 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '전혀 느끼지 않았다' },
          { optionId: 2, sortOrder: 2, content: '약간 느꼈다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '많이 느꼈다' },
          { optionId: 5, sortOrder: 5, content: '매우 많이 느꼈다' },
        ],
      },
      {
        questionId: 5,
        sortOrder: 5,
        content: '최근 1주일 동안, 하루 평균 장시간 앉아서 보내는 시간은 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '거의 앉아 있지 않았다' },
          { optionId: 2, sortOrder: 2, content: '비교적 짧았다' },
          { optionId: 3, sortOrder: 3, content: '보통 수준이었다' },
          { optionId: 4, sortOrder: 4, content: '꽤 오래 앉아 있었다' },
          { optionId: 5, sortOrder: 5, content: '대부분의 시간을 앉아서 보냈다' },
        ],
      },
      {
        questionId: 6,
        sortOrder: 6,
        content: '최근 1주일 동안, 전반적인 신체 피로감은 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '거의 피로하지 않았다' },
          { optionId: 2, sortOrder: 2, content: '약간 피로했다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '많이 피로했다' },
          { optionId: 5, sortOrder: 5, content: '매우 피로했다 (회복이 잘 되지 않았다)' },
        ],
      },
      {
        questionId: 7,
        sortOrder: 7,
        content:
          '최근 1주일 동안, 화면을 오래 본 후 눈의 피로감이나 시각적 불편함을 느낀 정도는 어느 정도였나요?',
        options: [
          { optionId: 1, sortOrder: 1, content: '거의 느끼지 않았다' },
          { optionId: 2, sortOrder: 2, content: '약간 느꼈다' },
          { optionId: 3, sortOrder: 3, content: '보통이었다' },
          { optionId: 4, sortOrder: 4, content: '자주 느꼈다' },
          { optionId: 5, sortOrder: 5, content: '매우 자주 느꼈다' },
        ],
      },
    ],
  },
};

async function fetchSurvey(): Promise<SurveyData> {
  const client = getHttpClient({ requiresAuth: true });
  //TODO: 연결
  // const response = await client.get<SurveyResponse>('/survey');

  return mockSurveyData.data;
}

export type SurveyQueryKey = ReturnType<typeof SURVEY_QUERY_KEYS.survey>;

export type SurveyQueryOptions = Omit<
  UseQueryOptions<SurveyData, ApiError, SurveyData, SurveyQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useSurveyQuery(options?: SurveyQueryOptions) {
  return useQuery({
    queryKey: SURVEY_QUERY_KEYS.survey(),
    queryFn: fetchSurvey,
    staleTime: Infinity, //바뀔 일 없음
    ...options,
  });
}
