import { AddApiKeyForm } from '@/entrypoints/options/AddApiKeyForm.tsx';
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
import { AddPromptForm } from './AddPromptForm.tsx';
import { Prompt, ApiKey, store } from '@/utils/storage';
import { ConfirmAction } from '@/entrypoints/options/ConfirmAction.tsx';

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

        <h2>API keys</h2>
        <div className="not-prose">
          <div className="mb-6">
            <AddApiKeyForm/>
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
                                                           body={store.getMaskedApiKey(item)}
                                                           onRemove={() => handleOpenDialog(() => handleRemoveApiKey(item.id))}/>)}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <h2>Add new prompt</h2>
        <div className="not-prose">
          <div className="mb-6">
            <AddPromptForm apiKeys={apiKeys}/>
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
}

export default App;
