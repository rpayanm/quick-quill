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
    description: 'A browser extension that allows you to execute AI prompts on selected text directly in your browser.',
    permissions: ['storage', 'contextMenus', '<all_urls>'],
  },
});
