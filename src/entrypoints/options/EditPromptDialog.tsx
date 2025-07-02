import {
  Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ApiKeyForm } from '@/entrypoints/options/apiKeyForm.tsx';
import { PromptForm } from '@/entrypoints/options/promptForm.tsx';

interface CustomDialogProps {
  apiKeys: ApiKey[];
  prompt: Prompt | null;
  setPrompt: (prompt: Prompt) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditPromptDialog({
  apiKeys,
  prompt,
  setPrompt,
  open,
  setOpen,
}: CustomDialogProps) {
  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
          <DialogDescription>
            Make changes to your prompt here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <PromptForm apiKeys={apiKeys} submitText="Save changes" prompt={prompt} setPrompt={setPrompt} onExternalSubmit={handleSave} />

        <DialogFooter>
          <DialogClose asChild onClick={() => setOpen(false)}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}