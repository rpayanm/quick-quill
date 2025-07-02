import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { store } from '@/utils/storage.ts';
import { getProviders, getProviderByModelId } from '@/utils/providers.ts';

interface CustomProps {
  submitText?: string,
  apiKey?: ApiKey | null,
  setApiKey?: (key: ApiKey) => void
  onExternalSubmit?: () => void
}

const formSchema = z.object({
  apiKey: z.string().nonempty('API Key is required'),
  model: z.string().nonempty('Model is required'),
});

export function ApiKeyForm({
  submitText,
  apiKey,
  setApiKey,
  onExternalSubmit,
}: CustomProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: apiKey?.apiKey || '',
      model: apiKey?.model || '',
    },
  });

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    form.reset({
      apiKey: '',
      model: '',
    });

    if (onExternalSubmit) {
      if (setApiKey) {
        setApiKey({
          id: apiKey?.id || store.getId(),
          apiKey: formValues.apiKey,
          model: formValues.model,
        });
      }
      onExternalSubmit();
    }
    else {
      let savedValues = await store.apiKeys.getValue();
      const copied = [...savedValues];
      const apiKey: ApiKey = {
        ...formValues,
        id: store.getId(),
      };
      copied.push(apiKey);
      await store.apiKeys.setValue(copied);
    }
  }

  const providers = getProviders();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}
                      defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(providers).map(([providerKey, provider]) => (
                    <SelectGroup key={providerKey}>
                      <SelectLabel>{provider.name}</SelectLabel>
                      {provider.models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the model.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="API Key" {...field} />
              </FormControl>
              <FormDescription>
                This is your API key.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        {submitText ?
          <Button className="w-full"
                  type="submit">{submitText}</Button> :
          <Button type="submit">Add</Button>
        }
      </form>
    </Form>
  );
}