/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.test.{ts,tsx}'],
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/dist/', '<rootDir>/build/', '<rootDir>/coverage/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/build/', '/coverage/', '/e2e/'],
};

export default config;
