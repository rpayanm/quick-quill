import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

interface Model {
  id: string;
  label: string;
}

interface Providers {
  [provider: string]: {
    name: string;
    models: Model[];
  };
}

const providers: Providers = {
  openai: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4.1-nano', label: 'GPT-4.1 nano' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    ],
  },
  google: {
    name: 'Google',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    ],
  },
};

const getProviders = (): Providers => {
  return providers;
};

function getProviderByModelId(id: string): string {
  const providers = getProviders();
  let provider_id = '';
  for (const provider in providers) {
    if (providers[provider].models.some(model => model.id === id)) {
      provider_id = provider;
    }
  }

  return provider_id;
}

const getObject = (provider: string, apiKey: string): any => {
  if (provider === 'openai') {
    return createOpenAI({
      apiKey: apiKey,
    });
  } else if (provider === 'google') {
    return createGoogleGenerativeAI({
      apiKey: apiKey,
    });
  }

  return false;
}


export {
  getProviders,
  getProviderByModelId,
  getObject,
};