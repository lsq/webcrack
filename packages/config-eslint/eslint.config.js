import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '../..'); // 👈 项目根目录

export default tseslint.config(
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          resolve(root, 'apps/playground/tsconfig.json'),
          resolve(root, 'packages/webcrack/tsconfig.json')
      ], // ✅ 显式指定路径
        tsconfigRootDir: root,       // 关键！告诉解析器从哪里计算相对路径
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    ignores: ['**/*.js'],
  },
);
