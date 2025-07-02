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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea.tsx';
import { ApiKey, store } from '@/utils/storage.ts';
import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

interface CustomProps {
  apiKeys: ApiKey[],
  submitText?: string,
  prompt?: Prompt | null,
  setPrompt?: (prompt: Prompt) => void
  onExternalSubmit?: () => void
}

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  prompt: z.string().nonempty('Action is required'),
  apiKeyId: z.string().nonempty('API Key is required'),
});

export function PromptForm({
  apiKeys,
  submitText,
  prompt,
  setPrompt,
  onExternalSubmit,
}: CustomProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prompt?.name || '',
      prompt: prompt?.prompt || '',
      apiKeyId: prompt?.apiKeyId || '',
    },
  });

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    form.reset({
      name: '',
      prompt: '',
      apiKeyId: '',
    });
     if (onExternalSubmit) {
      if (setPrompt) {
        setPrompt({
          id: prompt?.id || store.getId(),
          name: formValues.name,
          prompt: formValues.prompt,
          apiKeyId: formValues.apiKeyId,
        });
      }
      onExternalSubmit();
    }
    else {
       let savedValues = await store.prompts.getValue();
       const copied = [...savedValues];
       const prompt = {
         ...formValues,
         id: store.getId(),
       };
       copied.push(prompt);
       await store.prompts.setValue(copied);
     }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="apiKeyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model / API Key</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}
                      defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="API Key"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {apiKeys.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {store.getMaskedApiKey(item)}
                    </SelectItem>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the prompt. It will be shown in the context menu.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <Textarea placeholder="Prompt" {...field} />
              <FormDescription>
                The prompt to be sent to the AI.
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