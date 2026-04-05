import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const legacyConfig = compat.config({
  extends: [
    'prettier',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['prettier', 'jsx-a11y', 'react-hooks', '@typescript-eslint', 'import'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unnecessary-type-constraint': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react/jsx-key': 'error',
    'import/prefer-default-export': 0,
    'react/state-in-constructor': 0,
    'no-unused-vars': ['error', { args: 'after-used' }],
    'no-await-in-loop': 0,
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['^draft'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
})

export default [
  {
    ignores: ['dist'],
  },
  ...legacyConfig.map((config) => ({
    ...config,
    files: ['**/*.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
]
