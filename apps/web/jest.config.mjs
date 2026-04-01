import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

import shared from '@tooling/jest-config/next';

/** @type {import('jest').Config} */
const customJestConfig = {
  ...shared,
  moduleNameMapper: {
    ...(shared.moduleNameMapper || {}),
    '^@/(.*)$': '<rootDir>/$1',
    '^@repo/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    '^@repo/stretching-session$': '<rootDir>/../../packages/stretching-session/src/index.ts',
    '^@repo/stretching-accuracy$': '<rootDir>/../../packages/stretching-accuracy/src/index.ts',
    '^@repo/eye-stretching-session$': '<rootDir>/../../packages/eye-stretching-session/src/index.ts',
    '^@repo/eye-stretching-session/hook$':
      '<rootDir>/../../packages/eye-stretching-session/lib/use-eye-stretching-session.ts',
  },
};

export default createJestConfig(customJestConfig);
