import eslint from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginSecurity from 'eslint-plugin-security';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import * as fs from 'fs';
import path from 'path';
import * as typescriptEslint from 'typescript-eslint';

export const eslintIgnore = [
  'node_modules/',
  'dist/',
  'coverage/',
  '*.min.js',
  '*.d.ts',
  'tools/*',
  '.sum/*',
  'eslint.config.mjs',
  'eslint.config.strict.mjs',
  'package.json',
  'prettier.config.js',
  'tsconfig.json',
  '.husky',
  '.commitlintrc.js',
  '.releaserc.js',
  'tools/ngrok-auth.js',
];

export const eslintFiles = ['./src/**/*.+(js|ts)', './**/*.test.+(js|ts)'];

export const typescriptEslintConfig = {
  languageOptions: {
    parser: typescriptEslint.parser,
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: process.cwd(),
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  ignores: eslintIgnore,
};

export const jsEslint = {
  files: ['*.js', '*.mjs'],
  ignores: ['eslint.config.mjs', 'eslint.config.strict.mjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};

export const eslintPluginImportConfig = {
  ...(eslintPluginImport.flatConfigs?.recommended || {}),
};

export const eslintPluginsConfig = {
  'unused-imports': eslintPluginUnusedImports,
  security: eslintPluginSecurity,
  import: eslintPluginImport,
};

export const eslintSettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './tsconfig.json',
    },
    node: true,
  },
};

export const typescriptEslintConfigRecommended =
  typescriptEslint.configs.recommendedTypeChecked;

export function getDirectoriesToSort() {
  const ignoredSortingDirectories = [
    'node_modules',
    '.git',
    '.vscode',
    'dist',
    'coverage',
  ];
  try {
    return fs
      .readdirSync(process.cwd())
      .filter((file) => {
        try {
          return fs.statSync(path.join(process.cwd(), file)).isDirectory();
        } catch (error) {
          return false;
        }
      })
      .filter((f) => !ignoredSortingDirectories.includes(f));
  } catch {
    return [];
  }
}

export default typescriptEslint.config(
  {
    files: ['**/*.ts', '**/*.tsx'],
    ...typescriptEslintConfig,
    ignores: eslintIgnore,
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommendedTypeChecked,
  {
    plugins: {
      ...eslintPluginsConfig,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
      'security/detect-eval-with-expression': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'no-eval': 'warn',
      'no-implied-eval': 'warn',
      'no-new-func': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',
      'import/first': 'warn',
      'import/no-cycle': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'warn',
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
            ...getDirectoriesToSort().map((dir) => ({
              pattern: `${dir}/**`,
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
