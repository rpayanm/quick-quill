import '@/assets/styles/globals.css';
import './style.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { App } from '@/entrypoints/content/App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'quick-quill',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = document.createElement('div');
        app.id = 'quick-quill-root';
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<App/>);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});