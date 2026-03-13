export type GrassLevel = 0 | 1 | 2 | 3 | 4;

export interface MonthlyGrassCell {
  date: string;
  day: number;
  level: GrassLevel;
  successCount: number;
  targetCount: number;
  ratio: number;
}
