type EyeStretchingGazeDotProps = {
  /** 시선 x 좌표 (0~1 정규화) */
  gazeX: number;
  /** 시선 y 좌표 (0~1 정규화) */
  gazeY: number;
};

export function EyeStretchingGazeDot({ gazeX, gazeY }: EyeStretchingGazeDotProps) {
  return (
    <div
      className="pointer-events-none absolute z-30 h-3 w-3 rounded-full bg-red-500 opacity-70"
      style={{
        left: `${gazeX * 100}%`,
        top: `${gazeY * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
