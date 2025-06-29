import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmAction({
  open,
  setOpen,
  onConfirm,
}: CustomAlertDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}