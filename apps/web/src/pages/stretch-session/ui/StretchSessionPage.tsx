import { useRouter } from 'next/router';

import { StretchingSessionView } from '@/src/features/stretching-session';

export function StretchSessionPage() {
  const router = useRouter();
  const sessionId = router.query.sessionId;

  if (typeof sessionId !== 'string') return null;

  return <StretchingSessionView sessionId={sessionId} />;
}
