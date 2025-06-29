import { nanoid } from 'nanoid';

export interface ApiKey {
  id: string;
  apiKey: string;
  model: string;
}

export interface Prompt {
  id: string;
  name: string;
  prompt: string;
  apiKeyId: string;
}

const apiKeys = storage.defineItem<ApiKey[]>(
  'local:apiKeyId',
  {
    fallback: [],
  },
);

const getId = () => {
  return nanoid();
};

const getMaskedApiKey = (item: ApiKey) => {
  return item.model + ' - ' +
    (item.apiKey.length <= 4
      ? item.apiKey
      : '*****' + item.apiKey.slice(-4));
};

const prompts = storage.defineItem<Prompt[]>(
  'local:prompts',
  {
    fallback: [],
  },
);

export const store = {
  apiKeys,
  getId,
  getMaskedApiKey,
  prompts,
};