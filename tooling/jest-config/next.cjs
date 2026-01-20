const base = require('./base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    ...(base.moduleNameMapper || {}),
    '\\.(css|less|scss|sass)': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|avif|svg)': '<rootDir>/test/__mocks__/fileMock.js',
  },
};
