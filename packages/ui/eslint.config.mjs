import { config as reactConfig } from '@tooling/eslint-config/react-internal';
import { config as base } from '@tooling/eslint-config/base';
import { defineConfig } from 'eslint/config';

const eslintConfig = defineConfig([...base, ...reactConfig]);

export default eslintConfig;
