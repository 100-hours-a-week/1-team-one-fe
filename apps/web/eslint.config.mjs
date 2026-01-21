import { config as base } from '@tooling/eslint-config/base';
import { config as nextJsConfig } from '@tooling/eslint-config/next';
import { defineConfig } from 'eslint/config';

const eslintConfig = defineConfig([...base, ...nextJsConfig]);

export default eslintConfig;
