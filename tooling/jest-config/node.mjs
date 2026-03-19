import base from './base.mjs';

/** @type {import('jest').Config} */
const config = {
  ...base,
  testEnvironment: 'node',
};

export default config;
