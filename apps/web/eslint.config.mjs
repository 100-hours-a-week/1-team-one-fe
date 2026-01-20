import { nextJsConfig } from '@tooling/eslint-config/next';
import { defineConfig } from 'eslint/config';

const eslintConfig = defineConfig([...nextJsConfig]);

export default eslintConfig;
