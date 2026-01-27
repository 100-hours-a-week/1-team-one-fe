import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';
import pluginImport from 'eslint-plugin-import';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Circular dependency detection
      'import/no-cycle': ['warn', { maxDepth: 10, ignoreExternal: true }],
    },
  },
  {
    // FSD Layer Rules: shared layer cannot import from upper layers
    files: ['**/src/shared/**/*.ts', '**/src/shared/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*'],
              message: 'shared layer cannot import from app layer',
            },
            {
              group: ['@/pages', '@/pages/*'],
              message: 'shared layer cannot import from pages layer',
            },
            {
              group: ['@/widgets', '@/widgets/*'],
              message: 'shared layer cannot import from widgets layer',
            },
            {
              group: ['@/features', '@/features/*'],
              message: 'shared layer cannot import from features layer',
            },
            {
              group: ['@/entities', '@/entities/*'],
              message: 'shared layer cannot import from entities layer',
            },
          ],
        },
      ],
    },
  },
  {
    // FSD Layer Rules: entities layer cannot import from upper layers
    files: ['**/src/entities/**/*.ts', '**/src/entities/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*'],
              message: 'entities layer cannot import from app layer',
            },
            {
              group: ['@/pages', '@/pages/*'],
              message: 'entities layer cannot import from pages layer',
            },
            {
              group: ['@/widgets', '@/widgets/*'],
              message: 'entities layer cannot import from widgets layer',
            },
            {
              group: ['@/features', '@/features/*'],
              message: 'entities layer cannot import from features layer',
            },
          ],
        },
      ],
    },
  },
  {
    // Next pages routing-only: cannot import from FSD layers
    files: ['**/pages/**/*.ts', '**/pages/**/*.tsx'],
    ignores: ['**/src/pages/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/shared', '@/shared/*'],
              message: 'Next pages should only import from @/pages (routing-only)',
            },
            {
              group: ['@/entities', '@/entities/*'],
              message: 'Next pages should only import from @/pages (routing-only)',
            },
            {
              group: ['@/features', '@/features/*'],
              message: 'Next pages should only import from @/pages (routing-only)',
            },
            {
              group: ['@/widgets', '@/widgets/*'],
              message: 'Next pages should only import from @/pages (routing-only)',
            },
          ],
        },
      ],
    },
  },
];
