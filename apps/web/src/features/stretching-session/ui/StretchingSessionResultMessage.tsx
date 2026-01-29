import { Chip } from '@repo/ui/chip';

import { STRETCHING_SESSION_MESSAGES } from '../config/messages';

type StretchingSessionResultMessageProps = {
  message: string | null;
};

export function StretchingSessionResultMessage({ message }: StretchingSessionResultMessageProps) {
  return (
    <div className="bg-surface pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-xl">
      <Chip
        className="text-text text-sm font-semibold"
        label={message ?? STRETCHING_SESSION_MESSAGES.STATUS.RESULT_PENDING}
      />
    </div>
  );
}
