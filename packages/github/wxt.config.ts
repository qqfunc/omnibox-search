import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  // imports: false,
  modules: ['@wxt-dev/webextension-polyfill'],
  manifest: {
    name: 'Omnibox Search for GitHub',
    short_name: 'Search GitHub',
    omnibox: { keyword: '@gh' },
  },
})
