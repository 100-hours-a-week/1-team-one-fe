import { useStretchingSession } from '../lib/use-stretching-session';

type StretchingSessionViewProps = {
  sessionId: string;
};

export function StretchingSessionView({ sessionId }: StretchingSessionViewProps) {
  const { videoRef, canvasRef } = useStretchingSession(sessionId);

  return (
    <div className="bg-surface relative min-h-dvh w-full">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full opacity-0"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
