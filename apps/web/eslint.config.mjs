import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { nextJsConfig } from '@tooling/eslint-config/next';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...nextJsConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // (1) routing-only pages/** 금지 규칙
  {
    files: ['pages/**/*.ts', 'pages/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/shared/*', '@/entities/*', '@/features/*', '@/widgets/*'],
        },
      ],
    },
  },
  // (2) shared는 상향 레이어 import 금지 (FSD 핵심)
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/app/*', '@/pages/*', '@/widgets/*', '@/features/*', '@/entities/*'],
        },
      ],
    },
  },
  // (3) entities는 상향 레이어 역참조 금지
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/app/*', '@/pages/*', '@/widgets/*', '@/features/*'],
        },
      ],
    },
  },
]);

export default eslintConfig;
