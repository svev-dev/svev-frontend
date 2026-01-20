import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      'node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '*.log',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      eqeqeq: 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "PropertyDefinition[accessibility='private']",
          message:
            "Use native JavaScript private fields (#field) instead of the 'private' keyword.",
        },
        {
          selector:
            "MethodDefinition[accessibility='private']:not(MethodDefinition[kind='constructor'])",
          message:
            "Use native JavaScript private methods (#method) instead of the 'private' keyword.",
        },
        {
          selector: "TSParameterProperty[accessibility='private']",
          message:
            'Native private fields cannot be used in constructor parameters. Move the declaration to a class field.',
        },
        {
          selector:
            "CallExpression[callee.name='effect']:not(VariableDeclarator > CallExpression[callee.name='effect']):not(AssignmentExpression > CallExpression[callee.name='effect'])",
          message: 'effect() must be assigned to a variable. Use: const dispose = effect(...)',
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-throw-literal': 'error',
      'no-return-assign': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-with': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'import/no-relative-packages': 'error',
      radix: 'error',
      yoda: 'error',
    },
  },
  // Allow relative imports from workspace root for config files
  {
    files: [
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/playwright.config.ts',
      '**/*.base.config.ts',
    ],
    rules: {
      'import/no-relative-packages': 'off',
    },
  },
  prettierConfig,
];
