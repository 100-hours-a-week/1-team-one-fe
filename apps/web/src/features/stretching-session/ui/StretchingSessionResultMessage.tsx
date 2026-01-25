type StretchingSessionResultMessageProps = {
  message: string | null;
};

export function StretchingSessionResultMessage({ message }: StretchingSessionResultMessageProps) {
  if (!message) return null;

  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <span className="text-text text-sm font-semibold">{message}</span>
    </div>
  );
}
