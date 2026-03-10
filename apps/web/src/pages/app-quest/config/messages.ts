export const APP_QUEST_PAGE_MESSAGES = {
  HEADER: {
    TITLE: '',
    DESCRIPTION: '진행 중인 퀘스트와 완료 목록을 확인해보세요.',
  },
  STATE: {
    LOADING: '퀘스트를 불러오는 중이에요.',
    ERROR: '퀘스트를 불러오지 못했어요.',
  },
  TABS: {
    IN_PROGRESS: {
      LABEL: '진행중',
      EMPTY: '진행 중인 퀘스트가 없어요.',
    },
    COMPLETED: {
      LABEL: '완료 목록',
      EMPTY: '완료한 퀘스트가 없어요.',
    },
  },
} as const;
