import {
  Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ApiKeyForm } from '@/entrypoints/options/apiKeyForm.tsx';

interface CustomDialogProps {
  apiKey: ApiKey | null;
  setApiKey: (key: ApiKey) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditKeyDialog({
  apiKey,
  setApiKey,
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
          <DialogTitle>Edit Api Key</DialogTitle>
          <DialogDescription>
            Make changes to your api key here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <ApiKeyForm submitText="Save changes" apiKey={apiKey} setApiKey={setApiKey} onExternalSubmit={handleSave} />

        <DialogFooter>
          <DialogClose asChild onClick={() => setOpen(false)}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}