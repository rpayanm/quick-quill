import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  qqClickOnSelection(prompt: Prompt): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();