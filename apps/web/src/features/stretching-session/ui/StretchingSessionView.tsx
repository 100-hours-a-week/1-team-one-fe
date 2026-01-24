import { useStretchingSession } from '../lib/use-stretching-session';

type StretchingSessionViewProps = {
  sessionId: string;
};

export function StretchingSessionView({ sessionId }: StretchingSessionViewProps) {
  const { videoRef } = useStretchingSession(sessionId);

  return (
    <div className="h-full w-full">
      <video ref={videoRef} className="h-full w-full" playsInline muted />
    </div>
  );
}
