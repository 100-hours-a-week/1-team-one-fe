import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type ExerciseSession,
  type ExerciseSessionResponse,
  toExerciseSession,
} from '@/src/entities/exercise-session';
import { type ApiError, getHttpClient } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

const mockExerciseSessionResponse: ExerciseSessionResponse = {
  code: 'GET_SESSION_SUCCESS',
  data: {
    routineId: 23,
    routineOrder: 1,
    createdAt: '2026-01-29T13:09:00',
    routineSteps: [
      {
        routineStepId: 77,
        stepOrder: 1,
        targetReps: null,
        durationTime: 10,
        limitTime: 60,
        exercise: {
          exerciseId: 1,
          type: 'DURATION',
          name: '어깨 스트레칭',
          content: '어깨를 높게 당깁니다',
          effect: '어깨가 풀린다',
          pose: {
            referencePose: {
              targetKeypoints: [0, 7, 8, 11, 12],
              keyframes: [
                {
                  phase: 'start',
                  timestampRatio: 0,
                  keypoints: [
                    [0.4, 0.45, -0.05],
                    [0.6, 0.45, -0.05],
                    [0.62, 0.5, -0.02],
                    [0.42, 0.62, -0.03],
                    [0.58, 0.62, -0.03],
                  ],
                },
                {
                  phase: 'end',
                  timestampRatio: 1,
                  keypoints: [
                    [0.4, 0.42, -0.04],
                    [0.6, 0.42, -0.04],
                    [0.62, 0.48, -0.02],
                    [0.42, 0.6, -0.02],
                    [0.58, 0.6, -0.02],
                  ],
                },
              ],
              totalDuration: 2,
              fpsHint: 30,
            },
          },
        },
      },
      {
        routineStepId: 78,
        stepOrder: 2,
        targetReps: null,
        durationTime: 10,
        limitTime: 60,
        exercise: {
          exerciseId: 1,
          type: 'DURATION',
          name: '어깨 스트레칭2',
          content: '어깨를 높게 당깁니다',
          effect: '어깨가 풀린다',
          pose: {
            referencePose: {
              targetKeypoints: [0, 7, 8, 11, 12],
              keyframes: [
                {
                  phase: 'start',
                  timestampRatio: 0,
                  keypoints: [
                    [0.4, 0.45, -0.05],
                    [0.6, 0.45, -0.05],
                    [0.62, 0.5, -0.02],
                    [0.42, 0.62, -0.03],
                    [0.58, 0.62, -0.03],
                  ],
                },
                {
                  phase: 'end',
                  timestampRatio: 1,
                  keypoints: [
                    [0.4, 0.42, -0.04],
                    [0.6, 0.42, -0.04],
                    [0.62, 0.48, -0.02],
                    [0.42, 0.6, -0.02],
                    [0.58, 0.6, -0.02],
                  ],
                },
              ],
              totalDuration: 2,
              fpsHint: 30,
            },
          },
        },
      },
    ],
  },
};

async function fetchExerciseSession(sessionId: string): Promise<ExerciseSession> {
  const client = getHttpClient({ requiresAuth: true });
  // TODO: api 완성 후 실데이터 연동
  // const response = await client.get<ExerciseSessionResponse>(
  //   `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
  // );
  // return toExerciseSession(response.data.data);
  void client;
  void sessionId;
  return toExerciseSession(mockExerciseSessionResponse.data);
}

export type ExerciseSessionQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.detail>;

export type ExerciseSessionQueryOptions = Omit<
  UseQueryOptions<ExerciseSession, ApiError, ExerciseSession, ExerciseSessionQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionQuery(sessionId: string, options?: ExerciseSessionQueryOptions) {
  return useQuery({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchExerciseSession(sessionId),
    ...options,
  });
}
