export const GUIDE_CONNECTIONS = [
  // Face
  [0, 7],
  [0, 8],
  // Shoulders
  [11, 12],
  [7, 11],
  [8, 12],
  // Left arm
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [17, 19],
  // Right arm
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [18, 20],
  // Torso
  [11, 23],
  [12, 24],
  [23, 24],
] as const;

export const GUIDE_LANDMARK_NAMES = {
  0: 'nose',
  7: 'left_ear',
  8: 'right_ear',
  11: 'left_shoulder',
  12: 'right_shoulder',
  13: 'left_elbow',
  14: 'right_elbow',
  15: 'left_wrist',
  16: 'right_wrist',
  17: 'left_pinky',
  18: 'right_pinky',
  19: 'left_index',
  20: 'right_index',
  21: 'left_thumb',
  22: 'right_thumb',
  23: 'left_hip',
  24: 'right_hip',
} as const;
