import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  srcDir: 'src',
  publicDir: 'src/public',
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Quick Quill',
    description: 'Execute an AI prompt over a selected text.',
    permissions: ['storage', 'contextMenus', '<all_urls>'],
  },
  webExt: {
    startUrls: ['https://translate.google.com/'],
  },
});
