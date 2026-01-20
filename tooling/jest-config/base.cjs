/** @type {import('jest').Config} */
module.exports = {
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
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/build/', '/coverage/'],
  testEnvironment: 'jsdom',
};
