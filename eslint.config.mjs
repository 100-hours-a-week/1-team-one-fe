import { globalIgnores } from 'eslint/config';
import { config as base } from './tooling/eslint-config/base.js';
import { config as next } from './tooling/eslint-config/next.js';
import { config as reactInternal } from './tooling/eslint-config/react-internal.js';

export default [
  globalIgnores(['**/.next/**', '**/out/**', '**/build/**', '**/next-env.d.ts']),

  ...base,

  ...next.map((c) => ({ ...c, files: ['apps/web/**/*.{js,jsx,ts,tsx}'] })),

  ...reactInternal.map((c) => ({ ...c, files: ['packages/ui/**/*.{js,jsx,ts,tsx}'] })),
];
