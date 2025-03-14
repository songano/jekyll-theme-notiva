import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  prettierPluginRecommended,
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ['**/dist/**', '**node_modules**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'arrow-body-style': ['warn', 'as-needed'],
    },
  },
];
