import { store } from '@/utils/storage.ts';

export default defineBackground(() => {
  async function buildMenuPrompts() {
    const prompts = await store.prompts.getValue();

    if (prompts.length !== 0) {
      prompts.forEach((prompt) => {
        browser.contextMenus.create({
          id: prompt.id,
          title: prompt.name,
          contexts: ['selection'],
        });
      });
    }

    browser.contextMenus.onClicked.addListener((info, tab) => {
      const prompt = prompts.find((prompt) => prompt.id === info.menuItemId);
      if (prompt) {
        if (!tab) {
          return;
        }
        sendMessage('qqClickOnSelection', prompt, tab.id).catch(console.error);
      }
    });
  }

  buildMenuPrompts().catch(console.error);

  const unwatchPrompts = store.prompts.watch((newValue) => {
    browser.contextMenus.removeAll().then(() => {
      buildMenuPrompts().catch(console.error);
    });
  });
});