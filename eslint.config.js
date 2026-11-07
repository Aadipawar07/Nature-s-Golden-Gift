import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', 'plan.tmp.txt'] },
  js.configs.recommended,
  {
    files: ['apps/**/*.js', 'apps/**/*.jsx'],
    languageOptions: { globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  {
    files: ['server/**/*.js', 'packages/**/*.js'],
    languageOptions: { globals: globals.node, sourceType: 'module' },
    rules: { 'no-console': 'off' }
  }
];
