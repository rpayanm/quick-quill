import { generateText } from 'ai';
import { getObject, getProviderByModelId } from '@/utils/providers.ts';

const getResponse = async (selectedText: string, prompt: Prompt) => {
  let response = '';
  const apiKeys = await store.apiKeys.getValue();
  const apiKey = apiKeys.find((apiKey) => apiKey.id === prompt.apiKeyId);

  if (!apiKey) {
    return 'The prompt ' + prompt.name + ' is not associated with any API Key. Please add an API Key to the prompt.';
  }

  let system = prompt.prompt;
  if (system[length - 1] !== '.') {
    system = system + '.';
  }
  system += ' I want you to give me only the answer and nothing else, do not write explanations.';

  const provider = getProviderByModelId(apiKey.model);
  const aiObject = getObject(provider, apiKey.apiKey);

  const result = await generateText({
    model: aiObject(apiKey.model),
    system: system,
    prompt: `The text is "${selectedText}"`,
  });
  response = result.text;

  return response;
};

export default getResponse;