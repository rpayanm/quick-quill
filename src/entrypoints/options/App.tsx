import { ApiKeyForm } from '@/entrypoints/options/apiKeyForm.tsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { ItemSortable } from './ItemSortable.tsx';
import { PromptForm } from './promptForm.tsx';
import { Prompt, ApiKey, store } from '@/utils/storage';
import { ConfirmAction } from '@/entrypoints/options/ConfirmAction.tsx';
import { EditKeyDialog } from '@/entrypoints/options/EditKeyDialog.tsx';
import { EditPromptDialog } from '@/entrypoints/options/EditPromptDialog.tsx';

function App() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  useEffect(() => {
    async function fetchApiKeys() {
      await store.apiKeys.getValue().then((values) => {
        setApiKeys(values);
      });
    }

    fetchApiKeys().catch(console.error);
  }, []);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  useEffect(() => {
    async function fetchPrompt() {
      await store.prompts.getValue().then((values) => {
        setPrompts(values);
      });
    }

    fetchPrompt().catch(console.error);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const handleOpenDialog = (
    confirmAction: () => void,
  ) => {
    setOnConfirm(() => confirmAction); // Importante: function, no resultado
    setOpenConfirmDialog(true);
  };

  const [openEditKeyDialog, setOpenEditKeyDialog] = useState(false);

  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    async function updateApiKey() {
      if (editingApiKey != null) {
        let savedValues = await store.apiKeys.getValue();
        const copied = [...savedValues];
        const apiKey: ApiKey|undefined = copied.find((item) => item.id === editingApiKey.id);
        if (apiKey) {
          apiKey.apiKey = editingApiKey.apiKey;
          apiKey.model = editingApiKey.model;
          const index = copied.indexOf(apiKey);
          if (index !== -1) {
            copied[index] = apiKey;
          }
          await store.apiKeys.setValue(copied);
        }
      }
    }

    updateApiKey().catch(console.error);
  }, [editingApiKey]);

  const [openEditPromptDialog, setOpenEditPromptDialog] = useState(false);

  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    async function updatePrompt() {
      if (editingPrompt != null) {
        let savedValues = await store.prompts.getValue();
        const copied = [...savedValues];
        const prompt: Prompt|undefined = copied.find((item) => item.id === editingPrompt.id);
        if (prompt) {
          prompt.apiKeyId = editingPrompt.apiKeyId;
          prompt.name = editingPrompt.name;
          prompt.prompt = editingPrompt.prompt;
          const index = copied.indexOf(prompt);
          if (index !== -1) {
            copied[index] = prompt;
          }
          await store.prompts.setValue(copied);
        }
      }
    }

    updatePrompt().catch(console.error);
  }, [editingPrompt]);

  const unwatchApiKeys = store.apiKeys.watch((newValue) => {
    setApiKeys(newValue);
  });

  const unwatchPrompts = store.prompts.watch((newValue) => {
    setPrompts(newValue);
  });

  return (
    <>
      <div className="prose p-4">
        <h1>Options</h1>

        <ConfirmAction
          open={openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          onConfirm={onConfirm}
        />

        <EditKeyDialog
          apiKey={editingApiKey}
          setApiKey={setEditingApiKey}
          open={openEditKeyDialog}
          setOpen={setOpenEditKeyDialog}
        />

        <EditPromptDialog
          apiKeys={apiKeys}
          prompt={editingPrompt}
          setPrompt={setEditingPrompt}
          open={openEditPromptDialog}
          setOpen={setOpenEditPromptDialog}
        />

        <h2>API keys</h2>
        <div className="not-prose">
          <div className="mb-6">
            <ApiKeyForm/>
          </div>
        </div>

        <h3>Models / API keys</h3>
        <div className="not-prose">
          <div className="mb-6">
            {apiKeys.length === 0 && <p>No API keys found.</p>}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={apiKeysHandleDragEnd}>
              <SortableContext
                items={apiKeys}
                strategy={verticalListSortingStrategy}>
                {apiKeys.map(item => <ItemSortable key={item.id} id={item.id}
                                                   onEdit={handleEditApiKey}
                                                   body={store.getMaskedApiKey(item)}
                                                   onRemove={() => handleOpenDialog(() => handleRemoveApiKey(item.id))}/>)}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <h2>Add new prompt</h2>
        <div className="not-prose">
          <div className="mb-6">
            <PromptForm apiKeys={apiKeys} />
          </div>
        </div>

        <h2>Prompts</h2>
        {prompts.length === 0 && <p>No prompts found.</p>}
        <div className="not-prose">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={PromptsHandleDragEnd}>
            <SortableContext
              items={prompts}
              strategy={verticalListSortingStrategy}>
              {prompts.map(item => <ItemSortable key={item.id} id={item.id}
                                                 onEdit={handleEditPrompt}
                                                 body={item.name + ' - ' + item.prompt}
                                                 onRemove={() => handleOpenDialog(() => handleRemovePrompt(item.id))}/>)}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );

  function apiKeysHandleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setApiKeys((apiKeys) => {
        const oldIndex = apiKeys.findIndex((item) => item.id === active.id);
        const newIndex = apiKeys.findIndex((item) => item.id === over.id);

        const newApiKeys = arrayMove(apiKeys, oldIndex, newIndex);
        store.apiKeys.setValue(newApiKeys).catch(console.error);
        return newApiKeys;
      });
    }
  }

  function PromptsHandleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPrompts((prompts) => {
        const oldIndex = prompts.findIndex((item) => item.id === active.id);
        const newIndex = prompts.findIndex((item) => item.id === over.id);

        const newPrompts = arrayMove(prompts, oldIndex, newIndex);
        store.prompts.setValue(newPrompts).catch(console.error);
        return newPrompts;
      });
    }
  }

  function handleRemoveApiKey(id: string) {
    setApiKeys((apiKeys) => {
      const newApiKeys = apiKeys.filter((item) => item.id !== id);
      store.apiKeys.setValue(newApiKeys).catch(console.error);
      return newApiKeys;
    });
  }

  function handleRemovePrompt(id: string) {
    setPrompts((prompts) => {
      const newPrompts = prompts.filter((item) => item.id !== id);
      store.prompts.setValue(newPrompts).catch(console.error);
      return newPrompts;
    });
  }

  function handleEditApiKey(id: string) {
    const copied = [...apiKeys];
    const apiKey = copied.find((item) => item.id === id);
    if (apiKey) {
      setEditingApiKey(apiKey);
      setOpenEditKeyDialog(true);
    }
  }

  function handleEditPrompt(id: string) {
    const copied = [...prompts];
    const prompt = copied.find((item) => item.id === id);
    if (prompt) {
      setEditingPrompt(prompt);
      setOpenEditPromptDialog(true);
    }
  }
}

export default App;
