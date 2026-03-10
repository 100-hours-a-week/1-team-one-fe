import type { QuestListDataType, QuestQueryParams } from '../model/types';

const QUEST_MOCK_RESPONSES = {
  inProgress: {
    quests: [
      {
        questId: 1,
        name: '매일 스트레칭',
        questImagePath: 'quest.png',
        type: 'DAILY',
        rewardExp: 10,
        targetCount: 5,
        currentCount: 3,
        finishedAt: '2026-12-31T23:59:59',
      },
      {
        questId: 2,
        name: '주간 운동 챙피언',
        questImagePath: 'quest2.png',
        type: 'WEEKLY',
        rewardExp: 50,
        targetCount: 10,
        currentCount: 7,
        finishedAt: '2026-03-15T23:59:59',
      },
      {
        questId: 3,
        name: '봄맞이 이벤트 챌린지',
        questImagePath: '',
        type: 'EVENT',
        rewardExp: 30,
        targetCount: 3,
        currentCount: 1,
        finishedAt: '2026-03-20T23:59:59',
      },
    ],
  },
  completed: {
    quests: [
      {
        questId: 100,
        name: '완료한 데일리 루틴',
        questImagePath: 'quest-completed.png',
        type: 'DAILY',
        rewardExp: 15,
        targetCount: 3,
        currentCount: 3,
        finishedAt: '2026-03-01T23:59:59',
      },
    ],
  },
} as const satisfies {
  inProgress: QuestListDataType;
  completed: QuestListDataType;
};

//TODO: MOCK_RESPONSE
// function toIsCompletedParam(isCompleted?: boolean) {
//   if (isCompleted) return true;
//   return undefined;
// }

function toQuestMockBucket(isCompleted?: boolean): 'inProgress' | 'completed' {
  if (isCompleted) return 'completed';
  return 'inProgress';
}

export async function fetchMeQuestsFn(params: QuestQueryParams = {}): Promise<QuestListDataType> {
  const bucket = toQuestMockBucket(params.isCompleted);
  return QUEST_MOCK_RESPONSES[bucket];
  // const client = getHttpClient({ requiresAuth: true });
  // const response = await client.get<MeQuestsResponseDTO>('/me/quests', {
  //   params: {
  //     'is-completed': toIsCompletedParam(params.isCompleted),
  //   },
  // });

  // return response.data.data;
}
