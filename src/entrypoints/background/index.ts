import { store } from '@/utils/storage.ts';

export default defineBackground(() => {
  const onContextMenuListener = async (info: any, tab: any) => {
    const prompts = await store.prompts.getValue();
    const prompt = prompts.find((prompt) => prompt.id === info.menuItemId);
    if (prompt) {
      if (!tab) {
        return;
      }
      sendMessage('qqClickOnSelection', prompt, tab.id).catch(console.error);
    }
  };

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

    browser.contextMenus.onClicked.removeListener(onContextMenuListener);
    browser.contextMenus.onClicked.addListener(onContextMenuListener);
  }

  buildMenuPrompts().catch(console.error);

  const unwatchPrompts = store.prompts.watch((newValue) => {
    browser.contextMenus.removeAll().then(() => {
      buildMenuPrompts().catch(console.error);
    });
  });
});