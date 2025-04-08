import typescriptEslint from 'typescript-eslint';
import {
  eslintFiles,
  eslintIgnore,
  eslintPluginImportConfig,
  eslintPluginsConfig,
  eslintSettings,
  getDirectoriesToSort,
  jsEslint,
  typescriptEslintConfig,
  typescriptEslintConfigRecommended,
} from './eslint.config.mjs';

const config = typescriptEslint.config(
  {
    ignores: eslintIgnore,
    files: eslintFiles,
  },
  { ...typescriptEslintConfig },
  typescriptEslintConfigRecommended,
  jsEslint,
  eslintPluginImportConfig,
  {
    plugins: eslintPluginsConfig,
    rules: {
      // Security rules - keeping only basic ones
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'error',

      // Security rules - extendend
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-object-injection': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-bidi-characters': 'error',

      // Import rules
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/first': 'error',
      'import/no-cycle': 'error',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Basic security rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        'warn',
        {
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],

      // Console rules
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

      // TypeScript rules
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Simplified import sorting
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
          pathGroups: [
            ...getDirectoriesToSort().map((singleDir) => ({
              pattern: `${singleDir}/**`,
              group: 'internal',
            })),
            {
              pattern: 'env',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    settings: eslintSettings,
  },
);

export default config;
