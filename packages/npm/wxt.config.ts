import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    name: 'Omnibox Search for npm',
    short_name: 'Search npm',
    omnibox: { keyword: '@npm' },
  },
  modules: ['@wxt-dev/webextension-polyfill'],
})
