import { config as nextJsConfig } from '@tooling/eslint-config/next';
import { config as base } from '@tooling/eslint-config/base';
import { defineConfig } from 'eslint/config';

const eslintConfig = defineConfig([...base, ...nextJsConfig]);

export default eslintConfig;
