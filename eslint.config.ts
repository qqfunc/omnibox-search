import * as path from 'node:path'
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import css from '@eslint/css'

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, '.gitignore'), 'Imported .gitignore patterns'),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, stylistic },
    extends: [js.configs.recommended, stylistic.configs.recommended],
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    plugins: { tseslint },
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { pluginReact },
    extends: [pluginReact.configs.flat.recommended],
  },
  {
    files: ['**/*.json'],
    ignores: ['**/package-lock.json', '**/tsconfig.json', '.vscode/*.json', '.renovaterc.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.jsonc', '**/tsconfig.json', '.vscode/*.json', '.renovaterc.json'],
    plugins: { json },
    language: 'json/jsonc',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: [markdown.configs.recommended],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: [css.configs.recommended],
  },
])
